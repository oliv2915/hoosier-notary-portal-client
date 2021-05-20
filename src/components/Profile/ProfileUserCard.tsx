import React from "react";
import { Card, CardHeader, CardBody, Label, Button } from "reactstrap";
import UserContext from "../../context/UserContext";
import { IUserContextUser } from "../../interfaces";
import EditUserModal from "../Modals/EditUserModal";

interface IProfileUserCardProps {}
interface IProfileUserCardState {
	isEditInfoModalOpen: boolean;
	user: IUserContextUser;
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
			user: {},
		};
	}

	componentDidMount() {
		this.setState({
			user: this.context.user,
		});
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
				<EditUserModal
					isOpen={this.state.isEditInfoModalOpen}
					toggle={this.toggleEditInfoModal}
				/>
			</>
		);
	}
}
