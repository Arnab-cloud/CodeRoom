"use client";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { ClassAddJoinDropDown } from "./ClassAddJoinMenu";

const Navbar: React.FC = () => {
	const { data: session } = useSession();

	return (
		<nav className="p-3 shadow-md sticky top-0 bg-white z-10">
			<div className="container mx-auto flex flex-row justify-between items-center">
				<Link href="/" className="text-xl font-bold mb-4 md:mb-0 ">
					CodeRooms
				</Link>
				{session ? (
					<div className="flex flex-row gap-5 items-center justify-around">
						<ClassAddJoinDropDown />
						<Button
							className=" w-full md:w-auto"
							onClick={() => signOut({ callbackUrl: "/" })}
						>
							Log out
						</Button>
					</div>
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
