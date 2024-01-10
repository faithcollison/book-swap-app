import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Alert, StyleSheet, Image, ScrollView } from 'react-native';
import supabase from '../config/supabaseClient';
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('screen');

const Notifications = ({ route }) => {
    const [notifications, setNotifications] = useState([]);
    const { session, setNewNotif } = route.params;
    const [processedNotifications, setProcessedNotifications] = useState([]);

    const navigation = useNavigation();

    useEffect(() => {
        setNewNotif(false);
        async function loadNotifications() {
            const { data, error } = await supabase.from('Notifications').select().eq('user_id', session.user.id);
            return data;
        }

        loadNotifications().then(res => {
            setNotifications(res);
        });
    }, [notifications]);

    async function getNotifications(length) {
        const { data, error } = await supabase.from('Notifications').select().eq('user_id', session.user.id);

        if (data.length > length) {
            setNewNotif(true);
        }

        return data;
    }

    const deleteNotification = async notificationId => {
        try {
            const { error } = await supabase.from('Notifications').delete().eq('id', notificationId);
        } catch (error) {
            console.log(error);
        }
    };

    const handlePostgresChanges = async () => {
        const length = notifications.length;
        const res = await getNotifications(length);
        setNotifications(res);
    };

    const getSwapInfo = async id => {
        const { data, error } = await supabase.from('Pending_Swaps').select().eq('pending_swap_id', id);

        return data[0];
    };

    const getUserInfo = async id => {
        const { data, error } = await supabase.from('Users').select().eq('user_id', id);

        return data[0];
    };

    supabase.channel('Notifications').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Notifications' }, handlePostgresChanges).subscribe();

    function daysSince(dateString) {
        const notificationDate = new Date(dateString);
        const currentDate = new Date();
        const timeDifference = currentDate - notificationDate;
        const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        return daysPassed;
    }

    useEffect(() => {
        Promise.all(
            notifications.map(async notification => {
                switch (notification.type) {
                    case 'Swap_Request':
                        if (notification.swap_offer_id) {
                            const swapData = await getSwapInfo(notification.swap_offer_id);
                            return {
                                ...notification,
                                swapData,
                            };
                        }
                        break;
                    case 'Chosen_Book':
                        if (notification.user_id) {
                            const swapData = await getUserInfo(notification.user_id);
                            return {
                                ...notification,
                                swapData,
                            };
                        }
                        break;
                    default:
                        return notification;
                }
            })
        ).then(newNotifications => {
            setProcessedNotifications(newNotifications);
        });
    }, [notifications]);

    return (
        <ScrollView style={styles.scroll}>
            <View style={styles.page}>
                <View style={styles.notificationsList}>
                    {processedNotifications.map(notification => {
                        switch (notification.type) {
                            case 'Swap_Request':
                                if (notification.swapData) {
                                    return (
                                        <Pressable
                                            style={styles.notCard}
                                            onPress={() => {
                                                if (Object.entries(notification.swapData).every(([key, value]) => !!value)) {
                                                    navigation.navigate('SwapNegotiationPage', {
                                                        info: notification.swapData,
                                                        user1_book: notification.swapData,
                                                        user2_book: notification.swapData,
                                                    });
                                                } else {
                                                    navigation.navigate('SwapOffer', {
                                                        info: notification.swapData,
                                                    });
                                                }
                                            }}
                                        >
                                            <Text>{daysSince(notification.created_at)} days ago</Text>
                                            <View style={styles.contentsMain}>
                                                <Image
                                                    source={{
                                                        uri: notification.swapData.user1_book_imgurl,
                                                    }}
                                                    style={styles.bookImage}
                                                />
                                                <View style={styles.textContainer}>
                                                    <Text style={styles.notText}>{notification.swapData.user2_username + ' wants to swap ' + notification.swapData.user1_book_title}</Text>
                                                </View>
                                            </View>
                                            <Entypo
                                                name="circle-with-cross"
                                                size={24}
                                                color="#C2C2C2"
                                                onPress={() => deleteNotification(notification.id)}
                                                style={styles.deleteButton}
                                            />
                                        </Pressable>
                                    );
                                }
                                break;
                            case 'Chosen_Book':
                                if (notification.swapData) {
                                    return (
                                        <Pressable
                                            style={styles.notCard}
                                            onPress={() => {
                                                navigation.navigate('SwapNegotiationPage', {
                                                    info: notification.swapData,
                                                });
                                            }}
                                        >
                                            <Text style={styles.date}>{daysSince(notification.created_at)} days ago</Text>
                                            <View style={styles.contentsMain}>
                                                <Text style={styles.notText}>{`${notification.username} has chosen ${notification.swapData.user2_book_title} from your library`}</Text>
                                            </View>
                                            <Entypo
                                                name="circle-with-cross"
                                                size={24}
                                                color="#C2C2C2"
                                                onPress={() => deleteNotification(notification.id)}
                                                style={styles.deleteButton}
                                            />
                                        </Pressable>
                                    );
                                }
                                break;
                            default:
                                return null;
                        }
                    })}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scroll: {
        backgroundColor: '#272727',
    },
    page: {
        flex: 1,
        alignItems: 'center',
    },
    notificationsList: {
        width: width * 0.9,
    },
    notCard: {
        backgroundColor: '#464646',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        marginTop: 20,
        padding: 10,
    },
    contentsMain: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: width * 0.9 - 20,
        height: 90,
        maxWidth: width * 0.9 - 20,
    },
    bookImage: {
        height: 90,
        width: 60,
        borderRadius: 6,
        // marginRight: 20,
    },
    notText: {
        color: '#C2C2C2',
        width: width * 0.9 * 0.9 * 0.8,
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    deleteButton: {
        position: 'absolute',
        right: 8,
        top: 7,
    },
    date: {
        color: '#C2C2C2',
        position: 'absolute',
        left: 8,
        top: 7,
    },
});

export default Notifications;
