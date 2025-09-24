import { Text, View } from "react-native";
import { Link } from "expo-router";
import { StyleSheet } from 'react-native';

export default function Index() {
  return (
    <View style={styles.view}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Home Screen</Text>

      
      
    </View>
  );
}

const styles = StyleSheet.create({
  view:{
    flex: 1,
     justifyContent: "center",
      alignItems: "center" 
  },
  navButton:{
    width:100,
        height:20,
        backgroundColor:"coral",
        borderRadius:8,
        textAlign:"center"
  }
})

