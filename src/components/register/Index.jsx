import { useFormik } from "formik";
import React, { useState } from "react";
import { registerSchema } from "../../validation/Validation";
import { PiEye, PiEyeClosed } from "react-icons/pi";

const RegFormComp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPass, setConfirmPass] = useState(false);

  const initialValues = {
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const formik = useFormik({
    initialValues,
    onSubmit: console.log("submitted"),
    validationSchema: registerSchema,
  });

  console.log(formik);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleConfirmPass = () => {
    setConfirmPass(!confirmPass);
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="my-3">
          <label>Enter Name</label>
          <input
            type="text"
            name="userName"
            value={formik.values.userName}
            onChange={formik.handleChange}
            className="w-full bg-transparent px-3 py-2 border border-slate-300 rounded-md outline-none"
          />
          {formik.errors.userName && formik.touched.userName ? (
            <span className="text-red-500">{formik.errors.userName}</span>
          ) : null}
        </div>
        <div className="my-3">
          <label>Enter Email</label>
          <input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            className="w-full bg-transparent px-3 py-2 border border-slate-300 rounded-md outline-none"
          />
          {formik.errors.email && formik.touched.email ? (
            <span className="text-red-500">{formik.errors.email}</span>
          ) : null}
        </div>

        <div className="my-3 relative">
          <label>Enter Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            className="w-full bg-transparent ps-3 pe-10 py-2 border border-slate-300 rounded-md outline-none"
          />
          <button
            onClick={handleShowPassword}
            className="absolute top-7 right-1 p-2 bg-transparent border-0 outline-none"
          >
            {showPassword ? (
              <span className=""><PiEyeClosed /></span>
            ) : (
              <span className=""><PiEye /></span>
            )}
          </button>
          {formik.errors.password && formik.touched.password ? (
            <span className="text-red-500">{formik.errors.password}</span>
          ) : null}
        </div>

        <div className="my-3 relative">
          <label>Enter Confirm Password</label>
          <input
            type={confirmPass ? "text" : "password"}
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            className="w-full bg-transparent ps-3 pe-10 py-2 border border-slate-300 rounded-md outline-none"
          />
          <button
            onClick={handleConfirmPass}
            className="absolute top-7 right-1 p-2 bg-transparent border-0 outline-none"
          >
            {confirmPass ? (
              <span className=""><PiEyeClosed /></span>
            ) : (
              <span className=""><PiEye /></span>
            )}
          </button>
          {formik.errors.confirmPassword && formik.touched.confirmPassword ? (
            <span className="text-red-500">
              {formik.errors.confirmPassword}
            </span>
          ) : null}
        </div>
        <button
          type="submit"
          className="w-full bg-[#313131] text-white font-medium text-base px-3 py-3 rounded-lg my-2 active:scale-95 transition ease-out"
        >
          Sign Up
        </button>
      </form>
      <p className="text-base font-normal text-black mt-2">
        Already have an account please{" "}
        <span className="text-[#236DB0] font-medium cursor-pointer">
          Sign In
        </span>
      </p>
    </div>
  );
};

export default RegFormComp;
