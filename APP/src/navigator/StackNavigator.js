import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home/Home";
import Schedule from "../screens/Schedule/Schedule";
import Category from "../screens/Category/Category";
import Setting from "../screens/SettingScreen/Setting";
import AddCategory from "../screens/Category/AddCategory";
import { useContext } from "react";
import IconCategory from "../screens/Category/IconCategory";
import AddSchedule from "../screens/Schedule/AddSchedule";
import CategoryScreen from "../screens/Category/CategoryScreen";
import Theme from "../screens/SettingScreen/Theme";
import Currency from "../screens/SettingScreen/Currency";
import { ThemeContext } from "../Theme";
import AddTransaction from "../screens/Transaction/AddTransaction";
import Login from "../screens/Login/Login";
import Register from "../screens/Login/Register";
import ForgetPassword from "../screens/Login/ForgetPassword";
import ChangePassword from "../screens/Login/ChangePassword";
import { DrawerNavigator } from "../component/Button";
import ListCategory from "../screens/Category/ListCategory";

const Stack = createStackNavigator();

function StackNavigator({ navigation }) {
  const { themeColors } = useContext(ThemeContext);

  const screenOptions = () => ({
    headerStyle: {
      backgroundColor: themeColors.primaryColorLight,
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "500",
    },
  });

  const drawer = (title) => ({
    headerLeft: () => <DrawerNavigator navigation={navigation} />,
    title: title,
  });

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={drawer("Trang chủ")}
      />
      <Stack.Screen
        name="Schedule"
        component={Schedule}
        options={drawer("Thanh toán theo lịch")}
      />
      <Stack.Screen
        name="Category"
        component={Category}
        // options={drawer("Danh mục")}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Setting"
        component={Setting}
        options={drawer("Cài đặt")}
      />
      <Stack.Screen
        name="AddCategory"
        component={AddCategory}
        options={{ title: "Tạo danh mục" }}
      />
      <Stack.Screen
        name="IconCategory"
        component={IconCategory}
        options={{ title: "Biểu tượng danh mục" }}
      />
      <Stack.Screen
        name="AddSchedule"
        component={AddSchedule}
        options={{ title: "Tạo lịch thanh toán" }}
      />
      <Stack.Screen
        name="CategoryScreen"
        component={CategoryScreen}
        options={{ title: "Danh mục" }}
      />
      <Stack.Screen
        name="Theme"
        component={Theme}
        options={{ title: "Màu sắc" }}
      />
      <Stack.Screen
        name="Currency"
        component={Currency}
        options={{ title: "Tiền tệ" }}
      />
      <Stack.Screen
        name="AddTransaction"
        component={AddTransaction}
        options={{ title: "Thêm giao dịch" }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgetPassword"
        component={ForgetPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ListCategory"
        component={ListCategory}
        options={{ title: "Danh sách danh mục" }}
      />
    </Stack.Navigator>
  );
}

export default StackNavigator;
