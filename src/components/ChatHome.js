import { useEffect, useState } from "react";
import axios from "axios";
import { getLastMsgText, formatDate, findSearchQuery } from "../utils";
import { v4 as uuid } from "uuid";
import "./ChatHome.scss";
const ChatHome = () => {
  const [chatList, setChatList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [msgText, setMsgText] = useState("");
  const fetchChats = () => {
    setIsLoading(true);
    axios
      .get("https://my-json-server.typicode.com/codebuds-fk/chat/chats")
      .then((res) => {
        // console.log(res?.data);
        setChatList(res?.data);
        setIsLoading(false);
      });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleNewMsg = (e) => {
    setMsgText(e.target.value);
  };

  const selectChat = (chat) => {
    setSelectedChat(chat);
  };

  const addMsg = () => {
    const tempChatList = [...chatList].map((chat) => {
      if (chat.id === selectedChat.id) {
        chat.messageList.push({
          messageId: uuid(),
          message: msgText,
          timestamp: Date.now(),
          sender: "USER",
          messageType: "text",
        });
      }
      return chat;
    });
    setChatList(tempChatList);
  };

  const addOptionedMsg = (selectedOption, msgIndex) => {
    if (msgIndex !== selectedChat.messageList.length - 1) return;
    const tempChatList = [...chatList].map((chat) => {
      if (chat.id === selectedChat.id) {
        chat.messageList.push({
          messageId: uuid(),
          message: selectedOption,
          timestamp: Date.now(),
          sender: "USER",
          messageType: "text",
        });
      }
      return chat;
    });
    setChatList(tempChatList);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  if (isLoading) return "Loading";
  return (
    <div className="chat-page" style={{ display: "flex" }}>
      <div className="chat-list">
        <div>Filter by title/orderID</div>
        <input type="text" value={searchQuery} onChange={handleSearch} />
        {chatList
          ?.filter((chat) => findSearchQuery(chat, searchQuery))
          ?.map((chat) => {
            return (
              <div
                className="chat-thread"
                key={chat.id}
                onClick={() => {
                  selectChat(chat);
                }}
              >
                <img
                  className="chat-icon"
                  src={chat?.imageURL}
                  alt={chat.title}
                />
                <div>
                  <div className="chat-title">
                    <h2>{chat.title}</h2>
                    <p className="chat-title">
                      {formatDate(chat.latestMessageTimestamp)}
                    </p>
                  </div>
                  <h3 className="order-id">{chat.orderId}</h3>
                  <h5 className="last-msg">{getLastMsgText(chat)}</h5>
                </div>
              </div>
            );
          })}
      </div>
      <div className="chat-window">
        {selectedChat ? (
          <div>
            <div>
              <img
                src={selectedChat?.imageURL}
                alt={selectedChat.title}
                style={{ width: 40 }}
              />
              <h2>{selectedChat.title}</h2>
            </div>
            <div>
              {selectedChat?.messageList?.map((msg, msgIndex) => {
                return (
                  <div
                    key={msg?.messageId}
                    style={{
                      textAlign: msg?.sender === "USER" ? "right" : "left",
                    }}
                  >
                    {msg?.messageType === "optionedMessage" ? (
                      <div>
                        <h2>{msg?.message}</h2>
                        {msg?.options?.map((option, index) => {
                          return (
                            <h3
                              key={index}
                              onClick={() =>
                                addOptionedMsg(option?.optionText, msgIndex)
                              }
                            >
                              {option?.optionText}
                            </h3>
                          );
                        })}
                      </div>
                    ) : (
                      <div>
                        <h3>{msg?.message}</h3>
                        <h6>{formatDate(msg?.timestamp)}</h6>
                      </div>
                    )}
                  </div>
                );
              })}
              {selectChat && (
                <div>
                  <input type="text" value={msgText} onChange={handleNewMsg} />
                  <button onClick={addMsg}>Send</button>
                </div>
              )}
            </div>
          </div>
        ) : (
          "Select chat to continue"
        )}
      </div>
    </div>
  );
};
export default ChatHome;
