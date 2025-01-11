export interface classInfo {
	classId: string;
	className: string;
	subject: string;
	section: string;
	teachers: Array<{ fullName: string; email: string }>;
	role: string;
}

interface userInfo {
	firstName: string;
	lastName: string;
	email?: string;
	role?: string;
}

export interface ApiResponse {
	success: boolean;
	message: string;
	classId?: string;
	classes?: Array<classInfo>;
	users?: Array<userInfo>;
}
