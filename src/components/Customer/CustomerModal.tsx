import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import {
	Col,
	Form,
	Input,
	Modal,
	ModalBody,
	ModalHeader,
	Row,
	Button,
	FormFeedback,
	Alert,
	FormGroup,
} from "reactstrap";
import UserContext from "../../context/UserContext";
import { ICustomer } from "../../interfaces";

interface ICustomerModalProps extends RouteComponentProps {
	isOpen: boolean;
	toggle: () => void;
	customerToEdit?: ICustomer;
	updateCustomerProfile?: () => void;
}

interface ICustomerModalState {
	customer: ICustomer;
	editingCustomer: boolean;
	formValid: boolean;
	invalidFields: string[];
	isAlertOpen: boolean;
	alertMessage?: string;
	alertColor?: string;
}

export default class CustomerModal extends React.Component<
	ICustomerModalProps,
	ICustomerModalState
> {
	static contextType = UserContext;
	context!: React.ContextType<typeof UserContext>;
	constructor(props: ICustomerModalProps) {
		super(props);
		this.state = {
			customer: {},
			editingCustomer: false,
			formValid: false,
			invalidFields: [],
			isAlertOpen: false,
		};
	}

	modalDidOpen = () => {
		if (this.props.customerToEdit) {
			this.setState(
				{
					editingCustomer: true,
					customer: this.props.customerToEdit,
				},
				() => this.validateInput()
			);
		} else {
			this.validateInput();
		}
	};

	modalDidClose = () => {
		this.setState({
			customer: {},
			editingCustomer: false,
			formValid: false,
			invalidFields: [],
			isAlertOpen: false,
			alertColor: undefined,
			alertMessage: undefined,
		});
	};

	handleInputChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		switch (event.target.name) {
			case "name":
				this.setState(
					{
						customer: {
							id: this.state.customer.id,
							name: event.target.value,
							phoneNumber: this.state.customer.phoneNumber,
							email: this.state.customer.email,
							customerType: this.state.customer.customerType,
							notes: this.state.customer.notes,
						},
					},
					() => this.validateInput()
				);
				break;
			case "phoneNumber":
				this.setState(
					{
						customer: {
							id: this.state.customer.id,
							name: this.state.customer.name,
							phoneNumber: event.target.value,
							email: this.state.customer.email,
							customerType: this.state.customer.customerType,
							notes: this.state.customer.notes,
						},
					},
					() => this.validateInput()
				);
				break;
			case "email":
				this.setState(
					{
						customer: {
							id: this.state.customer.id,
							name: this.state.customer.name,
							phoneNumber: this.state.customer.phoneNumber,
							email: event.target.value,
							customerType: this.state.customer.customerType,
							notes: this.state.customer.notes,
						},
					},
					() => this.validateInput()
				);
				break;
			case "customerType":
				this.setState(
					{
						customer: {
							id: this.state.customer.id,
							name: this.state.customer.name,
							phoneNumber: this.state.customer.phoneNumber,
							email: this.state.customer.email,
							customerType: event.target.value,
							notes: this.state.customer.notes,
						},
					},
					() => this.validateInput()
				);
				break;
			case "notes":
				this.setState(
					{
						customer: {
							id: this.state.customer.id,
							name: this.state.customer.name,
							phoneNumber: this.state.customer.phoneNumber,
							email: this.state.customer.email,
							customerType: this.state.customer.customerType,
							notes: event.target.value,
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

		if (!this.state.customer.name) invalidFields.push("name");
		if (
			!this.state.customer.phoneNumber?.match(
				/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
			)
		)
			invalidFields.push("phoneNumber");
		if (
			!this.state.customer.email?.match(
				/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/
			)
		)
			invalidFields.push("email");
		if (!this.state.customer.customerType) invalidFields.push("customerType");

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

	toggleAlert = () => {
		this.setState({
			isAlertOpen: !this.state.isAlertOpen,
		});
	};

	submitForm = (event: React.BaseSyntheticEvent) => {
		event.preventDefault();
		if (this.state.formValid && this.state.editingCustomer) {
			this.editCustomer();
		} else if (this.state.formValid) {
			this.addCustomer();
		}
	};

	addCustomer = () => {
		fetch(`${process.env.REACT_APP_API_SERVER}/customer/add`, {
			method: "POST",
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.context.token}`,
			}),
			body: JSON.stringify({
				customer: this.state.customer,
			}),
		})
			.then((res) => {
				if (res.status !== 201) {
					if (res.status === 409) {
						this.setState({
							isAlertOpen: true,
							alertColor: "danger",
							alertMessage: "Email address already in use",
						});
					}
				}
				return res.json();
			})
			.then((data) => {
				if ("error" in data) {
					return; // do nothing as this is handled when the res.status is checked
				} else {
					this.props.history.push(`/customer?customer=${data.customer.id}`);
					this.props.toggle();
				}
			});
	};

	editCustomer = () => {
		fetch(`${process.env.REACT_APP_API_SERVER}/customer/update`, {
			method: "PUT",
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.context.token}`,
			}),
			body: JSON.stringify({
				customer: this.state.customer,
			}),
		})
			.then((res) => {
				if (res.status !== 201) {
					if (res.status === 409) {
						this.setState({
							isAlertOpen: true,
							alertColor: "danger",
							alertMessage: "Email address already in use",
						});
					}
				}
				return res.json();
			})
			.then((data) => {
				if ("error" in data) {
					return; // do nothing as this is handled when the res.status is checked
				} else {
					this.props.updateCustomerProfile &&
						this.props.updateCustomerProfile();
					this.props.toggle();
				}
			});
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
					{this.state.editingCustomer ? "Update Customer" : "Add Customer"}
				</ModalHeader>
				<ModalBody>
					<Alert
						color={this.state.alertColor}
						isOpen={this.state.isAlertOpen}
						toggle={this.toggleAlert}
					>
						{this.state.alertMessage}
					</Alert>
					<Form onSubmit={this.submitForm}>
						<Row form>
							<Col>
								<FormGroup>
									<Input
										type="text"
										name="name"
										placeholder="Customer Name"
										className="mb-2"
										onChange={this.handleInputChange}
										value={this.state.customer.name}
										invalid={this.state.invalidFields.includes("name")}
										valid={!this.state.invalidFields.includes("name")}
									/>
									<FormFeedback>Required</FormFeedback>
								</FormGroup>
							</Col>
							<Col>
								<FormGroup>
									<Input
										type="text"
										name="phoneNumber"
										placeholder="Phone Number"
										className="mb-2"
										onChange={this.handleInputChange}
										value={this.state.customer.phoneNumber}
										invalid={this.state.invalidFields.includes("phoneNumber")}
										valid={!this.state.invalidFields.includes("phoneNumber")}
									/>
									<FormFeedback>Required</FormFeedback>
								</FormGroup>
							</Col>
						</Row>
						<Row form>
							<Col>
								<FormGroup>
									<Input
										type="text"
										name="email"
										placeholder="Email Address"
										className="mb-2"
										onChange={this.handleInputChange}
										value={this.state.customer.email}
										invalid={this.state.invalidFields.includes("email")}
										valid={!this.state.invalidFields.includes("email")}
									/>
									<FormFeedback>Required</FormFeedback>
								</FormGroup>
							</Col>
							<Col>
								<FormGroup>
									<Input
										type="select"
										name="customerType"
										placeholder="Customer Type"
										className="mb-2"
										onChange={this.handleInputChange}
										value={this.state.customer.customerType}
										invalid={this.state.invalidFields.includes("customerType")}
										valid={!this.state.invalidFields.includes("customerType")}
									>
										<option value={0}>Pick One</option>
										<option value="Title">Title</option>
										<option value="Closing Service">Closing Service</option>
										<option value="General Notary">General Notary</option>
									</Input>
									<FormFeedback>Required</FormFeedback>
								</FormGroup>
							</Col>
						</Row>
						<Row form>
							<Col>
								<FormGroup>
									<Input
										type="textarea"
										height="200"
										name="notes"
										placeholder="Customer Notes"
										className="mb-2"
										onChange={this.handleInputChange}
										value={this.state.customer.notes}
										valid
									/>
									<FormFeedback valid>Optional</FormFeedback>
								</FormGroup>
							</Col>
						</Row>
						<Button type="submit" color="warning">
							{this.state.editingCustomer ? "Update Customer" : "Add Customer"}
						</Button>
					</Form>
				</ModalBody>
			</Modal>
		);
	}
}
