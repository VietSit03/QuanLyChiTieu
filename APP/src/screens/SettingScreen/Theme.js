import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "../../Theme";
import { useFocusEffect } from "@react-navigation/native";

const Color = React.memo(
  ({ item, selectedColor, handle }) => {
    return (
      <Pressable
        style={{
          width: 35,
          height: 35,
          borderRadius: 17.5,
          backgroundColor: item.primaryColorLight,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 10,
        }}
        onPress={handle}
      >
        {selectedColor == item.primaryColorLight && (
          <Feather name="check" size={26} color="white" />
        )}
      </Pressable>
    );
  },
  (prevProps, nextProps) =>
    prevProps.selectedColor === nextProps.selectedColor &&
    prevProps.item.primaryColorLight === nextProps.item.primaryColorLight
);

const Theme = ({ route, navigation }) => {
  const [loadingPage, setLoadingPage] = useState(true);
  const { themeColors } = useContext(ThemeContext);
  const { setThemeColors } = useContext(ThemeContext);
  const [selectedColor, setSelectedColor] = useState();
  const [color, setColor] = useState([
    {
      primaryColorLight: "#FF7F50",
      primaryColorLighter: "#FF9800",
      primaryColorDark: "#FF8C00",
      primaryColorText: "#FFF",
    },
    {
      primaryColorLight: "#FF69B4",
      primaryColorLighter: "#FFB6C1",
      primaryColorDark: "#C71585",
      primaryColorText: "#FFF",
    },
    {
      primaryColorLight: "#20B2AA",
      primaryColorLighter: "#66CDAA",
      primaryColorDark: "#008080",
      primaryColorText: "#FFF",
    },
    {
      primaryColorLight: "#7E5C4F",
      primaryColorLighter: "#CD853F",
      primaryColorDark: "#A0522D",
      primaryColorText: "#FFF",
    },
    {
      primaryColorLight: "#BA55D3",
      primaryColorLighter: "#EE82EE",
      primaryColorDark: "#800080",
      primaryColorText: "#FFF",
    },
  ]);

  useFocusEffect(
    useCallback(() => {
      setSelectedColor(themeColors.primaryColorLight);
      setLoadingPage(false);
    }, [themeColors])
  );

  const handleTheme = (item) => {
    setSelectedColor(item.primaryColorLight);
    async function setTheme() {
      try {
        const themeColors = {
          primaryColorLight: item.primaryColorLight,
          primaryColorLighter: item.primaryColorLighter,
          primaryColorDark: item.primaryColorDark,
          primaryColorText: item.primaryColorText,
        };
        await AsyncStorage.setItem("THEME_COLORS", JSON.stringify(themeColors));
        setThemeColors(themeColors);
      } catch (error) {
        console.log("Error saving theme:", error);
      }
    }
    setTheme();

    navigation.navigate("Theme");
  };
  const renderColor = ({ item }) => {
    return (
      <Color
        item={item}
        selectedColor={selectedColor}
        handle={() => handleTheme(item)}
      />
    );
  };

  return (
    <>
      {loadingPage ? (
        <ActivityIndicator size={"large"} />
      ) : (
        <View style={styles.container}>
          <FlatList
            style={styles.fl}
            data={color}
            keyExtractor={(item) => item.primaryColorLight}
            renderItem={renderColor}
            horizontal={true}
          />
        </View>
      )}
    </>
  );
};

export default Theme;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fl: {
    marginTop: 20,
  },
});
