import React, { useRef, useState } from "react";
import { CrossIcon } from "../../svg/Cross";
import { UploadIcon } from "../../svg/Upload";

const Modal = ({ setShow }) => {
  const fileRef = useRef(null);
  const [error, setError] = useState(null);

  const handleFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validImageTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!validImageTypes.includes(file.type)) {
        setError("Please upload a valid image file (JPEG, PNG, GIF, WebP).");
        return;
      }
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        setError("File size shouldn't exceed 2MB.");
        return;
      }
      setError(null);
      console.log("File accepted:", file);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-screen bg-[#2b2b2b91] dark:bg-[#dddbdb45] backdrop-blur-sm z-40 flex items-center justify-center">
        <div className="w-1/3 bg-gray-200 dark:bg-slate-800 rounded-lg p-4 relative">
          <h3 className="text-2xl font-normal text-[#3D3C3C] dark:text-white text-center">
            Upload Image
          </h3>
          <div
            className="absolute top-5 right-5 text-black dark:text-white cursor-pointer scale-125 active:scale-110 transition ease-out"
            onClick={() => setShow(false)}
          >
            <CrossIcon />
          </div>
          {error && (
            <p className="text-red-600 text-base font-semibold my-2 text-center bg-red-200 py-1 rounded-lg">
              {error}
            </p>
          )}
          <div
            className="w-full h-80 border border-gray-400 rounded-lg p-2 mt-3 cursor-pointer"
            onClick={() => fileRef.current.click()}
          >
            <div className="w-full h-full bg-slate-300 dark:bg-slate-600 rounded-md flex flex-col items-center justify-center text-slate-700 dark:text-white text-xl font-medium">
              <span className="scale-150 mb-4">
                <UploadIcon />
              </span>
              <h3>Click here to upload image</h3>
              <input
                type="file"
                ref={fileRef}
                onChange={handleFile}
                accept="image/*"
                hidden
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
