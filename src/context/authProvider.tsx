"use client";
import { SessionProvider } from "next-auth/react";

interface authProviderProps {
	children: React.ReactNode;
}

export default function AuthProvider({ children }: authProviderProps) {
	return <SessionProvider>{children}</SessionProvider>;
}
