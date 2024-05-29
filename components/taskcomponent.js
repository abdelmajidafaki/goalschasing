import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Image,
  Animated,
  PanResponder,
  Pressable,
  View,
  Text,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { doc, updateDoc, collection, getDoc, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { firestoreDB, firebaseAuth } from "../database/firebaseconfig";
import Edittask from "./edittask";

const TaskItem = ({ task, handleEditTask }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const timestamp = new Date(); 
  const draging = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        pan.x.setValue(Math.min(Math.max(pan.x._value + gestureState.dx, -75), 75));
        if (Math.abs(gestureState.dy) > 3) pan.y.setValue(0);
      },
      onPanResponderRelease: () => {
        setTimeout(() => Animated.spring(pan.x, { toValue: 0, useNativeDriver: false }).start(), 6000);
      },
    })
  ).current;

  const handleComplete = async () => {
    const currentUser = firebaseAuth.currentUser;
    if (!currentUser) return console.error("Current user not found.");

    try {
      const userDocRef = doc(firestoreDB, "users", currentUser.uid);
      const taskDocRef = doc(userDocRef, "tasks", task.id);
      const userDocSnapshot = await getDoc(userDocRef);
      const newCompletedTasks = (userDocSnapshot.data()?.completedtasks || 0) + 1;

      await updateDoc(userDocRef, { completedtasks: newCompletedTasks });
      await updateDoc(taskDocRef, { completed: true, completedAt: new Date() });

      console.log("Task marked as completed in Firestore");
    } catch (error) {
      console.error("Error marking task as completed:", error);
    }
  };

  const formatReminder = (reminderDate) => {
    if (!reminderDate) return "";
    const date = new Date(reminderDate.seconds * 1000);
    return new Intl.DateTimeFormat("en-US", { weekday: "short", hour: "numeric", minute: "numeric", hour12: true }).format(date);
  };

  return (
    <View style={styles.taskContainer}>
      <Pressable style={styles.editButton} onPress={() => handleEditTask(task)}>
        <Image style={styles.done} source={require("../assets/icons/edit.png")} />
      </Pressable>
      <Pressable style={styles.doneButton} onPress={handleComplete}>
        <Image style={styles.done} source={require("../assets/icons/done.png")} />
      </Pressable>
      <Animated.View style={[styles.taskFrame, { transform: [{ translateX: pan.x }] }]} {...draging.panHandlers}>
        <Image style={styles.tasksIcon} source={{ uri: task.icon.url }} />
        <View style={styles.textContainer}>
          <Text style={styles.taskTitle}>{task.taskName}</Text>
          <Text style={styles.reminderText}>{formatReminder(task.reminderDate)}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const MyTaskComponent = () => {
  const [editWindow, setEditWindow] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const currentUser = firebaseAuth.currentUser;
      if (!currentUser) return console.error("Current user not found.");

      const tasksCollectionRef = collection(firestoreDB, "users", currentUser.uid, "tasks");
      const q = query(tasksCollectionRef, where("completed", "==", false), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      });

      return unsubscribe;
    };

    fetchTasks();
  }, []);

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setEditWindow(true);
  };

  const handleOverlayPress = (event) => {
    if (event.target === event.currentTarget) setEditWindow(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.scrollView}>
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} handleEditTask={handleEditTask} />
        ))}
      </ScrollView>
      <Modal animationType="none" transparent={true} visible={editWindow} onRequestClose={() => setEditWindow(false)}>
        <TouchableWithoutFeedback onPress={handleOverlayPress}>
          <View style={styles.overlay}>
            <Edittask task={selectedTask} closeModal={() => setEditWindow(false)} />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  taskFrame: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 23,
    backgroundColor: "#0D7EE6",
    paddingVertical: 10,
    paddingRight: 70,
    width: "100%",
  },
  textContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    width: "100%",
    justifyContent: "space-between",
  },
  taskTitle: {
    color: "#ffffff",
    fontSize: 20,
    textAlign: "left",
  },
  reminderText: {
    color: "#ffffff",
    fontSize: 20,
    textAlign: "right",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  taskContainer: {
    flexDirection: "row",
    marginBottom: 35,
    position: "relative",
  },
  doneButton: {
    width: 75,
    borderRadius: 23,
    backgroundColor: "#65FF3E",
    position: "absolute",
    right: 0,
  },
  editButton: {
    width: 75,
    borderRadius: 25,
    backgroundColor: "#FF783E",
    position: "absolute",
    left: 0,
  },
  tasksIcon: {
    marginLeft: 10,
    width: 50.8,
    height: 50,
  },
  done: {
    width: 35,
    height: 28,
    margin: 19,
  },
});

export default MyTaskComponent;
