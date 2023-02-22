/* eslint-disable */
import http from "./base";

class API {

    getAllStudents(){
        return http.post("/get", {
            col: "students",
            query: {}, select: ""
        })
    }
}

export default new API()