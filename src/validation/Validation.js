import * as Yup from "yup";

export const registerSchema = Yup.object().shape({
  userName: Yup.string()
    .min(4, "Name must be at least 4 characters")
    .max(15, "Name shouldn't exceed 15 characters")
    .required("Please Enter your Name"),
  email: Yup.string()
    .email("Invalid email")
    .required("Please Enter your Email"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password shouldn't exceed 64 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase character")
    .matches(/[A-Z]/, "Password must contain at least one uppercase character")
    .matches(/[0-9]/, "Password must contain at least one digit")
    .matches(
      /[!@#$%^&*()_+\-=\[\]{};`~':"\\|,.<>\/?]/,
      "Password must contain at least one special character"
    )
    .required("Password is Required *"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is Required *"),
});
