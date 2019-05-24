import React, { Component } from 'react';

export default class User extends Component {
    render() {
        const { user } = this.props;

        return <div className="list-group-item user">{user.name}</div>;
    }
}
