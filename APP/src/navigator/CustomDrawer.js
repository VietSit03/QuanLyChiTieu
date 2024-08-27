import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from '@expo/vector-icons/AntDesign';

function CustomDrawer(props) {
  const [bgColor, setBgColor] = useState();
  const [headerBgColor, setHeaderBgColor] = useState();
  const [textColor, setTextColor] = useState();

  useEffect(() => {
    async function fetchColor() {
      setBgColor(await AsyncStorage.getItem("PRIMARY_COLOR_LIGHT"));
      setHeaderBgColor(await AsyncStorage.getItem("PRIMARY_COLOR_DARK"));
      setTextColor(await AsyncStorage.getItem("TEXT_COLOR"));
    }

    fetchColor();
  }, []);

  return (
    <View style={{ ...styles.container, backgroundColor: bgColor }}>
      <View
        style={{
          ...styles.header,
          backgroundColor: headerBgColor,
          borderBottomColor: textColor,
        }}
      >
        <View style={styles.headerItem}>
          <Text style={{ ...styles.headerText, color: textColor }}>
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
          <Text style={{ fontSize: 12, color: textColor }}>
            Xin chào <Text style={{ fontWeight: "700" }}>Việt</Text>
          </Text>
          <TouchableOpacity>
            <Text
              style={{
                fontSize: 12,
                color: textColor,
                textDecorationLine: "underline",
              }}
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
            <Ionicons name="home" size={20} color={textColor} />
          </View>
          <Text style={{ ...styles.itemText, color: textColor }}>
            Trang chủ
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => props.navigation.navigate("Category")}
        >
          <View style={styles.icon}>
            <FontAwesome5 name="list-ol" size={18} color={textColor} />
          </View>
          <Text style={{ ...styles.itemText, color: textColor }}>Danh mục</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => props.navigation.navigate("Schedule")}
        >
          <View style={styles.icon}>
            <MaterialCommunityIcons
              name="calendar-refresh"
              size={22}
              color={textColor}
            />
          </View>
          <Text style={{ ...styles.itemText, color: textColor }}>
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
              color={textColor}
            />
          </View>
          <Text style={{ ...styles.itemText, color: textColor }}>
            Cài đặt
          </Text>
        </TouchableOpacity>
        {/* Thêm các mục khác tại đây */}
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
