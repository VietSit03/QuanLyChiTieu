import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useFocusEffect } from "@react-navigation/native";
import { ThemeContext } from "../../App";

function CustomDrawer(props) {
  const { themeColors } = useContext(ThemeContext);

  return (
    <View style={{ ...styles.container, backgroundColor: themeColors.primaryColorLight }}>
      <View
        style={{
          ...styles.header,
          backgroundColor: themeColors.primaryColorDark,
          borderBottomColor: themeColors.primaryColorText,
        }}
      >
        <View style={styles.headerItem}>
          <Text style={{ ...styles.headerText, color: themeColors.primaryColorText }}>
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
            Xin chào <Text style={{ fontWeight: "700" }}>Việt</Text>
          </Text>
          <TouchableOpacity>
            <Text
              style={{
                fontSize: 12,
                color: themeColors.primaryColorText,
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
            <Ionicons name="home" size={20} color={themeColors.primaryColorText} />
          </View>
          <Text style={{ ...styles.itemText, color: themeColors.primaryColorText }}>
            Trang chủ
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => props.navigation.navigate("Category")}
        >
          <View style={styles.icon}>
            <FontAwesome5 name="list-ol" size={18} color={themeColors.primaryColorText} />
          </View>
          <Text style={{ ...styles.itemText, color: themeColors.primaryColorText }}>Danh mục</Text>
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
          <Text style={{ ...styles.itemText, color: themeColors.primaryColorText }}>
            Thanh toán theo lịch
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => props.navigation.navigate("Setting")}
        >
          <View style={styles.icon}>
            <AntDesign name="setting" size={22} color={themeColors.primaryColorText} />
          </View>
          <Text style={{ ...styles.itemText, color: themeColors.primaryColorText }}>Cài đặt</Text>
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
