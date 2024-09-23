import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Login from "../../pages/auth/Login";

export default function LoggedInUser() {
  const user = useSelector((user) => user.login.loggedIn);
  return user ? <Outlet /> : <Login />;

}
