import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Col,
	Label,
	Row,
	Table,
} from "reactstrap";
import AddressModal from "../components/AddressModal";
import AddCredentialModal from "../components/AddCredentialsModal";
import EditUserInfo from "../components/EditUserInfo";
import UserContext from "../context/UserContext";
import { IAddress, ICommission } from "../interfaces";

interface IUserProfileProps extends RouteComponentProps {}

interface IUserProfileState {
	isEditInfoModalOpen: boolean;
	isAddAddressModalOpen: boolean;
	isAddCredentialModalOpen: boolean;
	addresses: IAddress[];
	credentials: ICommission[];
}

export default class UserProfile extends React.Component<
	IUserProfileProps,
	IUserProfileState
> {
	static contextType = UserContext;
	context!: React.ContextType<typeof UserContext>;
	constructor(props: IUserProfileProps) {
		super(props);
		this.state = {
			isEditInfoModalOpen: false,
			isAddAddressModalOpen: false,
			isAddCredentialModalOpen: false,
			addresses: [],
			credentials: [],
		};
	}

	toggleEditInfoModal = () => {
		this.setState({
			isEditInfoModalOpen: !this.state.isEditInfoModalOpen,
		});
	};

	toggleAddAddressModal = () => {
		this.setState({
			isAddAddressModalOpen: !this.state.isAddAddressModalOpen,
		});
	};

	toggleAddCredentialModal = () => {
		this.setState({
			isAddCredentialModalOpen: !this.state.isAddCredentialModalOpen,
		});
	};

	componentDidMount() {
		if (this.context.user.isNotary) {
			this.fetchAddresses();
			this.fetchCredentials();
		}
	}

	fetchAddresses = () => {
		fetch(`${process.env.REACT_APP_API_SERVER}/address/all`, {
			method: "GET",
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.context.token}`,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				this.setState({
					addresses: data.addresses,
				});
			});
	};

	fetchCredentials = () => {
		fetch(`${process.env.REACT_APP_API_SERVER}/commission/all`, {
			method: "GET",
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.context.token}`,
			}),
		})
			.then((res) => res.json())
			.then((data) =>
				this.setState({
					credentials: data.commissions,
				})
			);
	};

	render() {
		// if not auth, redirect to home (login)
		if (!this.context.isAuth) this.props.history.push("/");
		return (
			<div>
				<Row className="mt-3">
					<Col md="4" className="mb-3">
						<Card>
							<CardHeader>Basic Info</CardHeader>
							<CardBody className="basic-info-card-body">
								<div>
									<Label>
										<b>Name:</b>{" "}
										{`${this.context.user.firstName} ${
											this.context.user.middleName
												? this.context.user.middleName
												: ""
										} ${this.context.user.lastName} ${
											this.context.user.suffix ? this.context.user.suffix : ""
										}`}
									</Label>
								</div>
								<div>
									<Label>
										<b>Phone Number:</b> {this.context.user.phoneNumber}
									</Label>
								</div>
								<div>
									<Label>
										<b>Email Address:</b> {this.context.user.email}
									</Label>
								</div>
								<div hidden={this.context.user.isEmployee}>
									<Label>
										<b>Notary Status:</b>{" "}
										{this.context.user.isActiveNotary ? "Active" : "In-Active"}
									</Label>
								</div>
								<Button
									color="info"
									size="sm"
									onClick={this.toggleEditInfoModal}
								>
									Edit Info
								</Button>
							</CardBody>
						</Card>
					</Col>
					<Col md="4" className="mb-3" hidden={this.context.user.isEmployee}>
						<Card>
							<CardHeader>
								<span>Address Info </span>
								<Button
									type="button"
									size="sm"
									color="info"
									onClick={this.toggleAddAddressModal}
								>
									Add Address
								</Button>
							</CardHeader>
							<CardBody>
								<Table size="sm">
									<thead>
										<tr>
											<th>Street</th>
											<th>City</th>
											<th>State</th>
											<th>Type</th>
										</tr>
									</thead>
									<tbody>
										{this.state.addresses.map((address, idx) => {
											return (
												<tr key={idx}>
													<td>{`${address.streetOne} ${
														address.streetTwo ? address.streetTwo : ""
													}`}</td>
													<td>{address.city}</td>
													<td>{address.state}</td>
													<td>{address.type}</td>
												</tr>
											);
										})}
									</tbody>
								</Table>
							</CardBody>
						</Card>
					</Col>
					<Col md="4" className="mb-3" hidden={this.context.user.isEmployee}>
						<Card>
							<CardHeader>
								<span>Credential Info </span>
								<Button
									type="button"
									color="info"
									size="sm"
									onClick={this.toggleAddCredentialModal}
								>
									Add Credential
								</Button>
							</CardHeader>
							<CardBody>
								<Table size="sm">
									<thead>
										<tr>
											<th>Number</th>
											<th>State</th>
											<th>Exipre Date</th>
										</tr>
									</thead>
									<tbody>
										{this.state.credentials.map((commission, idx) => {
											return (
												<tr key={idx}>
													<td>{commission.commissionNumber}</td>
													<td>{commission.commissionState}</td>
													<td>{commission.commissionExpireDate}</td>
												</tr>
											);
										})}
									</tbody>
								</Table>
							</CardBody>
						</Card>
					</Col>
				</Row>
				<EditUserInfo
					isOpen={this.state.isEditInfoModalOpen}
					toggle={this.toggleEditInfoModal}
				/>
				<AddressModal
					isOpen={this.state.isAddAddressModalOpen}
					toggle={this.toggleAddAddressModal}
					history={this.props.history}
					location={this.props.location}
					match={this.props.match}
				/>
				<AddCredentialModal
					isOpen={this.state.isAddCredentialModalOpen}
					toggle={this.toggleAddCredentialModal}
					history={this.props.history}
					location={this.props.location}
					match={this.props.match}
				/>
			</div>
		);
	}
}
