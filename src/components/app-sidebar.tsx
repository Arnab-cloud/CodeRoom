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
import { Collapsible, CollapsibleTrigger } from "./ui/collapsible";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function AppSidebar() {
	return (
		<div>
			{/* In case the sidebar hides the logo of the navbar make the className="inset-y-16" or depends upon the hight of the navbar */}
			<Sidebar className="inset-y-16 shadow-lg">
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarMenu>
								<SidebarMenuItem>
									<SidebarMenuButton>
										<Link
											href="/h"
											className="text-lg font-semibold pl-2"
										>
											<span>Home</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
								<SidebarSeparator />
								<SidebarMenuItem>
									<Collapsible
										defaultOpen
										className="group/collapsible"
									>
										<CollapsibleTrigger asChild>
											<SidebarMenuButton>
												<div className="text-lg font-semibold">
													Enrolled
												</div>
												<ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90 duration-200" />
											</SidebarMenuButton>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub>
												<SidebarMenuSubItem>
													<div>Classes</div>
												</SidebarMenuSubItem>
											</SidebarMenuSub>
										</CollapsibleContent>
									</Collapsible>
								</SidebarMenuItem>
								<SidebarMenuItem>
									<Collapsible
										defaultOpen
										className="group/collapsible"
									>
										<CollapsibleTrigger asChild>
											<SidebarMenuButton>
												<div className="text-lg font-semibold">
													Created
												</div>
												<ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90 duration-200" />
											</SidebarMenuButton>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub>
												<SidebarMenuSubItem>
													<div>Classes</div>
												</SidebarMenuSubItem>
											</SidebarMenuSub>
										</CollapsibleContent>
									</Collapsible>
								</SidebarMenuItem>

								<SidebarSeparator />

								<SidebarMenuItem>
									<Link
										href="/h/archived-classes"
										className="text-lg font-semibold pl-2"
									>
										<span>Archived Classes</span>
									</Link>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
				<SidebarFooter />
			</Sidebar>
		</div>
	);
}
