import * as React from "react";
import { RouteComponentProps } from "react-router";
import {
	Alert,
	Button,
	Col,
	Form,
	FormFeedback,
	FormGroup,
	Input,
	Label,
	Modal,
	ModalBody,
	ModalHeader,
	Row,
} from "reactstrap";
import UserContext from "../../context/UserContext";
import { ICommission } from "../../interfaces";

interface ICredentialModalProps extends RouteComponentProps {
	isOpen: boolean;
	toggle: () => void;
	updateProfile: () => void;
	credentialToEdit?: ICommission;
}

interface ICredentialModalState {
	commission: ICommission;
	formValid: boolean;
	invalidFields: string[];
	isAlertOpen: boolean;
	alertMessage?: string;
	alertColor?: string;
	editingCredential: boolean;
}

export default class CredentialModal extends React.Component<
	ICredentialModalProps,
	ICredentialModalState
> {
	static contextType = UserContext;
	context!: React.ContextType<typeof UserContext>;
	constructor(props: ICredentialModalProps) {
		super(props);
		this.state = {
			commission: {},
			formValid: false,
			invalidFields: [],
			isAlertOpen: false,
			editingCredential: false,
		};
	}

	modalDidOpen = () => {
		if (this.props.credentialToEdit) {
			this.setState(
				{
					editingCredential: true,
					commission: this.props.credentialToEdit,
				},
				() => this.validateInput()
			);
		} else {
			this.validateInput();
		}
	};

	modalDidClose = () => {
		this.setState({
			commission: {},
			formValid: false,
			invalidFields: [],
			editingCredential: false,
			isAlertOpen: false,
			alertMessage: undefined,
			alertColor: undefined,
		});
	};

	handleInputChange = (event: React.BaseSyntheticEvent) => {
		switch (event.target.name) {
			case "commissionNumber":
				this.setState(
					{
						commission: {
							id: this.state.commission.id,
							userId: this.state.commission.userId,
							commissionNumber: event.target.value,
							nameOnCommission: this.state.commission.nameOnCommission,
							commissionExpireDate: this.state.commission.commissionExpireDate,
							commissionState: this.state.commission.commissionState,
							countyOfResidence: this.state.commission.countyOfResidence,
						},
					},
					() => this.validateInput()
				);
				break;
			case "nameOnCommission":
				this.setState(
					{
						commission: {
							id: this.state.commission.id,
							userId: this.state.commission.userId,
							commissionNumber: this.state.commission.commissionNumber,
							nameOnCommission: event.target.value,
							commissionExpireDate: this.state.commission.commissionExpireDate,
							commissionState: this.state.commission.commissionState,
							countyOfResidence: this.state.commission.countyOfResidence,
						},
					},
					() => this.validateInput()
				);
				break;
			case "commissionExpireDate":
				this.setState(
					{
						commission: {
							id: this.state.commission.id,
							userId: this.state.commission.userId,
							commissionNumber: this.state.commission.commissionNumber,
							nameOnCommission: this.state.commission.nameOnCommission,
							commissionExpireDate: event.target.value,
							commissionState: this.state.commission.commissionState,
							countyOfResidence: this.state.commission.countyOfResidence,
						},
					},
					() => this.validateInput()
				);
				break;
			case "commissionState":
				this.setState(
					{
						commission: {
							id: this.state.commission.id,
							userId: this.state.commission.userId,
							commissionNumber: this.state.commission.commissionNumber,
							nameOnCommission: this.state.commission.nameOnCommission,
							commissionExpireDate: this.state.commission.commissionExpireDate,
							commissionState: event.target.value,
							countyOfResidence: this.state.commission.countyOfResidence,
						},
					},
					() => this.validateInput()
				);
				break;
			case "countyOfResidence":
				this.setState(
					{
						commission: {
							id: this.state.commission.id,
							userId: this.state.commission.userId,
							commissionNumber: this.state.commission.commissionNumber,
							nameOnCommission: this.state.commission.nameOnCommission,
							commissionExpireDate: this.state.commission.commissionExpireDate,
							commissionState: this.state.commission.commissionState,
							countyOfResidence: event.target.value,
						},
					},
					() => this.validateInput()
				);
				break;

			default:
				break;
		}
	};

	validateInput = () => {
		const invalidVields: string[] = [];

		if (!this.state.commission.commissionNumber)
			invalidVields.push("commissionNumber");
		if (!this.state.commission.nameOnCommission)
			invalidVields.push("nameOnCommission");
		if (!this.state.commission.commissionExpireDate)
			invalidVields.push("commissionExpireDate");
		if (!this.state.commission.commissionState)
			invalidVields.push("commissionState");
		if (!this.state.commission.countyOfResidence)
			invalidVields.push("countyOfResidence");

		if (invalidVields.length > 0) {
			this.setState({
				formValid: false,
				invalidFields: invalidVields,
			});
		} else {
			this.setState({
				formValid: true,
				invalidFields: [],
			});
		}
	};

	handleSubmit = (event: React.BaseSyntheticEvent) => {
		event.preventDefault();
		if (this.state.formValid) {
			this.submitInput();
		} else {
			this.setState({
				isAlertOpen: true,
				alertColor: "danger",
				alertMessage:
					"Unable to add a commission. Please check the enteries below",
			});
		}
	};

	addCredential = () => {
		fetch(`${process.env.REACT_APP_API_SERVER}/commission/add`, {
			method: "POST",
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.context.token}`,
			}),
			body: JSON.stringify({
				commission: this.state.commission,
			}),
		})
			.then((res) => {
				if (res.status !== 201) {
					if (res.status === 409) {
						this.setState({
							isAlertOpen: true,
							alertMessage: "Commission Number already in use",
							alertColor: "danger",
						});
					}
				}
				return res.json();
			})
			.then((data) => {
				if ("error" in data) {
					return; // handled above
				} else {
					this.props.updateProfile();
					this.props.toggle();
				}
			});
	};

	editCredential = () => {
		fetch(`${process.env.REACT_APP_API_SERVER}/commission/update`, {
			method: "PUT",
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.context.token}`,
			}),
			body: JSON.stringify({
				commission: this.state.commission,
			}),
		})
			.then((res) => {
				if (res.status !== 200) {
					if (res.status === 409) {
						this.setState({
							isAlertOpen: true,
							alertMessage: "Commission Number already in use",
							alertColor: "danger",
						});
					}
				}
				return res.json();
			})
			.then((data) => {
				if ("error" in data) {
					return; // handled above
				} else {
					this.props.updateProfile();
					this.props.toggle();
				}
			});
	};

	submitInput = () => {
		if (this.state.editingCredential) {
			this.editCredential();
		} else {
			this.addCredential();
		}
	};
	render() {
		const query = new URLSearchParams(this.props.location.search);
		return (
			<Modal
				isOpen={this.props.isOpen}
				toggle={this.props.toggle}
				onOpened={this.modalDidOpen}
				onClosed={this.modalDidClose}
			>
				<ModalHeader toggle={this.props.toggle}>
					{this.state.editingCredential ? "Edit Credential" : "Add Credential"}
				</ModalHeader>
				<ModalBody>
					<Alert isOpen={this.state.isAlertOpen} color={this.state.alertColor}>
						{this.state.alertMessage}
					</Alert>
					<Form onSubmit={this.handleSubmit}>
						<Row form>
							<Col>
								<FormGroup>
									<Label htmlFor="commission-number">Commission Number</Label>
									<Input
										type="text"
										name="commissionNumber"
										id="commission-number"
										value={this.state.commission.commissionNumber}
										placeholder="Commission Number"
										valid={
											!this.state.invalidFields.includes("commissionNumber")
										}
										invalid={this.state.invalidFields.includes(
											"commissionNumber"
										)}
										onChange={this.handleInputChange}
										disabled={
											this.context.user.isEmployee && query.get("user")
												? true
												: false
										}
									/>
									<FormFeedback>Required</FormFeedback>
								</FormGroup>
							</Col>
							<Col>
								<FormGroup>
									<Label htmlFor="name-on-commission">Name on Commission</Label>
									<Input
										type="text"
										name="nameOnCommission"
										id="name-on-commission"
										value={this.state.commission.nameOnCommission}
										placeholder="Name on Commission"
										valid={
											!this.state.invalidFields.includes("nameOnCommission")
										}
										invalid={this.state.invalidFields.includes(
											"nameOnCommission"
										)}
										onChange={this.handleInputChange}
										disabled={
											this.context.user.isEmployee && query.get("user")
												? true
												: false
										}
									/>
									<FormFeedback>Required</FormFeedback>
								</FormGroup>
							</Col>
						</Row>
						<Row form>
							<Col>
								<FormGroup>
									<Label htmlFor="expire-date">Commission Expire Date</Label>
									<Input
										type="date"
										name="commissionExpireDate"
										id="expire-date"
										value={this.state.commission.commissionExpireDate?.toString()}
										valid={
											!this.state.invalidFields.includes("commissionExpireDate")
										}
										invalid={this.state.invalidFields.includes(
											"commissionExpireDate"
										)}
										onChange={this.handleInputChange}
										disabled={
											this.context.user.isEmployee && query.get("user")
												? true
												: false
										}
									/>
									<FormFeedback>Required</FormFeedback>
								</FormGroup>
							</Col>
						</Row>
						<Row form>
							<Col>
								<FormGroup>
									<Label htmlFor="state">Commission State</Label>
									<Input
										type="text"
										name="commissionState"
										id="state"
										value={this.state.commission.commissionState}
										placeholder="Commission State"
										valid={
											!this.state.invalidFields.includes("commissionState")
										}
										invalid={this.state.invalidFields.includes(
											"commissionState"
										)}
										onChange={this.handleInputChange}
										disabled={
											this.context.user.isEmployee && query.get("user")
												? true
												: false
										}
									/>
									<FormFeedback>Required</FormFeedback>
								</FormGroup>
							</Col>
							<Col>
								<FormGroup>
									<Label htmlFor="residence">County of Residence</Label>
									<Input
										type="text"
										name="countyOfResidence"
										id="residence"
										value={this.state.commission.countyOfResidence}
										placeholder="County of Residence"
										valid={
											!this.state.invalidFields.includes("countyOfResidence")
										}
										invalid={this.state.invalidFields.includes(
											"countyOfResidence"
										)}
										onChange={this.handleInputChange}
										disabled={
											this.context.user.isEmployee && query.get("user")
												? true
												: false
										}
									/>
									<FormFeedback>Required</FormFeedback>
								</FormGroup>
							</Col>
						</Row>
						<Button
							type="submit"
							color="warning"
							disabled={
								this.context.user.isEmployee && query.get("user") ? true : false
							}
						>
							{this.state.editingCredential
								? "Edit Commission"
								: "Add Commission"}
						</Button>
					</Form>
				</ModalBody>
			</Modal>
		);
	}
}
