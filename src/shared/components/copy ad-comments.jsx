import React from "react";
import API from "../../API";
import { gql } from "graphql-request";
import StatusResolver from "../../shared/components/statusResolver"

const adComments = gql`
  query adComments ($query: String) {
    AdFindOne(query: $query) {
      _id
      comments {
        _id
        owner {
          nick
          _id
        }
        ad {
          _id
        }
        text
        answerTo {
          _id
        }
        answers {
          _id
        }
        createdAt
      }    
    }
  }
`;

const addNewComment = gql`
  mutation addNewComment($text: String! $ad: AdInput!) {
    CommentUpsert(comment: {
      text: $text,
      ad: $ad,
    }) {
      _id
    }
  }
`;

const commentFind = gql`
  query CommentFind($query: String) {
    CommentFindOne(query: $query) {
      _id
      text
      owner {
        _id
      }
      answerTo {
        _id
      }
      createdAt
      answers {
        _id
      }
    }
  }
`;

const Answers = ({ id }) => {
  const viewAnswers = (id) => {
    console.log("answersId", id)
  }
  return (
    <div className="mt-1 mb-3">
      <div className="d-flex justify-content-end">
        <button type="submit"
          className="btn btn-outline-secondary btn-sm"
          style={{width:"110px"}}
          onClick={() => viewAnswers(id)}
        >
          View answers
        </button>
      </div>
    </div>
  )
}

const AdComments = ({ id }) => {
  const [result, setResult] = React.useState(null);
  const [status, setStatus] = React.useState("idle");

  const [values, setValues] = React.useState({"ad": {"_id": id}})
  const [isClickAddComment, setIsClickAddComment] = React.useState(false)

  const [isAnswers, setIsAnswers] = React.useState(false)

  const findAdComments = () => {
    try {
      setStatus("searching");
        API.request(adComments, {
          query: JSON.stringify([
            {
              _id: id
            }
          ])
        }).then((res) => {
          console.log("_id", id)
          console.log("res", res)
          setResult(res.AdFindOne);
          setStatus("resolved");
      });
    } catch (e) {
      setStatus("rejected");
    }  
  };

  const addComment = () => {
    setIsClickAddComment(true)
  }

  const onChangeTextComment = (e) => {
    e.persist()
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value})
    );
    console.log("value", values)
  }

  const sendComment = (e) => {
    e.preventDefault();
    try {
      setStatus("searching");
      API.request(addNewComment, values)
        .then((res) => {
          console.log("res", res)
          setStatus("resolved");
          setIsClickAddComment(false)
        });
    } catch (e) {
      setStatus("rejected");
    }  
  }

  const viewAnswers = () => {
    setIsAnswers(true)
  }

  React.useEffect(() => {
    if (!isClickAddComment) {
      findAdComments()
      setValues({"ad": {"_id": id}})
    }
  }, [isClickAddComment])

  console.log(result, "result", result !== null);

  return (
    <div className="border rounded my-2 mx-auto w-75 p-3">
      <StatusResolver
        status={status}
      >
        {result === null ? null : (
          result.comments === null ? 
            <>
              <div className="text-info">No comments</div>
              {isClickAddComment ? null :
                <div className="d-flex justify-content-end flex-grow-1 align-items-end">
                  <button type="button"
                    className="btn btn-outline-dark mr-3"
                    onClick = {addComment}
                  >
                    Add comment
                  </button>
                </div>
              }
            </> :
            <div className="d-flex flex-column">
              {result.comments.filter((comment) => comment.answerTo === null).map((comment, index) => 
              <div key={index}>
                <div className="d-flex my-1" style={{fontSize:"18px"}}>
                  <div>{comment.owner.nick}:</div>
                  <div className="font-italic text-justify mx-3 flex-grow-1">
                    {comment.text}
                  </div>
                  <div style={{fontSize:"14px"}} className="mt-1">
                    {new Date(comment.createdAt/1).toLocaleDateString()}
                  </div>
                </div>
                <div>
                    <Answers id={comment._id}/>
                </div>
              </div>)}
              {isClickAddComment ? null :
                <div className="d-flex justify-content-end mt-3 align-items-end">
                  <button type="button"
                    className="btn btn-outline-dark mr-3"
                    onClick = {addComment}
                  >
                    Add comment
                  </button>
                </div>
              }
            </div>
          )
        }
        {isClickAddComment ?
          <form onSubmit={sendComment}>
            <div className="mt-2 form-group">
              <textarea
                className="form-control"
                placeholder="Enter comment"
                name="text"
                onChange={onChangeTextComment}
                required
              />
              <div className="d-flex justify-content-end mt-3">
                <button type="submit"
                  className="btn btn-outline-primary"
                >
                  Send comment
                </button>
              </div>
            </div> 
          </form>
          : null
        }
      </StatusResolver>
    </div>  
  )
}

export default AdComments

import React from "react";
import API from "../../API";
import { gql } from "graphql-request";
import StatusResolver from "../../shared/components/statusResolver"

const adComments = gql`
  query adComments ($query: String) {
    AdFindOne(query: $query) {
      _id
      comments {
        _id
        owner {
          nick
          _id
        }
        ad {
          _id
        }
        text
        answerTo {
          _id
        }
        answers {
          _id
        }
        createdAt
      }    
    }
  }
`;

const addNewComment = gql`
  mutation addNewComment($text: String! $ad: AdInput!) {
    CommentUpsert(comment: {
      text: $text,
      ad: $ad,
    }) {
      _id
    }
  }
`;

const commentFind = gql`
  query CommentFind($query: String) {
    CommentFindOne(query: $query) {
      _id
      text
      owner {
        _id
      }
      answerTo {
        _id
      }
      createdAt
      answers {
        _id
      }
    }
  }
`;

const Answers = ({ id }) => {
  console.log("answersId", id)
  return (
    <div>{id}</div>
  )
}

const AdComments = ({ id }) => {
  const [result, setResult] = React.useState(null);
  const [status, setStatus] = React.useState("idle");

  const [values, setValues] = React.useState({"ad": {"_id": id}})
  const [isClickAddComment, setIsClickAddComment] = React.useState(false)

  const [answersId, setAnswersId] = React.useState(null)

  const [isViewAnswers, setIsViewAnswers] = React.useState(false)

  const findAdComments = () => {
    try {
      setStatus("searching");
        API.request(adComments, {
          query: JSON.stringify([
            {
              _id: id
            }
          ])
        }).then((res) => {
          console.log("res", res)
          setResult(res.AdFindOne);
          const arrAnswersId = res.AdFindOne.comments.map((comment) => 
            comment = {[comment._id]: false}
          )
          setAnswersId(arrAnswersId)
          setStatus("resolved");
      });
    } catch (e) {
      setStatus("rejected");
    }  
  };

  const addComment = () => {
    setIsClickAddComment(true)
  }

  const onChangeTextComment = (e) => {
    e.persist()
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value})
    );
    console.log("value", values)
  }

  const sendComment = (e) => {
    e.preventDefault();
    try {
      setStatus("searching");
      API.request(addNewComment, values)
        .then((res) => {
          console.log("res", res)
          setStatus("resolved");
          setIsClickAddComment(false)
        });
    } catch (e) {
      setStatus("rejected");
    }  
  }

  const viewAnswers = (id) => {
    setIsViewAnswers(!isViewAnswers)
    const arrAnswersId = answersId
    arrAnswersId.map((answerId) => {
      if (Object.keys(answerId)[0] === id) {
        answerId[id] = !answerId[id]
      }
    })
    console.log("arrView", arrAnswersId)
    setAnswersId(arrAnswersId)
  }

  React.useEffect(() => {
    if (!isClickAddComment) {
      findAdComments()
      setValues({"ad": {"_id": id}})
    }
  }, [isClickAddComment])

  console.log(result, "result", result !== null);
  console.log("arrComments", answersId)

  return (
    <div className="border rounded my-2 mx-auto w-75 p-3">
      <StatusResolver
        status={status}
      >
        {result === null || answersId === null ? null :
          (answersId.length !== result.comments.length ? null : 
            (result.comments === null ? 
              <>
                <div className="text-info">No comments</div>
                {isClickAddComment ? null :
                  <div className="d-flex justify-content-end flex-grow-1 align-items-end">
                    <button type="button"
                      className="btn btn-outline-dark mr-3"
                      onClick = {addComment}
                    >
                      Add comment
                    </button>
                  </div>
                }
              </> :
              <div className="d-flex flex-column">
                {result.comments.filter((comment) => comment.answerTo === null).map((comment, index) => 
                  <div key={index}>
                    <div className="d-flex my-1" style={{fontSize:"18px"}}>
                      <div>{comment.owner.nick}:</div>
                      <div className="font-italic text-justify mx-3 flex-grow-1">
                        {comment.text}
                      </div>
                      <div style={{fontSize:"14px"}} className="mt-1">
                        {new Date(comment.createdAt/1).toLocaleDateString()}
                      </div>
                      <div className="ml-2">
                        <button type="button"
                          className="btn btn-outline-secondary btn-sm"
                          style={{width:"110px"}}
                          onClick = {() => viewAnswers(comment._id)}
                        >
                          View answers
                        </button>
                      </div>
                    </div>

                    {answersId.filter((answerId) => Object.keys(answerId)[0] === comment._id)[0][comment._id] ?
                      <div>
                        <Answers id={comment._id}/>
                      </div> :
                      null
                    }
                  </div>)
                }

                {isClickAddComment ? null :
                  <div className="d-flex justify-content-end mt-3 align-items-end">
                    <button type="button"
                      className="btn btn-outline-dark mr-3"
                      onClick = {addComment}
                    >
                      Add comment
                    </button>
                  </div>
                }
              </div>
            )
          )
        }
        {isClickAddComment ?
          <form onSubmit={sendComment}>
            <div className="mt-2 form-group">
              <textarea
                className="form-control"
                placeholder="Enter comment"
                name="text"
                onChange={onChangeTextComment}
                required
              />
              <div className="d-flex justify-content-end mt-3">
                <button type="submit"
                  className="btn btn-outline-primary"
                >
                  Send comment
                </button>
              </div>
            </div> 
          </form>
          : null
        }
      </StatusResolver>
    </div>  
  )
    
}

export default AdComments