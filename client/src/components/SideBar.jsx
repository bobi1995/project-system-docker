import SideNav, { NavItem, NavIcon, NavText } from "@trendmicro/react-sidenav";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import React, { useState } from "react";
import Header from "./Header";
import SingOutBtn from "./SignOutBtn";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import PeopleIcon from "@material-ui/icons/People";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import ListAltIcon from "@material-ui/icons/ListAlt";
import history from "../components/history";
import AlertBox from "./AlertBox";
import BarChart from "@material-ui/icons/BarChart";

const SideBar = (props) => {
  const [selected, setSelected] = useState("Профил");
  const [expanded, setExpanded] = useState(false);
  const [openSignOut, setOpenSignOut] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const renderTitle = () => {
    const url = props.children.props.location.pathname;
    const location = url.split("/");
    if (location[1]) {
      switch (location[1]) {
        case "profile":
          return "Профил";
        case "project":
          return "Проект";
        case "projects":
          return "Проекти";
        case "create-project":
          return "Създай Проект";
        case "create-user":
          return "Създай Потребител";
        case "user":
          return "Потребител";
        case "users":
          return "Потребители";
        case "graphs":
          return "Графики";
        default:
          return "";
      }
    } else return "";
  };

  return (
    <div>
      <SideNav
        onSelect={(selected) => {
          setSelected(selected);
        }}
        onToggle={(expanded) => setExpanded(expanded)}
        style={{
          position: "fixed",
          backgroundColor: "#35AEB6",
        }}
      >
        <SideNav.Toggle />
        <SideNav.Nav defaultSelected="home">
          <NavItem eventKey="Профил" onClick={() => history.push("/profile")}>
            <NavIcon>
              <AccountCircleIcon />
            </NavIcon>
            <NavText>Профил</NavText>
          </NavItem>
          <NavItem eventKey="Проекти" onClick={() => history.push("/projects")}>
            <NavIcon>
              <ListAltIcon />
            </NavIcon>
            <NavText>Проекти</NavText>
          </NavItem>
          {localStorage.getItem("admin") === "true" ? (
            <NavItem
              eventKey="Потребители"
              onClick={() => {
                if (localStorage.getItem("admin") === "true") {
                  history.push("/users");
                } else
                  setAlertMessage(
                    "Нямаш права за тази сесия. Обърни се към администратор."
                  );
              }}
            >
              <NavIcon>
                <PeopleIcon />
              </NavIcon>
              <NavText>Потребители</NavText>
            </NavItem>
          ) : null}
          {localStorage.getItem("admin") === "true" ? (
            <NavItem
              eventKey="Създай Проект"
              onClick={() => {
                if (localStorage.getItem("admin") === "true") {
                  history.push("/create-project");
                } else
                  setAlertMessage(
                    "Нямаш права за тази сесия. Обърни се към администратор."
                  );
              }}
            >
              <NavIcon>
                <CreateNewFolderIcon />
              </NavIcon>
              <NavText>Създай Проект</NavText>
            </NavItem>
          ) : null}
          {localStorage.getItem("admin") === "true" ? (
            <NavItem
              eventKey="Създай Потребител"
              onClick={() => {
                if (localStorage.getItem("admin") === "true") {
                  history.push("/create-user");
                } else
                  setAlertMessage(
                    "Нямаш права за тази сесия. Обърни се към администратор."
                  );
              }}
            >
              <NavIcon>
                <PersonAddIcon />
              </NavIcon>
              <NavText>Създай Потребител</NavText>
            </NavItem>
          ) : null}
          {/* {localStorage.getItem("admin") === "true" ? (
            <NavItem
              eventKey="Графики"
              onClick={() => {
                if (localStorage.getItem("admin") === "true") {
                  history.push("/graphs");
                } else
                  setAlertMessage(
                    "Нямаш права за тази сесия. Обърни се към администратор."
                  );
              }}
            >
              <NavIcon>
                <BarChart />
              </NavIcon>
              <NavText>Графики</NavText>
            </NavItem>
          ) : null} */}
          <NavItem eventKey="Излез" onClick={() => setOpenSignOut(true)}>
            <NavIcon>
              <ExitToAppIcon />
            </NavIcon>
            <NavText>Излез</NavText>
          </NavItem>
        </SideNav.Nav>
      </SideNav>
      <div>
        <Header title={renderTitle()} />

        <div
          style={{
            position: "relative",
            oveflow: "hidden",
            transition: "all .15s",
            padding: "0 20px",
            marginLeft: expanded ? 240 : 64,
          }}
        >
          {props.children}
        </div>
      </div>
      {openSignOut ? (
        <SingOutBtn
          openSignOut={openSignOut}
          setOpenSignOut={setOpenSignOut}
          setSelected={setSelected}
        />
      ) : null}
      {alertMessage ? (
        <AlertBox
          success={false}
          text={alertMessage}
          display={setAlertMessage}
        />
      ) : null}
    </div>
  );
};

export default SideBar;
