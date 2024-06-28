import React, { useState, useEffect } from "react";
import { StyleSheet, Image, Text, View, TouchableOpacity, Platform, Dimensions } from "react-native";
import NavBar from "../components/navbar";
import WheelPickerExpo from 'react-native-wheel-picker-expo';

const Timer = () => {
  const [isRunning, setisrunning] = useState(false);
  const [hours, sethours] = useState(0);
  const [minutes, setminutes] = useState(0);
  const [seconds, setseconds] = useState(0);
  const [pausedTime, setPausedTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [paused, setPaused] = useState(false);

  const pausetimer = () => {
    setisrunning(false);
    setPaused(true);
    setPausedTime({ hours, minutes, seconds });
  };

  const starttimer = () => {
    setisrunning(true);
    setPaused(false);
  };

  const stoptimer = () => {
    setisrunning(false);
    setPaused(false);
    setPausedTime({ hours: 0, minutes: 0, seconds: 0 });
    sethours(0);
    setminutes(0);
    setseconds(0);
  };

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        if (seconds > 0) {
          setseconds(prevSeconds => prevSeconds - 1);
        } else if (minutes > 0) {
          setminutes(prevMinutes => prevMinutes - 1);
          setseconds(59);
        } else if (hours > 0) {
          sethours(prevHours => prevHours - 1);
          setminutes(59);
          setseconds(59);
        } else {
          clearInterval(intervalId);
          setisrunning(false);
          setPaused(false);
          sethours(0);
          setminutes(0);
          setseconds(0);
          setPausedTime({ hours: 0, minutes: 0, seconds: 0 });

        }
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, seconds, minutes, hours]);

  const getFontSize = (fontSize) => {
    const scaleFactor = Dimensions.get("window").width / 375;
    return Math.round(fontSize * scaleFactor);
  };

  const numbers = (max) => {
    return Array.from({ length: max + 1 }, (_, i) => ({ label: String(i).padStart(2, "0"), value: i }));
  };

  return (
    <View style={styles.timerScreen}>
      <Text style={[styles.timerTitle, { fontSize: getFontSize(48) }]}>TIMER</Text>
      <View style={styles.container}>
        <View style={styles.timerContainer}>
          {isRunning ? (
            <View style={styles.countdownContainer}>
              <Text style={[styles.countdown, { fontSize: getFontSize(60) }]}>
                {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </Text>
            </View>
          ) : (
            <View style={styles.pickersContainer}>
              <WheelPickerExpo
                height={500}
                width={100}
                initialSelectedIndex={pausedTime.hours}
                items={numbers(23)}
                onChange={({ item }) => sethours(item.value)}
                itemStyle={styles.pickerItem}
              />
              <Text style={[styles.separator, { fontSize: getFontSize(60) }]}>:</Text>
              <WheelPickerExpo
                height={500}
                width={100}
                initialSelectedIndex={pausedTime.minutes}
                items={numbers(59)}
                onChange={({ item }) => setminutes(item.value)}
                itemStyle={styles.pickerItem}
              />
              <Text style={[styles.separator, { fontSize: getFontSize(60) }]}>:</Text>
              <WheelPickerExpo
                height={500}
                width={100}
                initialSelectedIndex={pausedTime.seconds}
                items={numbers(59)}
                onChange={({ item }) => setseconds(item.value)}
                itemStyle={styles.pickerItem}
              />
            </View>
          )}
        </View>
        <View style={styles.buttonsRow}>
          <TouchableOpacity onPress={stoptimer}>
            <Image style={styles.button} source={require("../assets/icons/buttonsicon/stopbutton.png")} />
          </TouchableOpacity>
          <TouchableOpacity onPress={starttimer}>
            <Image style={styles.button} source={require("../assets/icons/buttonsicon/playbutton.png")} />
          </TouchableOpacity>
          <TouchableOpacity onPress={pausetimer}>
            <Image style={styles.button} source={require("../assets/icons/buttonsicon/pausebutton.png")} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.navbar}>
        <NavBar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerItem: {
    fontSize: 50,
  },
  navbar: {
    paddingBottom: Platform.OS === "ios" ? 20 : 0,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
  timerScreen: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingTop: 50,
    paddingBottom: 5,
  },
  timerTitle: {
    color: "#0D7EE6",
    fontFamily: "RubikBold",
    paddingVertical: 10,
    textAlign: "center",
    fontWeight: "800",
  },
  button: {
    width: 54,
    height: 54,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    justifyContent: "center",
  },
  countdownContainer: {
    alignItems: "center",
  },
  pickersContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  separator: {
    marginHorizontal: 5,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 90,
  },
  countdown: {
    fontSize: 60,
  },
});

export default Timer;
