import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./pages/Home";
import Tables from "./pages/Tables";
//import SignIn from "./pages/SignIn";
import Main from "./components/layout/Main";
import Login from "./pages/LoginIn";
import Teachers from "./pages/Teachers";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import { useState } from "react";
import Students from "./pages/Students";
import Schedule from "./pages/Schedule";
function App() {
  const [user, setuser] = useState(null)
  //user!==null? "/class-schedule" : "/sign-in"
  return (
    <div className="App">
      <Switch>
        <Route path="/sign-in" exact component={()=>{ return <Login /> }} />
        <Main>
          <Route exact path="/class-schedule" component={()=>{ return <Schedule />}} />
          <Route exact path="/students" component={()=>{ return <Students /> }} />
          <Route exact path="/teachers" component={()=>{ return <Teachers />}} />
          <Route exact path="/attendance" component={()=>{ return <Home />}} />
          <Redirect from="*" to={"/class-schedule"} />
        </Main>
      </Switch>
    </div>
  );
}

export default App;
