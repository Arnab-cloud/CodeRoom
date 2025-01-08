import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/authProvider";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/navbar";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<AuthProvider>
				<body className="h-screen">
					<Navbar />
					{children}
					<Toaster />
				</body>
			</AuthProvider>
		</html>
	);
}
