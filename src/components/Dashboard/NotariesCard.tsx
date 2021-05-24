import React, { BaseSyntheticEvent } from "react";
import { RouteComponentProps } from "react-router";
import { Card, CardHeader, CardBody, Table } from "reactstrap";
import UserContext from "../../context/UserContext";
import { IUserContextUser } from "../../interfaces";

interface INotariesCardProps extends RouteComponentProps {}

interface INotariesCardState {
	notaries: IUserContextUser[];
}

export default class NotariesCard extends React.Component<
	INotariesCardProps,
	INotariesCardState
> {
	static contextType = UserContext;
	context!: React.ContextType<typeof UserContext>;
	constructor(props: INotariesCardProps) {
		super(props);
		this.state = {
			notaries: [],
		};
	}

	componentDidMount() {
		this.fetchNotaries();
	}

	fetchNotaries = () => {
		fetch(`${process.env.REACT_APP_API_SERVER}/user/notaries`, {
			method: "GET",
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.context.token}`,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				this.setState({
					notaries: data.notaries,
				});
			});
	};

	notaryRowClicked = (event: BaseSyntheticEvent) => {
		const notaryId = event.currentTarget.id;
		this.props.history.push(`/profile?user=${notaryId}`);
	};

	render() {
		return (
			<Card>
				<CardHeader>Notaries Pending Approval</CardHeader>
				<CardBody>
					<Table size="sm" borderless hover responsive>
						<thead>
							<tr>
								<th>Notary Name</th>
								<th>Notary Status</th>
							</tr>
						</thead>
						<tbody>
							{this.state.notaries?.map((notary, idx) => {
								return (
									<tr
										key={idx}
										id={`${notary.id}`}
										onClick={this.notaryRowClicked}
										style={{ cursor: "pointer" }}
									>
										<td>{`${notary.firstName} ${notary.lastName}`}</td>
										<td>{notary.isActiveNotary ? "Active" : "In-Active"}</td>
									</tr>
								);
							})}
						</tbody>
					</Table>
				</CardBody>
			</Card>
		);
	}
}
