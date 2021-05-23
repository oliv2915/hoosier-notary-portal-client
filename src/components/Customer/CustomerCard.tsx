import React from "react";
import { ICustomer } from "../../interfaces";
import UserContext from "../../context/UserContext";
import { Card, CardBody, CardHeader } from "reactstrap";

interface ICustomerInfoCardProps {
	customer: ICustomer;
}

interface ICustomerInfoCardState {}

export default class CustomerInfoCard extends React.Component<
	ICustomerInfoCardProps,
	ICustomerInfoCardState
> {
	static contextType = UserContext;
	context!: React.ContextType<typeof UserContext>;
	constructor(props: ICustomerInfoCardProps) {
		super(props);
	}

	render() {
		return (
			<Card>
				<CardHeader>Customer Info</CardHeader>
				<CardBody>Customer Details</CardBody>
			</Card>
		);
	}
}
