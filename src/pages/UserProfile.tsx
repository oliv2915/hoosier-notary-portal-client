import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, Label, Row } from "reactstrap";
import UserContext from "../context/UserContext";

interface IUserProfileProps extends RouteComponentProps {}

interface IUserProfileState {
	user: IUserProfile;
}

interface IUserProfile {}

export default class UserProfile extends React.Component<
	IUserProfileProps,
	IUserProfileState
> {
	static contextType = UserContext;
	constructor(props: IUserProfileProps) {
		super(props);
		this.state = {
			user: {},
		};
	}

	render() {
		// if not auth, redirect to home (login)
		if (!this.context.isAuth) this.props.history.push("/");
		// userContext data
		const { firstName, middleName, lastName, suffix, email, phoneNumber } =
			this.context.user;
		return (
			<Row className="mt-3">
				<Col md="4">
					<Card>
						<CardHeader>Basic Info</CardHeader>
						<CardBody>
							<Label>
								<b>Name:</b>{" "}
								{`${firstName} ${middleName ? middleName : ""} ${lastName} ${
									suffix ? suffix : ""
								}`}
							</Label>
							<Label>
								<b>Phone Number:</b> {phoneNumber}
							</Label>
							<Label>
								<b>Email Address:</b> {email}
							</Label>
						</CardBody>
					</Card>
				</Col>
				<Col md="4">
					<Card>
						<CardHeader>Address Info</CardHeader>
					</Card>
				</Col>
				<Col md="4">
					<Card>
						<CardHeader>Credential Info</CardHeader>
					</Card>
				</Col>
			</Row>
		);
	}
}
