import { API_URL, CRYPTOJS_KEY } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CryptoJS from "crypto-js";
import { Alert } from "react-native";
import * as Notifications from "expo-notifications";

export const encrypt = (text) => {
  var encrypted = CryptoJS.HmacSHA256(text, CRYPTOJS_KEY).toString().slice(7);

  const first3Chars = encrypted.slice(0, 3);
  const remainingChars = encrypted.slice(3);
  encrypted =
    remainingChars.slice(0, 3) + first3Chars + remainingChars.slice(3);

  const last4Chars = encrypted.slice(-4);
  encrypted = (last4Chars + encrypted.slice(0, -4)).slice(7, 22);

  return encrypted;
};

export const isEmptyInput = (key, setKey) => {
  if (key.value === "" || key.value === null) {
    setKey({ ...key, error: `${key.title} không được trống` });
    return true;
  } else {
    setKey({ ...key, error: "" });
    return false;
  }
};

export const alert = (title, content, actionOK, actionCancel) => {
  if (title != "" && content != "") {
    if (actionOK != "") {
      if (actionCancel == "cancel") {
        Alert.alert(title, content, [
          {
            text: "Huỷ bỏ",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: actionOK,
          },
        ]);
        return;
      }
      Alert.alert(title, content, [
        {
          text: "OK",
          onPress: actionOK,
        },
      ]);
      return;
    }
    Alert.alert(title, content);
    return;
  }
  Alert.alert("Lỗi", "Xảy ra lỗi. Vui lòng thử lại sau.");
};

export const checkToken = async (navigation) => {
  const token = await AsyncStorage.getItem("token");
  const url = `${API_URL}/CheckToken`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      alert(
        "Hết hạn đăng nhập",
        "Phiên đăng nhập đã hết hạn. Đăng nhập lại để tiếp tục",
        () => navigation.navigate("Login")
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const formatMoney = (money) => {
  if (money < 1_000_000) {
    return money.toLocaleString("vi-VN");
  } else if (money >= 1_000_000 && money < 1_000_000_000) {
    return (
      parseFloat((money / 1_000_000).toFixed(3))
        .toString()
        .replace(".", ",") + " Tr"
    );
  } else {
    return (
      parseFloat((money / 1_000_000_000).toFixed(3))
        .toString()
        .replace(".", ",") + " T"
    );
  }
};

export const setScheduleNotification = async (title, body, trigger) => {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
    },
    trigger,
  });

  return id;
};

export const cancelNotification = async (notificationId) => {
  if (notificationId) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }
};