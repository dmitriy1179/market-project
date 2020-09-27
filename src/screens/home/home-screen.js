import React from "react";
import API from "../../API";
import { gql } from "graphql-request";
import AdItem from "../../shared/components/ad-item"
import StatusResolver from "./../../shared/components/statusResolver"

const Ads = gql`
  query adFind {
    AdFind(query: "[{}]") {
      _id
      owner {
        login
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

const HomeScreen = () => {
  const [result, setResult] = React.useState(null);
  const [status, setStatus] = React.useState("idle");
  
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
    <div className="mt-3 flex-grow-1">
      <div className="col-sm-12 my-3">
        <StatusResolver
          noData={result !== null && result.length === 0}
          status={status}
        >
          <ul>
            {result === null ? null : 
              result.map((ad) => (
                <AdItem key={ad._id} {...ad} />
              ))
            }
          </ul>
        </StatusResolver>
      </div> 
    </div> 

  )
};

export default HomeScreen;
