import { Dimensions, Pressable, Text, View, StyleSheet, Image } from 'react-native';
import supabase from '../config/supabaseClient';
import { useEffect, useState } from 'react';
import { Input } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const userImageMap = {
    '2f71dabd-2f9c-48c3-8edd-4ae7495f59ce': require('../assets/ExampleUserProfilePictures/2f71dabd-2f9c-48c3-8edd-4ae7495f59ce.jpg'),
    'c563d513-b021-42f2-a3b3-77067b8547af': require('../assets/ExampleUserProfilePictures/c563d513-b021-42f2-a3b3-77067b8547af.jpg'),
    'a4624164-bbbb-4cb6-b199-06b2fdd6f14a': require('../assets/ExampleUserProfilePictures/a4624164-bbbb-4cb6-b199-06b2fdd6f14a.jpg'),
    '10240ee4-1b43-4749-afbe-1356c83af4da': require('../assets/ExampleUserProfilePictures/10240ee4-1b43-4749-afbe-1356c83af4da.jpg'),
    'ce083d4c-a1e8-45d0-9f93-6bc092f7155b': require('../assets/ExampleUserProfilePictures/ce083d4c-a1e8-45d0-9f93-6bc092f7155b.jpg'),
    'b45b3687-4e73-46e2-8474-da10e307691b': require('../assets/ExampleUserProfilePictures/b45b3687-4e73-46e2-8474-da10e307691b.jpg'),
};

export default function UserProfile({ route }) {
    const [id, setId] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState();
    const [editing, setIsEditing] = useState(false);
    const [exists, setExists] = useState(false);
    const [profilePicture, setProfilePicture] = useState();

    const { session } = route.params;

    useEffect(() => {
        async function compareId(id) {
            const { data, error } = await supabase.from('Users').select('*').match({ user_id: id });
            return data;
        }

        if (userImageMap.hasOwnProperty(session.user.id)) {
            setProfilePicture(userImageMap[session.user.id]);
        } else {
            console.log('no image found');
        }

        async function getData() {
            const { data, error } = await supabase.auth.getSession();
            const { session } = data;
            setUsername(session.user.user_metadata.username);
            setEmail(session.user.email);
            setId(session.user.id);
            return session.user.id;
        }
        getData()
            .then(id => {
                return compareId(id);
            })
            .then(data => {
                if (data.length > 0) {
                    setExists(true);
                    setUsername(data[0].username);
                    setEmail(data[0].email_address);
                    setPhone(data[0].phone_number);
                }
            });
    }, [session.user_id]);

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out: ', error);
        } else {
            useNavigation.replace('Login');
        }
    };

    async function sendNewData() {
        const { data, error } = await supabase
            .from('Users')
            .insert([{ username: username, email_address: email, phone_number: phone }])
            .select();
    }

    async function updateData(userid) {
        const { data, error } = await supabase.from('Users').select('*').eq('user_id', userid);
        if (data.length > 0) {
            await supabase
                .from('Users')
                .update({
                    username: username,
                    email_address: email,
                    phone_number: phone,
                })
                .eq('user_id', userid);
        } else {
            sendNewData();
        }
    }

    if (editing) {
        return (
            <View>
                <View>
                    <Text>Hi!!</Text>
                    <Input
                        title="Username"
                        placeholder="Username"
                        value={username}
                        onChangeText={text => {
                            setUsername(text);
                        }}
                    />
                </View>
                <View style={styles.edit_container}>
                    <Input
                        title="Email"
                        placeholder="Email"
                        value={email}
                        onChangeText={text => {
                            setEmail(text);
                        }}
                    />
                </View>
                <View>
                    <Input
                        title="Phone Number"
                        placeholder="+44.............."
                        value={phone}
                        inputMode="numeric"
                        onChangeText={text => {
                            setPhone(text);
                        }}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <Pressable
                        onPress={() => {
                            setIsEditing(false);
                            if (id) {
                                updateData(id);
                            } else {
                                sendNewData();
                            }
                        }}
                        style={styles.edit_button}
                    >
                        <AntDesign
                            name="save"
                            size={24}
                            color="black"
                        />
                    </Pressable>
                </View>
            </View>
        );
    }
    return (
        <View style={[styles.container, styles.background]}>
            <View>
                <View>
                    <LinearGradient
                        colors={['#307361', 'rgba(169, 169, 169, 0.10)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            borderRadius: 30,
                            alignItems: 'center',
                            height: screenHeight,
                        }}
                    >
                        <View>
                            <Text style={styles.username}>{username}</Text>
                        </View>
                        <Image
                            source={profilePicture}
                            style={styles.profilePicture}
                        />
                        <Text style={styles.contact_info}>Contact Info</Text>
                        <Text style={styles.title}>Email:</Text>
                        <Text style={styles.email}>{email}</Text>
                        <Text style={styles.title}>Mobile:</Text>
                        <Text style={styles.phone}>{phone}</Text>
                        <View style={styles.buttonContainer}>
                            <Pressable
                                onPress={() => {
                                    setIsEditing(true);
                                }}
                                style={styles.edit_button}
                            >
                                <AntDesign
                                    name="edit"
                                    size={24}
                                    color="black"
                                />
                            </Pressable>
                        </View>
                        <View style={styles.logout}>
                            <Pressable
                                onPress={() => {
                                    handleSignOut();
                                }}
                            >
                                <Text>Sign Out</Text>
                            </Pressable>
                        </View>
                    </LinearGradient>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: screenHeight,
        // display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    background: {
        backgroundColor: '#272727',
        height: screenHeight,
        width: screenWidth,
    },
    username: {
        marginLeft: 5,
        fontSize: 36,
        marginTop: 20,
        marginBottom: 20,
        textDecorationLine: 'underline',
        fontFamily: 'Bellefair_400Regular',
    },
    email: {
        fontSize: 24,
        marginLeft: 25,
        marginBottom: 20,
        fontFamily: 'Bellefair_400Regular',
    },
    phone: {
        fontSize: 24,
        marginLeft: 25,
        marginBottom: 7,
        fontFamily: 'Bellefair_400Regular',
    },
    edit_button: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 40,
        height: 40,
        borderRadius: 100,
        borderColor: 'grey',
        borderWidth: 2,
        padding: 4,
        alignItems: 'center',
    },
    buttonContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    contact_info: {
        marginLeft: 5,
        marginTop: 20,
        textDecorationLine: 'underline',
        fontSize: 34,
        marginBottom: 8,
        fontFamily: 'Bellefair_400Regular',
    },
    title: {
        marginLeft: 7,
        marginBottom: 7,
        fontSize: 24,
        fontFamily: 'Bellefair_400Regular',
    },
    edit_container: {
        marginTop: 30,
    },
    profilePicture: {
        width: 250,
        height: 250,
        borderRadius: 150,
    },
    logout: {
        border: '1px solid black',
        borderRadius: 5,
        padding: 5,
        marginTop: 30,
        backgroundColor: 'white',
    },
});
