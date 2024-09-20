"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Scanner } from "@yudiel/react-qr-scanner";

export function QRScanner() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");
    
    const handleScan = (result) => {
        const scannedBarcode = result[0];
        const scannedUrl = scannedBarcode?.rawValue;
        if (scannedUrl && scannedUrl.startsWith("https://api.tacoza.co")) {
            router.push(scannedUrl);
        } else {
            setErrorMessage("Please scan a Tacoza QR code, placed on your table.");
        }
    };
    return (
        <div className="inset-10">
            <Scanner onScan={handleScan} />
            {errorMessage && (
                <p className="text-white font-bold mt-4 bg-white bg-opacity-20 text-center rounded-lg">
                    {errorMessage}
                </p>
            )}
        </div>
    )
}