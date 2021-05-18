import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Col,
	Label,
	Row,
} from "reactstrap";
import EditUserInfo from "../components/EditUserInfo";
import UserContext from "../context/UserContext";

interface IUserProfileProps extends RouteComponentProps {}

interface IUserProfileState {
	isEditInfoModalOpen: boolean;
}

export default class UserProfile extends React.Component<
	IUserProfileProps,
	IUserProfileState
> {
	static contextType = UserContext;
	constructor(props: IUserProfileProps) {
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
		// if not auth, redirect to home (login)
		if (!this.context.isAuth) this.props.history.push("/");
		return (
			<div>
				<Row className="mt-3">
					<Col md="4" className="mb-3">
						<Card>
							<CardHeader>Basic Info</CardHeader>
							<CardBody className="basic-info-card-body">
								<div>
									<Label>
										<b>Name:</b>{" "}
										{`${this.context.user.firstName} ${
											this.context.user.middleName
												? this.context.user.middleName
												: ""
										} ${this.context.user.lastName} ${
											this.context.user.suffix ? this.context.user.suffix : ""
										}`}
									</Label>
								</div>
								<div>
									<Label>
										<b>Phone Number:</b> {this.context.user.phoneNumber}
									</Label>
								</div>
								<div>
									<Label>
										<b>Email Address:</b> {this.context.user.email}
									</Label>
								</div>
								<Button
									color="info"
									size="sm"
									onClick={this.toggleEditInfoModal}
								>
									Edit Info
								</Button>
							</CardBody>
						</Card>
					</Col>
					<Col md="4" className="mb-3">
						<Card>
							<CardHeader>Address Info</CardHeader>
						</Card>
					</Col>
					<Col md="4" className="mb-3">
						<Card>
							<CardHeader>Credential Info</CardHeader>
						</Card>
					</Col>
				</Row>
				<EditUserInfo
					isOpen={this.state.isEditInfoModalOpen}
					toggle={this.toggleEditInfoModal}
				/>
			</div>
		);
	}
}
