"use client";

import { useState, useEffect } from "react";
import { messaging } from "../../firebase/config";
import { getToken, onMessage } from "firebase/messaging";
import { useFCMStore } from "@/store/conversations/useFCMStore";
import { isiOS } from "@tiptap/core";

interface FCMState {
  token: string | null;
  permissionStatus: NotificationPermission;
  isSafari: boolean;
  isIOS: boolean; // Added to expose iOS detection
  requestPermission: () => Promise<void>;
}

// Utility function to detect macOS
const isMacOS = () => {
  return /Macintosh/i.test(navigator.userAgent) && !isiOS();
};

export const useFCM = (): FCMState => {
  const { setMessage } = useFCMStore();
  const [token, setToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] =
    useState<NotificationPermission>(() => {
      return (
        (localStorage.getItem(
          "notificationPermission"
        ) as NotificationPermission) || "default"
      );
    });
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isIOSDevice = isiOS(); // Detect iOS once at initialization

  useEffect(() => {
    (async () => {
      if (permissionStatus === "granted") {
        const fcmToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js"
          ),
        });
        setToken(fcmToken);
        localStorage.setItem("fcmToken", fcmToken);
      }
    })();
  }, [permissionStatus]);

  const requestPermission = async () => {
    if (!messaging) {
      console.error("Messaging not supported in this browser");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      localStorage.setItem("notificationPermission", permission);
    } catch (error) {
      console.error("Error getting FCM token:", error);
    }
  };

  useEffect(() => {
    if (messaging) {
      // Only auto-request permission on non-iOS devices and non-macOS and Safari
      if (
        permissionStatus === "default" &&
        !isIOSDevice &&
        !(isSafari && isMacOS())
      ) {
        requestPermission();
      }
    }

    if (messaging) {
      const unsubscribe = onMessage(messaging, (payload) => {
        // console.log("Message received. ", payload);
        setMessage(payload);
      });

      return () => unsubscribe();
    }
  }, [permissionStatus, isIOSDevice]);

  return {
    token,
    permissionStatus,
    isSafari,
    isIOS: isIOSDevice,
    requestPermission,
  };
};
