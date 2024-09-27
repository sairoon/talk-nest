import React, { useRef, useState } from "react";
import { CrossIcon } from "../../svg/Cross";
import { UploadIcon } from "../../svg/Upload";
import ImgCropper from "../imgCropper";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, updateProfile } from "firebase/auth";
import { LoggedInUsers } from "../../features/slices/LoginSlice";

const Modal = ({ setShow }) => {
  const user = useSelector((user) => user.login.loggedIn);
  const [loader, setLoader] = useState(false);
  const auth = getAuth();
  const dispatch = useDispatch();
  const [image, setImage] = useState(false);
  const [cropData, setCropData] = useState("#");
  const cropperRef = useRef();
  const fileRef = useRef(null);
  const [error, setError] = useState(null);
  const storage = getStorage();
  const storageRef = ref(storage, user.uid);
  // const uploadTask = uploadBytesResumable(storageRef, file);

  const handleFile = (e) => {
    //img file validation
    const file = e.target.files[0];
    if (file) {
      const validImageTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validImageTypes.includes(file.type)) {
        setError("Please upload a valid image file (JPEG, PNG, WebP).");
        return;
      }
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        setError("File size shouldn't exceed 2MB.");
        return;
      }
      setError(null);
    }
    //img reader
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };
  //img cropper upload to firebase
  const getCropData = () => {
    setLoader(true);
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
      const message4 = cropperRef.current?.cropper
        .getCroppedCanvas()
        .toDataURL();
      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          }).then(() => {
            dispatch(LoggedInUsers({ ...user, photoURL: downloadURL }));
            localStorage.setItem(
              "user",
              JSON.stringify({ ...user, photoURL: downloadURL })
            );
            setShow(false);
          });
        });
      });
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-screen bg-[#2b2b2b91] dark:bg-[#dddbdb45] backdrop-blur-sm z-40 flex items-center justify-center">
        <div className="w-1/3 bg-gray-200 dark:bg-slate-800 rounded-lg p-4 ">
          <div className="relative">
            <h3 className="text-2xl font-normal text-[#3D3C3C] dark:text-white text-center py-2">
              Upload Image
            </h3>
            <div
              className="absolute top-3 right-5 text-black dark:text-white cursor-pointer scale-125 active:scale-110 transition ease-out"
              onClick={() => setShow(false)}
            >
              <CrossIcon />
            </div>
            {error && (
              <p className="text-red-600 text-base font-semibold my-2 text-center bg-red-200 py-1 rounded-lg mx-2">
                {error}
              </p>
            )}
          </div>
          <div className="w-full h-80 border border-gray-400 rounded-lg p-2 mt-3">
            <div
              className="w-full h-full bg-slate-300 dark:bg-slate-600 rounded-md flex flex-col items-center justify-center text-slate-700 dark:text-white text-xl font-medium cursor-pointer"
              onClick={() => fileRef.current.click()}
            >
              <span className="scale-150 mb-4">
                <UploadIcon />
              </span>
              <h3>Click here to upload image</h3>
              <input
                type="file"
                ref={fileRef}
                onChange={handleFile}
                accept="image/jpeg, image/png, image/webp"
                hidden
              />
            </div>
          </div>
          {image && (
            <ImgCropper
              setImage={setImage}
              cropperRef={cropperRef}
              image={image}
              getCropData={getCropData}
              loader={loader}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Modal;
