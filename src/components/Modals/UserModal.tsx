import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
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
	Label,
} from "reactstrap";
import UserContext from "../../context/UserContext";
import { IUserContextUser } from "../../interfaces";

interface IUserModalProps extends RouteComponentProps {
	isOpen: boolean;
	toggle: () => void;
	userProfile: IUserContextUser;
	updateProfile: () => void;
}

interface IUserModalState {
	isOpen: boolean;
	user: IEditInfoUser;
	editingNotary: boolean;
	editingEmployee: boolean;
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

export default class UserModal extends React.Component<
	IUserModalProps,
	IUserModalState
> {
	static contextType = UserContext;
	context!: React.ContextType<typeof UserContext>;
	constructor(props: IUserModalProps) {
		super(props);
		this.state = {
			user: {},
			editingNotary: false,
			editingEmployee: false,
			isOpen: false,
			invalidFields: [],
			formValid: false,
			isAlertOpen: false,
		};
	}

	modalDidOpen = () => {
		if (
			this.props.userProfile.isEmployee &&
			this.context.user.isEmployee &&
			!this.context.user.isSuper
		) {
			this.props.history.push("/dashboard");
			this.props.toggle();
		} else if (this.props.userProfile.id === this.context.user.id) {
			// updating own record
			this.setState(
				{
					user: this.props.userProfile,
					isAlertOpen: true,
					alertColor: "info",
					alertMessage:
						"Password is required to save changes. This will change your password. Password must be a minimum of 8 characters long, have 1 lower and upper case letter, and have 1 number and special character",
				},
				() => this.validateInput()
			);
		} else if (
			this.props.userProfile.isNotary &&
			this.context.user.isEmployee
		) {
			// employee updating a notary record
			this.setState(
				{
					editingNotary: true,
					user: this.props.userProfile,
				},
				() => this.validateInput()
			);
		} else if (this.props.userProfile.isEmployee && this.context.user.isSuper) {
			// super updating employee record
			this.setState(
				{
					editingEmployee: true,
					user: this.props.userProfile,
				},
				() => this.validateInput()
			);
		}
	};

	modalDidExit = () => {
		this.setState(
			{
				user: {},
				invalidFields: [],
				editingNotary: false,
				editingEmployee: false,
				isAlertOpen: false,
				alertColor: undefined,
				alertMessage: undefined,
			},
			() => this.validateInput()
		);
	};

	handleSubmit = (event: React.BaseSyntheticEvent) => {
		event.preventDefault();
		if (this.state.formValid) {
			this.editUser();
			// console.log(this.state);
		} else {
			this.setState({
				isAlertOpen: true,
				alertMessage: "Please check your enteries below",
				alertColor: "danger",
			});
		}
	};

	editUser = () => {
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
					this.props.updateProfile();
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
							id: this.state.user.id,
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
					() => this.validateInput()
				);
				break;
			case "middleName":
				this.setState(
					{
						user: {
							id: this.state.user.id,
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
					() => this.validateInput()
				);
				break;
			case "lastName":
				this.setState(
					{
						user: {
							id: this.state.user.id,
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
					() => this.validateInput()
				);
				break;
			case "suffix":
				this.setState(
					{
						user: {
							id: this.state.user.id,
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
					() => this.validateInput()
				);
				break;
			case "phoneNumber":
				this.setState(
					{
						user: {
							id: this.state.user.id,
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
					() => this.validateInput()
				);
				break;
			case "email":
				this.setState(
					{
						user: {
							id: this.state.user.id,
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
					() => this.validateInput()
				);
				break;
			case "password":
				this.setState(
					{
						user: {
							id: this.state.user.id,
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
					() => this.validateInput()
				);
				break;
			case "confirmPassword":
				this.setState(
					{
						user: {
							id: this.state.user.id,
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
					() => this.validateInput()
				);
				break;
			case "activeNotary":
				this.setState(
					{
						user: {
							id: this.state.user.id,
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
					() => this.validateInput()
				);
				break;
			case "activeEmployee":
				this.setState(
					{
						user: {
							id: this.state.user.id,
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
					() => this.validateInput()
				);
				break;
			case "superEmployee":
				this.setState(
					{
						user: {
							id: this.state.user.id,
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
					() => this.validateInput()
				);
				break;
			default:
				break;
		}
	};

	validateInput = () => {
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
		if (this.props.userProfile.id === this.context.user.id) {
			//if id's match, updating own record, password check is required
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
								<Label htmlFor="first-name">First Name</Label>
								<Input
									invalid={this.state.invalidFields.includes("firstName")}
									valid={!this.state.invalidFields.includes("firstName")}
									type="text"
									name="firstName"
									id="first-name"
									value={this.state.user.firstName}
									placeholder="First name"
									onChange={this.handleInputChange}
								/>
								<FormFeedback>Required</FormFeedback>
							</Col>
							<Col>
								<Label htmlFor="middle-name">Middle Name</Label>
								<Input
									valid
									type="text"
									name="middleName"
									id="middle-name"
									value={
										this.state.user.middleName ? this.state.user.middleName : ""
									}
									placeholder="Middle Name"
									onChange={this.handleInputChange}
								/>
							</Col>
							<Col>
								<Label htmlFor="last-name">Last Name</Label>
								<Input
									invalid={this.state.invalidFields.includes("lastName")}
									valid={!this.state.invalidFields.includes("lastName")}
									type="text"
									name="lastName"
									id="last-name"
									value={this.state.user.lastName}
									placeholder="Last Name"
									onChange={this.handleInputChange}
								/>
								<FormFeedback>Required</FormFeedback>
							</Col>
							<Col>
								<Label htmlFor="suffix">Suffix</Label>
								<Input
									valid
									type="text"
									name="suffix"
									id="suffix"
									value={this.state.user.suffix ? this.state.user.suffix : ""}
									placeholder="Suffix"
									onChange={this.handleInputChange}
								/>
							</Col>
						</Row>
						<Row form className="mb-3">
							<Col>
								<Label htmlFor="email">Email Address</Label>
								<Input
									invalid={this.state.invalidFields.includes("email")}
									valid={!this.state.invalidFields.includes("email")}
									type="text"
									name="email"
									id="email"
									value={this.state.user.email}
									placeholder="Email Address"
									onChange={this.handleInputChange}
								/>
								<FormFeedback>Required</FormFeedback>
							</Col>
							<Col>
								<Label htmlFor="phone-number">Phone Number</Label>
								<Input
									invalid={this.state.invalidFields.includes("phoneNumber")}
									valid={!this.state.invalidFields.includes("phoneNumber")}
									type="text"
									name="phoneNumber"
									id="phone-number"
									value={this.state.user.phoneNumber}
									placeholder="Phone Number"
									onChange={this.handleInputChange}
								/>
								<FormFeedback>Required</FormFeedback>
							</Col>
						</Row>
						{/* If id's match, updating own record, show password fields */}
						{this.props.userProfile.id === this.context.user.id && (
							<>
								<Row form>
									<Col>
										<Label htmlFor="password">Password</Label>
										<Input
											invalid={this.state.invalidFields.includes("password")}
											valid={!this.state.invalidFields.includes("password")}
											value={this.state.user.password}
											type="password"
											name="password"
											id="password"
											placeholder="Password"
											onChange={this.handleInputChange}
										/>
										<FormFeedback>Required</FormFeedback>
									</Col>
									<Col>
										<Label htmlFor="confirm-password">Confirm Password</Label>
										<Input
											invalid={this.state.invalidFields.includes("noMatch")}
											valid={!this.state.invalidFields.includes("noMatch")}
											value={this.state.user.confirmPassword}
											type="password"
											name="confirmPassword"
											id="confirm-password"
											placeholder="Confirm Password"
											onChange={this.handleInputChange}
										/>
										<FormFeedback>Passwords don't match </FormFeedback>
									</Col>
								</Row>
							</>
						)}
						<Row form>
							{/*if contextUser is employee and props.user is notary, show notary status flag*/}
							{this.props.userProfile.isNotary && this.context.user.isEmployee && (
								<Col>
									<Label htmlFor="notary-status">Notary Status</Label>
									<Input
										type="select"
										value={this.state.user.isActiveNotary ? "true" : "false"}
										name="activeNotary"
										id="notary-status"
										onChange={this.handleInputChange}
									>
										<option value="true">Active</option>
										<option value="false">In-Active</option>
									</Input>
								</Col>
							)}
							{/* show  employee flags only if the employee is a super*/}
							{this.props.userProfile.isEmployee && this.context.user.isSuper && (
								<>
									<Col>
										<Label htmlFor="employee-status">Employee Status</Label>
										<Input
											type="select"
											value={
												this.state.user.isActiveEmployee ? "true" : "false"
											}
											name="activeEmployee"
											id="employee-status"
											onChange={this.handleInputChange}
										>
											<option value="true">Active</option>
											<option value="false">In-Active</option>
										</Input>
									</Col>
									<Col>
										<Label htmlFor="super-status">Supervisor Status</Label>
										<Input
											type="select"
											value={this.state.user.isSuper ? "true" : "false"}
											id="super-status"
											name="superEmployee"
											onChange={this.handleInputChange}
										>
											<option value="true">Active</option>
											<option value="false">In-Active</option>
										</Input>
									</Col>
								</>
							)}
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
