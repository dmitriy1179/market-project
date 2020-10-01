import React from "react";
import API from "../../API";
import { gql } from "graphql-request";
import StatusResolver from "../../shared/components/statusResolver"
import { useParams, Redirect } from "react-router-dom";
import ReactTagInput from "@pathofdev/react-tag-input"
import "@pathofdev/react-tag-input/build/index.css";

const myAdOneFind = gql`
  query adFindOne($query: String) {
    AdFind(query: $query) {
      _id
      images {
        _id
        url
      }
      title
      description
      tags
      address
      price
    }
  }
`;

const editAd = gql`
  mutation post($_id: ID, $title: String!, $description: String, $images: [ImageInput], $tags: [String], $address: String, $price: Float!) {
    AdUpsert(ad: {
      _id: $_id
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

const MyAdEditSreen = () => {
  const { _id } = useParams()
  const [values, setValues] = React.useState(null);
  const [status, setStatus] = React.useState("idle");
  const [isDelImage, setIsDelImage] = React.useState(false);
  const [isRequest, setIsRequest] = React.useState(true);
  const [arrOldImages, setArrOldImages] = React.useState([])

  const searchUserAdOne = () => {
    try {
      setStatus("searching");
        API.request(myAdOneFind, {
          query: JSON.stringify([
            {
              _id: _id
            }
          ])
        }).then((res) => {
          const tagsSet = new Set(res.AdFind[0].tags);
          const tags = ["sport", "entertainment", "health", "antiques", "technology"]
          tags.forEach(tag => tagsSet.add(tag))
          res.AdFind[0].tags = [...tagsSet]
          setArrOldImages(res.AdFind[0].images === null ? [] : 
            (res.AdFind[0].images.length === 0 ? [] : 
              (res.AdFind[0].images[0].url === null ? [] :
                (res.AdFind[0].images))))
          res.AdFind[0].images = []      
          setValues(res.AdFind[0]);
          setStatus("idle");
      });
    } catch (e) {
      setStatus("rejected");
    }  
  };

  const onClickDelete = (i) => {
    arrOldImages.splice(i, 1);
    setIsDelImage(!isDelImage)
    console.log("images", arrOldImages)
  }

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

  const onChangeTagsInput = (newTags) => {
    setValues((prev) => ({
      ...prev,
      "tags": [...newTags]
    }));
    console.log("values", values)
  }

  const onChangeInputImage = (e) => {
    setStatus("searching");
    const arrImages = [];
    const arrLength = e.target.files.length
    for (let i=0; i < e.target.files.length; i++) {
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
          arrImages.push({"_id": json._id})
          console.log("arr", arrImages)
          if (arrImages.length === arrLength) {
            setStatus("idle");
          } 
        })
    }
    setValues((prev) => ({
      ...prev,
      "images": arrImages
    }));
    console.log("values", values)
  };

  const onSubmit = (e) => {
    if (arrOldImages.length !== 0) {
      arrOldImages.forEach((image) => {
        const {_id: id} = image
        console.log("imageId", {_id:id})
        values.images.push({_id:id})
      })
      console.log("images", values.images)
    }
    e.preventDefault();
    try {
      setStatus("searching");
      API.request(editAd, values)
       .then((res) => {
          console.log("res", res)
          setStatus("resolved");
        });
    } catch (e) {
      setStatus("rejected");
    }  
  };

  React.useEffect(() => {
    if (isRequest) {
      searchUserAdOne();
      setIsRequest(false);
     }
  }, [isDelImage])

  console.log(values, "result", values !== null && values.length !== 0);


  return (
    <div className="Container mt-3 flex-grow-1">
      {values === null ? null : 
        (<form onSubmit={onSubmit} className="col-8 mx-auto mt-3">
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Title *</label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                placeholder="Title"
                name="title"
                onChange={onChange}
                defaultValue={values.title}
                required
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
                defaultValue={values.description}
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
            <div className="d-flex justify-content-center flex-wrap">
              {arrOldImages === null || arrOldImages.length === 0 ? null : (
                arrOldImages[0].url === null ? null :
                  arrOldImages.map((image, index) => (
                    image.url === null ? null :
                      <div key={index} className="my-3 col-3 w-100 mx-auto p-3">
                        <div className="w-100">
                          <img src={`http://marketplace.asmer.fs.a-level.com.ua/${image.url}`}
                            className="img-fluid rounded w-100 h-100"
                            alt="picture" 
                            />
                        </div>
                        <div className="d-flex justify-content-center">
                          <button type="button"
                            className="btn btn-outline-danger btn-sm my-3"
                            onClick = {() => onClickDelete(index)}
                            >
                            Delete
                          </button>
                        </div>
                      </div>    
                    )
                  )
                )
              }
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Tags</label>
            <div className="col-sm-10">
              <ReactTagInput 
                tags={values.tags}
                onChange={(newTags) => onChangeTagsInput(newTags)}
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
                defaultValue={values.address}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Price *</label>
            <div className="col-sm-10">
              <input
                type="number"
                className="form-control"
                placeholder="Price"
                name="price"
                onChange={onChange}
                defaultValue={values.price}
                required
              />
            </div>
          </div>
          <button className="btn btn-secondary" disabled={status === "searching"}>Edit ad</button>
        </form>)
      }
      <StatusResolver
        status={status}
        >
          <Redirect to="/ad/curUser" />
      </StatusResolver>
    </div>
  )
}

export default MyAdEditSreen