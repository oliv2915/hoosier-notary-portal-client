import React from "react";
import UserContext from "../../context/UserContext";
import { Button, Card, CardBody, CardHeader, Table } from "reactstrap";
import { ICommission } from "../../interfaces";
import CredentialModal from "../Modals/CredentialModal";

interface IProfileCredentialTableProps {}

interface IProfileCredentialTableState {
	isAddCredentialModalOpen: boolean;
	credentials: ICommission[];
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
			credentials: [],
		};
	}

	componentDidMount() {
		this.fetchCredentials();
	}

	toggleAddCredentialModal = () => {
		this.setState({
			isAddCredentialModalOpen: !this.state.isAddCredentialModalOpen,
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
		return (
			<>
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
				<CredentialModal
					isOpen={this.state.isAddCredentialModalOpen}
					toggle={this.toggleAddCredentialModal}
				/>
			</>
		);
	}
}
