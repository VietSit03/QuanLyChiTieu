import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeContext } from "../../Theme";

const CategoryScreen = ({ route, navigation }) => {
  const { type } = route.params;
  const { themeColors } = useContext(ThemeContext);
  const data = Array.from({ length: 10 }, (_, index) => ({ id: index + 1 }));

  const chunkArray = (arr, chunkSize) => {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }

    // Adding the special category
    const specialCategory = { id: "special", isSpecial: true };

    // If the last row has space for more items, push the special category there.
    if (result[result.length - 1].length < chunkSize) {
      result[result.length - 1].push(specialCategory);
    } else {
      // Otherwise, create a new row for the special category.
      result.push([specialCategory]);
    }

    // Add empty placeholders to the last row if needed
    const lastRow = result[result.length - 1];
    while (lastRow.length < chunkSize) {
      lastRow.push({ id: `empty-${lastRow.length}`, empty: true });
    }

    return result;
  };

  const rows = chunkArray(data, 3);

  const Category = ({ item }) => {
    if (item.empty) {
      return <View style={{ width: 70, height: 60 }} />;
    }
    return (
      <>
        {item.isSpecial ? (
          <View style={{ alignItems: "center", width: 70 }}>
            <TouchableOpacity
              style={{
                height: 60,
                width: 60,
                borderRadius: 30,
                backgroundColor: themeColors.primaryColorLighter,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => navigation.navigate("AddCategory")}
            >
              <Ionicons name="add-outline" size={40} color="white" />
            </TouchableOpacity>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{ marginTop: 2 }}
            >
              Tạo
            </Text>
          </View>
        ) : (
          <View style={{ alignItems: "center", width: 70 }}>
            <TouchableOpacity
              style={{
                height: 60,
                width: 60,
                borderRadius: 30,
                backgroundColor: "purple",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={{ uri: "https://imgur.com/b0SG0aW.png" }}
                style={{ width: 40, height: 40 }}
              />
            </TouchableOpacity>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{ marginTop: 2 }}
            >
              Category {item.id}
            </Text>
          </View>
        )}
      </>
    );
  };

  const renderRow = ({ item }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          marginBottom: 15,
          justifyContent: "space-around",
        }}
      >
        {item.map((category) => {
          return <Category key={category.id} item={category} />;
        })}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={rows}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderRow}
        scrollEnabled={true}
      />
    </View>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({});
