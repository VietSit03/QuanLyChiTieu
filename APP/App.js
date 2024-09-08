import { createContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "./src/navigator/DrawerNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ThemeContext = createContext({});

export default function App() {
  const [themeColors, setThemeColors] = useState({
    primaryColorLight: "#20B2AA",
    primaryColorLighter: "#66CDAA",
    primaryColorDark: "#008080",
    primaryColorText: "#FFF",
  });

  useEffect(() => {
    const fetchThemeColors = async () => {
      try {
        const storedColors = await AsyncStorage.getItem("THEME_COLORS");
        if (storedColors) {
          setThemeColors(JSON.parse(storedColors));
        } else {
          await AsyncStorage.setItem(
            "THEME_COLORS",
            JSON.stringify(themeColors)
          );
          await AsyncStorage.setItem("PRIMARY_COLOR_LIGHT", "#20B2AA");
          await AsyncStorage.setItem("PRIMARY_COLOR_LIGHTER", "#66CDAA");
          await AsyncStorage.setItem("PRIMARY_COLOR_DARK", "#008080");
          await AsyncStorage.setItem("TEXT_COLOR", "#FFF");
        }
      } catch (error) {
        console.log("Error fetching color:", error);
      }
    };

    fetchThemeColors();
  }, []);

  return (
    <ThemeContext.Provider value={{ themeColors, setThemeColors }}>
      <NavigationContainer>
        <DrawerNavigator />
      </NavigationContainer>
    </ThemeContext.Provider>
  );
}
