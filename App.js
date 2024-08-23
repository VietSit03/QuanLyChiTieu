import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "./src/navigator/DrawerNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  useEffect(() => {
    const fetchColor = async () => {
      try {
        const storedColor = await AsyncStorage.getItem("PRIMARY_COLOR");
        // if (!storedColor) {
          await AsyncStorage.setItem("PRIMARY_COLOR", "#20B2AA");
          await AsyncStorage.setItem("HEADER_BG_COLOR", "#008080");
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
