import { Text,  View } from "react-native";
import {Button, SegmentedButtons, TextInput} from 'react-native-paper'
import { StyleSheet } from "react-native";

const FREQUENCIES = ["Daily","Weekly","Monthly"]
export default function addHabitScreen() {
  return (
    <View style={styles.container}>
      <TextInput label="Title" mode="outlined" style={styles.input}></TextInput>
       <TextInput label="Description" mode="outlined" style={styles.input}></TextInput>
       
       <View style={styles.frequencyContainer}>
        <SegmentedButtons
       buttons={FREQUENCIES.map((freq)=>({
        value:freq,
        label:freq,
        style: { backgroundColor: "#2c7bb387",checkedColor:"#2072AF"},
        labelStyle: {fontWeight: "bold" ,color:"white"}
        
       }))}
       
       />
       </View>
       <Button style={{backgroundColor:"#2072AF"}}mode="contained" style={styles.addButton}>Add Habit</Button>
    </View>
  );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:16,
        backgroundColor:"#B9D9EB",
        justifyContent:"center"
    },
    input:{
        marginBottom:16
    },
     frequencyContainer:{
        marginBottom:24
    },
    
    addButton:{
        backgroundColor:"#2774AE",
        
    },
    


})