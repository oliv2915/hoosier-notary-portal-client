import React, { BaseSyntheticEvent } from "react";
import { ICustomerContact } from "../../interfaces";
import UserContext from "../../context/UserContext";
import {
	Alert,
	Button,
	Col,
	Form,
	FormGroup,
	Input,
	Label,
	Modal,
	ModalBody,
	ModalHeader,
	Row,
} from "reactstrap";
import { RouteComponentProps } from "react-router-dom";

interface ICustomerContactModalProps extends RouteComponentProps {
	isOpen: boolean;
	toggle: () => void;
	contactToEdit?: ICustomerContact;
	updateCustomerProfile: () => void;
}

interface ICustomerContactModalState {
	editingContact: boolean;
	contact: ICustomerContact;
	formValid: boolean;
	invalidFields: string[];
	isAlertOpen: boolean;
	alertMessage?: string;
	alertColor?: string;
}

export default class CustomerContactModal extends React.Component<
	ICustomerContactModalProps,
	ICustomerContactModalState
> {
	static contextType = UserContext;
	context!: React.ContextType<typeof UserContext>;

	constructor(props: ICustomerContactModalProps) {
		super(props);
		this.state = {
			editingContact: false,
			contact: {},
			formValid: false,
			invalidFields: [],
			isAlertOpen: false,
		};
	}

	modalDidOpen = () => {
		const query = new URLSearchParams(this.props.location.search);
		if (this.props.contactToEdit) {
			// updating contact record
			this.setState(
				{
					editingContact: true,
					contact: this.props.contactToEdit,
				},
				() => this.validateInput()
			);
		} else if (
			query.get("customer") &&
			!this.props.contactToEdit &&
			this.context.user.isEmployee
		) {
			// adding contact record
			this.setState(
				{
					contact: { customerId: Number(query.get("customer")) },
				},
				() => this.validateInput()
			);
		}
	};

	modalDidClose = () => {
		this.setState({
			editingContact: false,
			contact: {},
			formValid: false,
			invalidFields: [],
			isAlertOpen: false,
		});
	};

	addContact = () => {
		fetch(`${process.env.REACT_APP_API_SERVER}/customer/contact/add`, {
			method: "POST",
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.context.token}`,
			}),
			body: JSON.stringify({
				contact: this.state.contact,
			}),
		})
			.then((res) => {
				if (res.status !== 201) {
					if (res.status === 409) {
						this.setState({
							isAlertOpen: true,
							alertColor: "danger",
							alertMessage: "Email address already in use.",
						});
					}
				}
				return res.json();
			})
			.then((data) => {
				if ("error" in data) {
					return; // handled above
				} else {
					this.props.updateCustomerProfile();
					this.props.toggle();
				}
			});
	};

	editContact = () => {
		fetch(`${process.env.REACT_APP_API_SERVER}/customer/contact/update`, {
			method: "PUT",
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.context.token}`,
			}),
			body: JSON.stringify({
				contact: this.state.contact,
			}),
		})
			.then((res) => {
				if (res.status !== 200) {
					if (res.status === 409) {
						this.setState({
							isAlertOpen: true,
							alertColor: "danger",
							alertMessage: "Email address already in use.",
						});
					}
				}
				return res.json();
			})
			.then((data) => {
				if ("error" in data) {
					return; // handled above
				} else {
					this.props.updateCustomerProfile();
					this.props.toggle();
				}
			});
	};

	deleteContact = () => {
		fetch(`${process.env.REACT_APP_API_SERVER}/customer/contact/delete`, {
			method: "DELETE",
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.context.token}`,
			}),
			body: JSON.stringify({
				contact: this.state.contact,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				this.props.updateCustomerProfile();
				this.props.toggle();
			});
	};

	handleSubmit = (event: BaseSyntheticEvent) => {
		event.preventDefault();
		if (this.state.formValid) {
			this.submitInput();
		} else {
			this.setState({
				isAlertOpen: true,
				alertColor: "danger",
				alertMessage: "Unable to add contact. Check your enteries below",
			});
		}
	};

	submitInput = () => {
		if (this.state.editingContact) {
			this.editContact();
		} else {
			this.addContact();
		}
	};

	handleInputChange = (event: BaseSyntheticEvent) => {
		switch (event.target.name) {
			case "name":
				this.setState(
					{
						contact: {
							id: this.state.contact.id,
							customerId: this.state.contact.customerId,
							name: event.target.value,
							email: this.state.contact.email,
							phoneNumber: this.state.contact.phoneNumber,
						},
					},
					() => this.validateInput()
				);
				break;
			case "email":
				this.setState(
					{
						contact: {
							id: this.state.contact.id,
							customerId: this.state.contact.customerId,
							name: this.state.contact.name,
							email: event.target.value,
							phoneNumber: this.state.contact.phoneNumber,
						},
					},
					() => this.validateInput()
				);
				break;
			case "phoneNumber":
				this.setState(
					{
						contact: {
							id: this.state.contact.id,
							customerId: this.state.contact.customerId,
							name: this.state.contact.name,
							email: this.state.contact.email,
							phoneNumber: event.target.value,
						},
					},
					() => this.validateInput()
				);
				break;

			default:
				break;
		}
	};

	validateInput = () => {
		const invalidFields: string[] = [];
		if (!this.state.contact.name) invalidFields.push("name");
		if (
			!this.state.contact.email?.match(
				/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/
			)
		)
			invalidFields.push("email");
		if (
			!this.state.contact.phoneNumber?.match(
				/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
			)
		)
			invalidFields.push("phoneNumber");

		if (invalidFields.length > 0) {
			this.setState({
				formValid: false,
				invalidFields: invalidFields,
			});
		} else {
			this.setState({
				formValid: true,
				invalidFields: [],
			});
		}
	};

	render() {
		return (
			<Modal
				isOpen={this.props.isOpen}
				toggle={this.props.toggle}
				onOpened={this.modalDidOpen}
				onClosed={this.modalDidClose}
			>
				<ModalHeader toggle={this.props.toggle}>
					{this.state.editingContact ? "Edit Contact" : "Add Contact"}
				</ModalHeader>
				<ModalBody>
					<Alert isOpen={this.state.isAlertOpen} color={this.state.alertColor}>
						{this.state.alertMessage}
					</Alert>
					<Form onSubmit={this.handleSubmit}>
						<Row form>
							<Col>
								<FormGroup>
									<Label htmlFor="name">Contact Name</Label>
									<Input
										type="text"
										name="name"
										id="name"
										value={this.state.contact.name}
										invalid={this.state.invalidFields.includes("name")}
										valid={!this.state.invalidFields.includes("name")}
										onChange={this.handleInputChange}
									/>
								</FormGroup>
								<FormGroup>
									<Label htmlFor="email">Contact Email</Label>
									<Input
										type="text"
										name="email"
										id="email"
										value={this.state.contact.email}
										invalid={this.state.invalidFields.includes("email")}
										valid={!this.state.invalidFields.includes("email")}
										onChange={this.handleInputChange}
									/>
								</FormGroup>
								<FormGroup>
									<Label htmlFor="phone-number">Contact Number</Label>
									<Input
										type="text"
										name="phoneNumber"
										id="phone-number"
										value={this.state.contact.phoneNumber}
										invalid={this.state.invalidFields.includes("phoneNumber")}
										valid={!this.state.invalidFields.includes("phoneNumber")}
										onChange={this.handleInputChange}
									/>
								</FormGroup>
							</Col>
						</Row>
						<Row>
							<Col>
								<Button type="submit" color="warning">
									{this.state.editingContact ? "Edit Contact" : "Add Contact"}
								</Button>
							</Col>
							{this.state.editingContact && (
								<Col>
									<Button
										type="button"
										color="danger"
										onClick={this.deleteContact}
									>
										Delete Contact
									</Button>
								</Col>
							)}
						</Row>
					</Form>
				</ModalBody>
			</Modal>
		);
	}
}
