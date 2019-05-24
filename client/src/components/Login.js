import React, { Component } from 'react';

export default class Login extends Component {
    state = {
        name: '',
        room: '',
    };

    componentWillMount() {
        if (localStorage.name) {
            this.setState({ name: localStorage.name });
        }
    }

    inputChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    login = () => {
        const { name, room } = this.state;

        localStorage.name = name;
        this.props.login(name, room);
    };

    render() {
        return (
            <div className="container">
                <div className="log-in">
                    <div className="row">
                        <div className="col-6">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                className="form-control mb-2"
                                id="name"
                                placeholder="Enter your name"
                                value={this.state.name}
                                onChange={e => this.inputChange(e)}
                            />
                        </div>
                        <div className="col-6">
                            <label htmlFor="room">Room</label>
                            <input
                                type="text"
                                className="form-control"
                                id="room"
                                placeholder="Choose a room"
                                value={this.state.room}
                                onChange={e => this.inputChange(e)}
                            />
                        </div>
                        <div className="col-12 mt-1">
                            <button
                                className="btn btn-primary"
                                onClick={() => this.login()}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
