import React from "react";
import API from "../../API";
import { gql } from "graphql-request";
import NavBar from "./../../shared/components/navbar";
import Logout from "./../../shared/components/logout";
import StatusResolver from "../../shared/components/statusResolver"
import camera from "../../shared/images/camera.png"
import { Link, useParams, Redirect, useRouteMatch } from "react-router-dom";

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

const ImegesView = ({ images }) => {
  const [count, setCount] = React.useState(0);
  const onClickNext = () => {
    setCount((prev) => prev + 1)
  }
  const onClickPrev = () => {
    setCount((prev) => prev - 1)
  }
  return (
    <div className="border rounded my-3 w-50 mx-auto p-3">
      <div className="w-100">
        <img src={`http://marketplace.asmer.fs.a-level.com.ua/${images[count].url}`}
          className="img-fluid rounded w-100 h-100"
          alt="picture" 
          />
      </div>
      <div className="d-flex justify-content-between">
        <button type="button"
          className="btn btn-outline-secondary btn-sm m-3"
          disabled={count === 0}
          style={{width:"70px"}}
          onClick = {onClickPrev}
        >
          Prev
        </button>
        <button type="button"
          className="btn btn-outline-secondary btn-sm m-3"
          disabled={count === images.length-1}
          style={{width:"70px"}}
          onClick = {onClickNext}
        >
          Next
        </button>
      </div>
    </div>
  )
}

const AdItemOne = ({ _id, title, createdAt, price, description, onClick, owner }) => {
  return (
    <div className="border rounded my-3 mx-auto w-50 p-3">
      <div className="font-weight-bolder text-justify my-3" style={{fontSize:"26px"}}>{title}</div>
      <div className="text-justify my-3" style={{fontSize:"24px"}}>{`${price} грн.`}</div>
      <div className="my-3">
        <div className="text-justify my-2" style={{fontSize:"22px"}}>Description</div>
        <div className="text-justify" style={{fontSize:"18px"}}>{description}</div>
      </div>
      {owner.login === null ? null :
        <div className="text-justify my-3" style={{fontSize:"18px"}}>
          <span>Owner: {owner.login}</span>
        </div>
      }
      {owner.addresses === null ? null :
        <div className="text-justify my-3" style={{fontSize:"18px"}}>
          <span>Addresses:{owner.addresses}</span>
        </div>
      }
      {owner.phones === null ? null :
        <div className="text-justify my-3" style={{fontSize:"18px"}}>
          <span>Phones:{owner.phones}</span>
        </div>
      }
      <div className="d-flex justify-content-between">
        <div className="align-self-start mt-3" style={{fontSize:"14px"}}>Posted: {new Date(createdAt/1).toLocaleDateString()}</div>
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
          <Link to={`/ad/my/${_id}`}
            style={{width:"70px"}}
            className="btn btn-outline-secondary btn-sm"
            role="button">View
          </Link>
        </div>
      </div>  
    </div>
  )  
}


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
      return setResult(null);
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
                <ImegesView images={result.images} />
              ) 
            )
          }
          {result === null ? null :
            <AdItemOne onClick={onClickDelete} {...result} />  
          }

        </StatusResolver>
      </div>
    </div>
  )

}

export default MyAdOneSreen