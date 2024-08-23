import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "../screens/Home";
import Schedule from "../screens/Schedule";
import CONFIG from "../config";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Category from "../screens/Category";
import CustomDrawer from "./CustomDrawer";
import Setting from "../screens/Setting";

const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  const [primaryColor, setPrimaryColor] = useState();

  useEffect(() => {
    async function fetchPrimaryColor() {
      const color = await AsyncStorage.getItem("PRIMARY_COLOR");
      console.log(await AsyncStorage.getItem("PRIMARY_COLOR"));
      setPrimaryColor(color);
    }

    fetchPrimaryColor();
  }, []);

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: primaryColor,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          title: "Trang chủ",
        }}
      />
      <Drawer.Screen
        name="Category"
        component={Category}
        options={{ title: "Danh mục" }}
      />
      <Drawer.Screen
        name="Schedule"
        component={Schedule}
        options={{ title: "Thanh toán theo lịch" }}
      />
      <Drawer.Screen
        name="Setting"
        component={Setting}
        options={{ title: "Cài đặt" }}
      />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
