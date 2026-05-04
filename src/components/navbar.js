import { Link } from "react-router-dom";
import ServiceDropdown from "./ServiceDropdown";
import logo from "../images/logo.png";
import "../styles/navbarLogo.css";
import { FiLogOut } from "react-icons/fi";

export default function Navbar({ user, logout }) {
  return (
    <div className="navbar">
   
      <img src={logo} alt="TransportVU Logo" className="logo"/>
   
      <h2>Vanuatu Smart Transport</h2>

      <div className="nav-links">

        <Link to="/">Home</Link>
        <Link to="/booking">Bookings</Link>

        <ServiceDropdown />

        {/* DRIVER ONLY */}
        {user?.role === "Driver" && (
          <Link to="/driver">Driver Panel</Link>
        )}

        {/* PASSENGER ONLY */}
        {user?.role === "Passenger" && (
          <Link to="/passenger">Passenger Panel</Link>
        )}

        {/* ADMIN ONLY */}
        {user?.role === "Admin" && (
          <Link to="/admin">Admin</Link>
        )}

        <Link to="/contact">Contact</Link>

        {/* LOGOUT */}
        {user && (
          <button onClick={logout} className="logout-btn">
            <FiLogOut />
          </button>
        )}

      </div>
    </div>
  );
}