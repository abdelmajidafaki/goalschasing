import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Modal,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import {
  firebaseAuth,
  firestoreDB,
  doc,
  updateDoc,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
} from "../database/firebaseconfig";
const Security = () => {
  const [isemailwindow, setemailwindow] = useState(false);
  const [ispasswordwindow, setpasswordwindow] = useState(false);
  const [newemail, setnewemail] = useState("");
  const [oldpassword, setoldpassword] = useState("");
  const [newpassword, setnewpassword] = useState("");
  const [confirmpassword, setconfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const currentUser = firebaseAuth.currentUser;
  const changepassf = async () => {
    try {
      if (newpassword !== confirmpassword) {
        throw new Error("New password and confirmation do not match.");
      }
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        oldpassword
      );
      await reauthenticateWithCredential(currentUser, credential);
      console.log("User reauthenticated successfully.");
      await updatePassword(currentUser, newpassword);
      console.log("Password updated successfully");

      setoldpassword("");
      setnewpassword("");
      setconfirmPassword("");
      setpasswordwindow(false);
      Alert.alert("Password changed Successfully");
    } catch (error) {
      console.error("Error updating password:", error.message);
    }
  };
  const changeemailf = async () => {
    try {
      if (!currentUser) {
        throw new Error("User is not authenticated.");
      }

      if (!password) {
        throw new Error("Password is required.");
      }

      const credential = EmailAuthProvider.credential(
        currentUser.email,
        password
      );
      await reauthenticateWithCredential(currentUser, credential);

      await updateEmail(currentUser, newemail);

      console.log("Email updated successfully");

      const userDocRef = doc(firestoreDB, "users", currentUser.uid);
      await updateDoc(userDocRef, { email: newemail });
      console.log("Email updated in Firestore");

      setnewemail("");
      setPassword("");
      setemailwindow(false);
      Alert.alert("Email changed Successfully");
    } catch (error) {
      console.error("Error updating email:", error.message);
      if (error.code === "auth/wrong-password") {
        console.error("Incorrect password. Please try again.");
      } else {
        console.error("An error occurred. Please try again later.");
      }
    }
  };

  const emailwindow = () => {
    setemailwindow(!isemailwindow);
  };

  const passwordwindow = () => {
    setpasswordwindow(!ispasswordwindow);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Security</Text>
      <View style={styles.Button}>
        <Pressable style={styles.button} onPress={emailwindow}>
          <Image
            style={styles.icon}
            source={require("../assets/icons/buttonsicon/emailbutton.png")}
          />
          <Text style={styles.ChangeEmail}>Change email</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={passwordwindow}>
          <Image
            style={styles.icon}
            source={require("../assets/icons/buttonsicon/passwordbutton.png")}
          />
          <Text style={styles.changepassfword}>Change password</Text>
        </Pressable>
      </View>
      <Modal
        animationType="none"
        transparent={true}
        visible={isemailwindow}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={emailwindow}
        >
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.container}>
                <Text style={styles.heading}>Edit your account</Text>
                <Text style={styles.subHeading}>Change your email</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Enter your new email"
                    style={styles.input}
                    value={newemail}
                    onChangeText={setnewemail}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Enter password"
                    style={styles.input}
                    value={password}
                    secureTextEntry={true}
                    onChangeText={setPassword}
                  />
                </View>
                <Pressable
                  style={styles.donebutton}
                  onPress={() => {
                    emailwindow();
                    changeemailf();
                  }}
                >
                  <Text style={styles.buttonText}>DONE</Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
      <Modal
        animationType="none"
        transparent={true}
        visible={ispasswordwindow}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={passwordwindow}
        >
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.container}>
                <Text style={styles.heading}>Change your password</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Enter your old password"
                    style={styles.input}
                    value={oldpassword}
                    secureTextEntry={true}
                    onChangeText={setoldpassword}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Enter your new password"
                    style={styles.input}
                    secureTextEntry={true}
                    value={newpassword}
                    onChangeText={setnewpassword}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Confirm new password"
                    style={styles.input}
                    value={confirmpassword}
                    secureTextEntry={true}
                    onChangeText={setconfirmPassword}
                  />
                </View>
                <Pressable
                  style={styles.donebutton}
                  onPress={() => {
                    passwordwindow();
                    changepassf();
                  }}
                >
                  <Text style={styles.buttonText}>DONE</Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    width: "100%",
  },
  heading: {
    marginTop: 10,
    marginBottom: 10,
    color: "#000",
    fontSize: 27,
    fontWeight: "700",
    textAlign: "center",
  },
  subHeading: {
    marginBottom: 10,
    color: "#000",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    paddingBottom: 10,
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 10,
    marginTop: 10,
    width: "80%",
    height: 49,
    borderRadius: 21,
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    color: "#333",
    fontSize: 16,
    textAlign: "center",
  },
  donebutton: {
    width: "50%",
    borderRadius: 21,
    backgroundColor: "#0D7EE6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 20,
    paddingVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
  },
  Button: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "60%",
    height: 55,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    backgroundColor: "#0D7EE6",
  },
  changepassfword: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    color: "rgba(255,255,255,1)",
    fontSize: 14,
    fontFamily: "Roboto",
    fontWeight: "400",
    textAlign: "center",
  },
  icon: {
    width: 33,
    height: "100%",
    marginRight: 10,
  },
  ChangeEmail: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    color: "rgba(255,255,255,1)",
    fontSize: 14,
    fontFamily: "Roboto",
    fontWeight: "400",
    textAlign: "center",
  },
  modalContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: "100%",
  },
});

export default Security;
