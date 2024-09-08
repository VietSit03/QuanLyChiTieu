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
import AsyncStorage from "@react-native-async-storage/async-storage";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useFocusEffect } from "@react-navigation/native";
import { ThemeContext } from "../../../App";

const Setting = ({ navigation }) => {
  const { themeColors } = useContext(ThemeContext);

  const handleDeleteConfirmation = () => {
    Alert.alert(
      "Xác nhận",
      "Tất cả dữ liệu sẽ bị xoá. Tiếp tục?",
      [
        {
          text: "Không",
          onPress: () => console.log("Huỷ xoá"),
          style: "cancel",
        },
        {
          text: "Có",
          onPress: () => handleDelete(),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const handleDelete = () => {
    console.log("Xoá");
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
