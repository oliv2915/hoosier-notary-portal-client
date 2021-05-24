import React from "react";
import { ICustomer } from "../../interfaces";
import UserContext from "../../context/UserContext";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Col,
	Label,
	Row,
} from "reactstrap";
import { RouteComponentProps } from "react-router-dom";
import CustomerModal from "./CustomerModal";

interface ICustomerInfoCardProps extends RouteComponentProps {
	customer: ICustomer;
	updateCustomerProfile?: () => void;
}

interface ICustomerInfoCardState {
	isEditCustomerModalOpen: boolean;
}

export default class CustomerInfoCard extends React.Component<
	ICustomerInfoCardProps,
	ICustomerInfoCardState
> {
	static contextType = UserContext;
	context!: React.ContextType<typeof UserContext>;
	constructor(props: ICustomerInfoCardProps) {
		super(props);
		this.state = {
			isEditCustomerModalOpen: false,
		};
	}

	toggleEditCustomerModal = () => {
		this.setState({
			isEditCustomerModalOpen: !this.state.isEditCustomerModalOpen,
		});
	};

	render() {
		const query = new URLSearchParams(this.props.location.search);
		return (
			<Card>
				<CardHeader>
					<span>Customer Details </span>
					{!query.get("assignment") && (
						<Button
							type="button"
							color="info"
							size="sm"
							onClick={this.toggleEditCustomerModal}
						>
							Update Customer
						</Button>
					)}
				</CardHeader>
				<CardBody className="customer-card-body">
					<Row>
						<Col>
							<div>
								<Label>
									<b>Customer Name</b>
								</Label>
								<p>{this.props.customer.name}</p>
							</div>
							<div>
								<Label>
									<b>Customer Type</b>
								</Label>
								<p>{this.props.customer.customerType}</p>
							</div>
							<div>
								<Label>
									<b>Phone Number</b>
								</Label>
								<p>{this.props.customer.phoneNumber}</p>
							</div>
							<div>
								<Label>
									<b>Email Address</b>
								</Label>
								<p>{this.props.customer.email}</p>
							</div>
							<div hidden={this.context.user.isNotary}>
								<Label>
									<b>Customer Notes</b>
								</Label>
								<p>{this.props.customer.notes}</p>
							</div>
						</Col>
					</Row>
				</CardBody>
				{/* update customer */}
				<CustomerModal
					isOpen={this.state.isEditCustomerModalOpen}
					toggle={this.toggleEditCustomerModal}
					customerToEdit={this.props.customer}
					updateCustomerProfile={this.props.updateCustomerProfile}
					history={this.props.history}
					location={this.props.location}
					match={this.props.match}
				/>
			</Card>
		);
	}
}
