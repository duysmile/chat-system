import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import RequestHelper from '../helpers/request-helper';
import moment from 'moment';
import '../css/Room.css';

import images from '../images/user.png';

export default class Room extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToLogin: false,
            rooms: [],
            room: {
                messages: []
            },
            roomId: '',
            author: localStorage.getItem('userId')
        };
        this.createRoom = this.createRoom.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.id !== this.state.roomId) {
            const roomId = nextProps.match.params.id;
            console.log('here', roomId);  
            this.setState({
                roomId
            });
        }
        return true;
    }

    async componentDidMount() {
        try {
            // const token = localStorage.getItem('access_token');
            // if (!token) {
            //     this.setState({
            //         redirectToLogin: true
            //     });
            // }
            const roomId = this.state.roomId;
            if (roomId) {
                const dataRoom = await RequestHelper.get(`/api/v1/rooms/${roomId}`);
                this.setState({
                    room: dataRoom.data
                });
                console.log(dataRoom.data.data.messages)
            }

            const dataRooms = await RequestHelper.get('/api/v1/rooms');
            this.setState({
                rooms: dataRooms.data
            });
        } catch (error) {
            console.log(error.response.data);
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

    formatTime(time) {
        const formatTime = moment(time);
        const now = moment();
        if (now.isSame(formatTime, 'day')) {
            return formatTime.format('HH:mm');
        }
        return formatTime.format('DD [Tháng] MM');
    }

    render() {
        let messages = this.state.room ? [...this.state.room.messages] : [];
        messages = messages.reverse();
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
                            <img src={images} alt="user-avatar"/>
                            <h3>{localStorage.getItem('username')}</h3>
                        </div>
                        <div className="search">
                            <input type="text" id="search" placeholder="Tìm kiếm tin nhắn" />
                        </div>
                        <div className="list">
                            {this.state.rooms.map((room, index) => (
                                <div className="group" key={index}>
                                    <img src={images} alt="user-avatar"/>
                                    <div className="info">
                                        <Link to={`/rooms/${room._id}`}>
                                            <p>{room.name}</p>
                                            <div className="d-flex">
                                                <span className="text-content text-truncate">{room.lastMessage.content}</span>
                                                <span className="time">{this.formatTime(room.lastMessage.createdAt)}</span>
                                            </div>
                                        </Link>
                                    </div>
                                </div>    
                            ))}
                        </div>
                    </div>
                    <div className="chat-box">
                        <div className="header">
                            <div className="info">
                                <img src={images} alt="user-avatar"/>
                                <p>{this.state.room.name}</p>
                            </div>
                        </div>
                        <div className="list">
                            {messages.map((message, index) => (
                                <div key={index} className={"message " + (message.author._id === this.state.author ? "me" : "")}>
                                    <p>{message.content}</p>
                                    <span>{this.formatTime(message.createdAt)}</span>
                                </div>
                            ))}
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
