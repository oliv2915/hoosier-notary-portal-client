import React, { BaseSyntheticEvent } from "react";
import { ICustomerContact } from "../../interfaces";
import UserContext from "../../context/UserContext";
import { Button, Card, CardBody, CardHeader, Table } from "reactstrap";
import CustomerContactModal from "./CustomerContactModal";
import { RouteComponentProps } from "react-router-dom";

interface ICustomerContactsCardProps extends RouteComponentProps {
	contacts: ICustomerContact[];
	updateCustomerProfile: () => void;
}

interface ICustomerContactsCardState {
	isAddContactModalOpen: boolean;
	isEditContactModalOpen: boolean;
	contactToEdit: ICustomerContact;
}

export default class CustomerContactsCard extends React.Component<
	ICustomerContactsCardProps,
	ICustomerContactsCardState
> {
	static contextType = UserContext;
	context!: React.ContextType<typeof UserContext>;
	constructor(props: ICustomerContactsCardProps) {
		super(props);
		this.state = {
			isAddContactModalOpen: false,
			isEditContactModalOpen: false,
			contactToEdit: {},
		};
	}

	toggleAddContactModal = () => {
		this.setState({
			isAddContactModalOpen: !this.state.isAddContactModalOpen,
		});
	};

	toggleEditContactModal = () => {
		this.setState({
			isEditContactModalOpen: !this.state.isEditContactModalOpen,
		});
	};

	contactRowClicked = (event: BaseSyntheticEvent) => {
		this.setState(
			{
				contactToEdit: this.props.contacts[event.currentTarget.id],
			},
			() => this.toggleEditContactModal()
		);
	};

	render() {
		return (
			<Card>
				<CardHeader>
					<span>Contacts </span>
					<Button
						type="button"
						color="info"
						size="sm"
						onClick={this.toggleAddContactModal}
					>
						Add Contact
					</Button>
				</CardHeader>
				<CardBody>
					<Table size="sm" hover responsive borderless>
						<thead>
							<tr>
								<th>Name</th>
								<th>Phone Number</th>
								<th>Email</th>
							</tr>
						</thead>
						<tbody>
							{this.props.contacts.map((contact, idx) => {
								return (
									<tr
										key={idx}
										id={`${idx}`}
										onClick={this.contactRowClicked}
										style={{ cursor: "pointer" }}
									>
										<td>{`${contact.name}`}</td>
										<td>{`${contact.phoneNumber}`}</td>
										<td>{`${contact.email}`}</td>
									</tr>
								);
							})}
						</tbody>
					</Table>
				</CardBody>
				{/* Add Contact */}
				<CustomerContactModal
					isOpen={this.state.isAddContactModalOpen}
					toggle={this.toggleAddContactModal}
					updateCustomerProfile={this.props.updateCustomerProfile}
					history={this.props.history}
					location={this.props.location}
					match={this.props.match}
				/>
				{/* Update Contact */}
				<CustomerContactModal
					isOpen={this.state.isEditContactModalOpen}
					toggle={this.toggleEditContactModal}
					updateCustomerProfile={this.props.updateCustomerProfile}
					contactToEdit={this.state.contactToEdit}
					history={this.props.history}
					location={this.props.location}
					match={this.props.match}
				/>
			</Card>
		);
	}
}
