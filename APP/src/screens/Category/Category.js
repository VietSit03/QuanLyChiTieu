import { StyleSheet, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CategorySreen from "./CategoryScreen";
import CategoryScreen from "./CategoryScreen";

const Tab = createMaterialTopTabNavigator();

const Category = () => {
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
            name="CHI PHÍ"
            component={CategoryScreen}
            initialParams={{ type: "CHI" }}
          />
          <Tab.Screen
            name="THU NHẬP"
            component={CategoryScreen}
            initialParams={{ type: "THU" }}
          />
        </Tab.Navigator>
      )}
    </>
  );
};

export default Category;

const styles = StyleSheet.create({});
