import { useState } from 'react';
import io from 'socket.io-client';
import Chat from './Chat';
import styles from './joinChat.module.scss';

const socket = io.connect('http://localhost:3001');

const JoinChat = () => {
  const [userName, setUserName] = useState('');
  const [room, setRoom] = useState('');
  const [showChat, setShowChat] = useState(false);

  const handleChangeName = (e) => {
    const { value } = e.currentTarget;
    setUserName(value);
  };

  const handleChangeRoom = (e) => {
    const { value } = e.currentTarget;
    setRoom(value);
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();

    if (userName !== '' && room !== '') {
      socket.emit('join_room', room);
      setShowChat(true);
    }
  };

  return (
    <div className={styles.JoinChat}>
      {showChat ? (
        <Chat socket={socket} userName={userName} room={room} />
      ) : (
        <div className={styles.joinChatContainer}>
          <h2>Join A Chat</h2>
          <input type='text' placeholder='이름을 입력해주세요' onChange={handleChangeName} />
          <input type='text' placeholder='방 아이디를 입력해주세요' onChange={handleChangeRoom} />
          <button type='submit' onClick={handleJoinRoom}>
            join
          </button>
        </div>
      )}
    </div>
  );
};

export default JoinChat;
