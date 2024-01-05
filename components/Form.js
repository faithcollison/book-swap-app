import React, { useState } from "react";
import { View, Text, Image} from "react-native";
import { Input } from "react-native-elements";
import SelectDropdown from 'react-native-select-dropdown';

const Form = ({route}) => {
   const {title, authors, description, imgUrl} = route.params || ""
   const [category, setCategory] = useState("")
   
    const conditions = ['Good', 'Excellent', 'Fair', 'Poor'];
    const categories = ['Romance', 'Sci-fi', 'Gothic', 'Action', 'Crime', 'Fantasy', 'Thriller']
console.log(title? false: true)
	return (
		<View>
			<Text>You're in the Form screen!</Text>
            <Input  label="Title"
                placeholder="Book title"
                autoCapitalize={"none"}
                editable={title? false : true}
                value={title? title : ""}
            />
            <Input  label="Description"
                placeholder="Description"
                autoCapitalize={"none"}
                editable={description? false : true}
                value={description? description : ""}
            />
            <Input  label="Author"
                placeholder="Author"
                autoCapitalize={"none"}
                editable={authors? false : true}
                value={authors? authors : ""}
            />
            <Text> Choose Category: </Text>
            <SelectDropdown data={categories} />
            <Text> Choose Condition of Book: </Text>
            <SelectDropdown data={conditions} />
            <Image source={{uri: imgUrl}} style={{width: 200, height: 200}}/>
		</View>
	);
};

export default Form;
