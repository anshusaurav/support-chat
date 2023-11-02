export const getLastMsgText = (chat) => {
  const chatLen = chat.messageList.length;
  if (chatLen > 0) {
    return chat.messageList[chatLen - 1].message;
  }
  return null;
};

export const formatDate = (dt) => {
  return new Date(dt).toLocaleDateString();
};

export const findSearchQuery = (chat = {}, query) => {
  return (
    chat?.title?.toLowerCase().includes(query.toLowerCase()) ||
    chat?.orderId.toLowerCase().includes(query.toLowerCase())
  );
};
