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

interface IAddAssignmentModalProps {
	isOpen: boolean;
	toggle: () => void;
}

export default class AddAssignmentModal extends React.Component<IAddAssignmentModalProps> {
	static contextType = UserContext;
	context!: React.ContextType<typeof UserContext>;
	constructor(props: IAddAssignmentModalProps) {
		super(props);
	}

	modalDidOpen = () => {
		console.log("add assignment modal open");
	};

	modalDidClose = () => {
		console.log("add assignment modal closed");
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
				<ModalHeader toggle={this.props.toggle}>Add Assignment</ModalHeader>
				<ModalBody>Assignment Form</ModalBody>
			</Modal>
		);
	}
}
