import React from "react";
import { IUserContextUser, ICustomer, IAssignment } from "../interfaces";
import UserContext from "../context/UserContext";
import { RouteComponentProps } from "react-router-dom";
import AssignmentCard from "../components/Assignment/AssignmentCard";
import { Row, Col } from "reactstrap";
import CustomerCard from "../components/Customer/CustomerCard";
import NotaryCard from "../components/Assignment/NotaryCard";
import NavBar from "../components/NavBar";

interface IAssignmentProps extends RouteComponentProps {}

interface IAssignmentState {
	assignment: IAssignment;
	customer: ICustomer;
	notary: IUserContextUser;
}

export default class Assignment extends React.Component<
	IAssignmentProps,
	IAssignmentState
> {
	static contextType = UserContext;
	context!: React.ContextType<typeof UserContext>;
	constructor(props: IAssignmentProps) {
		super(props);
		this.state = {
			assignment: {},
			customer: {},
			notary: {},
		};
	}

	componentDidMount() {
		const query = new URLSearchParams(this.props.location.search);
		if (query.get("assignment")) {
			this.setState(
				{
					assignment: { id: Number(query.get("assignment")) },
				},
				() => this.fetchAssignment()
			);
		} else {
			this.props.history.push("/dashboard");
		}
	}

	fetchAssignment = () => {
		fetch(
			`${process.env.REACT_APP_API_SERVER}/assignment?id=${this.state.assignment.id}`,
			{
				method: "GET",
				headers: new Headers({
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.context.token}`,
				}),
			}
		)
			.then((res) => res.json())
			.then((data) => {
				this.setState({
					assignment: data.assignment,
					customer: data.customer,
					notary: data.notary,
				});
			});
	};

	render() {
		// if not auth, redirect to login page
		if (!this.context.isAuth) this.props.history.push("/");
		return (
			<>
				<NavBar
					history={this.props.history}
					location={this.props.location}
					match={this.props.match}
				/>
				<Row className="mt-3">
					<Col>
						<AssignmentCard assignment={this.state.assignment} />
					</Col>
					<Col>
						<CustomerCard
							customer={this.state.customer}
							history={this.props.history}
							location={this.props.location}
							match={this.props.match}
						/>
					</Col>
					<Col>
						<NotaryCard notary={this.state.notary} />
					</Col>
				</Row>
			</>
		);
	}
}
