import React from "react";
import API from "../../API";
import { gql } from "graphql-request";
import StatusResolver from "../../shared/components/statusResolver"
import { Link, useParams } from "react-router-dom";

const userData = gql`
  query userFind($query: String) {
    UserFind(query: $query) {
      _id
      createdAt
      login
      nick
      avatar {
        _id
        url
      }
      phones
      addresses 
    }
  }
`;

const ProfileEditSreen = () => {
  const { _id } = useParams()
  const [result, setResult] = React.useState(null);
  const [status, setStatus] = React.useState("idle");

  const searchUserData = () => {
    try {
      setStatus("searching");
        API.request(userData, {
          query: JSON.stringify([
            {
              _id: _id
            }
          ])
        }).then((res) => {
          console.log("res", res)
          setResult(res.UserFind[0]);
          setStatus("idle");
      });
    } catch (e) {
        setStatus("rejected");
    }  

  };
  React.useEffect(() => {
    searchUserData()
  }, [])

  console.log(result, "result", result !== null && result.length !== 0);

  return (
    <div>Ok!</div>
  )
}

export default ProfileEditSreen