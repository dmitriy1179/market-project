import React from "react";
import API from "../../API";
import { gql } from "graphql-request";
import StatusResolver from "./../../shared/components/statusResolver"
import AdItem from "../../shared/components/ad-item"
import { Link } from "react-router-dom";

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
      createdAt
      title
      images {
        url
        _id
      }
    }
  }
`;

const Ads = gql`
  query adFind {
    AdFind(query: "[{}]") {
      _id
      owner {
        login
        nick
      } 
      price
      createdAt
      title
      images {
        url
      }
    }
  }
`;

const AdFind = () => {
  const [value, setValue] = React.useState(null);
  const [result, setResult] = React.useState(null);
  const [status, setStatus] = React.useState("idle");

  const onChange = (e) => {
    setValue(e.target.value)
  };

  const onClick = () => {
    try {
      setStatus("searching");
        API.request(query, {
          query: JSON.stringify([
            {
              $or: [{title: `/${String(value)}/`}, {description: `/${String(value)}/`}, {tags: `/${String(value)}/`}]  
            },
            {
              sort: [{_id: 1}]
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
  
  const searchAllAds = () => {
    try {
      setStatus("searching");
        API.request(Ads, {}).then((res) => {
          console.log("res", res)
          setResult(res.AdFind);
          setStatus("resolved");
      });
    } catch (e) {
        setStatus("rejected");
    }  
  };
  React.useEffect(() => {
    searchAllAds()
  }, [])

  console.log(result, "result", result !== null && result.length !== 0);
  return (
    <div className="Container mt-3 flex-grow-1">
      <div className="row input-group m-3 justify-content-md-center">
        <input type="search" className="form-control col-5" onChange={onChange} placeholder="Enter ad"/>
          <div className="input-group-append">
            <button className="btn btn-secondary" type="submit" onClick={onClick}>Search Ad</button>
          </div>
      </div>
      <div className="col-sm-12 my-3">
        <StatusResolver
          noData={result !== null && result.length === 0}
          status={status}
        >
          <ul>
            {result === null ? null : 
              result.map((ad) => (
                <AdItem key={ad._id} {...ad}>
                  <Link to={`/ad/otherUser/${ad._id}`}
                    style={{width:"70px"}}
                    className="btn btn-outline-secondary btn-sm"
                    role="button">View
                  </Link>
                </AdItem>  
              ))
            }
          </ul>
        </StatusResolver>
      </div>
    </div>
  );
};

export default AdFind;
