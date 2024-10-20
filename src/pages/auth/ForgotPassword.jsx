import React from "react";
import ForgotPassComp from "../../components/forgotPass";
import { toast, ToastContainer } from "react-toastify";
import { Helmet } from "react-helmet-async";

const ForgotPassword = () => {
  return (
    <>
    <Helmet>
      <title>TalkNest | Forgot Password</title>
    </Helmet>
      <ToastContainer />
      <div className="w-full h-screen bg-white dark:bg-slate-800 flex flex-col justify-center items-center">
        <h1 className="font-normal font-titleFont mb-3 text-[80px] text-black dark:text-white">
          TalkNest
        </h1>
        <div className="w-1/4 shadow-lg bg-white dark:bg-slate-600 p-4 rounded-md flex items-center gap-x-2 justify-evenly text-gray-600">
          <div className="w-full my-14 mx-4">
            <ForgotPassComp toast={toast} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
