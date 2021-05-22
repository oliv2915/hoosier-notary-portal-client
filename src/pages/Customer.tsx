import React from "react";
import { ICustomer, ICustomerContact, IAddress } from "../interfaces";
import UserContext from "../context/UserContext";
import { RouteComponentProps } from "react-router-dom";
import NavBar from "../components/NavBar";

interface ICustomerProps extends RouteComponentProps {}

interface ICustomerState {
	customer: ICustomer;
	contacts: ICustomerContact[];
	addresses: IAddress[];
}

export default class Customer extends React.Component<
	ICustomerProps,
	ICustomerState
> {
	static contextType = UserContext;
	context!: React.ContextType<typeof UserContext>;
	constructor(props: ICustomerProps) {
		super(props);
		this.state = {
			customer: {},
			contacts: [],
			addresses: [],
		};
	}

	componentDidMount() {
		const query = new URLSearchParams(this.props.location.search);
		if (query.get("customer")) {
			this.setState(
				{
					customer: { id: Number(query.get("customer")) },
				},
				() => this.fetchCustomer()
			);
		} else {
			this.props.history.push("/dashboard");
		}
	}

	fetchCustomer = () => {
		fetch(
			`${process.env.REACT_APP_API_SERVER}/customer/profile?id=${this.state.customer.id}`,
			{
				method: "GET",
				headers: new Headers({
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.context.token}`,
				}),
			}
		)
			.then((res) => res.json())
			.then((data) => {
				this.setState(
					{
						customer: data.customer,
						contacts: data.contacts,
						addresses: data.addresses,
					},
					() => console.log(this.state)
				);
			});
	};

	render() {
		// if not auth, redirect to login page
		if (!this.context.isAuth) this.props.history.push("/");
		return (
			<>
				<NavBar
					history={this.props.history}
					location={this.props.location}
					match={this.props.match}
				/>
			</>
		);
	}
}
