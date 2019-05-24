import React, { Component } from 'react';

export default class Header extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-5">
                <div className="container">
                    <label className="navbar-brand">Lungers Chat</label>
                </div>
            </nav>
        );
    }
}
