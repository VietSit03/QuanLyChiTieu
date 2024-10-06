import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ThemeContext } from "../../Theme";
import { alert } from "../../common";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

const Setting = ({ navigation }) => {
  const { themeColors } = useContext(ThemeContext);

  const handleDeleteConfirmation = () => {
    alert(
      "Xác nhận",
      "Tất cả dữ liệu sẽ bị xoá và không thể khôi phục. Tiếp tục?",
      () => handleDelete(),
      "cancel"
    );
  };

  const handleDelete = () => {
    async function execute() {
      fetchDeleteData();
    }
    execute();
  };

  const fetchDeleteData = async () => {
    const token = await AsyncStorage.getItem("token");
    const url = `${API_URL}/users/delete/data`;

    try {
      const response = await fetch(url, {
        method: "DELETE",
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
        alert("Lỗi", "Xảy ra lỗi khi xoá dữ liệu");
        return;
      }

      await AsyncStorage.clear();

      alert(
        "Thành công",
        "Xoá dữ liệu thành công. Đăng nhập lại để tiếp tục",
        () => navigation.replace("Login")
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.row}
        onPress={() =>
          navigation.navigate("Theme", {
            nowTheme: themeColors.primaryColorLight,
          })
        }
      >
        <View style={{ flexDirection: "row" }}>
          <Ionicons
            name="color-palette-outline"
            size={24}
            color={themeColors.primaryColorDark}
          />
          <Text style={styles.text}>Màu sắc</Text>
        </View>
        <AntDesign name="right" size={20} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.row}
        onPress={() => navigation.navigate("Currency")}
      >
        <View style={{ flexDirection: "row" }}>
          <Ionicons
            name="cash-outline"
            size={24}
            color={themeColors.primaryColorDark}
          />
          <Text style={styles.text}>Tiền tệ</Text>
        </View>
        <AntDesign name="right" size={20} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.row}
        onPress={() => handleDeleteConfirmation()}
      >
        <View style={{ flexDirection: "row" }}>
          <Ionicons
            name="trash-outline"
            size={24}
            color={themeColors.primaryColorDark}
          />
          <Text style={{ ...styles.text, color: "red" }}>
            Xoá tất cả dữ liệu
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  text: {
    marginLeft: 20,
    fontSize: 16,
  },
});
