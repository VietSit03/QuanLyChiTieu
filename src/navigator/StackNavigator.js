import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import Schedule from "../screens/Schedule";
import Category from "../screens/Category/Category";
import Setting from "../screens/Setting";
import AddCategory from "../screens/Category/AddCategory";
import Entypo from "@expo/vector-icons/Entypo";
import { DrawerActions } from "@react-navigation/native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "react-native";
import IconCategory from "../screens/Category/IconCategory";

const Stack = createStackNavigator();

function StackNavigator({ navigation }) {
  const [primaryColor, setPrimaryColor] = useState();

  useEffect(() => {
    async function fetchPrimaryColor() {
      setPrimaryColor(await AsyncStorage.getItem("PRIMARY_COLOR"));
    }

    fetchPrimaryColor();
  }, []);

  function DrawerNavigator() {
    return (
      <Entypo
        name="menu"
        size={26}
        color="white"
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={{ marginLeft: 10 }}
      />
    );
  }

  const screenOptions = () => ({
    headerStyle: {
      backgroundColor: primaryColor,
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "500",
    },
  });

  const drawer = () => ({
    headerLeft: () => <DrawerNavigator />,
  });

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Home" component={Home} options={drawer} />
      <Stack.Screen name="Schedule" component={Schedule} options={drawer} />
      <Stack.Screen name="Category" component={Category} options={drawer} />
      <Stack.Screen name="Setting" component={Setting} options={drawer} />
      <Stack.Screen
        name="AddCategory"
        component={AddCategory}
        options={{ title: "Tạo danh mục" }}
      />
      <Stack.Screen
        name="IconCategory"
        component={IconCategory}
        options={{ title: "Biểu tượng danh mục" }}
      />
    </Stack.Navigator>
  );
}

export default StackNavigator;
