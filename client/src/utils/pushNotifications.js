/**
 * pushNotifications.js
 * Utility to handle browser push notifications and Firebase Cloud Messaging (FCM) registration.
 */

import toast from "react-hot-toast";

// Firebase configuration placeholder
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if FCM is fully configured in env variables
const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId
);

let fcmToken = null;

/**
 * Request permission from the user for desktop notifications.
 * Supports standard browser API and registers FCM token if configured.
 */
export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.warn("This browser does not support desktop notifications.");
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");
      
      // If Firebase is configured, try to initialize FCM and register token
      if (isFirebaseConfigured) {
        await initFCM();
      }
      return true;
    } else {
      console.warn("Notification permission denied.");
      return false;
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
};

/**
 * Initialize Firebase Cloud Messaging (FCM) and fetch registration token.
 */
const initFCM = async () => {
  try {
    // Dynamic import to prevent bundler errors if Firebase is not fully setup
    const { initializeApp } = await import("firebase/app");
    const { getMessaging, getToken, onMessage } = await import("firebase/messaging");

    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);

    // Request FCM VAPID Token
    // Replace publicVapidKey with your real key from Firebase Console -> Project Settings -> Cloud Messaging -> Web Configuration
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    if (token) {
      fcmToken = token;
      console.log("FCM Token retrieved successfully:", token);
      
      // Send token to backend to bind with user session
      await registerTokenOnBackend(token);
    } else {
      console.warn("No registration token available. Request permission to generate one.");
    }

    // Handle foreground messages
    onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);
      showBrowserNotification(
        payload.notification?.title || "New Update!",
        {
          body: payload.notification?.body,
          icon: payload.notification?.image || "/assets/icons8-delivery-96-removebg-preview-HhiLdRxp.png",
        }
      );
    });

  } catch (error) {
    console.error("Failed to initialize Firebase Cloud Messaging:", error);
  }
};

/**
 * Register FCM registration token with user session in database
 */
const registerTokenOnBackend = async (token) => {
  try {
    const { axiosInstance } = await import("../config/axiosInstance");
    const response = await axiosInstance.post("/user/notifications/register-token", { token });
    if (response.data.success) {
      console.log("FCM Token registered on server.");
    }
  } catch (err) {
    console.error("Error sending token to backend server:", err);
  }
};

/**
 * Dispatch a system-level browser desktop notification.
 * Falls back to React Hot Toast if permission is not granted or blocked.
 * 
 * @param {string} title Notification header title
 * @param {object} options Notification Options (body, icon, etc.)
 */
export const showBrowserNotification = (title, options = {}) => {
  const defaultIcon = "https://cdn-icons-png.flaticon.com/512/2983/2983787.png"; // Delivery icon

  // 1. If permission is granted, send native Notification
  if (window.Notification && Notification.permission === "granted") {
    try {
      const notification = new Notification(title, {
        body: options.body || "",
        icon: options.icon || defaultIcon,
        badge: options.badge || "https://cdn-icons-png.flaticon.com/512/1170/1170678.png", // Shopping bag icon
        tag: options.tag || "flave-me-alert",
        renotify: true,
        ...options,
      });

      notification.onclick = () => {
        window.focus();
        if (options.url) {
          window.location.href = options.url;
        }
        notification.close();
      };
    } catch (e) {
      console.error("Failed to construct Notification object, falling back to toast:", e);
      // Fallback for environments where new Notification() fails
      toast(title + (options.body ? `: ${options.body}` : ""), { icon: "🔔" });
    }
  } else {
    // 2. If blocked/denied, display as dynamic in-app toast notification
    toast(title + (options.body ? `: ${options.body}` : ""), {
      icon: "🔔",
      duration: 5000,
    });
  }
};
