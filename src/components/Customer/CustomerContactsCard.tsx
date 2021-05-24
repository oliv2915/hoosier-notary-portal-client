import React, { BaseSyntheticEvent } from "react";
import { ICustomerContact } from "../../interfaces";
import UserContext from "../../context/UserContext";
import { Button, Card, CardBody, CardHeader, Table } from "reactstrap";

interface ICustomerContactsCardProps {
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

	toggleEditContactModeal = () => {
		this.setState({
			isEditContactModalOpen: !this.state.isEditContactModalOpen,
		});
	};

	contactRowClicked = (event: BaseSyntheticEvent) => {
		this.setState(
			{
				contactToEdit: this.props.contacts[event.currentTarget.id],
			},
			() => this.toggleEditContactModeal
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
			</Card>
		);
	}
}
