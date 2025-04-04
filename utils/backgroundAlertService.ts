// import React, { useEffect } from "react";
// import { View, Text } from "react-native";
// import * as TaskManager from "expo-task-manager";
// import * as BackgroundFetch from "expo-background-fetch";
// import * as Notifications from "expo-notifications";
// import * as Permissions from "expo-permissions";

// const BACKGROUND_FETCH_TASK = "background-fetch-task";

// // Define the background task
// TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
//   try {
//     console.log("Running background task...");

//     // Send a local notification
//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: "Reminder",
//         body: "This is your alert every 10 minutes!",
//         sound: true,
//       },
//       trigger: null, // Instant notification
//     });

//     return BackgroundFetch.BackgroundFetchResult.NewData;
//   } catch (error) {
//     console.error("Background task error:", error);
//     return BackgroundFetch.BackgroundFetchResult.Failed;
//   }
// });

// // Register the background fetch task
// export const registerBackgroundFetch = async () => {
//   const status = await BackgroundFetch.getStatusAsync();
//   if (status === BackgroundFetch.BackgroundFetchStatus.Available) {
//     await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
//       minimumInterval: 600, // Run every 10 minutes (600 seconds)
//       stopOnTerminate: false, // Continue running after app is closed
//       startOnBoot: true, // Run on device boot
//     });
//     console.log("Background fetch registered!");
//   } else {
//     console.log("Background fetch not available");
//   }
// };

// // Request notification permissions
// export const requestPermissions = async () => {
//   const { status } = await Notifications.requestPermissionsAsync();
//   if (status !== "granted") {
//     console.log("Notification permissions not granted");
//   }
// };
