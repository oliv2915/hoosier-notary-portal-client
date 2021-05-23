import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Row, Col } from "reactstrap";
import AssignmentsCard from "../components/Dashboard/AssignmentsCard";
import CustomersCard from "../components/Dashboard/CustomersCard";
import NotariesCard from "../components/Dashboard/NotariesCard";
import NavBar from "../components/NavBar";
import UserContext from "../context/UserContext";

interface IDashboardProps extends RouteComponentProps {}
interface IDashboardState {}

export default class Dashboard extends React.Component<
	IDashboardProps,
	IDashboardState
> {
	static contextType = UserContext;
	context!: React.ContextType<typeof UserContext>;

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
						<AssignmentsCard
							history={this.props.history}
							location={this.props.location}
							match={this.props.match}
						/>
					</Col>
					{this.context.user.isEmployee ? (
						<>
							<Col>
								<CustomersCard
									history={this.props.history}
									location={this.props.location}
									match={this.props.match}
								/>
							</Col>
							<Col>
								<NotariesCard
									history={this.props.history}
									location={this.props.location}
									match={this.props.match}
								/>
							</Col>
						</>
					) : null}
				</Row>
			</>
		);
	}
}
