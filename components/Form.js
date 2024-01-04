import React, { useState } from "react";
import { View, Text, Image} from "react-native";
import { Input } from "react-native-elements";
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
            <SelectDropdown data={conditions} />
		</View>
	);
};

export default Form;
