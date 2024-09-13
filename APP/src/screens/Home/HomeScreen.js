import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeContext } from "../../Theme";

const TransSummary = React.memo(
  ({ item, handle, theme }) => {
    return (
      <View style={styles.transSummary}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderBottomWidth: 0.5,
            borderBottomColor: "#DCDCDC",
          }}
          onPress={handle}
        >
          <Text style={{ color: "gray" }}>Tháng {item.time}</Text>
          {!item.isDetail ? (
            <Icon name="chevron-down" size={16} />
          ) : (
            <Icon name="chevron-up" size={16} />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={handle}>
          {!item.isDetail ? (
            <View
              style={{
                ...styles.itemTransSummary,
                height: 70,
                borderBottomWidth: 0,
              }}
            >
              <View style={styles.itemHeaderTS}>
                <Image
                  source={require("../../../assets/coin.png")}
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 20,
                    backgroundColor: "transparent",
                  }}
                />
              </View>
              <View style={styles.itemBodyTS}>
                <Text style={{ fontSize: 18 }}>Tổng cộng</Text>
                <Text
                  style={{ color: "gray" }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.expenseNum} khoản chi
                </Text>
                <Text
                  style={{ color: "gray" }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.revenueNum} khoản thu
                </Text>
              </View>
              <View style={styles.itemFooterTS}>
                <Text
                  style={[
                    { fontSize: 16 },
                    { color: theme.primaryColorLighter },
                  ]}
                >
                  {item.amount.toLocaleString("vi-VN")} VND
                </Text>
              </View>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <Text>Detail</Text>
              {/* {loading ? (
                <ActivityIndicator
                  size="large"
                  color="#0000ff"
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                />
              ) : (
                <FlatList
                  data={data}
                  renderItem={renderDetail}
                  keyExtractor={(dataItem) => dataItem.transId}
                  ListFooterComponent={renderFooter}
                  onEndReached={loadMoreData}
                  onEndReachedThreshold={0.5}
                />
              )} */}
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.item.isDetail === nextProps.item.isDetail &&
      prevProps.theme === nextProps.theme
    );
  }
);

const HomeScreen = ({ route, navigation }) => {
  const { type } = route.params;
  const { themeColors } = useContext(ThemeContext);
  const [loadingPage, setLoadingPage] = useState(true);
  const [data, setData] = useState();
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    async function fetch() {
      const dataFetch = [
        {
          id: 1,
          isDetail: false,
          time: `7-2024`,
          expenseNum: 1,
          revenueNum: 4,
          amount: 220703,
        },
        {
          id: 2,
          isDetail: false,
          time: `8-2024`,
          expenseNum: 5,
          revenueNum: 2,
          amount: -838699,
        },
      ];
      setData(dataFetch);
      setTotalAmount(dataFetch.reduce((acc, item) => acc + item.amount, 0));
      setLoadingPage(false);
    }

    fetch();
  }, []);

  const handleDetail = (item) => {
    setData((prevData) =>
      prevData.map((data) =>
        data.id == item.id ? { ...data, isDetail: !data.isDetail } : data
      )
    );
  };

  const renderTransSummary = ({ item }) => {
    return (
      <TransSummary
        item={item}
        handle={() => handleDetail(item)}
        theme={themeColors}
      />
    );
  };

  return (
    <>
      {loadingPage ? (
        <ActivityIndicator size={"large"} />
      ) : (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.sc}>
            <View
              style={{
                ...styles.box,
                backgroundColor: themeColors.primaryColorLight,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: themeColors.primaryColorText,
                  fontWeight: "bold",
                }}
              >
                {totalAmount.toLocaleString("en-US")} VND
              </Text>
            </View>
            <View style={{ width: "100%", marginTop: 10 }}>
              <FlatList
                data={data}
                keyExtractor={(item) => item.id}
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
    borderRadius: 3,
    marginBottom: 10,
    marginHorizontal: 10,
    paddingBottom: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
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
});
