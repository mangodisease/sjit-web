/* eslint-disable */
import axios from "axios"

const baseURL = true? "https://sjit-attendance-api.herokuapp.com" : "http://localhost:5000"

const JWT = localStorage.getItem("JWT")

const api_url = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-type": "application/json"||"multipart/form-data"||"image/png"
  }
})

    export async function getAllStudents(){
        return api_url.post("/get", {
            col: "students",
            query: {}, select: ""
        })
    }

    export async function AddStudent(formData){
        return axios({
            method: "post",
            url: baseURL+"/add-student",
            data: formData,
            headers: { "Content-Type": "multipart/form-data",
            //"Authorization": "Bearer "+ JWT 
            }
        })
    }
    
