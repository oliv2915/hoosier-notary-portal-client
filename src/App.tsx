import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import UserContext from "./context/UserContext";
import { Container } from "reactstrap";
import "./App.scss";
import NavBar from "./components/NavBar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import Dashboard from "./pages/Dashboard";
interface IAppProps {}
interface IAppState {}

class App extends React.Component<IAppProps, IAppState> {
	static contextType = UserContext;
	render() {
		return (
			<Router>
				<Container fluid>
					<NavBar />
					<Switch>
						<Route exact path="/" component={Login} />
						<Route path="/signup" component={Signup} />
						<Route path="/profile" component={UserProfile} />
						<Route path="/dashboard" component={Dashboard} />
					</Switch>
				</Container>
			</Router>
		);
	}
}

export default App;
