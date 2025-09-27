import {  View } from "react-native";
import { Button, Text } from "react-native-paper";
import { Link } from "expo-router";
import { StyleSheet } from 'react-native';
import { useAuth } from "@/lib/auth-context";

export default function Index() {
  const {signOut}= useAuth()
  return (
    <View style={styles.view}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Home Screen</Text>
      <Button mode="text" onPress={signOut} icon="logout">Sign Out</Button>

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

