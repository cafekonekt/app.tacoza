import { defaultCache } from "@serwist/next/worker";
import { Serwist } from "serwist";

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

self.addEventListener("push", (event) => {
  const data = event.data.json();
  const title = data.title || 'Notification';
  const options = {
    body: data.body,
    icon: '/icon512_rounded.png',
    url: data.url ? data.url : '/',
  };
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

serwist.addEventListeners();
