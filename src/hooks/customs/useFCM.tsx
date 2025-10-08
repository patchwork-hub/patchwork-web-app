"use client";

import { useState, useEffect, useCallback } from "react";
import { getToken, Messaging, onMessage } from "firebase/messaging";
import { isiOS } from "@tiptap/core";
import { useFCMStore } from "@/stores/conversations/useFCMStore";
import { getMessagingInstance } from "@/lib/firebase/config";

type FCMState = {
  token: string | null;
  permissionStatus: NotificationPermission;
  isSafari: boolean;
  isIOS: boolean;
  requestPermission: () => Promise<void>;
};

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
  const [messaging, setMessaging] = useState<Messaging | null>(null);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isIOSDevice = isiOS();

  // Initialize messaging
  useEffect(() => {
    const initializeMessaging = async () => {
      const instance = await getMessagingInstance();
      setMessaging(instance);
    };
    initializeMessaging();
  }, []);

  useEffect(() => {
    (async () => {
      if (permissionStatus === "granted" && messaging) {
        try {
          const fcmToken = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: await navigator.serviceWorker.register(
              "/firebase-messaging-sw.js"
            ),
          });
          setToken(fcmToken);
          localStorage.setItem("fcmToken", fcmToken);
        } catch (error) {
          console.error("Error getting FCM token:", error);
        }
      }
    })();
  }, [permissionStatus, messaging]);

  const requestPermission = useCallback(async () => {
    const currentMessaging = messaging;
    if (!currentMessaging) {
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
  }, [messaging]);

  useEffect(() => {
    if (!messaging) return;

    // Only auto-request permission on non-iOS devices and non-macOS and Safari
    if (
      permissionStatus === "default" &&
      !isIOSDevice &&
      !(isSafari && isMacOS())
    ) {
      requestPermission();
    }

    const unsubscribe = onMessage(messaging, (payload) => {
      setMessage(payload);
    });

    return () => unsubscribe();
  }, [
    permissionStatus,
    isIOSDevice,
    messaging,
    setMessage,
    isSafari,
    requestPermission,
  ]);

  return {
    token,
    permissionStatus,
    isSafari,
    isIOS: isIOSDevice,
    requestPermission,
  };
};
