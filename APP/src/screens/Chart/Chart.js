import React, { useContext, useEffect, useState } from "react";
import {
  VictoryChart,
  VictoryGroup,
  VictoryBar,
  VictoryAxis,
} from "victory-native";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { ThemeContext } from "../../Theme";
import { formatMoney } from "../../common";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chart = () => {
  const { themeColors } = useContext(ThemeContext);
  const [selectedValue, setSelectedValue] = useState(null);
  const [currencyBase, setCurrencyBase] = useState("");

  useEffect(() => {
    async function loadPage() {
      setCurrencyBase(await AsyncStorage.getItem("currencyBase"));
    }

    loadPage();
  }, []);

  const data1 = [
    { x: "Tháng 6", y: 4255000, title: "Thu nhập", color: "#02A544" },
    { x: "Tháng 7", y: 3500000, title: "Thu nhập", color: "#02A544" },
    { x: "Tháng 8", y: 5000000, title: "Thu nhập", color: "#02A544" },
  ];

  const data2 = [
    { x: "Tháng 6", y: 3000000, title: "Chi phí", color: "#FD9800" },
    { x: "Tháng 7", y: 2000000, title: "Chi phí", color: "#FD9800" },
    { x: "Tháng 8", y: 6000000, title: "Chi phí", color: "#FD9800" },
  ];

  const data3 = data1.map((item, index) => ({
    x: item.x,
    y: item.y - data2[index].y,
  }));

  const transformData = (data) => {
    return data.map((item) => ({
      x: item.x,
      y: item.y < 0 ? -item.y : item.y,
      color: item.y < 0 ? "#F44321" : "#00A8E2",
      title: item.y < 0 ? "Lỗ" : "Lợi nhuận",
    }));
  };

  const transformedData3 = transformData(data3);

  const Legend = () => {
    return (
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendSymbol, { backgroundColor: "#02A544" }]} />
          <Text style={styles.legendLabel}>Thu nhập</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSymbol, { backgroundColor: "#FD9800" }]} />
          <Text style={styles.legendLabel}>Chi phí</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSymbol, { backgroundColor: "#00A8E2" }]} />
          <Text style={styles.legendLabel}>Lợi nhuận</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSymbol, { backgroundColor: "#F44321" }]} />
          <Text style={styles.legendLabel}>Lỗ</Text>
        </View>
      </View>
    );
  };
  const [selectedBar, setSelectedBar] = useState(null);

  const handleBarClick = (event, props) => {
    const time = props.datum.x;
    const income = data1.find((item) => item.x == time);
    const spending = data2.find((item) => item.x == time);
    const summary = transformedData3.find((item) => item.x == time);
    const result = [income, spending, summary];
    setSelectedBar({
      time: props.datum.x,
      data: result,
    });
  };

  return (
    <View style={styles.container}>
      {selectedBar && (
        <View>
          <Text
            style={{ textAlign: "center", fontWeight: "bold", fontSize: 20 }}
          >
            {selectedBar.time}
          </Text>
          {selectedBar.data.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[styles.legendSymbol, { backgroundColor: item.color }]}
              />
              <Text style={styles.legendLabel}>
                {item.title}: {formatMoney(item.y)} {currencyBase}
              </Text>
            </View>
          ))}
        </View>
      )}

      <VictoryChart domainPadding={{ x: 20 }}>
        <VictoryAxis
          label="2024"
          style={{
            axisLabel: { fill: "gray", padding: 35 },
            tickLabels: { padding: 10 },
          }}
        />
        <VictoryGroup
          offset={31}
          style={{
            data: {
              stroke: "black",
              strokeWidth: 0.5,
            },
          }}
        >
          <VictoryBar
            data={data1}
            style={{ data: { fill: (d) => d.datum.color } }}
            cornerRadius={{ bottom: 3, top: 3 }}
            barWidth={30}
            events={[
              {
                target: "data",
                eventHandlers: {
                  onPress: (event, props) => {
                    handleBarClick(event, props);
                    return [];
                  },
                },
              },
            ]}
          />
          <VictoryBar
            data={data2}
            style={{ data: { fill: (d) => d.datum.color } }}
            cornerRadius={{ bottom: 3, top: 3 }}
            barWidth={30}
            events={[
              {
                target: "data",
                eventHandlers: {
                  onPress: (event, props) => {
                    handleBarClick(event, props);
                    return [];
                  },
                },
              },
            ]}
          />
          <VictoryBar
            data={transformedData3}
            style={{
              data: {
                fill: (d) => d.datum.color,
              },
            }}
            cornerRadius={{ bottom: 3, top: 3 }}
            barWidth={30}
            events={[
              {
                target: "data",
                eventHandlers: {
                  onPress: (event, props) => {
                    handleBarClick(event, props);
                    return [];
                  },
                },
              },
            ]}
          />
        </VictoryGroup>
      </VictoryChart>

      <Legend />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  legendSymbol: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendLabel: {
    fontSize: 12,
    color: "#333",
    fontWeight: "bold",
  },
});

export default Chart;
