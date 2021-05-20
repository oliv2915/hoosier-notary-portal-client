import * as React from "react";
import { Button, Nav, Navbar, NavbarBrand, NavItem, NavLink } from "reactstrap";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import UserContext from "../context/UserContext";
import AddCustomerModal from "./AddCustomerModal";
import AddAssignmentModal from "./AddAssignmentModal";

interface INavBarProps {}
interface INavBarState {
	isAddCustomerModalOpen: boolean;
	isAddAssignmentModalOpen: boolean;
}

export default class NavBar extends React.Component<
	INavBarProps,
	INavBarState
> {
	static contextType = UserContext;
	context!: React.ContextType<typeof UserContext>;
	constructor(props: INavBarProps) {
		super(props);
		this.state = {
			isAddCustomerModalOpen: false,
			isAddAssignmentModalOpen: false,
		};
	}
	toggleAddCustomerModal = () => {
		this.setState({
			isAddCustomerModalOpen: !this.state.isAddCustomerModalOpen,
		});
	};

	toggleAddAssignmentModal = () => {
		this.setState({
			isAddAssignmentModalOpen: !this.state.isAddAssignmentModalOpen,
		});
	};

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
						{this.context.user.isEmployee ? (
							<NavItem>
								<NavLink>
									<Button
										type="button"
										color="info"
										onClick={() => this.toggleAddCustomerModal()}
									>
										Add Customer
									</Button>
								</NavLink>
							</NavItem>
						) : null}
						{this.context.user.isEmployee ? (
							<NavItem>
								<NavLink>
									<Button
										type="button"
										color="info"
										onClick={() => this.toggleAddAssignmentModal()}
									>
										Add Assignment
									</Button>
								</NavLink>
							</NavItem>
						) : null}
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
				{this.context.user.isEmployee && (
					<>
						<AddCustomerModal
							isOpen={this.state.isAddCustomerModalOpen}
							toggle={this.toggleAddCustomerModal}
						/>
						<AddAssignmentModal
							isOpen={this.state.isAddAssignmentModalOpen}
							toggle={this.toggleAddAssignmentModal}
						/>
					</>
				)}
			</header>
		);
	}
}
