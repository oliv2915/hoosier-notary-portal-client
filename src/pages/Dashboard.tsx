import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Card, CardBody, CardHeader, Row, Col, Table } from "reactstrap";
import UserContext from "../context/UserContext";
import { IUserContextUser, IAssignment } from "../interfaces";

interface IDashboardProps extends RouteComponentProps {}
interface IDashboardState {
	assignments: IAssignment[] | undefined;
	notaries: IUserContextUser[] | undefined;
}

export default class Dashboard extends React.Component<
	IDashboardProps,
	IDashboardState
> {
	static contextType = UserContext;
	context!: React.ContextType<typeof UserContext>;
	constructor(props: IDashboardProps) {
		super(props);
		this.state = {
			assignments: undefined,
			notaries: undefined,
		};
	}

	componentDidMount() {
		if (this.context.user.isNotary) {
			this.fetchAssignments();
		} else if (this.context.user.isEmployee) {
			// fetch assignments
			this.fetchAssignments();
			this.fetchNotaries();
		}
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

	fetchNotaries = () => {
		fetch(`${process.env.REACT_APP_API_SERVER}/user/notaries`, {
			method: "GET",
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.context.token}`,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				this.setState({
					notaries: data.notaries,
				});
			});
	};

	render() {
		// if not auth, redirect to login page
		if (!this.context.isAuth) this.props.history.push("/");
		return (
			<Row className="mt-3">
				<Col>
					<Card>
						<CardHeader>Assignments</CardHeader>
						<CardBody>
							<Table>
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
											<tr key={idx}>
												<td>{assignment.type}</td>
												<td>{assignment.status}</td>
												<td>{assignment.dueDate}</td>
											</tr>
										);
									})}
								</tbody>
							</Table>
						</CardBody>
					</Card>
				</Col>
				{this.context.user.isEmployee ? (
					<Col>
						<Card>
							<CardHeader>Notaries Pending Approval</CardHeader>
							<CardBody>
								<Table>
									<thead>
										<tr>
											<th>Notary Name</th>
											<th>Notary Status</th>
										</tr>
									</thead>
									<tbody>
										{this.state.notaries?.map((notary, idx) => {
											return (
												<tr key={idx}>
													<td>{`${notary.firstName} ${notary.lastName}`}</td>
													<td>
														{notary.isActiveNotary ? "Active" : "In-Active"}
													</td>
												</tr>
											);
										})}
									</tbody>
								</Table>
							</CardBody>
						</Card>
					</Col>
				) : null}
			</Row>
		);
	}
}
