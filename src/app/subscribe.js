'use client'
import { subscribe } from "@/app/lib/pushManager/subscribe";
import { useEffect } from "react";

const VAPID_PUBLIC_KEY = "BMqkMGmUEFUWiQc1udUiNXgQ09IfBSePwIPh37oh3l-Li3TdtZfpI8BXsmrNuFG2b7SlwrHuyYlqzjC56H0vwaE";

export default function Subscribe() {
    useEffect(() => {
        if ("serviceWorker" in navigator && "PushManager" in window) {
            navigator.serviceWorker.ready.then(async (registration) => {
                try {
                    const subscription = await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: VAPID_PUBLIC_KEY,
                    });
                    const response = await subscribe(subscription);
                    if (response.status === "success") {
                        console.log("Subscribed to push notifications.");
                    } else {
                        console.error("Failed to subscribe:", response.message);
                    }
                } catch (error) {
                    console.error("Subscription error:", error);
                }
            });
        }
    }, []);
}