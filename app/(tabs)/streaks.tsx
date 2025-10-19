import { client, COMPLETIONS_COLLECTION_ID, DATABASE_ID, databases, HABITS_COLLECTION_ID, RealTimeResponse } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { Habit, HabitCompletion } from "@/types/database.type";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Query } from "react-native-appwrite";
import { ScrollView } from "react-native-gesture-handler";
import { Card, Text } from "react-native-paper";

export default function StreaksScreen() {
  const [habits,setHabits] = useState<Habit[]>([])
  const [completedHabits,setCompletedHabits] = useState<HabitCompletion[]>([])
  const {user} = useAuth();

  useEffect(()=>{
    if(user){

      const habitsChannel = `databases.${DATABASE_ID}.collections.${HABITS_COLLECTION_ID}.documents`
          const habitSubscription = client.subscribe(habitsChannel,
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
      
          const completionsChannel = `databases.${DATABASE_ID}.collections.${COMPLETIONS_COLLECTION_ID}.documents`
          const completionsSubscription = client.subscribe(completionsChannel,
            (response:RealTimeResponse)=>{
              if(response.events.includes("databases.*.collections.*.documents.*.create"))
            {
              fetchCompletions();
            }
          
          }
          ); 
      
     
    fetchHabits();
    fetchCompletions();

    return () =>{
      habitSubscription();
      completionsSubscription();
      
    }
  
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


  const fetchCompletions = async() =>{
    try{
      const response = await databases.listDocuments(
        DATABASE_ID,
        COMPLETIONS_COLLECTION_ID,
        [Query.equal("user_id",user?.$id??"")]
      );
      console.log(response.documents)

      const completions = response.documents as unknown as HabitCompletion[]
      setCompletedHabits(completions);
    }
    catch(error){
      console.log(error)
    }
  }

  interface StreakData{
    streak:number;
    bestStreak:number;
    total:number;
  }
  const getStreakData =(habitId:string): StreakData=>{
    const habitCompletions = 
    completedHabits?.filter(
      (c)=> c.habit_id===habitId).sort((a,b)=>
        new Date(a.completed_at).getTime() 
      - new Date(b.completed_at).getTime());


      if(habitCompletions?.length=== 0){
        return{streak:0,bestStreak:0,total:0};
 
      }

    let streak = 0;
    let bestStreak = 0;
    let total = habitCompletions.length;
    
    let lastDate: Date | null = null;
    let currentStreak = 0;


    habitCompletions?.forEach((c)=>{
      const date = new Date(c.completed_at);
      if(lastDate){
        const difference = (date.getTime() - lastDate.getTime()) / (1000*60*60*24);
        if(difference<=1.5){
          currentStreak +=1;
        }else{
          currentStreak =1;
        }
      }
        else{
          currentStreak = 1;
        }
         if(currentStreak > bestStreak) bestStreak = currentStreak;
          streak = currentStreak;
          lastDate = date;
      }

    )
    return {streak, bestStreak,total};
  };

  
  const habitStreaks = habits.map((habit)=>{
    const {streak,bestStreak,total} = getStreakData(habit.$id);
    return {habit,bestStreak,streak,total};
  });

  const rankedHabits = habitStreaks.sort((a,b) => b.bestStreak - a.bestStreak)
  



  const badgeStyles = [styles.badge1,styles.badge2, styles.badge3 ]



  return (
    <View style={styles.container}>
      <Text style={styles.title} variant="headlineSmall">Habit Streaks</Text>

      {rankedHabits.length >0 && (
        <View style={styles.rankingContainer}>
          <Text style={styles.rankingTitle}>
            <MaterialCommunityIcons name="medal" size={18} color='#FFD700'/> {" "}
            Top Streaks
          </Text>

          {rankedHabits.slice(0,3).map((item,key)=>(
            <View key={key} style={styles.rankingRow}> 
              <View style={[styles.rankingBadge, badgeStyles[key]]}>
                <Text style={styles.rankingBadgeText}> {key +1 } </Text>
              </View>
              <Text style={styles.rankingHabit}>{item.habit.title}</Text> 
              <Text>{"  "}</Text>
               <Text style={styles.rankingStreak}>{item.bestStreak}</Text>
            </View>
          ))}

        </View>
      )}


      {habits.length === 0 ? (
        <View> 
        <Text> No habits yet. Add your first habit.</Text>
        </View>
      ): (
        <ScrollView showsVerticalScrollIndicator={false}>
        {rankedHabits.map(({habit,streak,bestStreak,total},key)=>(
          <Card key={key} style={[styles.card,key ===0 && styles.firstCard]}>
            <Card.Content >
              <Text variant ="titleMedium">{habit.title}</Text>
              <Text style={styles.habitDescription}>{habit.description}</Text>
              <View style={styles.statsRow}>
                <View style={styles.statsBadge}>
                   <Text style={styles.statsLabel}> Current :     
                    <MaterialCommunityIcons name="fire" size={18} color='#ff9800'/>
                     </Text>
                   <Text style={styles.statsBadgeText}> {streak}  </Text>
                </View>

                <View style={styles.statsBadgeGold}>
                   <Text style={styles.statsLabel}> Best :   
                    <MaterialCommunityIcons name="trophy-variant" size={18} color='#f1ab43ff'/>
                   </Text>
                   <Text style={styles.statsBadgeText}> {bestStreak}</Text>
                </View>
                <View style={styles.statsBadgeGreen}>
                   <Text style={styles.statsLabel}> Total :   
                    <MaterialCommunityIcons name="check-bold" size={18} color='#32CD32'/> </Text>
                   <Text style={styles.statsBadgeText}> {total}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  
  card:{
    marginBottom:18,
    borderRadius:18,
    backgroundColor:"#B9D9EB",
    elevation:3,
    shadowColor:"#003262",
    shadowOffset:{width:0,height:2},
    shadowOpacity:1,
    borderColor:"#f0f0f0"
    

  },

  firstCard:{
    borderWidth:1,
    borderColor:"#f0f0f0"
  },

  
  container:{
    flex:1,
    backgroundColor:"#7BAFD4",
    padding:16
  },
  
  
  title:{
    fontWeight:"500",
    marginBottom:7,
    alignSelf:"center",
    color:"#003262"
  },

  habitTitle:{
    fontWeight:"bold",
    fontSize:18,
    marginBottom:2
  },

  habitDescription:{
    marginBottom:10,
    color:"#536878"

  },

  statsRow:{
    flexDirection:"row",
    justifyContent:"space-between",
    marginBottom:8,
    
  },
  statsBadge:{
    backgroundColor:"#76ABDF",
    borderRadius:10,
    paddingHorizontal:12,
    paddingVertical:6,
    alignItems:"center",
    minWidth:60
  },

  statsBadgeGold:{
    backgroundColor:"#76ABDF",
    borderRadius:10,
    paddingHorizontal:12,
    paddingVertical:6,
    alignItems:"center",
    minWidth:60
  },

   statsBadgeGreen:{
    backgroundColor:"#76ABDF",
    borderRadius:10,
    paddingHorizontal:12,
    paddingVertical:6,
    alignItems:"center",
    minWidth:60
  },
  statsBadgeText:{
    fontWeight:"bold",
    fontSize:15,
    color:"#536878"
  },

  statsLabel:{
    fontWeight:"500",
    fontSize:14,
    marginTop:2
  },

  rankingContainer:{
    marginBottom:24,
    backgroundColor:"#2072AF",
    borderRadius:16,
    padding:16,
    elevation:2,
    shadowColor:"#003262",
    shadowOffset:{width:0,height:2},
    shadowOpacity:1,
    shadowRadius:1
    
  },

  rankingTitle:{
    fontWeight:"600",
    fontSize:18,
    marginBottom:12,
    color:"#FFFACD",
    letterSpacing:0.5
  
  },

  rankingRow:{
    flexDirection:"row",
    alignItems:"center",
    marginBottom:8,
    borderBottomWidth:2,
    borderBottomColor:"#4682b4",
    paddingBottom:8,
    
  },

  rankingBadge:{
    width:28,
    height:28,
    borderRadius:14,
    alignItems:"center",
    justifyContent:"center",
    marginRight:10,
    backgroundColor:"#4682b4"
  },

  badge1:{ backgroundColor:"#FFD700"},
  badge2:{ backgroundColor:"silver"},
  badge3:{ backgroundColor:"#C19A6B"},

  rankingBadgeText:{
    fontWeight:"bold",
    fontSize:15

  },

  rankingHabit:{
    fontSize:15,
    flex:1,
    color:"#002147",
    fontWeight:"600",

  },

  rankingStreak:{
    fontSize:14,
    fontWeight:"bold",
    color:"#002147"
  }

});