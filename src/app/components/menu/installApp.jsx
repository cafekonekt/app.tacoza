"use client";
import { useEffect, useState } from "react";
import { BorderBeam } from "@/components/ui/animations/border-beam";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function InstallApp() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Check if the app is already installed
    const checkInstalledStatus = () => {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone;
      setIsInstalled(isStandalone);
    };

    checkInstalledStatus();

    // Listen for the 'beforeinstallprompt' event to show install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e); // Store the event for later use
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Show the install prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null); // Reset the prompt as it's no longer usable
      });
    }
  };

  // Don't render the component if the app is already installed
  if (isInstalled || !deferredPrompt) {
    return null;
  }

  return (
    <div className="animate-in slide-in-from-top-0 flex items-center relative bg-white h-16 p-2 mx-4 my-2 rounded-lg shadow-lg">
      <BorderBeam size={100} duration={12} delay={9} />
      <Image
        src="/icon512_rounded.png"
        alt="Install App"
        width={80}
        height={80}
        className="mr-4 h-12 w-12 rounded-[10px]"
      />
      <div className="leading-none">
        <p className="font-semibold text-primary">Install App in One Tap</p>
        <p className="text-gray-500 text-sm">Offers and Updates</p>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="ml-auto border-rose-500 text-rose-500"
        onClick={handleInstallClick}
      >
        Install
      </Button>
    </div>
  );
}
