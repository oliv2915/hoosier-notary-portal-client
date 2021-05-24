import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Card, CardHeader, CardBody, Label, Button } from "reactstrap";
import UserContext from "../../context/UserContext";
import { IUserContextUser } from "../../interfaces";
import UserModal from "./UserModal";

interface IProfileUserCardProps extends RouteComponentProps {
	user: IUserContextUser;
	updateProfile: () => void;
}
interface IProfileUserCardState {
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
			isEditInfoModalOpen: false,
		};
	}

	toggleEditInfoModal = () => {
		this.setState({
			isEditInfoModalOpen: !this.state.isEditInfoModalOpen,
		});
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
								{`${this.props.user.firstName} ${
									this.props.user.middleName ? this.props.user.middleName : ""
								} ${this.props.user.lastName} ${
									this.props.user.suffix ? this.props.user.suffix : ""
								}`}
							</Label>
						</div>
						<div>
							<Label>
								<b>Phone Number:</b> {this.props.user.phoneNumber}
							</Label>
						</div>
						<div>
							<Label>
								<b>Email Address:</b> {this.props.user.email}
							</Label>
						</div>
						<div hidden={this.props.user.isEmployee}>
							<Label>
								<b>Notary Status:</b>{" "}
								{this.props.user.isActiveNotary ? "Active" : "In-Active"}
							</Label>
						</div>
						<Button color="info" size="sm" onClick={this.toggleEditInfoModal}>
							Edit Info
						</Button>
					</CardBody>
				</Card>
				{/* Edit User */}
				<UserModal
					userProfile={this.props.user}
					updateProfile={this.props.updateProfile}
					isOpen={this.state.isEditInfoModalOpen}
					toggle={this.toggleEditInfoModal}
					history={this.props.history}
					location={this.props.location}
					match={this.props.match}
				/>
			</>
		);
	}
}
