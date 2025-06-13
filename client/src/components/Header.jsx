import { IoMdHome } from "react-icons/io";
import { FaList } from "react-icons/fa";
import { IoBagAdd } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown } from "react-bootstrap";
import { useState } from "react";
import { FaBars, FaSearch } from "react-icons/fa";
import { logoutUser, resetTokenAndCredentials } from "../store/authSlice";
import toast from "react-hot-toast";

const Header = () => {
  const bag = useSelector((state) => state.cart?.cartItems || []);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    // dispatch(logoutUser());
    dispatch(resetTokenAndCredentials());
    sessionStorage.clear();
    toast.success("Logged out successfully");
    navigate(location.pathname, { replace: true });
  }

  return (
    <header className="header">
      <div className="logo_container">
        <Link to="/">
          <img
            className="myntra_home"
            src="images/myntra_logo.webp"
            alt="Myntra Home"
          />
        </Link>
      </div>

      <button
        className="nav_toggle_btn"
        onClick={() => setIsNavOpen(!isNavOpen)}
        aria-label="Toggle navigation menu"
      >
        <FaBars size={24} />
      </button>

      <nav className={`nav_bar ${isNavOpen ? "open" : ""}`}>
        <Link to="#">Men</Link>
        <Link to="#">Women</Link>
        <Link to="#">Kids</Link>
        <Link to="#">Home & Living</Link>
        <Link to="#">Beauty</Link>
        <Link to="#">
          Studio <sup>New</sup>
        </Link>
      </nav>

      <div className="action_bar">
        <Dropdown className="action_container">
          <Dropdown.Toggle
            as="div"
            className="p-0 d-flex flex-column align-items-center"
            id="search-dropdown"
            role="button"
          >
            <FaSearch size={20} />
            <span className="action_name">Search</span>
          </Dropdown.Toggle>

          <Dropdown.Menu className="p-2" style={{ minWidth: "250px" }}>
            <div className="d-flex align-items-center p-2 border rounded">
              <FaSearch className="me-2" />
              <input
                type="text"
                placeholder="Search here..."
                className="form-control border-0 p-0"
                style={{ boxShadow: "none" }}
                aria-label="Dropdown search"
                autoComplete="off"
              />
            </div>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown className="action_container">
          <Dropdown.Toggle
            as="div"
            className="p-0 d-flex flex-column align-items-center"
            id="profile-dropdown"
            role="button"
          >
            <IoMdHome size={20} />
            <span className="action_name">Profile</span>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {user ? (
              <>
                <Dropdown.Header className="text-center">
                  Signed in as <strong>{user.userName}</strong>
                </Dropdown.Header>
                <Dropdown.Item as={Link} to="/profile">
                  My Profile
                </Dropdown.Item>
                <Dropdown.Item as={Link} onClick={handleLogout}>
                  Logout
                </Dropdown.Item>
              </>
            ) : (
              <>
                <Dropdown.Item as={Link} to="/auth/login">
                  Login
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/auth/register">
                  Register
                </Dropdown.Item>
              </>
            )}
          </Dropdown.Menu>
        </Dropdown>

        <Link to="/wishlist" className="action_container">
          <FaList />
          <span className="action_name">Wishlist</span>
        </Link>

        <Link
          className="action_container position-relative mb-3"
          to="/checkout"
        >
          <IoBagAdd size={20} />
          <span className="action_name">Bag</span>
          {bag.length > 0 && (
            <span
              className="bag-item-count position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{ fontSize: "0.75rem" }}
            >
              {bag.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};

export default Header;
