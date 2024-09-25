import React from "react";
import { VoiceIcon } from "../../svg/Voice";
import { EmojiIcon } from "../../svg/Emoji";
import { GalleryIcon } from "../../svg/Gallery";

const Chatting = () => {
  return (
    <>
      <div className="bg-transparent dark:bg-slate-600 shadow-xl rounded-[10px] h-full col-span-2 overflow-y-hidden">
        <div className="w-full bg-[#F9F9F9] dark:bg-slate-700 py-3 px-3 flex items-center gap-x-3">
          <div className="w-20 h-20 rounded-full bg-slate-400"></div>
          <div className="text-black dark:text-white text-xl font-medium">
            User name
          </div>
        </div>
        <div className="w-full h-[738px] bg-white dark:bg-slate-600 overflow-y-auto px-4"></div>
        <div className="h-[116px] w-full bg-white dark:bg-slate-600 flex items-center justify-center ">
          <div className="h-20 w-[90%] bg-[#F5F5F5] dark:bg-slate-700 rounded-[10px] flex items-center justify-between">
            <div className="flex items-center gap-x-3 px-3 text-black dark:text-white ms-4 cursor-pointer">
              <VoiceIcon />
              <EmojiIcon />
              <GalleryIcon />
            </div>
            <input
              type="text"
              className="w-full outline-none bg-transparent text-[#C8C8C8] px-4"
              placeholder="type here...."
            />
            <button className="bg-[#3E8DEB] py-4 px-10 rounded-[10px] font-medium text-white text-xl me-3">
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatting;
