import React from "react";
import { IAssignment } from "../../interfaces";
import { Card, CardBody, CardHeader } from "reactstrap";

interface IAssignmentCardProps {
	assignment: IAssignment;
}

const AssignmentCard = (props: IAssignmentCardProps) => {
	return (
		<Card>
			<CardHeader>Assignment Details</CardHeader>
			<CardBody>Assignment Details Section</CardBody>
		</Card>
	);
};

export default AssignmentCard;
