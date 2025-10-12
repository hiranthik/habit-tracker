import {  View } from "react-native";
import { Button, Surface, Text } from "react-native-paper";
import { Link } from "expo-router";
import { StyleSheet } from 'react-native';
import { useAuth } from "@/lib/auth-context";
import { client,COMPLETIONS_COLLECTION_ID,DATABASE_ID, databases, HABITS_COLLECTION_ID, RealTimeResponse } from "@/lib/appwrite";
import { ID, Query } from "react-native-appwrite";
import { Habit, HabitCompletion } from "@/types/database.type";
import { useEffect, useRef, useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ScrollView, Swipeable } from "react-native-gesture-handler";


export default function Index() {
  const {signOut,user}= useAuth();

  const [habits,setHabits] = useState<Habit[]>([])
  const [completedHabits,setCompletedHabits] = useState<string[]>()
  const swipeableRefs = useRef<{[key:string]:Swipeable|null}>({});

  useEffect(()=>{
    if(user){
    const channel = `databases.${DATABASE_ID}.collections.${HABITS_COLLECTION_ID}.documents`
    const habitSubscription = client.subscribe(channel,
      (response:RealTimeResponse)=>{
        if(response.events.includes("databases.*.collections.*.documents.*.create"))
      {
        fetchHabits();
      }
    else if(response.events.includes("databases.*.collections.*.documents.*.update"))
      {
        fetchHabits();
      }
    else if(response.events.includes("databases.*.collections.*.documents.*.delete"))
      {
        fetchHabits();
      }
    }
    ); 
    
    fetchHabits();
    fetchTodayCompletions();
    return () =>{
      habitSubscription();
    };
  }
  },[user])

  const fetchHabits = async() =>{
    try{
      const response = await databases.listDocuments(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        [Query.equal("user_id",user?.$id??"")]
      );
      console.log(response.documents)
      setHabits(response.documents as unknown as Habit[]);
    }
    catch(error){
      console.log(error)
    }
  }


  const fetchTodayCompletions = async() =>{
    try{
      const today = new Date()
      today.setHours(0,0,0,0)
      const response = await databases.listDocuments(
        DATABASE_ID,
        COMPLETIONS_COLLECTION_ID,
        [Query.equal("user_id",user?.$id??""),Query.greaterThanEqual("completed_at",today.toISOString())]
      );
      console.log(response.documents)

      const completions = response.documents as unknown as HabitCompletion[]
      setCompletedHabits(completions.map((c)=> c.habit_id));
    }
    catch(error){
      console.log(error)
    }
  }



  const handleDeleteHabit = async(id:string) =>{
    try{
      await databases.deleteDocument(DATABASE_ID,HABITS_COLLECTION_ID,id)
    }
    catch(error){
      console.log(error)
    }
  }

   const handleCompleteHabit = async(id:string) =>{
    if(!user ||completedHabits?.includes(id)) return;
    try{

      const currentDate = new Date().toISOString()
      await databases.createDocument(DATABASE_ID,COMPLETIONS_COLLECTION_ID,ID.unique(),{
        habit_id:id,
        user_id:user.$id,
        completed_at:new Date().toISOString()
      }
    
    );

    const habit = habits?.find((h)=>h.$id===id)
    if(!habit) return;

    await databases.updateDocument(DATABASE_ID,HABITS_COLLECTION_ID,id,{
      streak_count:habit.streak_count +1,
      last_completed:currentDate
    })


    }
    catch(error){
      console.log(error)
    }
  }


  const renderRightActions= () => (
    <View style={styles.swipeActionRight}>
      <MaterialCommunityIcons name="check-circle-outline" size={25} color={"#F0F8FF"}></MaterialCommunityIcons>
    </View>
  )

   const renderLeftActions= () => (
     <View style={styles.swipeActionLeft}>
      <MaterialCommunityIcons name="trash-can-outline" size={25} color={"#F0F8FF"}></MaterialCommunityIcons>
    </View>
  )

  return (
    <View style={styles.container}>
       <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>Today&apos;s Habits</Text>
        <Button mode="text" onPress={signOut} icon={"logout"}>
        Sign Out
        </Button>
       </View>

    <ScrollView showsVerticalScrollIndicator={false}>
       {habits?.length === 0 ? (
        <View style={styles.emptyState}> 
        <Text style={styles.emptyStateText}> No habits yet. Add your first habit.</Text>
        </View>
       ) :(
        habits?.map((habit,key)=> (
      // eslint-disable-next-line react/jsx-key
      <Swipeable ref={(ref)=>{
        swipeableRefs.current[habit.$id] = ref;
       
      }}
       key ={key}
       overshootLeft={false}
       overshootRight={false}
       renderLeftActions={renderLeftActions}
       renderRightActions={renderRightActions}
       onSwipeableOpen={(direction)=>{
        if(direction ==="left"){
          handleDeleteHabit(habit.$id);
        } else if(direction === "right"){
          handleCompleteHabit(habit.$id);
        }
        swipeableRefs.current[habit.$id]?.close();
       }}
       
       >
        <Surface key={key} style={styles.card} elevation={0}>
          <View key={key} style={styles.cardContent}>
            <Text style={styles.cardTitle}>{habit.title}</Text>
            <Text style={styles.cardDescription}>{habit.description}</Text>

            <View style={styles.cardFooter}>
              <View style={styles.streakBadge}>
                <MaterialCommunityIcons name="fire" size={18} color='#ff9800'/>
                  <Text style={styles.streakText}>{habit.streak_count} day streak</Text>
              </View >

        <View style={styles.frequencyBadge}>
          <Text style={styles.frequencyText}>
            {habit.frequency.charAt(0).toUpperCase()+habit.frequency.slice(1)}
          </Text>
        </View>
        </View>
        </View>
         </Surface>
    </Swipeable>
         )))
        }
    </ScrollView>
    </View>
     
    )
  }
 
const styles = StyleSheet.create({
  container:{
    flex: 1,
    padding:16,
    backgroundColor:"#7BAFD4"
    
  },
  
  header:{
    flexDirection:"row",
    justifyContent: "space-between",
    alignItems:"center",
    marginBottom:24,
  },
  title:{
    fontWeight:"bold",

  },
  card:{
    marginBottom:18,
    borderRadius:18,
    backgroundColor:"#72A0C1",
    shadowColor:"#0000",
    shadowOffset:{width:0,height:2},
    shadowOpacity:1,
    shadowRadius:8,
    elevation:4
  },

  cardContent:{
    padding:20
  },
  cardTitle:{
    fontSize:20,
    fontWeight:"bold",
    marginBottom:4,
    color:"#003262"
  },

   cardDescription:{
    fontSize:15,
    marginBottom:16,
    color:'#2A3439'
  },

  cardFooter:{
   flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    
  },

  streakBadge:{
    flexDirection:"row",
    alignItems:"center",
    backgroundColor:"#B9D9EB",
    borderRadius:12,
    paddingHorizontal:10,
    paddingVertical:4,
  
  },

  streakText:{
    marginLeft:6,
    color:"#1F305E",
    fontWeight:"bold",
    fontSize:14

  },

  frequencyBadge:{
    backgroundColor:"#B9D9EB",
    borderRadius:12,
    paddingHorizontal:12,
    paddingVertical:4,
  
  },

  frequencyText:{
    color:"#2072AF",
    fontWeight:"bold",
    fontSize:14,
  
  },

  emptyState:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },

  emptyStateText:{

  },

  swipeActionLeft:{
    justifyContent:"center",
    alignItems:"flex-start",
    flex:1,
    backgroundColor:"#722F37",
    borderRadius:18,
    marginBottom:18,
    marginTop:2,
    paddingLeft:16

  },

  swipeActionRight:{
     justifyContent:"center",
     alignItems:"flex-end",
     flex:1,
     backgroundColor:"#4F7942",
    borderRadius:18,
    marginBottom:18,
    marginTop:2,
    paddingRight:16
  }

})

