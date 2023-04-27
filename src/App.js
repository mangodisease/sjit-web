/* eslint-disable */
import { Switch, Route, Redirect, useLocation, useHistory } from "react-router-dom";
import Home from "./pages/Home";
import Tables from "./pages/Tables";
//import SignIn from "./pages/SignIn";
import Main from "./components/layout/Main";
import Login from "./pages/LoginIn";
import Teachers from "./pages/Teachers";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import { useEffect, useState } from "react";
import Students from "./pages/Students";
import Schedules from "./pages/Schedules";
import Enrollment from "./pages/Enrollment";
import MySchedules from "./pages/MySchedules";
function App() {
  const history = useHistory()
  const [user, setuser] = useState({})//null
  const location = useLocation()
  const [loginAs, setloginAs] = useState("Teachers")
  const [open, setopen] = useState(true)

  function getCachedUser() {
    try {
      const l = localStorage.getItem("user")
      return JSON.parse(l)
    } catch (err) {
      console.log(err.message)
      return null
    }
  }
  useEffect(() => {
    const u = getCachedUser()
    if (u !== null) {
      //setuser(u)
    }
    history.push(redirect())
  },
    []
  )

  function redirect(){
    try {
      if(loginAs==="Admin"){ return "/class-schedule" }
      else if(loginAs==="Teachers"){ return "/my-class" }
      else if(loginAs==="Students"){ return "/my-schedule" }
      else { return "/" }
    } catch (err) {
      console.log(err.message)
      return location.pathname
    }
  }
  return (
    <div className="App">
      <Switch>
        <Route path={["/sign-in", "/"]} exact component={() => { return <Login setuser={setuser} open={open} setopen={setopen} loginAs={loginAs} setloginAs={setloginAs} /> }} />
        <Main loginAs={loginAs} user={user} setuser={setuser}>
          {
            loginAs === "Admin" ?
              <>
                <Route exact path="/class-schedule" component={() => { return <Schedules user={user} loginAs={loginAs} /> }} />
                <Route exact path="/enroll-student" component={() => { return <Enrollment  user={user} loginAs={loginAs}/> }} />
                <Route exact path="/students" component={() => { return <Students  user={user} loginAs={loginAs}/> }} />
                <Route exact path="/teachers" component={() => { return <Teachers  user={user} loginAs={loginAs}/> }} />
                <Route exact path="/attendance" component={() => { return <Home  user={user} loginAs={loginAs}/> }} />
              </>
              :
            loginAs === "Teachers" ?
              <>
                <Route exact path="/my-class" component={() => { return <MySchedules user={user} loginAs={loginAs} /> }} />
                <Route exact path="/my-students" component={() => { return <Students  user={user} loginAs={loginAs}/> }} />
                <Route exact path="/my-class-attendance" component={() => { return <Home  user={user} loginAs={loginAs}/> }} />
              </>
              :
            loginAs === "Students" ?
              <>
                <Route exact path="/my-schedule" component={() => { return <Schedules user={user} /> }} />
                <Route exact path="/my-attendance" component={() => { return <Home /> }} />
              </>
              :
              <>

              </>
          }
          <Redirect from="*" to={location.pathname} />
        </Main>
      </Switch>
    </div>
  );
}

export default App;
