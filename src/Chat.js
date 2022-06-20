import { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import styles from './joinChat.module.scss';

const Chat = ({ socket, userName, room }) => {
  const [currnetMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [isChat, setIsChat] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (currnetMessage !== '') {
      const messageData = {
        room: room,
        author: userName,
        message: currnetMessage,
        time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
      };

      await socket.emit('send_message', messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage('');
      setIsChat(false);
    }
  };

  const handleChangeCurrentMessage = (e) => {
    const { value } = e.currentTarget;
    setCurrentMessage(value);
    if (value !== '') {
      setIsChat(true);
    } else {
      setIsChat(false);
    }
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, []);

  return (
    <main className={styles.chatWindow}>
      <article className={styles.chatBody}>
        <ScrollToBottom className={styles.messageContainer}>
          {messageList.map((item) => {
            return (
              <div
                className={`${styles.messageWrap} ${userName === item.author ? `${styles.other}` : `${styles.you}`}`}
                id={userName === item.author ? `other` : `you`}
                key={Math.random() * 1000}
              >
                <p className={styles.author}>{item.author}</p>

                <div className={styles.messageContent}>
                  <p className={styles.message}>{item.message}</p>
                  <span className={styles.time}>{item.time}</span>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </article>
      <article className={styles.chatBottom}>
        <textarea type='text' value={currnetMessage} placeholder='hey...' onChange={handleChangeCurrentMessage} />
        <button type='submit' className={isChat ? `${styles.active}` : ''} onClick={handleSendMessage}>
          전송
        </button>
      </article>
    </main>
  );
};

export default Chat;
