"use client";
import { createContext, useContext, useEffect, useState, useRef } from "react";
import Image from "next/image";
// icons
import { X } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
// components ui
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
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
// hooks
import { usePathname, useRouter } from "next/navigation";
import { useDrawer } from "@/context/DrawerContext";

const AuthContext = createContext();

export function Auth({ menu }) {
  const [step, setStep] = useState(1);
  const [otpTimer, setOtpTimer] = useState(30);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const { isDrawerOpen, setIsDrawerOpen } = useDrawer();

  useEffect(() => {
    if (step === 2) {
      const interval = setInterval(() => {
        setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step]);

  return (
    <AuthContext.Provider
      value={{ step, setStep, phone, setPhone, otp, setOtp, otpTimer }}
    >
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" className="h-8 w-fit ml-auto">
            Login
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[69vh]">
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
            <Promo />
          </div>
          <Separator className="my-4" />
          {step === 1 && <Phone />}
          {step === 2 && <Otp menu={menu} setDrawer={setIsDrawerOpen} />}
          {step === 3 && <Name menu={menu} setDrawer={setIsDrawerOpen} />}
        </DrawerContent>
      </Drawer>
    </AuthContext.Provider>
  );
}

function Phone() {
  const { phone, setPhone, setStep, setOtp } = useContext(AuthContext);
  const handleNext = async () => {
    const response = await fetch("http://localhost:8000/api/auth/send-otp/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone_number: phone }),
    });
    if (response.status === 200) {
      const res = await response.json();
      setOtp(res.otp);
      setStep(2);
    }
  };
  return (
    <>
      <div className="flex flex-col justify-center h-full gap-2 w-full px-4">
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
      <DrawerFooter>
        <Button onClick={handleNext}>Get OTP</Button>
      </DrawerFooter>
    </>
  );
}

function Otp({ setDrawer }) {
  const router = useRouter();
  const pathname = usePathname();
  const { phone, otp, setOtp, setStep, otpTimer } = useContext(AuthContext);
  const handleNext = async () => {
    const response = await fetch("/api/auth/verify-otp/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, otp }),
    });
    if (response.status === 200) {
      const res = await response.json();
      if (!res.user.name || !res.user.email) {
        setStep(3);
      } else {
        router.push(pathname);
        setDrawer(false);
      }
    }
  };
  return (
    <>
      <div className="flex flex-col gap-2 items-center w-full px-4">
        {otp}
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
          Resend in 00:{otpTimer.toString().padStart(2, "0")}
        </p>
      </div>
      <DrawerFooter>
        <Button onClick={handleNext}>Continue</Button>
      </DrawerFooter>
    </>
  );
}

function Name({ setDrawer }) {
  const router = useRouter();
  const pathname = usePathname();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleNext = async () => {
    if (!name || !email) {
      console.error("Name and Email are required");
      return;
    }
    const response = await fetch("/api/auth/update-user/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    });
    if (response.status === 200) {
      router.push(pathname);
      setDrawer(false);
    }
  };
  return (
    <>
      <div className="flex flex-col gap-2 w-full px-4">
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
      <DrawerFooter>
        <Button onClick={handleNext}>Continue</Button>
      </DrawerFooter>
    </>
  );
}

export function Promo() {
  const plugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false }),
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        <CarouselItem>
          <div className="flex aspect-video items-center justify-center">
            <Image
              src="/pizza.jpg"
              width={200}
              height={200}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="flex aspect-video items-center justify-center">
            <img
              src="https://b.zmtcdn.com/data/pictures/2/20415942/d8ad25988e906612aea78a82543e25c7.jpg?output-format=webp&fit=around|771.75:416.25&crop=771.75:416.25;*,*"
              width={200}
              height={200}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="flex aspect-video items-center justify-center">
            <img
              src="https://b.zmtcdn.com/data/pictures/chains/7/19016907/bedddb08e3eafa541fdec9db26613993.jpg?output-format=webp&fit=around|300:273&crop=300:273;*,*"
              width={200}
              height={200}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
}
