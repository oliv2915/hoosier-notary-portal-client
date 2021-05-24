import React from "react";
import { IUserContextUser } from "../../interfaces";
import { Card, CardBody, CardHeader } from "reactstrap";

interface INotaryCardProps {
	notary: IUserContextUser;
}

interface INotaryCardState {}

export default class NotaryCard extends React.Component<
	INotaryCardProps,
	INotaryCardState
> {
	render() {
		return (
			<Card>
				<CardHeader>Notary Details</CardHeader>
				<CardBody>Notary Details Section</CardBody>
			</Card>
		);
	}
}
