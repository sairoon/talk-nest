import React, { useEffect, useRef, useState } from "react";
import { VoiceIcon } from "../../svg/Voice";
import { EmojiIcon } from "../../svg/Emoji";
import { GalleryIcon } from "../../svg/Gallery";
import { useSelector } from "react-redux";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { formatDistance } from "date-fns";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  getDownloadURL,
  getStorage,
  ref as Ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { PropagateLoader, PulseLoader } from "react-spinners";
import EmojiPicker from "emoji-picker-react";
import Lottie from "lottie-react";
import selectFriend from "../../animations/select-friend.json";
import "react-lazy-load-image-component/src/effects/blur.css";

const Chatting = () => {
  const user = useSelector((user) => user.login.loggedIn); //you can use state instead of user
  const activeFriend = useSelector((state) => state?.active.active);
  const storage = getStorage();
  const fileRef = useRef(null);
  const autoScrollRef = useRef(null);
  const [messages, setMessages] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [block, setBlock] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [error, setError] = useState(null);
  const [loader, setLoader] = useState(false);

  const db = getDatabase();

  // write messages
  const handleSendMessage = () => {
    setLoader(true);
    // Trim the message to avoid sending messages that are blank or just whitespace
    if (!messages.trim()) {
      setError("Please write a message before sending");
      setTimeout(() => {
        setError(null);
        setLoader(false);
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
        setLoader(false);
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
            singleChatArray.push(item.val());
          }
        });
        setAllMessages(singleChatArray);
      });
    }
  }, [activeFriend?.id]);

  // emoji picker
  const handleEmojiClick = ({ emoji }) => {
    setMessages(messages + emoji + " ");
  };

  // image upload
  const handleFile = (e) => {
    const fileInput = e.target;
    const file = fileInput.files[0];

    if (file) {
      const fileName = user.uid + Date.now().toString(32) + file.name;
      const maxSize = 2 * 1024 * 1024; // 2MB
      const validImageTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      const storageRef = Ref(
        storage,
        `${user.displayName}+${user.uid} = ImageMessages/ ${fileName}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

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
        setLoader(true);
        setError("File size shouldn't exceed 2MB");
        setTimeout(() => setError(null), 5000);
        setTimeout(() => setLoader(false), 5000);
        fileInput.value = "";
        return;
      }
      setError(null);
      // Proceed with the upload if validation passes
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setLoader(true);
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
              setLoader(false);
              fileInput.value = "";
            });
          });
        }
      );
    }
  };
  // auto scroll
  useEffect(() => {
    autoScrollRef.current?.scrollIntoView({ behavior: "smooth" });
    // if (autoScrollRef.current) {
    //   autoScrollRef.current.scrollIntoView({ behavior: "smooth" });
    // }
  }, [messages, allMessages, error]);
  // send button
  const handleSendBtn = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };
  // audio recorder
  const recorderControls = useAudioRecorder(
    {
      noiseSuppression: true,
      echoCancellation: true,
    },
    (err) => console.table(err) // onNotAllowedOrFound
  );
  const addAudioElement = (blob) => {
    const uid = user.uid + Date.now().toString(32);
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    const storageRef = Ref(
      storage,
      `${user.displayName}+${user.uid} = voiceMessages/${uid}`
    );
    const metadata = {
      contentType: "audio/mp3",
    };

    uploadBytes(storageRef, blob, metadata).then((snapshot) => {
      setLoader(true);
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        set(push(ref(db, "singleChat")), {
          whoSendName: user.displayName,
          whoSendId: user.uid,

          whoReceiveName: activeFriend?.name,
          whoReceiveId: activeFriend?.id,
          message: messages,
          audio: downloadURL,
          date: `${new Date().getFullYear()}-${
            new Date().getMonth() + 1
          }-${new Date().getDate()}-${new Date().getHours()}:${new Date().getMinutes()}`,
        }).then(() => {
          setShowEmoji(false); // Hide emoji picker after sending
          setMessages(""); // Clear message input field
          setLoader(false);
        });
      });
    });
  };

  useEffect(() => {
    const blockRef = ref(db, "block/");
    onValue(blockRef, (snapshot) => {
      let blockArr = [];
      snapshot.forEach((item) => {
        blockArr.push({ ...item.val(), id: item.key });
      });
      setBlock(blockArr);
    });
  }, [activeFriend?.id]);

  return (
    <>
      <div className="bg-transparent shadow-xl rounded-[10px] h-full col-span-2 overflow-hidden relative">
        {/* header */}
        <div className="w-full bg-[#F9F9F9] dark:bg-slate-700 py-3 px-3 flex items-center gap-x-3">
          <LazyLoadImage
            src={activeFriend?.photo || "/img/avatar.jpg"}
            className="w-16 h-16 rounded-full"
            alt="friends-profile-pic"
            effect="blur"
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
                <LazyLoadImage
                  src={activeFriend?.photo || "/img/avatar.jpg"}
                  className="w-44 h-44 rounded-full mb-3"
                  alt="friend's image"
                  effect="blur"
                />
                <p className="text-slate-800 dark:text-white font-medium text-2xl mb-10">
                  You are now connected with{" "}
                  <span className="capitalize">
                    {activeFriend?.name || "none"}
                  </span>
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
              allMessages?.map((item, i) => (
                <div key={i} ref={autoScrollRef}>
                  {item.whoSendId === user.uid ? (
                    // sender's message
                    <div className="flex justify-end">
                      {item.message && (
                        <div className="text-slate-800 dark:text-white font-normal text-xl bg-purple-200 dark:bg-violet-500 px-4 pt-2 inline-block rounded-[10px] rounded-br-none my-1 relative max-w-[60%]">
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
                          <h6 className="text-white font-extralight text-sm text-end absolute bottom-4 right-4 bg-black px-3 py-1 rounded-full opacity-60 text-nowrap">
                            {formatDistance(
                              item.date.replace(/-/g, "/"),
                              new Date(),
                              { addSuffix: true }
                            )}
                          </h6>
                          <span className="w-0 h-0 border-t-[25px] border-l-[25px] border-transparent rounded-[10px] border-l-purple-200 dark:border-l-violet-500 absolute -right-4 bottom-0"></span>
                        </div>
                      )}
                      {/* sender's audio */}
                      {item.audio && (
                        <div className="max-w-[60%] my-1 px-2 py-2 bg-purple-200 dark:bg-violet-500 rounded-[10px] rounded-br-none relative">
                          <audio
                            src={item.audio}
                            className="bg-slate-100 shadow-md rounded-[10px]"
                            controls
                          ></audio>
                          <h6 className="text-black dark:text-gray-100 font-extralight text-xs text-end mt-1">
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
                        <div className="text-black dark:text-white font-normal text-xl bg-slate-200 dark:bg-stone-700 px-4 pt-2 inline-block rounded-[10px] my-1 relative max-w-[60%]">
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
                          <h6 className="text-white font-extralight text-sm text-end absolute bottom-4 right-4 bg-black px-3 py-1 rounded-full opacity-60 text-nowrap">
                            {formatDistance(
                              item.date.replace(/-/g, "/"),
                              new Date(),
                              { addSuffix: true }
                            )}
                          </h6>
                          <span className="w-0 h-0 border-r-[21px] border-b-[25px] border-transparent border-r-slate-200 dark:border-r-stone-700 rounded-[10px] rounded-tr-none absolute -left-4 top-0"></span>
                        </div>
                      )}
                      {/* receiver's audio */}
                      {item.audio && (
                        <div className="max-w-[60%] my-1 px-2 py-2 bg-slate-200 dark:bg-stone-700 rounded-[10px] rounded-tl-none relative">
                          <audio
                            src={item.audio}
                            className="bg-slate-100 shadow-md rounded-[10px]"
                            controls
                          ></audio>
                          <h6 className="text-black dark:text-gray-100 font-extralight text-xs text-end mt-1">
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
            <div className="flex flex-col justify-center items-center h-full w-full text-3xl font-semibold text-gray-400 dark:text-gray-200 pt-20">
              <Lottie animationData={selectFriend} loop={true} />
              <p>Please select a friend to start chatting</p>
            </div>
          )}
        </div>

        {/* chat input area */}
        <div className="absolute bottom-0 w-full">
          <div className="h-[116px] w-full bg-[#ffffff80] dark:bg-[#4755697a] backdrop-blur-sm dark:backdrop-blur-md flex rounded-b-lg items-center justify-center relative">
            {activeFriend?.status === "single" ? (
              <>
                {block.some(
                  (ref) =>
                    (ref.blockerId === user.uid &&
                      ref.blockedId === activeFriend.id) ||
                    (ref.blockerId === activeFriend.id &&
                      ref.blockedId === user.uid)
                ) ? (
                  block.find(
                    (ref) =>
                      ref.blockerId === activeFriend.id &&
                      ref.blockedId === user.uid
                  ) ? (
                    <div className="w-full flex items-center justify-center">
                      <div className="w-[90%] text-base font-semibold text-center shadow-md dark:shadow-none dark:bg-gray-800 bg-gray-300 py-3 rounded-[10px] z-20 select-none">
                        <div className="dark:text-gray-300 text-gray-700">
                          <span className="capitalize font-bold text-gray-600 dark:text-gray-200">
                            {activeFriend?.name}
                          </span>{" "}
                          blocked you.
                        </div>
                        <div className="dark:text-gray-500 text-gray-500">
                          You can't reply to this conversation any more.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-center">
                      <div className="text-red-600 w-[90%] text-base font-semibold text-center shadow-md dark:shadow-none bg-red-200 py-3 rounded-[10px] z-20 select-none">
                        You blocked{" "}
                        <span className="font-bold capitalize">
                          {activeFriend?.name}.
                        </span>
                        <div>To continue chatting, unblock first.</div>
                      </div>
                      <p></p>
                    </div>
                  )
                ) : (
                  // message input section
                  <div className="h-20 w-[90%] bg-[#F5F5F5] dark:bg-slate-700 rounded-[10px] flex items-center justify-between z-10 relative">
                    <div className="flex items-center gap-x-3 px-3 ms-4">
                      <div
                        className="text-black dark:text-white cursor-pointer active:scale-90 transition ease-out"
                        onClick={() => recorderControls.startRecording()}
                      >
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
                    {/* voice */}
                    <div
                      className={!recorderControls.isRecording ? "hidden" : ""}
                    >
                      <AudioRecorder
                        onRecordingComplete={(blob) => addAudioElement(blob)}
                        recorderControls={recorderControls}
                        showVisualizer={true}
                      />
                    </div>
                    {error ? (
                      <p className="text-red-600 w-full text-base font-semibold my-2 text-center bg-red-200 py-3 rounded-[10px] mx-4 transition ease-out duration-150">
                        {error}
                      </p>
                    ) : loader ? (
                      <PropagateLoader
                        size={15}
                        className="absolute -top-1 -left-1"
                        color="#af8cfc"
                      />
                    ) : (
                      <input
                        className="w-full h-[80%] outline-none bg-transparent placeholder:text-[#C8C8C8] dark:placeholder:text-slate-400 text-gray-600 dark:text-gray-300 px-4 font-medium text-xl align-middle caret-purple-500"
                        type="text"
                        placeholder="type here...."
                        onChange={(e) => setMessages(e.target.value)}
                        onClick={() => setShowEmoji(false)}
                        value={messages}
                        onKeyUp={handleSendBtn}
                      />
                    )}
                    <button
                      className={`bg-[#3e8ceb] dark:bg-cyan-600 py-4 px-10 rounded-[10px] font-medium text-white text-xl me-3 active:scale-95 transition ease-out ${
                        loader
                          ? "disabled:cursor-not-allowed disabled:scale-100"
                          : ""
                      }`}
                      onClick={handleSendMessage}
                      disabled={loader}
                    >
                      {loader && error ? (
                        <PulseLoader
                          size={5}
                          color="white"
                          className="text-nowrap px-2"
                        />
                      ) : (
                        "Send"
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : null}
            <div className="w-20 h-full absolute right-0 top-0 bg-gradient-to-r from-transparent to-white dark:to-slate-600 z-0"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatting;
