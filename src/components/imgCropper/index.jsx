import React from "react";
import { CrossIcon } from "../../svg/Cross";
import { Cropper } from "react-cropper";
import { PulseLoader } from "react-spinners";

const ImgCropper = ({ setImage, cropperRef, image, getCropData, loader }) => {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center">
        <div className="w-1/3 bg-gray-200 dark:bg-slate-800 rounded-lg p-4 ">
          <div className="relative">
            <h3 className="text-2xl font-normal text-[#3D3C3C] dark:text-white text-center py-2">
              Upload Image
            </h3>
            <div
              className="absolute top-3 right-5 text-black dark:text-white cursor-pointer scale-125 active:scale-110 transition ease-out"
              onClick={() => setImage(false)}
            >
              <CrossIcon />
            </div>
          </div>
          <div className="w-20 h-20 mx-auto rounded-full p-2 mt-3 overflow-hidden">
            <div
              className="img-preview"
              style={{ width: "100%", float: "left", height: "300px" }}
            />
          </div>
          <div className="my-5">
            <Cropper
              ref={cropperRef}
              style={{ height: 400, width: "100%" }}
              zoomTo={0.5}
              initialAspectRatio={1}
              preview=".img-preview"
              src={image}
              viewMode={1}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={false}
              responsive={true}
              autoCropArea={1}
              checkOrientation={false}
              guides={true}
            />
          </div>
          <button
            className="bg-[#4A81D3] dark:bg-sky-600 w-full py-3 rounded-md font-medium text-lg text-white active:scale-95 transition ease-out disabled:cursor-not-allowed disabled:scale-100 disabled:bg-sky-500"
            onClick={getCropData}
            disabled={loader}
          >
            {loader ? (
              <PulseLoader color="#fff" size={5} speedMultiplier={1} />
            ) : (
              "Upload"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default ImgCropper;
