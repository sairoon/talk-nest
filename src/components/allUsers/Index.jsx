import React from "react";
import { AddUserIcon } from "../../svg/AddUser";

const AllUsers = () => {
  return (
    <>
      <div className="bg-transparent dark:bg-slate-600 shadow-lg rounded-[10px] py-5 px-6 h-full overflow-y-auto">
        <h1 className="text-3xl font-semibold text-[#494949] dark:text-white py-2">
          All Users
        </h1>
        <input
          type="text"
          className="my-6 rounded-[10px] py-3 px-4 w-full bg-[#F8F8F8] outline-none text-2xl font-normal"
          placeholder="Search User.."
        />
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <img
              src="https://picsum.photos/103"
              className="w-16 h-16 rounded-full"
              alt="user-img"
            />
            <h3 className="text-2xl font-medium text-[#3D3C3C] dark:text-white">
              User Name
            </h3>
          </div>
          <div
            className="text-black dark:text-white me-6 cursor-pointer scale-125 active:scale-105 transition ease-out"
            title="Add friend"
          >
            <AddUserIcon />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <img
              src="https://picsum.photos/104"
              className="w-16 h-16 rounded-full"
              alt="user-img"
            />{" "}
            <h3 className="text-2xl font-medium text-[#3D3C3C] dark:text-white">
              User Name
            </h3>
          </div>
          <button
            className="bg-rose-500 px-4 py-3 rounded-md text-white text-sm font-semibold active:scale-90 transition ease-out"
            title="Cancel request"
          >
            Cancel
          </button>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <img
              src="https://picsum.photos/105"
              className="w-16 h-16 rounded-full"
              alt="user-img"
            />{" "}
            <h3 className="text-2xl font-medium text-[#3D3C3C] dark:text-white">
              User Name
            </h3>
          </div>
          <button
            className="bg-sky-500 px-4 py-3 rounded-md text-white text-sm font-semibold active:scale-90 transition ease-out"
            title="Send you friend request"
          >
            Request
          </button>
        </div>
      </div>
    </>
  );
};

export default AllUsers;
