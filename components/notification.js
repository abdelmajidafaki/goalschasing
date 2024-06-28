import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';
import { firestoreDB, query, where, onSnapshot, collection } from "../database/firebaseconfig";

// Request permission to send notifications
export async function registerForPushNotificationsAsync() {
    try {
        const projectId = '4967e793-af19-411b-ba76-87c27862aa18'; 
        if (!projectId) {
            console.error('Project ID not found in Expo config.');
            return null;
        }

        let { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') {
            const { status: newStatus } = await Notifications.requestPermissionsAsync();
            status = newStatus;
            if (status !== 'granted') {
                Alert.alert('Failed to get push token for push notification!');
                return null;
            }
            console.log(status);

        }

        const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        console.log('Expo Push Token:', token); // Log the token
        return token;
    } catch (error) {
        console.error('Failed to get push token:', error);
        return null;
    }
}
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Notification scheduling function
async function scheduleNotification(task) {
    const trigger = new Date(task.reminderDate.seconds * 1000); // Convert seconds to milliseconds
    console.log(trigger);
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Task Reminder",
            body: `Don't forget to ${task.taskName}`,
            data: { task },
        },
        trigger,
    });
}

// Debounced version of the notification scheduling function
const debouncedScheduleNotification = debounce(scheduleNotification, 3000);

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

// Check tasks and schedule notifications
export function setupTaskNotifications(currentUser) {
    console.log(currentUser.uid); 
    if (currentUser) {
        const tasksCollectionRef = collection(firestoreDB, "users", currentUser.uid, "tasks");
        const q = query(tasksCollectionRef, where("reminderDate", ">=", new Date()));
        console.log(q);

        return onSnapshot(q, (querySnapshot) => {
            console.log('Checking tasks for notifications'); // Log that tasks are being checked
            querySnapshot.forEach((doc) => {
                const task = doc.data();
                console.log(task); 
                const reminderTime = new Date(task.reminderDate.seconds * 1000);
                console.log(reminderTime);
                const currentTime = new Date();
                if (reminderTime >= currentTime) {
                    // Schedule notification only if reminder time is in the future
                    debouncedScheduleNotification(task);
                    console.log(`Notification scheduled for task: ${task.taskName} at ${reminderTime}`);
                }
            });
        });
    }
}
