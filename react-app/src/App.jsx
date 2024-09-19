import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import VolunteerHistory from "./components/VolunteerHistory"; // Import the Volunteer History component
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

function App() {
  const route = createBrowserRouter([
    {
      path: "/",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/volunteer-history", // Add route for Volunteer History
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
