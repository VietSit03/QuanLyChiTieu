import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import Schedule from "../screens/Schedule";
import { Button, TouchableOpacity } from "react-native";
import Inoicons from "react-native-vector-icons/Ionicons";
import CONFIG from "../config";
import Category from "../screens/Category";
import Setting from "../screens/Setting";

const Stack = createStackNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Schedule" component={Schedule} />
      <Stack.Screen name="Category" component={Category} />
      <Stack.Screen name="Setting" component={Setting} />
    </Stack.Navigator>
  );
}

export default StackNavigator;
