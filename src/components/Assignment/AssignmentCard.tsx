import React from "react";
import { IAssignment } from "../../interfaces";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Col,
	Label,
	Row,
} from "reactstrap";
import UserContext from "../../context/UserContext";
import AssignmentModal from "./AssignmentModal";
import { RouteComponentProps } from "react-router-dom";

interface IAssignmentCardProps extends RouteComponentProps {
	assignment: IAssignment;
	updateAssignment?: () => void;
}

interface IAssignmentCardState {
	isEditAssignmentModalOpen: boolean;
}

export default class AssignmentCard extends React.Component<
	IAssignmentCardProps,
	IAssignmentCardState
> {
	static contextType = UserContext;
	context!: React.ContextType<typeof UserContext>;
	constructor(props: IAssignmentCardProps) {
		super(props);
		this.state = {
			isEditAssignmentModalOpen: false,
		};
	}

	toggleEditAssignmentModal = () => {
		this.setState({
			isEditAssignmentModalOpen: !this.state.isEditAssignmentModalOpen,
		});
	};

	convertDueDate = (dueDate: string | undefined) => {
		if (dueDate) {
			return new Date(dueDate).toLocaleString();
		} else {
			return "";
		}
	};

	acceptAssignment = () => {
		fetch(`${process.env.REACT_APP_API_SERVER}/assignment/update`, {
			method: "PUT",
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.context.token}`,
			}),
			body: JSON.stringify({
				assignment: {
					id: this.props.assignment.id,
					customerId: this.props.assignment.customerId,
					userId: this.context.user.id,
					status: "Notary Confirmed",
				},
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				if (this.props.updateAssignment) {
					this.props.updateAssignment();
				}
			});
	};

	render() {
		return (
			<Card>
				<CardHeader>
					<span>Assignment Details </span>
					<Button
						type="button"
						color="info"
						size="sm"
						hidden={this.context.user.isNotary}
						onClick={this.toggleEditAssignmentModal}
					>
						Update Assignment
					</Button>
					<Button
						type="button"
						color="info"
						size="sm"
						hidden={
							!this.context.user.isActiveNotary || this.props.assignment.userId
								? true
								: false
						}
						onClick={this.acceptAssignment}
					>
						Accept Assignment
					</Button>
				</CardHeader>
				<CardBody className="assignment-card-body">
					<Row>
						<Col md={12}>
							<div>
								<Label>
									<b>Signing Date</b>
								</Label>
								<p>
									{this.convertDueDate(
										this.props.assignment.dueDate?.toString()
									)}
								</p>
							</div>
							<div>
								<Label>
									<b>Meeting Location</b>
								</Label>
								<p>{this.props.assignment.meetingAddress}</p>
							</div>
						</Col>
						<Col md={6}>
							<div>
								<Label>
									<b>Assignment Status</b>
								</Label>
								<p>{this.props.assignment.status}</p>
							</div>
							<div>
								<Label>
									<b>Signer Name</b>
								</Label>
								<p>{this.props.assignment.contactName}</p>
							</div>
							<div>
								<Label>
									<b>Signer Email</b>
								</Label>
								<p>{this.props.assignment.contactEmail}</p>
							</div>
						</Col>
						<Col md={6}>
							<div>
								<Label>
									<b>File Number</b>
								</Label>
								<p>{this.props.assignment.fileNumber}</p>
							</div>
							<div>
								<Label>
									<b>Contact Phone</b>
								</Label>
								<p>{this.props.assignment.contactPhoneNumber}</p>
							</div>
							<div>
								<Label>
									<b>Pay Rate</b>
								</Label>
								<p>{`$${this.props.assignment.rate}`}</p>
							</div>
						</Col>
						<Col md={12}></Col>
					</Row>
				</CardBody>
				{/* update assignment */}
				<AssignmentModal
					isOpen={this.state.isEditAssignmentModalOpen}
					toggle={this.toggleEditAssignmentModal}
					assignmentToEdit={this.props.assignment}
					updateAssignment={this.props.updateAssignment}
					history={this.props.history}
					location={this.props.location}
					match={this.props.match}
				/>
			</Card>
		);
	}
}
