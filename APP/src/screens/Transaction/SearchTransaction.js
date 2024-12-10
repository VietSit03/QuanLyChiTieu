import {
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../Theme";
import { LoadingAction, LoadingPage } from "../../component/Loading";
import Icon from "react-native-vector-icons/Ionicons";
import { BackButton } from "../../component/Button";
import { Calendar } from "react-native-calendars";
import { alert, formatMoney } from "../../common";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
              backgroundColor: item.categoryColor,
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

const SearchTransaction = ({ navigation }) => {
  const { themeColors } = useContext(ThemeContext);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [time, setTime] = useState({ fromDate: "", toDate: "" });
  const [selectDate, setSelectDate] = useState(false);
  const [type, setType] = useState("ALL");
  const [symbolCur, setSymbolCur] = useState("");
  const [transaction, setTransaction] = useState(null);

  const [keySearch, setKeySearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      setSymbolCur(await AsyncStorage.getItem("currencySymbol"));
      setIsLoadingPage(false);
    }

    fetchData();
  }, []);

  const handleSearch = async () => {
    setIsLoadingAction(true);
    await fetchSearch();
    setIsLoadingAction(false);
  };

  const fetchSearch = async () => {
    const token = await AsyncStorage.getItem("token");
    const url = `${API_URL}/transactions/search`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: type,
          key: keySearch,
          fromDate: time.fromDate,
          toDate: time.toDate,
        }),
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
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const Header = () => {
    const [key, setKey] = useState(keySearch);

    return (
      <>
        <View
          style={{
            ...styles.header,
            backgroundColor: themeColors.primaryColorLight,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
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
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <BackButton navigation={navigation} size={22} />
                <TextInput
                  style={styles.title}
                  placeholder={"Tìm giao dịch"}
                  placeholderTextColor={"rgba(245,245,245,0.75)"}
                  value={key}
                  onChangeText={setKey}
                  onEndEditing={() => setKeySearch(key)}
                />
              </View>
              {key ? (
                <TouchableOpacity
                  onPress={() => {
                    setKey("");
                    setKeySearch("");
                  }}
                  style={{ marginLeft: 10 }}
                >
                  <Icon name="close" size={20} color="white" />
                </TouchableOpacity>
              ) : (
                <View style={{ width: 30 }}></View>
              )}
            </View>
            <TouchableOpacity
              onPress={() => {
                handleSearch();
              }}
              style={styles.filterButton}
            >
              <Icon name="search" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };

  const Filter = () => {
    return (
      <View style={styles.filter}>
        <View style={styles.fRow}>
          <Pressable
            style={{
              ...styles.filterBtn,
              flexDirection: "row",
              backgroundColor: "#DCDCDC",
              marginLeft: 0,
            }}
            onPress={() => setSelectDate(true)}
          >
            <Text style={{ marginRight: 5 }}>Thời gian</Text>
            <Icon name="calendar" size={20} color="black" />
          </Pressable>
        </View>
        <View style={styles.fRow}>
          <Pressable
            style={{
              ...styles.filterBtn,
              backgroundColor:
                type == "ALL" ? themeColors.primaryColorLighter : "#DCDCDC",
            }}
            onPress={() => setType("ALL")}
          >
            <Text>Tất cả</Text>
          </Pressable>
          <Pressable
            style={{
              ...styles.filterBtn,
              backgroundColor:
                type == "CHI" ? themeColors.primaryColorLighter : "#DCDCDC",
            }}
            onPress={() => setType("CHI")}
          >
            <Text>Chi</Text>
          </Pressable>
          <Pressable
            style={{
              ...styles.filterBtn,
              backgroundColor:
                type == "THU" ? themeColors.primaryColorLighter : "#DCDCDC",
            }}
            onPress={() => setType("THU")}
          >
            <Text>Thu</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  function getDatesBetween(startDate, endDate) {
    let dates = [];
    let currentDate = new Date(startDate);
    const finalDate = new Date(endDate);
    finalDate.setDate(finalDate.getDate() - 1);

    while (currentDate < finalDate) {
      currentDate.setDate(currentDate.getDate() + 1);
      dates.push(currentDate.toISOString().split("T")[0]);
    }

    return dates;
  }

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
      {isLoadingPage ? (
        <LoadingPage />
      ) : (
        <View style={styles.container}>
          <Header />
          <Filter />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ marginBottom: 10, marginHorizontal: 10 }}>
              <Text>
                Từ {time.fromDate} đến {time.toDate}
              </Text>
            </View>
            {isLoadingAction ? (
              <LoadingAction />
            ) : (
              <>
                {!transaction ? (
                  <View style={styles.hintSearch}>
                    <Text
                      style={{
                        fontSize: 18,
                        color: "gray",
                        textAlign: "center",
                      }}
                    >
                      Tìm kiếm theo số tiền hoặc danh mục
                    </Text>
                  </View>
                ) : (
                  <>
                    {transaction.length == 0 && (
                      <View style={styles.hintSearch}>
                        <Text
                          style={{
                            fontSize: 18,
                            color: "gray",
                            textAlign: "center",
                          }}
                        >
                          Không có giao dịch nào
                        </Text>
                      </View>
                    )}
                  </>
                )}
                <View style={styles.list}>
                  <FlatList
                    data={transaction}
                    renderItem={renderTransaction}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEnabled={false}
                  />
                </View>
              </>
            )}
          </ScrollView>
          <Modal visible={selectDate} animationType="slide" transparent={true}>
            <TouchableOpacity
              onPressOut={() => setSelectDate(false)}
              activeOpacity={1}
              style={styles.datepicker}
            >
              <View style={styles.calendar}>
                <Calendar
                  markingType={"period"}
                  onDayPress={(day) => {
                    if (!time.fromDate) {
                      setTime({ ...time, fromDate: day.dateString });
                    } else {
                      if (day.dateString < time.fromDate) {
                        setTime({ ...time, toDate: time.fromDate });
                        setTime({ ...time, fromDate: day.dateString });
                      } else if (day.dateString == time.fromDate) {
                        setTime({ ...time, fromDate: "" });
                      } else if (day.dateString == time.toDate) {
                        setTime({ ...time, toDate: "" });
                      } else {
                        setTime({ ...time, toDate: day.dateString });
                      }
                    }
                  }}
                  markedDates={{
                    [time.fromDate]: {
                      startingDay: true,
                      color: themeColors.primaryColorLight,
                      textColor: themeColors.primaryColorText,
                    },
                    [time.toDate]: {
                      endingDay: true,
                      color: themeColors.primaryColorLight,
                      textColor: themeColors.primaryColorText,
                    },
                    ...getDatesBetween(time.fromDate, time.toDate).reduce(
                      (acc, date) => {
                        acc[date] = {
                          color: themeColors.primaryColorLight,
                          textColor: themeColors.primaryColorText,
                        };
                        return acc;
                      },
                      {}
                    ),
                  }}
                />
              </View>
            </TouchableOpacity>
          </Modal>
          {selectDate && <View style={styles.mVOverlay} />}
        </View>
      )}
    </>
  );
};

export default SearchTransaction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "column",
    paddingTop: 50,
    paddingBottom: 12,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 20,
    width: "55%",
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
  filterButton: {
    flexDirection: "row",
    marginRight: 20,
  },
  filter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  fRow: {
    flexDirection: "row",
  },
  datepicker: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  mVOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  calendar: {
    width: "95%",
    backgroundColor: "white",
    padding: 5,
    borderRadius: 10,
  },
  fCol: {
    flexDirection: "row",
  },
  filterBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
    borderRadius: 3,
  },
  list: {
    flex: 1,
    marginTop: 20,
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
  hintSearch: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    marginHorizontal: 60,
  },
});
