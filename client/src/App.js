import React, { Component } from 'react';
import io from 'socket.io-client';
import Header from './components/Header';
import Login from './components/Login';
import Chat from './components/Chat';
import './App.css';
import './bootstrap.css';
import './highlight.css';

const SOCKET_API_URL = 'http://localhost:5000';

export default class App extends Component {
    state = {
        socket: null,
        message: null,
    };

    componentDidMount() {
        if (window.Notification) {
            Notification.requestPermission();
        }
    }

    login = (name, room) => {
        const socket = io.connect(SOCKET_API_URL);

        socket.on('name-taken', () => {
            this.setState({
                socket: null,
                message: 'Name is already taken.',
            });
        });

        socket.on('message-to-long', () => {
            this.setState({
                message: 'The message is too long.',
            });
        });

        // socket.on('disconnect', () => {
        //   this.setState({
        //     socket: null,
        //     message: this.state.message || 'You have been disconnected.',
        //   });
        // });

        socket.emit('join', { name, room });

        this.setState({
            socket,
            message: null,
        });
    };

    render() {
        const { socket, message } = this.state;

        return (
            <div>
                <Header />

                {message ? (
                    <div className="container">
                        <div className="alert alert-dismissible alert-danger">
                            {message}
                        </div>
                    </div>
                ) : null}

                {socket === null ? (
                    <Login login={this.login} />
                ) : (
                    <Chat socket={this.state.socket} />
                )}
            </div>
        );
    }
}
