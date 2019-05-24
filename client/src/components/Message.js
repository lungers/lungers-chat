import React, { Component } from 'react';
import markdown from '../Markdown';

export default class Message extends Component {
    componentDidMount() {
        const scrollType = this.props.scrollType || 'smooth';
        this.message.scrollIntoView({ behavior: scrollType });
    }

    getMessageClass = () => {
        const { background = 'light', text = 'black' } = this.props.message;
        return `message bg-${background} text-${text} rounded px-3 py-2 mb-2`;
    };

    render() {
        const { user, message, date } = this.props.message;
        const localeDate = new Date(date).toLocaleString();
        const title = user && date ? `${user.name} (${localeDate})`.trim() : '';

        return (
            <div
                className={this.getMessageClass()}
                ref={message => (this.message = message)}
            >
                <div className="font-weight-bold">{title}</div>
                {markdown(message)}
            </div>
        );
    }
}
