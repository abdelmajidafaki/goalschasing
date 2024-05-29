import React from "react";
import { useState } from "react";
import { Alert } from "react-native";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  firebaseAuth,
  signOut,
  doc,
  setDoc,
  firestoreDB,
} from "../database/firebaseconfig";

const Register = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      await signOut(firebaseAuth);
      const user = userCredential.user;
      await setDoc(doc(firestoreDB, "users", user.uid), {
        username: username,
        email: email,
        totaltasks: 0,
        completedtasks: 0,
      });
      Alert.alert("Success", "Account created successfully!");
      console.log("User information saved to Firestore");
    } catch (error) {
      console.error("Error saving user information to Firestore: ", error);
      Alert.alert("Error", "Failed to create account. Please try again later.");
    }
  };

  return (
    <View style={styles.registerscreen}>
      <Text style={styles.titel}>GOALS CHASING</Text>
      <Text style={styles.subtitel}>Create your account</Text>
      <View style={styles.inputscontainer}>
        <View style={styles.inputframe}>
          <Image
            style={styles.icon}
            source={require("../assets/icons/inputsicon/usernameinput.png")}
          />
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={styles.inputstyle}
            placeholder="Enter your username"
          ></TextInput>
        </View>
        <View style={styles.inputframe}>
          <Image
            style={styles.icon}
            source={require("../assets/icons/inputsicon/mailinput.png")}
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.inputstyle}
            placeholder="Enter your email"
          ></TextInput>
        </View>
        <View style={styles.inputframe}>
          <Image
            style={styles.icon}
            source={require("../assets/icons/inputsicon/passwordinput.png")}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            style={styles.inputstyle}
            placeholder="Enter your password"
            secureTextEntry={true}
          ></TextInput>
        </View>
        <View style={styles.inputframe}>
          <Image
            style={styles.icon}
            source={require("../assets/icons/inputsicon/confirminput.png")}
          />
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.inputstyle}
            placeholder="Confirm password"
            secureTextEntry={true}
          ></TextInput>
        </View>

        <Pressable
          onPress={() => handleRegister()}
          style={styles.Registerbutton}
        >
          <Text style={styles.Registertext}>Register</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.ihaveaccounttframe}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.ihaveaccounttext}>I have account</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  inputscontainer: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 50,
  },
  registerscreen: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    paddingVertical: 10,
    paddingBottom: 169,
    boxSizing: "border-box",
    backgroundColor: "rgba(255,255,255,1)",
  },
  titel: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginRight: 15,
    color: "#0D7EE6",
    fontSize: 40,
    lineHeight: 40,
    fontFamily: "RubikBold",
    fontWeight: "700",
    textAlign: "center",
    paddingVertical: 10,
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
  icon: {
    width: 24,
    height: 24,
    marginRight: 14,
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
  ihaveaccounttframe: {
    marginTop: 23,
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
  Registerbutton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 170,
    height: 38,
    marginRight: 15,
    paddingLeft: 37,
    paddingRight: 37,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 21,
    boxSizing: "border-box",
    backgroundColor: "#0D7EE6",
  },
  Registertext: {
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
  ihaveaccounttext: {
    fontSize: 15,
    color: "#7d7d7d",
    width: 276,
    height: 17,
    textAlign: "center",
  },
});
export default Register;
