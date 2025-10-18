import { COMPLETIONS_COLLECTION_ID, DATABASE_ID, databases, HABITS_COLLECTION_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { Habit, HabitCompletion } from "@/types/database.type";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Query } from "react-native-appwrite";
import { Card, Text } from "react-native-paper";

export default function StreaksScreen() {
  const [habits,setHabits] = useState<Habit[]>([])
  const [completedHabits,setCompletedHabits] = useState<HabitCompletion[]>([])
  const {user} = useAuth();

  useEffect(()=>{
    if(user){
     
    fetchHabits();
    fetchCompletions();
  
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
          if(currentStreak > bestStreak) bestStreak = currentStreak;
          streak = currentStreak;
          lastDate = date;
        }
      }

    )
    return {streak, bestStreak,total};
  };

  
  const habitStreaks = habits.map((habit)=>{
    const {streak,bestStreak,total} = getStreakData(habit.$id);
    return {habit,bestStreak,streak,total};
  });

  const rankedHabits = habitStreaks.sort((a,b) => a.bestStreak - b.bestStreak)
  







  return (
    <View style={styles.container}>
      <Text style={styles.title}>Habit Streaks</Text>
      {habits.length === 0 ? (
        <View> 
        <Text> No habits yet. Add your first habit.</Text>
        </View>
      ): (
        rankedHabits.map(({habit,streak,bestStreak,total},key)=>(
          <Card key={key} style={[styles.card,key ===0 && styles.firstCard]}>
            <Card.Content >
              <Text variant ="titleMedium">{habit.title}</Text>
              <Text style={styles.habitDescription}>{habit.description}</Text>
              <View style={styles.statsRow}>
                <View style={styles.statsBadge}>
                  <Text style={styles.statsBadgeText}> 🔥 {streak}</Text>
                   <Text style={styles.statsLabel}> Current</Text>
                </View>
                <View style={styles.statsBadgeGold}>
                  <Text style={styles.statsBadgeText}> 🏆 {bestStreak}</Text>
                   <Text style={styles.statsLabel}> Best</Text>
                </View>
                <View style={styles.statsBadgeGreen}>
                  <Text style={styles.statsBadgeText}> ✅ {total}</Text>
                   <Text style={styles.statsLabel}> Total </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  
  card:{
    marginBottom:18,
    borderRadius:18,
    backgroundColor:"#7BAFD4"
    

  },
  
  container:{
    flex:1,
    backgroundColor:"#2774AE",
    padding:16
  },
  
  
  title:{
    fontWeight:"100"
  },

});