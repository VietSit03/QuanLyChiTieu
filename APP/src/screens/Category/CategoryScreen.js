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

const CategoryScreen = ({
  type,
  isDragEnabled,
  setIsDragEnabled,
  navigation,
}) => {
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const { themeColors } = useContext(ThemeContext);
  const [category, setCategory] = useState();

  const chunkArray = (arr, chunkSize) => {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }

    const specialCategory = { id: "special", isSpecial: true };

    if (result[result.length - 1].length < chunkSize) {
      result[result.length - 1].push(specialCategory);
    } else {
      result.push([specialCategory]);
    }

    const lastRow = result[result.length - 1];
    while (lastRow.length < chunkSize) {
      lastRow.push({ id: `empty-${lastRow.length}`, empty: true });
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

      setCategory(apiResponse.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
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

  const renderRow = ({ item, drag }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          marginBottom: 15,
          justifyContent: "space-around",
        }}
      >
        {item.map((category, index) => {
          return (
            <Category key={index.toString()} item={category} drag={drag} />
          );
        })}
      </View>
    );
  };

  return (
    <>
      {loadingPage ? (
        <LoadingPage />
      ) : (
        <View style={{ flex: 1, padding: 20 }}>
          {loadingAction && <LoadingAction />}
          {isDragEnabled ? (
            <DraggableFlatList
              data={chunkArray(category, 4)}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderRow}
              scrollEnabled={true}
              onDragEnd={({ data }) => {
                setCategory(data);
              }}
              onTouchStart={(data) => {
                console.log(data);
              }}
            />
          ) : (
            <FlatList
              data={chunkArray(category, 3)}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderRow}
              scrollEnabled={true}
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
});
