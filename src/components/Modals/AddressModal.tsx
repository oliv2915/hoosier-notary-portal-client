import * as React from "react";
import { RouteComponentProps } from "react-router";
import {
	Alert,
	Button,
	Col,
	Form,
	FormFeedback,
	FormGroup,
	Input,
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
}

interface IAddressModalState {
	address: IAddress;
	customers: ICustomer[];
	formValid: boolean;
	invalidFields: string[];
	isAlertOpen: boolean;
	alertMessage?: string;
	alertColor?: string;
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
		};
	}

	modalDidOpen = () => {
		this.validateInput();
		if (this.context.user.isEmployee) {
			fetch(`${process.env.REACT_APP_API_SERVER}/customer/all`, {
				method: "GET",
				headers: new Headers({
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.context.token}`,
				}),
			})
				.then((res) => res.json())
				.then((data) => {
					console.log(data);
					this.setState({
						customers: data.customers,
					});
				});
			this.validateInput();
		} else {
			this.setState({
				address: { userId: this.context.user.id },
			});
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
		});
	};

	handleInputChange = (event: React.BaseSyntheticEvent) => {
		switch (event.target.name) {
			case "customerId":
				if (this.context.user.isEmployee) {
					this.setState(
						{
							address: {
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
				}
				break;
			case "streetOne":
				this.setState(
					{
						address: {
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

	submitInput = () => {
		if (this.context.user.isEmployee) {
		} else {
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
							alertColor: "danger",
							alertMessage: "Unable to add address. Check the fields below",
						});
					}
					return res.json();
				})
				.then((data) => {
					if ("error" in data) {
						return; // handled above
					} else {
						this.props.toggle();
					}
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
				<ModalHeader toggle={this.props.toggle}>Add Address</ModalHeader>
				<ModalBody>
					<Alert isOpen={this.state.isAlertOpen} color={this.state.alertColor}>
						{this.state.alertMessage}
					</Alert>
					<Form onSubmit={this.handleSubmit}>
						<Row form>
							<Col hidden={this.context.user.isNotary}>
								<FormGroup>
									<Input
										type="select"
										name="customerId"
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
									<Input
										type="text"
										name="streetOne"
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
									<Input
										type="text"
										name="streetTwo"
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
									<Input
										type="text"
										name="city"
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
									<Input
										type="text"
										name="state"
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
									<Input
										type="text"
										name="zipCode"
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
									<Input
										type="text"
										name="type"
										value={this.state.address.type}
										placeholder="Address Type"
										invalid={this.state.invalidFields.includes("type")}
										valid={!this.state.invalidFields.includes("type")}
										onChange={this.handleInputChange}
									/>
									<FormFeedback>Required</FormFeedback>
								</FormGroup>
							</Col>
						</Row>
						<Button type="submit" color="warning">
							Add Address
						</Button>
					</Form>
				</ModalBody>
			</Modal>
		);
	}
}
