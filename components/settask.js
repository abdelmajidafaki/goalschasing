import React, { useState } from "react";
import {
  StyleSheet,
  Image,
  Text,
  View,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { firebaseAuth, firestoreDB } from "../database/firebaseconfig";
import { doc, addDoc, updateDoc, collection, getDoc } from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function SetTask({ closeModal }) {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [taskName, setTaskName] = useState("");
  const [date, setDate] = useState(null);
  const [mode, setMode] = useState("date");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const currentUser = firebaseAuth.currentUser;

  const handleIconSelection = (iconName, iconurl) => {
    setSelectedIcon({ name: iconName, url: iconurl });
  };

  const addTask = async () => {
    if (!taskName || !selectedIcon) {
      return Alert.alert(
        "Error",
        "Please fill in all fields before adding the task."
      );
    }

    if (!currentUser) {
      return console.log("No user logged in");
    }

    try {
      const userDocRef = doc(firestoreDB, "users", currentUser.uid);
      const tasksCollectionRef = collection(userDocRef, "tasks");

      await addDoc(tasksCollectionRef, {
        taskName,
        icon: selectedIcon,
        completed: false,
        createdAt: new Date(),
        reminderDate: date,
      });
      const userDocSnapshot = await getDoc(userDocRef);
      const currentTotalTasks = userDocSnapshot.data()?.totaltasks + 1;
      await updateDoc(userDocRef, { totaltasks: currentTotalTasks });

      console.log("Task added successfully");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const showDatePickerModal = (currentMode) => {
    setShowDatePicker(true);
    setMode(currentMode);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);

    if (mode === "date" && Platform.OS === "android") {
      setShowDatePicker(false);
      setMode("time");
      setShowDatePicker(true);
    } else if (mode === "time") {
      setShowDatePicker(false);
    }

    // For iOS, change mode to "time" after selecting date
    if (Platform.OS === "ios" && mode === "date") {
      setMode("time");
    }
  };
  const addtaskAndClose = async () => {
    addTask();
    closeModal();
  };

  return (
    <View style={styles.SetTask}>
      <Text style={styles.TypeYourTaskName}>Type your task name</Text>
      <View style={styles.row}>
        <View style={styles.TaskNameInput}>
          <TextInput
            placeholder="Enter your task name"
            value={taskName}
            onChangeText={setTaskName}
            style={styles.EnterYouTaskName}
          />
        </View>
       
      </View>

      <Text style={styles.ChooseYourIcon}>Choose your icon</Text>

      <View style={styles.icons}>
        <Pressable
          onPress={() =>
            handleIconSelection(
              "reading",
              "https://firebasestorage.googleapis.com/v0/b/pfa-557ee.appspot.com/o/readingicon.png?alt=media&token=88e81109-1e05-475a-ba81-9a82078e1d37"
            )
          }
        >
          <Image
            style={[
              selectedIcon &&
                selectedIcon.name === "reading" &&
                styles.selectedIcon,
              styles.Icon,
            ]}
            source={require("../assets/icons/tasksicon/readingicon.png")}
          />
          <Text style={styles.text}> Study</Text>
        </Pressable>

        <Pressable
          onPress={() =>
            handleIconSelection(
              "Gym",
              "https://firebasestorage.googleapis.com/v0/b/pfa-557ee.appspot.com/o/gymicon.png?alt=media&token=192f65f5-c908-4c49-b70c-2d4272bfa0a6"
            )
          }
        >
          <Image
            style={[
              styles.Icon,
              selectedIcon && selectedIcon.name == "Gym" && styles.selectedIcon,
            ]}
            source={require("../assets/icons/tasksicon/gymicon.png")}
          />
          <Text style={styles.text}> Gym</Text>
        </Pressable>

        <Pressable
          onPress={() =>
            handleIconSelection(
              "Work",
              "https://firebasestorage.googleapis.com/v0/b/pfa-557ee.appspot.com/o/workicon.png?alt=media&token=49a814b0-7c45-4920-8dd4-1cbc4c08ec23"
            )
          }
        >
          <Image
            style={[
              styles.Icon,
              selectedIcon &&
                selectedIcon.name == "Work" &&
                styles.selectedIcon,
            ]}
            source={require("../assets/icons/tasksicon/workicon.png")}
          />
          <Text style={styles.text}> Work</Text>
        </Pressable>

        <Pressable
          onPress={() =>
            handleIconSelection(
              "Art",
              "https://firebasestorage.googleapis.com/v0/b/pfa-557ee.appspot.com/o/articon.png?alt=media&token=0989b79f-b2fc-4a9d-885d-a749eaa6ee6e"
            )
          }
        >
          <Image
            style={[
              styles.Icon,
              selectedIcon && selectedIcon.name == "Art" && styles.selectedIcon,
            ]}
            source={require("../assets/icons/tasksicon/articon.png")}
          />
          <Text style={styles.text}> Art</Text>
        </Pressable>
        <Pressable
          onPress={() =>
            handleIconSelection(
              "Health",
              "https://firebasestorage.googleapis.com/v0/b/pfa-557ee.appspot.com/o/healthicon.png?alt=media&token=d6789518-e956-44b9-8805-947ff8a83e76"
            )
          }
        >
          <Image
            style={[
              styles.Icon,
              selectedIcon &&
                selectedIcon.name == "Health" &&
                styles.selectedIcon,
            ]}
            source={require("../assets/icons/tasksicon/healthicon.png")}
          />
          <Text style={styles.text}> Health</Text>
        </Pressable>
        <Pressable
          onPress={() =>
            handleIconSelection(
              "Other",
              "https://firebasestorage.googleapis.com/v0/b/pfa-557ee.appspot.com/o/othericon.png?alt=media&token=b6ea0166-310b-4ed6-902e-ceb81b095241"
            )
          }
        >
          <Image
            style={[
              styles.Icon,
              selectedIcon &&
                selectedIcon.name == "Other" &&
                styles.selectedIcon,
            ]}
            source={require("../assets/icons/tasksicon/othericon.png")}
          />
          <Text style={styles.text}>others</Text>
        </Pressable>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={date || new Date()}
          mode={mode}
          display="default"
          onChange={onDateChange}
        />
      )}
      <View style={styles.rowB}>
       <Pressable style={styles.AddTaskButton} onPress={() => showDatePickerModal("date")}>
       <Image
            style={styles.img}
            source={require("../assets/icons/buttonsicon/timereminder.png")}
          />
          <Text style={styles.AddTask}>time reminder</Text>
        </Pressable>
        
        <Pressable style={styles.AddTaskButton} onPress={addtaskAndClose}>
        <Image
            style={styles.img}
            source={require("../assets/icons/buttonsicon/addcircle.png")}
          />
          <Text style={styles.AddTask}>Add task</Text>
          
        </Pressable>
        
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  Icon: {
    width: "100%",
    height: 53,
    aspectRatio: 1.03,
    alignSelf: "center",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
  },
  rowB: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 30,
    paddingVertical:20
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  datePickerButton: {
    paddingVertical: 10,
    marginLeft: 0,
  },
  img: {
    height: 36,
    width: 36,
  },
  datePickertext: {
    fontSize: 16,
    fontFamily: "Roboto",
    color: "rgba(0, 0, 0, 1)",
    fontWeight: "700",
  },
  SetTask: {
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 29,
    backgroundColor: "rgba(255, 255, 255, 1)",
    width: "100%",
    alignSelf: "center",
  },
  TypeYourTaskName: {
    marginTop: 10,
    marginBottom: 10,
    color: "rgba(0, 0, 0, 1)",
    fontSize: 27,
    fontFamily: "Roboto",
    fontWeight: "700",
    textAlign: "center",
  },
  TaskNameInput: {
    marginBottom: 10,
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    height: 49,
    borderRadius: 21,
    backgroundColor: "rgba(217, 217, 217, 1)",
    width: "100%",
    paddingHorizontal: 15,
  },
  EnterYouTaskName: {
    flex: 1,
    color: "rgba(0, 0, 0, 0.61)",
    fontSize: 16,
    fontFamily: "Roboto",
    fontWeight: "400",
    textAlign: "center",
  },
  ChooseYourIcon: {
    marginBottom: 10,
    color: "rgba(0, 0, 0, 1)",
    fontSize: 27,
    fontFamily: "Roboto",
    fontWeight: "700",
    textAlign: "center",
    paddingBottom: 10,
    marginTop: 10,
  },
  icons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 0,
  },
  AddTaskButton: {
    width: "46%",
    flexDirection: "row",
    borderRadius: 21,
    backgroundColor: "rgba(0, 131, 253, 0.76)",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal:20,
    paddingVertical: 10,
  },
  AddTask: {
    color: "rgba(255, 255, 255, 1)",
    fontSize: 20,
    fontFamily: "RubikRegular",
    fontWeight: "900",
    textAlign: "center",
    paddingRight: 30
  },
  selectedIcon: {
    borderWidth: 4,
    borderColor: "rgba(54, 62, 255, 0.93)",
    borderRadius: 55.5,
  },
  iconstext: {
    flexDirection: "row",
    justifyContent: "space-around",

    alignItems: "center",
    width: "100%",
  },
});
