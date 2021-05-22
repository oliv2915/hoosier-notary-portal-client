import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Card, CardHeader, CardBody, Label, Button } from "reactstrap";
import UserContext from "../../context/UserContext";
import { IUserContextUser } from "../../interfaces";
import UserModal from "../Modals/UserModal";

interface IProfileUserCardProps extends RouteComponentProps {}
interface IProfileUserCardState {
	user: IUserContextUser;
	isEditInfoModalOpen: boolean;
}

export default class ProfileUserCard extends React.Component<
	IProfileUserCardProps,
	IProfileUserCardState
> {
	static contextType = UserContext;
	context!: React.ContextType<typeof UserContext>;
	constructor(props: IProfileUserCardProps) {
		super(props);
		this.state = {
			user: {},
			isEditInfoModalOpen: false,
		};
	}

	componentDidMount() {
		const query = new URLSearchParams(this.props.location.search);
		if (query.get("user") && this.context.user.isEmployee) {
			this.setState(
				{
					user: { id: Number(query.get("user")) },
				},
				() => this.fetchUserRecord()
			);
		} else {
			this.props.history.push("/profile");
			this.setState({
				user: this.context.user,
			});
		}
	}

	toggleEditInfoModal = () => {
		this.setState({
			isEditInfoModalOpen: !this.state.isEditInfoModalOpen,
		});
	};

	fetchUserRecord = () => {
		fetch(
			`${process.env.REACT_APP_API_SERVER}/user/profile?id=${this.state.user.id}`,
			{
				method: "GET",
				headers: new Headers({
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.context.token}`,
				}),
			}
		)
			.then((res) => res.json())
			.then((data) =>
				this.setState({
					user: data.user,
				})
			);
	};

	updateProfile = () => {
		this.fetchUserRecord();
	};

	render() {
		return (
			<>
				<Card>
					<CardHeader>Basic Info</CardHeader>
					<CardBody className="basic-info-card-body">
						<div>
							<Label>
								<b>Name:</b>{" "}
								{`${this.state.user.firstName} ${
									this.state.user.middleName ? this.state.user.middleName : ""
								} ${this.state.user.lastName} ${
									this.state.user.suffix ? this.state.user.suffix : ""
								}`}
							</Label>
						</div>
						<div>
							<Label>
								<b>Phone Number:</b> {this.state.user.phoneNumber}
							</Label>
						</div>
						<div>
							<Label>
								<b>Email Address:</b> {this.state.user.email}
							</Label>
						</div>
						<div hidden={this.state.user.isEmployee}>
							<Label>
								<b>Notary Status:</b>{" "}
								{this.state.user.isActiveNotary ? "Active" : "In-Active"}
							</Label>
						</div>
						<Button color="info" size="sm" onClick={this.toggleEditInfoModal}>
							Edit Info
						</Button>
					</CardBody>
				</Card>
				{/* Edit User */}
				<UserModal
					isOpen={this.state.isEditInfoModalOpen}
					toggle={this.toggleEditInfoModal}
					userProfile={this.state.user}
					updateProfile={this.updateProfile}
					history={this.props.history}
					location={this.props.location}
					match={this.props.match}
				/>
			</>
		);
	}
}
