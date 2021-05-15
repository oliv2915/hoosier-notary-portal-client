import * as React from 'react';
/*
    UserContext
*/


const UserContext = React.createContext({});
export default UserContext;

/*
    UserContextProvider
*/

interface IUserContextProviderProps {}

interface IUserContextProviderState {
    token: string | null;
    isAuth: boolean;
    user: IUserContextUser;
}

interface IUserContextUser {
    id?: number | null;
    email?: string | null;
    firstName?: string | null;
    middleName?: string | null;
    lastName?: string | null;
    suffix?: string | null;
    phoneNumber?: string | null;
    isNotary?: boolean | null;
    isActiveNotary?: boolean | null;
    isEmployee?: boolean | null;
    isActiveEmployee?: boolean | null;
    isSuper?: boolean | null;
}

export class UserContextProvider extends React.Component<IUserContextProviderProps, IUserContextProviderState> {
    constructor(props: IUserContextProviderProps) {
        super(props)
        this.state = {
            user: {},
            token: null,
            isAuth: false
        }
    }

    componentDidMount() {
        this.setState({
            token: localStorage.getItem("token")
        })
    }

    componentDidUpdate(prevProps: IUserContextProviderProps, prevState: IUserContextProviderState) {
        if (this.state.token !== prevState.token) {
            if (this.state.token) {
                localStorage.setItem("token", this.state.token);

                fetch(`${process.env.REACT_APP_API_SERVER}/user/profile`,{
                    headers: new Headers({"Authorization": `Bearer ${this.state.token}`})
                })
                .then(res => {
                    if (res.status !== 200) {
                        this.setState({
                            token: null,
                            isAuth: false,
                            user: {}
                        });

                        localStorage.removeItem("token");
                    }

                    return res.json();
                })
                .then(data => {
                    if (data.user) {
                        this.setState({
                            isAuth: true,
                            user: data.user
                        });
                    }
                });
            } else {
                this.setState({
                    isAuth: false,
                    user: {}
                });

                localStorage.removeItem("token");
            }
        }
    }

    setToken = (token: string | null) => {
        this.setState({
            token: token
        })
    }

    render() {
        return (
            <UserContext.Provider value={{
                token: this.state.token,
                setToken: this.setToken,
                isAuth: this.state.isAuth,
                user: this.state.user
            }}>
                {this.props.children}
            </UserContext.Provider>
        )
    }
}