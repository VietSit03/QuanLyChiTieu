import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../Theme";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoadingPage } from "../../component/Loading";
import { alert, checkToken } from "../../common";

const screenWidth = Dimensions.get("window").width;

const Purpose = React.memo(({ item, data, render }) => {
  return (
    <View style={{ marginBottom: 25 }}>
      <Text style={{ fontSize: 16, marginBottom: 15 }}>{item.purposeName}</Text>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={render}
        scrollEnabled={false}
        style={styles.flCategory}
      />
    </View>
  );
});

const Icon = React.memo(
  ({ item, handle, selectedCategory, colorSelected }) => {
    var size = screenWidth / 6;
    if (item.empty) {
      return <View style={{ width: size + 20, height: size + 20 }} />;
    }
    return (
      <View
        style={{
          alignItems: "center",
          borderWidth: item.id == selectedCategory.id ? 1 : 0,
          padding: item.id == selectedCategory.id ? 9 : 10,
          borderColor: "gray",
          borderRadius: 10,
        }}
      >
        <TouchableOpacity
          style={{
            height: size,
            width: size,
            borderRadius: size / 2,
            backgroundColor:
              item.id == selectedCategory.id ? colorSelected : "#DCDCDC",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={handle}
        >
          <Image
            source={{ uri: item.imgSrc }}
            style={{ width: size - 25, height: size - 25 }}
          />
        </TouchableOpacity>
      </View>
    );
  },
  (prevProps, nextProps) => {
    return (
      !(
        prevProps.item.id === nextProps.selectedCategory.id ||
        prevProps.item.id === prevProps.selectedCategory.id
      ) || prevProps.selectedCategory === nextProps.selectedCategory
    );
  }
);

const IconCategory = ({ navigation, route }) => {
  const { themeColors } = useContext(ThemeContext);
  const [loadingPage, setLoadingPage] = useState(true);
  const { type } = route.params;

  useEffect(() => {
    async function fetchData() {
      fetchCategory();
      setLoadingPage(false);
    }

    fetchData();
  }, []);

  const data = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
  }));

  const [selectedCategory, setSelectedCategory] = useState({ id: -1 });

  const chunkArray = (arr, chunkSize) => {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      while (chunk.length < chunkSize) {
        chunk.push({
          id: `empty-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          empty: true,
        });
      }
      result.push(chunk);
    }
    return result;
  };

  useEffect(() => {
    chunkArray(data, 4);
  }, [data]);

  const [category, setCategory] = useState();

  const fetchCategory = async () => {
    const token = await AsyncStorage.getItem("token");
    const url = `${API_URL}/Category/GetAll`;

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
        alert();
        return;
      }

      var apiResponse = await response.json();
      setCategory(apiResponse.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderCategory = ({ item }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          marginBottom: 15,
          justifyContent: "space-between",
        }}
      >
        {item.map((icon) => {
          return (
            <Icon
              key={icon.id}
              item={icon}
              selectedCategory={selectedCategory}
              handle={() => setSelectedCategory(icon)}
              colorSelected={themeColors.primaryColorLighter}
            />
          );
        })}
      </View>
    );
  };

  const renderPurpose = ({ item }) => {
    return (
      <Purpose
        item={item}
        data={chunkArray(item.categories, 4)}
        render={renderCategory}
      />
    );
  };

  return (
    <>
      {loadingPage ? (
        <LoadingPage />
      ) : (
        <View style={styles.container}>
          <ScrollView style={styles.scrollView}>
            <FlatList
              data={category}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderPurpose}
              scrollEnabled={false}
              style={styles.flPurpose}
            />
            <View style={{ backgroundColor: "transparent", height: 50 }}></View>
          </ScrollView>
          <View style={styles.btnSelect}>
            <TouchableOpacity
              style={
                selectedCategory.id != -1
                  ? styles.btnSelectActive
                  : styles.btnSelectInactive
              }
              disabled={selectedCategory.id == -1}
              onPress={() =>
                navigation.navigate("AddCategory", {
                  icon: selectedCategory,
                  type: type,
                })
              }
            >
              <Text>Chọn</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

export default IconCategory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  flPurpose: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  btnSelect: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  btnSelectInactive: {
    backgroundColor: "gold",
    width: "65%",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 500,
    opacity: 0.5,
  },
  btnSelectActive: {
    backgroundColor: "gold",
    width: "65%",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 500,
  },
});
