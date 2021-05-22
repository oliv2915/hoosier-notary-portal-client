import React from "react";
import { ICustomer } from "../interfaces";
import { Card, CardBody, CardHeader } from "reactstrap";

interface ICustomerCardProps {
	customer: ICustomer;
}

const CustomerCard = (props: ICustomerCardProps) => {
	return (
		<Card>
			<CardHeader>Customer Details</CardHeader>
			<CardBody>Customer Details Section</CardBody>
		</Card>
	);
};

export default CustomerCard;
