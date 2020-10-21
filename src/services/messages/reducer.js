const initialMessagesState = {
  messageData: null,
  messageCount: null,
  messageSendStatus: "resolved",
  isSendMessage: false,
  isDisabled: false,
  messageGetStatus: "idle",
  isSendMessageYourself: false,
  lastMessagesData: null
};
  
function messagesReducer(state = initialMessagesState, action) {
  switch (action.type) {
    case "messageSendRequest/buttonIsDisabled":
      return {
        ...state,
        isDisabled: true
      };
    case "messageSendRequest/resolved":
      return {
        ...state,
        messageSendStatus: "resolved",
        isSendMessage: true
      };
    case "messageSendRequest/yourself":
      return {
        ...state,
        isSendMessageYourself: true
      };  
    case "messageSendRequest/rejected":
      return {
        ...state,
        messageSendStatus: "rejected",
        isDisabled: false
      };
    case "messageSendRequest/info":
      return {
        ...state,
        isSendMessageYourself: false,
        isSendMessage: false,
        isDisabled: false
      };
    case "messageGetRequest/resolved":
      return {
        ...state,
        messageGetStatus: "resolved",
        messageData: action.payload,
      };
    case "countGetRequest/resolved":
      return {
        ...state,
        messageGetStatus: "resolved",
        messageCount: action.payload
      };  
    case "messageGetRequest/rejected":
      return {
        ...state,
        messageGetStatus: "rejected",
      };
    case "lastMessages/array":
      return {
        ...state,
        lastMessagesData: action.payload,
      };
    case "resetMessageGet/request":
      return {
        ...state,
        ...initialMessagesState
      };

    default:
      return state;
  }
}

export default messagesReducer;