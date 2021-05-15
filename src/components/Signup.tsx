import * as React from 'react';
import Logo from "../assets/logo.svg";
import { Card, CardTitle, CardBody, Form, Col, Row, Button, Input, FormFeedback, Alert } from 'reactstrap';
import UserContext from "../context/UserContext";

interface ISignupProps {
}

interface ISignupState {
  user: ISignupUser;
  invalidFields: string[];
  formValid: boolean;
  isAlertOpen?: boolean;
  alertMessage?: string;
  alertColor?: string;
}

export interface ISignupUser {
  firstName: string | null,
  middleName?: string | null,
  lastName: string | null,
  suffix?: string | null,
  phoneNumber: string | null,
  email: string | null,
  password: string | null,
  confirmPassword: string | null
}

export default class Signup extends React.Component<ISignupProps, ISignupState> {
  static contextType = UserContext;
    constructor(props: ISignupProps) {
      super(props);
      this.state = {
        user: {
          firstName: null,
          middleName: null,
          lastName: null,
          suffix: null,
          phoneNumber: null,
          email: null,
          password: null,
          confirmPassword: null
        },
        invalidFields: [],
        formValid: false,
        isAlertOpen: false
      }
    }
    
    handleInputChange = (event: React.BaseSyntheticEvent) => {
      // update the state that has a change to it
      switch (event.target.name) {
        case "firstName":
            this.setState({
              user: {
                firstName: event.target.value,
                middleName: this.state.user.middleName,
                lastName: this.state.user.lastName,
                suffix: this.state.user.suffix,
                phoneNumber: this.state.user.phoneNumber,
                email: this.state.user.email,
                password: this.state.user.password,
                confirmPassword: this.state.user.confirmPassword
              }
            }, () => this.validateFormInputs())
          break;
        case "middleName":
            this.setState({
              user: {
                firstName: this.state.user.firstName,
                middleName: event.target.value,
                lastName: this.state.user.lastName,
                suffix: this.state.user.suffix,
                phoneNumber: this.state.user.phoneNumber,
                email: this.state.user.email,
                password: this.state.user.password,
                confirmPassword: this.state.user.confirmPassword
              }
            }, () => this.validateFormInputs())
          break;
        case "lastName":
            this.setState({
              user: {
                firstName: this.state.user.firstName,
                middleName: this.state.user.middleName,
                lastName: event.target.value,
                suffix: this.state.user.suffix,
                phoneNumber: this.state.user.phoneNumber,
                email: this.state.user.email,
                password: this.state.user.password,
                confirmPassword: this.state.user.confirmPassword
              }
            }, () => this.validateFormInputs())
          break;
        case "suffix":
            this.setState({
              user: {
                firstName: this.state.user.firstName,
                middleName: this.state.user.middleName,
                lastName: this.state.user.lastName,
                suffix: event.target.value,
                phoneNumber: this.state.user.phoneNumber,
                email: this.state.user.email,
                password: this.state.user.password,
                confirmPassword: this.state.user.confirmPassword
              }
            }, () => this.validateFormInputs())
          break;
        case "phoneNumber":
            this.setState({
              user: {
                firstName: this.state.user.firstName,
                middleName: this.state.user.middleName,
                lastName: this.state.user.lastName,
                suffix: this.state.user.suffix,
                phoneNumber: event.target.value,
                email: this.state.user.email,
                password: this.state.user.password,
                confirmPassword: this.state.user.confirmPassword
              }
            }, () => this.validateFormInputs())
          break;
        case "email":
            this.setState({
              user: {
                firstName: this.state.user.firstName,
                middleName: this.state.user.middleName,
                lastName: this.state.user.lastName,
                suffix: this.state.user.suffix,
                phoneNumber: this.state.user.phoneNumber,
                email: event.target.value,
                password: this.state.user.password,
                confirmPassword: this.state.user.confirmPassword
              }
            }, () => this.validateFormInputs())
          break;
        case "password":
            this.setState({
              user: {
                firstName: this.state.user.firstName,
                middleName: this.state.user.middleName,
                lastName: this.state.user.lastName,
                suffix: this.state.user.suffix,
                phoneNumber: this.state.user.phoneNumber,
                email: this.state.user.email,
                password: event.target.value,
                confirmPassword: this.state.user.confirmPassword
              }
            }, () => this.validateFormInputs())
          break;
        case "confirmPassword":
            this.setState({
              user: {
                firstName: this.state.user.firstName,
                middleName: this.state.user.middleName,
                lastName: this.state.user.lastName,
                suffix: this.state.user.suffix,
                phoneNumber: this.state.user.phoneNumber,
                email: this.state.user.email,
                password: this.state.user.password,
                confirmPassword: event.target.value
              }
            }, () => this.validateFormInputs())
          break;
        default:
          break;
      }
    }

    validateFormInputs = () => {
      const invalidFields: string[] = [];
      if (!this.state.user.firstName) invalidFields.push("firstName");
      if (!this.state.user.lastName) invalidFields.push("lastName");
      if (!this.state.user.phoneNumber?.match(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)) invalidFields.push("phoneNumber");
      if (!this.state.user.email?.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/)) invalidFields.push("email");
      if (!this.state.user.password?.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/)) invalidFields.push("password");
      if ((this.state.user.password !== this.state.user.confirmPassword) || !this.state.user.confirmPassword) invalidFields.push("noMatch");
      if (invalidFields.length > 0) {
        this.setState({
          formValid: false,
          invalidFields: invalidFields
        })
      } else {
        this.setState({
          formValid: true,
          invalidFields: []
        })
      }
    }

    handleSignUpSubmit = (event: React.BaseSyntheticEvent) => {
      event.preventDefault();
      this.validateFormInputs();
      if (this.state.formValid) {
        this.submitFormData();
      } else {
        console.log("form not valid")
      }
    }

    submitFormData = () => {
      fetch(`${process.env.REACT_APP_API_SERVER}/user/register`, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json"
        }),
        body: JSON.stringify({
          user: this.state.user
        })
      })
      .then(res => {
        // check for bad res
        if (res.status !== 201) {
          if (res.status === 409) return this.setState({
            alertMessage: "Email already in use",
            alertColor: "danger"
          }, () => {
            if (!this.state.isAlertOpen) {
              return this.toggleAlert();
            }
          })
        }
        // res is ok
        this.setState({
          alertColor: "success",
          alertMessage: "Registered Successfully"
        }, () => {
          if (!this.state.isAlertOpen) {
            return this.toggleAlert();
          }
        })
        return res.json();
      })
      .then(data => {
        if (!data) return;
        if (data.token) this.context.setToken(data.token);
      })
    }

    componentDidMount() {
      this.validateFormInputs();
    }

    toggleAlert = () => {
      this.setState({
        isAlertOpen: !this.state.isAlertOpen
      })
    }

    render() {
        return (
          <div className="d-flex justify-content-center mt-5">
            <Card style={{width: "75%"}}>
              <CardTitle className="text-center">
                <h1>Sign Up</h1>
              </CardTitle>
              <img src={Logo} alt="logo" style={{width: "25%", margin: "auto"}}/>
              <CardBody>
                <Alert color={this.state.alertColor} isOpen={this.state.isAlertOpen} toggle={this.toggleAlert}>{this.state.alertMessage}</Alert>
                <Form onSubmit={this.handleSignUpSubmit}>
                  <Row form className="mb-3">
                    <Col>
                      <Input invalid={this.state.invalidFields.includes("firstName")} valid={!this.state.invalidFields.includes("firstName")} type="text" name="firstName" placeholder="First Name" onChange={this.handleInputChange}/>
                      <FormFeedback>Required</FormFeedback>
                    </Col>
                    <Col>
                      <Input valid  type="text" name="middleName" placeholder="Middle Name" onChange={this.handleInputChange}/>
                    </Col>
                    <Col>
                      <Input invalid={this.state.invalidFields.includes("lastName")} valid={!this.state.invalidFields.includes("lastName")} type="text" name="lastName" placeholder="Last Name" onChange={this.handleInputChange}/>
                      <FormFeedback>Required</FormFeedback>
                    </Col>
                    <Col>
                      <Input valid type="text" name="suffix" placeholder="Suffix" onChange={this.handleInputChange}/>
                    </Col>
                  </Row>
                  <Row form className="mb-3">
                    <Col>
                      <Input invalid={this.state.invalidFields.includes("email")} valid={!this.state.invalidFields.includes("email")} type="email" name="email" placeholder="Email Address" onChange={this.handleInputChange}/>
                      <FormFeedback>Required</FormFeedback>
                    </Col>
                    <Col>
                      <Input invalid={this.state.invalidFields.includes("phoneNumber")} valid={!this.state.invalidFields.includes("phoneNumber")} type="tel" name="phoneNumber" placeholder="Phone Number" onChange={this.handleInputChange}/>
                      <FormFeedback>Required</FormFeedback>
                    </Col>
                  </Row>
                  <Row form className="mb-3">
                    <Col>
                      <Input invalid={this.state.invalidFields.includes("password")} valid={!this.state.invalidFields.includes("password")} type="password" name="password" placeholder="Password" onChange={this.handleInputChange}/>
                      <FormFeedback>Required (Must be a minimum 8 characters long, have 1 lower and upper case letter, have 1 number and special character)</FormFeedback>
                    </Col>
                    <Col>
                      <Input invalid={this.state.invalidFields.includes("noMatch")} valid={!this.state.invalidFields.includes("noMatch")} type="password" name="confirmPassword" placeholder="Confirm Password" onChange={this.handleInputChange}/>
                      <FormFeedback>Passwords don't match </FormFeedback>
                    </Col>
                  </Row>
                  <Button color="primary" type="submit">Sign Up</Button>
                </Form>
              </CardBody>
            </Card>
          </div>
        );
    }
}
