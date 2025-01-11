const ClassRoomPage = async ({
	params,
}: {
	params: Promise<{ classId: string }>;
}) => {
	const { classId } = await params;
	return <div>This is the classroom {classId}</div>;
};

export default ClassRoomPage;
