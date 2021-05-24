import * as React from "react";
import { IUserContextUser } from "../interfaces";
/*
    UserContext
*/

interface IUserContext {
	token: string | null;
	isAuth: boolean;
	user: IUserContextUser;
	setToken: (token: string | null) => void;
	updateUserContext: () => void;
}

const UserContext = React.createContext<IUserContext>({
	user: {},
	token: null,
	isAuth: false,
	setToken: (token: string | null) => {},
	updateUserContext: () => {},
});
export default UserContext;

/*
    UserContextProvider
*/

interface IUserContextProviderProps {}

interface IUserContextProviderState {
	user: IUserContextUser;
	token: string | null;
	isAuth: boolean;
	isLoading: boolean;
}

export class UserContextProvider extends React.Component<
	IUserContextProviderProps,
	IUserContextProviderState
> {
	constructor(props: IUserContextProviderProps) {
		super(props);
		this.state = {
			user: {},
			token: localStorage.getItem("token"),
			isAuth: false,
			isLoading: true,
		};
	}

	componentDidMount() {
		this.validateToken();
	}

	componentDidUpdate(
		prevProps: IUserContextProviderProps,
		prevState: IUserContextProviderState
	) {
		if (this.state.token !== prevState.token) {
			this.validateToken();
		}
	}

	validateToken = () => {
		if (this.state.token) {
			localStorage.setItem("token", this.state.token);

			fetch(`${process.env.REACT_APP_API_SERVER}/user/profile`, {
				headers: new Headers({ Authorization: `Bearer ${this.state.token}` }),
			})
				.then((res) => {
					if (res.status !== 200) {
						this.setState({
							token: null,
							isAuth: false,
							user: {},
							isLoading: false,
						});

						localStorage.removeItem("token");
					}

					return res.json();
				})
				.then((data) => {
					if (data.user) {
						this.setState({
							isAuth: true,
							user: data.user,
							isLoading: false,
						});
					}
				});
		} else {
			this.setState({
				isAuth: false,
				user: {},
				isLoading: false,
			});

			localStorage.removeItem("token");
		}
	};

	setToken = (token: string | null) => {
		this.setState({
			token: token,
		});
	};

	render() {
		return (
			<UserContext.Provider
				value={{
					token: this.state.token,
					isAuth: this.state.isAuth,
					user: this.state.user,
					setToken: this.setToken,
					updateUserContext: this.validateToken,
				}}
			>
				{/* if finished validating token, show children */}
				{!this.state.isLoading && this.props.children}
			</UserContext.Provider>
		);
	}
}
