import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Matching from "./components/Matching";
import Management from "./components/Management";
import Calendar from "./components/Calendar";
import VolunteerHistory from "./components/VolunteerHistory";
import Report from "./components/Report";
import Protected from "./components/Protected";
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
      element: <Protected element={<Profile />} />,
    },
    {
      path: "/matching",
      element: <Protected element={<Matching />} />,
    },
    {
      path: "/management",
      element: <Protected element={<Management />} />,
    },
    {
      path: "/calendar",
      element: <Protected element={<Calendar />} />,
    },
    {
      path: "/history",
      element: <Protected element={<VolunteerHistory />} />,
    },
    {
      path: "/report",
      element: <Protected element={<Report />} />,
    },
    
  ]);

  return (
    <div className="App">
      <RouterProvider router={route} />
    </div>
  );
}

export default App;
