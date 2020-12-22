import { GraphQLClient } from "graphql-request";

export const NO_CORS = "https://cors-anywhere.herokuapp.com/";

const ENDPOINT = 
  `${NO_CORS}http://marketplace.asmer.fs.a-level.com.ua/graphql`;

const client = new GraphQLClient(ENDPOINT);

const token = localStorage.getItem("token");

if (token !== null) {
  console.log("token", token);
  client.setHeader("Authorization", `Bearer ${localStorage.getItem("token")}`);
}

export default client;

