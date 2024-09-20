import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Matching from "./components/Matching";
import Calendar from "./components/Calendar"
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

function App() {
  const route = createBrowserRouter([
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/matching",
      element: <Matching />,
    },
    {
      path: "/calendar",
      element: <Calendar />,
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={route}></RouterProvider>
    </div>
  );
}

export default App;
