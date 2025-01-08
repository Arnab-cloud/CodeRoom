"use client";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import Link from "next/link";

const Navbar: React.FC = () => {
	const { data: session } = useSession();

	return (
		<nav className="p-3 shadow-md sticky top-0 bg-white">
			<div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
				<Link href="/" className="text-xl font-bold mb-4 md:mb-0 ">
					CodeRooms
				</Link>
				{session ? (
					<>
						<Button
							className=" w-full md:w-auto"
							onClick={() => signOut({ callbackUrl: "/" })}
						>
							Logout
						</Button>
					</>
				) : (
					<Link href="/sign-in">
						<Button className=" w-full md:w-auto">Login</Button>
					</Link>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
