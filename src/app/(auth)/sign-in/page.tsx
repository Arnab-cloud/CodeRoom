"use client";
import { signIn, useSession } from "next-auth/react";

const SigninPage: React.FC = () => {
	const { data } = useSession();
	if (data) {
		return <div>Already Signed in</div>;
	}

	return (
		<div>
			<p>Not signed in</p>
			<button
				onClick={() => {
					signIn();
				}}
			>
				Sign in
			</button>
		</div>
	);
};

export default SigninPage;
