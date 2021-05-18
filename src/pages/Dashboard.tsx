import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import UserContext from "../context/UserContext";

export interface IDashboardProps extends RouteComponentProps {}

export default class Dashboard extends React.Component<IDashboardProps> {
	static contextType = UserContext;
	context!: React.ContextType<typeof UserContext>;
	public render() {
		// if not auth, redirect to login page
		if (!this.context.isAuth) this.props.history.push("/");
		return <div>Dashboard</div>;
	}
}
