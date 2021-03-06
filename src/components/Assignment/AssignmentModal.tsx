import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import {
	Col,
	Form,
	Input,
	Modal,
	ModalBody,
	ModalHeader,
	Row,
	Button,
	FormFeedback,
	Alert,
	FormGroup,
	Label,
} from "reactstrap";
import UserContext from "../../context/UserContext";
import { IAssignment, ICustomer } from "../../interfaces";

interface IAssignmentModalProps extends RouteComponentProps {
	isOpen: boolean;
	toggle: () => void;
	assignmentToEdit?: IAssignment;
	updateAssignment?: () => void;
}

interface IAssignmentModalState {
	assignment: IAssignment;
	editingAssignment: boolean;
	customers: ICustomer[];
	formValid: boolean;
	invalidFields: string[];
	isAlertOpen: boolean;
	alertMessage?: string;
	alertColor?: string;
}

export default class AssignmentModal extends React.Component<
	IAssignmentModalProps,
	IAssignmentModalState
> {
	static contextType = UserContext;
	context!: React.ContextType<typeof UserContext>;
	constructor(props: IAssignmentModalProps) {
		super(props);
		this.state = {
			assignment: {
				status: "New",
			},
			editingAssignment: false,
			customers: [],
			formValid: false,
			invalidFields: [],
			isAlertOpen: false,
		};
	}

	modalDidOpen = () => {
		this.fetchCustomers();
		if (this.props.assignmentToEdit) {
			// updating assignment
			this.setState(
				{
					editingAssignment: true,
					assignment: this.props.assignmentToEdit,
				},
				() => this.validateInput()
			);
		} else {
			this.validateInput();
		}
	};

	modalDidClose = () => {
		this.setState({
			assignment: {},
			editingAssignment: false,
			customers: [],
			formValid: false,
			invalidFields: [],
			isAlertOpen: false,
			alertMessage: undefined,
			alertColor: undefined,
		});
	};

	fetchCustomers = () => {
		fetch(`${process.env.REACT_APP_API_SERVER}/customer/all`, {
			method: "GET",
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.context.token}`,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				this.setState({
					customers: data.customers,
				});
			});
	};

	addAssignment = () => {
		fetch(`${process.env.REACT_APP_API_SERVER}/assignment/add`, {
			method: "POST",
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.context.token}`,
			}),
			body: JSON.stringify({
				assignment: this.state.assignment,
			}),
		})
			.then((res) => {
				if (res.status !== 201) {
					this.setState({
						isAlertOpen: true,
						alertColor: "danger",
						alertMessage:
							"Please check the enteries below. There was an issue with adding the assignment",
					});
				}
				return res.json();
			})
			.then((data) => {
				if ("error" in data) return; // nothing to do here, handled above
				this.props.history.push(`/assignment?assignment=${data.assignment.id}`);
				this.props.toggle();
			});
	};

	editAssignment = () => {
		fetch(`${process.env.REACT_APP_API_SERVER}/assignment/update`, {
			method: "PUT",
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.context.token}`,
			}),
			body: JSON.stringify({
				assignment: this.state.assignment,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				if (this.props.updateAssignment) {
					this.props.updateAssignment();
					this.props.toggle();
				}
			});
	};

	toggleAlert = () => {
		this.setState({
			isAlertOpen: !this.state.isAlertOpen,
		});
	};

	handleInputChange = (event: React.BaseSyntheticEvent) => {
		switch (event.target.name) {
			case "customerId":
				this.setState(
					{
						assignment: {
							id: this.state.assignment.id,
							customerId: event.target.value,
							userId: this.state.assignment.userId,
							fileNumber: this.state.assignment.fileNumber,
							dueDate: this.state.assignment.dueDate,
							notes: this.state.assignment.notes,
							contactName: this.state.assignment.contactName,
							contactPhoneNumber: this.state.assignment.contactPhoneNumber,
							contactEmail: this.state.assignment.contactEmail,
							meetingAddress: this.state.assignment.meetingAddress,
							rate: this.state.assignment.rate,
							type: this.state.assignment.type,
							status: this.state.assignment.status,
						},
					},
					() => this.validateInput()
				);
				break;
			case "fileNumber":
				this.setState(
					{
						assignment: {
							id: this.state.assignment.id,
							customerId: this.state.assignment.customerId,
							userId: this.state.assignment.userId,
							fileNumber: event.target.value,
							dueDate: this.state.assignment.dueDate,
							notes: this.state.assignment.notes,
							contactName: this.state.assignment.contactName,
							contactPhoneNumber: this.state.assignment.contactPhoneNumber,
							contactEmail: this.state.assignment.contactEmail,
							meetingAddress: this.state.assignment.meetingAddress,
							rate: this.state.assignment.rate,
							type: this.state.assignment.type,
							status: this.state.assignment.status,
						},
					},
					() => this.validateInput()
				);
				break;
			case "dueDate":
				this.setState(
					{
						assignment: {
							id: this.state.assignment.id,
							customerId: this.state.assignment.customerId,
							userId: this.state.assignment.userId,
							fileNumber: this.state.assignment.fileNumber,
							dueDate: event.target.value,
							notes: this.state.assignment.notes,
							contactName: this.state.assignment.contactName,
							contactPhoneNumber: this.state.assignment.contactPhoneNumber,
							contactEmail: this.state.assignment.contactEmail,
							meetingAddress: this.state.assignment.meetingAddress,
							rate: this.state.assignment.rate,
							type: this.state.assignment.type,
							status: this.state.assignment.status,
						},
					},
					() => this.validateInput()
				);
				break;
			case "notes":
				this.setState(
					{
						assignment: {
							id: this.state.assignment.id,
							customerId: this.state.assignment.customerId,
							userId: this.state.assignment.userId,
							fileNumber: this.state.assignment.fileNumber,
							dueDate: this.state.assignment.dueDate,
							notes: event.target.value,
							contactName: this.state.assignment.contactName,
							contactPhoneNumber: this.state.assignment.contactPhoneNumber,
							contactEmail: this.state.assignment.contactEmail,
							meetingAddress: this.state.assignment.meetingAddress,
							rate: this.state.assignment.rate,
							type: this.state.assignment.type,
							status: this.state.assignment.status,
						},
					},
					() => this.validateInput()
				);
				break;
			case "contactName":
				this.setState(
					{
						assignment: {
							id: this.state.assignment.id,
							customerId: this.state.assignment.customerId,
							userId: this.state.assignment.userId,
							fileNumber: this.state.assignment.fileNumber,
							dueDate: this.state.assignment.dueDate,
							notes: this.state.assignment.notes,
							contactName: event.target.value,
							contactPhoneNumber: this.state.assignment.contactPhoneNumber,
							contactEmail: this.state.assignment.contactEmail,
							meetingAddress: this.state.assignment.meetingAddress,
							rate: this.state.assignment.rate,
							type: this.state.assignment.type,
							status: this.state.assignment.status,
						},
					},
					() => this.validateInput()
				);
				break;
			case "contactPhoneNumber":
				this.setState(
					{
						assignment: {
							id: this.state.assignment.id,
							customerId: this.state.assignment.customerId,
							userId: this.state.assignment.userId,
							fileNumber: this.state.assignment.fileNumber,
							dueDate: this.state.assignment.dueDate,
							notes: this.state.assignment.notes,
							contactName: this.state.assignment.contactName,
							contactPhoneNumber: event.target.value,
							contactEmail: this.state.assignment.contactEmail,
							meetingAddress: this.state.assignment.meetingAddress,
							rate: this.state.assignment.rate,
							type: this.state.assignment.type,
							status: this.state.assignment.status,
						},
					},
					() => this.validateInput()
				);
				break;
			case "contactEmail":
				this.setState(
					{
						assignment: {
							id: this.state.assignment.id,
							customerId: this.state.assignment.customerId,
							userId: this.state.assignment.userId,
							fileNumber: this.state.assignment.fileNumber,
							dueDate: this.state.assignment.dueDate,
							notes: this.state.assignment.notes,
							contactName: this.state.assignment.contactName,
							contactPhoneNumber: this.state.assignment.contactPhoneNumber,
							contactEmail: event.target.value,
							meetingAddress: this.state.assignment.meetingAddress,
							rate: this.state.assignment.rate,
							type: this.state.assignment.type,
							status: this.state.assignment.status,
						},
					},
					() => this.validateInput()
				);
				break;
			case "meetingAddress":
				this.setState(
					{
						assignment: {
							id: this.state.assignment.id,
							customerId: this.state.assignment.customerId,
							userId: this.state.assignment.userId,
							fileNumber: this.state.assignment.fileNumber,
							dueDate: this.state.assignment.dueDate,
							notes: this.state.assignment.notes,
							contactName: this.state.assignment.contactName,
							contactPhoneNumber: this.state.assignment.contactPhoneNumber,
							contactEmail: this.state.assignment.contactEmail,
							meetingAddress: event.target.value,
							rate: this.state.assignment.rate,
							type: this.state.assignment.type,
							status: this.state.assignment.status,
						},
					},
					() => this.validateInput()
				);
				break;
			case "rate":
				this.setState(
					{
						assignment: {
							id: this.state.assignment.id,
							customerId: this.state.assignment.customerId,
							userId: this.state.assignment.userId,
							fileNumber: this.state.assignment.fileNumber,
							dueDate: this.state.assignment.dueDate,
							notes: this.state.assignment.notes,
							contactName: this.state.assignment.contactName,
							contactPhoneNumber: this.state.assignment.contactPhoneNumber,
							contactEmail: this.state.assignment.contactEmail,
							meetingAddress: this.state.assignment.meetingAddress,
							rate: event.target.value,
							type: this.state.assignment.type,
							status: this.state.assignment.status,
						},
					},
					() => this.validateInput()
				);
				break;
			case "type":
				this.setState(
					{
						assignment: {
							id: this.state.assignment.id,
							customerId: this.state.assignment.customerId,
							userId: this.state.assignment.userId,
							fileNumber: this.state.assignment.fileNumber,
							dueDate: this.state.assignment.dueDate,
							notes: this.state.assignment.notes,
							contactName: this.state.assignment.contactName,
							contactPhoneNumber: this.state.assignment.contactPhoneNumber,
							contactEmail: this.state.assignment.contactEmail,
							meetingAddress: this.state.assignment.meetingAddress,
							rate: this.state.assignment.rate,
							type: event.target.value,
							status: this.state.assignment.status,
						},
					},
					() => this.validateInput()
				);
				break;
			case "status":
				this.setState(
					{
						assignment: {
							id: this.state.assignment.id,
							customerId: this.state.assignment.customerId,
							userId: this.state.assignment.userId,
							fileNumber: this.state.assignment.fileNumber,
							dueDate: this.state.assignment.dueDate,
							notes: this.state.assignment.notes,
							contactName: this.state.assignment.contactName,
							contactPhoneNumber: this.state.assignment.contactPhoneNumber,
							contactEmail: this.state.assignment.contactEmail,
							meetingAddress: this.state.assignment.meetingAddress,
							rate: this.state.assignment.rate,
							type: this.state.assignment.type,
							status: event.target.value,
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
		const invalidFields: string[] = [];

		if (!this.state.assignment.customerId) invalidFields.push("customerId");
		if (!this.state.assignment.fileNumber) invalidFields.push("fileNumber");
		if (!this.state.assignment.dueDate) invalidFields.push("dueDate");
		if (!this.state.assignment.contactName) invalidFields.push("contactName");
		if (
			!this.state.assignment.contactPhoneNumber?.match(
				/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
			)
		)
			invalidFields.push("contactPhoneNumber");
		if (
			!this.state.assignment.contactEmail?.match(
				/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/
			)
		)
			invalidFields.push("contactEmail");
		if (!this.state.assignment.meetingAddress)
			invalidFields.push("meetingAddress");
		if (!this.state.assignment.rate) invalidFields.push("rate");
		if (!this.state.assignment.type) invalidFields.push("type");
		if (!this.state.assignment.status) invalidFields.push("status");

		if (invalidFields.length > 0) {
			this.setState({
				formValid: false,
				invalidFields: invalidFields,
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
				alertMessage: "All required fields must have an entry",
				alertColor: "danger",
			});
		}
	};

	submitInput = () => {
		if (this.state.editingAssignment) {
			this.editAssignment();
		} else {
			this.addAssignment();
		}
	};

	submitForm = () => {};

	render() {
		return (
			<Modal
				isOpen={this.props.isOpen}
				toggle={this.props.toggle}
				onOpened={this.modalDidOpen}
				onClosed={this.modalDidClose}
				size="lg"
			>
				<ModalHeader toggle={this.props.toggle}>
					{this.state.editingAssignment ? "Edit Assignment" : "Add Assignment"}
				</ModalHeader>
				<ModalBody>
					<Alert
						color={this.state.alertColor}
						isOpen={this.state.isAlertOpen}
						toggle={this.toggleAlert}
					>
						{this.state.alertMessage}
					</Alert>
					<Form onSubmit={this.handleSubmit}>
						<Row form>
							<Col>
								<FormGroup>
									<Label htmlFor="customer">Customer</Label>
									<Input
										type="select"
										name="customerId"
										id="customer"
										value={this.state.assignment.customerId}
										invalid={this.state.invalidFields.includes("customerId")}
										valid={!this.state.invalidFields.includes("customerId")}
										onChange={this.handleInputChange}
									>
										<option value={0}>Pick One</option>
										{this.state.customers.map((customer, idx) => {
											return (
												<option key={idx} value={customer.id}>
													{customer.name}
												</option>
											);
										})}
									</Input>
									<FormFeedback>Required</FormFeedback>
								</FormGroup>
							</Col>
							<Col>
								<FormGroup>
									<Label htmlFor="file-number">File Number</Label>
									<Input
										type="text"
										name="fileNumber"
										id="file-number"
										value={this.state.assignment.fileNumber}
										invalid={this.state.invalidFields.includes("fileNumber")}
										valid={!this.state.invalidFields.includes("fileNumber")}
										onChange={this.handleInputChange}
									/>
									<FormFeedback>Required</FormFeedback>
								</FormGroup>
							</Col>
							<Col>
								<FormGroup>
									<Label htmlFor="type">Assignment Type</Label>
									<Input
										type="select"
										name="type"
										id="type"
										value={this.state.assignment.type}
										invalid={this.state.invalidFields.includes("type")}
										valid={!this.state.invalidFields.includes("type")}
										onChange={this.handleInputChange}
									>
										<option value={0}>Pick One</option>
										<option value="Refinance">Refinance</option>
										<option value="HELOC">HELOC</option>
										<option value="General Notary">General Notary</option>
									</Input>
									<FormFeedback>Required</FormFeedback>
								</FormGroup>
							</Col>
						</Row>
						<Row form>
							<Col>
								<FormGroup>
									<Label htmlFor="due-date">Meeting Date/Time</Label>
									<Input
										type="datetime-local"
										name="dueDate"
										id="due-date"
										value={this.state.assignment.dueDate}
										invalid={this.state.invalidFields.includes("dueDate")}
										valid={!this.state.invalidFields.includes("dueDate")}
										onChange={this.handleInputChange}
									/>
									<FormFeedback>Required</FormFeedback>
								</FormGroup>
							</Col>
							<Col>
								<FormGroup>
									<Label htmlFor="rate">Pay Rate</Label>
									<Input
										type="text"
										name="rate"
										id="rate"
										value={this.state.assignment.rate}
										invalid={this.state.invalidFields.includes("rate")}
										valid={!this.state.invalidFields.includes("rate")}
										onChange={this.handleInputChange}
									/>
									<FormFeedback>Required</FormFeedback>
								</FormGroup>
							</Col>
							<Col>
								<FormGroup>
									<Label htmlFor="status">Assignment Status</Label>
									<Input
										type="select"
										name="status"
										id="status"
										value={this.state.assignment.status}
										invalid={this.state.invalidFields.includes("status")}
										valid={!this.state.invalidFields.includes("status")}
										onChange={this.handleInputChange}
									>
										<option value="New">New</option>
										<option value="Pending Assignment">
											Pending Assignment
										</option>
										<option value="Notary Confirmed">Notary Confirmed</option>
										<option value="Pending Staff Review">
											Pending Staff Review
										</option>
										<option value="Closed">Closed</option>
									</Input>
									<FormFeedback>Required</FormFeedback>
								</FormGroup>
							</Col>
						</Row>
						<Row form>
							<Col>
								<FormGroup>
									<Label htmlFor="contact-name">Contact Name</Label>
									<Input
										type="text"
										name="contactName"
										id="contact-name"
										value={this.state.assignment.contactName}
										invalid={this.state.invalidFields.includes("contactName")}
										valid={!this.state.invalidFields.includes("contactName")}
										onChange={this.handleInputChange}
									/>
									<FormFeedback>Required</FormFeedback>
								</FormGroup>
							</Col>
							<Col>
								<FormGroup>
									<Label htmlFor="contact-phone">Contact Phone Number</Label>
									<Input
										type="text"
										name="contactPhoneNumber"
										id="contact-phone"
										value={this.state.assignment.contactPhoneNumber}
										invalid={this.state.invalidFields.includes(
											"contactPhoneNumber"
										)}
										valid={
											!this.state.invalidFields.includes("contactPhoneNumber")
										}
										onChange={this.handleInputChange}
									/>
									<FormFeedback>Required</FormFeedback>
								</FormGroup>
							</Col>
							<Col>
								<FormGroup>
									<Label htmlFor="contact-email">Contact Email</Label>
									<Input
										type="text"
										name="contactEmail"
										id="contact-email"
										value={this.state.assignment.contactEmail}
										invalid={this.state.invalidFields.includes("contactEmail")}
										valid={!this.state.invalidFields.includes("contactEmail")}
										onChange={this.handleInputChange}
									/>
									<FormFeedback>Required</FormFeedback>
								</FormGroup>
							</Col>
						</Row>
						<Row form>
							<Col>
								<FormGroup>
									<Label htmlFor="meeting-address">Meeting Location</Label>
									<Input
										type="text"
										name="meetingAddress"
										id="meeting-address"
										value={this.state.assignment.meetingAddress}
										invalid={this.state.invalidFields.includes(
											"meetingAddress"
										)}
										valid={!this.state.invalidFields.includes("meetingAddress")}
										onChange={this.handleInputChange}
									/>
									<FormFeedback>Required</FormFeedback>
								</FormGroup>
							</Col>
						</Row>
						<Row form>
							<Col>
								<FormGroup>
									<Label htmlFor="notes">Assignment Notes</Label>
									<Input
										type="textarea"
										name="notes"
										value={this.state.assignment.notes}
										id="notes"
										valid
										onChange={this.handleInputChange}
									/>
									<FormFeedback valid>Optional</FormFeedback>
								</FormGroup>
							</Col>
						</Row>
						<Button type="submit" color="warning">
							{this.state.editingAssignment
								? "Edit Assignment"
								: "Add Assignment"}
						</Button>
					</Form>
				</ModalBody>
			</Modal>
		);
	}
}
