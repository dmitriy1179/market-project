import React from "react";
import API from "../../API";
import { gql } from "graphql-request";
import NavBar from "./../../shared/components/navbar";
import Logout from "./../../shared/components/logout";
import jwt_decode from "jwt-decode";
import { Link } from "react-router-dom";
import StatusResolver from "./../../shared/components/statusResolver"
import camera from "../../shared/images/camera.png"

const myAd = gql`
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

const deleteAdMutation = gql`
  mutation deleteAD($adId: ID) {
    AdDelete(ad: {
      _id: $adId
     }) {
      _id
    }
  }
`;

const AdItem = ({_id, images, title, createdAt, price, onClick}) => {
  return (
    <li className="border rounded my-3 mx-auto w-75 p-3 d-flex">
      <div style={{width:"170px", height:"120px"}}>
        {images === null || images.length === 0 ? 
          <img src={camera}
            className="img-fluid rounded w-100 h-100"
            alt="picture" 
            style={{objectFit: "cover"}}
          /> 
        : (
          images[0].url === null ? 
          <img src={camera}
            className="img-fluid rounded w-100 h-100"
            alt="picture" 
            style={{objectFit: "cover"}}
          /> 
          :
          <img src={`http://marketplace.asmer.fs.a-level.com.ua/${images[0].url}`}
            className="img-fluid rounded w-100 h-100"
            alt="picture" 
            style={{objectFit: "cover"}}
          />
          )
        }
      </div>
      <div className="d-flex flex-column flex-grow-1 mx-3">
        <div className="d-flex justify-content-between">
          <div className="font-weight-bolder" style={{fontSize:"22px"}}>{title}</div>
          <div style={{fontSize:"20px"}}>{`${price} грн.`}</div>
        </div>
        <div className="align-self-start" style={{fontSize:"12px"}}>Posted: {new Date(createdAt/1).toLocaleDateString()}</div>
        <div className="d-flex justify-content-end flex-grow-1 align-items-end">
          <button type="button"
            className="btn btn-outline-danger btn-sm mr-3"
            style={{width:"70px"}}
            onClick = {() => onClick(_id)}
          >
            Delete
          </button>
          <Link to={"/"}
            style={{width:"70px"}}
            className="btn btn-secondary btn-sm mr-3"
            role="button">Edit
          </Link>
          <Link to={`/ad/curUser/${_id}`}
            style={{width:"70px"}}
            className="btn btn-outline-secondary btn-sm"
            role="button">View
          </Link>
        </div>
      </div>  
    </li>
  )  
}

const MyAdsScreen = () => {
  const token = localStorage.getItem("token")
  const { sub } = jwt_decode(token);
  const { id } = sub
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
      setIsDelAD(!isDelAd)
      setStatus("resolved");
 
      } catch (e) {
          setStatus("rejected");
      }

  }

  const searchUserAd = () => {
    try {
      setStatus("searching");
        API.request(myAd, {
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
  }, [isDelAd])

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
                <AdItem key={ad._id} onClick={onClickDelete} {...ad} />  
              ))
            }
          </ul>
        </StatusResolver>
      </div>
    </div>
  )
};

export default MyAdsScreen;