import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import {
  firebaseAuth,
  firestoreDB,
  doc,
  updateDoc,
} from "../database/firebaseconfig";

const EditsInfo = () => {
  const [newName, setNewName] = useState("");

  const changeusername = async () => {
    try {
      const currentUser = firebaseAuth.currentUser;
      const userDocRef = doc(firestoreDB, "users", currentUser.uid);
      await updateDoc(userDocRef, { username: newName });
      console.log("Username updated successfully");
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edit your account</Text>
      <Text style={styles.subHeading}>Change your name</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter your new name"
          value={newName}
          onChangeText={setNewName}
          style={styles.input}
        />
      </View>
      <Pressable style={styles.button} onPress={changeusername}>
        <Text style={styles.buttonText}>DONE</Text>
      </Pressable>
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
  button: {
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
});

export default EditsInfo;
