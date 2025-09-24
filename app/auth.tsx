import { useState } from "react";
import { KeyboardAvoidingView,Platform, View,StyleSheet} from "react-native";
import {Text,TextInput,Button} from 'react-native-paper';

export default function AuthScreen(){
    const [isSignUp , setIsSignUp] = useState<boolean>(false);

    const handleSwitchMode = () =>{
        setIsSignUp((prev) => !prev)
    }
    return <KeyboardAvoidingView 
    behavior={Platform.OS==="ios" ? "padding" : "height" }
    style={styles.container}>

        <View style={styles.content}>
            <Text style={styles.title} variant="headlineMedium"> {isSignUp ? "Create Account" : "Welcome Back"}  </Text>

            <TextInput label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="example@gmail.com"
            mode="outlined"
            style={styles.input}
            />

            <TextInput label="Password"
            autoCapitalize="none"
            keyboardType="email-address"
            mode="outlined"
            style={styles.input}
            />
            <Button mode= "contained" style={styles.button}>{isSignUp ?  "Sign Up" : "Sign In"}</Button>
            <Button mode= "text" onPress={handleSwitchMode} style={styles.switchModebutton}>{isSignUp ? "Already Have an Account? Sign In" : "Don't Have an Account? Sign Up"}</Button>
        </View>
    </KeyboardAvoidingView>
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#f5f5f4"
    },
    content:{
        flex:1,
        padding:16,
        justifyContent:"center"
    },
    title:{
        textAlign:"center",
        marginBottom:25,

    },

    input:{
        marginBottom:16

    },

    button:{
    marginTop:5
    },
    switchModebutton:{
        marginTop:16
    }

})