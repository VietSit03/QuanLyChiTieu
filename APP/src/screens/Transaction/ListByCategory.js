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
import React, { useCallback, useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../Theme";
import { BackButton } from "../../component/Button";
import { LoadingAction, LoadingPage } from "../../component/Loading";
import Icon from "react-native-vector-icons/Ionicons";
import { alert, formatMoney } from "../../common";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TransactionContainer = React.memo(
  ({
    item,
    handle,
    renderDetail,
    fetchTransactions,
    themeColors,
    type,
    symbolCur,
  }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (item.isDetail) {
        const loadTransactions = async () => {
          setLoading(true);
          if (item.listTrans == null) {
            await fetchTransactions(item.time);
          }
          setLoading(false);
        };

        loadTransactions();
      }
    }, [item.isDetail]);

    return (
      <View style={styles.list}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderBottomWidth: 0.5,
            borderColor: "lightgray",
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
            <View style={{ ...styles.item, height: 70, borderBottomWidth: 0 }}>
              <View style={styles.itemHeader}>
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
                    style={{ width: 30, height: 30 }}
                  />
                </View>
              </View>
              <View style={styles.itemBody}>
                <Text style={{ fontSize: 16 }}>
                  {type == "CHI" ? "Tổng chi tiêu" : "Tổng thu nhập"}
                </Text>
                <Text
                  style={{ color: "gray" }}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {type == "CHI" ? "Số khoản chi tiêu" : "Số khoản thu nhập"}:{" "}
                  {item.count}
                </Text>
              </View>
              <View style={styles.itemFooter}>
                <Text style={styles.txtFooter}>
                  {formatMoney(item.budget)} {symbolCur}
                </Text>
              </View>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              {loading ? (
                <LoadingAction />
              ) : (
                <FlatList
                  data={item.listTrans}
                  renderItem={renderDetail}
                  keyExtractor={(dataItem) => dataItem.id}
                />
              )}
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.item.isDetail === nextProps.item.isDetail &&
      prevProps.item.listTrans === nextProps.item.listTrans
    );
  }
);

const Transaction = React.memo(
  ({ item, navigation, symbolCur }) => {
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

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          navigation.navigate("TransactionDetail", { transId: item.id })
        }
      >
        <View style={styles.itemHeader}>
          <View
            style={{
              ...styles.circleIcon,
              backgroundColor: item.color,
            }}
          >
            <Image
              source={{ uri: item.imgSrc }}
              style={{
                height: 25,
                width: 25,
                backgroundColor: "transparent",
              }}
            />
          </View>
        </View>
        <View style={styles.itemBody}>
          <Text style={{ fontSize: 16 }}>{item.categoryName}</Text>
          <Text style={{ fontSize: 13, color: "gray" }}>
            {FormatDateTime(item.createAt)}
          </Text>
        </View>
        <View style={styles.itemFooter}>
          <Text style={styles.txtFooter}>
            {formatMoney(item.money)} {symbolCur}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.item.id === nextProps.item.id;
  }
);

const ListByCategory = ({ navigation, route }) => {
  const { themeColors } = useContext(ThemeContext);
  const { type, ctgId, ctgName } = route.params;
  const [loadingPage, setLoadingPage] = useState(true);
  const [symbolCur, setSymbolCur] = useState("");
  const [filter, setFilter] = useState("T"); // T: Time, M: Money
  const [transactionT, setTransactionT] = useState(null);
  const [transactionM, setTransactionM] = useState(null);

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
          <Text style={styles.title}>{ctgName}</Text>
        </View>
      </View>
    );
  };

  useEffect(() => {
    async function fetchData() {
      await fetchSummaryByCategory();
      await fetchTransByMoney();
      setSymbolCur(await AsyncStorage.getItem("currencySymbol"));
      setLoadingPage(false);
    }

    fetchData();
  }, []);

  const fetchSummaryByCategory = async () => {
    const token = await AsyncStorage.getItem("token");
    const url = `${API_URL}/transactions/getsummarybycategory?type=${type}&categoryId=${ctgId}`;

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

      setTransactionT(
        apiResponse.data.map((prevProps) => ({
          ...prevProps,
          isDetail: false,
          listTrans: null,
        }))
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchTransByMoney = async () => {
    const token = await AsyncStorage.getItem("token");
    const url = `${API_URL}/transactions/getlistbymoney?type=${type}&categoryId=${ctgId}`;

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

      setTransactionM(apiResponse.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchTransactions = async (time) => {
    const token = await AsyncStorage.getItem("token");
    const url = `${API_URL}/transactions/getlistbytime?type=${type}&categoryId=${ctgId}&time=${time}`;

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

      const data = apiResponse.data;

      setTransactionT(
        transactionT.map((prevProps) =>
          prevProps.time == time ? { ...prevProps, listTrans: data } : prevProps
        )
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDetailPress = (selectedTransDetail) => {
    setTransactionT((prevTransaction) =>
      prevTransaction.map((item) =>
        item.time === selectedTransDetail.time
          ? { ...item, isDetail: !item.isDetail }
          : item
      )
    );
  };

  const renderTransactionContainer = ({ item, index }) => {
    return (
      <TransactionContainer
        key={index}
        item={item}
        handle={() => handleDetailPress(item)}
        renderDetail={renderTransaction}
        fetchTransactions={fetchTransactions}
        themeColors={themeColors}
        type={type}
        symbolCur={symbolCur}
      />
    );
  };

  const renderTransaction = ({ item }) => {
    return (
      <Transaction
        key={item}
        item={item}
        navigation={navigation}
        symbolCur={symbolCur}
      />
    );
  };

  return (
    <>
      {loadingPage ? (
        <LoadingPage />
      ) : (
        <View style={styles.container}>
          <Header />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.filter}>
              <Pressable
                style={{
                  ...styles.filterBtn,
                  backgroundColor:
                    filter == "T" ? themeColors.primaryColorLighter : "#DCDCDC",
                }}
                onPress={() => setFilter("T")}
              >
                <Text>Theo thời gian</Text>
              </Pressable>
              <Pressable
                style={{
                  ...styles.filterBtn,
                  backgroundColor:
                    filter == "M" ? themeColors.primaryColorLighter : "#DCDCDC",
                }}
                onPress={() => setFilter("M")}
              >
                <Text>Theo số tiền</Text>
              </Pressable>
            </View>
            <View style={styles.body}>
              {filter == "T" ? (
                <FlatList
                  data={transactionT}
                  renderItem={renderTransactionContainer}
                  keyExtractor={(item, index) => index.toString()}
                  scrollEnabled={false}
                />
              ) : (
                <View style={styles.list}>
                  <FlatList
                    data={transactionM}
                    renderItem={renderTransaction}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEnabled={false}
                  />
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      )}
    </>
  );
};

export default ListByCategory;

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
  body: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    color: "#fff",
    marginLeft: 20,
    fontWeight: "500",
  },
  filter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    marginBottom: 10,
  },
  filterBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    borderRadius: 3,
  },
  list: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 3,
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
  },
  item: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "lightgray",
    height: 70,
  },
  itemHeader: {
    flex: 2.5,
    paddingHorizontal: 5,
    justifyContent: "center",
  },
  itemBody: {
    flex: 8.5,
    flexDirection: "column",
    paddingHorizontal: 5,
    justifyContent: "center",
  },
  itemFooter: {
    flex: 5,
    flexDirection: "column",
    paddingHorizontal: 5,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  forMemContainer: {
    flexDirection: "row",
  },
  txtFooter: {
    fontSize: 15,
    color: "orange",
  },
  circleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
