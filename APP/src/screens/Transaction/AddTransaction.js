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
  Pressable,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemeContext } from "../../Theme";
import * as ImagePicker from "expo-image-picker";
import { Dropdown } from "react-native-element-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, IMGUR_CLIENID } from "@env";
import { LoadingAction, LoadingPage } from "../../component/Loading";
import * as FileSystem from "expo-file-system";
import { alert } from "../../common";
import * as ImageManipulator from "expo-image-manipulator";

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

const Category = React.memo(
  ({ item, handle, selectedCategory, themeColors, navigation, type }) => {
    if (item.empty) {
      return <View style={{ width: 110, height: 110 }} />;
    }
    return (
      <>
        {item.isSpecial ? (
          <View
            style={{
              alignItems: "center",
              width: 110,
              height: 100,
              paddingHorizontal: 5,
              paddingVertical: 15,
            }}
          >
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
                navigation.navigate("ListCategory", { type: type, page: "AddTransaction" })
              }
            >
              <Ionicons name="add-outline" size={40} color="white" />
            </TouchableOpacity>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ marginTop: 2 }}
            >
              Xem thêm
            </Text>
          </View>
        ) : (
          <View
            style={{
              alignItems: "center",
              width: 110,
              height: 110,
              justifyContent: "center",
              backgroundColor:
                item.id == selectedCategory.id ? item.color : "transparent",
              borderRadius: 15,
              padding: 5,
            }}
          >
            <Pressable
              style={{
                alignItems: "center",
              }}
              onPress={handle}
            >
              <View
                style={{
                  height: 60,
                  width: 60,
                  borderRadius: 30,
                  backgroundColor: item.color,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{ uri: item.imgSrc }}
                  style={{ width: 40, height: 40 }}
                />
              </View>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ marginTop: 2 }}
              >
                {item.name}
              </Text>
            </Pressable>
          </View>
        )}
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.selectedCategory.id !== prevProps.item.id &&
      nextProps.selectedCategory.id !== prevProps.item.id
    );
  }
);

const AddTransaction = ({ route, navigation }) => {
  const { type } = route.params;
  const { themeColors } = useContext(ThemeContext);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [moneyBaseInput, setMoneyBaseInput] = useState("0");
  const [moneyInput, setMoneyInput] = useState("0");
  const [currency, setCurrency] = useState();
  const [curBase, setCurBase] = useState();
  const [selectedCur, setSelectedCur] = useState();
  const [isFocusedNote, setIsFocusedNote] = useState(false);
  const [category, setCategory] = useState();
  const [selectedCategory, setSelectedCategory] = useState({ id: -1 });

  useEffect(() => {
    async function fetchData() {
      await fetchCurrency();
      await fetchCategory();
      setLoadingPage(false);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (route.params?.category) {
      var ctg = route.params?.category;
      setCategory((prevCategory) => [ctg, ...prevCategory]);
      setSelectedCategory(ctg);
      return;
    }
  }, [route.params]);

  useEffect(() => {
    async function fetchExchange() {
      await fetchExchangeCurrency();
    }

    if (selectedCur != curBase) {
      fetchExchange();
    }
  }, [moneyInput]);

  const fetchCurrency = async () => {
    const token = await AsyncStorage.getItem("token");
    const url = `${API_URL}/Currency/GetAll`;

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
        return;
      }

      var apiResponse = await response.json();
      var currencies = apiResponse.data;
      var curCodeBase = await AsyncStorage.getItem("currencyBase");
      var curBase = currencies.find(
        (currency) => currency.currencyCode === curCodeBase
      );

      setCurrency(currencies);
      setCurBase(curBase);
      setSelectedCur(curBase);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchExchangeCurrency = async () => {
    const token = await AsyncStorage.getItem("token");
    const url = `${API_URL}/Currency/ExchangeCurrency`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          money: moneyInput,
          fromCurrencyCode: selectedCur.currencyCode,
          toCurrencyCode: curBase.currencyCode,
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
        return;
      }

      var apiResponse = await response.json();

      setMoneyBaseInput(apiResponse.data.toMoney);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchCategory = async () => {
    const token = await AsyncStorage.getItem("token");
    const url = `${API_URL}/CustomCategory/GetTop?num=8&type=${type}`;

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
        return;
      }

      var apiResponse = await response.json();

      setCategory(apiResponse.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const data = Array.from({ length: 5 }, (_, index) => ({ id: index + 1 }));

  const chunkArray = (arr, chunkSize) => {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }

    const specialCategory = { id: "special", isSpecial: true };

    if (result[result.length - 1].length < chunkSize) {
      result[result.length - 1].push(specialCategory);
    } else {
      result.push([specialCategory]);
    }

    const lastRow = result[result.length - 1];
    while (lastRow.length < chunkSize) {
      lastRow.push({ id: `empty-${lastRow.length}`, empty: true });
    }

    return result;
  };

  const rows = chunkArray(data, 3);

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
          return (
            <Category
              key={category.id}
              item={category}
              handle={() => setSelectedCategory(category)}
              selectedCategory={selectedCategory}
              themeColors={themeColors}
              navigation={navigation}
              type={type}
            />
          );
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
      return;
    } else {
      if (mode === "date") {
        setTime(selectedDate);
        setMode("time");
        setShowDTP(true);
      } else {
        const selectedDateObject = new Date(selectedDate);

        const day = time.getDate();
        const month = time.getMonth();
        const year = time.getFullYear();

        const hours = selectedDateObject.getHours();
        const minutes = selectedDateObject.getMinutes();
        const seconds = selectedDateObject.getSeconds();

        const finalDate = new Date(year, month, day, hours, minutes, seconds);

        console.log(finalDate);

        setTime(finalDate);

        setMode("date");
      }
    }
  };

  const [note, setNote] = useState("");

  const [imagesBase64, setImagesBase64] = useState([]);
  const [images, setImages] = useState([]);
  const [imgSrc, setImgSrc] = useState([]);
  const [isUpload, setIsUpload] = useState(false);
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
      const base64Images = await Promise.all(
        result.assets.map(async (asset) => {
          const manipulatedResult = await ImageManipulator.manipulateAsync(
            asset.uri,
            [{ resize: { width: 700 } }],
            { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
          );

          const base64 = await FileSystem.readAsStringAsync(
            manipulatedResult.uri,
            {
              encoding: FileSystem.EncodingType.Base64,
            }
          );
          return base64;
        })
      );

      setImagesBase64([...imagesBase64, ...base64Images]);

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
      const photoUri = result.assets[0].uri;
      const manipulatedResult = await ImageManipulator.manipulateAsync(
        photoUri,
        [{ resize: { width: 700 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      const base64Image = await FileSystem.readAsStringAsync(
        manipulatedResult.uri,
        {
          encoding: FileSystem.EncodingType.Base64,
        }
      );
      setImages([...images, photoUri]);
      setImagesBase64([...imagesBase64, base64Image]);
    }

    setModalVisible(false);
  };

  const removeImage = (uri) => {
    const index = images.indexOf(uri);

    if (index > -1) {
      setImages(images.filter((image, i) => i !== index));

      setImagesBase64(imagesBase64.filter((_, i) => i !== index));
    }
  };

  const handleSelectCur = (item) => {
    setSelectedCur(item);
  };

  const renderCur = (item) => {
    return <Cur item={item} handle={() => handleSelectCur(item)} />;
  };

  const handleAddTrans = async () => {
    setLoadingAction(true);

    const uploadImages = async () => {
      for (const base64Image of imagesBase64) {
        if (!(await uploadImage(base64Image))) {
          return false;
        }
      }
      return true;
    };

    if (!(await uploadImages())) {
      alert("Lỗi ảnh", "Xảy ra lỗi khi lưu ảnh, vui lòng thử lại.");
      setLoadingAction(false);
      return;
    }

    setIsUpload(true);
  };

  useEffect(() => {
    if (isUpload) {
      async function add() {
        await fetchAddTrans();
        setLoadingAction(false);
      }
      add();
    }
  }, [isUpload, imgSrc]);

  const fetchAddTrans = async () => {
    const token = await AsyncStorage.getItem("token");
    const url = `${API_URL}/transactions/add`;
    const categoryId = parseInt(selectedCategory.id);
    const money = parseFloat(moneyBaseInput);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          categoryId: categoryId,
          type: type,
          money: money,
          currencyCode: curBase.currencyCode,
          createAt: new Date(time),
          note: note,
          imgSrc: imgSrc,
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
        alert("Lỗi", "Xảy ra lỗi khi thêm giao dịch. Vui lòng thử lại sau.");
        return;
      }

      alert("Thành công", "Thêm giao dịch thành công.", () =>
        navigation.replace("Home")
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const uploadImage = async (base64Image) => {
    setLoadingAction(true);
    try {
      const response = await fetch("https://api.imgur.com/3/image", {
        method: "POST",
        headers: {
          Authorization: `Client-ID ${IMGUR_CLIENID}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Image }),
      });

      const result = await response.json();
      if (result.success) {
        setImgSrc((prevImgSrc) => [...prevImgSrc, result.data.link]);
        console.log("Upload thành công", result.data.link);
        return true;
      } else {
        console.log("Upload thất bại", result.data.error);
        return false;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <>
      {loadingPage ? (
        <LoadingPage />
      ) : (
        <View style={styles.container}>
          <ScrollView style={styles.sc}>
            {loadingAction && <LoadingAction />}
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
                  <Text style={styles.moneyBaseInput}>
                    {moneyBaseInput}
                  </Text>
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
                data={chunkArray(category, 3)}
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
                  setTime(new Date());
                  setShowDTP(true);
                }}
              >
                {time ? (
                  <Text>{time.toLocaleString()}</Text>
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
            <View style={styles.btnSelect}>
              <TouchableOpacity
                style={styles.btnSelectActive}
                // disabled={selectedCategory.id == -1}
                onPress={() => handleAddTrans()}
              >
                <Text>Thêm</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
    marginBottom: 20,
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
