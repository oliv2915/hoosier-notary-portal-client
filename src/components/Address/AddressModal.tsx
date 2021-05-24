import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
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
import { IAddress } from "../../interfaces";

interface IAddressModalProps extends RouteComponentProps {
	isOpen: boolean;
	toggle: () => void;
	updateAddressTable: () => void;
	addressToEdit?: IAddress;
}

interface IAddressModalState {
	address: IAddress;
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
			formValid: false,
			invalidFields: [],
			isAlertOpen: false,
			editingAddress: false,
		};
	}

	modalDidOpen = () => {
		const query = new URLSearchParams(this.props.location.search);

		if (this.props.addressToEdit) {
			// updating address, no matter the user
			this.setState(
				{
					editingAddress: true,
					address: this.props.addressToEdit,
				},
				() => this.validateInput()
			);
		} else if (
			query.get("customer") &&
			!this.props.addressToEdit &&
			this.context.user.isEmployee
		) {
			// employee adding a customer address
			this.setState(
				{
					address: { customerId: Number(query.get("customer")) },
				},
				() => this.validateInput()
			);
		} else if (this.context.user.isNotary) {
			// adding notary address
			this.setState(
				{
					address: { userId: this.context.user.id },
				},
				() => this.validateInput()
			);
		}
	};

	modalDidClose = () => {
		this.setState({
			address: {},
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
	};

	editAddress = () => {
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
		const query = new URLSearchParams(this.props.location.search);
		return (
			<Modal
				isOpen={this.props.isOpen}
				toggle={this.props.toggle}
				onOpened={this.modalDidOpen}
				onClosed={this.modalDidClose}
				size="lg"
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
							<Col>
								<FormGroup>
									<Label htmlFor="street-one">Street Address</Label>
									<Input
										type="text"
										name="streetOne"
										id="street-one"
										value={this.state.address.streetOne}
										invalid={this.state.invalidFields.includes("streetOne")}
										valid={!this.state.invalidFields.includes("streetOne")}
										onChange={this.handleInputChange}
										disabled={
											this.context.user.isEmployee && query.get("user")
												? true
												: false
										}
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
										onChange={this.handleInputChange}
										disabled={
											this.context.user.isEmployee && query.get("user")
												? true
												: false
										}
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
										invalid={this.state.invalidFields.includes("city")}
										valid={!this.state.invalidFields.includes("city")}
										onChange={this.handleInputChange}
										disabled={
											this.context.user.isEmployee && query.get("user")
												? true
												: false
										}
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
										invalid={this.state.invalidFields.includes("state")}
										valid={!this.state.invalidFields.includes("state")}
										onChange={this.handleInputChange}
										disabled={
											this.context.user.isEmployee && query.get("user")
												? true
												: false
										}
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
										invalid={this.state.invalidFields.includes("zipCode")}
										valid={!this.state.invalidFields.includes("zipCode")}
										onChange={this.handleInputChange}
										disabled={
											this.context.user.isEmployee && query.get("user")
												? true
												: false
										}
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
										disabled={
											this.context.user.isEmployee && query.get("user")
												? true
												: false
										}
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
								<Button
									type="submit"
									color="warning"
									disabled={
										this.context.user.isEmployee && query.get("user")
											? true
											: false
									}
								>
									{this.props.addressToEdit ? "Edit Address" : "Add Address"}
								</Button>
							</Col>
							{this.props.addressToEdit && (
								<Col>
									<Button
										type="button"
										color="danger"
										onClick={this.deleteAddress}
										disabled={
											this.context.user.isEmployee && query.get("user")
												? true
												: false
										}
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
