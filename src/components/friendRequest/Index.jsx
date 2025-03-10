import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Lottie from "lottie-react";
import noFriendReq from "../../animations/torch.json";
import 'react-lazy-load-image-component/src/effects/blur.css';

const FriendReq = () => {
  const [friendReqList, setFriendReqList] = useState([]);
  const user = useSelector((user) => user.login.loggedIn); //you can use state instead of user

  const db = getDatabase();

  useEffect(() => {
    const starCountRef = ref(db, "friendReq/");
    onValue(starCountRef, (snapshot) => {
      let friendReq = [];
      snapshot.forEach((item) => {
        if (user.uid === item.val().receiverId) {
          friendReq.push({
            ...item.val(),
            id: item.key,
          });
        }
      });
      setFriendReqList(friendReq);
    });
  }, [db, user.uid]);
  // accept friend request
  const handleAccept = (data) => {
    set(push(ref(db, "friends")), {
      ...data,
    }).then(() => {
      remove(ref(db, "friendReq/" + data.id));
    });
  };
  // reject friend request
  const handleReject = (data) => {
    remove(ref(db, "friendReq/" + data.id));
  };

  return (
    <>
      <div className="bg-transparent dark:bg-slate-600 shadow-lg rounded-[10px] py-5 h-full overflow-y-auto">
        <h1 className="text-[#494949] dark:text-white text-3xl font-semibold py-2 px-6 mb-3">
          Friend Requests
        </h1>
        {friendReqList.length === 0 ? ( // Conditional rendering for empty state
          <div className="w-full h-[90%] flex flex-col items-center justify-center">
            <Lottie animationData={noFriendReq} loop={true} />
            <p className="text-xl font-medium dark:text-gray-200 text-gray-400 cursor-default">
              You have no friend request at this moment
            </p>
          </div>
        ) : (
          friendReqList?.map((item) => (
            <div
              className="flex items-center justify-between hover:bg-gray-100 hover:dark:bg-slate-700 px-6 py-3 transition-all ease-linear duration-150 cursor-default"
              key={item.id}
            >
              <div className="flex items-center gap-3">
                <LazyLoadImage
                  src={item.senderPhoto || "img/avatar.jpg"}
                  className="w-16 h-16 rounded-full"
                  alt="user-img"
                  effect="blur"
                />
                <h3 className="text-2xl font-normal text-[#3D3C3C] dark:text-white capitalize">
                  {item.senderName}
                </h3>
              </div>
              <div className="flex items-center gap-x-2">
                <button
                  className="bg-[#4A81D3] dark:bg-sky-600 px-6 py-3 rounded-md font-medium text-sm text-white active:scale-90 transition ease-out"
                  title="Accept"
                  onClick={() => handleAccept(item)}
                >
                  Accept
                </button>
                <button
                  className="bg-[#D34A4A] dark:bg-red-500 px-6 py-3 rounded-md font-medium text-sm text-white active:scale-90 transition ease-out"
                  title="Reject"
                  onClick={() => handleReject(item)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default FriendReq;
