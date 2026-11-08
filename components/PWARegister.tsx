"use client";

import { useEffect } from "react";

export default function PWARegister() {

  useEffect(() => {

    if (
      "serviceWorker" in navigator
    ) {

      navigator.serviceWorker
        .register("/sw.js")
        .then(() => {
          console.log(
            "Service Worker Registered"
          );
        })
        .catch((error) => {
          console.error(
            "Service Worker Error",
            error
          );
        });

    }

  }, []);

  return null;
}