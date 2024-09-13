import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../Theme";

const purpose = [
  { purposeName: "Đồ ăn", code: "FOOD" },
  { purposeName: "Thức uống", code: "DRINK" },
  // { purposeName: "Sức khoẻ", code: "HEALTH" },
  // { purposeName: "Di chuyển", code: "MOVING" },
  // { purposeName: "Mua sắm", code: "SHOPPING" },
  // { purposeName: "Làm đẹp", code: "BEAUTY" },
  // { purposeName: "Giải trí", code: "ENTERTAINMENT" },
  // { purposeName: "Giáo dục", code: "EDUCATION" },
  // { purposeName: "Khác", code: "OTHER" },
];

const Purpose = React.memo(({ item, data, render }) => {
  return (
    <View style={{ marginBottom: 25 }}>
      <Text style={{ fontSize: 16, marginBottom: 15 }}>{item.purposeName}</Text>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={render}
        scrollEnabled={false}
        style={styles.flCategory}
      />
    </View>
  );
});

const Icon = React.memo(
  ({ item, handle, selectedCategory, colorSelected }) => {
    console.log(item);
    if (item.empty) {
      return <View style={{ width: 80, height: 80 }} />;
    }
    return (
      <View
        style={{
          alignItems: "center",
          borderWidth: item.id == selectedCategory.id ? 1 : 0,
          padding: item.id == selectedCategory.id ? 9 : 10,
          borderColor: "gray",
          borderRadius: 10,
        }}
      >
        <TouchableOpacity
          style={{
            height: 60,
            width: 60,
            borderRadius: 30,
            backgroundColor:
              item.id == selectedCategory.id ? colorSelected : "#DCDCDC",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={handle}
        >
          <Image
            source={{ uri: "https://imgur.com/b0SG0aW.png" }}
            style={{ width: 40, height: 40 }}
          />
        </TouchableOpacity>
      </View>
    );
  },
  (prevProps, nextProps) => {
    return (
      !(
        prevProps.item.id === nextProps.selectedCategory.id ||
        prevProps.item.id === prevProps.selectedCategory.id
      ) || prevProps.selectedCategory === nextProps.selectedCategory
    );
  }
);

const IconCategory = () => {
  const { themeColors } = useContext(ThemeContext);
  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    async function fetchColor() {
      setLoadingPage(true);
      setLoadingPage(false);
    }

    fetchColor();
  }, []);

  const data = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
  }));

  const [selectedCategory, setSelectedCategory] = useState({ id: -1 });

  const chunkArray = (arr, chunkSize) => {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      while (chunk.length < chunkSize) {
        chunk.push({ id: `empty-${chunk.length}`, empty: true });
      }
      result.push(chunk);
    }
    return result;
  };

  const rows = chunkArray(data, 4);

  useEffect(() => {
    chunkArray(data, 4);
  }, [data]);

  const renderCategory = ({ item }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          marginBottom: 15,
          justifyContent: "space-between",
        }}
      >
        {item.map((icon) => {
          return (
            <Icon
              key={icon.id}
              item={icon}
              selectedCategory={selectedCategory}
              handle={() => setSelectedCategory(icon)}
              colorSelected={themeColors.primaryColorDark}
            />
          );
        })}
      </View>
    );
  };

  const renderPurpose = ({ item }) => {
    return <Purpose item={item} data={rows} render={renderCategory} />;
  };

  return (
    <>
      {loadingPage ? (
        <ActivityIndicator size={"large"} />
      ) : (
        <View style={styles.container}>
          <ScrollView style={styles.scrollView}>
            <FlatList
              data={purpose}
              keyExtractor={(item) => item.code}
              renderItem={renderPurpose}
              scrollEnabled={false}
              style={styles.flPurpose}
            />
            <View style={{ backgroundColor: "transparent", height: 50 }}></View>
          </ScrollView>
          <View style={styles.btnSelect}>
            <TouchableOpacity
              style={
                selectedCategory.id != -1
                  ? styles.btnSelectActive
                  : styles.btnSelectInactive
              }
              disabled={selectedCategory.id == -1}
            >
              <Text>Chọn</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

export default IconCategory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  flPurpose: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  btnSelect: {
    position: "absolute",
    bottom: 10, // Khoảng cách từ dưới màn hình lên
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  btnSelectInactive: {
    backgroundColor: "gold",
    width: "65%",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 500,
    opacity: 0.5,
  },
  btnSelectActive: {
    backgroundColor: "gold",
    width: "65%",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 500,
  },
});
