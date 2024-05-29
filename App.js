import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useFonts, Rubik_400Regular, Rubik_700Bold } from "@expo-google-fonts/rubik";
import Register from "./screens/Register";
import Login from "./screens/login";
import Tasks from "./screens/tasks";
import Timer from "./screens/timer";
import Statistics from "./screens/statistics";
import Account from "./screens/account";
import { registerForPushNotificationsAsync, setupTaskNotifications } from "./components/notification";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Stack = createStackNavigator();

const App = () => {
  const [fontsLoaded] = useFonts({
    RubikRegular: Rubik_400Regular,
    RubikBold: Rubik_700Bold,
  });

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    (async () => {
      await registerForPushNotificationsAsync();
    })();
  }, []);

  useEffect(() => {
    if (currentUser) {
      const unsubscribe = setupTaskNotifications(currentUser);
      return () => unsubscribe && unsubscribe();
    }
  }, [currentUser]);

  

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {currentUser ? (
          <>
            <Stack.Screen
              name="Tasks"
              component={Tasks}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Timer"
              component={Timer}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Statistics"
              component={Statistics}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Account"
              component={Account}
              options={{ headerShown: false }}
               
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
