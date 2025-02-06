import { NavLink } from "react-router-dom";
import styles from "./PageNav.module.css";
import Logo from "./Logo";
import Button from "./Button";
import { useAuth } from "../contexts/FakeAuthContext";

function PageNav() {
  const { isAuthenticated, logout } = useAuth();
  console.log(isAuthenticated);
  return (
    <nav className={styles.nav}>
      <Logo />
      <ul>
        <li>
          <NavLink to="/pricing">Pricing</NavLink>
        </li>
        <li>
          <NavLink to="/product">Product</NavLink>
        </li>
        <li>
          {isAuthenticated ? (
            <Button type="primary" onClick={logout}>
              Logout
            </Button>
          ) : (
            <NavLink to="/login" className={styles.ctaLink}>
              Login
            </NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default PageNav;
