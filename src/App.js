/* eslint-disable */
import { Switch, Route, Redirect, useLocation, useHistory } from "react-router-dom";

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
import MyClass from "./pages/MyClass";
import AttendanceLogs from "./pages/AttendanceLogs";
import SummaryReport from "./pages/SummaryReport";
import DTRStudent from "./pages/DTRStudent";
function App() {
  const history = useHistory()
  const [user, setuser] = useState(getCachedUser())//null
  const location = useLocation()
  const [loginAs, setloginAs] = useState(localStorage.getItem("loginAs")!==undefined? localStorage.getItem("loginAs") : "")
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
    history.push(redirect(user, loginAs))
  },
    []
  )

  function redirect() {
    try {
      console.log(user)
      console.log(loginAs)
      if (user !== null && loginAs === "Admin") { return "/class-schedule" }
      else if (user !== null && loginAs === "Teacher") { return "/my-class" }
      else if (user !== null && loginAs === "Student") { return "/my-schedule" }
      else { return "/" }
    } catch (err) {
      console.log(err.message)
      return location.pathname
    }
  }
  return (
    <div className="App">
      <Switch>
        <Route path={["/sign-in", "/"]} exact component={() => { return <Login setuser={setuser} open={open} setopen={setopen} loginAs={loginAs} setloginAs={setloginAs} redirect={redirect()} /> }} />
        <Main loginAs={loginAs} setloginAs={setloginAs} user={user} setuser={setuser} setopen={setopen}>
          <Route exact path="/class-schedule" component={() => { return <Schedules user={user} loginAs={loginAs} /> }} />
          <Route exact path="/enroll-student" component={() => { return <Enrollment user={user} loginAs={loginAs} /> }} />
          <Route exact path="/students" component={() => { return <Students user={user} loginAs={loginAs} /> }} />
          <Route exact path="/teachers" component={() => { return <Teachers user={user} loginAs={loginAs} /> }} />
          <Route exact path="/attendance" component={() => { return <SummaryReport user={user} loginAs={loginAs} /> }} />
          <Route exact path="/dtr-student" component={() => { return <DTRStudent user={user} loginAs={loginAs} /> }} />

          <Route exact path="/my-class" component={() => { return <MySchedules user={user} loginAs={loginAs} /> }} />
          <Route exact path="/my-students" component={() => { return <Students user={user} loginAs={loginAs} /> }} />
          <Route exact path="/my-class-attendance" component={() => { return <SummaryReport user={user} loginAs={loginAs} /> }} />

          <Route exact path="/my-schedule" component={() => { return <MyClass user={user} /> }} />
          <Route exact path="/my-attendance" component={() => { return <AttendanceLogs user={user} loginAs={loginAs} /> }} />
          <Redirect from="*" to={location.pathname} />
        </Main>
      </Switch>
    </div>
  );
}

export default App;
