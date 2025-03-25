
import { IconArrowBack, IconHome, IconSettings, IconUser } from "@tabler/icons-react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';
import { Sidebar, SidebarBody, SidebarLink } from "./Sidebar";


const links = [
  { label: "Home", href: "/", icon: <IconHome /> },
  { label: "Profile", href: "/profile", icon: <IconUser /> },
  { label: "Settings", href: "/settings", icon: <IconSettings /> },
  { label: "Logout", href: "/logout", icon: <IconArrowBack />}
];


function App() {
  return (
    <>
    <Router>
      <Sidebar >
        <SidebarBody>
          {links.map((link, index) => (
            <SidebarLink key={index} link={link} />
          ))}
        </SidebarBody>
      </Sidebar>

      <div className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route path="/profile" element={<h1>Profile Page</h1>} />
          <Route path="/settings" element={<h1>Settings Page</h1>} />
        </Routes>
      </div>
    </Router>
    </>
  );
}



export default App
