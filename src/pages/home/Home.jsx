import React from "react";
import AllUsers from "../../components/allUsers/Index";
import FriendReq from "../../components/friendRequest/Index";
import MyFriends from "../../components/myFriends/Index";

const Home = () => {
  return (
    <>
      <div className="w-full h-full grid grid-cols-3 gap-6 py-6 px-6">
        <AllUsers />
        <FriendReq />
        <MyFriends />
      </div>
    </>
  );
};

export default Home;
