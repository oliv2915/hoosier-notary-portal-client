import * as React from "react";
import {
	Alert,
	Button,
	Col,
	Form,
	FormFeedback,
	FormGroup,
	Input,
	Label,
	Modal,
	ModalBody,
	ModalHeader,
	Row,
} from "reactstrap";
import UserContext from "../../context/UserContext";
import { IAddress, ICustomer } from "../../interfaces";

interface IAddressModalProps {
	isOpen: boolean;
	toggle: () => void;
	updateAddressTable: () => void;
	addressToEdit?: IAddress;
}

interface IAddressModalState {
	address: IAddress;
	customers: ICustomer[];
	formValid: boolean;
	invalidFields: string[];
	isAlertOpen: boolean;
	alertMessage?: string;
	alertColor?: string;
	editingAddress: boolean;
}

export default class AddressModal extends React.Component<
	IAddressModalProps,
	IAddressModalState
> {
	static contextType = UserContext;
	context!: React.ContextType<typeof UserContext>;
	constructor(props: IAddressModalProps) {
		super(props);
		this.state = {
			address: {},
			customers: [],
			formValid: false,
			invalidFields: [],
			isAlertOpen: false,
			editingAddress: false,
		};
	}

	modalDidOpen = () => {
		// editing an address
		if (this.props.addressToEdit) {
			this.setState(
				{
					address: this.props.addressToEdit,
					editingAddress: true,
				},
				() => this.validateInput()
			);
		} else {
			// adding an address for customers and notaries
			if (this.context.user.isEmployee) {
				// adding customer address
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
				this.validateInput();
			} else {
				// adding notary address
				this.setState(
					{
						address: { userId: this.context.user.id },
					},
					() => this.validateInput()
				);
			}
		}
	};

	modalDidClose = () => {
		this.setState({
			address: {},
			customers: [],
			formValid: false,
			invalidFields: [],
			isAlertOpen: false,
			alertColor: undefined,
			alertMessage: undefined,
			editingAddress: false,
		});
	};

	handleInputChange = (event: React.BaseSyntheticEvent) => {
		switch (event.target.name) {
			case "customerId":
				if (this.context.user.isEmployee) {
					this.setState(
						{
							address: {
								id: this.state.address.id,
								userId: this.state.address.userId,
								customerId: event.target.value,
								streetOne: this.state.address.streetOne,
								streetTwo: this.state.address.streetTwo,
								city: this.state.address.city,
								state: this.state.address.state,
								zipCode: this.state.address.zipCode,
								type: this.state.address.type,
							},
						},
						() => this.validateInput()
					);
				}
				break;
			case "streetOne":
				this.setState(
					{
						address: {
							id: this.state.address.id,
							userId: this.state.address.userId,
							customerId: this.state.address.customerId,
							streetOne: event.target.value,
							streetTwo: this.state.address.streetTwo,
							city: this.state.address.city,
							state: this.state.address.state,
							zipCode: this.state.address.zipCode,
							type: this.state.address.type,
						},
					},
					() => this.validateInput()
				);
				break;
			case "streetTwo":
				this.setState(
					{
						address: {
							id: this.state.address.id,
							userId: this.state.address.userId,
							customerId: this.state.address.customerId,
							streetOne: this.state.address.streetOne,
							streetTwo: event.target.value,
							city: this.state.address.city,
							state: this.state.address.state,
							zipCode: this.state.address.zipCode,
							type: this.state.address.type,
						},
					},
					() => this.validateInput()
				);
				break;
			case "city":
				this.setState(
					{
						address: {
							id: this.state.address.id,
							userId: this.state.address.userId,
							customerId: this.state.address.customerId,
							streetOne: this.state.address.streetOne,
							streetTwo: this.state.address.streetTwo,
							city: event.target.value,
							state: this.state.address.state,
							zipCode: this.state.address.zipCode,
							type: this.state.address.type,
						},
					},
					() => this.validateInput()
				);
				break;
			case "state":
				this.setState(
					{
						address: {
							id: this.state.address.id,
							userId: this.state.address.userId,
							customerId: this.state.address.customerId,
							streetOne: this.state.address.streetOne,
							streetTwo: this.state.address.streetTwo,
							city: this.state.address.city,
							state: event.target.value,
							zipCode: this.state.address.zipCode,
							type: this.state.address.type,
						},
					},
					() => this.validateInput()
				);
				break;
			case "zipCode":
				this.setState(
					{
						address: {
							id: this.state.address.id,
							userId: this.state.address.userId,
							customerId: this.state.address.customerId,
							streetOne: this.state.address.streetOne,
							streetTwo: this.state.address.streetTwo,
							city: this.state.address.city,
							state: this.state.address.state,
							zipCode: event.target.value,
							type: this.state.address.type,
						},
					},
					() => this.validateInput()
				);
				break;
			case "type":
				this.setState(
					{
						address: {
							id: this.state.address.id,
							userId: this.state.address.userId,
							customerId: this.state.address.customerId,
							streetOne: this.state.address.streetOne,
							streetTwo: this.state.address.streetTwo,
							city: this.state.address.city,
							state: this.state.address.state,
							zipCode: this.state.address.zipCode,
							type: event.target.value,
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
		if (!this.state.address.streetOne) invalidFields.push("streetOne");
		if (!this.state.address.city) invalidFields.push("city");
		if (!this.state.address.state) invalidFields.push("state");
		if (!this.state.address.zipCode) invalidFields.push("zipCode");
		if (!this.state.address.type) invalidFields.push("type");

		if (this.context.user.isEmployee) {
			if (!this.state.address.customerId) invalidFields.push("customerId");
		}

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

	handleSubmit = (event: React.BaseSyntheticEvent) => {
		event.preventDefault();
		this.validateInput();
		if (this.state.formValid) {
			this.submitInput();
		} else {
			this.setState({
				isAlertOpen: true,
				alertColor: "danger",
				alertMessage: "Unable to add address. Check the fields below",
			});
		}
	};

	addAddress = () => {
		// adding an address
		if (this.context.user.isEmployee) {
			// employee adding a customer address
		} else {
			// notary adding own address
			fetch(`${process.env.REACT_APP_API_SERVER}/address/add`, {
				method: "POST",
				headers: new Headers({
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.context.token}`,
				}),
				body: JSON.stringify({
					address: this.state.address,
				}),
			})
				.then((res) => {
					if (res.status !== 201) {
						this.setState({
							isAlertOpen: true,
							alertColor: "info",
							alertMessage: "Unable to add address. Check your enteries",
						});
					}
					return res.json();
				})
				.then((data) => {
					if ("error" in data) {
						return; // handled above
					} else {
						this.props.updateAddressTable();
						this.props.toggle();
					}
				});
		}
	};

	editAddress = () => {
		console.log(this.state.address);
		// submit update to server
		if (this.context.user.isEmployee) {
			// employee editing a customer address
		} else {
			// notary editing own address
			fetch(`${process.env.REACT_APP_API_SERVER}/address/update`, {
				method: "PUT",
				headers: new Headers({
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.context.token}`,
				}),
				body: JSON.stringify({
					address: this.state.address,
				}),
			})
				.then((res) => {
					if (res.status !== 200) {
						this.setState({
							isAlertOpen: true,
							alertColor: "info",
							alertMessage: "Unable to edit address. Check your enteries",
						});
					}
					return res.json();
				})
				.then((data) => {
					if ("error" in data) {
						return; // handled above
					} else {
						this.props.updateAddressTable();
						this.props.toggle();
					}
				});
		}
	};

	deleteAddress = () => {
		fetch(`${process.env.REACT_APP_API_SERVER}/address/delete`, {
			method: "DELETE",
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.context.token}`,
			}),
			body: JSON.stringify({
				address: this.state.address,
			}),
		})
			.then((res) => {
				if (res.status !== 200) {
					this.setState({
						isAlertOpen: true,
						alertColor: "info",
						alertMessage: "Unable to remove this address",
					});
				}
				return res.json();
			})
			.then((data) => {
				this.props.updateAddressTable();
				this.props.toggle();
			});
	};

	submitInput = () => {
		if (this.state.editingAddress) {
			this.editAddress();
		} else {
			this.addAddress();
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
					{this.props.addressToEdit ? "Edit Address" : "Add Address"}
				</ModalHeader>
				<ModalBody>
					<Alert isOpen={this.state.isAlertOpen} color={this.state.alertColor}>
						{this.state.alertMessage}
					</Alert>
					<Form onSubmit={this.handleSubmit}>
						<Row form>
							<Col hidden={this.context.user.isNotary}>
								<FormGroup>
									<Label htmlFor="customers">Customers</Label>
									<Input
										type="select"
										name="customerId"
										id="customers"
										valid={!this.state.invalidFields.includes("customerId")}
										invalid={this.state.invalidFields.includes("customerId")}
									>
										<option value={0}>Pick One</option>
										{this.state.customers.map((customer, idx) => {
											return (
												<option key={idx} value={customer.id}>
													{customer.name}
												</option>
											);
										})}
									</Input>
									<FormFeedback>Required</FormFeedback>
								</FormGroup>
							</Col>
							<Col>
								<FormGroup>
									<Label htmlFor="street-one">Street Address</Label>
									<Input
										type="text"
										name="streetOne"
										id="street-one"
										placeholder="Street One"
										value={this.state.address.streetOne}
										invalid={this.state.invalidFields.includes("streetOne")}
										valid={!this.state.invalidFields.includes("streetOne")}
										onChange={this.handleInputChange}
									/>
									<FormFeedback>Required</FormFeedback>
								</FormGroup>
							</Col>
							<Col>
								<FormGroup>
									<Label htmlFor="street-two">Suite/Unit/Apartment</Label>
									<Input
										type="text"
										name="streetTwo"
										id="street-two"
										value={this.state.address.streetTwo}
										placeholder="Street Two"
										onChange={this.handleInputChange}
										valid
									/>
									<FormFeedback valid>Optional</FormFeedback>
								</FormGroup>
							</Col>
						</Row>
						<Row form>
							<Col>
								<FormGroup>
									<Label htmlFor="city">City</Label>
									<Input
										type="text"
										name="city"
										id="city"
										value={this.state.address.city}
										placeholder="City"
										invalid={this.state.invalidFields.includes("city")}
										valid={!this.state.invalidFields.includes("city")}
										onChange={this.handleInputChange}
									/>
									<FormFeedback>Required</FormFeedback>
								</FormGroup>
							</Col>
							<Col>
								<FormGroup>
									<Label htmlFor="state">State</Label>
									<Input
										type="text"
										name="state"
										id="state"
										value={this.state.address.state}
										placeholder="State"
										invalid={this.state.invalidFields.includes("state")}
										valid={!this.state.invalidFields.includes("state")}
										onChange={this.handleInputChange}
									/>
									<FormFeedback>Required</FormFeedback>
								</FormGroup>
							</Col>
						</Row>
						<Row form>
							<Col>
								<FormGroup>
									<Label htmlFor="zipcode">Zip Code</Label>
									<Input
										type="text"
										name="zipCode"
										id="zipcode"
										value={this.state.address.zipCode}
										placeholder="Zip Code"
										invalid={this.state.invalidFields.includes("zipCode")}
										valid={!this.state.invalidFields.includes("zipCode")}
										onChange={this.handleInputChange}
									/>
									<FormFeedback>Required</FormFeedback>
								</FormGroup>
							</Col>
							<Col>
								<FormGroup>
									<Label htmlFor="type">Address Type</Label>
									<Input
										type="select"
										name="type"
										id="type"
										value={this.state.address.type}
										invalid={this.state.invalidFields.includes("type")}
										valid={!this.state.invalidFields.includes("type")}
										onChange={this.handleInputChange}
									>
										<option value={0}>Pick One</option>
										<option value="Mailing">Mailing</option>
										<option value="Billing">Billing</option>
										<option value="Shipping">Shipping</option>
									</Input>
									<FormFeedback>Required</FormFeedback>
								</FormGroup>
							</Col>
						</Row>
						<Row>
							<Col>
								<Button type="submit" color="warning">
									{this.props.addressToEdit ? "Edit Address" : "Add Address"}
								</Button>
							</Col>
							{this.props.addressToEdit && (
								<Col>
									<Button
										type="button"
										color="danger"
										onClick={this.deleteAddress}
									>
										Delete Address
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
