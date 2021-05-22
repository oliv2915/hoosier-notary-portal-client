import React from "react";
import { IUserContextUser } from "../../interfaces";
import { Card, CardBody, CardHeader } from "reactstrap";

interface INotaryCardProps {
	notary: IUserContextUser;
}

const NotaryCard = (props: INotaryCardProps) => {
	return (
		<Card>
			<CardHeader>Notary Details</CardHeader>
			<CardBody>Notary Details Section</CardBody>
		</Card>
	);
};

export default NotaryCard;
