import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import HomeScreen from "./HomeScreen";
import { ThemeContext } from "../../Theme";
import { DrawerNavigator } from "../../component/Button";
import Feather from "@expo/vector-icons/Feather";

const Tab = createMaterialTopTabNavigator();

const Home = ({ navigation }) => {
  const { themeColors } = useContext(ThemeContext);
  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    async function fetchPrimaryColor() {
      setLoadingPage(false);
    }

    fetchPrimaryColor();
  }, []);

  const Header = () => {
    return (
      <View
        style={{
          ...styles.header,
          backgroundColor: themeColors.primaryColorLight,
        }}
      >
        <View
          style={{
            height: 30,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <DrawerNavigator navigation={navigation} />
          <Text style={styles.title}>Trang chủ</Text>
        </View>
        <Pressable
          style={styles.btnRight}
          onPress={() => navigation.navigate("SearchTransaction")}
        >
          <Feather name="search" size={24} color="white" />
        </Pressable>
      </View>
    );
  };

  return (
    <>
      {loadingPage ? (
        <ActivityIndicator size={"large"} />
      ) : (
        <View style={styles.container}>
          <Header />
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
              component={HomeScreen}
              initialParams={{ type: "CHI" }}
            />
            <Tab.Screen
              name="THU NHẬP"
              component={HomeScreen}
              initialParams={{ type: "THU" }}
            />
          </Tab.Navigator>
        </View>
      )}
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 92,
    paddingTop: 50,
    paddingBottom: 12,
  },
  title: {
    fontSize: 20,
    color: "#fff",
    marginLeft: 20,
    fontWeight: "500",
  },
  buttonText: {
    fontSize: 16,
  },
  btnRight: {
    width: 26,
    marginRight: 15,
  },
  btnLeft: {
    marginLeft: 15,
    width: 26,
  },
});
