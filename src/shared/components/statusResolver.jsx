import React from "react";
import Spinner from "./spinner"

const StatusResolver = ({ status, noData, content, children }) => {
  if (status === "searching") {
    return <Spinner />;
  }
  if (noData) {
    return <span className="text-info">{content}</span>;
  }
  if (status === "rejected") {
    return <span className="text-danger">Something went wrong</span>;
  }
  if (status === "idle") {
    return null;
  }
  if (status === "resolved") {
    return children;
  }
};

StatusResolver.defaultProps = {
  noData: false,
  content: "No Data"
};

export default StatusResolver