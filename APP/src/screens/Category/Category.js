import { StyleSheet, ActivityIndicator } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CategoryScreen from "./CategoryScreen";
import { ThemeContext } from "../../Theme";

const Tab = createMaterialTopTabNavigator();

const Category = () => {
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
