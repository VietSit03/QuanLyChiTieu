import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { TextInput } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemeContext } from "../../Theme";

const frequency = [
  { id: "MOTLAN", name: "Một lần" },
  { id: "HANGNGAY", name: "Hàng ngày" },
  { id: "HANGTUAN", name: "Hàng tuần" },
  { id: "HANGTHANG", name: "Hàng tháng" },
  { id: "HANGNAM", name: "Hàng năm" },
];

const AddScheduleScreen = ({ route, navigation }) => {
  const { type } = route.params;
  const { themeColors } = useContext(ThemeContext);
  const [loadingPage, setLoadingPage] = useState(true);
  const [currency, setCurrency] = useState("VND");
  const [value, setValue] = React.useState(null);

  const [fromTime, setFromTime] = useState(new Date());
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);

  useEffect(() => {
    async function fetchPrimaryColor() {
    }

    fetchPrimaryColor();
    setLoadingPage(false);
  }, []);

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (event.type === "dismissed") {
      //   setFromTime(null);
    } else {
      setFromTime(selectedTime);
    }
  };

  const handleFromDateChange = (event, selectedDate) => {
    setShowFromDatePicker(false);
    if (event.type === "dismissed") {
      //   setFromDate(null);
    } else {
      setFromDate(selectedDate);
    }
  };

  const handleToDateChange = (event, selectedDate) => {
    setShowToDatePicker(false);
    if (event.type === "dismissed") {
      setToDate(null);
    } else {
      setToDate(selectedDate);
    }
  };

  const formatDate = (date) => {
    const day = date.getDate().toString();
    const month = (date.getMonth() + 1).toString();
    const year = date.getFullYear();
    return `${day} Th${month}, ${year}`;
  };

  const handleAddCategory = () => {
    console.log(type);
  }

  return (
    <>
      {loadingPage ? (
        <ActivityIndicator size={"large"} style={{ marginTop: 10 }} />
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"} // 'padding' works well on iOS, 'height' or 'padding' for Android
          style={{ flex: 1 }}
        >
          <ScrollView style={styles.container}>
            <View style={styles.row}>
              <TextInput
                label="Tên phương thức thanh toán"
                mode="outlined"
                activeOutlineColor={themeColors.primaryColorDark}
              />
            </View>
            <View style={styles.row}>
              <Text>Tần suất nhắc nhở</Text>
              <Dropdown
                data={frequency}
                labelField="name"
                valueField="id"
                placeholder="Chưa chọn"
                value={value}
                onChange={(item) => {
                  setValue(item.id);
                }}
                activeColor={themeColors.primaryColorLighter}
                placeholderStyle={{ color: themeColors.primaryColorLight, fontSize: 16 }}
                selectedTextStyle={{ color: themeColors.primaryColorLight, fontSize: 16 }}
                renderRightIcon={() => null}
                style={{ marginTop: 5 }}
                containerStyle={{ maxWidth: 200 }}
                itemContainerStyle={{
                  borderBottomWidth: 0.5,
                  borderBottomColor: "lightgray",
                }}
              />
            </View>
            <View style={styles.row}>
              <Text>Ngày bắt đầu nhắc nhở</Text>
              <TouchableOpacity
                onPress={() => setShowFromDatePicker(true)}
                style={{ marginTop: 5 }}
              >
                <Text
                  style={{
                    marginRight: 5,
                    color: themeColors.primaryColorLight,
                    fontSize: 16,
                  }}
                >
                  {fromDate == null ? "Chưa chọn" : formatDate(fromDate)}
                </Text>
              </TouchableOpacity>
              {Platform.OS === "ios" && showFromDatePicker && (
                <Modal
                  transparent={true}
                  animationType="none"
                  visible={showFromDatePicker}
                  onRequestClose={() => setShowFromDatePicker(false)}
                >
                  <TouchableOpacity
                    activeOpacity={1}
                    onPressOut={() => setShowFromDatePicker(false)} // Close modal on press outside
                  >
                    <TouchableOpacity activeOpacity={1}>
                      <DateTimePicker
                        value={fromDate || new Date()}
                        mode="date"
                        display="inline"
                        onChange={handleFromDateChange}
                        style={{ backgroundColor: "white" }}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                </Modal>
              )}
              {Platform.OS === "android" && showFromDatePicker && (
                <DateTimePicker
                  value={fromDate == null ? new Date() : fromDate}
                  mode="date"
                  display="default"
                  onChange={handleFromDateChange}
                />
              )}
            </View>
            <View style={styles.row}>
              <Text>Giờ</Text>
              <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
                style={{ marginTop: 5 }}
              >
                <Text
                  style={{
                    marginRight: 5,
                    color: themeColors.primaryColorLight,
                    fontSize: 16,
                  }}
                >
                  {fromTime == null
                    ? "Chưa chọn"
                    : fromTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                </Text>
              </TouchableOpacity>

              {Platform.OS === "ios" && showTimePicker && (
                <Modal
                  transparent={true}
                  animationType="none"
                  visible={showTimePicker}
                  onRequestClose={() => setShowTimePicker(false)}
                >
                  <TouchableOpacity
                    activeOpacity={1}
                    onPressOut={() => setShowTimePicker(false)} // Close modal on press outside
                  >
                    <TouchableOpacity activeOpacity={1}>
                      <DateTimePicker
                        value={fromTime == null ? new Date() : fromTime}
                        mode="time"
                        display="inline"
                        onChange={handleTimeChange}
                        style={{ backgroundColor: "white" }}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                </Modal>
              )}
              {Platform.OS === "android" && showTimePicker && (
                <DateTimePicker
                  value={fromTime == null ? new Date() : fromTime}
                  mode="time"
                  display="default"
                  onChange={handleTimeChange}
                />
              )}
            </View>
            <View style={styles.row}>
              <Text>Ngày kết thúc lời nhắc</Text>
              <TouchableOpacity
                onPress={() => setShowToDatePicker(true)}
                style={{ marginTop: 5 }}
              >
                <Text
                  style={{
                    marginRight: 5,
                    color: themeColors.primaryColorLight,
                    fontSize: 16,
                  }}
                >
                  {toDate == null ? "Chưa chọn" : formatDate(toDate)}
                </Text>

                {Platform.OS === "ios" && showToDatePicker && (
                  <Modal
                    transparent={true}
                    animationType="none"
                    visible={showToDatePicker}
                    onRequestClose={() => setShowToDatePicker(false)}
                  >
                    <TouchableOpacity
                      activeOpacity={1}
                      onPressOut={() => setShowToDatePicker(false)} // Close modal on press outside
                    >
                      <TouchableOpacity activeOpacity={1}>
                        <DateTimePicker
                          value={toDate == null ? new Date() : toDate}
                          mode="date"
                          display="inline"
                          onChange={handleToDateChange}
                          style={{ backgroundColor: "white" }}
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </Modal>
                )}
                {Platform.OS === "android" && showToDatePicker && (
                  <DateTimePicker
                    value={toDate == null ? new Date() : toDate}
                    mode="date"
                    display="default"
                    onChange={handleToDateChange}
                  />
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.row}>
              <Text>Danh mục</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("CategoryScreen", { type: type })
                }
              >
                <Text
                  style={{
                    marginTop: 5,
                    marginRight: 5,
                    color: themeColors.primaryColorLight,
                    fontSize: 16,
                  }}
                >
                  Chọn danh mục
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.row}>
              <TextInput
                label={"Số tiền (" + currency + ")"}
                mode="outlined"
                inputMode="numeric"
                activeOutlineColor={themeColors.primaryColorDark}
              />
            </View>
            <View style={styles.row}>
              <TextInput
                label="Ghi chú"
                mode="outlined"
                activeOutlineColor={themeColors.primaryColorDark}
              />
            </View>
            <View
              style={{
                alignItems: "center",
                marginTop: 30,
                justifyContent: "center",
                paddingBottom: 10,
              }}
            >
              <TouchableOpacity
                style={styles.btnAdd}
                onPress={() => handleAddCategory()}
              >
                <Text style={{ fontSize: 16 }}>Tạo</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </>
  );
};

export default AddScheduleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    marginTop: 15,
    marginHorizontal: 15,
  },
  btnAdd: {
    backgroundColor: "#FFC125",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: "70%",
    borderRadius: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
