import { PlusCircle, PlusIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import JoinClassForm from "./JoinClassForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import CreateClassForm from "./CreateClassForm";
import { useState } from "react";

export function ClassAddJoinDropDown() {
	const [isJoinFormOpen, setIsJoinFormOpen] = useState(false);
	const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					className="rounded-2xl w-4 h-auto shadow-md"
				>
					<PlusIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuItem>
					<Button
						variant="outline"
						onClick={(e) => {
							e.preventDefault();
							setIsJoinFormOpen(true);
						}}
						className="w-full"
					>
						{" "}
						<Users />
						<span>Join Room</span>
					</Button>
				</DropdownMenuItem>

				<DropdownMenuItem>
					<Button
						variant="outline"
						onClick={(e) => {
							e.preventDefault();
							setIsCreateFormOpen(true);
						}}
						className="w-full"
					>
						{" "}
						<PlusCircle />
						<span>Create Room</span>
					</Button>
				</DropdownMenuItem>
			</DropdownMenuContent>

			<Dialog open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Create a new Room</DialogTitle>
						<CreateClassForm
							setIsCreateFormOpen={setIsCreateFormOpen}
						/>
					</DialogHeader>
				</DialogContent>
			</Dialog>

			<Dialog open={isJoinFormOpen} onOpenChange={setIsJoinFormOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Join Room</DialogTitle>
						<JoinClassForm setIsJoinFormOpen={setIsJoinFormOpen} />
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</DropdownMenu>
	);
}
