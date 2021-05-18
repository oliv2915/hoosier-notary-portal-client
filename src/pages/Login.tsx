import * as React from "react";
import Logo from "../assets/logo.svg";
import UserContext from "../context/UserContext";
import {
	Card,
	CardTitle,
	CardBody,
	Alert,
	Form,
	Row,
	Col,
	FormFeedback,
	Input,
	Button,
} from "reactstrap";
import { RouteComponentProps } from "react-router-dom";
import { IUserContextUser } from "../interfaces";

interface ILoginProps extends RouteComponentProps {}

interface ILoginState {
	user: ILoginUser;
	invalidFields: string[];
	formValid: boolean;
	isAlertOpen: boolean;
	alertMessage?: string;
	alertColor?: string;
}

interface ILoginUser extends IUserContextUser {
	password?: string | null;
}

export default class Login extends React.Component<ILoginProps, ILoginState> {
	static contextType = UserContext;
	constructor(props: ILoginProps) {
		super(props);
		this.state = {
			user: {},
			invalidFields: [],
			formValid: false,
			isAlertOpen: false,
		};
	}

	handleInputChange = (event: React.BaseSyntheticEvent) => {
		switch (event.target.name) {
			case "email":
				this.setState(
					{
						user: {
							email: event.target.value,
							password: this.state.user.password,
						},
					},
					() => this.validateFormInputs()
				);
				break;
			case "password":
				this.setState(
					{
						user: {
							email: this.state.user.email,
							password: event.target.value,
						},
					},
					() => this.validateFormInputs()
				);
				break;
			default:
				break;
		}
	};

	validateFormInputs = () => {
		const invalidFields: string[] = [];
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

	handleLoginSubmit = (event: React.BaseSyntheticEvent) => {
		event.preventDefault();
		this.validateFormInputs();
		// if form valid, submit data, else show a message
		if (this.state.formValid) {
			this.submitFormData();
		} else {
			this.setState(
				{
					alertMessage: "Please check your enteries below. Unable to Login",
					alertColor: "danger",
				},
				() => {
					if (!this.state.isAlertOpen) {
						return this.toggleAlert();
					}
				}
			);
		}
	};

	submitFormData = () => {
		fetch(`${process.env.REACT_APP_API_SERVER}/user/login`, {
			method: "POST",
			headers: new Headers({
				"Content-Type": "application/json",
			}),
			body: JSON.stringify({
				user: this.state.user,
			}),
		})
			.then((res) => {
				// check for a bad res
				if (res.status !== 200) {
					return this.setState(
						{
							alertMessage: "Invalid email or password used.",
							alertColor: "danger",
						},
						() => {
							if (!this.state.isAlertOpen) {
								return this.toggleAlert();
							}
						}
					);
				}

				// res is ok
				this.setState(
					{
						alertMessage: "Logged In Successfully",
						alertColor: "success",
					},
					() => {
						if (!this.state.isAlertOpen) {
							return this.toggleAlert();
						}
					}
				);
				return res.json();
			})
			.then((data) => {
				if (!data) return;
				if (data.token) this.context.setToken(data.token);
			});
	};

	componentDidMount() {
		this.validateFormInputs();
	}

	toggleAlert = () => {
		this.setState({
			isAlertOpen: !this.state.isAlertOpen,
		});
	};

	render() {
		// if user isAuth, push to Dashboard
		if (this.context.isAuth) this.props.history.push("/dashboard");
		return (
			<div className="d-flex justify-content-center mt-3">
				<Card style={{ width: "75%" }}>
					<CardTitle className="text-center">
						<h1>Login</h1>
					</CardTitle>
					<img src={Logo} alt="logo" style={{ width: "25%", margin: "auto" }} />
					<CardBody>
						<Alert
							color={this.state.alertColor}
							isOpen={this.state.isAlertOpen}
							toggle={this.toggleAlert}
						>
							{this.state.alertMessage}
						</Alert>
						<Form onSubmit={this.handleLoginSubmit}>
							<Row form className="mb-3">
								<Col>
									<Input
										invalid={this.state.invalidFields.includes("email")}
										valid={!this.state.invalidFields.includes("email")}
										type="email"
										name="email"
										placeholder="Email Address"
										onChange={this.handleInputChange}
									/>
									<FormFeedback>Required</FormFeedback>
								</Col>
								<Col>
									<Input
										invalid={this.state.invalidFields.includes("password")}
										valid={!this.state.invalidFields.includes("password")}
										type="password"
										name="password"
										placeholder="Password"
										onChange={this.handleInputChange}
									/>
									<FormFeedback>
										Required (Must be a minimum of 8 characters long, have 1
										lower and upper case letter, have 1 number and special
										character)
									</FormFeedback>
								</Col>
							</Row>
							<Button color="primary" type="submit">
								Login
							</Button>
						</Form>
					</CardBody>
				</Card>
			</div>
		);
	}
}
