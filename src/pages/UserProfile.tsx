import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Col, Row } from "reactstrap";

import UserContext from "../context/UserContext";
import ProfileAddressCard from "../components/Profile/ProfileAddressCard";
import ProfileCredentialCard from "../components/Profile/ProfileCredentialCard";
import ProfileUserCard from "../components/Profile/ProfileUserCard";

interface IUserProfileProps extends RouteComponentProps {}

interface IUserProfileState {}

export default class UserProfile extends React.Component<
	IUserProfileProps,
	IUserProfileState
> {
	static contextType = UserContext;
	context!: React.ContextType<typeof UserContext>;

	render() {
		// if not auth, redirect to home (login)
		if (!this.context.isAuth) this.props.history.push("/");
		return (
			<div>
				<Row className="mt-3">
					<Col md="4" className="mb-3">
						<ProfileUserCard />
					</Col>
					<Col md="4" className="mb-3" hidden={this.context.user.isEmployee}>
						<ProfileAddressCard
							history={this.props.history}
							location={this.props.location}
							match={this.props.match}
						/>
					</Col>
					<Col md="4" className="mb-3" hidden={this.context.user.isEmployee}>
						<ProfileCredentialCard
							history={this.props.history}
							location={this.props.location}
							match={this.props.match}
						/>
					</Col>
				</Row>
			</div>
		);
	}
}
