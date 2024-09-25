import React from "react";
import { HomeIcon } from "../../svg/Home";
import { MessageIcon } from "../../svg/Message";
import { LogoutIcon } from "../../svg/Logout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UploadIcon } from "../../svg/Upload";
import { getAuth, signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { LoggedOutUsers } from "../../features/slices/LoginSlice";

const Navber = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = getAuth();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/sign-in");
        localStorage.removeItem("user");
        dispatch(LoggedOutUsers());
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <aside className="w-[166px] h-full dark:bg-[#352481] bg-[#5E3493] flex flex-col justify-between items-center text-black py-3">
        <div className="flex flex-col items-center gap-y-2 pt-4">
          <div className="relative ">
            <div className="w-[106px] h-[106px] rounded-full bg-[#118060] flex items-center justify-center"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
              <UploadIcon />
            </div>
          </div>
          <span className="text-white font-semibold text-xl px-2 flex justify-center">
            User nam..
          </span>
        </div>
        <div className="flex flex-col items-center gap-y-10 pb-12 cursor-pointer">
          <Link to={"/"} className="text-white relative">
            <HomeIcon />
            {location.pathname === "/" && (
              <span className="absolute -top-2 -right-[50px] w-2 h-16 bg-white dark:bg-slate-800 cursor-auto"></span>
            )}
          </Link>
          <Link to={"/message"} className="text-white relative">
            <MessageIcon />
            {location.pathname === "/message" && (
              <span className="absolute -top-2 -right-[50px] w-2 h-16 bg-white dark:bg-slate-800 cursor-auto"></span>
            )}
          </Link>
        </div>
        <button
          className="flex items-center gap-x-2 text-white font-semibold text-xl pb-10 cursor-pointer"
          onClick={handleLogout}
        >
          <span>
            <LogoutIcon />
          </span>
          Log Out
        </button>
      </aside>
    </>
  );
};

export default Navber;
