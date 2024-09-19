import Image from "next/image";
import { NotFoundAnimation } from "./components/lottie/lottie";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative max-w-screen h-screen flex flex-col items-center">
      <div className="flex flex-col items-center mt-[15vh]">
        <Image src="/logo.png" alt="logo" width={100} height={30} />
        <span className="text-3xl font-bold mt-2">
          Oops! We can&apos;t find this
        </span>
        <span>We still have a lot of good stuff to show you</span>
        <Link href="/">
          <Button className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
        </Link>
      </div>
      <NotFoundAnimation />
      <div className="absolute bottom-0 -z-10 w-full h-[20vh] bg-[#e11d48]" />
    </main>
  );
}
