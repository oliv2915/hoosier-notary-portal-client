import * as React from "react";
import {
	Col,
	Form,
	Input,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Row,
	Button,
	FormFeedback,
	Alert,
} from "reactstrap";
import UserContext from "../../context/UserContext";
import { IUserContextUser } from "../../interfaces";

interface IEditUserModalProps {
	isOpen: boolean;
	toggle: () => void;
}

interface IEditUserModalState {
	isOpen: boolean;
	user: IEditInfoUser;
	invalidFields: string[];
	formValid: boolean;
	isAlertOpen: boolean;
	alertMessage?: string;
	alertColor?: string;
}

interface IEditInfoUser extends IUserContextUser {
	password?: string;
	confirmPassword?: string;
}

export default class EditUserModal extends React.Component<
	IEditUserModalProps,
	IEditUserModalState
> {
	static contextType = UserContext;
	context!: React.ContextType<typeof UserContext>;
	constructor(props: IEditUserModalProps) {
		super(props);
		this.state = {
			user: {},
			isOpen: false,
			invalidFields: [],
			formValid: false,
			isAlertOpen: false,
		};
	}

	modalDidOpen = () => {
		this.setState(
			{
				user: this.context.user,
				isAlertOpen: true,
				alertColor: "info",
				alertMessage:
					"Password is required to save changes. This will change your password. Password must be a minimum of 8 characters long, have 1 lower and upper case letter, and have 1 number and special character",
			},
			() => this.validateFormFields()
		);
	};

	modalDidExit = () => {
		this.setState(
			{
				user: {},
				isAlertOpen: true,
				alertColor: "info",
				alertMessage:
					"Password is required to save changes. This will change your password. Password must be a minimum of 8 characters long, have 1 lower and upper case letter, and have 1 number and special character",
			},
			() => this.validateFormFields()
		);
	};

	handleSubmit = (event: React.BaseSyntheticEvent) => {
		event.preventDefault();
		this.validateFormFields();
		if (this.state.formValid) {
			this.submitUpdate();
		} else {
			this.setState({
				isAlertOpen: true,
				alertMessage: "Please check your enteries below",
				alertColor: "danger",
			});
		}
	};

	submitUpdate = () => {
		fetch(`${process.env.REACT_APP_API_SERVER}/user/update`, {
			method: "PUT",
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.context.token}`,
			}),
			body: JSON.stringify({
				user: this.state.user,
			}),
		})
			.then((res) => {
				if (res.status !== 200) {
					if (res.status === 409) {
						return this.setState({
							isAlertOpen: true,
							alertMessage: "Email already in use",
							alertColor: "danger",
						});
					}
				}
				// res is ok
				return res.json();
			})
			.then((data) => {
				if (data) {
					this.context.updateUserContext();
					this.props.toggle();
				}
			});
	};

	handleInputChange = (event: React.BaseSyntheticEvent) => {
		// update the state that has a change to it
		switch (event.target.name) {
			case "firstName":
				this.setState(
					{
						user: {
							firstName: event.target.value,
							middleName: this.state.user.middleName,
							lastName: this.state.user.lastName,
							suffix: this.state.user.suffix,
							phoneNumber: this.state.user.phoneNumber,
							email: this.state.user.email,
							password: this.state.user.password,
							confirmPassword: this.state.user.confirmPassword,
							isNotary: this.state.user.isNotary,
							isActiveNotary: this.state.user.isActiveNotary,
							isEmployee: this.state.user.isEmployee,
							isActiveEmployee: this.state.user.isActiveEmployee,
							isSuper: this.state.user.isSuper,
						},
					},
					() => this.validateFormFields()
				);
				break;
			case "middleName":
				this.setState(
					{
						user: {
							firstName: this.state.user.firstName,
							middleName: event.target.value,
							lastName: this.state.user.lastName,
							suffix: this.state.user.suffix,
							phoneNumber: this.state.user.phoneNumber,
							email: this.state.user.email,
							password: this.state.user.password,
							confirmPassword: this.state.user.confirmPassword,
							isNotary: this.state.user.isNotary,
							isActiveNotary: this.state.user.isActiveNotary,
							isEmployee: this.state.user.isEmployee,
							isActiveEmployee: this.state.user.isActiveEmployee,
							isSuper: this.state.user.isSuper,
						},
					},
					() => this.validateFormFields()
				);
				break;
			case "lastName":
				this.setState(
					{
						user: {
							firstName: this.state.user.firstName,
							middleName: this.state.user.middleName,
							lastName: event.target.value,
							suffix: this.state.user.suffix,
							phoneNumber: this.state.user.phoneNumber,
							email: this.state.user.email,
							password: this.state.user.password,
							confirmPassword: this.state.user.confirmPassword,
							isNotary: this.state.user.isNotary,
							isActiveNotary: this.state.user.isActiveNotary,
							isEmployee: this.state.user.isEmployee,
							isActiveEmployee: this.state.user.isActiveEmployee,
							isSuper: this.state.user.isSuper,
						},
					},
					() => this.validateFormFields()
				);
				break;
			case "suffix":
				this.setState(
					{
						user: {
							firstName: this.state.user.firstName,
							middleName: this.state.user.middleName,
							lastName: this.state.user.lastName,
							suffix: event.target.value,
							phoneNumber: this.state.user.phoneNumber,
							email: this.state.user.email,
							password: this.state.user.password,
							confirmPassword: this.state.user.confirmPassword,
							isNotary: this.state.user.isNotary,
							isActiveNotary: this.state.user.isActiveNotary,
							isEmployee: this.state.user.isEmployee,
							isActiveEmployee: this.state.user.isActiveEmployee,
							isSuper: this.state.user.isSuper,
						},
					},
					() => this.validateFormFields()
				);
				break;
			case "phoneNumber":
				this.setState(
					{
						user: {
							firstName: this.state.user.firstName,
							middleName: this.state.user.middleName,
							lastName: this.state.user.lastName,
							suffix: this.state.user.suffix,
							phoneNumber: event.target.value,
							email: this.state.user.email,
							password: this.state.user.password,
							confirmPassword: this.state.user.confirmPassword,
							isNotary: this.state.user.isNotary,
							isActiveNotary: this.state.user.isActiveNotary,
							isEmployee: this.state.user.isEmployee,
							isActiveEmployee: this.state.user.isActiveEmployee,
							isSuper: this.state.user.isSuper,
						},
					},
					() => this.validateFormFields()
				);
				break;
			case "email":
				this.setState(
					{
						user: {
							firstName: this.state.user.firstName,
							middleName: this.state.user.middleName,
							lastName: this.state.user.lastName,
							suffix: this.state.user.suffix,
							phoneNumber: this.state.user.phoneNumber,
							email: event.target.value,
							password: this.state.user.password,
							confirmPassword: this.state.user.confirmPassword,
							isNotary: this.state.user.isNotary,
							isActiveNotary: this.state.user.isActiveNotary,
							isEmployee: this.state.user.isEmployee,
							isActiveEmployee: this.state.user.isActiveEmployee,
							isSuper: this.state.user.isSuper,
						},
					},
					() => this.validateFormFields()
				);
				break;
			case "password":
				this.setState(
					{
						user: {
							firstName: this.state.user.firstName,
							middleName: this.state.user.middleName,
							lastName: this.state.user.lastName,
							suffix: this.state.user.suffix,
							phoneNumber: this.state.user.phoneNumber,
							email: this.state.user.email,
							password: event.target.value,
							confirmPassword: this.state.user.confirmPassword,
							isNotary: this.state.user.isNotary,
							isActiveNotary: this.state.user.isActiveNotary,
							isEmployee: this.state.user.isEmployee,
							isActiveEmployee: this.state.user.isActiveEmployee,
							isSuper: this.state.user.isSuper,
						},
					},
					() => this.validateFormFields()
				);
				break;
			case "confirmPassword":
				this.setState(
					{
						user: {
							firstName: this.state.user.firstName,
							middleName: this.state.user.middleName,
							lastName: this.state.user.lastName,
							suffix: this.state.user.suffix,
							phoneNumber: this.state.user.phoneNumber,
							email: this.state.user.email,
							password: this.state.user.password,
							confirmPassword: event.target.value,
							isNotary: this.state.user.isNotary,
							isActiveNotary: this.state.user.isActiveNotary,
							isEmployee: this.state.user.isEmployee,
							isActiveEmployee: this.state.user.isActiveEmployee,
							isSuper: this.state.user.isSuper,
						},
					},
					() => this.validateFormFields()
				);
				break;
			case "activeNotary":
				this.setState(
					{
						user: {
							firstName: this.state.user.firstName,
							middleName: this.state.user.middleName,
							lastName: this.state.user.lastName,
							suffix: this.state.user.suffix,
							phoneNumber: this.state.user.phoneNumber,
							email: this.state.user.email,
							password: this.state.user.password,
							confirmPassword: this.state.user.confirmPassword,
							isNotary: this.state.user.isNotary,
							isActiveNotary: event.target.value === "true" ? true : false,
							isEmployee: this.state.user.isEmployee,
							isActiveEmployee: this.state.user.isActiveEmployee,
							isSuper: this.state.user.isSuper,
						},
					},
					() => this.validateFormFields()
				);
				break;
			case "activeEmployee":
				this.setState(
					{
						user: {
							firstName: this.state.user.firstName,
							middleName: this.state.user.middleName,
							lastName: this.state.user.lastName,
							suffix: this.state.user.suffix,
							phoneNumber: this.state.user.phoneNumber,
							email: this.state.user.email,
							password: this.state.user.password,
							confirmPassword: this.state.user.confirmPassword,
							isNotary: this.state.user.isNotary,
							isActiveNotary: this.state.user.isActiveNotary,
							isEmployee: this.state.user.isEmployee,
							isActiveEmployee: event.target.value === "true" ? true : false,
							isSuper: this.state.user.isSuper,
						},
					},
					() => this.validateFormFields()
				);
				break;
			case "superEmployee":
				this.setState(
					{
						user: {
							firstName: this.state.user.firstName,
							middleName: this.state.user.middleName,
							lastName: this.state.user.lastName,
							suffix: this.state.user.suffix,
							phoneNumber: this.state.user.phoneNumber,
							email: this.state.user.email,
							password: this.state.user.password,
							confirmPassword: this.state.user.confirmPassword,
							isNotary: this.state.user.isNotary,
							isActiveNotary: this.state.user.isActiveNotary,
							isEmployee: this.state.user.isEmployee,
							isActiveEmployee: this.state.user.isActiveEmployee,
							isSuper: event.target.value === "true" ? true : false,
						},
					},
					() => this.validateFormFields()
				);
				break;
			default:
				break;
		}
	};

	validateFormFields = () => {
		const invalidFields: string[] = [];
		if (!this.state.user.firstName) invalidFields.push("firstName");
		if (!this.state.user.lastName) invalidFields.push("lastName");
		if (
			!this.state.user.phoneNumber?.match(
				/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
			)
		)
			invalidFields.push("phoneNumber");
		if (
			!this.state.user.email?.match(
				/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/
			)
		)
			invalidFields.push("email");
		if (
			!this.state.user.password?.match(
				/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/
			)
		)
			invalidFields.push("password");
		if (
			this.state.user.password !== this.state.user.confirmPassword ||
			!this.state.user.confirmPassword
		)
			invalidFields.push("noMatch");
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
				onClosed={this.modalDidExit}
				size="lg"
			>
				<ModalHeader toggle={this.props.toggle}>Edit Info</ModalHeader>
				<ModalBody>
					<Alert color={this.state.alertColor} isOpen={this.state.isAlertOpen}>
						{this.state.alertMessage}
					</Alert>
					<Form>
						<Row form className="mb-3">
							<Col>
								<Input
									invalid={this.state.invalidFields.includes("firstName")}
									valid={!this.state.invalidFields.includes("firstName")}
									type="text"
									name="firstName"
									value={this.state.user.firstName}
									placeholder="First name"
									onChange={this.handleInputChange}
								/>
								<FormFeedback>Required</FormFeedback>
							</Col>
							<Col>
								<Input
									valid
									type="text"
									name="middleName"
									value={
										this.state.user.middleName ? this.state.user.middleName : ""
									}
									placeholder="Middle Name"
									onChange={this.handleInputChange}
								/>
							</Col>
							<Col>
								<Input
									invalid={this.state.invalidFields.includes("lastName")}
									valid={!this.state.invalidFields.includes("lastName")}
									type="text"
									name="lastName"
									value={this.state.user.lastName}
									placeholder="Last Name"
									onChange={this.handleInputChange}
								/>
								<FormFeedback>Required</FormFeedback>
							</Col>
							<Col>
								<Input
									valid
									type="text"
									name="suffix"
									value={this.state.user.suffix ? this.state.user.suffix : ""}
									placeholder="Suffix"
									onChange={this.handleInputChange}
								/>
							</Col>
						</Row>
						<Row form className="mb-3">
							<Col>
								<Input
									invalid={this.state.invalidFields.includes("email")}
									valid={!this.state.invalidFields.includes("email")}
									type="text"
									name="email"
									value={this.state.user.email}
									placeholder="Email Address"
									onChange={this.handleInputChange}
								/>
								<FormFeedback>Required</FormFeedback>
							</Col>
							<Col>
								<Input
									invalid={this.state.invalidFields.includes("phoneNumber")}
									valid={!this.state.invalidFields.includes("phoneNumber")}
									type="text"
									name="phoneNumber"
									value={this.state.user.phoneNumber}
									placeholder="Phone Number"
									onChange={this.handleInputChange}
								/>
								<FormFeedback>Required</FormFeedback>
							</Col>
						</Row>
						<Row form>
							<Col>
								<Input
									invalid={this.state.invalidFields.includes("password")}
									valid={!this.state.invalidFields.includes("password")}
									value={this.state.user.password}
									type="password"
									name="password"
									placeholder="Password"
									onChange={this.handleInputChange}
								/>
								<FormFeedback>Required</FormFeedback>
							</Col>
							<Col>
								<Input
									invalid={this.state.invalidFields.includes("noMatch")}
									valid={!this.state.invalidFields.includes("noMatch")}
									value={this.state.user.confirmPassword}
									type="password"
									name="confirmPassword"
									placeholder="Confirm Password"
									onChange={this.handleInputChange}
								/>
								<FormFeedback>Passwords don't match </FormFeedback>
							</Col>
						</Row>
					</Form>
				</ModalBody>
				<ModalFooter>
					<Button color="warning" type="submit" onClick={this.handleSubmit}>
						Save Changes
					</Button>
				</ModalFooter>
			</Modal>
		);
	}
}
