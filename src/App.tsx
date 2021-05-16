import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import UserContext from "./context/UserContext";
import { Container } from "reactstrap";
import "./App.scss";
import NavBar from "./components/NavBar";
import Signup from "./components/Signup";
import Login from "./components/Login";
import UserProfile from "./components/UserProfile";
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
					</Switch>
				</Container>
			</Router>
		);
	}
}

export default App;
