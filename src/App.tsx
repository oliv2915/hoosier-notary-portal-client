import React from "react";
import { Container } from "reactstrap";
import "./App.scss";
import Signup from "./components/Signup";
import Login from "./components/Login";

function App() {
	return (
		<Container fluid>
			<Login />
			<Signup />
		</Container>
	);
}

export default App;
