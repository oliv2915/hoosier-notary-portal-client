import React from "react";
import { ICustomerContact } from "../../interfaces";
import UserContext from "../../context/UserContext";
import { Card, CardBody, CardHeader } from "reactstrap";

interface ICustomerContactsCardProps {
	contacts: ICustomerContact[];
}

interface ICustomerContactsCardState {}

export default class CustomerContactsCard extends React.Component<
	ICustomerContactsCardProps,
	ICustomerContactsCardState
> {
	static contextType = UserContext;
	context!: React.ContextType<typeof UserContext>;
	constructor(props: ICustomerContactsCardProps) {
		super(props);
	}

	render() {
		return (
			<Card>
				<CardHeader>Contacts</CardHeader>
				<CardBody>Contacts Table</CardBody>
			</Card>
		);
	}
}
