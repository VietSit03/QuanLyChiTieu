import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawer from "./CustomDrawer";
import StackNavigator from "./StackNavigator";

const Drawer = createDrawerNavigator();

function DrawerNavigator() {

  return (
    <Drawer.Navigator
      initialRouteName="StackNavigator"
      screenOptions={{
        headerShown: false,
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        name="StackNavigator"
        component={StackNavigator}
        options={{ title: "Trang chủ" }}
      />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
