import { useFormik } from "formik";
import React, { useState } from "react";
import { registerSchema } from "../../validation/Validation";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { PulseLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";
import { getDatabase, ref, set } from "firebase/database";

const RegFormComp = ({ toast }) => {
  const [loader, setLoader] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPass, setConfirmPass] = useState(false);
  const db = getDatabase();

  const initialValues = {
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const formik = useFormik({
    initialValues,
    onSubmit: () => {
      createNewUsers();
    },
    validationSchema: registerSchema,
  });

  const createNewUsers = () => {
    setLoader(true);
    createUserWithEmailAndPassword(
      auth,
      formik.values.email,
      formik.values.password
    )
      .then(({ user }) => {
        // console.log(user);
        updateProfile(auth.currentUser, {
          displayName: formik.values.userName,
        }).then(() => {
          sendEmailVerification(auth.currentUser)
            .then(() => {
              toast.info(
                "Please verify this email to complete your registration.",
                {
                  position: "bottom-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: false,
                  progress: undefined,
                  theme: "colored",
                }
              );
              setTimeout(() => {
                navigate("/sign-in");
              }, 6000);
              setLoader(false);
            })
            .then(() => {
              set(ref(db, "users/" + user.uid), {
                username: user.displayName,
                email: user.email,
              });
            })
            .catch((error) => {
              toast.error(error.message, {
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
            });
        });
      })
      .catch((error) => {
        if (error.message.includes("auth/email-already-in-use")) {
          toast.error("This email is already in use. Please try logging in.", {
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
  const handleConfirmPass = () => {
    setConfirmPass(!confirmPass);
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="my-3">
          <label className="text-[#484848] dark:text-white">Enter Name</label>
          <input
            type="text"
            name="userName"
            value={formik.values.userName}
            onChange={formik.handleChange}
            autoComplete="off"
            className="w-full bg-transparent px-3 py-2 border capitalize border-slate-300 rounded-md outline-none mt-3 text-gray-800 dark:text-white"
          />
          {formik.errors.userName && formik.touched.userName ? (
            <span className="text-red-500 dark:text-red-400 font-normal">{formik.errors.userName}</span>
          ) : null}
        </div>
        <div className="my-3">
          <label className="text-[#484848] dark:text-white">Enter Email</label>
          <input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            autoComplete="off"
            className="w-full bg-transparent px-3 py-2 border border-slate-300 rounded-md outline-none mt-3 text-gray-800 dark:text-white"
          />
          {formik.errors.email && formik.touched.email ? (
            <span className="text-red-500 dark:text-red-400 font-normal">{formik.errors.email}</span>
          ) : null}
        </div>

        <div className="my-3 relative">
          <label className="text-[#484848] dark:text-white">
            Enter Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            autoComplete="off"
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

        <div className="my-3 relative">
          <label className="text-[#484848] dark:text-white">
            Enter Confirm Password
          </label>
          <input
            type={confirmPass ? "text" : "password"}
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            autoComplete="off"
            className="w-full bg-transparent ps-3 pe-10 py-2 border border-slate-300 rounded-md outline-none mt-3 text-gray-800 dark:text-white"
          />
          <button
            onClick={handleConfirmPass}
            type="button"
            className="absolute top-10 right-1 p-2 bg-transparent border-0 outline-none text-black dark:text-white"
          >
            {confirmPass ? (
              <span title="Hide">
                <PiEye />
              </span>
            ) : (
              <span title="Show">
                <PiEyeClosed />
              </span>
            )}
          </button>
          {formik.errors.confirmPassword && formik.touched.confirmPassword ? (
            <span className="text-red-500 dark:text-red-400 font-normal">
              {formik.errors.confirmPassword}
            </span>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={loader}
          className="w-full bg-[#313131] text-white font-medium text-base px-3 py-3 rounded-[10px] my-2 disabled:cursor-not-allowed disabled:scale-100 active:scale-95 transition-all ease-out hover:bg-purple-700 dark:hover:bg-stone-800"
        >
          {loader ? (
            <PulseLoader color="#fff" size={5} speedMultiplier={1} />
          ) : (
            "Sign Up"
          )}
        </button>
      </form>
      <p className="text-base font-normal text-black dark:text-white mt-2">
        Already have an account please{" "}
        <Link
          to="/sign-in"
          className="text-[#236DB0] dark:text-sky-300 font-medium cursor-pointer hover:underline"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default RegFormComp;
