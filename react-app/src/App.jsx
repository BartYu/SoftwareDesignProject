import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Matching from "./components/Matching";
import Management from "./components/Management";
import Calendar from "./components/Calendar";
import VolunteerHistory from "./components/VolunteerHistory"; // Import the Volunteer History component
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
      path: "/management",
      element: <Management />,
    },
    {
      path: "/calendar",
      element: <Calendar />,
    },
    {
      path: "/history",
      element: <VolunteerHistory />,
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={route}></RouterProvider>
    </div>
  );
}

export default App;
