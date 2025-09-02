import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

// Screens
import HomeScreen from "../screens/HomeScreen";
import AddScreen from "../screens/AddScreen";
import EditScreen from "../screens/EditScreen";
import DetailScreen from "../screens/DetailScreen";
import DeveloperScreen from "../screens/DeveloperScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// --- Bottom Tabs (only Home + Add) ---
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Add") iconName = "add-circle-outline";
          else if (route.name === "Developer") iconName = "code-slash-outline"; 
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#6200ee",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Add" component={AddScreen} />
      <Tab.Screen name="Developer" component={DeveloperScreen}/>
    </Tab.Navigator>
  );
}

// --- Main Stack ---
export default function AppNavigator() {
  return (
    <Stack.Navigator>
      {/* Tabs as main navigation */}
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />

      {/* Hidden from bottom tabs, but accessible by navigation */}
      <Stack.Screen name="DetailScreen" component={DetailScreen} />
      <Stack.Screen name="EditScreen" component={EditScreen} />
      
    </Stack.Navigator>
  );
}
