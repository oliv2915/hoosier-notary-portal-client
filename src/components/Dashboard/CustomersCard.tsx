import React, { BaseSyntheticEvent } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Card, CardBody, CardHeader, Table } from "reactstrap";
import UserContext from "../../context/UserContext";
import { ICustomer } from "../../interfaces";

interface ICustomersCardProps extends RouteComponentProps {}

interface ICustomersCardState {
	customers: ICustomer[];
}

export default class CustomersCard extends React.Component<
	ICustomersCardProps,
	ICustomersCardState
> {
	static contextType = UserContext;
	context!: React.ContextType<typeof UserContext>;
	constructor(props: ICustomersCardProps) {
		super(props);
		this.state = {
			customers: [],
		};
	}

	componentDidMount() {
		this.fetchCustomers();
	}

	fetchCustomers = () => {
		fetch(`${process.env.REACT_APP_API_SERVER}/customer/all`, {
			method: "GET",
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.context.token}`,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				this.setState({
					customers: data.customers,
				});
			});
	};

	customerRowClicked = (event: BaseSyntheticEvent) => {
		const customerId = event.currentTarget.id;
		this.props.history.push(`/customer?customer=${customerId}`);
	};

	render() {
		return (
			<Card>
				<CardHeader>Customers</CardHeader>
				<CardBody>
					<Table size="sm" borderless hover responsive>
						<thead>
							<tr>
								<th>Customer Name</th>
								<th>Customer Email</th>
								<th>Phone Number</th>
							</tr>
						</thead>
						<tbody>
							{this.state.customers.map((customer, idx) => {
								return (
									<tr
										key={idx}
										id={`${customer.id}`}
										onClick={this.customerRowClicked}
										style={{ cursor: "pointer" }}
									>
										<td>{customer.name}</td>
										<td>{customer.email}</td>
										<td>{customer.phoneNumber}</td>
									</tr>
								);
							})}
						</tbody>
					</Table>
				</CardBody>
			</Card>
		);
	}
}
