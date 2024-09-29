import { useFormik } from "formik";
import React, { useState } from "react";
import { loginSchema } from "../../validation/Validation";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { PulseLoader } from "react-spinners";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { LoggedInUsers } from "../../features/slices/LoginSlice";
import { Link, useNavigate } from "react-router-dom";

const LoginFormComp = ({ toast }) => {
  const auth = getAuth();
  const [loader, setLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };
  const formik = useFormik({
    initialValues,
    onSubmit: () => {
      loginUser();
    },
    validationSchema: loginSchema,
  });
  const loginUser = () => {
    setLoader(true);
    signInWithEmailAndPassword(
      auth,
      formik.values.email,
      formik.values.password
    )
      .then(({ user }) => {
        if (user.emailVerified === true) {
          dispatch(LoggedInUsers(user));
          localStorage.setItem("user", JSON.stringify(user));
          navigate("/");
        } else {
          toast.error("Please verify your email.", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "colored",
          });
        }
        setLoader(false);
      })
      .catch((error) => {
        if (error.message.includes("auth/invalid-credential")) {
          toast.error("Email or Password is incorrect. Please try again.", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "dark",
          });
          setLoader(false);
        }
      });
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <>
      <div>
        <form onSubmit={formik.handleSubmit}>
          <div className="my-3">
            <label className="text-[#484848] dark:text-white">Enter Email</label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              className="w-full bg-transparent px-3 py-2 border border-slate-300 rounded-md outline-none mt-3 text-gray-800 dark:text-white"
            />
            {formik.errors.email && formik.touched.email ? (
              <span className="text-red-500 dark:text-red-400 font-normal">{formik.errors.email}</span>
            ) : null}
          </div>

          <div className="mt-5 mb-3 relative">
            <label className="text-[#484848] dark:text-white">Enter Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              className="w-full bg-transparent ps-3 pe-10 py-2 border border-slate-300 rounded-md outline-none mt-3 text-gray-800 dark:text-white"
            />
            <button
              onClick={handleShowPassword}
              type="button"
              className="absolute top-10 right-1 p-2 bg-transparent border-0 outline-none text-black dark:text-white"
            >
              {showPassword ? (
                <span title="Hide">
                  <PiEye />
                </span>
              ) : (
                <span title="Show">
                  <PiEyeClosed />
                </span>
              )}
            </button>
            {formik.errors.password && formik.touched.password ? (
              <span className="text-red-500 dark:text-red-400 font-normal">{formik.errors.password}</span>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={loader}
            className="w-full bg-[#313131] text-white font-medium text-base px-3 py-3 rounded-[10px] my-2 disabled:cursor-not-allowed disabled:scale-100 active:scale-95 transition ease-out hover:bg-purple-700 dark:hover:bg-stone-800"
          >
            {loader ? (
              <PulseLoader color="#fff" size={5} speedMultiplier={1} />
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        <p className="text-base font-normal text-[#4A4A4A] dark:text-white underline cursor-pointer mt-6 hover:text-purple-700 dark:hover:text-purple-300">
          forgot password?
        </p>
        <p className="text-base font-normal text-black dark:text-white mt-6 mb-6">
          Don’t have an account please{" "}
          <Link
            to="/sign-up"
            className="text-[#236DB0] dark:text-sky-300 font-medium cursor-pointer hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </>
  );
};

export default LoginFormComp;
