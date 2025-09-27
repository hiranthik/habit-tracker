import { Tabs } from "expo-router";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function TabsLayout() {

  return (
    <>
    <Tabs screenOptions={{
      headerStyle:{backgroundColor:"#F0F8FF"}, 
      headerShadowVisible:false,
      tabBarStyle:{
        backgroundColor:"#F0F8FF",
        borderTopWidth:0,
        shadowOpacity:0
      },
      
    tabBarActiveTintColor:"#00356B",
    tabBarInactiveTintColor:"#2D68C4"}
       }>
    
      <Tabs.Screen name="index" options={{title:"Daily Habits", 
      tabBarIcon:({color, size})=>
      (<MaterialCommunityIcons 
        name="calendar-star"
        size={size}
        color={color}/>
      )
        
      }}
      />
       <Tabs.Screen name="streaks" options={{title:"Streaks",tabBarIcon:({color,size}) =>
       (
        <MaterialCommunityIcons 
        name="chart-multiple"
        size={size}
        color={color}
        />
       ),
    }}
    />
    <Tabs.Screen name="add-habit" options={{title:"Add habits",tabBarIcon:({color,size}) =>
       (
        <MaterialCommunityIcons 
        name="plus-box-multiple"
        size={size}
        color={color}
        />
       ),
    }}
    />
      </Tabs>   
    </>

  )}
