import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import LoginScreen from "../screens/LoginScreen";
import history from "../components/history";
import PrivateRoute from "./PrivateRoute";
import SideBar from "../components/SideBar";

//Screens
import IndividualProject from "../screens/IndividualProject";
import CreateUserScreen from "../screens/CreateUserScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CreateProjectScreen from "../screens/CreateProjectScreen";
import IndividualUserScreen from "../screens/IndividualUser";
import UsersScreen from "../screens/UsersScreen";
import AllProjectsScreen from "../screens/AllProjectsScreen";
import GraphScreen from "../screens/GraphScreen";

const MainRoute = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={LoginScreen} />
        <PrivateRoute path="/profile" component={ProfileScreen} />
        <PrivateRoute path="/create-user" component={CreateUserScreen} />
        <PrivateRoute path="/create-project" component={CreateProjectScreen} />
        <PrivateRoute
          path="/project/:projectId"
          component={IndividualProject}
        />
        <PrivateRoute path="/user/:userId" component={IndividualUserScreen} />
        <PrivateRoute path="/users" component={UsersScreen} />
        <PrivateRoute path="/projects" component={AllProjectsScreen} />
        <PrivateRoute path="/graphs" component={GraphScreen} />
      </Switch>
    </Router>
  );
};

export default MainRoute;
