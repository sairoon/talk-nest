import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Home from "./pages/home/Home";
import LoggedInUser from "./private/routes/LoggedInUser";
import NotLoggedInUser from "./private/routes/NotLoggedInUser";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route element={<LoggedInUser />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route element={<NotLoggedInUser />}>
          <Route path="/sign-up" element={<Register />}/>
          <Route path="/sign-in" element={<Login />} />
        </Route>
      </Route>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
