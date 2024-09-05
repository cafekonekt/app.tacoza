import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
    BellRing,
    BookmarkPlus,
    Share2,
    ShoppingBag,
    Star,
    SwatchBook,
    ChevronLeft,
    ChefHat,
    X,
    Pin,
    Locate,
    MapPin,
    Phone,
    LeafyGreen,
    Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Auth } from "@/components/ui/auth";
import { Menu } from "../Menu";
import { apiGet } from "@/handlers/apiHandler";
import { MenuAccordion } from "../MenuAccordion";
import { ItemAdded } from "../ItemAdded";
import { getSession } from "@/app/lib/auth/session";

export default async function Home({ params }) {
    const itemsPromis = apiGet(`/api/shop/client-menu/${params.menu}`);
    const outletPromis = apiGet(`/api/shop/outlet/${params.menu}`);
    const [items, outlet] = await Promise.all([itemsPromis, outletPromis]);
    const session = await getSession();

    return (
        <main className="flex max-w-lg min-h-screen flex-col gap-4 justify-evenly p-6 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between">
                <h2 className="text-2xl font-semibold">
                    <Button size="icon" variant="outline" className="h-8 w-8 mr-2">
                        <ChefHat className="h-4 w-4" />
                    </Button>
                    Tacoza
                </h2>
                {session ? <Menu /> : <Auth />}
            </div>

            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/components">{params.menu.toUpperCase()}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Table 4 - Inside</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Outlet Image */}
            <div className="w-full grid grid-cols-5 grid-rows-2 gap-2">
                <div className="col-span-3 row-span-2">
                    <img
                        className="object-cover w-full h-full rounded-lg"
                        src="https://b.zmtcdn.com/data/pictures/2/20415942/d8ad25988e906612aea78a82543e25c7.jpg?output-format=webp&fit=around|771.75:416.25&crop=771.75:416.25;*,*"
                        alt="Dash"
                    />
                </div>
                <div className="col-span-1 row-span-2">
                    <div className="mb-2">
                        <img
                            className="object-cover w-full h-full rounded-lg"
                            src="https://b.zmtcdn.com/data/pictures/chains/7/19016907/bedddb08e3eafa541fdec9db26613993.jpg?output-format=webp&fit=around|300:273&crop=300:273;*,*"
                            alt="Dash"
                        />
                    </div>
                    <div className="">
                        <img
                            className="object-cover w-full h-full rounded-lg"
                            src="https://b.zmtcdn.com/data/pictures/chains/7/19016907/bedddb08e3eafa541fdec9db26613993.jpg?output-format=webp&fit=around|300:273&crop=300:273;*,*"
                            alt="Dash"
                        />
                    </div>
                </div>
                <div className="col-span-1 row-span-2">
                    <img
                        className="object-cover w-full h-full rounded-lg"
                        src="https://b.zmtcdn.com/data/reviews_photos/b43/77f9c9cc1be802a8607ed2ce32eecb43_1707568963.jpg?output-format=webp&fit=around|300:273&crop=300:273;*,*"
                        alt="Dash"
                    />
                </div>
            </div>

            {/* Restaurant Details */}
            <section className="w-full flex justify-between my-4">
                <div>
                    <h1 className="text-xl font-semibold">{outlet.name}</h1>
                    <p className="text-xs">Pizza, Italian, Pasta, Fast Food, Desserts</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {outlet.location}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" /> +91 {outlet.phone}
                    </p>

                    <div className="text-sm flex gap-2 items-center mt-2">
                        <span className="flex items-center">
                            <Timer className="h-3.5 w-3.5 mr-1" /> 30 Mins
                        </span>
                        <span className="text-current"> • ₹400 for 2</span>
                    </div>
                    <p className="text-sm text-green-600 bg-green-50 flex items-center gap-1 border border-green-600 p-1 px-2 rounded-xl w-fit mt-2">
                        <LeafyGreen className="h-3.5 w-3.5" /> Pure Veg
                    </p>
                </div>
                <div>
                    <Badge
                        variant="outline"
                        className="text-white text-base bg-green-700"
                    >
                        4.7
                        <Star className="fill-white w-4 h-4 ml-1" />
                    </Badge>
                    <p className="text-xs">
                        <b>12</b> Reviews
                    </p>
                </div>
            </section>

            {/* Call Waiter, Bookmark, Share */}
            <div className="flex gap-2">
                <Button>
                    <BellRing className="h-4 w-4 mr-2" /> Call Waiter
                </Button>
                <Button>
                    <BookmarkPlus className="h-4 w-4" />
                </Button>
                <Button>
                    <Share2 className="h-4 w-4" />
                </Button>
            </div>

            {/* Menu and Filters */}
            <section className="w-full">
                <div className="">
                    <div className="flex justify-between">
                        <ToggleGroup type="multiple" variant="outline">
                            <ToggleGroupItem
                                value="bold"
                                aria-label="Toggle bold"
                                className="gap-2 px-4"
                            >
                                <Image src="/veg.svg" alt="Dash" height="16" width="16" />
                                <span>Veg</span>
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="italic"
                                aria-label="Toggle italic"
                                className="gap-2 px-4"
                            >
                                <Image src="/egg.svg" alt="Dash" height="16" width="16" />
                                <span>Egg</span>
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="strikethrough"
                                aria-label="Toggle strikethrough"
                                className="gap-2 px-4 whitespace-nowrap"
                            >
                                <Image src="/non-veg.svg" alt="Dash" height="16" width="16" />
                                <span>Non-Veg</span>
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                    <Input className="my-2" placeholder="Search for dishes" />
                    {/* Menu */}
                    <MenuAccordion items={items} />
                </div>
            </section>

            {/* <section className="flex flex-col items-end fixed bottom-0 right-0 w-full">
        <div className="m-2 w-fit">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="rounded-full flex flex-col justify-center items-center bg-black p-4 text-white">
                <SwatchBook />
                Menu
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mr-6">
              <DropdownMenuLabel>Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Recommended
                <DropdownMenuShortcut>
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    2
                  </Badge>
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Main course
                <DropdownMenuShortcut>
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    2
                  </Badge>
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Chinese
                <DropdownMenuShortcut>
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    2
                  </Badge>
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                South Indian
                <DropdownMenuShortcut>
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    2
                  </Badge>
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <ItemAdded />
      </section> */}
        </main>
    );
}
