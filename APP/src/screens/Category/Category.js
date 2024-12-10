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
import { alert } from "../../common";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

const Tab = createMaterialTopTabNavigator();

const Category = ({ navigation, route }) => {
  const { themeColors } = useContext(ThemeContext);
  const [loadingPage, setLoadingPage] = useState(true);
  const [isDragEnabled, setIsDragEnabled] = useState(false);
  const [category, setCategory] = useState(null);
  const [dragCategory, setDragCategory] = useState(null);

  useEffect(() => {
    async function fetchPrimaryColor() {
      setLoadingPage(false);
    }

    fetchPrimaryColor();
  }, []);

  const handleLeftBtn = async () => {
    setIsDragEnabled(!isDragEnabled);
    setDragCategory(category.filter((item) => !item.isSpecial && !item.empty));
  };

  const handleRightBtn = async () => {
    setIsDragEnabled(!isDragEnabled);
    await fetchChangeOrder();
  };

  const chunkArray = (arr, chunkSize) => {
    const result = [...arr];
    const specialCategory = { id: "special", isSpecial: true };

    result.push(specialCategory);

    while (result.length % chunkSize != 0) {
      result.push({ id: `empty-${result.length}`, empty: true });
    }

    return result;
  };

  const fetchChangeOrder = async () => {
    const token = await AsyncStorage.getItem("token");
    var url = `${API_URL}/customcategories/changeorder`;
    const newCategory = dragCategory.map((item, index) => ({
      id: item.id,
      categoryOrder: index + 1,
    }));
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          categories: newCategory,
        }),
      });

      if (!response.ok) {
        if (response.status === 403) {
          alert(
            "Hết hạn đăng nhập",
            "Phiên đăng nhập đã hết hạn. Đăng nhập lại để tiếp tục",
            () => navigation.navigate("Login")
          );
          await AsyncStorage.setItem("token", "");
        }
        alert("Lỗi", "Xảy ra lỗi");
        return false;
      }

      setCategory(chunkArray(dragCategory, 3));
      return true;
    } catch (error) {
      console.error("Error:", error);
    }
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
              onPress={() => handleLeftBtn()}
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
                  dragCategory={dragCategory}
                  setDragCategory={setDragCategory}
                  category={category}
                  setCategory={setCategory}
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
                  dragCategory={dragCategory}
                  setDragCategory={setDragCategory}
                  category={category}
                  setCategory={setCategory}
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
