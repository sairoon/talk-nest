import React, { useEffect, useState } from "react";
import { VoiceIcon } from "../../svg/Voice";
import { EmojiIcon } from "../../svg/Emoji";
import { GalleryIcon } from "../../svg/Gallery";
import { useSelector } from "react-redux";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { formatDistance } from "date-fns";

const Chatting = () => {
  const user = useSelector((user) => user.login.loggedIn); //you can use state instead of user
  const activeFriend = useSelector(
    (activeFriendChat) => activeFriendChat.active.active
  );
  const [messages, setMessages] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  const db = getDatabase();

  // write messages
  const handleSendMessage = () => {
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
        setMessages("");
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
            {activeFriend?.name || "Please select a friend"}
          </div>
        </div>
        {/* message container */}
        <div className="w-full h-[90%] bg-white dark:bg-slate-600 overflow-y-auto px-8 pt-4 pb-[116px] scroll-smooth">
          {activeFriend?.status === "single" ? (
            allMessages.map((item, i) => (
              <div key={i}>
                {item.whoSendId === user.uid ? (
                  // sender message
                  <div className="flex justify-end">
                    <div className="text-slate-800 dark:text-white font-normal text-xl bg-purple-200 dark:bg-violet-500 px-4 pt-3 inline-block rounded-[10px] rounded-br-none my-2 relative max-w-[60%]">
                      {item.message}
                      <h6 className="text-black dark:text-gray-100 font-extralight text-xs text-end pb-2">
                        {formatDistance(
                          item.date.replace(/-/g, "/"), // without replace, "item.date" not working from my end
                          new Date(),
                          {
                            addSuffix: true,
                          }
                        )}
                      </h6>
                      <span className="w-0 h-0 border-t-[25px] border-l-[25px] border-transparent rounded-[10px] border-l-purple-200 dark:border-l-violet-500 absolute -right-4 bottom-0"></span>
                    </div>
                  </div>
                ) : (
                  // receiver message 
                  <div className="w-[60%] mr-auto">
                    <div className="text-black dark:text-white font-normal text-xl bg-slate-200 dark:bg-stone-700 px-4 pt-3 inline-block rounded-[10px] my-2 relative ">
                      {item.message}
                      <h6 className="text-black dark:text-gray-300 font-extralight text-xs text-end pb-2">
                        {formatDistance(
                          new Date(item.date.replace(/-/g, "/")),
                          new Date(),
                          {
                            addSuffix: true,
                          }
                        )}
                      </h6>
                      <span className="w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-t-[25px] border-t-slate-200 dark:border-t-stone-700 rounded-[10px] absolute -left-4 top-0"></span>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-full w-full text-3xl font-semibold text-gray-700 dark:text-gray-200 pt-20">
              Please Select A Friend To Start Chat
            </div>
          )}
          {/* sender img */}
          {/* <div className="flex justify-end">
            <div className="max-w-[60%] my-2 px-2 py-2 bg-purple-200 dark:bg-violet-500 rounded-[10px] rounded-br-none relative">
              <img
                src="/img/avatar.jpg"
                className="max-w-full max-h-96 rounded-[10px]"
                alt="chatting-image"
              />
              <h6 className="text-white font-extralight text-sm text-end absolute bottom-3 right-3 bg-black px-3 py-1 rounded-full opacity-30 ">
                08:00
              </h6>
              <span className="w-0 h-0 border-t-[25px] border-l-[25px] border-transparent rounded-[10px] border-l-purple-200 dark:border-l-violet-500 absolute -right-4 bottom-0"></span>
            </div>
          </div> */}
          {/* receiver img */}
          {/* <div className="flex justify-start">
            <div className="max-w-[60%] my-2 px-2 py-2 bg-slate-200 dark:bg-stone-700 rounded-[10px] rounded-tl-none relative">
              <img
                src="/img/avatar.jpg"
                className="max-w-full max-h-96 rounded-[10px]"
                alt="chatting-image"
              />
              <h6 className="text-white font-extralight text-sm text-end absolute bottom-3 right-3 bg-black px-3 py-1 rounded-full opacity-30 ">
                08:00
              </h6>
              <span className="w-0 h-0 border-r-[21px] border-b-[25px] border-transparent border-r-slate-200 dark:border-r-stone-700 rounded-[10px] rounded-tr-none absolute -left-4 top-0"></span>
            </div>
          </div> */}
        </div>
        {/* write message area */}
        <div className="absolute bottom-0 w-full">
          <div className="h-[116px] w-full bg-[#ffffff80] dark:bg-[#4755697a] backdrop-blur-sm dark:backdrop-blur-md flex rounded-b-lg items-center justify-center relative">
            {activeFriend?.status === "single" ? (
              <div className="h-20 w-[90%] bg-[#F5F5F5] dark:bg-slate-700 rounded-[10px] flex items-center justify-between z-10">
                <div className="flex items-center gap-x-3 px-3 ms-4">
                  <div className="text-black dark:text-white cursor-pointer active:scale-90 transition ease-out">
                    <VoiceIcon />
                  </div>
                  <div className="text-black dark:text-white cursor-pointer active:scale-90 transition ease-out">
                    <EmojiIcon />
                  </div>
                  <div className="text-black dark:text-white cursor-pointer active:scale-90 transition ease-out">
                    <GalleryIcon />
                  </div>
                </div>
                <input
                  className="w-full outline-none bg-transparent text-[#C8C8C8] px-4 font-medium text-xl align-middle"
                  type="text"
                  placeholder="type here...."
                  onChange={(e) => setMessages(e.target.value)}
                  value={messages}
                />
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
