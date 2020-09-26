import React from "react";
import API from "../../API";
import { gql } from "graphql-request";
import NavBar from "../../shared/components/navbar";
import Logout from "../../shared/components/logout";
import ViewImages from "../../shared/components/view-images"
import AdItemOne from "../../shared/components/ad-item-one"
import StatusResolver from "../../shared/components/statusResolver"
import camera from "../../shared/images/camera.png"
import { Link, useParams, Redirect } from "react-router-dom";

const myAdOne = gql`
  query adFindOne($query: String) {
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
      }
    }
  }
`;

const deleteAdMutation = gql`
  mutation deleteAD($adId: ID) {
    AdDelete(ad: {
      _id: $adId
     }) {
      _id
    }
  }
`;

const MyAdOneSreen = () => {
  const { _id } = useParams()
  console.log("id", _id)

  const [result, setResult] = React.useState(null);
  const [status, setStatus] = React.useState("idle");
  const [isDelAd, setIsDelAD] = React.useState(false)

  const onClickDelete = async (adId) => {
    console.log("adId", adId)
    const adIdDel = {"_id": adId}
    console.log("adIdDel", adIdDel)
    try {
      setStatus("searching");
      const res = await API.request(deleteAdMutation, adIdDel)
      console.log("resDel", res)
      setIsDelAD(true)
      setStatus("resolved");
    } catch (e) {
      setStatus("rejected");
    }
  }

  const searchUserAdOne = () => {
    try {
      setStatus("searching");
        API.request(myAdOne, {
          query: JSON.stringify([
            {
              _id: _id
            }
          ])
        }).then((res) => {
          console.log("res", res)
          setResult(res.AdFind[0]);
          setStatus("resolved");
      });
    } catch (e) {
        setStatus("rejected");
    }  
  };

  React.useEffect(() => {
    if (!isDelAd) {
      searchUserAdOne()
    } 
  }, [])

  console.log(result, "result", result !== null && result.length !== 0);
  
  if (isDelAd) {
    return <Redirect to="/ad/curUser" />
  }

  return (
    <div className="mt-3">
      <NavBar>
        <Logout />
      </NavBar>
      <div className="col-sm-12 my-3">
        <StatusResolver
          status={status}
        >
          {result === null ? null : 
            (result.images === null || result.length === 0 ?
              <div className="border rounded my-3 mx-auto w-25 p-3">
                <img src={camera}
                  className="img-fluid rounded"
                  alt="picture" 
                />
              </div> :
              (result.images[0].url === null ?
                <div className="border rounded my-3 mx-auto w-25 p-3">
                  <img src={camera}
                    className="img-fluid rounded"
                    alt="picture" 
                  />
                </div> :
                <ViewImages images={result.images} />
              ) 
            )
          }
          {result === null ? null :
            <AdItemOne {...result}>
              <button type="button"
                className="btn btn-outline-danger btn-sm mr-3"
                style={{width:"70px"}}
                onClick = {() => onClickDelete(result._id)}
              >
                Delete
              </button>
              <Link to={`/ad/curUser/edit/${result._id}`}
                style={{width:"70px"}}
                className="btn btn-secondary btn-sm mr-3"
                role="button">Edit
              </Link>
            </AdItemOne>    
          }
        </StatusResolver>
      </div>
    </div>
  )
}

export default MyAdOneSreen