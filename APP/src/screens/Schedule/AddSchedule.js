import { ActivityIndicator, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddScheduleScreen from "./AddScheduleScreen";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

const AddSchedule = ({ navigation }) => {
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
