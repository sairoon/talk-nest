import React, { useEffect, useState } from "react";
import { AddUserIcon } from "../../svg/AddUser";
import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import { useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref as Ref } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const AllUsers = () => {
  const user = useSelector((user) => user.login.loggedIn); //you can use state instead of user
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [friendReqList, setFriendReqList] = useState([]);
  const [cancelReq, setCancelReq] = useState([]);
  const [friendStatus, setFriendStatus] = useState([]);
  // const navigate = useNavigate();

  const storage = getStorage();
  const db = getDatabase();

  useEffect(() => {
    const starCountRef = ref(db, "users/");
    onValue(starCountRef, (snapshot) => {
      const usersArray = [];
      snapshot.forEach((allUser) => {
        if (user.uid !== allUser.key) {
          getDownloadURL(Ref(storage, allUser.key))
            .then((downloadURL) => {
              usersArray.push({
                ...allUser.val(),
                id: allUser.key,
                photoURL: downloadURL,
              });
            })
            .catch(() => {
              usersArray.push({
                ...allUser.val(),
                id: allUser.key,
                photoURL: null,
              });
            })
            .finally(() => {
              setUsers([...usersArray]);
              setFilteredUsers([...usersArray]); // Initialize filtered users
            });
        }
      });
    });
  }, [db, user.uid, storage]);

  //unused cancel friend request start
  /*   useEffect(() => {
    const starCountRef = ref(db, "friendReq/");
    onValue(starCountRef, (snapshot) => {
      let cancelReq = [];
      snapshot.forEach((item) => {
        cancelReq.push({ ...item.val(), id: item.key });
      });
      setCancelReq(cancelReq);
    });
  }, [db]);

  const handleCancelReq = (data) => {
    // Find the specific friend request based on senderId and receiverId
    const friendReqToCancel = cancelReq.find(
      (item) => item.senderId === user.uid && item.receiverId === data.id
    );

    if (friendReqToCancel) {
      remove(ref(db, `friendReq/${friendReqToCancel.id}`))
    }
  }; */
  //unused cancel friend request end

  //send & cancel friend request
  useEffect(() => {
    const starCountRef = ref(db, "friendReq/");
    onValue(starCountRef, (snapshot) => {
      let reqArray = [];
      let cancelReq = []; // Initialize cancelReq state
      snapshot.forEach((item) => {
        reqArray.push(item.val().receiverId + item.val().senderId);
        cancelReq.push({ ...item.val(), id: item.key }); // Store cancelReq data
      });
      setFriendReqList(reqArray);
      setCancelReq(cancelReq); // Update cancelReq state
    });
  }, [db]);

  // show friend status
  useEffect(() => {
    const starCountRef = ref(db, "friends/");
    onValue(starCountRef, (snapshot) => {
      let friendsArray = [];
      snapshot.forEach((item) => {
        if (
          user.uid === item.val().senderId ||
          user.uid === item.val().receiverId
        ) {
          friendsArray.push(
            item.val().receiverId === user.uid
              ? item.val().senderId
              : item.val().receiverId
          );
        }
      });
      setFriendStatus(friendsArray);
    });
  }, [db, user.uid]);

  // Handler for search input changes
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = users.filter((item) =>
      item.username.toLowerCase().includes(value)
    );
    setFilteredUsers(filtered);
  };

  const handleFriendReq = (data) => {
    set(push(ref(db, "friendReq")), {
      senderName: user.displayName,
      senderId: user.uid,
      senderPhoto: user.photoURL ?? "/img/avatar.jpg",

      receiverName: data.username,
      receiverId: data.id,
      receiverPhoto: data.photoURL ?? "/img/avatar.jpg",
    });
  };

  const handleCancelReq = (itemId) => {
    const reqToCancel = cancelReq.find(
      (req) => req.receiverId === itemId && req.senderId === user.uid
    );
    if (reqToCancel) {
      remove(ref(db, "friendReq/" + reqToCancel.id));
    }
  };

  return (
    <>
      <div className="bg-transparent dark:bg-slate-600 shadow-lg rounded-[10px] py-5 h-full overflow-y-auto relative">
        <div className="px-6">
          <h1 className="text-3xl font-semibold text-[#494949] dark:text-white py-2">
            All Users
          </h1>
          <input
            type="search"
            className="my-6 rounded-[10px] py-3 px-4 w-full bg-[#F8F8F8] dark:bg-slate-700 outline-none text-2xl font-normal text-gray-600 dark:text-gray-300 mb-5 caret-purple-500"
            placeholder="Search User.."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((item, i) => (
            <div
              className="flex items-center justify-between px-6 py-3 hover:bg-gray-100 dark:hover:bg-slate-500 transition-all duration-150 ease-out cursor-default"
              key={i}
            >
              <div className="flex items-center gap-2">
                <img
                  src={item.photoURL || "/img/avatar.jpg"}
                  className="w-16 h-16 rounded-full"
                  alt="user-img"
                />
                <h3 className="text-2xl font-medium text-[#3D3C3C] dark:text-white capitalize">
                  {item.username}
                </h3>
              </div>
              {friendReqList.includes(item.id + user.uid) ? ( // sender view
                <button
                  className="bg-rose-500 px-4 py-3 rounded-md text-white text-sm font-semibold active:scale-90 transition ease-out"
                  title="Cancel request"
                  onClick={() => handleCancelReq(item.id)}
                >
                  Cancel
                </button>
              ) : friendReqList.includes(user.uid + item.id) ? ( // receiver view
                <button
                  className="bg-green-500 px-4 py-3 rounded-md text-white text-md font-semibold cursor-default"
                  title="Send you friend request"
                >
                  Requested
                </button>
              ) : friendStatus.includes(item.id) ? ( // if already friend
                <button
                  className="bg-sky-500 px-4 py-3 rounded-md text-white text-sm font-semibold cursor-default"
                  title="Friend"
                  // onClick={() => {
                  //   navigate("/message");
                  // }}
                >
                  Friend
                </button>
              ) : (
                // normal view
                <div
                  className="text-black dark:text-white me-6 cursor-pointer scale-125 active:scale-105 transition ease-out"
                  title="Add friend"
                  onClick={() => handleFriendReq(item)}
                >
                  <AddUserIcon />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <p className="text-xl font-medium dark:text-gray-200 text-gray-400">
              User not available
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default AllUsers;
