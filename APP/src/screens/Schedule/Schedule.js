import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SwipeListView } from "react-native-swipe-list-view";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { Switch } from "react-native-paper";
import AddSchedule from "./AddSchedule";
import { ThemeContext } from "../../Theme";
import { LoadingPage } from "../../component/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import { alert } from "../../common";
import { useFocusEffect } from "@react-navigation/native";

const ScheduleSwitch = React.memo(
  ({ item, toggleSwitch, color }) => {
    return (
      <Switch
        value={item.isActive}
        onChange={() => toggleSwitch(item.id)}
        color={color}
      />
    );
  },
  (prevProps, nextProps) => prevProps.item.isActive === nextProps.item.isActive
);

const Schedule = ({ navigation }) => {
  const { themeColors } = useContext(ThemeContext);
  const [loadingPage, setLoadingPage] = useState(true);

  const [schedule, setSchedule] = useState([]);

  const toggleSwitch = useCallback((id) => {
    setSchedule((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    );

    async function changeActive() {
      await fetchChangeActive(id);
    }

    changeActive();
  }, []);

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        await fetchSchedule();
        setLoadingPage(false);
      }

      fetchData();
    }, [])
  );

  // useEffect(() => {
  //   async function fetchData() {
  //     await fetchSchedule();
  //   }

  //   fetchData();
  //   setLoadingPage(false);
  // }, []);

  const fetchSchedule = async () => {
    const token = await AsyncStorage.getItem("token");
    const url = `${API_URL}/schedules/all`;

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

      setSchedule(apiResponse.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchChangeActive = async (id) => {
    const token = await AsyncStorage.getItem("token");
    const url = `${API_URL}/schedules/toggleactive?id=${id}`;

    try {
      const response = await fetch(url, {
        method: "PUT",
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

        setSchedule((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, isActive: !item.isActive } : item
          )
        );
        alert("Lỗi", "Xảy ra lỗi", () => navigation.navigate("Login"));
        return;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <Pressable
        style={styles.rowFront}
        onPress={() => navigation.navigate("EditSchedule", {id: item.id})}
      >
        <Text>{item.name}</Text>
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
        onPress={() => handleDeleteSchedule(item.id)}
      >
        <EvilIcons name="trash" size={32} color="#F0F0F0" />
      </TouchableOpacity>
    </View>
  );

  const handleDeleteSchedule = (id) => {
    alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn xoá lịch thanh toán này?",
      () => fetchDelete(id),
      "cancel"
    );
  };

  const fetchDelete = async (id) => {
    const token = await AsyncStorage.getItem("token");
    const url = `${API_URL}/schedules/delete?id=${id}`;

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
        alert("Lỗi", "Xảy ra lỗi khi xoá lịch thanh toán");
        return;
      }

      alert(
        "Thành công",
        "Xoá lịch thanh toán thành công",
        navigation.replace("Schedule")
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
            data={schedule}
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
