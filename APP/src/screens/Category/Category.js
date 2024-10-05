import {
  StyleSheet,
  ActivityIndicator,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CategoryScreen from "./CategoryScreen";
import { ThemeContext } from "../../Theme";
import { DrawerNavigator } from "../../component/Button";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";

const Tab = createMaterialTopTabNavigator();

const Category = ({ navigation, route }) => {
  const { themeColors } = useContext(ThemeContext);
  const [loadingPage, setLoadingPage] = useState(true);
  const [isDragEnabled, setIsDragEnabled] = useState(false);

  useEffect(() => {
    async function fetchPrimaryColor() {
      setLoadingPage(false);
    }

    fetchPrimaryColor();
  }, []);

  const handleRightBtn = () => {
    setIsDragEnabled(!isDragEnabled);
  };

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
          {isDragEnabled ? (
            <TouchableOpacity
              style={styles.btnLeft}
              onPress={() => setIsDragEnabled(!isDragEnabled)}
            >
              <Ionicons name="close" size={26} color="white" />
            </TouchableOpacity>
          ) : (
            <DrawerNavigator navigation={navigation} />
          )}
          <Text style={styles.title}>Danh mục</Text>
        </View>
        {isDragEnabled && (
          <TouchableOpacity
            style={styles.btnRight}
            onPress={() => handleRightBtn()}
          >
            <Feather name="check" size={26} color="white" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <>
      {loadingPage ? (
        <ActivityIndicator size={"large"} />
      ) : (
        <>
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
              children={() => (
                <CategoryScreen
                  type="CHI"
                  isDragEnabled={isDragEnabled}
                  setIsDragEnabled={setIsDragEnabled}
                  navigation={navigation}
                />
              )}
            />
            <Tab.Screen
              name="THU NHẬP"
              children={() => (
                <CategoryScreen
                  type="THU"
                  isDragEnabled={isDragEnabled}
                  setIsDragEnabled={setIsDragEnabled}
                  navigation={navigation}
                />
              )}
            />
          </Tab.Navigator>
        </>
      )}
    </>
  );
};

export default Category;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 92,
    paddingBottom: 12,
  },
  title: {
    fontSize: 20,
    color: "#fff",
    marginLeft: 15,
    fontWeight: "500",
  },
  buttonText: {
    fontSize: 16,
  },
  btnRight: {
    marginRight: 15,
  },
  btnLeft: {
    marginLeft: 15,
    width: 26,
  },
});
