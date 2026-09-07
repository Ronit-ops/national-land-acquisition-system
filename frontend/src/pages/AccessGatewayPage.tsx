import {
  ArrowRight,
  Building2,
  LandPlot,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function AccessGatewayPage() {
  const navigate = useNavigate();

  return (
    <main className="access-gateway">
      <header className="access-gateway__header">
        <div className="access-gateway__header-inner">
          <div className="access-gateway__brand">
            <div
              className="access-gateway__brand-mark"
              aria-hidden="true"
            >
              <LandPlot size={21} />
            </div>

            <div>
              <span className="access-gateway__brand-title">
                National Land Acquisition System
              </span>

              <span className="access-gateway__brand-subtitle">
                Unified Digital Access Portal
              </span>
            </div>
          </div>

          <div className="access-gateway__security">
            <ShieldCheck size={16} aria-hidden="true" />
            Secure access gateway
          </div>
        </div>
      </header>

      <section className="access-gateway__main">
        <div className="access-gateway__container">
          <div className="access-gateway__intro">
            <span className="access-gateway__eyebrow">
              NATIONAL LAND ACQUISITION PLATFORM
            </span>

            <h1>
              Select your access
              <br />
              to continue
            </h1>

            <p>
              A unified digital platform connecting land parcels,
              acquisition cases, compensation, rehabilitation and
              resettlement, possession, geospatial intelligence,
              field verification and citizen services.
            </p>
          </div>

          <section
            className="access-gateway__options"
            aria-label="Access options"
          >
            <article className="access-gateway-card">
              <div className="access-gateway-card__top">
                <div className="access-gateway-card__icon">
                  <Building2 size={22} />
                </div>

                <span className="access-gateway-card__label">
                  GOVERNMENT ACCESS
                </span>
              </div>

              <h2>Government Officer</h2>

              <p>
                Access the operational workspace for authorized
                government officers and departments.
              </p>

              <ul>
                <li>Projects and land requirements</li>
                <li>Parcel and right-holder records</li>
                <li>Acquisition workflow</li>
                <li>Compensation and R&R</li>
                <li>GIS, satellite and AI intelligence</li>
                <li>Field verification and decision support</li>
              </ul>

              <button
                type="button"
                className="access-gateway-card__button"
                onClick={() => navigate("/login")}
              >
                Continue to Government Access
                <ArrowRight size={17} aria-hidden="true" />
              </button>

              <span className="access-gateway-card__note">
                Role, department and jurisdiction controls apply.
              </span>
            </article>

            <article className="access-gateway-card access-gateway-card--citizen">
              <div className="access-gateway-card__top">
                <div className="access-gateway-card__icon">
                  <UsersRound size={22} />
                </div>

                <span className="access-gateway-card__label">
                  CITIZEN SERVICES
                </span>
              </div>

              <h2>Citizen / Landholder</h2>

              <p>
                Track an authorized land acquisition case and view
                citizen-visible records and case updates.
              </p>

              <ul>
                <li>Case status and parcel information</li>
                <li>Notifications and official records</li>
                <li>Objections and hearing information</li>
                <li>Award and compensation status</li>
                <li>R&R information</li>
                <li>Possession status</li>
              </ul>

              <button
                type="button"
                className="access-gateway-card__button"
                onClick={() => navigate("/citizen")}
              >
                Continue to Citizen Services
                <ArrowRight size={17} aria-hidden="true" />
              </button>

              <span className="access-gateway-card__note">
                Only information authorized for citizen access is
                displayed.
              </span>
            </article>
          </section>

          <section className="access-gateway__trust">
            <div>
              <ShieldCheck size={18} aria-hidden="true" />

              <div>
                <strong>Access boundaries are enforced by role</strong>

                <span>
                  Government operational records and citizen-visible
                  information are kept in separate access contexts.
                </span>
              </div>
            </div>

            <div>
              <LandPlot size={18} aria-hidden="true" />

              <div>
                <strong>Parcel-centric platform</strong>

                <span>
                  Project, parcel, acquisition and downstream
                  activities are connected through a common case
                  model.
                </span>
              </div>
            </div>
          </section>

          <div className="access-gateway__demo">
            <span>DEMONSTRATION ENVIRONMENT</span>

            <p>
              This prototype uses simulated records. No live
              government identity service, land record system,
              payment system or government document repository is
              connected at this stage.
            </p>
          </div>
        </div>
      </section>

      <footer className="access-gateway__footer">
        <div className="access-gateway__footer-inner">
          <span>
            National Land Acquisition System
          </span>

          <span>
            Unified access gateway · Demonstration environment
          </span>
        </div>
      </footer>
    </main>
  );
}

export default AccessGatewayPage;