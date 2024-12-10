import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { ThemeContext } from "../../Theme";
import { API_URL } from "@env";
import { alert, encrypt, isEmptyInput } from "../../common";
import { passwordRegex } from "../../regex";

const UserProfile = ({ navigation }) => {
  const { themeColors } = useContext(ThemeContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [balance, setBalance] = useState("");
  const [currency, setCurrency] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState({
    title: "Mật khẩu cũ",
    value: "",
    error: "",
    visible: false,
  });
  const [newPassword, setNewPassword] = useState({
    title: "Mật khẩu mới",
    value: "",
    error: "",
    visible: false,
  });
  const [confirmPassword, setConfirmPassword] = useState({
    title: "Mật khẩu xác nhận",
    value: "",
    error: "",
    visible: false,
  });

  useEffect(() => {
    async function fetchData() {
      setEmail(await AsyncStorage.getItem("email"));
      setName(await AsyncStorage.getItem("name"));
      setBalance(
        Number(await AsyncStorage.getItem("balance")).toLocaleString("vi-VN")
      );
      setCurrency(await AsyncStorage.getItem("currencyBase"));
    }

    fetchData();
  }, []);

  const fetchUpdateProfile = async () => {
    const token = await AsyncStorage.getItem("token");
    const url = `${API_URL}/users/update`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name,
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
        alert();
        return;
      }

      await AsyncStorage.setItem("name", name);

      alert("Thành công", "Sửa thông hồ sơ thành công.");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdateProfile = () => {
    async function update() {
      await fetchUpdateProfile();
    }

    update();
  };

  const fetchCPW = async () => {
    var email = await AsyncStorage.getItem("email");
    var hashedPassword = encrypt(newPassword.value);
    const url = `${API_URL}/changepassword`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          newPassword: hashedPassword,
        }),
      });

      if (!response.ok) {
        Alert.alert(
          "Lỗi",
          "Xảy ra lỗi khi đổi mật khẩu.\nVui lòng kiểm tra lại."
        );
        return;
      }

      await AsyncStorage.setItem("email", "");

      Alert.alert(
        "Đổi mật khẩu thành công",
        "Mật khẩu đã được cập nhật. Hãy đăng nhập để tiếp tục.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ],
        { cancelable: false }
      );

      setIsModalVisible(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const checkEmptyAll = () => {
    let isTrue1 = isEmptyInput(oldPassword, setOldPassword);
    let isTrue2 = isEmptyInput(newPassword, setNewPassword);
    let isTrue3 = isEmptyInput(confirmPassword, setConfirmPassword);
    if (isTrue1 || isTrue2 || isTrue3) {
      return false;
    }
    return true;
  };

  const handleChangePassword = () => {
    if (!checkEmptyAll()) {
      return;
    }

    if (checkNewPassword()) {
      setNewPassword({ ...newPassword, error: "" });
      setConfirmPassword({ ...confirmPassword, error: "" });
    } else {
      return;
    }

    fetchCPW();
  };

  const checkNewPassword = () => {
    if (!passwordRegex.test(newPassword.value)) {
      setNewPassword({
        ...newPassword,
        error:
          "Mật khẩu mới phải có ít nhất 8 kí tự gồm ít nhất 1 chữ hoa (A-Z), 1 chữ thường (a-z), 1 chữ số (0-9), 1 kí tự đặc biệt (!@#$%^&*()-_=+)",
      });
      return false;
    }

    return true;
  };

  const checkConfirmPassword = () => {
    if (newPassword.value !== confirmPassword.value) {
      setConfirmPassword({
        ...confirmPassword,
        error: "Mật khẩu xác nhận không trùng khớp",
      });
      return;
    }
    setConfirmPassword({
      ...confirmPassword,
      error: "",
    });
  };

  const handlePasswordChange = () => {
    setIsModalVisible(true);
  };

  const navigateToCurrencyPage = () => {
    navigation.navigate("Currency");
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.text}>{email}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Số dư:</Text>
        <Text style={styles.text}>{balance}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Loại tiền tệ:</Text>
        <TouchableOpacity onPress={navigateToCurrencyPage}>
          <Text style={[styles.text, styles.link]}>{currency}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Tên:</Text>
        <TextInput
          style={{
            ...styles.input,
            borderBottomColor: themeColors.primaryColorLight,
          }}
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={handleUpdateProfile}
          s
          style={[
            styles.button,
            { backgroundColor: themeColors.primaryColorDark },
          ]}
        >
          <Text style={styles.buttonText}>Cập nhật</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          style={[
            styles.button,
            { backgroundColor: themeColors.primaryColorDark },
          ]}
        >
          <Text style={styles.buttonText}>Đổi mật khẩu</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Đổi mật khẩu</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Mật khẩu cũ:</Text>
              <View style={{ flex: 2 }}>
                <TextInput
                  placeholder="Nhập mật khẩu cũ"
                  value={oldPassword.value}
                  onChangeText={(text) =>
                    setOldPassword({ ...oldPassword, value: text })
                  }
                  style={{
                    ...styles.input,
                    borderBottomColor: themeColors.primaryColorLight,
                  }}
                  secureTextEntry
                  onBlur={() => {
                    isEmptyInput(oldPassword, setOldPassword);
                  }}
                />
              </View>
            </View>
            {oldPassword.error && (
              <Text style={styles.errorText}>{oldPassword.error}</Text>
            )}

            <View style={styles.row}>
              <Text style={styles.label}>Mật khẩu mới:</Text>

              <View style={{ flex: 2 }}>
                <TextInput
                  placeholder="Nhập mật khẩu mới"
                  value={newPassword.value}
                  onChangeText={(text) =>
                    setNewPassword({ ...newPassword, value: text })
                  }
                  style={{
                    ...styles.input,
                    borderBottomColor: themeColors.primaryColorLight,
                  }}
                  secureTextEntry
                  onBlur={() => {
                    isEmptyInput(newPassword, setNewPassword);
                    if (newPassword.value != "") {
                      checkConfirmPassword();
                    }
                  }}
                />
              </View>
            </View>
            {newPassword.error && (
              <Text style={styles.errorText}>{newPassword.error}</Text>
            )}

            <View style={styles.row}>
              <Text style={styles.label}>Xác nhận:</Text>
              <View style={{ flex: 2 }}>
                <TextInput
                  placeholder="Nhập lại mật khẩu mới"
                  value={confirmPassword.value}
                  onChangeText={(text) =>
                    setConfirmPassword({ ...confirmPassword, value: text })
                  }
                  style={{
                    ...styles.input,
                    borderBottomColor: themeColors.primaryColorLight,
                  }}
                  secureTextEntry
                  onBlur={() => {
                    isEmptyInput(confirmPassword, setConfirmPassword);
                    if (confirmPassword.value != "") {
                      checkConfirmPassword();
                    }
                  }}
                />
              </View>
            </View>
            {confirmPassword.error && (
              <Text style={styles.errorText}>{confirmPassword.error}</Text>
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: themeColors.primaryColorLight },
                ]}
                onPress={handleChangePassword}
              >
                <Text style={styles.buttonText}>Xác nhận</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: "red" }]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.buttonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    flex: 1,
  },
  text: {
    fontSize: 16,
    flex: 2,
  },
  input: {
    borderBottomWidth: 2,
    padding: 0,
    fontSize: 16,
    flex: 2,
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
  changePasswordButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },
});
