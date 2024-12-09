import moment from "moment";

export const formatDate = (dateString) => {
  return moment(dateString).format("dddd, MMMM Do YYYY, h:mm A"); // Example: "Friday, November 29th 2024, 12:20 AM"
};
