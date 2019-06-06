import React from 'react';
import { Redirect } from 'react-router-dom';
import RequestHelper from '../helpers/request-helper';
import '../css/Room.css';

import images from '../images/user.png';

export default class Room extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToLogin: false,
            rooms: [],
        };
        this.createRoom = this.createRoom.bind(this);
        this.logout = this.logout.bind(this);
    }

    async componentDidMount() {
        try {
            console.log('here');
            // const token = localStorage.getItem('access_token');
            // if (!token) {
            //     this.setState({
            //         redirectToLogin: true
            //     });
            // }   
            const rooms = await RequestHelper.get('/api/v1/rooms');
            this.setState({
                rooms
            });
        } catch (error) {
            // localStorage.clear();
            // this.setState({
            //     redirectToLogin: true
            // })
        }
    }

    createRoom() {

    }

    logout() {
        localStorage.clear();
        this.setState({
            redirectToLogin: true
        });
    }

    render() {
        return (
            <div className="d-flex flex-column h-100">
                {this.state.redirectToLogin && (
                    <Redirect to="/" />
                )}
                <div className="d-flex p-3 justify-content-between">
                    <div>
                        <button className="btn border rounded-0 text-white" onClick={this.createRoom}>
                            Create Room
                        </button>
                    </div>
                    <div>
                        <button className="btn border rounded-0 text-white" onClick={this.logout}>
                            Logout
                        </button>
                    </div>
                </div>
                <div className="wrapper border-top">
                    <div className="group-list">
                        <div className="header">
                            <img src={images} />
                            <h3>{localStorage.getItem('username')}</h3>
                        </div>
                        <div className="search">
                            <input type="text" id="search" placeholder="Tìm kiếm tin nhắn" />
                        </div>
                        <div className="list">
                            <div className="group">
                                <img src={images} />
                                <div className="info">
                                    <p>Ngọc Sơn</p>
                                    <span>Hello</span>
                                    <span className="time">10:45</span>
                                </div>
                            </div>

                            <div className="group">
                                <img src={images} />
                                <div className="info">
                                    <p>Ngọc Sơn</p>
                                    <span>Hello</span>
                                    <span className="time">10:45</span>
                                </div>
                            </div>

                            <div className="group">
                                <img src={images} />
                                <div className="info">
                                    <p>Ngọc Sơn</p>
                                    <span>Hello</span>
                                    <span className="time">10:45</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="chat-box">
                        <div className="header">
                            <div className="info">
                                <img src={images} />
                                <p>Ngọc Sơn</p>
                            </div>
                        </div>
                        <div className="list">
                            <div className="message">
                                <p>This is a generator for text fonts of the "cool" variety. I noticed people were trying to find a generator like fancy letters, but were ending up on actual font sites</p>
                                <span>15:10</span>
                            </div>
                            <div className="message me">
                                <p>This is a generator for text fonts of the "cool" variety.</p>
                                <span>15:15</span>
                            </div>
                        </div>
                        <div className="box">
                            <input type="text" placeholder="Nhập tin nhắn" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
};
