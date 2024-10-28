import { useFormik } from "formik";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { forgotPassSchema } from "../../validation/Validation";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ForgotPassComp = ({ toast }) => {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const initialValues = {
    email: "",
  };

  const formik = useFormik({
    initialValues,
    onSubmit: () => {
      resetUserPass();
    },
    validationSchema: forgotPassSchema,
  });

  const resetUserPass = () => {
    setLoader(true);
    const auth = getAuth();
    sendPasswordResetEmail(auth, formik.values.email)
      .then(() => {
        toast.info("Please check your email to reset your password.", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "dark",
        });
        setTimeout(() => {
          navigate("/sign-in");
        }, 6000);
        setLoader(false);
      })
      .catch((error) => {
        toast.error("Something went wrong", {
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
  };

  return (
    <>
      <div>
        <form onSubmit={formik.handleSubmit}>
          <div className="my-3">
            <label className="text-[#484848] dark:text-white">
              Enter Email
            </label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              className="w-full bg-transparent px-3 py-2 border border-slate-300 rounded-md outline-none mt-3 text-gray-800 dark:text-white"
            />
            {formik.errors.email && formik.touched.email ? (
              <span className="text-red-500 dark:text-red-400 font-normal">
                {formik.errors.email}
              </span>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={loader}
            className="w-full bg-[#313131] text-white font-medium text-base px-3 py-3 rounded-[10px] my-2 disabled:cursor-not-allowed disabled:scale-100 active:scale-95 transition ease-linear duration-150 hover:bg-[#5e3493] dark:hover:bg-stone-800"
          >
            {loader ? (
              <PulseLoader color="#fff" size={5} speedMultiplier={1} />
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <p className="text-base font-normal text-black dark:text-white mt-6 mb-6">
          Remember your password? please{" "}
          <Link
            to="/sign-in"
            className="text-[#236DB0] dark:text-sky-300 font-medium cursor-pointer hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </>
  );
};

export default ForgotPassComp;
