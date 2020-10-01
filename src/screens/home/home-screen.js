import React from "react";
import API from "../../API";
import { gql } from "graphql-request";
import jwt_decode from "jwt-decode";
import avatar from "../../shared/images/avatar.png"
import { Link } from "react-router-dom";
import StatusResolver from "./../../shared/components/statusResolver"

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
      incomings {
        _id
        owner {
          _id
        }
      }
      phones
      addresses 
    }
  }
`;

const HomeScreen = () => {
  const token = localStorage.getItem("token")
  const { sub } = jwt_decode(token);
  const { id } = sub
  const [result, setResult] = React.useState(null);
  const [status, setStatus] = React.useState("idle");

  const searchUserData = () => {
    try {
      setStatus("searching");
        API.request(userData, {
          query: JSON.stringify([
            {
              _id: id
            }
          ])
        }).then((res) => {
          console.log("res", res)
          setResult(res.UserFind[0]);
          setStatus("resolved");
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
    <div className="mt-3 flex-grow-1">
      <StatusResolver
        noData={result !== null && result.length === 0}
        status={status}
      >
        {result === null ? null : 
          <div className="border rounded my-3 mx-auto w-75 p-3 d-flex">
            <div className="mr-2" style={{width:"400px", height:"300px"}}>
              {result.avatar === null ? 
                <img src={avatar}
                  className="img-fluid rounded w-100 h-100"
                  alt="picture" 
                  style={{objectFit: "cover"}}
                /> 
                : 
                <img src={`http://marketplace.asmer.fs.a-level.com.ua/${result.avatar.url}`}
                  className="img-fluid rounded w-100 h-100"
                  alt="picture" 
                  style={{objectFit: "cover"}}
                />
              }
            </div>
            <div className="w-100 d-flex flex-column" style={{fontSize: "2rem"}}>
              <div className="d-flex">
                <div className="mt-1 ml-3">
                  Login:
                </div>
                <div className="mt-1 ml-2 font-italic">
                  {result.login}
                </div>
              </div>
              <div className="d-flex">
                <div className="ml-3">
                  Nick:
                </div>
                <div className="ml-2 font-italic">
                  {result.nick}
                </div>
              </div>
              <div className="d-flex" style={{fontSize: "1.5rem"}}>
                <div className="ml-3">
                  Phones:
                </div>
                <div className="font-italic">
                  {result.phones === null ? null :
                    (result.phones.length === 0 ? null :
                      result.phones.map((phone, index) => (
                        index === 0 ? <span key={index} className="ml-2 text-wrap">{phone}</span>
                        : <span key={index} className="ml-1 text-wrap">, {phone}</span>
                      ))
                    )
                  }
                </div>
              </div>
              <div className="d-flex" style={{fontSize: "1.5rem"}}>
                <div className="ml-3">
                  Addresses:
                </div>
                <div className="font-italic ">
                  {result.addresses === null ? null :
                    (result.addresses.length === 0 ? null :
                      result.addresses.map((address, index) => (
                        index === 0 ? <span key={index} className="ml-2 text-justify text-wrap">{address}</span>
                        : <span key={index} className="ml-1 text-justify text-wrap">; {address}</span>
                      ))
                    )
                  }
                </div>
              </div>
              <div className="d-flex" style={{fontSize: "1rem"}}>
                <div className="ml-3">
                  Account created:
                </div>
                <div className="ml-2 font-italic">
                  {new Date(result.createdAt/1).toLocaleDateString()}
                </div>
              </div>
              <div className="d-flex justify-content-end flex-grow-1 m-2 align-items-end">
                <Link to={`/profile/edit/${id}`}
                  className="btn btn-outline-secondary btn-sm"
                  role="button">Add/change profile data
                </Link>
              </div>    
            </div>  
          </div>
        }
      </StatusResolver>
    </div> 

  )
};

export default HomeScreen;
