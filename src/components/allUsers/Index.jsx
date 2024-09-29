import React, { useEffect, useState } from "react";
import { AddUserIcon } from "../../svg/AddUser";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref as Ref } from "firebase/storage";

const AllUsers = () => {
  const user = useSelector((state) => state.login.loggedIn);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [friendReqList, setFriendReqList] = useState([]);

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
  //send friend request
  useEffect(() => {
    const starCountRef = ref(db, "friendReq/");
    onValue(starCountRef, (snapshot) => {
      let reqArray = [];
      snapshot.forEach((item) => {
        reqArray.push(item.val().receiverId + item.val().senderId);
      });
      setFriendReqList(reqArray);
    });
  }, [db]);

  return (
    <>
      <div className="bg-transparent dark:bg-slate-600 shadow-lg rounded-[10px] py-5 px-6 h-full overflow-y-auto">
        <h1 className="text-3xl font-semibold text-[#494949] dark:text-white py-2">
          All Users
        </h1>
        <input
          type="search"
          className="my-6 rounded-[10px] py-3 px-4 w-full bg-[#F8F8F8] dark:bg-slate-700 outline-none text-2xl font-normal text-gray-600 dark:text-gray-300"
          placeholder="Search User.."
          value={searchTerm}
          onChange={handleSearch}
        />

        {filteredUsers.length > 0 ? (
          filteredUsers.map((item, i) => (
            <div
              className="flex items-center justify-between mt-4 cursor-default"
              key={i}
            >
              <div className="flex items-center gap-2">
                <img
                  src={item.photoURL || "/img/avatar.jpg"}
                  className="w-16 h-16 rounded-full"
                  alt="user-img"
                />
                <h3 className="text-2xl font-medium text-[#3D3C3C] dark:text-white">
                  {item.username}
                </h3>
              </div>
              {friendReqList.includes(item.id + user.uid) ? ( // sender view
                <button
                  className="bg-rose-500 px-4 py-3 rounded-md text-white text-sm font-semibold active:scale-90 transition ease-out"
                  title="Cancel request"
                >
                  Cancel
                </button>
              ) : friendReqList.includes(user.uid + item.id) ? ( // receiver view
                <button
                  className="bg-sky-500 px-4 py-3 rounded-md text-white text-sm font-semibold cursor-default"
                  title="Send you friend request"
                >
                  Requested
                </button>
              ) : ( // normal view
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
          <p className="text-xl py-2 font-medium text-red-700 bg-red-200 rounded-lg flex justify-center">
            User not found
          </p>
        )}
      </div>
    </>
  );
};

export default AllUsers;
