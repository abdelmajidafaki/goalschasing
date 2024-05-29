import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Image,
  Text,
  Pressable,
  View,
  Modal,
  Platform,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import NavBar from "../components/navbar";
import SetTask from "../components/settask";
import MyTaskComponent from "../components/taskcomponent";
import {
  firebaseAuth,
  firestoreDB,
  collection,
  onSnapshot,
  query,
  where,
} from "../database/firebaseconfig";

const HomePage = () => {
  const currentUser = firebaseAuth.currentUser;
  const [windowtask, setwindowtask] = useState(false);
  const [tasksLength, setTasksLength] = useState(0);
  useEffect(() => {
    const tasksLengths = async () => {
      try {
        if (currentUser) {
          const tasksCollectionRef = collection(
            firestoreDB,
            "users",
            currentUser.uid,
            "tasks"
          );

          const q = query(tasksCollectionRef, where("completed", "==", false));
          const unsubscribe = onSnapshot(q, (snapshot) => {
            setTasksLength(snapshot.size);
          });
          console.log(tasksLength);

          return () => unsubscribe();
        } else {
          console.log("No user logged in");
          setTasksLength(0); // Reset tasks length if no user is logged in
        }
      } catch (error) {
        console.error("Error fetching tasks length:", error);
      }
    };

    tasksLengths();
  }, [currentUser]);

  const addbutton = () => {
    setwindowtask(true);
  };

  const outsidewindowpress = (event) => {
    if (event.target === event.currentTarget) {
      setwindowtask(false);
    }
  };

  const checkUserTasksLength = () => {
    return tasksLength === 0;
  };

  const getFontSize = (fontSize) => {
    const scaleFactor = Dimensions.get("window").width / 375;
    return Math.round(fontSize * scaleFactor);
  };

  return (
    <View style={styles.tasksscreen}>
      <Text style={[styles.titel, { fontSize: getFontSize(48) }]}>TASKS</Text>

      <View style={styles.maineframe}>
        <View style={styles.taskmainfarme}>
          <MyTaskComponent />
          {checkUserTasksLength() && (
            <View style={styles.homePageEmpty}>
              <Image
                style={styles.emptyimg}
                source={require("../assets/icons/tasksempty.png")}
              />
              <Text style={[styles.newtasktext, { fontSize: getFontSize(32) }]}>
                add new task
              </Text>
            </View>
          )}
        </View>
        <Pressable style={styles.addbutton} onPress={addbutton}>
          <Image
            style={styles.addTask}
            source={require("../assets/icons/buttonsicon/addtask.png")}
          />
        </Pressable>
        <Modal
          animationType="none"
          transparent={true}
          visible={windowtask}
          onRequestClose={() => setwindowtask(false)}
        >
          <TouchableWithoutFeedback onPress={outsidewindowpress}>
            <View style={styles.overlay}>
              <View style={styles.taskcontainer}>
                <SetTask closeModal={() => setwindowtask(false)} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>

      <View style={styles.navbar}>
        <NavBar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    paddingBottom: Platform.OS === "ios" ? 20 : 0,
    backgroundColor: "#ffffff",
  },
  taskmainfarme: {
    alignItems: "center",
    justifyContent: "center",
  },
  homePageEmpty: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    bottom: "70%",
  },
  emptyimg: {
    width: 151,
    height: 122,
  },
  newtasktext: {
    color: "rgba(0,0,0,1)",
    fontWeight: "400",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  taskcontainer: {
    justifyContent: "flex-end",
    width: "100%",
    backgroundColor: "transparent",
  },
  tasksscreen: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,1)",
    paddingTop: 50,
    paddingBottom: 5,
    width: "100%",
  },
  maineframe: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    height: "100%",
    paddingHorizontal: 10,
  },
  titel: {
    color: "#0D7EE6",
    fontFamily: "RubikBold",
    paddingVertical: 10,
    fontWeight: "800",
    textAlign: "center",
  },
  addbutton: {
    width: 86,
    height: 70,
    position: "absolute",
    bottom: 40,
  },
  addTask: {
    width: 86,
    height: 70,
    position: "absolute",
    bottom: 60,
  },
});

export default HomePage;
