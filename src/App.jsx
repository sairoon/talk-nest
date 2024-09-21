import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Register from "./pages/auth/Register";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/auth/Login";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/sign-up" element={<Register />} />
        <Route path="/sign-in" element={<Login />} />
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
