import { ActivityIndicator, StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeScreen from "./HomeScreen";
import { ThemeContext } from "../../Theme";

const Tab = createMaterialTopTabNavigator();

const Home = () => {
  const { themeColors } = useContext(ThemeContext);
  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    async function fetchPrimaryColor() {
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
            tabBarActiveTintColor: themeColors.primaryColorLight,
            tabBarInactiveTintColor: "#6c757d",
            tabBarStyle: {
              borderTopWidth: 1,
              borderTopColor: "#dcdcdc",
            },
            tabBarIndicatorStyle: {
              backgroundColor: themeColors.primaryColorDark,
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
