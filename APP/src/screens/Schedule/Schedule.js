import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SwipeListView } from "react-native-swipe-list-view";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { Switch } from "react-native-paper";
import AddSchedule from "./AddSchedule";
import { ThemeContext } from "../../../App";

const ScheduleSwitch = React.memo(
  ({ item, toggleSwitch, color }) => {
    return (
      <Switch
        value={item.isEnabled}
        onChange={() => toggleSwitch(item.key)}
        color={color}
      />
    );
  },
  (prevProps, nextProps) =>
    prevProps.item.isEnabled === nextProps.item.isEnabled
);

const Schedule = ({ navigation }) => {
  const { themeColors } = useContext(ThemeContext);
  const [loadingPage, setLoadingPage] = useState(true);

  const [data, setData] = useState([
    { key: "1", text: "Nhận tiền lương", isEnabled: false },
    { key: "2", text: "Trả tiền nhà", isEnabled: false },
    { key: "3", text: "Đóng tiền học", isEnabled: false },
  ]);

  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = useCallback((key) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, isEnabled: !item.isEnabled } : item
      )
    );
  }, []);

  useEffect(() => {
    async function fetchPrimaryColor() {}

    fetchPrimaryColor();
    setLoadingPage(false);
  }, []);

  const renderItem = ({ item }) => {
    return (
      <Pressable
        style={styles.rowFront}
        onPress={() => navigation.navigate("AddSchedule")}
      >
        <Text>{item.text}</Text>
        <ScheduleSwitch
          item={item}
          toggleSwitch={toggleSwitch}
          color={themeColors.primaryColorDark}
        />
      </Pressable>
    );
  };

  const renderHiddenItem = ({ item }) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.btnDelete]}
        onPress={() => handleDeleteSchedule(item.key)}
      >
        <EvilIcons name="trash" size={32} color="#F0F0F0" />
      </TouchableOpacity>
    </View>
  );

  const handleDeleteSchedule = (key) => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xoá lịch thanh toán này?", [
      {
        text: "Huỷ bỏ",
        style: "cancel",
      },
      {
        text: "Xoá",
        onPress: () => {
          setLoadingPage(true);
          setTimeout(() => {
            setLoadingPage(false);
            Alert.alert("Xoá thành công", "Lịch thanh toán đã được xoá.");
          }, 2000);
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <>
      {loadingPage ? (
        <ActivityIndicator size={"large"} style={{ marginTop: 10 }} />
      ) : (
        <View style={styles.container}>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => navigation.navigate(AddSchedule)}
          >
            <Ionicons
              name="add-circle"
              size={24}
              color={themeColors.primaryColorLight}
            />
            <Text style={{ fontSize: 16, marginLeft: 10 }}>TẠO</Text>
          </TouchableOpacity>
          <SwipeListView
            data={data}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            leftOpenValue={50}
            disableLeftSwipe
            stopLeftSwipe={50}
            style={styles.flatlist}
          />
        </View>
      )}
    </>
  );
};

export default Schedule;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 30,
  },
  flatlist: {
    marginTop: 30,
  },
  rowFront: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderBottomColor: "#CCC",
    borderBottomWidth: 1,
    justifyContent: "space-between",
    height: 50,
    paddingLeft: 20,
    marginTop: 20,
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingLeft: 15,
    marginTop: 20,
  },
  btnDelete: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 50,
    left: 0,
    backgroundColor: "#FF4500",
  },
});
