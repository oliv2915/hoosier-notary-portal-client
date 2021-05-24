import React from "react";
import { RouteComponentProps } from "react-router-dom";
import {
	Card,
	CardHeader,
	CardBody,
	Label,
	Button,
	Row,
	Col,
} from "reactstrap";
import UserContext from "../../context/UserContext";
import { IUserContextUser } from "../../interfaces";
import UserModal from "./UserModal";

interface IUserCardProps extends RouteComponentProps {
	user: IUserContextUser;
	updateProfile: () => void;
}
interface IUserCardState {
	isEditInfoModalOpen: boolean;
}

export default class UserCard extends React.Component<
	IUserCardProps,
	IUserCardState
> {
	static contextType = UserContext;
	context!: React.ContextType<typeof UserContext>;
	constructor(props: IUserCardProps) {
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
		const query = new URLSearchParams(this.props.location.search);
		return (
			<>
				<Card>
					<CardHeader>
						{query.get("assignment") ? (
							<span>Notary Details </span>
						) : (
							<span>User Details </span>
						)}
						<Button
							color="info"
							size="sm"
							onClick={this.toggleEditInfoModal}
							hidden={query.get("assignment") ? true : false}
						>
							Update Profile
						</Button>
					</CardHeader>
					{this.props.user.id && (
						<CardBody className="user-info-card-body">
							<Row>
								<Col>
									<div>
										<Label>
											<b>Name:</b>
										</Label>
										<p>{`${this.props.user.firstName} ${
											this.props.user.middleName
												? this.props.user.middleName
												: ""
										} ${this.props.user.lastName} ${
											this.props.user.suffix ? this.props.user.suffix : ""
										}`}</p>
									</div>
									<div>
										<Label>
											<b>Email Address:</b>
										</Label>
										<p>{this.props.user.email}</p>
									</div>
								</Col>
								<Col>
									<div>
										<Label>
											<b>Phone Number:</b>
										</Label>
										<p>{this.props.user.phoneNumber}</p>
									</div>
									<div hidden={this.props.user.isEmployee}>
										<Label>
											<b>Notary Status:</b>
										</Label>
										<p>
											{this.props.user.isActiveNotary ? "Active" : "In-Active"}
										</p>
									</div>
								</Col>
							</Row>
						</CardBody>
					)}
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
