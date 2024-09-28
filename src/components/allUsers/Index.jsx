import React, { useEffect, useState } from "react";
import { AddUserIcon } from "../../svg/AddUser";
import { getDatabase, onValue, ref, set } from "firebase/database";
import { useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref as Ref } from "firebase/storage";

const AllUsers = () => {
  const user = useSelector((state) => state.login.loggedIn);
  const [users, setUsers] = useState([]);
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
            });
        }
      });
    });
  }, [db, user.uid, storage]);

  return (
    <>
      <div className="bg-transparent dark:bg-slate-600 shadow-lg rounded-[10px] py-5 px-6 h-full overflow-y-auto">
        <h1 className="text-3xl font-semibold text-[#494949] dark:text-white py-2">
          All Users
        </h1>
        <input
          type="text"
          className="my-6 rounded-[10px] py-3 px-4 w-full bg-[#F8F8F8] dark:bg-slate-700 outline-none text-2xl font-normal"
          placeholder="Search User.."
        />
        {users.map((item, i) => (
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
            <div
              className="text-black dark:text-white me-6 cursor-pointer scale-125 active:scale-105 transition ease-out"
              title="Add friend"
            >
              <AddUserIcon />
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between mt-4 cursor-default select-none">
          <div className="flex items-center gap-2">
            <img
              src="https://picsum.photos/104"
              className="w-16 h-16 rounded-full"
              alt="user-img"
            />{" "}
            <h3 className="text-2xl font-medium text-[#3D3C3C] dark:text-white">
              User Name
            </h3>
          </div>
          <button
            className="bg-rose-500 px-4 py-3 rounded-md text-white text-sm font-semibold active:scale-90 transition ease-out"
            title="Cancel request"
          >
            Cancel
          </button>
        </div>
        <div className="flex items-center justify-between mt-4 cursor-default select-none">
          <div className="flex items-center gap-2">
            <img
              src="https://picsum.photos/105"
              className="w-16 h-16 rounded-full"
              alt="user-img"
            />{" "}
            <h3 className="text-2xl font-medium text-[#3D3C3C] dark:text-white">
              User Name
            </h3>
          </div>
          <button
            className="bg-sky-500 px-4 py-3 rounded-md text-white text-sm font-semibold cursor-default"
            title="Send you friend request"
          >
            Request
          </button>
        </div>
      </div>
    </>
  );
};

export default AllUsers;
