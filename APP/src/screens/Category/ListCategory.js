import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeContext } from "../../Theme";
import { LoadingPage } from "../../component/Loading";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { alert } from "../../common";

const ListCategory = ({ route, navigation }) => {
  const { type, page } = route.params;
  const [loadingPage, setLoadingPage] = useState(true);
  const { themeColors } = useContext(ThemeContext);
  const [category, setCategory] = useState();

  const chunkArray = (arr, chunkSize) => {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }

    const specialCategory = { id: "special", isSpecial: true };

    if (result[result.length - 1].length < chunkSize) {
      result[result.length - 1].push(specialCategory);
    } else {
      result.push([specialCategory]);
    }

    const lastRow = result[result.length - 1];
    while (lastRow.length < chunkSize) {
      lastRow.push({ id: `empty-${lastRow.length}`, empty: true });
    }

    return result;
  };

  const fetchCategory = async () => {
    const token = await AsyncStorage.getItem("token");
    const url = `${API_URL}/CustomCategory/GetAll?type=${type}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          alert(
            "Hết hạn đăng nhập",
            "Phiên đăng nhập đã hết hạn. Đăng nhập lại để tiếp tục",
            () => navigation.navigate("Login")
          );
          await AsyncStorage.setItem("token", "");
          return;
        }
        return;
      }

      var apiResponse = await response.json();

      setCategory(apiResponse.data);
      setLoadingPage(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      async function fetchData() {
        if (isActive) {
          await fetchCategory();
        }
      }

      fetchData();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const Category = ({ item }) => {
    if (item.empty) {
      return <View style={{ width: 70, height: 60 }} />;
    }
    return (
      <>
        {item.isSpecial ? (
          <View style={{ alignItems: "center", width: 70 }}>
            <TouchableOpacity
              style={{
                height: 60,
                width: 60,
                borderRadius: 30,
                backgroundColor: themeColors.primaryColorLighter,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => navigation.navigate("AddCategory", { type: type })}
            >
              <Ionicons name="add-outline" size={40} color="white" />
            </TouchableOpacity>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{ marginTop: 2 }}
            >
              Tạo
            </Text>
          </View>
        ) : (
          <View style={{ alignItems: "center", width: 70 }}>
            <Pressable
              style={{
                height: 60,
                width: 60,
                borderRadius: 30,
                backgroundColor: item.color,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => navigation.navigate(page, {type: type, category: item})}
            >
              <Image
                source={{ uri: item.imgSrc }}
                style={{ width: 40, height: 40 }}
              />
            </Pressable>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{ marginTop: 2 }}
            >
              {item.name}
            </Text>
          </View>
        )}
      </>
    );
  };

  const renderRow = ({ item }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          marginBottom: 15,
          justifyContent: "space-around",
        }}
      >
        {item.map((category, index) => {
          return <Category key={index.toString()} item={category} />;
        })}
      </View>
    );
  };

  return (
    <>
      {loadingPage ? (
        <LoadingPage />
      ) : (
        <View style={{ flex: 1, padding: 20 }}>
          <FlatList
            data={chunkArray(category, 3)}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderRow}
            scrollEnabled={true}
          />
        </View>
      )}
    </>
  );
};

export default ListCategory;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    position: "absolute",
    maxWidth: 150,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    elevation: 5,
  },
  modalButton: {
    padding: 10,
  },
});
