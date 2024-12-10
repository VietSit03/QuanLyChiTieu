import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ThemeContext } from "../Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

function CustomDrawer(props) {
  const { themeColors } = useContext(ThemeContext);
  const [email, setEmail] = useState("");
  const [balance, setBalance] = useState(NaN);
  const [curCode, setCurCode] = useState("");

  const logOut = async () => {
    await AsyncStorage.clear();
    props.navigation.replace("Login");
  };

  useEffect(() => {
    async function fetchData() {
      setEmail(await AsyncStorage.getItem("email"));
      setBalance(Number(await AsyncStorage.getItem("balance")));
      setCurCode(await AsyncStorage.getItem("currencyBase"));
    }

    fetchData();
  });

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: themeColors.primaryColorLight,
      }}
    >
      <View
        style={{
          ...styles.header,
          backgroundColor: themeColors.primaryColorLight,
          borderBottomColor: themeColors.primaryColorText,
        }}
      >
        <View style={styles.headerItem}>
          <Text
            style={{
              ...styles.headerText,
              color: themeColors.primaryColorText,
            }}
          >
            Quản lý chi tiêu
          </Text>
        </View>
        <View
          style={{
            ...styles.headerItem,
            marginLeft: 10,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 12, color: themeColors.primaryColorText }}>
            {email}
          </Text>
        </View>
        <View
          style={{
            ...styles.headerItem,
            marginLeft: 10,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 12, color: themeColors.primaryColorText }}>
            Số dư:{" "}
            <Text style={{ fontWeight: "700" }}>
              {balance.toLocaleString("vi-VN")} {curCode}
            </Text>
          </Text>
          <TouchableOpacity>
            <Text
              style={{
                fontSize: 12,
                color: themeColors.primaryColorText,
                textDecorationLine: "underline",
              }}
              onPress={() => props.navigation.navigate("UserProfile")}
            >
              Sửa hồ sơ
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.body}>
        <TouchableOpacity
          style={styles.item}
          onPress={() => props.navigation.navigate("Home")}
        >
          <View style={styles.icon}>
            <Ionicons
              name="home"
              size={20}
              color={themeColors.primaryColorText}
            />
          </View>
          <Text
            style={{ ...styles.itemText, color: themeColors.primaryColorText }}
          >
            Trang chủ
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={styles.item}
          onPress={() => props.navigation.navigate("Chart")}
        >
          <View style={styles.icon}>
            <FontAwesome6
              name="chart-simple"
              size={18}
              color={themeColors.primaryColorText}
            />
          </View>
          <Text
            style={{ ...styles.itemText, color: themeColors.primaryColorText }}
          >
            Biểu đồ
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.item}
          onPress={() => props.navigation.navigate("Category")}
        >
          <View style={styles.icon}>
            <FontAwesome5
              name="list-ol"
              size={18}
              color={themeColors.primaryColorText}
            />
          </View>
          <Text
            style={{ ...styles.itemText, color: themeColors.primaryColorText }}
          >
            Danh mục
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => props.navigation.navigate("Schedule")}
        >
          <View style={styles.icon}>
            <MaterialCommunityIcons
              name="calendar-refresh"
              size={22}
              color={themeColors.primaryColorText}
            />
          </View>
          <Text
            style={{ ...styles.itemText, color: themeColors.primaryColorText }}
          >
            Thanh toán theo lịch
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => props.navigation.navigate("Setting")}
        >
          <View style={styles.icon}>
            <AntDesign
              name="setting"
              size={22}
              color={themeColors.primaryColorText}
            />
          </View>
          <Text
            style={{ ...styles.itemText, color: themeColors.primaryColorText }}
          >
            Cài đặt
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => logOut()}>
          <View style={styles.icon}>
            <AntDesign
              name="logout"
              size={20}
              color={themeColors.primaryColorText}
            />
          </View>
          <Text
            style={{ ...styles.itemText, color: themeColors.primaryColorText }}
          >
            Đăng xuất
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default CustomDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  header: {
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 20,
    borderBottomWidth: 1,
  },
  headerItem: {
    marginTop: 10,
  },
  body: { paddingTop: 10 },
  item: {
    flexDirection: "row",
    paddingVertical: 10,
    alignItems: "center",
  },
  itemText: {
    fontSize: 15,
    fontWeight: "400",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "500",
  },
  icon: {
    width: 35,
    marginHorizontal: 10,
    alignItems: "center",
  },
});
