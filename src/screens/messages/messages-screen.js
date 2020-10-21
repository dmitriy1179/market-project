import React from "react";
import jwt_decode from "jwt-decode";
import { Link } from "react-router-dom";
import StatusResolver from "./../../shared/components/statusResolver";
import { connect } from "react-redux";
import avatar from "../../shared/images/avatar.png"

const MessagesScreen = ({ dispatch, messageData, messageCount, messageGetStatus, lastMessagesData }) => {
  const token = localStorage.getItem("token")
  const { sub } = jwt_decode(token);
  const { id } = sub;

  //const [arrayLastMessages, setArrayLastMessages] = React.useState(null)

  /*const filterArrayMessages = (arr, id) => {
    const array = []
    const tempArray = arr.filter(elem => arr[0].owner._id === id ?
      elem.owner._id !== arr[0].to._id :
      elem.owner._id !== arr[0].owner._id
    ).filter(elem => arr[0].owner._id === id ? 
      elem.to._id !== arr[0].to._id :
      elem.to._id !== arr[0].owner._id
      )
    console.log("array", array)
    console.log("a", tempArray)
    if (tempArray.length !== 0) {
      const res = filterArrayMessages(tempArray, id)
      array.push(...res)
    }
    array.push(arr[0])
    return array
  }*/


  React.useEffect(() => {
    dispatch({ type: "messageGet/request", payload: id });
    /*if (messageData !== null) {
      const array = filterArrayMessages(messageData, id);
      setArrayLastMessages(array)
    }*/
    return () => {
      dispatch({ type: "cancelMessageGet/request" })

    }
  }, [messageCount])

  console.log(messageData, "result", messageData !== null);
  console.log("lastMessagesData", lastMessagesData)

  return (
    <div className="mt-3 flex-grow-1">
      <StatusResolver
        noData={lastMessagesData !== null && lastMessagesData.length === 0}
        status={messageGetStatus}
        content="You have no messages"
      >
        <div className="w-75 mx-auto">
          <ul className="list-unstyled">
            <li key={-1}>
              <div className="row d-flex p-3">
                <div className="col-4 font-weight-bold" style={{fontSize:"20px"}}>User</div>
                <div className="col-6 font-weight-bold" style={{fontSize:"20px"}}>Last message</div>
                <div className="col-2 font-weight-bold" style={{fontSize:"20px"}}>Created</div>
              </div>
            </li>
            {lastMessagesData === null ? null :
              lastMessagesData.map((elem, index) => (
                elem.owner._id === id ? 
                  (
                    <li key={index}>
                      <Link to={`/messages/${elem.to._id}`} className="text-reset text-decoration-none">
                        <div className="row d-flex border-top p-3 hover">
                          <div className="col-2">
                            {elem.to.avatar === null ? 
                              <img src={avatar}
                                className="img-fluid rounded-circle"
                                alt="picture" 
                                style={{objectFit: "cover", width: "50px", height: "50px"}}
                              /> 
                              : 
                              <img src={`http://marketplace.asmer.fs.a-level.com.ua/${elem.to.avatar.url}`}
                                className="img-fluid rounded-circle"
                                alt="picture" 
                                style={{objectFit: "cover", width: "50px", height: "50px"}}
                              />
                            }
                          </div>
                          <div className="col-2 d-flex align-items-center text-left" style={{fontSize:"18px"}}>
                            {elem.to.nick || elem.to.login}
                          </div>
                          <div className="col-6 d-flex align-items-center font-italic text-left text-break text-justify" style={{fontSize:"18px"}}>
                            "{elem.text}"
                          </div>
                          <div className="col-2 d-flex align-items-center justify-content-center" style={{fontSize:"14px"}}>
                            {new Date(elem.createdAt/1).toLocaleString()}
                          </div>
                        </div>
                      </Link>
                    </li>  
                  ) :
                  (
                    <li key={index}>
                      <Link to={`/messages/${elem.owner._id}`} className="text-reset text-decoration-none">
                        <div className="row d-flex border-top p-3">
                          <div className="col-2">
                            {elem.owner.avatar === null ? 
                              <img src={avatar}
                                className="img-fluid rounded-circle"
                                alt="picture" 
                                style={{objectFit: "cover", width: "50px", height: "50px"}}
                              /> 
                              : 
                              <img src={`http://marketplace.asmer.fs.a-level.com.ua/${elem.owner.avatar.url}`}
                                className="img-fluid rounded-circle"
                                alt="picture" 
                                style={{objectFit: "cover", width: "50px", height: "50px"}}
                              />
                            }
                          </div>
                          <div className="col-2 d-flex align-items-center text-left" style={{fontSize:"18px"}}>
                            {elem.owner.nick || elem.owner.login}
                          </div>
                          <div className="col-6 d-flex align-items-center font-italic text-left text-break text-justify" style={{fontSize:"18px"}}>
                            "{elem.text}"
                          </div>
                          <div className="col-2 d-flex align-items-center justify-content-center" style={{fontSize:"14px"}}>
                            {new Date(elem.createdAt/1).toLocaleString()}
                          </div>
                        </div>
                      </Link>
                    </li>  
                  ) 
              ))
            }
          </ul>
        </div>
      </StatusResolver>
    </div>
  )
}

const mapStateToProps = (state) => ({
  messageData: state.messages.messageData,
  messageCount: state.messages.messageCount,
  messageGetStatus: state.messages.messageGetStatus,
  lastMessagesData: state.messages.lastMessagesData
});

export default connect(mapStateToProps)(MessagesScreen);
/*
const MessagesScreen = ({ dispatch, messageData, messageSendStatus, messageGetStatus }) => {
  const token = localStorage.getItem("token")
  const { sub } = jwt_decode(token);
  const { id } = sub;
  const [arrayLastMessages, setArrayLastMessages] = React.useState(null)

  const filterArrayMessages = (arr, id) => {
    const array = []
    const tempArray = arr.filter(elem => arr[0].owner._id === id ?
      elem.owner._id !== arr[0].to._id :
      elem.owner._id !== arr[0].owner._id
    ).filter(elem => arr[0].owner._id === id ? 
      elem.to._id !== arr[0].to._id :
      elem.to._id !== arr[0].owner._id
      )
    console.log("array", array)
    console.log("a", tempArray)
    if (tempArray.length !== 0) {
      const res = filterArrayMessages(tempArray, id)
      array.push(...res)
    }
    array.push(arr[0])
    return array
  }

  React.useEffect(() => {
    if (messageData !== null) {
      const array = filterArrayMessages(messageData, id);
      setArrayLastMessages(array)
    }
  }, [messageData])

  console.log(messageData, "result", messageData !== null);
  console.log("arrayLastMessages", arrayLastMessages)


  return (
    <div className="mt-3 flex-grow-1">
      <StatusResolver
        noData={messageData !== null && messageData.length === 0}
        status={messageGetStatus}
        content="You have no messages"
      >
        <div className="w-75 mx-auto">
          <table className="table table-hover">
            <thead>
              <tr key={-1} className="row">
                <th scope="col" colSpan="2" className="col-4">Owner</th>
                <th scope="col" className="col-6">Last message</th>
                <th scope="col" className="col-2">Created</th>
              </tr>
            </thead>
            <tbody>
            {arrayLastMessages === null ? null :
              arrayLastMessages.map((elem, index) => (
                elem.owner._id === id ? 
                  (
                    <Link to={`/messages/${elem.to._id}`} key={index}>
                      <tr key={index} className="row">
                        <td className="col-2">
                          {elem.to.avatar === null ? 
                            <img src={avatar}
                              className="img-fluid rounded-circle"
                              alt="picture" 
                              style={{objectFit: "cover", width: "50px", height: "50px"}}
                            /> 
                            : 
                            <img src={`http://marketplace.asmer.fs.a-level.com.ua/${elem.to.avatar.url}`}
                              className="img-fluid rounded-circle"
                              alt="picture" 
                              style={{objectFit: "cover", width: "50px", height: "50px"}}
                            />
                          }
                        </td>
                        <td className="col-2 d-flex align-items-center text-left">
                          {elem.to.nick || elem.to.login}
                        </td>
                        <td className="col-6 d-flex align-items-center font-italic text-left text-break text-justify">
                          {elem.text}
                        </td>
                        <td className="col-2 d-flex align-items-center justify-content-center" style={{fontSize:"14px"}}>
                          {new Date(elem.createdAt/1).toLocaleString()}
                        </td>
                      </tr>
                    </Link>
                  ) :
                  (
                    <Link to={`/messages/${elem.owner._id}`} key={index}>
                      <tr key={index} className="row">
                        <td className="col-2">
                          {elem.owner.avatar === null ? 
                            <img src={avatar}
                              className="img-fluid rounded-circle"
                              alt="picture" 
                              style={{objectFit: "cover", width: "50px", height: "50px"}}
                            /> 
                            : 
                            <img src={`http://marketplace.asmer.fs.a-level.com.ua/${elem.to.avatar.url}`}
                              className="img-fluid rounded-circle"
                              alt="picture" 
                              style={{objectFit: "cover", width: "50px", height: "50px"}}
                            />
                          }
                        </td>
                        <td className="col-2 d-flex align-items-center text-left">
                          {elem.owner.nick || elem.owner.login}
                        </td>
                        <td className="col-6 d-flex align-items-center font-italic text-left text-break text-justify">
                          {elem.text}
                        </td>
                        <td className="col-2 d-flex align-items-center justify-content-center" style={{fontSize:"14px"}}>
                          {new Date(elem.createdAt/1).toLocaleString()}
                        </td>
                      </tr>
                    </Link>
                  ) 
              ))
              
            }
            </tbody>
          </table>
        </div>
      </StatusResolver>
    </div>
  )
}

const mapStateToProps = (state) => ({
  messageData: state.messages.messageData,
  messageSendStatus: state.messages.messageSendStatus,
  messageGetStatus: state.messages.messageGetStatus
});

export default connect(mapStateToProps)(MessagesScreen);
*/