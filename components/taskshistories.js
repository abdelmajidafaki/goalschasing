import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { firestoreDB, firebaseAuth } from "../database/firebaseconfig";

const History = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const currentUser = firebaseAuth.currentUser;
        if (!currentUser) {
          console.error("Current user not found.");
          return;
        }

        const tasksCollectionRef = collection(
          firestoreDB,
          "users",
          currentUser.uid,
          "tasks"
        );
        const q = query(
          tasksCollectionRef,
          orderBy("createdAt", "desc"),
          where("completed", "==", true)
        );
        const querySnapshot = await getDocs(q);

        const taskData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          taskName: doc.data().taskName,
          createdAt: doc.data().createdAt.toDate(),
          completedAt: doc.data().completedAt.toDate(),
        }));

        setTasks(taskData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  

  const renderTaskItems = () => {
    return tasks.map((item) => (
      <View key={item.id} style={styles.taskContainer}>
        <Text style={styles.taskTitle}>{item.taskName}</Text>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>Created: {item.createdAt.toDateString()}</Text>
          <Text style={styles.dateText}>Completed: {item.completedAt.toDateString()}</Text>
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
        <Text style={styles.historyTitle}>History</Text>
     
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {renderTaskItems()}
        </ScrollView>

     
    </View>
  );
};

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    paddingVertical:20,
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  historyTitle: {
    fontSize: windowWidth * 0.05, 
    fontWeight: "bold",
    alignItems: "center",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  taskContainer: {
    marginBottom: 20,
    backgroundColor: "#0D7EE6",
    padding: 15,
    borderRadius: windowWidth * 0.04, 
  },
  taskTitle: {
    fontSize: windowWidth * 0.04,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#ffffff",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateText: {
    fontSize: windowWidth * 0.03, 
    color: "#ffffff",
  },
  spacer: {
    height: 20, 
  },
});

export default History;
