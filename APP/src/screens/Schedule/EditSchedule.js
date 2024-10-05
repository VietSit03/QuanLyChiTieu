import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState, useRef } from "react";
import { RadioButton, TextInput } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemeContext } from "../../Theme";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoadingPage } from "../../component/Loading";
import { useFocusEffect } from "@react-navigation/native";
import { alert, isEmptyInput } from "../../common";

const EditSchedule = ({ route, navigation }) => {
  const { themeColors } = useContext(ThemeContext);
  const { id } = route.params;
  const isFirstLoad = useRef(true);
  const [checked, setChecked] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [category, setCategory] = useState(null);
  const [catError, setCatError] = useState("");

  const [currency, setCurrency] = useState("VND");
  const [frequency, setFrequency] = useState([]);
  const [selectedFrequency, setSelectedFrequency] = useState(null);
  const [name, setName] = useState({
    title: "Tên khoản thanh toán",
    value: "",
  });
  const [money, setMoney] = useState({
    title: "Số tiền",
    value: "",
  });
  const [note, setNote] = useState({
    title: "Ghi chú",
    value: "",
  });

  const [fromTime, setFromTime] = useState(new Date());
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoadingPage(true);
      await AsyncStorage.setItem("scheduleId", id.toString());
      await fetchFrequency();
      await fetchSchedule();
      setCurrency(await AsyncStorage.getItem("currencyBase"));
    }

    fetchData();
    setLoadingPage(false);
  }, []);

  useEffect(() => {
    if (route.params?.category) {
      var ctg = route.params?.category;
      setCategory(ctg);
    }
  }, [route.params]);

  useEffect(() => {
    if (isFirstLoad.current && checked) {
      isFirstLoad.current = false;
    } else {
      setCategory(null);
    }
  }, [checked]);

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.category) {
        setCategory(route.params?.category);
      }
    }, [route.params])
  );

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

  const handleUpdateSchedule = () => {
    if (isEmptyInput(name, setName)) {
      return;
    }

    if (!category) {
      setCatError("Chọn một danh mục");
      return;
    } else {
      setCatError("");
    }

    if (isEmptyInput(money, setMoney)) {
      return;
    }

    async function add() {
      await fetchEditSchedule();
    }

    add();
  };

  const fetchFrequency = async () => {
    const url = `${API_URL}/frequencies/all`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return;
      }

      var apiResponse = await response.json();

      setFrequency(apiResponse.data);
      setSelectedFrequency(apiResponse.data[0]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchSchedule = async () => {
    const token = await AsyncStorage.getItem("token");
    const id = await AsyncStorage.getItem("scheduleId");
    const url = `${API_URL}/schedules/get?id=${id}`;

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
        alert("Lỗi", "Xảy ra lỗi khi lấy thông tin");
        return;
      }

      var apiResponse = await response.json();

      setCategory(apiResponse.data.category);
      setSelectedFrequency(apiResponse.data.frequency);
      setName({ ...name, value: apiResponse.data.name });
      setChecked(apiResponse.data.type);
      setMoney({ ...money, value: apiResponse.data.money.toString() });
      setNote({ ...note, value: apiResponse.data.note });
      setFromDate(new Date(apiResponse.data.startDate));
      setFromTime(new Date(apiResponse.data.startDate));
      setToDate(new Date(apiResponse.data.endDate));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchEditSchedule = async () => {
    const token = await AsyncStorage.getItem("token");
    const id = await AsyncStorage.getItem("scheduleId");
    const url = `${API_URL}/schedules/update?id=${id}`;
    const startDate =
      fromDate.getFullYear() +
      "-" +
      String(fromDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(fromDate.getDate()).padStart(2, "0") +
      " " +
      String(fromTime.getHours()).padStart(2, "0") +
      ":" +
      String(fromTime.getMinutes()).padStart(2, "0");

    const endDate =
      toDate &&
      toDate.getFullYear() +
        "-" +
        String(toDate.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(toDate.getDate()).padStart(2, "0");

    console.log(note.value);
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          categoryCustomId: category.categoryId,
          name: name.value,
          type: checked,
          money: money.value,
          frequencyId: selectedFrequency.id,
          startDate: startDate,
          endDate: endDate,
          note: note.value,
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
        alert("Lỗi", "Xảy ra lỗi khi sửa lịch thanh toán");
        return;
      }

      alert("Thành công", "Sửa lịch thanh toán thành công", () =>
        navigation.navigate("Schedule", { id: id })
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      {loadingPage ? (
        <LoadingPage />
      ) : (
        <ScrollView style={styles.container}>
          <RadioButton.Group
            onValueChange={(value) => setChecked(value)}
            value={checked}
          >
            <View style={{ ...styles.fdRow, marginTop: 15 }}>
              <TouchableOpacity
                style={styles.fdRow}
                onPress={() => setChecked("CHI")}
              >
                <RadioButton value="CHI"></RadioButton>
                <Text style={{ fontSize: 16 }}>Chi phí</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ ...styles.fdRow, marginLeft: 30 }}
                onPress={() => setChecked("THU")}
              >
                <RadioButton value="THU"></RadioButton>
                <Text style={{ fontSize: 16 }}>Thu nhập</Text>
              </TouchableOpacity>
            </View>
          </RadioButton.Group>
          <View style={{ ...styles.row, marginTop: 5 }}>
            <TextInput
              label={name.title}
              value={name.value}
              onChangeText={(text) => setName({ ...name, value: text })}
              mode="outlined"
              activeOutlineColor={themeColors.primaryColorDark}
            />
            {name.error && <Text style={styles.errorText}>{name.error}</Text>}
          </View>
          <View style={styles.row}>
            <Text>Tần suất nhắc nhở</Text>
            <Dropdown
              data={frequency}
              labelField="name"
              valueField="id"
              placeholder="Chưa chọn"
              value={selectedFrequency}
              onChange={(item) => {
                setSelectedFrequency(item);
              }}
              activeColor={themeColors.primaryColorLighter}
              placeholderStyle={{
                color: themeColors.primaryColorLight,
                fontSize: 16,
              }}
              selectedTextStyle={{
                color: themeColors.primaryColorLight,
                fontSize: 16,
              }}
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
                  onPressOut={() => setShowFromDatePicker(false)}
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
            {category ? (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("ListCategory", {
                    type: checked,
                    page: "EditSchedule",
                  })
                }
              >
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 5,
                    alignItems: "center",
                  }}
                >
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
                  <Text
                    style={styles.rowContent}
                    ellipsizeMode="tail"
                    numberOfLines={2}
                  >
                    {category.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("ListCategory", {
                    type: checked,
                    page: "EditSchedule",
                  })
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
            )}
            {catError && <Text style={styles.errorText}>{catError}</Text>}
          </View>
          <View style={styles.row}>
            <TextInput
              label={`${money.title} (${currency})`}
              value={money.value}
              onChangeText={(text) => setMoney({ ...money, value: text })}
              mode="outlined"
              inputMode="numeric"
              activeOutlineColor={themeColors.primaryColorDark}
            />
            {money.error && <Text style={styles.errorText}>{money.error}</Text>}
          </View>
          <View style={styles.row}>
            <TextInput
              label={note.title}
              value={note.value}
              onChangeText={(text) => setNote({ ...note, value: text })}
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
              onPress={() => handleUpdateSchedule()}
            >
              <Text style={{ fontSize: 16 }}>Cập nhật</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default EditSchedule;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
  },
  row: {
    marginTop: 15,
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
  circleIcon: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  fdRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },
});
