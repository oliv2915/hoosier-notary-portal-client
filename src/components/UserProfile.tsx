import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
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

	componentDidMount() {
		if (!this.context.isAuth) this.props.history.push("/");
	}

	componentDidUpdate() {
		if (!this.context.isAuth) this.props.history.push("/");
	}

	render() {
		return (
			<div>
				<h1>Profile</h1>
			</div>
		);
	}
}
