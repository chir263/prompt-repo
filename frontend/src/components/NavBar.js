import React from "react";
import NavImg from "../media/download.png";
import useStore from "../hooks/useStore";

const NavBar = () => {
  const userInfo = useStore((state) => state.user);
  const getUser = () => {
    const name = userInfo?.login;
    if (name) return name;
    return "";
  };

  return (
    <>
      <div className="navbar-no-shadow-container w-nav">
        <div className="navbar-wrapper h-14">
          <img src={NavImg} loading="lazy" width="80" af-el="nav-img" alt="" />
          <div af-el="nav-title" className="text-block">
            Prompt Repository
          </div>
          <div style={{ float: "right", marginLeft: "auto" }}>
            <button
              className="logout-button"
              onClick={() => {
                let conf = window.confirm("Are you sure you want to logout?");
                if (conf) {
                  localStorage.removeItem("accessToken");
                  window.location.href = "/";
                }
              }}
            >
              {`Logout (${getUser()})`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
