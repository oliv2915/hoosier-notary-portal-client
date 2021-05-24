import React, { BaseSyntheticEvent } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Card, CardHeader, CardBody, Table } from "reactstrap";
import UserContext from "../../context/UserContext";
import { IAssignment } from "../../interfaces";

interface IAssignmentsCardProps extends RouteComponentProps {}

interface IAssignmentsCardState {
	assignments: IAssignment[];
}

export default class AssignmentsCard extends React.Component<
	IAssignmentsCardProps,
	IAssignmentsCardState
> {
	static contextType = UserContext;
	context!: React.ContextType<typeof UserContext>;
	constructor(props: IAssignmentsCardProps) {
		super(props);
		this.state = {
			assignments: [],
		};
	}

	componentDidMount() {
		this.fetchAssignments();
	}

	fetchAssignments = () => {
		fetch(`${process.env.REACT_APP_API_SERVER}/assignment/all`, {
			method: "GET",
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.context.token}`,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				this.setState({
					assignments: data.assignments,
				});
			});
	};

	assignmentRowClicked = (event: BaseSyntheticEvent) => {
		const assignmentId = event.currentTarget.id;
		this.props.history.push(`/assignment?assignment=${assignmentId}`);
	};

	convertDueDate = (dueDate: string | undefined) => {
		if (dueDate) {
			return new Date(dueDate).toLocaleString();
		} else {
			return "";
		}
	};

	render() {
		return (
			<Card>
				<CardHeader>Assignments</CardHeader>
				<CardBody>
					<Table size="sm" borderless hover responsive>
						<thead>
							<tr>
								<th>Assignment Type</th>
								<th>Assignment Status</th>
								<th>Meeting Time</th>
							</tr>
						</thead>
						<tbody>
							{this.state.assignments?.map((assignment, idx) => {
								return (
									<tr
										key={idx}
										id={`${assignment.id}`}
										onClick={this.assignmentRowClicked}
										style={{ cursor: "pointer" }}
									>
										<td>{assignment.type}</td>
										<td>{assignment.status}</td>
										<td>{this.convertDueDate(assignment.dueDate)}</td>
									</tr>
								);
							})}
						</tbody>
					</Table>
				</CardBody>
			</Card>
		);
	}
}
