import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState, useCallback } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeContext } from "../../Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import { LoadingPage } from "../../component/Loading";
import { formatMoney } from "../../common";
import { useFocusEffect } from "@react-navigation/native";

const TransSummary = React.memo(
  ({ item, totalAmount, symbol, navigation, type }) => {
    return (
      <Pressable
        style={styles.transSummary}
        onPress={() =>
          navigation.navigate("ListByCategory", {
            type: type,
            ctgId: item.categoryCustomId,
            ctgName: item.categoryName,
          })
        }
      >
        <View style={{ flex: 7, flexDirection: "row", alignItems: "center" }}>
          <View style={{ ...styles.circleIcon, backgroundColor: item.color }}>
            <Image source={{ uri: item.imgSrc }} style={styles.iconCategory} />
          </View>
          <Text
            style={styles.txtCtgName}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.categoryName}
          </Text>
        </View>
        <View style={{ flex: 2, flexDirection: "row", alignItems: "center" }}>
          <Text>
            {item.budget == totalAmount
              ? 100
              : ((item.budget / totalAmount) * 100).toFixed(2)}{" "}
            %
          </Text>
        </View>
        <View
          style={{
            flex: 2.5,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Text numberOfLines={2} ellipsizeMode="tail">
            {formatMoney(item.budget)} {symbol}
          </Text>
        </View>
      </Pressable>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.totalAmount === nextProps.totalAmount &&
      prevProps.item === nextProps.item
    );
  }
);

const HomeScreen = ({ route, navigation }) => {
  const { type } = route.params;
  const { themeColors } = useContext(ThemeContext);
  const [symbol, setSymbol] = useState("");
  const [loadingPage, setLoadingPage] = useState(true);
  const [data, setData] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        var cur = await AsyncStorage.getItem("currencySymbol");
        setSymbol(cur);
        await fetchSummaryByType();
        setLoadingPage(false);
      }

      fetchData();
    }, [])
  );

  const renderTransSummary = ({ item, index }) => {
    return (
      <TransSummary
        item={item}
        totalAmount={totalAmount}
        symbol={symbol}
        navigation={navigation}
        type={type}
      />
    );
  };

  const fetchSummaryByType = async () => {
    const token = await AsyncStorage.getItem("token");
    const url = `${API_URL}/transactions/getsummarybytype?type=${type}`;

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

      const totalBudget = apiResponse.data.reduce(
        (acc, item) => acc + item.budget,
        0
      );
      setTotalAmount(totalBudget);

      setData(apiResponse.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      {loadingPage ? (
        <LoadingPage />
      ) : (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.sc}>
            <View style={{ width: "100%", marginTop: 10 }}>
              <Pressable
                style={styles.transSummary}
                onPress={() =>
                  navigation.navigate("ListByCategory", {
                    type: type,
                    ctgId: 0,
                    ctgName: "Danh sách chi tiêu",
                  })
                }
              >
                <View
                  style={{
                    flex: 7,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      ...styles.circleIcon,
                      backgroundColor: themeColors.primaryColorLight,
                    }}
                  >
                    <Image
                      source={
                        type == "CHI"
                          ? require("../../../assets/spending-money.png")
                          : require("../../../assets/receive-money.png")
                      }
                      style={{ width: 25, height: 25 }}
                    />
                  </View>
                  <Text
                    style={styles.txtCtgName}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {type == "CHI" ? "Tổng chi tiêu" : "Tổng thu nhập"}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 2,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text>100 %</Text>
                </View>
                <View
                  style={{
                    flex: 2.5,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <Text numberOfLines={2} ellipsizeMode="tail">
                    {formatMoney(totalAmount)} {symbol}
                  </Text>
                </View>
              </Pressable>
              <FlatList
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderTransSummary}
                scrollEnabled={false}
              />
            </View>
            <View style={{ height: 100 }}></View>
          </ScrollView>
          {type != "TONG" && (
            <TouchableOpacity
              style={{
                ...styles.btnAddTrans,
                backgroundColor: themeColors.primaryColorLighter,
              }}
              onPress={() =>
                navigation.navigate("AddTransaction", { type: type })
              }
            >
              <Ionicons name="add-outline" size={40} color="white" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sc: {
    flexGrow: 1,
    alignItems: "center",
  },
  box: {
    marginTop: 15,
    height: 50,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  transSummary: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    marginBottom: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
    height: 50,
    paddingHorizontal: 10,
  },
  itemTransSummary: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "lightgray",
    height: 100,
  },
  itemHeaderTS: {
    paddingRight: 10,
    justifyContent: "center",
  },
  itemBodyTS: {
    flex: 1,
    flexDirection: "column",
    paddingRight: 10,
    justifyContent: "center",
  },
  itemFooterTS: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  btnAddTrans: {
    position: "absolute",
    bottom: 20,
    right: 20,
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  iconCategory: {
    width: 20,
    height: 20,
  },
  circleIcon: {
    width: 35,
    height: 35,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  txtCtgName: {
    flex: 1,
    marginLeft: 10,
    marginRight: 5,
  },
  pieChart: {
    position: "relative",
  },
});
