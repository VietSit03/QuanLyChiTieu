import Entypo from "@expo/vector-icons/Entypo";
import { DrawerActions } from "@react-navigation/native";

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
