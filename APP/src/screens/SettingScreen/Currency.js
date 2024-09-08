import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Currency = () => {
  return (
    <View style={styles.container}>
      <Text>Currency</Text>
    </View>
  );
};

export default Currency;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
