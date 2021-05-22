import React, { BaseSyntheticEvent } from "react";
import UserContext from "../../context/UserContext";
import { Button, Card, CardBody, CardHeader, Table } from "reactstrap";
import { IAddress } from "../../interfaces";
import AddressModal from "../Modals/AddressModal";

interface IProfileAddressCardProps {}

interface IProfileAddressCardState {
	isAddAddressModalOpen: boolean;
	isEditAddressModalOpen: boolean;
	addresses: IAddress[];
	addressToEdit: IAddress;
}

export default class ProfileAddressCard extends React.Component<
	IProfileAddressCardProps,
	IProfileAddressCardState
> {
	static contextType = UserContext;
	context!: React.ContextType<typeof UserContext>;
	constructor(props: IProfileAddressCardProps) {
		super(props);
		this.state = {
			isAddAddressModalOpen: false,
			isEditAddressModalOpen: false,
			addresses: [],
			addressToEdit: {},
		};
	}

	componentDidMount() {
		this.fetchAddresses();
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

	updateAddressTable = () => {
		this.fetchAddresses();
	};

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
				addressToEdit: this.state.addresses[event.currentTarget.id],
			},
			() => this.toggleEditAddressModal()
		);
	};

	render() {
		return (
			<>
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
								{this.state.addresses.map((address, idx) => {
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
					updateAddressTable={this.updateAddressTable}
				/>
				{/* Edit Address */}
				<AddressModal
					isOpen={this.state.isEditAddressModalOpen}
					toggle={this.toggleEditAddressModal}
					addressToEdit={this.state.addressToEdit}
					updateAddressTable={this.updateAddressTable}
				/>
			</>
		);
	}
}
