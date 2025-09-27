import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView,Platform, View,StyleSheet} from "react-native";
import {Text,TextInput,Button,useTheme} from 'react-native-paper';

export default function AuthScreen(){
    const [isSignUp , setIsSignUp] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword ] = useState<string>("");
    const [error,setError] = useState<string | null>(null);
 
    const theme = useTheme();
    const router= useRouter();
    const {signIn,signUp} = useAuth();

    const handleSwitchMode = () =>{
        setIsSignUp((prev) => !prev)
    }

    const handleAuth = async()=>{
        if(!email || !password){
            setError("Please fill out all fields.")
           return;
        }

        if(password.length<6){
            setError("Passwords must be longer than 6 characters")
            return;
        }
       setError(null)

       if(isSignUp){
        const error = await signUp(email,password)
        if(error){
            setError(error)
            return;
        }
       }else{
        const error = await signIn(email,password)
        if(error){
            setError(error)
            return;
        }
        router.replace("/");
       }
    }
    return <KeyboardAvoidingView 
    behavior={Platform.OS==="ios" ? "padding" : "height" }
    style={styles.container}>

        <View style={styles.content}>
            <Text style={styles.title} variant="headlineMedium"> {isSignUp ? "Create Account" : "Welcome Back!"}  </Text>

            <TextInput label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="example@gmail.com"
            mode="outlined"
            style={styles.input}
            onChangeText={setEmail} 
            />

            <TextInput label="Password"
            autoCapitalize="none"
            keyboardType="email-address"
            mode="outlined"
            secureTextEntry
            style={styles.input}
            onChangeText={setPassword} 
            />
            {error && <Text style={{color:theme.colors.error}}>
                {error}
            </Text> }

            <Button mode= "contained" onPress={handleAuth} style={styles.button}>{isSignUp ?  "Sign Up" : "Sign In"}</Button>
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