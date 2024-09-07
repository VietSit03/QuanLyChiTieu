import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home/Home";
import Schedule from "../screens/Schedule/Schedule";
import Category from "../screens/Category/Category";
import Setting from "../screens/Setting";
import AddCategory from "../screens/Category/AddCategory";
import Entypo from "@expo/vector-icons/Entypo";
import { DrawerActions } from "@react-navigation/native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IconCategory from "../screens/Category/IconCategory";
import AddSchedule from "../screens/Schedule/AddSchedule";
import AddScheduleScreen from "../screens/Schedule/AddScheduleScreen";
import CategoryScreen from "../screens/Category/CategoryScreen";

const Stack = createStackNavigator();

function StackNavigator({ navigation }) {
  const [primaryColor, setPrimaryColor] = useState();

  useEffect(() => {
    async function fetchPrimaryColor() {
      setPrimaryColor(await AsyncStorage.getItem("PRIMARY_COLOR_LIGHT"));
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
        style={{ marginLeft: 15 }}
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

  const drawer = (title) => ({
    headerLeft: () => <DrawerNavigator />,
    title: title,
  });

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={drawer("Trang chủ")}
      />
      <Stack.Screen
        name="Schedule"
        component={Schedule}
        options={drawer("Thanh toán theo lịch")}
      />
      <Stack.Screen
        name="Category"
        component={Category}
        options={drawer("Danh mục")}
      />
      <Stack.Screen
        name="Setting"
        component={Setting}
        options={drawer("Cài đặt")}
      />
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
      <Stack.Screen
        name="AddSchedule"
        component={AddSchedule}
        options={{ title: "Tạo lịch thanh toán" }}
      />
      <Stack.Screen
        name="CategoryScreen"
        component={CategoryScreen}
        options={{ title: "Danh mục" }}
      />
    </Stack.Navigator>
  );
}

export default StackNavigator;
