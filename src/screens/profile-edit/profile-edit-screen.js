import React from "react";
import API from "../../API";
import { gql } from "graphql-request";
import StatusResolver from "../../shared/components/statusResolver"
import { useParams, Redirect } from "react-router-dom";
import ReactTagInput from "@pathofdev/react-tag-input"
import "@pathofdev/react-tag-input/build/index.css";

const userData = gql`
  query userFind($query: String) {
    UserFind(query: $query) {
      _id
      createdAt
      login
      nick
      avatar {
        _id
      }
      phones
      addresses 
    }
  }
`;

const editUser = gql`
  mutation edit($_id: String, $login: String, $nick: String, $avatar: ImageInput, $phones: [String], $addresses: [String]) {
    UserUpsert(user: {
      _id: $_id
      login: $login,
      nick: $nick,
      avatar: $avatar,
      phones: $phones
      addresses: $addresses,
    }) {
      _id
    }
  }
`;

const ProfileEditSreen = () => {
  const { _id } = useParams()
  const [values, setValues] = React.useState(null);
  const [status, setStatus] = React.useState("idle");

  const searchUserData = () => {
    try {
      setStatus("searching");
        API.request(userData, {
          query: JSON.stringify([
            {
              _id: _id
            }
          ])
        }).then((res) => {
          console.log("res", res)
          if (res.UserFind[0].addresses === null) {
            res.UserFind[0].addresses = []
          }
          if (res.UserFind[0].phones === null) {
            res.UserFind[0].phones = []
          }
          setValues(res.UserFind[0]);
          setStatus("idle");
      });
    } catch (e) {
        setStatus("rejected");
    }  
  };

  const onChange = (e) => {
    const target = e.target;
    (setValues((prev) => ({
      ...prev,
      [target.name]: target.value
    })));
    console.log("values", values)
  };

  const onChangeAddressesInput = (newTags) => {
    setValues((prev) => ({
      ...prev,
      "addresses": [...newTags]
    }));
  }

  const onChangePhonesInput = (newTags) => {
    setValues((prev) => ({
      ...prev,
      "phones": [...newTags]
    }));
  } 

  const onChangeAvatar = (e) => {
    setStatus("searching");
    const formData = new FormData();
    formData.append("photo", e.target.files[0]);
    fetch(`http://marketplace.asmer.fs.a-level.com.ua/upload`, {
      method: "POST",
      headers: localStorage.token
        ? { Authorization: "Bearer " + localStorage.token }
        : {},
      body: formData
    })
      .then((res) => res.json())
      .then((json) => {
        setValues((prev) => ({
          ...prev,
          "avatar": {"_id": json._id}
        }));
        setStatus("idle");
      });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    try {
      setStatus("searching");
      API.request(editUser, values)
       .then((res) => {
          console.log("res", res)
          setStatus("resolved");
        });
    } catch (e) {
      setStatus("rejected");
    }  
  };

  React.useEffect(() => {
    searchUserData()
  }, [])

  console.log(values, "result", values !== null && values.length !== 0);

  return (
    <div className="Container mt-3 flex-grow-1">
      {values === null ? null :
        (<form onSubmit={onSubmit} className="col-8 mx-auto mt-3">
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Login</label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                placeholder="Login"
                name="login"
                onChange={onChange}
                defaultValue={values.login}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Nick</label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                placeholder="Nick"
                name="nick"
                onChange={onChange}
                defaultValue={values.nick}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Avatar</label>
            <div className="col-sm-10">
              <input
                type="file"
                className="form-control-file"
                placeholder="ImageInput"
                name="avatar"
                onChange={onChangeAvatar}
              />
            </div>
          </div>  
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Phones</label>
            <div className="col-sm-10">
              <ReactTagInput 
                tags={values.phones}
                onChange={(newTags) => onChangePhonesInput(newTags)}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Addresses</label>
            <div className="col-sm-10">
              <ReactTagInput 
                tags={values.addresses}
                onChange={(newTags) => onChangeAddressesInput(newTags)}
              />
            </div>
          </div>
        <button className="btn btn-secondary" disabled={status === "searching"}>Edit profile</button>
        </form>)
      }
      <StatusResolver
        status={status}
        >
          <Redirect to="/" />
      </StatusResolver>  
    </div>
  )
}

export default ProfileEditSreen