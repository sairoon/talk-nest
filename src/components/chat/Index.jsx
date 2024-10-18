import React, { useEffect, useRef, useState } from "react";
import { VoiceIcon } from "../../svg/Voice";
import { EmojiIcon } from "../../svg/Emoji";
import { GalleryIcon } from "../../svg/Gallery";
import { useSelector } from "react-redux";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { formatDistance } from "date-fns";
import {
  getDownloadURL,
  getStorage,
  ref as Ref,
  uploadBytesResumable,
} from "firebase/storage";
import EmojiPicker from "emoji-picker-react";

const Chatting = () => {
  const user = useSelector((user) => user.login.loggedIn); //you can use state instead of user
  const activeFriend = useSelector(
    (activeFriendChat) => activeFriendChat.active.active
  );
  const storage = getStorage();
  const fileRef = useRef(null);
  const autoScrollRef = useRef(null);
  const [messages, setMessages] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [error, setError] = useState(null);

  const db = getDatabase();

  // write messages
  const handleSendMessage = () => {
    // Trim the message to avoid sending messages that are blank or just whitespace
    if (!messages.trim()) {
      setError("Please write a message before sending");
      setTimeout(() => {
        setError(null);
      }, 3000);
      return;
    }
    if (activeFriend?.status === "single") {
      set(push(ref(db, "singleChat")), {
        whoSendName: user.displayName,
        whoSendId: user.uid,
        whoReceiveName: activeFriend?.name,
        whoReceiveId: activeFriend?.id,
        message: messages,
        date: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()}-${new Date().getHours()}:${new Date().getMinutes()}`,
      }).then(() => {
        setShowEmoji(false); // Hide emoji picker after sending
        setMessages(""); // Clear message input
      });
    }
  };

  // reed messages
  useEffect(() => {
    if (activeFriend?.status === "single") {
      onValue(ref(db, "singleChat"), (snapshot) => {
        let singleChatArray = [];
        snapshot.forEach((item) => {
          if (
            (item.val().whoSendId === user.uid &&
              item.val().whoReceiveId === activeFriend?.id) ||
            (item.val().whoSendId === activeFriend?.id &&
              item.val().whoReceiveId === user.uid)
          ) {
            singleChatArray.push(
              item.val()
              // {
              //   ...item.val(),
              //   id: item.key,
              // }
            );
          }
        });
        setAllMessages(singleChatArray);
      });
    }
  }, [activeFriend?.id]);
  // }, [db, user.uid, activeFriend?.id]);

  // emoji picker
  const handleEmojiClick = ({ emoji }) => {
    setMessages(messages + emoji + " ");
  };

  // image upload
  const handleFile = (e) => {
    const fileInput = e.target;
    const file = fileInput.files[0];

    if (file) {
      const maxSize = 2 * 1024 * 1024; // 2MB
      const validImageTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ];

      // Validate file type
      if (!validImageTypes.includes(file.type)) {
        setError("Please upload a valid image file (JPEG, PNG, WebP, GIF)");
        // Clear error after 5 sec
        setTimeout(() => setError(null), 5000);
        fileInput.value = ""; // Reset file input
        return;
      }
      // Validate file size
      if (file.size > maxSize) {
        setError("File size shouldn't exceed 2MB");
        setTimeout(() => setError(null), 5000);
        fileInput.value = "";
        return;
      }
      // Clear any previous error if file is valid
      setError(null);
      
      // Proceed with the upload if validation passes
      const storageRef = Ref(
        storage,
        `${user.displayName} = ImageMessages/ ${file.name}` // I use {file.name} indeed {file} to generate unique name
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          // Handle unsuccessful uploads
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            set(push(ref(db, "singleChat")), {
              whoSendName: user.displayName,
              whoSendId: user.uid,
              whoReceiveName: activeFriend?.name,
              whoReceiveId: activeFriend?.id,
              message: messages,
              image: downloadURL,
              date: `${new Date().getFullYear()}-${
                new Date().getMonth() + 1
              }-${new Date().getDate()}-${new Date().getHours()}:${new Date().getMinutes()}`,
            }).then(() => {
              setShowEmoji(false); // Hide emoji picker after sending
              setMessages(""); // Clear message input field
            });
          });
        }
      );
    }
  };

  useEffect(() => {
    // if (autoScrollRef.current) {
    //   autoScrollRef.current.scrollIntoView({ behavior: "smooth" });
    // }
    autoScrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, allMessages, error]);

  const handleSendBtn = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      <div className="bg-transparent shadow-xl rounded-[10px] h-full col-span-2 overflow-hidden relative">
        {/* header */}
        <div className="w-full bg-[#F9F9F9] dark:bg-slate-700 py-3 px-3 flex items-center gap-x-3">
          <img
            src={activeFriend?.photo || "/img/avatar.jpg"}
            className="w-16 h-16 rounded-full"
            alt="friends-profile-pic"
          />
          <div className="text-black dark:text-white text-xl font-medium capitalize">
            {activeFriend?.name || " "}
          </div>
        </div>
        {/* message container */}
        <div className="w-full h-[90%] bg-white dark:bg-slate-600 overflow-y-auto px-8 pt-4 pb-[116px] scroll-smooth">
          {activeFriend?.status === "single" ? (
            // if there are no messages
            allMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full w-full">
                <img
                  src={activeFriend?.photo || "/img/avatar.jpg"}
                  alt="friend's image"
                  className="w-44 h-44 rounded-full mb-3"
                />
                <p className="text-slate-800 dark:text-white font-medium text-2xl mb-10">
                  You are now connected with {activeFriend?.name}
                </p>
                <p className="text-slate-800 dark:text-white font-light text-lg">
                  No message here yet
                </p>
                <p className="text-slate-800 dark:text-white font-light text-lg">
                  Send a message to start conversation
                </p>
              </div>
            ) : (
              // if there are messages
              allMessages.map((item, i) => (
                <div key={i} ref={autoScrollRef}>
                  {item.whoSendId === user.uid ? (
                    // sender's message
                    <div className="flex justify-end">
                      {item.message && (
                        <div className="text-slate-800 dark:text-white font-normal text-xl bg-purple-200 dark:bg-violet-500 px-4 pt-3 inline-block rounded-[10px] rounded-br-none my-1 relative max-w-[60%]">
                          <p>{item.message}</p>
                          <h6 className="text-black dark:text-gray-100 font-extralight text-xs text-end pb-2">
                            {formatDistance(
                              // new Date(item.date.replace(/-/g, "/")),
                              item.date.replace(/-/g, "/"), // without replace, "item.date" not working from my end
                              new Date(),
                              { addSuffix: true }
                            )}
                          </h6>
                          <span className="w-0 h-0 border-t-[25px] border-l-[25px] border-transparent rounded-[10px] border-l-purple-200 dark:border-l-violet-500 absolute -right-4 bottom-0"></span>
                        </div>
                      )}
                      {/* sender's image */}
                      {item.image && (
                        <div className="max-w-[60%] my-2 px-2 py-2 bg-purple-200 dark:bg-violet-500 rounded-[10px] rounded-br-none relative">
                          <img
                            src={item.image}
                            className="max-w-full max-h-96 rounded-[10px] shadow-md"
                            alt="chatting-image"
                          />
                          <h6 className="text-white font-extralight text-sm text-end absolute bottom-3 right-3 bg-black px-3 py-1 rounded-full opacity-60 ">
                            {formatDistance(
                              item.date.replace(/-/g, "/"),
                              new Date(),
                              { addSuffix: true }
                            )}
                          </h6>
                          <span className="w-0 h-0 border-t-[25px] border-l-[25px] border-transparent rounded-[10px] border-l-purple-200 dark:border-l-violet-500 absolute -right-4 bottom-0"></span>
                        </div>
                      )}
                    </div>
                  ) : (
                    // receiver's message
                    <div className="flex justify-start">
                      {item.message && (
                        <div className="text-black dark:text-white font-normal text-xl bg-slate-200 dark:bg-stone-700 px-4 pt-3 inline-block rounded-[10px] my-1 relative max-w-[60%]">
                          <p>{item.message}</p>
                          <h6 className="text-black dark:text-gray-300 font-extralight text-xs text-end pb-2">
                            {formatDistance(
                              item.date.replace(/-/g, "/"),
                              new Date(),
                              { addSuffix: true }
                            )}
                          </h6>
                          <span className="w-0 h-0 border-r-[21px] border-b-[25px] border-transparent border-r-slate-200 dark:border-r-stone-700 rounded-[10px] rounded-tr-none absolute -left-4 top-0"></span>
                        </div>
                      )}
                      {/* receiver's image */}
                      {item.image && (
                        <div className="max-w-[60%] my-2 px-2 py-2 bg-slate-200 dark:bg-stone-700 rounded-[10px] rounded-tl-none relative">
                          <img
                            src={item.image}
                            className="max-w-full max-h-96 rounded-[10px] shadow-md"
                            alt="chatting-image"
                          />
                          <h6 className="text-white font-extralight text-sm text-end absolute bottom-3 right-3 bg-black px-3 py-1 rounded-full opacity-60">
                            {formatDistance(
                              item.date.replace(/-/g, "/"),
                              new Date(),
                              { addSuffix: true }
                            )}
                          </h6>
                          <span className="w-0 h-0 border-r-[21px] border-b-[25px] border-transparent border-r-slate-200 dark:border-r-stone-700 rounded-[10px] rounded-tr-none absolute -left-4 top-0"></span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )
          ) : (
            <div className="flex justify-center items-center h-full w-full text-3xl font-semibold text-gray-500 dark:text-gray-200 pt-20">
              Please Select A Friend To Start Chatting
            </div>
          )}
        </div>

        {/* chat input area */}
        <div className="absolute bottom-0 w-full">
          <div className="h-[116px] w-full bg-[#ffffff80] dark:bg-[#4755697a] backdrop-blur-sm dark:backdrop-blur-md flex rounded-b-lg items-center justify-center relative">
            {activeFriend?.status === "single" ? (
              <div className="h-20 w-[90%] bg-[#F5F5F5] dark:bg-slate-700 rounded-[10px] flex items-center justify-between z-10">
                <div className="flex items-center gap-x-3 px-3 ms-4">
                  <div className="text-black dark:text-white cursor-pointer active:scale-90 transition ease-out">
                    <VoiceIcon />
                  </div>
                  <div className="relative">
                    <div
                      className="text-black dark:text-white cursor-pointer active:scale-90 transition ease-out"
                      onClick={() => setShowEmoji((prev) => !prev)}
                    >
                      <EmojiIcon />
                    </div>
                    {showEmoji && (
                      <div className="absolute bottom-16 left-0">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                      </div>
                    )}
                  </div>
                  <div
                    className="text-black dark:text-white cursor-pointer active:scale-90 transition ease-out"
                    onClick={() => fileRef.current.click()}
                  >
                    <GalleryIcon />
                    <input
                      type="file"
                      hidden
                      ref={fileRef}
                      accept="image/jpeg, image/png, image/webp, image/gif"
                      onChange={handleFile}
                    />
                  </div>
                </div>
                {error ? (
                  <p className="text-red-600 w-full text-base font-semibold my-2 text-center bg-red-200 py-3 rounded-[10px] mx-4 transition ease-out duration-150">
                    {error}
                  </p>
                ) : (
                  <input
                    className="w-full h-[80%] outline-none bg-transparent text-[#C8C8C8] px-4 font-medium text-xl align-middle"
                    type="text"
                    placeholder="type here...."
                    onChange={(e) => setMessages(e.target.value)}
                    onClick={() => setShowEmoji(false)}
                    value={messages}
                    onKeyUp={handleSendBtn}
                  />
                )}
                <button
                  className="bg-[#3e8ceb] dark:bg-cyan-600 py-4 px-10 rounded-[10px] font-medium text-white text-xl me-3 active:scale-95 transition ease-out"
                  onClick={handleSendMessage}
                >
                  Send
                </button>
              </div>
            ) : null}
            <div className="w-20 h-full absolute right-0 top-0 bg-gradient-to-r from-transparent to-white dark:to-slate-600 z-0"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatting;
