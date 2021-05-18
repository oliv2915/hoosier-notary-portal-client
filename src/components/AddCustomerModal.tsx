import * as React from "react";
import {
	Col,
	Form,
	Input,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Row,
	Button,
	FormFeedback,
	Alert,
} from "reactstrap";
import UserContext from "../context/UserContext";

interface IAddCustomerModalProps {
	isOpen: boolean;
	toggle: () => void;
}

export default class AddCustomerModal extends React.Component<IAddCustomerModalProps> {
	static contextType = UserContext;
	context!: React.ContextType<typeof UserContext>;
	constructor(props: IAddCustomerModalProps) {
		super(props);
	}

	modalDidOpen = () => {
		console.log("add customer modal open");
	};

	modalDidClose = () => {
		console.log("add customer modal closed");
	};

	render() {
		return (
			<Modal
				isOpen={this.props.isOpen}
				toggle={this.props.toggle}
				onOpened={this.modalDidOpen}
				onClosed={this.modalDidClose}
				size="lg"
			>
				<ModalHeader toggle={this.props.toggle}>Add Customer</ModalHeader>
				<ModalBody>Customer Form</ModalBody>
			</Modal>
		);
	}
}
