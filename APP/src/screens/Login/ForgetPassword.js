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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isEmptyInput } from "../../common";

const ForgetPassword = ({ navigation }) => {
  const [email, setEmail] = useState({ title: "Email", value: "", error: "" });
  const [code, setCode] = useState({
    title: "Mã xác nhận",
    value: "",
    error: "",
  });
  const [sentEmail, setSentEmail] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  let timer;
  let checkInterval;

  const sendEmail = async () => {
    setIsLoadingAction(true);
    if (isEmptyInput(email, setEmail)) {
      setIsLoadingAction(false);
      return;
    }

    const url = `${API_URL}/forgetpassword`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.value,
        }),
      });

      setIsLoadingAction(false);

      var apiResponse = await response.json();

      if (!response.ok) {
        if (apiResponse.errorCode == "#1009") {
          setEmail({
            ...email,
            error: "Không tồn tại email trong hệ thống. Hãy kiểm tra lại",
          });
          return;
        } else if (apiResponse.errorCode == "#1010") {
          setEmail({
            ...email,
            error:
              "Tài khoản chưa được kích hoạt. Hãy truy cập địa chỉ email để tiếp tục",
          });
          return;
        } else if (apiResponse.errorCode == "#1003") {
          setEmail({
            ...email,
            error: "Tài khoản đã bị vô hiệu hoá",
          });
          return;
        }
      }

      setEmail({
        ...email,
        error: "",
      });
      Alert.alert(
        "Thông báo",
        `Chúng tôi đã gửi mã xác nhận đến địa chỉ mail ${email.value}.\nVui lòng truy cập và xác nhận để tiếp tục.`
      );
      await AsyncStorage.setItem("email", email.value);
      setSentEmail(true);

      setIsButtonDisabled(true);
      let time = 60;
      setRemainingTime(time);

      timer = setInterval(() => {
        time -= 1;
        setRemainingTime(time);
        if (time <= 0) {
          clearInterval(timer);
          setIsButtonDisabled(false);
        }
      }, 1000);

      checkInterval = setInterval(CheckVerifyCode, 5000);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const verifyCode = async () => {
    setIsLoadingAction(true);
    if (sentEmail && isEmptyInput(code, setCode)) {
      setIsLoadingAction(false);
      return;
    }

    var email = await AsyncStorage.getItem("email");
    const url = `${API_URL}/verifycodes/verify?email=${email}&code=${code.value}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setIsLoadingAction(false);

      if (!response.ok) {
        setCode({
          ...code,
          error: "Mã xác thực không chính xác, hãy kiểm tra lại",
        });
        return;
      }

      clearInterval(checkInterval);
      navigation.navigate("ChangePassword");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const CheckVerifyCode = async () => {
    const url = `${API_URL}/verifycodes/check?email=${email.value}`;

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

      clearInterval(checkInterval);
      navigation.navigate("ChangePassword");
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
          source={require("../../../assets/icon.png")}
          style={styles.logo}
        />
        {isLoadingAction && (
          <ActivityIndicator style={{ marginVertical: 10 }} size={"large"} />
        )}

        <View style={styles.input}>
          <TextInput
            label={email.title}
            value={email.value}
            onChangeText={(text) => setEmail({ ...email, value: text })}
            activeOutlineColor="#20B2AA"
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            disabled={sentEmail}
            onBlur={() => isEmptyInput(email, setEmail)}
          />
          {email.error && <Text style={styles.errorText}>{email.error}</Text>}
        </View>

        {sentEmail && (
          <View style={styles.input}>
            <TextInput
              label={code.title}
              value={code.value}
              onChangeText={(text) => setCode({ ...code, value: text })}
              activeOutlineColor="#20B2AA"
              mode="outlined"
              autoCapitalize="none"
              onBlur={() => isEmptyInput(code, setCode)}
            />
            {code.error && <Text style={styles.errorText}>{code.error}</Text>}
          </View>
        )}

        <TouchableOpacity
          onPress={sendEmail}
          style={{ ...styles.button, opacity: isButtonDisabled && 0.5 }}
          activeOpacity={0.5}
          disabled={isButtonDisabled}
        >
          <Text style={styles.buttonText}>
            {isButtonDisabled
              ? `Gửi lại mã (${remainingTime}s)`
              : sentEmail
              ? "Gửi lại mã"
              : "Gửi mã"}
          </Text>
        </TouchableOpacity>

        {sentEmail && (
          <TouchableOpacity
            onPress={verifyCode}
            style={styles.button}
            activeOpacity={0.5}
          >
            <Text style={styles.buttonText}>Xác nhận</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => {
            clearInterval(timer);
            clearInterval(checkInterval);
            navigation.goBack();
          }}
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

export default ForgetPassword;
