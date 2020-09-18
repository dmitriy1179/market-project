import React from "react";
import API from "../../API";
import { gql } from "graphql-request";
import NavBar from "../../shared/components/navbar";
import Logout from "../../shared/components/logout";
import StatusResolver from "../../shared/components/statusResolver"

const postAd = gql`
  mutation post($title: String!, $description: String!, $images: [ImageInput], $tags: [String], $address: String, $price: Float!) {
    AdUpsert(ad: {
      title: $title,
      description: $description,
      images: $images,
      tags: $tags
      address: $address,
      price: $price

    }) {
      _id
    }
  }
`;

const PostAdUser = () => {
  const [values, setValues] = React.useState({});
  const [result, setResult] = React.useState(null);
  const [status, setStatus] = React.useState("idle");

  const onChange = (e) => {
    const target = e.target;
    target.name === "price" ? 
    (setValues((prev) => ({
      ...prev,
      [target.name]: +target.value
    }))) : 
    (setValues((prev) => ({
      ...prev,
      [target.name]: target.value
    })));
    console.log("values", values)
  };

  const onChangeInputImage = (e) => {
    const arrImages = [];
    for (let i=0; i < e.target.files.length; i++) {
      setStatus("searching");
      const formData = new FormData();
      formData.append("photo", e.target.files[i]);
  
      fetch(`http://marketplace.asmer.fs.a-level.com.ua/upload`, {
        method: "POST",
        headers: localStorage.token
          ? { Authorization: "Bearer " + localStorage.token }
          : {},
        body: formData
      })
        .then((res) => res.json())
        .then((json) => {
          console.log("UPLOAD RESULT", json._id);
          arrImages.push({"_id": json._id})
          console.log("arr", arrImages)
          setStatus("idle");
        
        })

    }
    setValues((prev) => ({
      ...prev,
      "images": arrImages
    }));
    console.log("values", values)
    

  };

  const onSubmit = (e) => {
    e.preventDefault();
    try {
      setStatus("searching");
      API.request(postAd, values)
       .then((res) => {
          console.log("res", res)
          setResult(res);
          setStatus("resolved");
        });
    } catch (e) {
      setStatus("rejected");
    }  
  };
  console.log(result, "result", result !== null && result.length !== 0); 

  return (

    <div className="Container mt-3">
      <NavBar>
        <Logout />
      </NavBar>  
      <form onSubmit={onSubmit} className="col-8 mx-auto mt-3">
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Title</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              placeholder="Title"
              name="title"
              onChange={onChange}
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Description</label>
          <div className="col-sm-10">
            <textarea
              className="form-control"
              placeholder="Description"
              name="description"
              onChange={onChange}
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">ImageInput</label>
          <div className="col-sm-10">
            <input
              type="file"
              className="form-control-file"
              placeholder="ImageInput"
              name="imageInput"
              onChange={onChangeInputImage}
              multiple
            />
          </div>
        </div>

        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Tags</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              placeholder="Tags"
              name="tags"
              onChange={onChange}
            />
          </div>
        </div>

        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Address</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              placeholder="Address"
              name="address"
              onChange={onChange}
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Price</label>
          <div className="col-sm-10">
            <input
              type="number"
              className="form-control"
              placeholder="Price"
              name="price"
              onChange={onChange}
            />
          </div>
        </div>

        <button className="btn btn-primary">Post</button>
      </form>
      <StatusResolver
        status={status}
        >
        <span className="text-primary pt-3 mt-3">
          Your ad uploaded successfully
        </span>      
      </StatusResolver>
    </div>
  );
};
export default PostAdUser