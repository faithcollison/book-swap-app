import React, { useState } from "react";
import { View, Text, TextInput, Image} from "react-native";
import { Button, Input } from "react-native-elements";
import SelectDropdown from 'react-native-select-dropdown';

const Form = ({route}) => {
   const {title, authors, description, imgUrl} = route.params
   const [category, setCategory] = useState("")
   
    const conditions = ['Good', 'Excellent', 'Fair', 'Poor'];

	return (
		<View>
			<Text>You're in the Form screen!</Text>
            <Input  label="Title"
                placeholder="Book title"
                autoCapitalize={"none"}
                value={title? title : ""}
            />
            <Input  label="Description"
                placeholder="Description"
                autoCapitalize={"none"}
                value={description? description : ""}
            />
            <Input  label="Author"
                placeholder="Author"
                autoCapitalize={"none"}
                value={authors? authors : ""}
            />
            <Input  label="Category"
                placeholder="Book category"
                autoCapitalize={"none"}
                value={category}
                onChangeText={setCategory}
            />
            <Image source={{uri: imgUrl}} style={{width: 200, height: 200}}/>
            <SelectDropdown data={conditions} onSelect={(selectedItem, index) => {
         console.log(selectedItem, index);
       }}
       buttonTextAfterSelection={(selectedItem, index) => {
         // text represented after item is selected
         return selectedItem;
       }}
       rowTextForSelection={(item, index) => {
         // text represented for each item in dropdown
         return item;
       }} />
		</View>
	);
};

export default Form;
