import React from "react";

const MyFriends = () => {
  return (
    <>
      <div className="bg-transparent dark:bg-slate-600 shadow-lg rounded-[10px] py-5 px-6 h-full overflow-y-auto">
        <h1 className="text-[#494949] dark:text-white text-3xl font-semibold py-2">
          My Friends
        </h1>
        <div className="flex items-center justify-between mt-6 cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-slate-400"></div>
            <h3 className="text-2xl font-normal text-[#3D3C3C] dark:text-white">
              User Name
            </h3>
          </div>
          <div className="flex items-center gap-x-2">
            <button className="bg-[#4A81D3] dark:bg-sky-600 px-8 py-3 rounded-md font-medium text-sm text-white">
              Unfriend
            </button>
            <button className="bg-[#D34A4A] dark:bg-red-500 px-8 py-3 rounded-md font-medium text-sm text-white">
              Block
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-6 cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-slate-400"></div>
            <h3 className="text-2xl font-normal text-[#3D3C3C] dark:text-white">
              User Name
            </h3>
          </div>
          <div className="flex items-center gap-x-2">
            <button className="bg-[#4A81D3] dark:bg-sky-600 px-8 py-3 rounded-md font-medium text-sm text-white">
              Unfriend
            </button>
            <button className="bg-[#D34A4A] dark:bg-red-500 px-8 py-3 rounded-md font-medium text-sm text-white">
              Block
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-6 cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-slate-400"></div>
            <h3 className="text-2xl font-normal text-[#3D3C3C] dark:text-white">
              User Name
            </h3>
          </div>
          <div className="flex items-center gap-x-2">
            <button className="bg-[#4A81D3] dark:bg-sky-600 px-8 py-3 rounded-md font-medium text-sm text-white">
              Unfriend
            </button>
            <button className="bg-[#D34A4A] dark:bg-red-500 px-8 py-3 rounded-md font-medium text-sm text-white">
              Block
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyFriends;
