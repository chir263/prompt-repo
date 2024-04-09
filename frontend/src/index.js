import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

document.title = "Lab Deployment";

root.render(
  <>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </>
);