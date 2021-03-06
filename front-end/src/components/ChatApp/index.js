import React, { useRef, useEffect, useState } from 'react';
import { MdSend, MdClose } from 'react-icons/md';
import { IoIosChatbubbles } from 'react-icons/io';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './chatapp.scss';
import { isMe } from 'src/store/selectors';

const ChatApp = ({
  chatMessage,
  newMessage,
  submitMessage,
  fetchMessages,
  messages,
  sessionUserId,
}) => {
  const chatZone = useRef(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    chatZone.current.scrollBy(0, chatZone.current.scrollHeight);
  });

  const handleChange = (event) => {
    const { value } = event.target;
    newMessage(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitMessage();
  };

  const [maximizeChat = false, setMaximizeChat] = useState('');
  const [statusChat = false, setStatusChat] = useState('');

  const handleClickWidget = () => (maximizeChat ? (setMaximizeChat(false), setStatusChat(false)) : (setMaximizeChat(true), setStatusChat(true)));

  return (
    <>
      <div className={
        classNames(
          { chat: true },
          { 'chat-minimize': !maximizeChat },
        )
      }
      >
        <div className={
          classNames(
            { 'chat-display': maximizeChat },
            { 'chat-display-none': !maximizeChat },
          )
        }
        >
          <div className="chat-title">Chat</div>
          <div ref={chatZone} className="chat-body">
            {messages.map(({
              id,
              content,
              createdAt,
              user: {
                id: userId,
                handle,
              },
            }) => {
              const itsMe = isMe(userId, sessionUserId);
              return (
                <div
                  key={id} 
                  className={
                    classNames(
                      'chat-body-message',
                      { 'chat-body-message--not-mine': !itsMe },
                    )
                  }
                >
                  <div className="chat-body-message-author">{handle}</div>
                  <p className="chat-body-message-content">{content}</p>
                </div>
              );
            })}
          </div>
          <div className="chat-footer">
            <form
              className="chat-footer-form"
              onSubmit={handleSubmit}
            >
              <input
                // value={/* une valeur venant du state */}
                // onChange={/* émettre une changement dans le state */}
                onChange={handleChange}
                value={chatMessage}
                className="chat-footer-form-input"
                placeholder="Partage ta réaction"
              />
              <button className="chat-footer-form-submit" type="submit">
                <MdSend />
              </button>
            </form>
          </div>
        </div>
      </div>
      {!statusChat && <div onClick={handleClickWidget} className="chat-widget"><IoIosChatbubbles /></div>}
      {statusChat && <div onClick={handleClickWidget} className="chat-widget"><MdClose /></div>}
    </>
  );
};

ChatApp.propTypes = {
  sessionUserId: PropTypes.number.isRequired,
  fetchMessages: PropTypes.func.isRequired,
  chatMessage: PropTypes.string,
  newMessage: PropTypes.func.isRequired,
  submitMessage: PropTypes.func.isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      content: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      user: PropTypes.shape({
        id: PropTypes.number.isRequired,
        handle: PropTypes.string.isRequired,
      }).isRequired,
    }),
  ).isRequired,
};

ChatApp.defaultProps = {
  chatMessage: '',
};

export default ChatApp;
