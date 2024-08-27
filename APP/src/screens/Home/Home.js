import { ActivityIndicator, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeScreen from "./HomeScreen";

const Tab = createMaterialTopTabNavigator();

const Home = () => {
  const [loadingPage, setLoadingPage] = useState(true);
  const [primaryColor, setPrimaryColor] = useState();
  const [headerBgColor, setHeaderBgColor] = useState();

  useEffect(() => {
    async function fetchPrimaryColor() {
      setPrimaryColor(await AsyncStorage.getItem("PRIMARY_COLOR"));
      setHeaderBgColor(await AsyncStorage.getItem("HEADER_BG_COLOR"));
      setLoadingPage(false);
    }

    fetchPrimaryColor();
  }, []);

  return (
    <>
      {loadingPage ? (
        <ActivityIndicator size={"large"} />
      ) : (
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: primaryColor,
            tabBarInactiveTintColor: "#6c757d",
            tabBarStyle: {
              borderTopWidth: 1,
              borderTopColor: "#dcdcdc",
            },
            tabBarIndicatorStyle: {
              backgroundColor: headerBgColor,
            },
            tabBarLabelStyle: {
              fontSize: 14,
              fontWeight: "bold",
              marginBottom: 5,
            },
          }}
        >
          <Tab.Screen
            name="TỔNG"
            component={HomeScreen}
            initialParams={{ type: "TONG" }}
          />
          <Tab.Screen
            name="CHI PHÍ"
            component={HomeScreen}
            initialParams={{ type: "CHI" }}
          />
          <Tab.Screen
            name="THU NHẬP"
            component={HomeScreen}
            initialParams={{ type: "THU" }}
          />
        </Tab.Navigator>
      )}
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
