import React from "react";
import { useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import StatusResolver from "./../../shared/components/statusResolver";
import { connect } from "react-redux";
import AddMessage from "../../shared/components/messages";


const MessagesOneUserScreen = ({ dispatch, messageData, messageGetStatus,
  messageSendStatus, isSendMessage, isSendMessageYourself, isDisabled }) => {
  const token = localStorage.getItem("token")
  const { sub } = jwt_decode(token);
  const { id } = sub
  const { _id } = useParams()

  React.useEffect(() => {
    dispatch({ type: "oneUserMessageGet/request", payload: {
      id: id,
      _id: _id
    }});
    return () => {
      dispatch({ type: "cancelMessageGet/request" })
    }
  }, [])

  console.log(messageData, "messageData", messageData !== null);

  return (
    <div className="mt-3 flex-grow-1">
      <StatusResolver status={messageGetStatus}>
        {messageData === null ? null :
          <>
            <div className="border rounded my-3 mx-auto w-75 p-3">
              {messageData.map((message, index) => 
                (message.owner._id === id ?
                  <div key={index} className="d-flex ml-3 my-2 px-3">

                      <div style={{fontSize:"18px"}}> 
                        Your message:
                      </div> 
                  
                      <div className="font-italic text-justify mx-2 flex-grow-1">
                        "{message.text}""
                      </div>
                      <div style={{fontSize:"14px"}} className="mt-1">
                        {new Date(message.createdAt/1).toLocaleString()}
                      </div>
                  </div> :
                  <div key={index} className="d-flex mr-3 my-2 px-3">

                    <div style={{fontSize:"18px"}}>
                      {message.owner.nick || message.owner.login}:
                    </div>
                
                    <div className="font-italic text-justify mx-2 flex-grow-1">
                      "{message.text}"
                    </div>
                    <div style={{fontSize:"14px"}} className="mt-1">
                      {new Date(message.createdAt/1).toLocaleString()}
                    </div>
                  </div>
                )
              )}      
            </div>
            <AddMessage 
              userId={_id}
              name={messageData[0].owner._id === id ? 
                messageData[0].to.nick || messageData[0].to.login :
                messageData[0].owner.nick || messageData[0].owner.login}
              messageSendStatus={messageSendStatus}
              isSendMessage={isSendMessage}
              isSendMessageYourself={isSendMessageYourself}
              isDisabled={isDisabled}
              dispatch={dispatch}
            />
          </>
        }
      </StatusResolver>
    </div>
  )
}

const mapStateToProps = (state) => ({
  messageData: state.messages.messageData,
  messageGetStatus: state.messages.messageGetStatus,
  messageSendStatus: state.messages.messageSendStatus,
  isSendMessage: state.messages.isSendMessage,
  isSendMessageYourself: state.messages.isSendMessageYourself,
  isDisabled: state.messages.isDisabled
});

export default connect(mapStateToProps)(MessagesOneUserScreen);
