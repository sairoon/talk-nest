import React, { useEffect, useState } from "react";
import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { ActiveChat } from "../../features/slices/ActiveChatSlice";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Lottie from "lottie-react";
import noFriend from "../../animations/no-friend.json";
import "react-lazy-load-image-component/src/effects/blur.css";

const MyFriends = () => {
  const user = useSelector((user) => user.login.loggedIn);
  const [friends, setFriends] = useState([]);
  const [activeFriend, setActiveFriend] = useState(
    JSON.parse(localStorage.getItem("activeFriend")) || null
  );
  const [block, setBlock] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const db = getDatabase();

  const getFriend = () => {
    const starCountRef = ref(db, "friends/");
    onValue(starCountRef, (snapshot) => {
      let friendArr = [];
      snapshot.forEach((item) => {
        if (
          user.uid === item.val().senderId ||
          user.uid === item.val().receiverId
        ) {
          friendArr.push({
            ...item.val(),
            id: item.key,
          });
        }
      });
      setFriends(friendArr);
    });
  };

  useEffect(() => {
    getFriend();
  }, [db, user.uid]);
  // Active chat
  const handleActiveChat = (data) => {
    // Set active friend
    setActiveFriend(data.id);
    localStorage.setItem("activeFriend", JSON.stringify(data.id));

    // Dispatch the active chat action based on sender/receiver logic
    if (user.uid === data.receiverId) {
      dispatch(
        ActiveChat({
          status: "single",
          id: data.senderId,
          name: data.senderName,
          photo: data.senderPhoto,
        })
      );
      localStorage.setItem(
        "active",
        JSON.stringify({
          status: "single",
          id: data.senderId,
          name: data.senderName,
          photo: data.senderPhoto,
        })
      );
      navigate("/message", { data });
    } else {
      dispatch(
        ActiveChat({
          status: "single",
          id: data.receiverId,
          name: data.receiverName,
          photo: data.receiverPhoto,
        })
      );
      localStorage.setItem(
        "active",
        JSON.stringify({
          status: "single",
          id: data.receiverId,
          name: data.receiverName,
          photo: data.receiverPhoto,
        })
      );
      navigate("/message", { data });
    }
  };
  // Unfriend
  const handleUnfriend = (id) => {
    const unfriend = friends.find((req) => req.id === id);
    if (unfriend) {
      remove(ref(db, "friends/" + unfriend.id));
    }
  };
  // Block
  const handleBlock = (item) => {
    if (user.uid === item.senderId) {
      set(push(ref(db, "block/")), {
        blockerName: item.senderName,
        blockerId: item.senderId,
        blockerPhoto: item.senderPhoto,

        blockedName: item.receiverName,
        blockedId: item.receiverId,
        blockedPhoto: item.receiverPhoto,
      });
    } else {
      set(push(ref(db, "block/")), {
        blockerName: item.receiverName,
        blockerId: item.receiverId,
        blockerPhoto: item.receiverPhoto,

        blockedName: item.senderName,
        blockedId: item.senderId,
        blockedPhoto: item.senderPhoto,
      });
    }
  };
  useEffect(() => {
    const blockRef = ref(db, "block/");
    onValue(blockRef, (snapshot) => {
      let blockArray = [];
      snapshot.forEach((item) => {
        blockArray.push({
          ...item.val(),
          id: item.key,
        });
      });
      setBlock(blockArray);
    });
  }, [db]);
  // Unblock
  const handleUnBlock = (item) => {
    const unblock = block.find(
      (req) =>
        (req.blockerId === user.uid && req.blockedId === item.receiverId) ||
        (req.blockerId === user.uid && req.blockedId === item.senderId)
    );
    if (unblock) {
      remove(ref(db, "block/" + unblock.id));
    }
  };

  return (
    <>
      <div className="bg-transparent dark:bg-slate-600 shadow-lg rounded-[10px] py-5 h-full overflow-y-auto">
        <h1 className="text-[#494949] dark:text-white text-3xl font-semibold py-2 px-6 mb-3">
          My Friends
        </h1>
        {friends?.length === 0 ? (
          <div className="w-full h-[90%] flex flex-col items-center justify-center">
            <div className="relative">
              <Lottie animationData={noFriend} loop={true} />
              <div className="absolute bottom-7 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-nowrap text-center">
                <p className="text-xl font-medium dark:text-gray-200 text-gray-400 cursor-default">
                  Looks like no one cares about you!
                </p>
                <p className="text-base font-normal dark:text-gray-200 text-gray-500 cursor-default mt-2">
                  Send friend request to make friends
                </p>
              </div>
            </div>
          </div>
        ) : (
          friends?.map((item) => {
            const blocker = block.some(
              (req) =>
                (req.blockedId === item.receiverId &&
                  req.blockerId === user.uid) ||
                (req.blockedId === item.senderId && req.blockerId === user.uid)
            );

            const blocked = block.some(
              (req) =>
                (req.blockerId === item.receiverId &&
                  req.blockedId === user.uid) ||
                (req.blockerId === item.senderId && req.blockedId === user.uid)
            );

            return (
              <div
                className={`flex items-center justify-between py-3 px-6 transition-all duration-150 ease-out ${
                  location.pathname === "/message" && activeFriend === item.id
                    ? "bg-gray-200 dark:bg-slate-700" // Active state styles
                    : "hover:bg-gray-100 dark:hover:bg-slate-500"
                }`}
                key={item.id}
              >
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => handleActiveChat(item)}
                >
                  {user.uid === item.receiverId ? (
                    <LazyLoadImage
                      src={item.senderPhoto || "img/avatar.jpg"}
                      className="w-16 h-16 rounded-full "
                      alt="friend-profile-pic"
                      effect="blur"
                    />
                  ) : (
                    <LazyLoadImage
                      src={item.receiverPhoto || "img/avatar.jpg"}
                      className="w-16 h-16 rounded-full"
                      alt="friend-profile-pic"
                      effect="blur"
                    />
                  )}
                  <h3 className="text-xl font-medium text-[#3D3C3C] dark:text-white capitalize select-none ">
                    {user.uid === item.senderId
                      ? item.receiverName
                      : item.senderName}
                  </h3>
                </div>
                <div className="flex items-center gap-x-2">
                  {blocked ? (
                    <button
                      className="bg-amber-400 px-4 py-3 rounded-md font-semibold text-sm text-gray-800 cursor-default"
                      title="You're blocked"
                    >
                      Blocked
                    </button>
                  ) : (
                    <>
                      {!blocker && (
                        <>
                          <button
                            className="bg-[#4A81D3] dark:bg-sky-600 px-4 py-3 rounded-md font-medium text-sm text-white active:scale-90 transition ease-out"
                            title="Click to unfriend"
                            onClick={() => handleUnfriend(item.id)}
                          >
                            Unfriend
                          </button>
                          <button
                            className="bg-[#D34A4A] dark:bg-red-500 px-6 py-3 rounded-md font-medium text-sm text-white active:scale-90 transition ease-out"
                            title="Click to block"
                            onClick={() => handleBlock(item)}
                          >
                            Block
                          </button>
                        </>
                      )}
                      {blocker && (
                        <button
                          className="bg-violet-600 dark:bg-violet-500 px-4 py-3 rounded-md font-semibold text-sm text-white active:scale-90 transition ease-out"
                          title="Click to unblock"
                          onClick={() => handleUnBlock(item)}
                        >
                          Unblock
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default MyFriends;
