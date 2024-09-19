import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput, Text } from "react-native-paper";
import { emailRegex, passwordRegex } from "../../regex";
import { API_URL } from "@env";
import { encrypt, isEmptyInput } from "../../common";

const Register = ({ navigation }) => {
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [email, setEmail] = useState({ title: "Email", value: "", error: "" });
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
  const [name, setName] = useState({ title: "Tên", value: "", error: "" });

  const checkEmptyAll = () => {
    let isTrue1 = isEmptyInput(name, setName);
    let isTrue2 = isEmptyInput(email, setEmail);
    let isTrue3 = isEmptyInput(password, setPassword);
    let isTrue4 = isEmptyInput(confirmPassword, setConfirmPassword);
    if (isTrue1 || isTrue2 || isTrue3 || isTrue4) {
      return false;
    }
    return true;
  };

  const checkEmail = async () => {
    const checkExistedEmail = async () => {
      const url = `${API_URL}/Users/CheckExistedEmail?email=${email.value}`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 400) {
          return false;
        }

        return true;
      } catch (err) {
        console.error("Error:", err);
      }
    };

    if (!emailRegex.test(email.value)) {
      setEmail({ ...email, error: "Vui lòng nhập đúng địa chỉ email" });
      return false;
    }

    if (await checkExistedEmail()) {
      setEmail({
        ...email,
        error: "Email đã tồn tại trong hệ thống. Hãy nhập địa chỉ email khác",
      });
      return false;
    }

    return true;
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

    if (!checkConfirmPassword()) {
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
      return false;
    }
    setConfirmPassword({
      ...confirmPassword,
      error: "",
    });
    return true;
  };

  const fetchRegister = async () => {
    setIsLoadingAction(true);
    const url = `${API_URL}/Register`;
    const hashedPassword = encrypt(password.value);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.value,
          password: hashedPassword,
          name: name.value,
        }),
      });

      setIsLoadingAction(false);
      console.log(response);

      if (!response.ok) {
        Alert.alert("Lỗi", "Xảy ra lỗi. Vui lòng thử lại sau.");
        return;
      }

      Alert.alert(
        "Đăng ký thành công",
        `Đăng ký tài khoản thành công. Hãy truy cập email ${email.value} để kích hoạt tài khoản và đăng nhập để tiếp tục.`,
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ],
        { cancelable: false }
      );
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleRegister = () => {
    if (!checkEmptyAll()) {
      return;
    }

    if (checkEmail()) {
      setEmail({ ...email, error: "" });
    } else return;

    if (checkPassword()) {
      setPassword({ ...password, error: "" });
      setConfirmPassword({ ...confirmPassword, error: "" });
    } else return;

    fetchRegister();
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
            label="Tên"
            value={name.value}
            onChangeText={(text) => setName({ ...name, value: text })}
            activeOutlineColor="#20B2AA"
            mode="outlined"
            autoCapitalize="words"
            onBlur={() => isEmptyInput(name, setName)}
          />
          {name.error && <Text style={styles.errorText}>{name.error}</Text>}
        </View>

        <View style={styles.input}>
          <TextInput
            label="Email"
            value={email.value}
            onChangeText={(text) => setEmail({ ...email, value: text })}
            activeOutlineColor="#20B2AA"
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            onBlur={() => isEmptyInput(email, setEmail)}
          />

          {email.error && <Text style={styles.errorText}>{email.error}</Text>}
        </View>

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
          onPress={handleRegister}
          style={styles.button}
          activeOpacity={0.5}
        >
          <Text style={styles.buttonText}>Đăng ký</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.button}
          activeOpacity={0.5}
        >
          <Text style={styles.buttonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default Register;

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
