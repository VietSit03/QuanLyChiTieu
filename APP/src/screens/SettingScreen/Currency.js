import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";

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

const Currency = () => {
  const currency = [
    { currencyName: "Đô la Mỹ", currencyCode: "USD" },
    { currencyName: "Euro", currencyCode: "EUR" },
    { currencyName: "Đồng Việt Nam", currencyCode: "VND" },
    { currencyName: "Bảng Anh", currencyCode: "GBP" },
    { currencyName: "Yên Nhật", currencyCode: "JPY" },
    { currencyName: "Đô la Úc", currencyCode: "AUD" },
    { currencyName: "Đô la Canada", currencyCode: "CAD" },
    { currencyName: "Franc Thụy Sĩ", currencyCode: "CHF" },
    { currencyName: "Nhân dân tệ Trung Quốc", currencyCode: "CNY" },
    { currencyName: "Krona Thụy Điển", currencyCode: "SEK" },
    { currencyName: "Đô la New Zealand", currencyCode: "NZD" },
    { currencyName: "Peso Mexico", currencyCode: "MXN" },
    { currencyName: "Đô la Singapore", currencyCode: "SGD" },
    { currencyName: "Đô la Hồng Kông", currencyCode: "HKD" },
    { currencyName: "Krone Na Uy", currencyCode: "NOK" },
    { currencyName: "Won Hàn Quốc", currencyCode: "KRW" },
    { currencyName: "Lira Thổ Nhĩ Kỳ", currencyCode: "TRY" },
    { currencyName: "Rúp Nga", currencyCode: "RUB" },
    { currencyName: "Rupee Ấn Độ", currencyCode: "INR" },
    { currencyName: "Real Brazil", currencyCode: "BRL" },
    { currencyName: "Rand Nam Phi", currencyCode: "ZAR" },
    { currencyName: "Krone Đan Mạch", currencyCode: "DKK" },
    { currencyName: "Baht Thái", currencyCode: "THB" },
    { currencyName: "Ringgit Malaysia", currencyCode: "MYR" },
    { currencyName: "Rupiah Indonesia", currencyCode: "IDR" },
  ];

  const handleConfirm = () => {
    console.log("confirm");
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
          onPress: () => handleConfirm(),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
    console.log("Selected currency:", item.currencyName);
  };

  const renderCurrency = ({ item }) => {
    return <Cur item={item} handle={() => handleSelectCur(item)} />;
  };

  return (
    <View style={styles.container}>
      <Text style={{ marginTop: 10, paddingHorizontal: 20, fontSize: 18 }}>
        Chọn đơn vị tiền tệ mặc định
      </Text>
      <FlatList
        data={currency}
        style={styles.fl}
        keyExtractor={(item) => item.currencyCode}
        renderItem={renderCurrency}
      />
      <View style={styles.footer}></View>
    </View>
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
