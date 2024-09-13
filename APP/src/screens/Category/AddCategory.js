import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, {useContext, useEffect, useState } from "react";
import { RadioButton } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { ThemeContext } from "../../Theme";

const Color = React.memo(
  ({ item, selectedColor, handle }) => {
    return (
      <Pressable
        style={{
          width: 35,
          height: 35,
          borderRadius: 17.5,
          backgroundColor: item.colorCode,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 10,
        }}
        onPress={handle}
      >
        {selectedColor == item.colorCode && (
          <Feather name="check" size={26} color="white" />
        )}
      </Pressable>
    );
  },
  (prevProps, nextProps) =>
    prevProps.selectedColor === nextProps.selectedColor &&
    prevProps.item.colorCode === nextProps.item.colorCode
);

const AddCategory = ({ navigation }) => {
  const { themeColors } = useContext(ThemeContext);
  const [loadingPage, setLoadingPage] = useState(true);
  const [checked, setChecked] = useState("CHI");
  const [selectedColor, setSelectedColor] = useState();
  const [color, setColor] = useState([
    { colorCode: "#E91E63" },
    { colorCode: "#4CAF50" },
    { colorCode: "#2196F3" },
    { colorCode: "#7E5C4F" },
    { colorCode: "#FF9800" },
    { colorCode: "#800080" },
  ]);

  useEffect(() => {
    async function fetchColor() {
      setLoadingPage(true);
      setSelectedColor(color[0].colorCode);
      setLoadingPage(false);
    }

    fetchColor();
  }, []);

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

  const rows = chunkArray(data, 4);

  const Icon = ({ item }) => {
    if (item.empty) {
      return <View style={{ width: 60, height: 60 }} />;
    }
    return (
      <>
        {item.isSpecial ? (
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              style={{
                height: 60,
                width: 60,
                borderRadius: 30,
                backgroundColor: themeColors.primaryColorLighter,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => navigation.navigate("IconCategory")}
            >
              <Ionicons name="add-outline" size={40} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ alignItems: "center" }}>
            <Pressable
              style={{
                height: 60,
                width: 60,
                borderRadius: 30,
                backgroundColor: selectedColor,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={{ uri: "https://imgur.com/b0SG0aW.png" }}
                style={{ width: 40, height: 40 }}
              />
            </Pressable>
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
          justifyContent: "space-between",
        }}
      >
        {item.map((icon) => {
          return <Icon key={icon.id} item={icon} />;
        })}
      </View>
    );
  };

  const renderColor = ({ item }) => {
    return (
      <Color
        item={item}
        selectedColor={selectedColor}
        handle={() => setSelectedColor(item.colorCode)}
      />
    );
  };

  const handleAddCategory = () => {
    console.log("add category");
  };

  return (
    <>
      {loadingPage ? (
        <ActivityIndicator size={"large"} />
      ) : (
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ ...styles.fdRow, marginTop: 20 }}>
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: selectedColor,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={{ uri: "https://imgur.com/b0SG0aW.png" }}
                style={{ width: 20, height: 20 }}
              />
            </View>
            <TextInput
              placeholder="Tên danh mục"
              style={{ ...styles.textInput, borderBottomColor: themeColors.primaryColorLight }}
            ></TextInput>
          </View>
          <RadioButton.Group
            onValueChange={(value) => setChecked(value)}
            value={checked}
          >
            <View style={{ ...styles.fdRow, marginTop: 20 }}>
              <TouchableOpacity
                style={styles.fdRow}
                onPress={() => setChecked("CHI")}
              >
                <RadioButton value="CHI"></RadioButton>
                <Text style={{ fontSize: 16 }}>Chi phí</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ ...styles.fdRow, marginLeft: 30 }}
                onPress={() => setChecked("THU")}
              >
                <RadioButton value="THU"></RadioButton>
                <Text style={{ fontSize: 16 }}>Thu nhập</Text>
              </TouchableOpacity>
            </View>
          </RadioButton.Group>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Biểu tượng</Text>
            <FlatList
              style={styles.sectionBody}
              data={rows}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderRow}
              scrollEnabled={false}
            />
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Màu sắc</Text>
            <FlatList
              style={styles.sectionBody}
              data={color}
              keyExtractor={(item) => item.colorCode}
              renderItem={renderColor}
              scrollEnabled={false}
              horizontal={true}
            />
          </View>
          <View
            style={{
              ...styles.fdRow,
              marginTop: 30,
              justifyContent: "center",
              paddingBottom: 10,
            }}
          >
            <TouchableOpacity
              style={styles.btnAdd}
              onPress={() => handleAddCategory()}
            >
              <Text style={{ fontSize: 16 }}>Thêm</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default AddCategory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  fdRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
    borderBottomWidth: 2,
    padding: 0,
    fontSize: 16,
  },
  sectionContainer: {
    marginTop: 20,
  },
  sectionHeader: {
    color: "gray",
  },
  sectionBody: { marginTop: 20 },
  btnAdd: {
    backgroundColor: "#FFC125",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: "70%",
    borderRadius: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
