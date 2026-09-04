import { Outlet } from "react-router-dom";

function ApplicationLayout() {
  return (
    <div>
      <header>
        <div>
          <strong>National Land Acquisition & Management System</strong>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default ApplicationLayout;