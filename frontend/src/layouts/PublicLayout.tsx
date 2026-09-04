import {
  Globe2,
  Landmark,
  LogIn,
} from "lucide-react";
import { Link, Outlet } from "react-router-dom";

function PublicLayout() {
  return (
    <div>
      <header className="public-header">
        <div className="public-header__inner">
          <Link to="/" className="public-brand">
            <span className="public-brand__mark">
              <Landmark size={20} />
            </span>

            <span className="public-brand__text">
              <span className="public-brand__title">
                National Land Acquisition
              </span>

              <span className="public-brand__subtitle">
                Land Intelligence & Management System
              </span>
            </span>
          </Link>

          <nav className="public-nav" aria-label="Primary navigation">
            <a href="#capabilities">Capabilities</a>
            <a href="#workflow">Workflow</a>
            <a href="#ai">Responsible AI</a>
          </nav>

          <div className="public-header__actions">
            <button
              type="button"
              className="public-language"
              aria-label="Current language: English"
            >
              <Globe2 size={13} />
              EN
            </button>

            <button type="button" className="public-signin">
              <LogIn size={13} />
              Sign in
            </button>
          </div>
        </div>
      </header>

      <Outlet />
    </div>
  );
}

export default PublicLayout;