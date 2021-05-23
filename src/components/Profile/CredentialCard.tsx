import React, { BaseSyntheticEvent } from "react";
import UserContext from "../../context/UserContext";
import { Button, Card, CardBody, CardHeader, Table } from "reactstrap";
import { ICommission } from "../../interfaces";
import CredentialModal from "../Modals/CredentialModal";
import { RouteComponentProps } from "react-router-dom";

interface IProfileCredentialTableProps extends RouteComponentProps {
	credentials: ICommission[];
	updateProfile: () => void;
}

interface IProfileCredentialTableState {
	isAddCredentialModalOpen: boolean;
	isEditCredentialModalOpen: boolean;
	credentialToEdit: ICommission;
}

export default class ProfileCredential extends React.Component<
	IProfileCredentialTableProps,
	IProfileCredentialTableState
> {
	static contextType = UserContext;
	context!: React.ContextType<typeof UserContext>;
	constructor(props: IProfileCredentialTableProps) {
		super(props);
		this.state = {
			isAddCredentialModalOpen: false,
			isEditCredentialModalOpen: false,
			credentialToEdit: {},
		};
	}

	toggleAddCredentialModal = () => {
		this.setState({
			isAddCredentialModalOpen: !this.state.isAddCredentialModalOpen,
		});
	};

	toggleEditCredentialModal = () => {
		this.setState({
			isEditCredentialModalOpen: !this.state.isEditCredentialModalOpen,
		});
	};

	credentialRowClicked = (event: BaseSyntheticEvent) => {
		this.setState(
			{
				credentialToEdit: this.props.credentials[event.currentTarget.id],
			},
			() => this.toggleEditCredentialModal()
		);
	};

	render() {
		return (
			<>
				<Card>
					<CardHeader>
						<span>Credential Info </span>
						{this.context.user.isNotary && (
							<Button
								type="button"
								color="info"
								size="sm"
								onClick={this.toggleAddCredentialModal}
							>
								Add Credential
							</Button>
						)}
					</CardHeader>
					<CardBody>
						<Table size="sm" hover responsive borderless>
							<thead>
								<tr>
									<th>Number</th>
									<th>State</th>
									<th>Exipre Date</th>
								</tr>
							</thead>
							<tbody>
								{this.props.credentials.map((commission, idx) => {
									return (
										<tr
											key={idx}
											id={`${idx}`}
											onClick={this.credentialRowClicked}
											style={{ cursor: "pointer" }}
										>
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
				{/* Add Credential */}
				<CredentialModal
					isOpen={this.state.isAddCredentialModalOpen}
					toggle={this.toggleAddCredentialModal}
					updateProfile={this.props.updateProfile}
					history={this.props.history}
					location={this.props.location}
					match={this.props.match}
				/>
				{/* Edit Credential */}
				<CredentialModal
					isOpen={this.state.isEditCredentialModalOpen}
					toggle={this.toggleEditCredentialModal}
					updateProfile={this.props.updateProfile}
					credentialToEdit={this.state.credentialToEdit}
					history={this.props.history}
					location={this.props.location}
					match={this.props.match}
				/>
			</>
		);
	}
}
