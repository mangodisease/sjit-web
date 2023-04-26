/* eslint-disable */
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
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
function App() {
  const [user, setuser] = useState(null)
  const location = useLocation()
  const [loginAs, setloginAs] = useState("")
  const [open, setopen] = useState(true)

  function getCachedUser(){
    try {
      const l = localStorage.getItem("user")
      return JSON.parse(l)
    } catch (err) {
      console.log(err.message)
      return undefined
    }
  }
  useEffect(()=>{
    const u = getCachedUser()
    if(u!==undefined){
      setuser(u)
    }
  },
  []
  )
  return (
    <div className="App">
      <Switch>
        <Route path={["/sign-in", "/"]} exact component={()=>{ return <Login  setuser={setuser} open={open} setopen={setopen} loginAs={loginAs} setloginAs={setloginAs} /> }} />
          <Main>
            <Route exact path="/class-schedule" component={()=>{ return <Schedules user={user} />}} />
            <Route exact path="/enroll-student" component={()=>{ return <Enrollment />}} />
            <Route exact path="/students" component={()=>{ return <Students /> }} />
            <Route exact path="/teachers" component={()=>{ return <Teachers />}} />
            <Route exact path="/attendance" component={()=>{ return <Home />}} />
            
            <Redirect from="*" to={location.pathname} />
          </Main>
      </Switch>
    </div>
  );
}

export default App;
