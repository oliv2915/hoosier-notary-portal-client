import React, { BaseSyntheticEvent } from "react";
import UserContext from "../../context/UserContext";
import { Button, Card, CardBody, CardHeader, Table } from "reactstrap";
import { IAddress } from "../../interfaces";
import AddressModal from "./AddressModal";
import { RouteComponentProps } from "react-router-dom";

interface IAddressCardProps extends RouteComponentProps {
	addresses: IAddress[];
	updateAddressTable: () => void;
}

interface IAddressCardState {
	isAddAddressModalOpen: boolean;
	isEditAddressModalOpen: boolean;
	addressToEdit: IAddress;
}

export default class AddressCard extends React.Component<
	IAddressCardProps,
	IAddressCardState
> {
	static contextType = UserContext;
	context!: React.ContextType<typeof UserContext>;
	constructor(props: IAddressCardProps) {
		super(props);
		this.state = {
			isAddAddressModalOpen: false,
			isEditAddressModalOpen: false,
			addressToEdit: {},
		};
	}

	toggleAddAddressModal = () => {
		this.setState({
			isAddAddressModalOpen: !this.state.isAddAddressModalOpen,
		});
	};

	toggleEditAddressModal = () => {
		this.setState({
			isEditAddressModalOpen: !this.state.isEditAddressModalOpen,
		});
	};

	addressRowClicked = (event: BaseSyntheticEvent) => {
		this.setState(
			{
				addressToEdit: this.props.addresses[event.currentTarget.id],
			},
			() => this.toggleEditAddressModal()
		);
	};

	render() {
		const query = new URLSearchParams(this.props.location.search);
		return (
			<>
				<Card>
					<CardHeader>
						<span>Address Info </span>
						{/*
							Button should show when notary is logged in and when employee
							is on customer page. Employee should never see the button on notary profile
						*/}
						{this.context.user.isNotary && !query.get("user") && (
							<Button
								type="button"
								size="sm"
								color="info"
								onClick={this.toggleAddAddressModal}
							>
								Add Address
							</Button>
						)}
						{this.context.user.isEmployee && query.get("customer") && (
							<Button
								type="button"
								size="sm"
								color="info"
								onClick={this.toggleAddAddressModal}
							>
								Add Address
							</Button>
						)}
					</CardHeader>
					<CardBody>
						<Table size="sm" hover responsive borderless>
							<thead>
								<tr>
									<th>Street</th>
									<th>City</th>
									<th>State</th>
									<th>Type</th>
								</tr>
							</thead>
							<tbody>
								{this.props.addresses.map((address, idx) => {
									return (
										<tr
											key={idx}
											id={`${idx}`}
											onClick={this.addressRowClicked}
											style={{ cursor: "pointer" }}
										>
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
				{/* Add Address */}
				<AddressModal
					isOpen={this.state.isAddAddressModalOpen}
					toggle={this.toggleAddAddressModal}
					updateAddressTable={this.props.updateAddressTable}
					history={this.props.history}
					location={this.props.location}
					match={this.props.match}
				/>
				{/* Edit Address */}
				<AddressModal
					isOpen={this.state.isEditAddressModalOpen}
					toggle={this.toggleEditAddressModal}
					addressToEdit={this.state.addressToEdit}
					updateAddressTable={this.props.updateAddressTable}
					history={this.props.history}
					location={this.props.location}
					match={this.props.match}
				/>
			</>
		);
	}
}
