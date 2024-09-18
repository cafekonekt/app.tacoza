"use client";
import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function SearchLoadingAnimation() {
  return (
    <DotLottieReact
      src="https://lottie.host/47fdca9b-62d5-46b8-a210-ed3852f69d20/3CizESRRBJ.lottie"
      loop
      autoplay
    />
  );
}

export function PaymentSuccessAnimation() {
  return (
    <div className="w-40 h-40">
      <DotLottieReact
        src="https://lottie.host/9dcee1be-d8e0-47c7-b5b7-bd901c7e217d/TeygC2mSFW.lottie"
        autoplay
      />
    </div>
  );
}

export function PaymentFailAnimation() {
  return (
    <div className="w-32 h-32 mb-2">
      <DotLottieReact
        src="https://lottie.host/66af5461-6080-45f7-a9bd-aa863bbcc5a9/359LfejfLA.lottie"
        autoplay
      />
    </div>
  );
}

export function FoodPreparingAnimation() {
  return (
    <div className="w-14 h-14">
      <DotLottieReact src="/lottie/cooking.lottie" autoplay loop />
    </div>
  );
}

export function NotFoundAnimation() {
  return <DotLottieReact src="/lottie/404.lottie" autoplay loop />;
}

export function HowtoScanAnimation() {
  return (
    <div className="w-full">
      <DotLottieReact src="/lottie/scan.lottie" autoplay loop />
    </div>
  );
}
