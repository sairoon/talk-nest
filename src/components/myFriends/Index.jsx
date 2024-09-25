import React from "react";

const MyFriends = () => {
  return (
    <>
      <div className="bg-transparent dark:bg-slate-600 shadow-lg rounded-[10px] py-5 px-6 h-full overflow-y-auto">
        <h1 className="text-[#494949] dark:text-white text-3xl font-semibold py-2">
          My Friends
        </h1>
        <div className="flex items-center justify-between mt-6 cursor-pointer">
        <div className="flex items-center gap-3 cursor-pointer">
        <img src="https://picsum.photos/202" className="w-16 h-16 rounded-full" alt="friend-profile-pic"/>
            <h3 className="text-2xl font-normal text-[#3D3C3C] dark:text-white">
              Friend's Name
            </h3>
          </div>
          <div className="flex items-center gap-x-2">
            <button className="bg-[#4A81D3] dark:bg-sky-600 px-8 py-3 rounded-md font-medium text-sm text-white active:scale-90 transition ease-out">
              Unfriend
            </button>
            <button
              className="bg-[#D34A4A] dark:bg-red-500 px-8 py-3 rounded-md font-medium text-sm text-white active:scale-90 transition ease-out"
              title=""
            >
              Block
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-3 cursor-pointer">
            <img src="https://picsum.photos/10" className="w-16 h-16 rounded-full" alt="friend-profile-pic"/>
            <h3 className="text-2xl font-normal text-[#3D3C3C] dark:text-white">
              Friend's Name
            </h3>
          </div>
          <div className="flex items-center">
            <button
              className="bg-violet-600 dark:bg-violet-500 px-8 py-3 rounded-md font-semibold text-sm text-white active:scale-90 transition ease-out"
              title="Click to unblock"
            >
              Unblock
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-6 cursor-pointer">
        <div className="flex items-center gap-3 cursor-pointer">
        <img src="https://picsum.photos/20" className="w-16 h-16 rounded-full" alt="friend-profile-pic"/>
            <h3 className="text-2xl font-normal text-[#3D3C3C] dark:text-white">
              Friend's Name
            </h3>
          </div>
          <div className="flex items-center gap-x-2">
            <button
              className="bg-amber-400 px-8 py-3 rounded-md font-semibold text-sm text-black active:scale-90 transition ease-out"
              title="You're blocked"
            >
              Blocked
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyFriends;
