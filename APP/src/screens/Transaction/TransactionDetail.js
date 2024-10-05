import {
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { BackButton } from "../../component/Button";
import { ThemeContext } from "../../Theme";
import { LoadingPage } from "../../component/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AntDesign from "@expo/vector-icons/AntDesign";
import { API_URL } from "@env";
import ImageViewer from "react-native-image-zoom-viewer";
import { alert } from "../../common";

const TransactionDetail = ({ navigation, route }) => {
  const { themeColors } = useContext(ThemeContext);
  const { transId } = route.params;
  const [loadingPage, setLoadingPage] = useState(true);
  const [symbolCur, setSymbolCur] = useState("");
  const [transaction, setTransaction] = useState(null);

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openImage = (item) => {
    setSelectedImage([{ url: item }]); // Chuyển thành dạng mảng object cho ImageViewer
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  useEffect(() => {
    async function fetchData() {
      await fetchGetTransaction();
      setSymbolCur(await AsyncStorage.getItem("currencySymbol"));
      setLoadingPage(false);
    }

    fetchData();
  }, []);

  const fetchGetTransaction = async () => {
    const token = await AsyncStorage.getItem("token");
    const url = `${API_URL}/transactions/get?transId=${transId}`;

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
        alert("Lỗi", "Xảy ra lỗi khi lấy dữ liệu.");
        return;
      }

      const apiResponse = await response.json();

      setTransaction(apiResponse.data);
      console.log(apiResponse.data.category);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchDeleteTransaction = async () => {
    const token = await AsyncStorage.getItem("token");
    const url = `${API_URL}/transactions/delete?transId=${transId}`;

    try {
      const response = await fetch(url, {
        method: "DELETE",
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
        alert("Lỗi", "Xảy ra lỗi khi lấy dữ liệu.");
        return;
      }

      alert(
        "Thao tác thành công",
        "Xoá giao dịch thành công",
        () => navigation.replace("Home")
      );

    } catch (error) {
      console.error("Error:", error);
    }
  };

  const Header = () => {
    return (
      <View
        style={{
          ...styles.header,
          backgroundColor: themeColors.primaryColorLight,
        }}
      >
        <View
          style={{
            height: 30,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <BackButton navigation={navigation} />
          <Text style={styles.title}>Chi tiết giao dịch</Text>
        </View>
        <Pressable
          style={styles.btnRight}
          // onPress={() => setIsEditting(!isEditting)}
        >
          <AntDesign name="edit" size={24} color="white" />
        </Pressable>
      </View>
    );
  };

  const handleRightBtn = () => {};

  const Row = ({ title, content, category }) => {
    return (
      <View style={{ marginTop: 20 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        <View
          style={{ flexDirection: "row", marginTop: 5, alignItems: "center" }}
        >
          {category && (
            <View
              style={{
                ...styles.circleIcon,
                backgroundColor: category.color,
              }}
            >
              <Image
                source={{ uri: category.imgSrc }}
                style={{
                  height: 20,
                  width: 20,
                  backgroundColor: "transparent",
                }}
              />
            </View>
          )}
          <Text
            style={styles.rowContent}
            ellipsizeMode="tail"
            numberOfLines={2}
          >
            {content}
          </Text>
        </View>
      </View>
    );
  };

  const FormatDateTime = (dateTime) => {
    const now = new Date(dateTime);
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    return `${day} Th${month}, ${year} ${hours}:${
      minutes < 10 ? "0" : ""
    }${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const Footer = () => {
    return (
      <View style={{ marginTop: 10 }}>
        <TouchableOpacity style={{ paddingVertical: 10 }}>
          <Text style={{ color: "darkgreen" }}>SAO CHÉP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ paddingVertical: 10 }} onPress={() => fetchDeleteTransaction()}>
          <Text style={{ color: "red" }}>XOÁ</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      {loadingPage ? (
        <LoadingPage />
      ) : (
        <View style={styles.container}>
          <Header />
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ paddingHorizontal: 20 }}
          >
            <Row
              key={"Money"}
              title={"Số tiền"}
              content={`${transaction.money} ${symbolCur}`}
            />
            <Row
              key={"Category"}
              title={"Danh mục"}
              content={transaction.category.name}
              category={transaction.category}
            />
            <Row
              key={"Time"}
              title={"Thời gian"}
              content={FormatDateTime(transaction.createAt)}
            />
            <View style={{ marginTop: 20 }}>
              <Text style={styles.rowTitle}>Ảnh</Text>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 5,
                  alignItems: "center",
                }}
              >
                <FlatList
                  data={transaction.img}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.imageContainer}>
                      <TouchableOpacity onPress={() => openImage(item)}>
                        <Image source={{ uri: item }} style={styles.image} />
                      </TouchableOpacity>
                    </View>
                  )}
                  showsHorizontalScrollIndicator={false}
                  horizontal
                />
              </View>
            </View>
            <Footer />
            <Modal visible={isModalVisible} transparent={true}>
              <ImageViewer
                imageUrls={selectedImage}
                onSwipeDown={closeModal}
                enableSwipeDown={true}
                renderIndicator={() => null}
                style={{ marginVertical: 50 }}
              />
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeText}>Đóng</Text>
              </TouchableOpacity>
            </Modal>
          </ScrollView>
          {isModalVisible && (
            <View
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
          )}
        </View>
      )}
    </>
  );
};

export default TransactionDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 92,
    paddingBottom: 12,
  },
  title: {
    fontSize: 20,
    color: "#fff",
    marginLeft: 20,
    fontWeight: "500",
  },
  buttonText: {
    fontSize: 16,
  },
  btnRight: {
    width: 26,
    marginRight: 15,
  },
  btnLeft: {
    marginLeft: 15,
    width: 26,
  },
  rowTitle: {
    color: "gray",
  },
  rowContent: {},
  circleIcon: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  imageContainer: {
    marginRight: 10,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "gray",
    padding: 15,
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  closeText: {
    color: "white",
  },
});
