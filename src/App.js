import React from "react";
import { withRouter } from "react-router-dom";
import Routes from "./Routes";
import "./Header.css";
import "./Footer.css";

function App(props) {
    return (
        <>
            <div className="app-header"></div>
            <Routes />
            <div className="app-footer"></div>
        </>
    );
}

export default withRouter(App);