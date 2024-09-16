import React from "react";
import RegFormComp from "../../components/register/Index";

const Register = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <h1 className="font-normal font-titleFont mb-3 text-[80px]">TalkNest</h1>
      <div className="w-1/4 shadow-lg bg-white p-4 rounded-md flex items-center gap-x-2 justify-evenly text-gray-600">
        <div className="w-full my-14 mx-4">
          <RegFormComp />
        </div>
      </div>
    </div>
  );
};

export default Register;
