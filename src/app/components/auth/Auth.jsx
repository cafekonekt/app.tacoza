"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { usePathname } from "next/navigation";
import { useDrawer } from "@/context/DrawerContext";
import { getOTP } from "@/app/lib/auth/getOTP";
import { verifyOTP } from "@/app/lib/auth/verifyOTP";
import { updateUser } from "@/app/lib/auth/updateUser";

// AuthContext remains unchanged
const AuthContext = createContext();

// A custom hook to handle the logic related to authentication states
const useAuthLogic = () => {
  const [step, setStep] = useState(1);
  const [otpTimer, setOtpTimer] = useState(30);
  const [resendCount, setResendCount] = useState(0); // Track resend attempts
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  // OTP Timer logic moved to custom hook
  useEffect(() => {
    if (step === 2) {
      const interval = setInterval(() => {
        setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step]);

  return {
    step,
    setStep,
    otpTimer,
    setOtpTimer,
    phone,
    setPhone,
    otp,
    setOtp,
    resendCount,
    setResendCount,
  };
};

export function Auth() {
  const { isDrawerOpen, setIsDrawerOpen } = useDrawer();

  // Use a custom hook to encapsulate the auth logic and prevent unnecessary re-renders
  const authValues = useAuthLogic();

  // Memoize the context value to prevent unnecessary renders
  const authContextValue = useMemo(() => authValues, [authValues]);

  return (
    <AuthContext.Provider value={authContextValue}>
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" className="h-8 w-fit ml-auto">
            Login
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[75vh]">
          <DrawerHeader className="flex items-start w-full">
            <div className="flex flex-col items-start w-full">
              <DrawerDescription className="flex items-center">
                Order with
                <Image
                  src="/logo.png"
                  alt="logo"
                  width={60}
                  height={35}
                  className="mb-[2px] ml-1"
                />
              </DrawerDescription>
              <DrawerTitle>Login</DrawerTitle>
            </div>
            <DrawerClose>
              <Button
                size="icon"
                variant="outline"
                className="rounded-full h-6 w-6"
              >
                <X size={16} />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="px-4">
            <Image
              src="/banner-thumb.png"
              alt="banner"
              width={200}
              height={200}
              className="h-40 w-full object-cover rounded-lg"
            />
          </div>
          <Separator className="my-4" />
          <div className="h-full px-4 pb-6">
            {authValues.step === 1 && <Phone />}
            {authValues.step === 2 && <Otp setDrawer={setIsDrawerOpen} />}
            {authValues.step === 3 && <Name setDrawer={setIsDrawerOpen} />}
          </div>
        </DrawerContent>
      </Drawer>
    </AuthContext.Provider>
  );
}

function Phone() {
  const { phone, setPhone, setStep, setResendCount } =
    useContext(AuthContext);
  const handleNext = async () => {
    const response = await getOTP(phone);
    if (response) {
      setResendCount(0); // Reset resend count on successful OTP request
      setStep(2);
    }
  };
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col justify-center gap-2 w-full">
        <Label>Mobile Number</Label>
        <PhoneInput
          placeholder="Enter Phone Number"
          name="phone"
          value={phone}
          onChange={setPhone}
          required
          defaultCountry="IN"
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs">
          By continuing, you agree to our{" "}
          <a href="#" className="text-primary">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary">
            Privacy Policy
          </a>
        </span>
        <Button className="w-full" onClick={handleNext}>
          Get OTP
        </Button>
      </div>
    </div>
  );
}

function Otp({ setDrawer }) {
  const {
    phone,
    otp,
    setOtp,
    setStep,
    otpTimer,
    setOtpTimer,
    resendCount,
    setResendCount,
  } = useContext(AuthContext);
  const { cartItems, addToCart, clearCart } = useCart();

  const handleNext = async () => {
    const response = await verifyOTP(phone, otp);
    if (response) {
      if (cartItems.length > 0) {
        const tempCartItems = [...cartItems];
        clearCart();
        tempCartItems.forEach((item) => {
          addToCart(item.food_item, item.variant, item.addons, item.totalPrice, item.quantity);
        });
      }
      // Only move to step 3 if name or email is missing
      if (!response.user.name || !response.user.email) {
        setStep(3);
      } else {
        setDrawer(false);
      }
    }
  };

  const handleResend = async () => {
    if (resendCount < 3) {
      const response = await getOTP(phone);
      if (response) {
        setOtpTimer(30); // Reset timer to 30 seconds
        setResendCount((prev) => prev + 1); // Increment resend count
      }
    } else {
      alert("You have reached the maximum number of OTP resend attempts.");
    }
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-2 items-center w-full">
        <Label>Enter OTP</Label>
        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <p className="text-xs">
          {resendCount < 3 ? (
            <>
              <button
                className="text-rose-600 underline disabled:text-black disabled:no-underline"
                variant="text"
                onClick={handleResend}
                disabled={otpTimer > 0}
              >
                Resend
              </button>{" "}
              in 00:{otpTimer.toString().padStart(2, "0")}
            </>
          ) : (
            <span className="text-red-500">Max OTP attempts reached</span>
          )}
        </p>
      </div>
      <Button onClick={handleNext}>Continue</Button>
    </div>
  );
}

function Name({ setDrawer }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleNext = async () => {
    if (!name || !email) {
      console.error("Name and Email are required");
      return;
    }
    const response = await updateUser(name, email);
    if (response) {
      setDrawer(false);
    }
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-2 w-full">
        <Label>Name</Label>
        <Input
          placeholder="Rahul Tiwari"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Label>Email</Label>
        <Input
          type="email"
          placeholder="name@restro.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Button onClick={handleNext}>Continue</Button>
    </div>
  );
}

import Autoplay from "embla-carousel-autoplay";
// components ui
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useCart } from "@/context/CartContext";

export function Promo({ gallery }) {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: false }));
  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {gallery &&
          gallery.map((url, index) => (
            <CarouselItem key={index}>
              <div className="flex aspect-video items-center justify-center">
                <Image
                  src={url}
                  alt="Pizza"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </CarouselItem>
          ))}
      </CarouselContent>
    </Carousel>
  );
}
