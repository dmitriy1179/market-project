import React from "react";

const AdItemOne = ({ _id, title, createdAt, price, description, owner, onClick, children }) => {
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
      <div className="text-justify my-3" style={{fontSize:"18px"}}>
        <span>Phones:{owner.phones}</span>
      </div>

      <div className="d-flex justify-content-between">
        <div className="align-self-start mt-3" style={{fontSize:"14px"}}>Posted: {new Date(createdAt/1).toLocaleDateString()}</div>
        <div className="d-flex justify-content-end flex-grow-1 align-items-end">
          <button type="button"
            className="btn btn-outline-secondary btn-sm mr-3"
            //onClick = {() => onClick(_id)}
          >
            Comments
          </button>
          {children}
        </div>
      </div>  
    </div>
  )  
}

export default AdItemOne