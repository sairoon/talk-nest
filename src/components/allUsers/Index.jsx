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
          className="my-6 rounded-[10px] py-3 px-3 w-full bg-[#F8F8F8] outline-none"
          placeholder="Search User.."
        />
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <div className="w-20 h-20 rounded-full bg-slate-400"></div>
            <h3 className="text-xl font-medium text-[#3D3C3C] dark:text-white">
              User Name
            </h3>
          </div>
          <div
            className="text-black dark:text-white cursor-pointer"
            title="Add friend"
          >
            <AddUserIcon />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <div className="w-20 h-20 rounded-full bg-slate-400"></div>
            <h3 className="text-xl font-medium text-[#3D3C3C] dark:text-white">
              User Name
            </h3>
          </div>
          <div
            className="text-black dark:text-white cursor-pointer"
            title="Add friend"
          >
            <AddUserIcon />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <div className="w-20 h-20 rounded-full bg-slate-400"></div>
            <h3 className="text-xl font-medium text-[#3D3C3C] dark:text-white">
              User Name
            </h3>
          </div>
          <div
            className="text-black dark:text-white cursor-pointer"
            title="Add friend"
          >
            <AddUserIcon />
          </div>
        </div>
      </div>
    </>
  );
};

export default AllUsers;
