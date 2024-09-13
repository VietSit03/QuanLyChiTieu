import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemeContext } from "../../Theme";
import * as ImagePicker from "expo-image-picker";
import { Dropdown } from "react-native-element-dropdown";

const Cur = React.memo(
  ({ item, handle }) => {
    return (
      <TouchableOpacity
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 15,
          paddingHorizontal: 15,
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

const AddTransaction = ({ route, navigation }) => {
  const { type } = route.params;
  const { themeColors } = useContext(ThemeContext);
  const [loadingPage, setLoadingPage] = useState(true);
  const [moneyBaseInput, setMoneyBaseInput] = useState("0");
  const [moneyInput, setMoneyInput] = useState("0");
  const [curBase, setCurBase] = useState();
  const [selectedCur, setSelectedCur] = useState();
  const [isFocusedNote, setIsFocusedNote] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoadingPage(false);
      setCurBase(currency[2]);
      setSelectedCur(currency[10]);
    }

    fetchData();
  }, []);
  useEffect(() => {
    setMoneyBaseInput(moneyInput * 2);
  }, [moneyInput]);

  const data = Array.from({ length: 5 }, (_, index) => ({ id: index + 1 }));

  const chunkArray = (arr, chunkSize) => {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }

    // Adding the special category
    const specialCategory = { id: "special", isSpecial: true };

    // If the last row has space for more items, push the special category there.
    if (result[result.length - 1].length < chunkSize) {
      result[result.length - 1].push(specialCategory);
    } else {
      // Otherwise, create a new row for the special category.
      result.push([specialCategory]);
    }

    // Add empty placeholders to the last row if needed
    const lastRow = result[result.length - 1];
    while (lastRow.length < chunkSize) {
      lastRow.push({ id: `empty-${lastRow.length}`, empty: true });
    }

    return result;
  };

  const rows = chunkArray(data, 3);

  const Category = ({ item }) => {
    if (item.empty) {
      return <View style={{ width: 70, height: 60 }} />;
    }
    return (
      <>
        {item.isSpecial ? (
          <View style={{ alignItems: "center", width: 70 }}>
            <TouchableOpacity
              style={{
                height: 60,
                width: 60,
                borderRadius: 30,
                backgroundColor: themeColors.primaryColorLighter,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() =>
                navigation.navigate("CategoryScreen", { type: type })
              }
            >
              <Ionicons name="add-outline" size={40} color="white" />
            </TouchableOpacity>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{ marginTop: 2 }}
            >
              Xem thêm
            </Text>
          </View>
        ) : (
          <View style={{ alignItems: "center", width: 70 }}>
            <TouchableOpacity
              style={{
                height: 60,
                width: 60,
                borderRadius: 30,
                backgroundColor: "purple",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={{ uri: "https://imgur.com/b0SG0aW.png" }}
                style={{ width: 40, height: 40 }}
              />
            </TouchableOpacity>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{ marginTop: 2 }}
            >
              Category {item.id}
            </Text>
          </View>
        )}
      </>
    );
  };

  const renderCategory = ({ item }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          marginBottom: 15,
          justifyContent: "space-around",
        }}
      >
        {item.map((category) => {
          return <Category key={category.id} item={category} />;
        })}
      </View>
    );
  };

  const [time, setTime] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [showDTP, setShowDTP] = useState(false);

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (event.type === "dismissed") {
      setTime(null);
    } else {
      setTime(selectedTime);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event.type === "dismissed") {
      // setDate(null);
    } else {
      setDate(selectedDate);
    }
  };

  const onChange = (event, selectedDate) => {
    setShowDTP(false);
    if (event.type === "dismissed") {
      setDate(null);
    } else {
      setDate(selectedDate);
      if (mode === "date") {
        setMode("time");
        setShowDTP(true);
      } else {
        setMode("date");
      }
    }
  };

  const [note, setNote] = useState("");

  const [images, setImages] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Cần quyền truy cập thư viện ảnh để sử dụng chức năng này!");
      }
    })();
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => asset.uri);
      setImages([...images, ...selectedImages]);
    }

    setModalVisible(false);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Cần quyền truy cập camera để chụp ảnh!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }

    setModalVisible(false);
  };

  const removeImage = (uri) => {
    setImages(images.filter((image) => image !== uri));
  };

  const handleSelectCur = (item) => {
    setSelectedCur(item);
  };

  const renderCur = (item) => {
    return <Cur item={item} handle={() => handleSelectCur(item)} />;
  };

  return (
    <>
      {loadingPage ? (
        <ActivityIndicator style={{ marginTop: 10 }} size={"large"} />
      ) : (
        <View style={styles.container}>
          <ScrollView style={styles.sc}>
            {curBase == selectedCur ? (
              <View style={{ ...styles.head, flexDirection: "row" }}>
                <TextInput
                  value={moneyBaseInput.toLocaleString("en-US")}
                  inputMode="numeric"
                  style={{
                    ...styles.moneyBaseInput,
                    color: themeColors.primaryColorLight,
                    borderBottomColor: themeColors.primaryColorDark,
                    borderBottomWidth: 2,
                  }}
                  selectionColor={themeColors.primaryColorLighter}
                  textAlign="center"
                  textAlignVertical="center"
                  onFocus={() => {
                    if (moneyBaseInput === "0") {
                      setMoneyBaseInput("");
                    }
                  }}
                  onBlur={() => {
                    if (moneyBaseInput === "") {
                      setMoneyBaseInput("0");
                    }
                  }}
                  onChangeText={(text) => setMoneyBaseInput(text)}
                ></TextInput>
                <Dropdown
                  style={[styles.dropdown]}
                  containerStyle={{
                    width: "90%",
                    position: "relative",
                    right: "5%",
                    left: "5%",
                  }}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  searchField="currencyName"
                  data={currency}
                  search
                  maxHeight={500}
                  labelField="currencyCode"
                  valueField="currencyCode"
                  searchPlaceholder="Tìm kiếm tiền tệ..."
                  value={selectedCur}
                  onChange={(item) => {
                    setSelectedCur(item.currencyCode);
                  }}
                  renderItem={renderCur}
                />
                {/* <Text
                  style={{
                    ...styles.cur,
                    color: themeColors.primaryColorDark,
                  }}
                >
                  {selectedCur.currencyCode}
                </Text> */}
              </View>
            ) : (
              <View style={styles.exchangeMoney}>
                <View style={styles.head}>
                  <TextInput
                    value={moneyInput.toLocaleString("en-US")}
                    inputMode="numeric"
                    style={{
                      ...styles.moneyInput,
                      color: themeColors.primaryColorLight,
                      borderBottomColor: themeColors.primaryColorDark,
                      borderBottomWidth: 2,
                    }}
                    selectionColor={themeColors.primaryColorLighter}
                    textAlign="center"
                    textAlignVertical="center"
                    onFocus={() => {
                      if (moneyInput === "0") {
                        setMoneyInput("");
                      }
                    }}
                    onBlur={() => {
                      if (moneyInput === "") {
                        setMoneyInput("0");
                      }
                    }}
                    onChangeText={(text) => setMoneyInput(text)}
                  ></TextInput>

                  <Dropdown
                    style={[styles.dropdown]}
                    containerStyle={{
                      width: "90%",
                      position: "relative",
                      right: "5%",
                      left: "5%",
                    }}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    searchField="currencyName"
                    data={currency}
                    search
                    maxHeight={500}
                    labelField="currencyCode"
                    valueField="currencyCode"
                    searchPlaceholder="Tìm kiếm tiền tệ..."
                    value={selectedCur}
                    onChange={(item) => {
                      setSelectedCur(item.currencyCode);
                    }}
                    renderItem={renderCur}
                  />
                </View>
                <View style={styles.head}>
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 40,
                      marginRight: 10,
                    }}
                  >
                    =
                  </Text>
                  <Text style={styles.moneyBaseInput}>{moneyBaseInput}</Text>
                  <Text
                    style={{
                      ...styles.cur,
                      color: "gray",
                    }}
                  >
                    {curBase.currencyCode}
                  </Text>
                </View>
              </View>
            )}
            <View style={styles.row}>
              <Text style={styles.lbl}>Danh mục</Text>
              <FlatList
                style={{ marginTop: 10 }}
                data={rows}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderCategory}
                scrollEnabled={false}
              />
            </View>
            <View style={styles.row}>
              <Text style={styles.lbl}>Thời gian</Text>
              <TouchableOpacity
                style={styles.content}
                onPress={() => {
                  setDate(new Date());
                  setShowDTP(true);
                }}
              >
                {date ? (
                  <Text>{date.toLocaleString()}</Text>
                ) : (
                  <Text
                    style={{
                      color: themeColors.primaryColorLight,
                      fontSize: 16,
                    }}
                  >
                    Chưa chọn
                  </Text>
                )}
              </TouchableOpacity>
              {showDTP && (
                <DateTimePicker
                  value={date}
                  mode={mode}
                  display="default"
                  onChange={onChange}
                  is24Hour={true}
                />
              )}
            </View>
            <View style={styles.row}>
              <Text style={styles.lbl}>Ghi chú</Text>
              <TextInput
                style={{
                  ...styles.content,
                  borderBottomWidth: 2,
                  borderBottomColor: isFocusedNote
                    ? themeColors.primaryColorDark
                    : "silver",
                }}
                onFocus={() => setIsFocusedNote(true)}
                onBlur={() => setIsFocusedNote(false)}
                selectionColor={themeColors.primaryColorLighter}
                placeholder="Ghi chú"
                value={note}
                onChangeText={(text) => setNote(text)}
              ></TextInput>
            </View>
            <View style={styles.row}>
              <Text style={styles.lbl}>Ảnh</Text>
              <TouchableOpacity onPress={toggleModal}>
                <Text
                  style={{
                    ...styles.content,
                    color: themeColors.primaryColorLight,
                  }}
                >
                  Thêm ảnh
                </Text>
              </TouchableOpacity>

              <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={toggleModal}
              >
                <TouchableWithoutFeedback onPress={toggleModal}>
                  <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback>
                      <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Chọn ảnh</Text>

                        <TouchableOpacity
                          style={styles.btnModal}
                          onPress={takePhoto}
                        >
                          <Text style={styles.btnTextModal}>Chụp ảnh</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.btnModal}
                          onPress={selectImage}
                        >
                          <Text style={styles.btnTextModal}>
                            Chọn từ thư viện
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>

              <FlatList
                style={{
                  marginLeft: 20,
                  marginTop: 5,
                  paddingBottom: 10,
                }}
                data={images}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: item }} style={styles.image} />
                    <TouchableOpacity onPress={() => removeImage(item)}>
                      <Text style={styles.removeText}>Xóa</Text>
                    </TouchableOpacity>
                  </View>
                )}
                showsHorizontalScrollIndicator={false}
                horizontal
              />
            </View>
            <View style={{ backgroundColor: "transparent", height: 70 }}></View>
          </ScrollView>
          <View style={styles.btnSelect}>
            <TouchableOpacity
              style={styles.btnSelectActive}
              // disabled={selectedCategory.id == -1}
            >
              <Text>Thêm</Text>
            </TouchableOpacity>
          </View>
          {isModalVisible && <View style={styles.bgModal} />}
        </View>
      )}
    </>
  );
};

export default AddTransaction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sc: {
    flex: 1,
    paddingTop: 10,
  },
  head: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  moneyInput: {
    width: "35%",
    marginRight: 10,
    paddingVertical: 2,
    fontSize: 20,
    fontWeight: "bold",
  },
  moneyBaseInput: {
    width: "35%",
    marginRight: 10,
    paddingVertical: 2,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "gray",
    borderBottomColor: "gray",
    borderBottomWidth: 2,
  },
  cur: {
    fontSize: 20,
    fontWeight: "medium",
  },
  exchangeMoney: {
    flexDirection: "column",
  },
  row: {
    marginTop: 30,
  },
  lbl: {
    paddingHorizontal: 20,
    color: "gray",
  },
  content: {
    marginHorizontal: 20,
    marginTop: 5,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  imageContainer: {
    marginRight: 10,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeText: {
    color: "red",
    marginTop: 5,
    fontSize: 16,
  },
  btnModal: {
    paddingVertical: 10,
  },
  btnTextModal: {
    fontSize: 16,
  },
  bgModal: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  btnSelect: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  btnSelectInactive: {
    backgroundColor: "gold",
    width: "65%",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 500,
    opacity: 0.5,
  },
  btnSelectActive: {
    backgroundColor: "gold",
    width: "65%",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 500,
  },
  dropdown: {
    height: 50,
    width: 100,
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    fontSize: 20,
    color: "gray",
  },
  selectedTextStyle: {
    fontSize: 20,
    color: "black",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
