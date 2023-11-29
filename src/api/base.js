import axios from "axios"

export default axios.create({
  baseURL: true? "https://sjit-api.onrender.com"//"https://sjit-attendance-api.herokuapp.com" 
    : 
  "http://localhost:5000",
  headers: {
    "Content-type": "application/json"||"multipart/form-data"||"image/png"
  }
})