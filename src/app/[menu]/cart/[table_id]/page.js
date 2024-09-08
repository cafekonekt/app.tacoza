"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
    Bike,
    ChevronLeft,
    Package,
    Store,
    Utensils,
    UtensilsCrossed,
    Tags,
    NotepadText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation";
import { SetQuantity } from "../SetQuantity";
import Loading from "@/app/loading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Auth } from "@/components/ui/auth";
import ShinyText from "@/components/ui/animations/ShinyText";
import { useRouter } from "next/navigation";

const iconMap = {
    veg: "/veg.svg",
    nonveg: "/non-veg.svg",
    egg: "/egg.svg",
};

export function Items({ items }) {
    const totalPrice = items?.reduce((acc, item) => acc + item.totalPrice, 0);
    const Gst = totalPrice * 0.05;
    return (
        <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                    <CardTitle className="flex gap-1">
                        <NotepadText className="h-4 w-4" /> Bill Summary
                    </CardTitle>
                    <CardDescription>Apply Offers to get discount</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="p-6 text-sm">
                <Label forhtml="coupon" className="flex items-center mb-1">
                    <Tags className="h-3.5 w-3.5 mr-1" /> Discount
                </Label>
                <div className="flex items-center gap-2 mb-4">
                    <Input
                        id="coupon"
                        label="Coupon Code"
                        placeholder="Enter coupon code"
                    />
                    <Button>Apply</Button>
                </div>
                <div className="grid gap-3">
                    <ul className="grid gap-3">
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>₹ {totalPrice - Gst}</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">GST</span>
                            <span>₹ {Gst}</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Platform Fee</span>
                            <span>₹ 0</span>
                        </li>
                        <li className="flex items-center justify-between font-semibold">
                            <span className="text-muted-foreground">Discount</span>
                            <span>₹ 0</span>
                        </li>
                        <li className="flex items-center justify-between font-semibold">
                            <span className="text-muted-foreground">Total</span>
                            <span>₹ {totalPrice}</span>
                        </li>
                    </ul>
                </div>
                <Separator className="my-4" />
                <li className="flex items-center justify-between font-semibold">
                    <span>To Pay</span>
                    <span>₹ {totalPrice}</span>
                </li>
            </CardContent>
        </Card>
    );
}

export default function Orders({ params }) {
    const router = useRouter();
    const pathname = usePathname();
    const pathnames = pathname.split("/");

    const { cartItems } = useCart();
    const [outlet, setOutlet] = useState({});
    const [table, setTable] = useState({});
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [orderType, setOrderType] = useState({
        type: "dine_in",
        table_id: params.table_id,
        instruction: "",
    });

    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(false);

    const handleOrderType = (e) => {
        setOrderType({ ...orderType, [e.target.name]: e.target.value });
    };

    const fetchTable = async () => {
        const response = await fetch(
            `http://localhost:8000/api/shop/table/${params.table_id}`,
        );
        if (!response.ok) {
            throw new Error("Failed to fetch table");
        }
        return response.json();
    };

    const fetchOutlet = async () => {
        const response = await fetch(
            `http://localhost:8000/api/shop/outlet/${pathnames[1]}`,
        );
        if (!response.ok) {
            throw new Error("Failed to fetch outlet");
        }
        return response.json();
    };

    const isAuthenticated = async () => {
        try {
            const response = await fetch("/api/auth/is-authenticated/");
            if (response.status === 200) {
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error checking authentication:", error);
            return false
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const [outletData, tableData, user] = await Promise.all([
                    fetchOutlet(),
                    fetchTable(),
                    isAuthenticated(),
                ]);
                setOutlet(outletData);
                setTable(tableData);
                setSession(user);
                setTotalPrice(
                    cartItems?.reduce((acc, item) => acc + item.totalPrice, 0),
                );
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        })();
    }, [cartItems, session]);

    const handleSubmit = async () => {
        if (!session) {
            setDrawerOpen(true);
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(`/api/orders/${pathnames[1]}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderType),
            });
            if (response.status === 200) {
                const data = await response.json();
                router.push(`${pathnames[1]}/orders/${data.order_id}`);
            }
            if (response.status === 401) {
                setSession(false);
                setDrawerOpen(true);
            }
        } catch (error) {
            console.error("Error submitting order:", error);
        } finally {
            setLoading(false);
        }
    };

    return loading ? (
        <Loading />
    ) : (
        <main className="grid gap-4 p-6" suppressHydrationWarning>
            {/* Header */}
            <div className="flex justify-between">
                <h2 className="text-2xl font-semibold">
                    <Link href={`/${pathnames[1]}`}>
                        <Button size="icon" variant="outline" className="h-8 w-8 mr-2">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    Cart
                </h2>
                {!session && (
                    <Auth drawerOpen={drawerOpen} setDrawer={setDrawerOpen} />
                )}
            </div>

            {/* Breadcrumb */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">HOME</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/${pathnames[1]}`}>
                            {pathnames[1].toLocaleUpperCase()}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>
                            {pathnames[2].toLocaleUpperCase()}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Restaurant Info */}
            {outlet && <Card className="overflow-hidden">
                <CardHeader className="bg-rose-50">
                    <CardTitle className="flex gap-1">
                        <Store className="h-4 w-4" /> {outlet?.shop?.name}
                    </CardTitle>
                    <CardDescription>Outlet Information</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-2 mt-4">
                    <div className="flex items-center gap-4">
                        <div className="aspect-square">
                            <Image
                                src="/pizza.jpg"
                                alt="Restaurant"
                                height="100"
                                width="100"
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>

                        <div className="text-muted-foreground text-sm">
                            <div className="text-base text-primary font-semibold truncate">
                                {outlet?.name}
                            </div>
                            {outlet?.location}
                            <div className="flex items-center gap-1">
                                <Link
                                    href={`/${pathnames[1]}`}
                                    className="flex items-center text-blue-500"
                                >
                                    View Menu <ChevronRightIcon className="h-4 w-4 mt-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>}

            {/* List Items */}
            {cartItems &&
                <Card className="overflow-hidden">
                    <CardHeader className="bg-rose-50">
                        <CardTitle className="flex gap-1">
                            <Utensils className="h-4 w-4" /> Items
                        </CardTitle>
                        <CardDescription>Customize your quantity</CardDescription>
                    </CardHeader>
                    {cartItems.map((item, key) => (
                        <CardContent key={key}>
                            <div className="mt-2">
                                <div className="flex items-center justify-between">
                                    <p className="font-medium flex items-center gap-1">
                                        <Image
                                            src={iconMap[item.food_item.food_type]}
                                            alt="Dash"
                                            height="14"
                                            width="14"
                                        />
                                        {item.food_item?.name}
                                        {item.variant && ` - ${item.variant.name}`}
                                    </p>
                                    <SetQuantity item={item} />
                                </div>
                                <div className="flex items-center justify-between text-sm mt-1">
                                    <span className="font-medium text-muted-foreground">
                                        ₹ {item.food_item.price}
                                    </span>
                                    <span className="font-medium">₹ {item.totalPrice}</span>
                                </div>
                            </div>
                            <p className="text-muted-foreground text-xs">
                                {item.addons &&
                                    item.addons.length > 0 &&
                                    item.addons.map((addon, key) => (
                                        <span key={key}>
                                            {addon.name}
                                            {key < item.addons.length - 1 ? ", " : ""}
                                        </span>
                                    ))}
                            </p>
                        </CardContent>
                    ))}
                </Card>
            }

            <Card className="p-6 gap-3 items-start flex flex-col">
                <Label forhtml="type">Order Type</Label>
                <ToggleGroup
                    id="type"
                    type="single"
                    value="dine_in"
                    onValueChange={(value) => {
                        setOrderType({ ...orderType, type: value });
                    }}
                >
                    <ToggleGroupItem value="dine_in" className="border rounded-full">
                        <UtensilsCrossed className="h-3.5 w-3.5 mr-1" /> DineIn
                    </ToggleGroupItem>
                    <ToggleGroupItem value="takeaway" className="border rounded-full">
                        <Package className="h-3.5 w-3.5 mr-1" />
                        Takeaway
                    </ToggleGroupItem>
                    <ToggleGroupItem value="delivery" className="border rounded-full">
                        <Bike className="h-3.5 w-3.5 mr-1" /> Delivery
                    </ToggleGroupItem>
                </ToggleGroup>

                <Label forhtml="instruction">Add Cooking Instruction</Label>
                <Textarea
                    id="instruction"
                    name="instruction"
                    placeholder="Add your cooking instruction"
                    onChange={handleOrderType}
                />
                {table &&
                    <>
                        <Label forhtml="tableid">Table</Label>
                        <Select
                            id="tableid"
                            value={params?.table_id}
                            onValueChange={(value) => {
                                setOrderType({ ...orderType, table_id: value });
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Table" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={table.id}>
                                    {table.name}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </>
                }
            </Card>
            {cartItems && <Items items={cartItems} />}
            <Button
                onClick={handleSubmit}
                className="sticky bottom-5 right-0 p-6 rounded-xl shadow-xl"
            >
                <ShinyText
                    shimmerWidth={300}
                    className="drop-shadow-lg text-lg font-bold"
                >
                    Proceed to Pay ₹{totalPrice}
                </ShinyText>
            </Button>
        </main>
    );
}
