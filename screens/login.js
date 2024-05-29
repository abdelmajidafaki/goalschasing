import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  Pressable,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../database/firebaseconfig";

const LogIn = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    signInWithEmailAndPassword(firebaseAuth, email, password)
      .then(() => {
        navigation.navigate("Tasks");
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  return (
    <View style={styles.logInscreen}>
      <Text style={styles.titel}>GOALS CHASING</Text>
      <Text style={styles.subtitel}>Log in to your account</Text>
      <View style={styles.inputscontainer}>
        <View style={styles.inputframe}>
          <Image
            style={styles.icon}
            source={require("../assets/icons/inputsicon/mailinput.png")}
          />
          <TextInput
            style={styles.inputstyle}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputframe}>
          <Image
            style={styles.icon}
            source={require("../assets/icons/inputsicon/passwordinput.png")}
          />
          <TextInput
            style={styles.inputstyle}
            placeholder="Enter your password"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <Pressable style={styles.button} onPress={() => handleLogin()}>
          <Text style={styles.Register}>Login</Text>
        </Pressable>
      </View>
      <Pressable
        style={styles.dontHaveAccountContainer}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.dontHaveAccountSignUp}>
          I Don’t have account? sign up
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
    marginRight: 14,
  },
  inputframe: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: 53,
    paddingLeft: 19,
    paddingRight: 19,
    borderRadius: 21,
    boxSizing: "border-box",
    backgroundColor: "rgba(217,217,217,1)",
    marginBottom: 12,
  },
  inputstyle: {
    height: 53,
    width: "95%",
    color: "rgba(0, 0, 0, 0.61)",
    fontSize: 12,
    lineHeight: 12,
    fontFamily: "Roboto",
    fontWeight: "400",
  },
  inputscontainer: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 50,
  },
  titel: {
    fontFamily: "RubikBold",
    fontSize: 40,
    color: "#0D7EE6",
    textAlign: "center",
  },
  subtitel: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginRight: 15,
    color: "rgba(0,0,0,1)",
    fontSize: 16,
    lineHeight: 10,
    fontFamily: "RubikRegular",
    fontWeight: "400",
    textAlign: "center",
    paddingVertical: 10,
  },
  dontHaveAccountSignUp: {
    fontSize: 15,
    color: "#7d7d7d",
    width: 276,
    height: 19,
    textAlign: "center",
  },
  dontHaveAccountContainer: {
    marginTop: 23,
  },
  logInscreen: {
    backgroundColor: "white",
    flex: 1,
    width: "100%",
    height: 844,
    paddingHorizontal: 20,
    paddingVertical: 150,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 38,
    borderRadius: 21,
    boxSizing: "border-box",
    backgroundColor: "#0D7EE6",
  },
  Register: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    color: "rgba(255,255,255,1)",
    fontSize: 16,
    lineHeight: 16,
    fontFamily: "RubikRegular",
    fontWeight: "700",
    textAlign: "center",
  },
});

export default LogIn;
