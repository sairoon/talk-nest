import React from "react";
import MyFriends from "../../components/myFriends/Index";
import Chatting from "../../components/chat/Index";
import { Helmet } from "react-helmet-async";

const Message = () => {
  return (
    <>
    <Helmet>
      <title>TalkNest | Message</title>
    </Helmet>
      <div className="w-full h-full grid grid-cols-3 gap-6 py-6 px-6">
        <MyFriends />
        <Chatting />
      </div>
    </>
  );
};

export default Message;
