import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";

const TransSummary = React.memo(
  ({ item, handle }) => {
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
                <Text style={{ fontSize: 16 }}>Tổng chi</Text>
                <Text
                  style={{ color: "gray" }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  2 khoản chi
                </Text>
                <Text
                  style={{ color: "gray" }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  1 khoản thu
                </Text>
              </View>
              <View style={styles.itemFooterTS}>
                <Text style={[{ fontSize: 16 }, { color: "orange" }]}>
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
    return prevProps.item.isDetail === nextProps.item.isDetail;
  }
);

const HomeScreen = ({ route, navigation }) => {
  const [data, setData] = useState([
    {
      id: 1,
      isDetail: false,
      time: `7-2024`,
      amount: 220703,
    },
    {
      id: 2,
      isDetail: false,
      time: `8-2024`,
      amount: 220703,
    },
  ]);

  const handleDetail = (item) => {
    setData((prevData) =>
      prevData.map((data) =>
        data.id == item.id ? { ...data, isDetail: !data.isDetail } : data
      )
    );
  };

  const renderTransSummary = ({ item }) => {
    return <TransSummary item={item} handle={() => handleDetail(item)} />;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.box}>
        <Text style={{ fontSize: 18 }}>
          {Number("1000000").toLocaleString("en-US")} VND
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
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
  },
  box: {
    marginTop: 10,
    backgroundColor: "#FFC125",
    height: 60,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
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
    paddingVertical: 5,
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
});
