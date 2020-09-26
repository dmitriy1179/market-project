const initialAdsState = {
  adsData: null,
  status: "idle"
};
  
function adsReducer(state = initialAdsState, action) {
  switch (action.type) {
    case "request/pending":
      return {
        ...state,
        status: "pending"
      };
    case "request/resolved":
      return {
        ...state,
        adsData: action.payload,
        status: "resolved"
      };
    case "request/rejected":
      return {
        ...state,
        status: "rejected",
      };
    default:
      return state;
  }
}
  
export default adsReducer