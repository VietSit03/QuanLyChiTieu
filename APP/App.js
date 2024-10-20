import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "./src/navigator/DrawerNavigator";
import { ThemeProvider } from "./src/Theme";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import Login from "./src/screens/Login/Login";
import { createStackNavigator } from "@react-navigation/stack";
import Register from "./src/screens/Login/Register";
import ForgetPassword from "./src/screens/Login/ForgetPassword";
import { ActivityIndicator } from "react-native";
import ChangePassword from "./src/screens/Login/ChangePassword";
import registerNNPushToken from "native-notify";
import { APP_ID, APP_TOKEN } from "@env";
import * as Notifications from "expo-notifications";
import axios from "axios";

const Stack = createStackNavigator();

export default function App() {
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  registerNNPushToken(APP_ID, APP_TOKEN);

  useEffect(() => {
    checkToken();
    registerForPushNotificationsAsync();
    setTimeout(async () => {
      sendPushNotification(
        await AsyncStorage.getItem("deviceToken"),
        "Thông báo tự động",
        "Đây là thông báo gửi đến một số thiết bị!"
      );

      scheduleNotification();
    }, 1000);
  }, []);

  const registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Nếu chưa có quyền, yêu cầu quyền
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // Nếu người dùng không cấp quyền, dừng lại
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }

    // Lấy mã thông báo đẩy
    const token = await Notifications.getExpoPushTokenAsync();
    await AsyncStorage.setItem("deviceToken", token.data);
  };

  const sendPushNotification = async (device, title, body) => {
    const message = {
      to: device,
      sound: "default",
      title: title,
      body: body,
      data: { someData: "goes here" },
    };

    try {
      const response = await axios.post(
        "https://exp.host/--/api/v2/push/send",
        message
      );
      console.log("Notification sent:", response.data);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const scheduleNotification = async () => {
    const trigger = new Date();
    trigger.setSeconds(trigger.getSeconds() + 20);

    console.log(trigger);
    if (trigger < new Date()) {
      console.log("a");
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Thông báo đặt lịch",
        body: "Đây là thông báo gửi đến một số thiết bị!",
      },
      trigger,
    });
  };

  const checkToken = async () => {
    var token = await AsyncStorage.getItem("token");
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
        setIsLogin(false);
        setIsLoadingPage(false);
        return;
      }

      setIsLogin(true);
      setIsLoadingPage(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      {isLoadingPage ? (
        <ActivityIndicator style={{ marginTop: 50 }} size={"large"} />
      ) : (
        <>
          {isLogin ? (
            <ThemeProvider>
              <NavigationContainer>
                {/* <DrawerNavigator /> */}
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                  <Stack.Screen
                    name="DrawerNavigator"
                    component={DrawerNavigator}
                  />
                  <Stack.Screen name="Login" component={Login} />
                  <Stack.Screen name="Register" component={Register} />
                  <Stack.Screen
                    name="ForgetPassword"
                    component={ForgetPassword}
                  />
                  <Stack.Screen
                    name="ChangePassword"
                    component={ChangePassword}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </ThemeProvider>
          ) : (
            <ThemeProvider>
              <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="Login" component={Login} />
                  <Stack.Screen name="Register" component={Register} />
                  <Stack.Screen
                    name="ForgetPassword"
                    component={ForgetPassword}
                  />
                  <Stack.Screen
                    name="ChangePassword"
                    component={ChangePassword}
                  />
                  <Stack.Screen
                    name="DrawerNavigator"
                    component={DrawerNavigator}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </ThemeProvider>
          )}
        </>
      )}
    </>
  );
}
