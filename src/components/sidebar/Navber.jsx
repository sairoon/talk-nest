import React, { useState } from "react";
import { HomeIcon } from "../../svg/Home";
import { MessageIcon } from "../../svg/Message";
import { LogoutIcon } from "../../svg/Logout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UploadIcon } from "../../svg/Upload";
import { getAuth, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { LoggedOutUsers } from "../../features/slices/LoginSlice";
import Modal from "../modal/Index";

const Navber = () => {
  const [show, setShow] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = getAuth();
  const user = useSelector((user) => user.login.loggedIn);

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
          <div className="relative group">
            <img
              src={user.photoURL || "/img/avatar.jpg"}
              className="w-[106px] h-[106px] rounded-full flex object-cover items-center justify-center"
              alt="my-profile-pic"
            />
            <div
              className="absolute top-1/2 left-1/2 rounded-full opacity-0 transform -translate-x-1/2 -translate-y-1/2 text-white z-20 group-hover:opacity-100 cursor-pointer transition ease-out active:scale-90"
              onClick={() => setShow(true)}
            >
              <UploadIcon />
            </div>
            <span className="absolute top-1/2 left-1/2 bg-black w-full h-full opacity-0 rounded-full transform -translate-x-1/2 -translate-y-1/2 group-hover:opacity-45 transition ease-out"></span>
          </div>
          <span className="text-white font-semibold text-xl px-2 flex justify-center capitalize">
            {user.displayName}
          </span>
        </div>
        <nav className="flex flex-col items-center gap-y-10 pb-12 cursor-pointer">
          <Link
            to={"/"}
            className="text-white relative active:scale-90 transition ease-out"
          >
            <HomeIcon />
            {location.pathname === "/" && (
              <span className="absolute -top-2 -right-[50px] w-2 h-16 bg-white dark:bg-slate-800 cursor-auto"></span>
            )}
          </Link>
          <Link
            to={"/message"}
            className="text-white relative active:scale-90 transition ease-out"
          >
            <MessageIcon />
            {location.pathname === "/message" && (
              <span className="absolute -top-2 -right-[50px] w-2 h-16 bg-white dark:bg-slate-800 cursor-auto"></span>
            )}
          </Link>
        </nav>
        <button
          className="flex items-center gap-x-2 text-white font-semibold text-xl pb-10 cursor-pointer hover:scale-105 active:scale-95 transition ease-out"
          onClick={handleLogout}
        >
          <span>
            <LogoutIcon />
          </span>
          Log Out
        </button>
      </aside>
      {show && <Modal setShow={setShow} />}
    </>
  );
};

export default Navber;
