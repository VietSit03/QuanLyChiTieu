import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeContext } from "../../Theme";
import { LoadingAction, LoadingPage } from "../../component/Loading";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DraggableFlatList from "react-native-draggable-flatlist";
import { useFocusEffect } from "@react-navigation/native";
import { alert } from "../../common";
import Feather from "@expo/vector-icons/Feather";

const CategoryScreen = ({
  type,
  isDragEnabled,
  setIsDragEnabled,
  dragCategory,
  setDragCategory,
  category,
  setCategory,
  navigation,
}) => {
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const { themeColors } = useContext(ThemeContext);

  const chunkArray = (arr, chunkSize) => {
    const result = [...arr];
    const specialCategory = { id: "special", isSpecial: true };

    result.push(specialCategory);

    while (result.length % chunkSize != 0) {
      result.push({ id: `empty-${result.length}`, empty: true });
    }

    return result;
  };

  const fetchCategory = async () => {
    const token = await AsyncStorage.getItem("token");
    const url = `${API_URL}/customcategories/all?type=${type}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          alert(
            "Hết hạn đăng nhập",
            "Phiên đăng nhập đã hết hạn. Đăng nhập lại để tiếp tục",
            () => navigation.navigate("Login")
          );
          await AsyncStorage.setItem("token", "");
          return;
        }
        return;
      }

      var apiResponse = await response.json();

      setDragCategory(apiResponse.data);
      setCategory(chunkArray(apiResponse.data, 3));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoadingPage(true);
      let isActive = true;
      async function fetchData() {
        if (isActive) {
          await fetchCategory();
          setLoadingPage(false);
        }
      }

      fetchData();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [selectedItem, setSelectedItem] = useState(null);

  const handleLongPress = (item, event) => {
    const { pageX, pageY } = event.nativeEvent;
    setModalPosition({ x: pageX, y: pageY });
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleEditItem = () => {
    setIsDragEnabled((prev) => !prev);
    setModalVisible(false);
  };

  const deleteCategory = async () => {
    const token = await AsyncStorage.getItem("token");
    var url = `${API_URL}/customcategories/delete?id=${selectedItem.id}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          alert(
            "Hết hạn đăng nhập",
            "Phiên đăng nhập đã hết hạn. Đăng nhập lại để tiếp tục",
            () => navigation.navigate("Login")
          );
          await AsyncStorage.setItem("token", "");
        } else {
          var apiResponse = await response.json();
          if (apiResponse.errorCode === "#0008") {
            alert(
              "Thao tác thất bại",
              "Xoá danh mục thất bại. Vui lòng thử lại sau"
            );
          } else if (apiResponse.errorCode === "#1011") {
            alert("Thao tác thất bại", "Bạn không thể xoá danh mục mặc định.");
          }
        }
        return;
      }

      alert("Xoá thành công", "Xoá danh mục thành công.");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteItem = () => {
    async function delCategory() {
      setLoadingAction(true);
      await deleteCategory();
      await fetchCategory();
    }

    setModalVisible(false);
    delCategory();
    setLoadingAction(false);
  };

  const Category = ({ item, drag }) => {
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
              onPress={() => navigation.navigate("AddCategory", { type: type })}
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
            <Pressable
              style={{
                height: 60,
                width: 60,
                borderRadius: 30,
                backgroundColor: item.color,
                justifyContent: "center",
                alignItems: "center",
              }}
              onLongPress={
                isDragEnabled ? drag : (event) => handleLongPress(item, event)
              }
            >
              <Image
                source={{ uri: item.imgSrc }}
                style={{ width: 40, height: 40 }}
              />
            </Pressable>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{ marginTop: 2 }}
            >
              {item.name}
            </Text>
          </View>
        )}
      </>
    );
  };

  const CategoryDrag = ({ item, drag }) => {
    if (item.isDefault) {
      return null;
    }

    return (
      <View style={[styles.categoryDrag]}>
        <View style={styles.dragItemContainer}>
          <Pressable
            style={[styles.pressable, { backgroundColor: item.color }]}
          >
            <Image source={{ uri: item.imgSrc }} style={styles.image} />
          </Pressable>
          <Text style={styles.itemName} numberOfLines={2} ellipsizeMode="tail">
            {item.name}
          </Text>
        </View>
        <Pressable
          style={styles.dragBtn}
          onLongPress={() => {
            drag();
          }}
        >
          <Feather name="menu" size={24} color="black" />
        </Pressable>
      </View>
    );
  };

  const renderRow = ({ item, drag }) => {
    return (
      <View style={{ flex: 1, marginBottom: 15, alignItems: "center" }}>
        <Category item={item} drag={drag} />
      </View>
    );
  };

  const renderRowDrag = ({ item, drag }) => {
    return <CategoryDrag item={item} drag={drag} />;
  };

  return (
    <>
      {loadingPage ? (
        <LoadingPage />
      ) : (
        <View style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 20 }}>
          {loadingAction && <LoadingAction />}
          {isDragEnabled ? (
            <DraggableFlatList
              data={dragCategory}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderRowDrag}
              scrollEnabled={true}
              onDragEnd={({ data }) => {
                setDragCategory(data);
              }}
            />
          ) : (
            <FlatList
              data={category}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderRow}
              scrollEnabled={true}
              numColumns={3}
            />
          )}

          {modalVisible && (
            <Modal
              transparent={true}
              animationType="fade"
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
              statusBarTranslucent={true}
            >
              <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={() => setModalVisible(false)}
              >
                <View
                  style={[
                    styles.modalView,
                    { top: modalPosition.y, left: modalPosition.x - 50 },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={handleEditItem}
                  >
                    <Text>Đổi thứ tự</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={handleDeleteItem}
                  >
                    <Text>Xoá</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>
          )}
        </View>
      )}
    </>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    position: "absolute",
    maxWidth: 150,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    elevation: 5,
  },
  modalButton: {
    padding: 10,
  },
  categoryDrag: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    elevation: 2,
    margin: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dragItemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pressable: {
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  itemName: {
    marginLeft: 15,
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
  },
  dragBtn: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedItem: {
    borderColor: "blue",
    borderWidth: 2,
  },
});
