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

const Stack = createStackNavigator();

export default function App() {
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    checkToken();
  }, []);

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
        <ActivityIndicator style={{marginTop: 50}} size={"large"} />
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
