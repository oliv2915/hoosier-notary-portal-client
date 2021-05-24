import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Col, Row } from "reactstrap";

import UserContext from "../context/UserContext";
import AddressesCard from "../components/Address/AddressesCard";
import CredentialCard from "../components/User/CredentialCard";
import UserCard from "../components/User/UserCard";
import NavBar from "../components/NavBar";
import { IAddress, ICommission, IUserContextUser } from "../interfaces";

interface IUserProfileProps extends RouteComponentProps {}

interface IUserProfileState {
	user: IUserContextUser;
	addresses: IAddress[];
	credentials: ICommission[];
	fetchURL: string;
}

export default class UserProfile extends React.Component<
	IUserProfileProps,
	IUserProfileState
> {
	static contextType = UserContext;
	context!: React.ContextType<typeof UserContext>;
	constructor(props: IUserProfileProps) {
		super(props);
		this.state = {
			user: {},
			addresses: [],
			credentials: [],
			fetchURL: "",
		};
	}

	componentDidMount() {
		const query = new URLSearchParams(this.props.location.search);

		if (!query.get("user")) {
			// pull own record
			this.setState(
				{
					fetchURL: `${process.env.REACT_APP_API_SERVER}/user/profile`,
				},
				() => this.fetchUserProfile()
			);
		} else if (query.get("user") && this.context.user.isEmployee) {
			// employe accessing another user profile
			this.setState(
				{
					fetchURL: `${
						process.env.REACT_APP_API_SERVER
					}/user/profile?id=${query.get("user")}`,
				},
				() => this.fetchUserProfile()
			);
		}
	}

	fetchUserProfile = () => {
		fetch(this.state.fetchURL, {
			method: "GET",
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.context.token}`,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				this.setState({
					user: data.user,
					addresses: data.addresses,
					credentials: data.commissions,
				});
			});
	};

	render() {
		// if not auth, redirect to home (login)
		if (!this.context.isAuth) this.props.history.push("/");
		return (
			<>
				<NavBar
					history={this.props.history}
					location={this.props.location}
					match={this.props.match}
				/>

				<Row className="mt-3">
					<Col md="4" className="mb-3">
						<UserCard
							user={this.state.user}
							updateProfile={this.fetchUserProfile}
							history={this.props.history}
							location={this.props.location}
							match={this.props.match}
						/>
					</Col>
					{this.state.user.isNotary && (
						<>
							<Col md="4" className="mb-3">
								<AddressesCard
									addresses={this.state.addresses}
									updateAddressTable={this.fetchUserProfile}
									history={this.props.history}
									location={this.props.location}
									match={this.props.match}
								/>
							</Col>
							<Col md="4" className="mb-3">
								<CredentialCard
									credentials={this.state.credentials}
									updateProfile={this.fetchUserProfile}
									history={this.props.history}
									location={this.props.location}
									match={this.props.match}
								/>
							</Col>
						</>
					)}
				</Row>
			</>
		);
	}
}
