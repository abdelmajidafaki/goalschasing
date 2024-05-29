import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Pressable,
  Modal,
  Platform,
  Alert,
} from "react-native";
import NavBar from "../components/navbar";
import {
  firebaseAuth,
  firestoreDB,
  doc,
  firebase,
  onSnapshot,
  setDoc,
  signOut,
} from "../database/firebaseconfig";
import EditsInfo from "../components/editsinfo";
import Security from "../components/security";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

const Account = () => {
  const [userData, setUserData] = useState(null);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [showEditsInfoModal, setShowEditsInfoModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const logout = async () => {
    try {
      await signOut(firebaseAuth);
      Alert.alert("Logged out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert("Error signing out. Please try again.");
    }
  };

  const selectimage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setSelectedImageUri(imageUri);
      }
    } catch (error) {
      console.error("Error selecting image:", error);
    }
  };

  useEffect(() => {
    if (selectedImageUri) {
      uploadImage(selectedImageUri);
    }
  }, [selectedImageUri]);

  const uploadImage = async (imageUri) => {
    setUploading(true);
    const currentUser = firebaseAuth.currentUser;

    try {
      const { uri } = await FileSystem.getInfoAsync(imageUri);
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => resolve(xhr.response);
        xhr.onerror = () => reject(new TypeError("Network request failed"));
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });

      const filename = `${currentUser.uid}_${imageUri.split("/").pop()}`;
      const ref = firebase.storage().ref().child(`profile_images/${filename}`);
      await ref.put(blob);
      const downloadUrl = await ref.getDownloadURL();
      await setDoc(doc(firestoreDB, "users", currentUser.uid), { profilePicture: downloadUrl }, { merge: true });

      setProfilePictureUrl(downloadUrl);
      Alert.alert("Photo Uploaded Successfully");
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const currentUser = firebaseAuth.currentUser;
    const userDocRef = doc(firestoreDB, "users", currentUser.uid);

    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const userDataFromDB = doc.data();
        setUserData(userDataFromDB);
        setProfilePictureUrl(userDataFromDB.profilePicture);
      } else {
        console.log("User document does not exist");
      }
    }, (error) => {
      console.error("Firestore onSnapshot error:", error);
    });

    return () => unsubscribe();
  }, []);

  const getFontSize = (fontSize) => Math.round(fontSize * (Dimensions.get("window").width / 375));
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={[styles.accountTitle, { fontSize: getFontSize(48) }]}>ACCOUNT</Text>
      </View>
      <View style={styles.accountBody}>
        <View style={styles.center}>
          <View style={styles.contentContainer}>
            <Text style={[styles.myInfo, { fontSize: getFontSize(25) }]}>My info</Text>
            <View style={styles.rectangle}>
              <TouchableOpacity onPress={logout} style={styles.logoutContainer}>
                <Text style={styles.logoutText}>Logout</Text>
                <Image style={styles.logout} source={require("../assets/icons/buttonsicon/logoutbutton.png")} />
              </TouchableOpacity>
              <View style={styles.rowContainer}>
                <TouchableOpacity onPress={selectimage}>
                  <Image source={profilePictureUrl ? { uri: profilePictureUrl } : require("../assets/icons/userprofil.png")} style={[styles.profileImage, styles.defaultProfileImage]} />
                </TouchableOpacity>
                {userData ? (
                  <View style={styles.userDataContainer}>
                    <UserInfo label="Username:" value={userData.username} />
                    <UserInfo label="Email:" value={userData.email} />
                  </View>
                ) : (
                  <Text>Loading...</Text>
                )}
              </View>
            </View>
            <View style={styles.buttons}>
              <ButtonWithIcon onPress={() => setShowEditsInfoModal(true)} icon={require("../assets/icons/buttonsicon/editnamebutton.png")} text="Edits info" />
              <ButtonWithIcon onPress={() => setShowSecurityModal(true)} icon={require("../assets/icons/buttonsicon/securitybutton.png")} text="Security" />
            </View>
          </View>
        </View>
      </View>
      <Modal animationType="none" transparent={true} visible={showEditsInfoModal}>
        <ModalContent onClose={() => setShowEditsInfoModal(false)}>
          <EditsInfo />
        </ModalContent>
      </Modal>
      <Modal animationType="none" transparent={true} visible={showSecurityModal}>
        <ModalContent onClose={() => setShowSecurityModal(false)}>
          <Security />
        </ModalContent>
      </Modal>
      <View style={styles.navbar}>
        <NavBar />
      </View>
    </View>
  );
};

const ButtonWithIcon = ({ onPress, icon, text }) => (
  <Pressable style={styles.button} onPress={onPress}>
    <Image style={styles.icon} source={icon} />
    <Text style={styles.buttonText}>{text}</Text>
  </Pressable>
);

const UserInfo = ({ label, value }) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.userData}>{value}</Text>
  </>
);

const ModalContent = ({ children, onClose }) => (
  <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={onClose}>
    <TouchableWithoutFeedback>
      <View style={styles.modalContent}>
        {children}
      </View>
    </TouchableWithoutFeedback>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 50,
    paddingBottom: 5,
  },
  row: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  accountTitle: {
    color: "#0D7EE6",
    fontWeight: "800",
    textAlign: "center",
    paddingBottom: 10,
  },
  accountBody: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
  },
  contentContainer: {
    width: "100%",
    maxWidth: 400,
  },
  myInfo: {
    color: "#0D7EE6",
    fontWeight: "800",
    textAlign: "left",
    paddingBottom: 10,
  },
  rectangle: {
    width: "100%",
    borderRadius: 28,
    backgroundColor: "#ececec",
    justifyContent: "center",
    shadowRadius: 8.84,
    elevation: 10,
    paddingHorizontal: 10,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: "40%",
  },
  profileImage: {
    borderRadius: 50,
  },
  defaultProfileImage: {
    height: 100,
    width: 100,
    backgroundColor: "#909090",
  },
  userDataContainer: {
    marginLeft: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "left",
  },
  userData: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "left",
  },
  logoutContainer: {
    position: "absolute",
    right: 0,
    paddingRight: 15,
    top: 8,
    flexDirection: "row",
  },
  logoutText: {
    fontSize: 18,
    fontWeight: "bold",
    top: 4,
  },
  logout: {
    width: 33,
    height: 33,
  },
  buttons: {
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 5,
  },
  button: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: 137,
    height: 44,
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 15,
    backgroundColor: "#0D7EE6",
  },
  icon: {
    width: 24,
    height: "100%",
    marginRight: 23,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Roboto",
    fontWeight: "400",
    textAlign: "center",
  },modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalContainerBottom: {
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContentBottom: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: "100%",
  },
  navbar: {
    paddingBottom: Platform.OS === "ios" ? 20 : 0,
    backgroundColor: "#ffffff",
  },
});

export default Account;
