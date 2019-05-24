import React, { Component } from 'react';
import User from './User';
import Message from './Message';

export default class Chat extends Component {
    state = {
        users: [],
        messages: [],
        notification: null,
    };

    componentWillMount() {
        const { socket } = this.props;

        socket.on('connect', () => {
            let messages = [
                {
                    user: 'Status',
                    message: 'Connected',
                    background: 'info',
                    text: 'white',
                },
            ];

            if (localStorage.messages) {
                const parsedMessages = JSON.parse(localStorage.messages);
                messages = [...messages, ...parsedMessages];
            }

            this.setState({ messages });
        });

        socket.on('users', users => {
            this.setState({ users });
        });

        socket.on('user-connected', user => {
            this.setState({
                users: [...this.state.users, user],
            });
        });

        socket.on('user-disconnected', id => {
            this.setState({
                users: [...this.state.users].filter(user => user.id !== id),
            });
        });

        /* socket.on('message-to-long', () => {
      this.setState({
        messages: [
          ...this.state.messages,
          {
            user: 'Error',
            message: 'Message is too long',
            background: 'danger',
            text: 'white',
          },
        ],
      });
    }); */

        socket.on('message', ({ user, message, date }) => {
            this.setState({
                messages: [
                    ...this.state.messages,
                    {
                        user,
                        message,
                        date,
                    },
                ],
            });

            if (user.id !== socket.id) {
                this.notify(user.name, message);
            }

            localStorage.messages = JSON.stringify(
                this.state.messages.slice(1)
            );
        });
    }

    notify = (name, message) => {
        if (!window.Notification || document.hasFocus()) return;
        else if (Notification.permission !== `denied`) {
            const notification = new Notification(`New Message`, {
                body: `${name}: ${message}`,
            });

            // eslint-disable-next-line no-sequences
            notification.onclick = () => (window.focus(), notification.close());

            if (this.state.notification !== null) {
                this.state.notification.close();
            }

            this.setState({ notification });
            document.onfocus = notification.close;
        }
    };

    onKeyDown = e => {
        if (!e.ctrlKey && !e.shiftKey && e.keyCode === 13) {
            e.preventDefault();
        }
    };

    onKeyUp = e => {
        if (!e.ctrlKey && !e.shiftKey && e.keyCode === 13) {
            this.onClick();
        }
    };

    onClick = () => {
        this.props.socket.emit('message', this.textarea.value);
        this.textarea.value = '';
        this.textarea.focus();
    };

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-3 border-right border-secondary d-none d-md-block">
                        <h3 className="mb-3">Online Users</h3>
                        <ul className="list-group users">
                            {this.state.users.map((user, index) => (
                                <User key={index} user={user} />
                            ))}
                        </ul>
                    </div>
                    <div className="col-12 col-md-9">
                        <div
                            className="messages"
                            ref={messagesDiv =>
                                (this.messagesDiv = messagesDiv)
                            }
                        >
                            {this.state.messages.length === 0 ? (
                                <Message
                                    message={{ message: 'Connecting...' }}
                                />
                            ) : (
                                this.state.messages.map((message, index) => (
                                    <Message
                                        key={index}
                                        message={message}
                                        messagesDiv={this.messagesDiv}
                                    />
                                ))
                            )}
                        </div>
                        <hr className="border-top border-secondary" />
                        <div className="send-message mt-3">
                            <div className="form-group">
                                <label htmlFor="message-content">Message</label>
                                <textarea
                                    ref={textarea => (this.textarea = textarea)}
                                    className="form-control"
                                    id="message-content"
                                    rows="3"
                                    onKeyDown={this.onKeyDown}
                                    onKeyUp={this.onKeyUp}
                                />
                            </div>
                            <button
                                className="btn btn-primary"
                                onClick={this.onClick}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
