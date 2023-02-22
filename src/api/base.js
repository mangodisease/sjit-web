import axios from "axios"

export default axios.create({
  baseURL: "https://sjit-attendance-api.herokuapp.com",
  headers: {
    "Content-type": "application/json"||"multipart/form-data"||"image/png"
  }
})