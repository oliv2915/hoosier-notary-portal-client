import React from "react";
import { IAssignment } from "../../interfaces";
import { Card, CardBody, CardHeader, Col, Label, Row } from "reactstrap";

interface IAssignmentCardProps {
	assignment: IAssignment;
}

const AssignmentCard = (props: IAssignmentCardProps) => {
	return (
		<Card>
			<CardHeader>Assignment Details</CardHeader>
			<CardBody className="assignment-card-body">
				<Row>
					<Col md={12}>
						<div>
							<Label>
								<b>Signing Date</b>
							</Label>
							<p>{props.assignment.dueDate}</p>
						</div>
						<div>
							<Label>
								<b>Meeting Location</b>
							</Label>
							<p>{props.assignment.meetingAddress}</p>
						</div>
					</Col>
					<Col md={6}>
						<div>
							<Label>
								<b>Assignment Status</b>
							</Label>
							<p>{props.assignment.status}</p>
						</div>
						<div>
							<Label>
								<b>Signer Name</b>
							</Label>
							<p>{props.assignment.contactName}</p>
						</div>
						<div>
							<Label>
								<b>Signer Email</b>
							</Label>
							<p>{props.assignment.contactEmail}</p>
						</div>
					</Col>
					<Col md={6}>
						<div>
							<Label>
								<b>File Number</b>
							</Label>
							<p>{props.assignment.fileNumber}</p>
						</div>
						<div>
							<Label>
								<b>Contact Phone</b>
							</Label>
							<p>{props.assignment.contactPhoneNumber}</p>
						</div>
						<div>
							<Label>
								<b>Pay Rate</b>
							</Label>
							<p>{`$${props.assignment.rate}`}</p>
						</div>
					</Col>
					<Col md={12}></Col>
				</Row>
			</CardBody>
		</Card>
	);
};

export default AssignmentCard;
