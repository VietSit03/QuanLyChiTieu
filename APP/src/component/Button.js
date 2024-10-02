import Entypo from "@expo/vector-icons/Entypo";
import { DrawerActions } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

export const DrawerNavigator = ({ navigation }) => {
  return (
    <Entypo
      name="menu"
      size={26}
      color="white"
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      style={{ marginLeft: 15 }}
    />
  );
};

export const BackButton = ({ navigation }) => {
  return (
    <Ionicons
      name="arrow-back-sharp"
      size={26}
      color="white"
      onPress={() => navigation.goBack()}
      style={{ marginLeft: 15 }}
    />
  );
};
