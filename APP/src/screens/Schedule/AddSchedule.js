import { ActivityIndicator, StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddScheduleScreen from "./AddScheduleScreen";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ThemeContext } from "../../Theme";

const Tab = createMaterialTopTabNavigator();

const AddSchedule = ({ navigation }) => {
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
            component={AddScheduleScreen}
            initialParams={{ type: "CHI" }}
          />
          <Tab.Screen
            name="THU NHẬP"
            component={AddScheduleScreen}
            initialParams={{ type: "THU" }}
          />
        </Tab.Navigator>
      )}
    </>
  );
};

export default AddSchedule;

const styles = StyleSheet.create({});
