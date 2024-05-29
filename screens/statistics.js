import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions, Platform } from "react-native";
import { LineChart } from "react-native-chart-kit";
import NavBar from "../components/navbar";
import {
  firebaseAuth,
  firestoreDB,
  collection,
  getDocs,
  getDoc,
  doc,
} from "../database/firebaseconfig";
import Taskshistories from "../components/taskshistories";

const Statistics = () => {
  const [chartData, setChartData] = useState(null);
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const currentUser = firebaseAuth.currentUser;
        const userTasksRef = collection(firestoreDB, "users", currentUser.uid, "tasks");
        const [tasksSnapshot, docSnap] = await Promise.all([
          getDocs(userTasksRef),
          getDoc(doc(firestoreDB, "users", currentUser.uid))
        ]);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setTotalTasks(userData.totaltasks || 0);
          setCompletedTasks(userData.completedtasks || 0);
        }

        const monthlyData = tasksSnapshot.docs.reduce((acc, doc) => {
          const taskData = doc.data();
          if (taskData.completed && taskData.completedAt?.toDate) {
            const month = taskData.completedAt.toDate().toLocaleString("default", { month: "long" });
            acc[month] = (acc[month] || 0) + 1;
          }
          return acc;
        }, {});

        if (Object.keys(monthlyData).length === 0) {
          setChartData({
            labels: ["No tasks completed"],
            datasets: [{ data: [0], color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, strokeWidth: 8 }],
            legend: ["Tasks Completed"],
          });
        } else {
          const monthOrder = {
            January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
            July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
          };

          const sortedMonthlyData = Object.entries(monthlyData).sort((a, b) => monthOrder[a[0]] - monthOrder[b[0]]);

          setChartData({
            labels: sortedMonthlyData.map(([month]) => month),
            datasets: [{ data: sortedMonthlyData.map(([, count]) => count), color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, strokeWidth: 8 }],
            legend: ["Tasks Completed"],
          });
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching task data:", error);
        setLoading(false);
      }
    };

    fetchTaskData();
  }, []);

  const getFontSize = (fontSize) => Math.round(fontSize * (Dimensions.get("window").width / 375));

  return (
    <View style={styles.container}>
      <Text style={[styles.statisticsTitle, { fontSize: getFontSize(48) }]}>STATISTICS</Text>
      <View style={styles.statisticsBody}>
        <Text style={[styles.tasksOverview, { fontSize: getFontSize(20) }]}>Tasks Completed Over Time</Text>
        <View style={styles.chart}>
          {!loading && chartData && (
            <LineChart
              data={chartData}
              width={Dimensions.get("window").width - 30}
              height={Math.min(220, Dimensions.get("window").height / 4)}
              chartConfig={{
                backgroundGradientFrom: "#00AE8E",
                backgroundGradientTo: "#00AE8E",
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                strokeWidth: 2,
              }}
              bezier
            />
          )}
        </View>
        <View style={styles.tasksInfo}>
          <TaskInfo number={completedTasks} label="Completed tasks" getFontSize={getFontSize} />
          <TaskInfo number={totalTasks} label="Total tasks" getFontSize={getFontSize} />
        </View>
        <View style={styles.history}>
          <Taskshistories />
        </View>
      </View>
      <View style={styles.navbar}>
        <NavBar />
      </View>
    </View>
  );
};

const TaskInfo = ({ number, label, getFontSize }) => (
  <View style={styles.tasksRectangle}>
    <Text style={[styles.numbers, { fontSize: getFontSize(15) }]}>{number}</Text>
    <Text style={[styles.text, { fontSize: getFontSize(15) }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  navbar: {
    paddingBottom: Platform.OS === "ios" ? 20 : 0,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 50,
    paddingBottom: 5,
  },
  statisticsBody: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  numbers: {
    color: "#ffffff",
    fontWeight: "900",
    textAlign: "center",
    paddingTop: 10,
  },
  text: {
    color: "#ffffff",
    fontWeight: "900",
    textAlign: "center",
    paddingBottom: 10,
  },
  tasksInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tasksRectangle: {
    width: "42%",
    borderRadius: 21,
    backgroundColor: "#0D7EE6",
    flexDirection: "column",
    marginLeft: 5,
  },
  tasksOverview: {
    color: "#0D7EE6",
    fontWeight: "800",
    textAlign: "left",
    marginTop: 50,
  },
  statisticsTitle: {
    color: "#0D7EE6",
    fontWeight: "800",
    textAlign: "center",
    paddingBottom: 10,
  },
  chart: {
    marginVertical: 5,
    borderRadius: 10,
    elevation: 5,
  },
  history: {
    width: "100%",
    overflow: "hidden",
    height: 370,
  },
});

export default Statistics;
