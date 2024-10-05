import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { API_URL } from "@env";
import { TextInput } from "react-native-paper";
import { Image } from "react-native";
import { encrypt } from "../../common";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { passwordRegex } from "../../regex";
import { isEmptyInput } from "../../common";

const ChangePassword = ({ navigation }) => {
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [password, setPassword] = useState({
    title: "Mật khẩu",
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

  const fetchCPW = async () => {
    setIsLoadingAction(true);
    var email = await AsyncStorage.getItem("email");
    var hashedPassword = encrypt(password.value);
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

      setIsLoadingAction(false);

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
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const checkError = () => {
    var error = password.error != "" || confirmPassword.error != "";

    console.log("Check" + password.error);
  };

  const checkEmptyAll = () => {
    let isTrue3 = isEmptyInput(password, setPassword);
    let isTrue4 = isEmptyInput(confirmPassword, setConfirmPassword);
    if (isTrue3 || isTrue4) {
      return false;
    }
    return true;
  };

  const handleChangePassword = () => {
    if (!checkEmptyAll()) {
      return;
    }

    if (checkPassword()) {
      setPassword({ ...password, error: "" });
      setConfirmPassword({ ...confirmPassword, error: "" });
    } else {
      return;
    }

    fetchCPW();
  };

  const checkPassword = () => {
    if (!passwordRegex.test(password.value)) {
      setPassword({
        ...password,
        error:
          "Mật khẩu phải có ít nhất 8 kí tự gồm ít nhất 1 chữ hoa (A-Z), 1 chữ thường (a-z), 1 chữ số (0-9), 1 kí tự đặc biệt (!@#$%^&*()-_=+)",
      });
      return false;
    }

    return true;
  };

  const checkConfirmPassword = () => {
    if (password.value !== confirmPassword.value) {
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

  const handleGoBack = async () => {
    await AsyncStorage.setItem("email", "");
    navigation.navigate("Login");
  };

  return (
    <ImageBackground
      source={require("../../../assets/background_dot.png")}
      resizeMode="repeat"
      style={styles.background}
    >
      <View style={styles.container}>
        <Image
          source={require("../../../assets/icon.png")}
          style={styles.logo}
        />
        {isLoadingAction && (
          <ActivityIndicator style={{ marginVertical: 10 }} size={"large"} />
        )}

        <View style={styles.input}>
          <TextInput
            label="Mật khẩu"
            value={password.value}
            onChangeText={(text) => setPassword({ ...password, value: text })}
            activeOutlineColor="#20B2AA"
            mode="outlined"
            secureTextEntry={!password.visible}
            right={
              <TextInput.Icon
                icon={password.visible ? "eye-off" : "eye"}
                size={24}
                onPress={() =>
                  setPassword({ ...password, visible: !password.visible })
                }
              />
            }
            onBlur={() => {
              isEmptyInput(password, setPassword);
              if (confirmPassword.value != "") {
                checkConfirmPassword();
              }
            }}
          />
          {password.error && (
            <Text style={styles.errorText}>{password.error}</Text>
          )}
        </View>

        <View style={styles.input}>
          <TextInput
            label="Xác nhận mật khẩu"
            value={confirmPassword.value}
            onChangeText={(text) =>
              setConfirmPassword({ ...confirmPassword, value: text })
            }
            activeOutlineColor="#20B2AA"
            mode="outlined"
            secureTextEntry={!confirmPassword.visible}
            right={
              <TextInput.Icon
                icon={confirmPassword.visible ? "eye-off" : "eye"}
                size={24}
                onPress={() =>
                  setConfirmPassword({
                    ...confirmPassword,
                    visible: !confirmPassword.visible,
                  })
                }
              />
            }
            onBlur={() => {
              isEmptyInput(confirmPassword, setConfirmPassword);
              if (confirmPassword.value != "") {
                checkConfirmPassword();
              }
            }}
          />
          {confirmPassword.error && (
            <Text style={styles.errorText}>{confirmPassword.error}</Text>
          )}
        </View>

        <TouchableOpacity
          onPress={handleChangePassword}
          style={styles.button}
          activeOpacity={0.5}
        >
          <Text style={styles.buttonText}>Đổi mật khẩu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleGoBack()}
          style={styles.button}
          activeOpacity={0.5}
        >
          <Text style={styles.buttonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 40,
  },
  input: {
    width: "90%",
    marginBottom: 15,
  },
  button: {
    width: "90%",
    height: 50,
    backgroundColor: "#008080",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
    marginLeft: 5,
  },
});

export default ChangePassword;
