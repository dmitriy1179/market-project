import { takeLatest, put, call, delay, select, cancel, take, takeEvery } from "redux-saga/effects";
import { gql } from "graphql-request";
import API from "./../../API"
import { getMessageData, getMessageCount } from "./selectors"

const addNewMessage = gql`
  mutation addNewMessage($to: UserInput $text: String) {
    MessageUpsert(message: {
      to: $to,
      text: $text,
    }) {
      _id
    }
  }
`;

async function messageRequest (values) {
  const data = await API.request(addNewMessage, values);
  return data
}

function* sendMessageRequest(action) {
  yield put ({ type: "messageSendRequest/buttonIsDisabled" })
  try {
    const { MessageUpsert }  = yield call(messageRequest, action.payload);
    console.log("MessageUpsert", MessageUpsert);
    yield put({ type: "messageSendRequest/resolved" });
    yield delay(1000);
    yield put({ type: "messageSendRequest/info" })
  }
  catch(e) {
    yield put({ type: "messageSendRequest/rejected" })
  }
}

export function* sendMessageRequestSaga() {
  yield takeLatest("messageSend/request", sendMessageRequest)
}

function* sendMessageYourself(action) {
  yield put ({ type: "messageSendRequest/buttonIsDisabled" })
  yield put ({ type: "messageSendRequest/yourself"})
  yield delay(1000);
  yield put({ type: "messageSendRequest/info" })
}

export function* sendMessageYourselfSaga() {
  yield takeLatest("messageSend/yourself", sendMessageYourself)
}

const messagesFind = gql`
  query MessagesFind($query: String) {
    MessageCount(query: $query) 
    MessageFind(query: $query) {
      _id
      owner {
        _id
        login
        nick
        avatar {
          url
        }
      }
      createdAt
      to {
        _id
        login
        nick
        avatar {
          url
        }
      }
      text
    }
  }
`;

const messagesCount = gql`
  query messageCount($query: String) {
    MessageCount(query: $query) 
  }
`;

async function messageFindRequest (id) {
  const data = await API.request(messagesFind, {
    query: JSON.stringify([
      {
        $or: [{___owner: id}, {"to._id": {$eq: id}}]  
      },
      {
        sort: [{_id: - 1}]
      }
    ])
  })
  return data
}

async function messageCountRequest (id) {
  const messageCount = await API.request(messagesCount, {
    query: JSON.stringify([
      {
        $or: [{___owner: id}, {"to._id": {$eq: id}}]  
      }
    ])
  })
  return messageCount
}

const filterArrayMessages = (arr, id) => {
  const array = []
  const tempArray = arr.filter(elem => arr[0].owner._id === id ?
    elem.owner._id !== arr[0].to._id :
    elem.owner._id !== arr[0].owner._id
  ).filter(elem => arr[0].owner._id === id ? 
    elem.to._id !== arr[0].to._id :
    elem.to._id !== arr[0].owner._id
    )
  console.log("tempArray", tempArray)
  if (tempArray.length !== 0) {
    const res = filterArrayMessages(tempArray, id)
    array.push(...res)
  }
  array.push(arr[0])
  return array
}

function* getMessageRequest(action) {
  while(true) {
    const messageData = yield select(getMessageData);
    const messageCount = yield select(getMessageCount)
    if (messageData === null || messageData.length !== messageCount) {
      try {
        const { MessageCount, MessageFind } = yield call(messageFindRequest, action.payload);
        console.log("MessageFind", MessageFind);
        console.log("MessageCount", MessageCount);
        yield put({ type: "messageGetRequest/resolved", payload: MessageFind })
        yield put({ type: "countGetRequest/resolved", payload: MessageCount })
        const lastMessagesData = yield call(filterArrayMessages, MessageFind, action.payload);
        yield put({ type: "lastMessages/array", payload: lastMessagesData})
        yield delay(2000);
      }
      catch(e) {
        yield put({ type: "messageGetRequest/rejected" });
      }
    } else {
      try {
        const { MessageCount } = yield call(messageCountRequest, action.payload);
        console.log("MessageCount", MessageCount);
        yield put({ type: "countGetRequest/resolved", payload: MessageCount })
        yield delay(2000);
      }
      catch(e) {
        yield put({ type: "messageGetRequest/rejected" });
      }
    }
  }
}

export function* getMessageRequestSaga() {
  //while(true) {
    const task = yield takeLatest("messageGet/request", getMessageRequest);
    console.log("task", task);
    const action = yield take("cancelMessageGet/request");
    console.log("action", action);
    yield cancel(task);
    console.log("canceled", task.isCancelled());
  //}
}


