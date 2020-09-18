import React from "react";
import { useParams } from "react-router-dom"
import API from "../../API";
import { gql } from "graphql-request";
import NavBar from "./../../shared/components/navbar";
import Logout from "./../../shared/components/logout";
import StatusResolver from "../../shared/components/statusResolver"
import camera from "../../shared/images/camera.png"
import { Link } from "react-router-dom";

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

const AdItemAll = ({_id, images, title, createdAt, price}) => {
  return (
    <div className="border rounded my-3 mx-auto w-75 p-3 d-flex">
      <div style={{width:"50%", height:"200px"}}>
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
    searchUserAdOne()
  }, [])

  console.log(result, "result", result !== null && result.length !== 0);

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
            <AdItemAll key={result._id} {...result} />  
          }
        </StatusResolver>
      </div>
    </div>
  )

}

export default MyAdOneSreen