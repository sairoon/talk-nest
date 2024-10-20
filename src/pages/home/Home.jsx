import React from "react";
import AllUsers from "../../components/allUsers/Index";
import FriendReq from "../../components/friendRequest/Index";
import MyFriends from "../../components/myFriends/Index";
import { Helmet } from "react-helmet-async";

const Home = () => {
  return (
    <>
    <Helmet>
      <title>TalkNest | Home</title>
    </Helmet>
      <div className="w-full h-full grid grid-cols-3 gap-6 py-6 px-6">
        <AllUsers />
        <FriendReq />
        <MyFriends />
      </div>
    </>
  );
};

export default Home;
