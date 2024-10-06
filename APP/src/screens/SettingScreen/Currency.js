import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import { LoadingPage } from "../../component/Loading";
import { alert } from "../../common";

const Cur = React.memo(
  ({ item, handle }) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 15,
        }}
        onPress={handle}
      >
        <Text style={{ fontSize: 16 }}>{item.currencyName}</Text>
        <Text style={{ fontSize: 16 }}>{item.currencyCode}</Text>
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) =>
    prevProps.item.currencyCode === nextProps.item.currencyCode
);

const Currency = ({ navigation }) => {
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [currency, setCurrency] = useState(null);

  const handleConfirm = () => {
    console.log("confirm");
  };

  useEffect(() => {
    async function fetchData() {
      await fetchCurrency();
    }

    fetchData();
    setIsLoadingPage(false);
  }, []);

  const fetchCurrency = async () => {
    const token = await AsyncStorage.getItem("token");
    const url = `${API_URL}/currencies/all`;

    try {
      // Kiểm tra xem đã có dữ liệu loại tiền trong AsyncStorage chưa
      const cachedCurrencies = await AsyncStorage.getItem("currencies");
      if (cachedCurrencies) {
        // Nếu có, dùng dữ liệu lưu trữ cục bộ
        setCurrency(JSON.parse(cachedCurrencies));
        return;
      }

      // Nếu chưa có, gọi API để lấy dữ liệu
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
      var currencies = apiResponse.data;

      await AsyncStorage.setItem("currencies", JSON.stringify(currencies));
      setCurrency(currencies);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchChangeCurrency = async (currencyCode) => {
    const token = await AsyncStorage.getItem("token");
    const url = `${API_URL}/users/changecurrency?code=${currencyCode}`;

    try {
      const response = await fetch(url, {
        method: "PUT",
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
        alert("Lỗi", "Xảy ra lỗi khi đổi tiền tệ");
        return;
      }

      var apiResponse = await response.json();

      await AsyncStorage.setItem("balance", apiResponse.data.balance.toString());
      await AsyncStorage.setItem("currencyBase", apiResponse.data.currencyCode);
      await AsyncStorage.setItem("currencySymbol", apiResponse.data.symbol);

      alert("Thành công", "Đổi loại tiền thành công", () =>
        navigation.navigate("Setting")
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSelectCur = (item) => {
    Alert.alert(
      "Xác nhận đổi tiền tệ",
      `Ký hiệu tiền tệ cho tất cả các giao dịch sẽ được thay đổi thành ${item.currencyName} (${item.currencyCode}) từ bây giờ.`,
      [
        {
          text: "Huỷ",
          style: "cancel",
        },
        {
          text: "Tiếp tục",
          onPress: () => fetchChangeCurrency(item.currencyCode),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const renderCurrency = ({ item }) => {
    return <Cur item={item} handle={() => handleSelectCur(item)} />;
  };

  return (
    <>
      {isLoadingPage ? (
        <LoadingPage />
      ) : (
        <View style={styles.container}>
          <Text style={{ marginTop: 10, paddingHorizontal: 20, fontSize: 18 }}>
            Chọn đơn vị tiền tệ mặc định
          </Text>
          <FlatList
            data={currency}
            style={styles.fl}
            keyExtractor={(item) => item.currencyCode}
            renderItem={renderCurrency}
            showsVerticalScrollIndicator={false}
            initialNumToRender={15}
          />
          <View style={styles.footer}></View>
        </View>
      )}
    </>
  );
};

export default Currency;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fl: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  footer: {
    height: 10,
    position: "static",
    bottom: 0,
    right: 0,
    left: 0,
  },
});
