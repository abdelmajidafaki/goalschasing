import React from "react";
import { StyleSheet, Image, View, Pressable } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const NavBar = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const isFocused = (routeName) => {
    return route.name === routeName;
  };

  const iconOpacity = (routeName) => {
    return isFocused(routeName) ? 1 : 0.5;
  };

  return (
    <View style={styles.navBar}>
      <Pressable onPress={() => navigation.navigate("Tasks")}>
        <Image
          style={[styles.icon, { opacity: iconOpacity("Tasks") }]}
          source={require("../assets/icons/navbarbutton/taskbutton.png")}
        />
      </Pressable>

      <Pressable onPress={() => navigation.navigate("Timer")}>
        <Image
          style={[styles.icon, { opacity: iconOpacity("Timer") }]}
          source={require("../assets/icons/navbarbutton/timerbutton.png")}
        />
      </Pressable>
      <Pressable onPress={() => navigation.navigate("Statistics")}>
        <Image
          style={[styles.icon, { opacity: iconOpacity("Statistics") }]}
          source={require("../assets/icons/navbarbutton/statistcsbutton.png")}
        />
      </Pressable>
      <Pressable onPress={() => navigation.navigate("Account")}>
        <Image
          style={[styles.icon, { opacity: iconOpacity("Account") }]}
          source={require("../assets/icons/navbarbutton/accountbutton.png")}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    bottom: 0,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
  },
  icon: {
    width: 36,
    height: 36,
  },
});

export default NavBar;
