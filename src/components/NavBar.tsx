import * as React from "react";
import { Button, Nav, Navbar, NavbarBrand, NavItem, NavLink } from "reactstrap";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import UserContext from "../context/UserContext";

interface INavBarProps {}
interface INavBarState {}

export default class NavBar extends React.Component<
	INavBarProps,
	INavBarState
> {
	static contextType = UserContext;
	render() {
		return (
			<header>
				<Navbar color="light" className="py-0">
					<Link to="/">
						<NavbarBrand>
							<img src={Logo} alt="logo" width="50" />
						</NavbarBrand>
					</Link>
					<Nav>
						<NavItem>
							{this.context.isAuth ? (
								<Link to="/profile">
									<NavLink>
										<Button color="primary">Profile</Button>
									</NavLink>
								</Link>
							) : (
								<Link to="/signup">
									<NavLink>
										<Button color="primary">Sign Up</Button>
									</NavLink>
								</Link>
							)}
						</NavItem>
						<NavItem>
							{this.context.isAuth ? (
								<NavLink>
									<Button
										color="primary"
										onClick={() => this.context.setToken(null)}
									>
										Logout
									</Button>
								</NavLink>
							) : (
								<Link to="/">
									<NavLink>
										<Button color="primary">Login</Button>
									</NavLink>
								</Link>
							)}
						</NavItem>
					</Nav>
				</Navbar>
			</header>
		);
	}
}
