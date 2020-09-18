import React from "react";
import API from "../../API";
import { gql } from "graphql-request";
import NavBar from "./../../shared/components/navbar";
import Logout from "./../../shared/components/logout";
import jwt_decode from "jwt-decode";
import StatusResolver from "./../../shared/components/statusResolver"

const query = gql`
  query adFind($query: String) {
    AdFind(query: $query) {
      _id
      owner {
        _id
        login
        nick 
        phones
        addresses
      } 
      price
      comments {
        _id
        owner {
          nick
        }
        text
        }
      createdAt
      title
      tags
      address
      description
      images {
        url
        _id
      }
    }
  }
`;

const HomeScreen = () => {
  const token = localStorage.getItem("token")
  const { sub } = jwt_decode(token);
  const { id } = sub
  console.log("sub", sub)
  console.log("decode", id)
  const [result, setResult] = React.useState(null);
  const [status, setStatus] = React.useState("idle");

  const searchUserAd = () => {
    try {
      console.log("try", id)
      setStatus("searching");
        API.request(query, {
          query: JSON.stringify([
            {
              ___owner: id
            }
          ])
        }).then((res) => {
          console.log("res", res)
          setResult(res.AdFind);
          setStatus("resolved");
      });
    } catch (e) {
        setStatus("rejected");
    }  

  };
  React.useEffect(() => {
    searchUserAd()
  }, [])

  console.log(result, "result", result !== null && result.length !== 0);

  return (
    <div className="mt-3">
      <NavBar>
        <Logout />
      </NavBar>
      <div className="col-sm-12 my-3">
        <StatusResolver
          noData={result !== null && result.length === 0}
          status={status}
          content="You have no ads loaded"
        >
          <ul>
            {result === null ? null : 
              result.map((ad) => (
                <li key={ad._id} className="border my-3 mx-auto w-75 p-3">
                  <div><h2>{ad.title}</h2></div>
                  <div className="text-break">{ad.description}</div>
                  <div>
                    {ad.images === null || ad.images.length === 0 ? null : (
                      ad.images[0].url === null ? null :
                      <ul className="d-flex justify-content-center">
                        {ad.images.map((image, index) => (
                          image.url === null ? null :
                          <li key={index}>
                            <img src={`http://marketplace.asmer.fs.a-level.com.ua/${image.url}`} alt="picture" style={{height:"100px"}}/>
                          </li>
                          ))
                        }  
                      </ul>
                      )
                    }
                  </div>
                  <div>{`${ad.price} грн.`}</div>
                  <div>Posted: {new Date(ad.createdAt/1).toLocaleDateString()}</div>
                  <div>Address: {ad.address}</div>
                  <div>
                    Owner: {ad.owner.login}, phones: {ad.owner.phones}
                  </div>
                </li>
              ))
            }
          </ul>
        </StatusResolver>
      </div>
    </div>
  )
};

export default HomeScreen;
