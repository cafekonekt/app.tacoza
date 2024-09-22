import { ChevronLeft, CloudUpload, Instagram } from "lucide-react";
import Link from "next/link";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";

export const metadata = {
  title: "My Profile - tacoza",
  description: "Scan, Crave and Order superfast",
};

export default function Profile() {
  return (
    <main className="h-screen max-w-md">
      <section className="pb-32 flex flex-col h-full w-full p-4">
        <h2 className="flex items-center text-xl font-semibold drop-shadow-lg mb-4">
          <Link href="/match">
            <ChevronLeft className="h-6 w-6 mr-2" />
          </Link>
          Profile
        </h2>
        <div className="flex flex-col gap-4 items-start pb-10">
          {/* Profile Card */}
          <Label forHtml="name">Full Name</Label>
          <Input id="name" type="text" placeholder="Enter your name" />
          <Label forHtml="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter your email" />
          <Label forHtml="Phone">Phone</Label>
          <Input id="Phone" type="text" placeholder="Enter your Phone" />
          <Label forHtml="dob">Birthday Date</Label>
          <DatePicker id="dob" />
          <Button className="w-full">Save</Button>
        </div>
      </section>
    </main>
  );
}

export function SliderRange({ className, ...props }) {
  return (
    <Slider
      defaultValue={[25, 75]}
      max={100}
      step={1}
      className={cn("w-full", className)}
      {...props}
    />
  );
}

export function ConnectProfileInfo() {
  return (
    <>
      <Separator />
      <p className="font-bold">Connect tacoza profile settings</p>

      <Label>Profile Picture</Label>
      <div class="flex items-center justify-center w-full">
        <label
          for="dropzone-file"
          class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <CloudUpload class="h-8 w-8 text-gray-400 dark:text-gray-300" />
            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span class="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG or JPEG (MAX. 800x400px)
            </p>
          </div>
          <input id="dropzone-file" type="file" class="hidden" />
        </label>
      </div>

      <Label forHtml="age">Age</Label>
      <Input
        id="age"
        type="number"
        placeholder="Enter your age"
        max="60"
        min="18"
      />
      <Label forHtml="gender">Gender</Label>
      <ToggleGroup id="gender" type="single" variant="outline">
        <ToggleGroupItem value="m">Male</ToggleGroupItem>
        <ToggleGroupItem value="f">Female</ToggleGroupItem>
        <ToggleGroupItem value="o">Other</ToggleGroupItem>
      </ToggleGroup>
      <Label forHtml="bio">Bio</Label>
      <Textarea id="bio" placeholder="Enter your bio" />
      <Separator />
      <p className="font-bold">Interests</p>
      <Label forHtml="interests">Select your hobbies</Label>
      <ToggleGroup id="interests" type="multiple" variant="outline">
        <ToggleGroupItem value="m">Music</ToggleGroupItem>
        <ToggleGroupItem value="f">Food</ToggleGroupItem>
        <ToggleGroupItem value="o">Travel</ToggleGroupItem>
        <ToggleGroupItem value="o">Gym</ToggleGroupItem>
      </ToggleGroup>
      <Label>Select your age range</Label>
      <SliderRange />
      <Label>Social Media</Label>
      <div className="w-full flex items-center space-x-2">
        <Instagram className="w-7 h-7 text-gray-400" />
        <Input type="text" placeholder="@username" />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Share my social media with matched users.
        </label>
      </div>
    </>
  );
}
