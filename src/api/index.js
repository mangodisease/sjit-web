/* eslint-disable */
import { data } from "autoprefixer"
import axios from "axios"

const baseURL = true ? "https://sjit-attendance-api.herokuapp.com" : "http://localhost:5000"

const JWT = localStorage.getItem("JWT")

const api_url = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-type": "application/json" || "multipart/form-data" || "image/png"
    }
})

export async function loginAPI(col, username, password) {
    return api_url.post("/login", {
        col: col,
        username: username,
        password: password
    })
}


export async function getAllSchedules() {
    return api_url.post("/get", {
        col: "class_schedule",
        query: {}, select: "", join: "teacher"
    })
}

export async function AddSchedule(data) {
    return api_url.post("/insert", {
        col: "class_schedule",
        data: data
    })
}

export async function UpdateSchedule(data, query) {
    return api_url.post("/update", {
        col: "class_schedule",
        data: data,
        query: query
    })
}

export async function getAllStudents() {
    return api_url.post("/get", {
        col: "students",
        query: {}, select: ""
    })
}

export async function AddStudent(formData) {
    return axios({
        method: "post",
        url: baseURL + "/add-student",
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data",
            //"Authorization": "Bearer "+ JWT 
        }
    })
}

export async function UpdateStudent(formData) {
    return axios({
        method: "post",
        url: baseURL + "/update-student",
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data",
            //"Authorization": "Bearer "+ JWT 
        }
    })
}

export async function getAllTeachers() {
    return api_url.post("/get", {
        col: "teachers",
        query: {}, select: ""
    })
}

export async function AddTeacher(data) {
    return api_url.post("/insert", {
        col: "teachers",
        data: data
    })
}

export async function UpdateTeacher(data, query) {
    return api_url.post("/update", {
        col: "teachers",
        data: data,
        query: query
    })
}

export async function getEnrolledStudents() {
    return api_url.post("/get", {
        col: "enrolled",
        query: {}, select: "", join: "student class_schedule teacher"
    })
}

export async function EnrollStudent(data) {
    return api_url.post("/insert", {
        col: "enrolled",
        data: data
    })
}

export async function UpdateEnrolledStudent(data, query) {
    return api_url.post("/update", {
        col: "enrolled",
        data: data,
        query: query
    })
}

export async function RemoveEnrolledSchedule(_id) {
    return api_url.post("/remove", {
        col: "enrolled",
        _id: _id
    })
}