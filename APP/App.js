import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "./src/navigator/DrawerNavigator";
import { ThemeProvider } from "./src/Theme";

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <DrawerNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
}
