import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubItem,
	SidebarSeparator,
} from "@/components/ui/sidebar";
import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
} from "./ui/collapsible";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import axios, { AxiosError } from "axios";
import { ApiResponse, classInfo } from "@/types/ApiResponse";

interface sidebarProps {
	classes: classInfo[];
}

const SideBarElem: React.FC<sidebarProps> = ({ classes }) => {
	const enrolledClasses = classes.filter(
		(classItem) => classItem.role === "student"
	);
	const createdClasses = classes.filter(
		(classesItem) => classesItem.role === "teacher"
	);
	return (
		<div>
			{/* Adjusted the `inset-y-16` to account for potential navbar height */}
			<Sidebar className="inset-y-16 shadow-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarMenu>
								{/* Home Menu Item */}
								<SidebarMenuItem>
									<SidebarMenuButton className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 rounded-lg">
										<Link
											href="/h"
											className="text-lg font-semibold pl-2 w-full"
										>
											<div>Home</div>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
								<SidebarSeparator className="my-4 border-t border-gray-300 dark:border-gray-700" />

								{/* Enrolled Menu Item */}
								<SidebarMenuItem>
									<Collapsible
										defaultOpen
										className="group/collapsible"
									>
										<CollapsibleTrigger asChild>
											<SidebarMenuButton className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 rounded-lg flex justify-between items-center">
												<div className="text-lg font-semibold">
													Enrolled
												</div>
												<ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90 duration-200" />
											</SidebarMenuButton>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub>
												{enrolledClasses.map(
													(classItem, index) => (
														<SidebarMenuSubItem
															key={index}
															className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 rounded-lg"
														>
															<Link
																href={`/h/c/${classItem.classId}`}
																className="block px-4 py-2"
															>
																<div>
																	{
																		classItem.className
																	}
																</div>
															</Link>
														</SidebarMenuSubItem>
													)
												)}
											</SidebarMenuSub>
										</CollapsibleContent>
									</Collapsible>
								</SidebarMenuItem>

								{/* Created Menu Item */}
								<SidebarMenuItem>
									<Collapsible
										defaultOpen
										className="group/collapsible"
									>
										<CollapsibleTrigger asChild>
											<SidebarMenuButton className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 rounded-lg flex justify-between items-center">
												<div className="text-lg font-semibold">
													Created
												</div>
												<ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90 duration-200" />
											</SidebarMenuButton>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub>
												{createdClasses.map(
													(classItem, index) => (
														<SidebarMenuSubItem
															key={index}
															className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 rounded-lg"
														>
															<Link
																href={`/h/c/${classItem.classId}`}
																className="block px-4 py-2"
															>
																<div>
																	{
																		classItem.className
																	}
																</div>
															</Link>
														</SidebarMenuSubItem>
													)
												)}
											</SidebarMenuSub>
										</CollapsibleContent>
									</Collapsible>
								</SidebarMenuItem>

								<SidebarSeparator className="my-4 border-t border-gray-300 dark:border-gray-700" />

								{/* Archived Classes Menu Item */}
								<SidebarMenuItem>
									<SidebarMenuButton className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 rounded-lg">
										<Link
											href="/h/archived-classes"
											className="text-lg font-semibold pl-2"
										>
											<span>Archived Classes</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
				<SidebarFooter className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm border-t border-gray-300 dark:border-gray-700">
					&copy; 2025 Your App Name
				</SidebarFooter>
			</Sidebar>
		</div>
	);
};

export default async function AppSidebar() {
	// const session =
	const session = await getServerSession(authOptions);
	const userId = session?.user._id;
	if (!userId) {
		return <div>User id not provided</div>;
	}
	// console.log(session);
	try {
		const result = await axios.get<ApiResponse>(
			`http://localhost:3000/api/${userId}/get-classes?ia=0`
		);
		// console.log(result);
		const classes = result.data.classes;
		if (!classes) {
			return <div>No classes found</div>;
		}

		return <SideBarElem classes={classes} />;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse>;
		console.log("Error", axiosError);
		return <div>Error</div>;
	}
}
