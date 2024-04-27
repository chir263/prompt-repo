import React from "react";
import ReactLoading from "react-loading";

const ScreenLoader = () => {
  return (
    <div className="host-req absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 h-full flex items-center justify-center z-1150">
      <ReactLoading type={"spin"} color={"#28bfa4"} height={50} width={50} />
    </div>
  );
};

export default ScreenLoader;
