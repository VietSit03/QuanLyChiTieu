import { StyleSheet, View, Image } from "react-native";

export const Logo = () => {
  return (
    <View style={styles.bgLogo}>
      <Image source={require("../../assets/logo.png")} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  bgLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#1F9978",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
