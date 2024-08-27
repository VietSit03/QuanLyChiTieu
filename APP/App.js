import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "./src/navigator/DrawerNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  useEffect(() => {
    const fetchColor = async () => {
      try {
        // if (!storedColor) {
          await AsyncStorage.setItem("PRIMARY_COLOR_LIGHT", "#20B2AA");
          console.log(await AsyncStorage.getItem("PRIMARY_COLOR_LIGHT"));
          await AsyncStorage.setItem("PRIMARY_COLOR_LIGHTER", "#66CDAA");
          await AsyncStorage.setItem("PRIMARY_COLOR_DARK", "#008080");
          await AsyncStorage.setItem("TEXT_COLOR", "#FFF");
        // }
      } catch (error) {
        console.log("Error fetching color:", error);
      }
    };

    fetchColor();
  }, []);

  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
}
