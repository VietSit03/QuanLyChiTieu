import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from "react-native";
import { TextInput } from "react-native-paper";
import { API_URL, CRYPTOJS_KEY } from "@env";
import CryptoJS, { enc } from "crypto-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { encrypt } from "../../common";

const Login = ({ navigation }) => {
  const [error, setError] = useState("");
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [logging, setLogging] = useState(false);

  const checkEmpty = (key) => {
    setError("");
    if (key == "email") {
      if (email.value === "" || email.value === null) {
        setEmail({ ...email, error: "Email không được trống" });
      } else {
        setEmail({ ...email, error: "" });
      }
    } else {
      if (password.value === "" || password.value === null) {
        setPassword({ ...password, error: "Password không được trống" });
      } else {
        setPassword({ ...password, error: "" });
      }
    }
  };

  const handleLogin = async () => {
    if (email.error != "" || password.error != "" || email.value == "" || password.value == "") {
      Alert.alert("Thông báo", "Hãy nhập đầy đủ thông tin");
      return;
    }

    const url = `${API_URL}/login`;
    var hashedPassword = encrypt(password.value);
    console.log(hashedPassword);

    setLogging(true);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.value,
          password: hashedPassword,
        }),
      });

      setLogging(false);

      var apiResponse = await response.json();
      if (!response.ok) {
        if (apiResponse.errorCode == "#1010") {
          setError("Tài khoản chưa được kích hoạt. Hãy truy cập địa chỉ email để tiếp tục");
          setPassword({ ...password, value: "", error: "" });
          return
        }
        else if (apiResponse.errorCode == "#1003") {
          setError("Tài khoản đã bị vô hiệu hoá");
          setPassword({ ...password, value: "", error: "" });
          return
        }
        else if (apiResponse.errorCode == "#1002") {
          setError("Thông tin đăng nhập không chính xác");
          setPassword({ ...password, value: "", error: "" });
          return;
        }
      }

      await AsyncStorage.setItem("token", apiResponse.token);
      await AsyncStorage.setItem("currencyBase", apiResponse.data.currencyCode);
      await AsyncStorage.setItem("currencySymbol", apiResponse.data.currencySymbol);

      console.log(apiResponse.token);
      console.log(apiResponse.data.currencyCode);
      console.log(apiResponse.data.currencySymbol);

      navigation.replace("DrawerNavigator");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/background_dot.png")}
      resizeMode="repeat"
      style={styles.background}
    >
      <View style={styles.container}>
        <Image
          source={require("../../../assets/icon.png")} // Thay đổi đường dẫn logo của bạn
          style={styles.logo}
        />

        {logging && <ActivityIndicator size={"large"} />}

        <View style={styles.input}>
          <TextInput
            value={email.value}
            onChangeText={(text) => setEmail({ ...email, value: text })}
            mode="outlined"
            activeOutlineColor="#20B2AA"
            label="Email"
            keyboardType="email-address"
            onBlur={() => checkEmpty("email")}
            error={email.error}
          />
          {email.error && <Text style={styles.errorText}>{email.error}</Text>}
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        <View style={styles.input}>
          <TextInput
            value={password.value}
            onChangeText={(text) => setPassword({ ...password, value: text })}
            mode="outlined"
            activeOutlineColor="#20B2AA"
            label="Mật khẩu"
            secureTextEntry={!passwordVisible}
            right={
              <TextInput.Icon
                icon={passwordVisible ? "eye-off" : "eye"}
                size={24}
                onPress={() => setPasswordVisible(!passwordVisible)}
              />
            }
            onBlur={() => checkEmpty("password")}
            error={password.error != ""}
          />
          {password.error && (
            <Text style={styles.errorText}>{password.error}</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.5}
          onPress={() => handleLogin()}
        >
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>

        <View style={styles.btnLink}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgetPassword")}
            activeOpacity={0.5}
          >
            <Text style={styles.linkText}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            activeOpacity={0.5}
          >
            <Text style={styles.linkText}>Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Login;

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
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 40,
  },
  input: {
    width: "80%",
    marginTop: 20,
  },
  button: {
    width: "80%",
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
  btnLink: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  linkText: {
    color: "#66CDAA",
    fontSize: 14,
    marginTop: 10,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
    marginLeft: 5,
  },
});
