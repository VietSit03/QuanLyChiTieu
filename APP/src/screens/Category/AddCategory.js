import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { RadioButton } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { ThemeContext } from "../../Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import { LoadingPage } from "../../component/Loading";
import { alert, checkToken, isEmptyInput } from "../../common";

const screenWidth = Dimensions.get("window").width;

const color = [
  { colorCode: "#FFCE78" },
  { colorCode: "#EDDF64" },
  { colorCode: "#FFB6C1" },
  { colorCode: "#E87B7E" },
  { colorCode: "#B0E0E6" },
  { colorCode: "#00B800" },
  { colorCode: "#D8BFD8" },
];

const Color = React.memo(
  ({ item, selectedColor, handle }) => {
    return (
      <Pressable
        style={{
          width: 35,
          height: 35,
          borderRadius: 17.5,
          backgroundColor: item.colorCode,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 10,
        }}
        onPress={handle}
      >
        {selectedColor == item.colorCode && (
          <Feather name="check" size={26} color="white" />
        )}
      </Pressable>
    );
  },
  (prevProps, nextProps) =>
    prevProps.selectedColor === nextProps.selectedColor &&
    prevProps.item.colorCode === nextProps.item.colorCode
);

const Icon = React.memo(
  ({ item, handle, selectedColor, selectedIcon, themeColors, navigation, type }) => {
    var size = screenWidth / 6;
    if (item.empty) {
      return <View style={{ width: size + 20, height: size + 20 }} />;
    }
    return (
      <>
        {item.isSpecial ? (
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              style={{
                margin: 10,
                height: size,
                width: size,
                borderRadius: size / 2,
                backgroundColor: themeColors.primaryColorLighter,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() =>
                navigation.navigate("IconCategory", { type: type, page: "ADD" })
              }
            >
              <Ionicons name="add-outline" size={40} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              alignItems: "center",
              borderWidth: item.id == selectedIcon.id ? 1 : 0,
              padding: item.id == selectedIcon.id ? 9 : 10,
              backgroundColor:
                item.id == selectedIcon.id ? "#fff" : "transparent",
              borderColor: "gray",
              borderRadius: 10,
            }}
          >
            <Pressable
              style={{
                height: size,
                width: size,
                borderRadius: size / 2,
                backgroundColor:
                  item.id == selectedIcon.id ? selectedColor : "#DCDCDC",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={handle}
            >
              <Image
                source={{ uri: item.imgSrc }}
                style={{ width: size - 25, height: size - 25 }}
              />
            </Pressable>
          </View>
        )}
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.selectedColor === nextProps.selectedColor &&
      prevProps.selectedIcon.id !== prevProps.item.id &&
      nextProps.selectedIcon.id !== prevProps.item.id
    );
  }
);

const AddCategory = ({ navigation, route }) => {
  const { themeColors } = useContext(ThemeContext);
  const type = route.params?.type || "CHI";
  const [loadingPage, setLoadingPage] = useState(true);
  const [name, setName] = useState({
    title: "Tên danh mục",
    value: "",
    error: "",
  });
  const [icon, setIcon] = useState({
    error: "",
  });
  const [checked, setChecked] = useState(type);
  const [selectedColor, setSelectedColor] = useState();
  const [selectedIcon, setSelectedIcon] = useState(null);
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

  const renderRow = ({ item }) => {
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
              handle={() => {
                setSelectedIcon(icon);
              }}
              selectedColor={selectedColor}
              selectedIcon={selectedIcon}
              themeColors={themeColors}
              navigation={navigation}
              type={type}
            />
          );
        })}
      </View>
    );
  };

  const checkIcon = () => {
    if (selectedIcon.id == -1) {
      setIcon({ error: "Chọn một biểu tượng danh mục" });
      return false;
    } else {
      setIcon({ error: "" });
      return true;
    }
  };

  useEffect(() => {
    if (selectedIcon != null) {
      checkIcon();
    }
  }, [selectedIcon]);

  const renderColor = ({ item }) => {
    return (
      <Color
        item={item}
        selectedColor={selectedColor}
        handle={() => setSelectedColor(item.colorCode)}
      />
    );
  };

  const handleAddCategory = () => {
    if (isEmptyInput(name, setName)) {
      return;
    }

    if (!checkIcon()) {
      return;
    }

    async function add() {
      await fetchAddCategory();
    }

    add();
  };

  useEffect(() => {
    async function fetchData() {
      setLoadingPage(true);
      await fetchCategory();
      setSelectedColor(color[0].colorCode);
      setSelectedIcon({ id: -1, imgSrc: "https://imgur.com/LHXHUAb.png" });
      setLoadingPage(false);
    }

    fetchData();
  }, [checked]);

  useEffect(() => {
    if (route.params?.icon) {
      setSelectedIcon(route.params?.icon);
      return;
    }
    setSelectedIcon({ id: -1, imgSrc: "https://imgur.com/LHXHUAb.png" });
  }, [route.params]);

  const fetchCategory = async () => {
    const token = await AsyncStorage.getItem("token");
    const url = `${API_URL}/categories/top?num=15&type=${checked}`;

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
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchAddCategory = async () => {
    const token = await AsyncStorage.getItem("token");
    const url = `${API_URL}/customcategories/add`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          categoryID: selectedIcon.id,
          categoryName: name.value,
          categoryColor: selectedColor,
          type: type,
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
          return;
        }
        alert();
        return;
      }

      alert("Thành công", "Thêm danh mục thành công.", () =>
        navigation.goBack()
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      {loadingPage ? (
        <LoadingPage />
      ) : (
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ ...styles.fdRow, marginTop: 20 }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: selectedColor,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={{ uri: selectedIcon.imgSrc }}
                style={{ width: 20, height: 20 }}
              />
            </View>
            <View style={styles.input}>
              <TextInput
                value={name.value}
                placeholder="Tên danh mục"
                style={{
                  ...styles.textInput,
                  borderBottomColor: themeColors.primaryColorLight,
                }}
                onChangeText={(text) => setName({ ...name, value: text })}
                onBlur={() => isEmptyInput(name, setName)}
              ></TextInput>
              {name.error && <Text style={styles.errorText}>{name.error}</Text>}
            </View>
          </View>
          <RadioButton.Group
            onValueChange={(value) => setChecked(value)}
            value={checked}
          >
            <View style={{ ...styles.fdRow, marginTop: 20 }}>
              <TouchableOpacity
                style={styles.fdRow}
                onPress={() => setChecked("CHI")}
              >
                <RadioButton value="CHI"></RadioButton>
                <Text style={{ fontSize: 16 }}>Chi phí</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ ...styles.fdRow, marginLeft: 30 }}
                onPress={() => setChecked("THU")}
              >
                <RadioButton value="THU"></RadioButton>
                <Text style={{ fontSize: 16 }}>Thu nhập</Text>
              </TouchableOpacity>
            </View>
          </RadioButton.Group>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Biểu tượng</Text>
            {icon.error && <Text style={styles.errorText}>{icon.error}</Text>}
            <FlatList
              style={styles.sectionBody}
              data={chunkArray(category, 4)}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderRow}
              scrollEnabled={false}
            />
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Màu sắc</Text>
            <FlatList
              style={styles.sectionBody}
              data={color}
              keyExtractor={(item) => item.colorCode}
              renderItem={renderColor}
              scrollEnabled={false}
              horizontal={true}
            />
          </View>
          <View
            style={{
              ...styles.fdRow,
              marginTop: 30,
              justifyContent: "center",
              paddingBottom: 10,
            }}
          >
            <TouchableOpacity
              style={styles.btnAdd}
              onPress={() => handleAddCategory()}
            >
              <Text style={{ fontSize: 16 }}>Thêm</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default AddCategory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  fdRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
  textInput: {
    borderBottomWidth: 2,
    padding: 0,
    fontSize: 16,
  },
  sectionContainer: {
    marginTop: 20,
  },
  sectionHeader: {
    color: "gray",
  },
  sectionBody: { marginTop: 20 },
  btnAdd: {
    backgroundColor: "#FFC125",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: "70%",
    borderRadius: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },
});
