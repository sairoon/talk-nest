import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Home from "./pages/home/Home";
import LoggedInUser from "./private/routes/LoggedInUser";
import NotLoggedInUser from "./private/routes/NotLoggedInUser";
import Message from "./pages/message/Message";
import RootLayout from "./components/rootLayout/Index";
import "cropperjs/dist/cropper.css";
import { useEffect, useState } from "react";
import { RiMoonClearLine } from "react-icons/ri";
import { LuSunMedium } from "react-icons/lu";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route element={<LoggedInUser />}>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/message" element={<Message />} />
          </Route>
        </Route>
        <Route element={<NotLoggedInUser />}>
          <Route path="/sign-up" element={<Register />} />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
      </Route>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
      <button
        className="absolute bottom-28 left-16 text-white"
        onClick={toggleDarkMode}
      >
        {darkMode ? (
          <div className="scale-[2.5] bg-[#352481] m-2 p-1 hover:scale-[2.65] transition ease-linear duration-150 rounded-full">
            <LuSunMedium />
          </div>
        ) : (
          <div className="scale-[2] bg-[#5E3493] m-2 p-1 hover:scale-[2.15] transition ease-linear duration-150 rounded-full">
            <RiMoonClearLine />
          </div>
        )}
      </button>
    </>
  );
}

export default App;
