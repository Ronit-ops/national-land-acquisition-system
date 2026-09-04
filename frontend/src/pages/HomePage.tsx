import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FileSearch,
  Landmark,
  Map,
  Satellite,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import IconBadge from "../components/ui/IconBadge";
import "../styles/home.css";

function HomePage() {
  return (
    <main className="home-page">
      {/* =====================================================
          HERO
          ===================================================== */}

      <section className="home-hero">
        <div className="home-hero__content">
          <span className="home-eyebrow">
            NATIONAL LAND INTELLIGENCE PLATFORM
          </span>

          <h1>
            One connected view of
            <span> every parcel.</span>
          </h1>

          <p className="home-hero__description">
            A unified digital platform for planning, monitoring and managing
            the complete land acquisition lifecycle — connecting land records,
            projects, workflows, geospatial intelligence and field activity.
          </p>

          <div className="home-hero__actions">
            <a href="#capabilities" className="home-button home-button--primary">
              Explore platform
              <ArrowRight size={14} />
            </a>

            <a
              href="#workflow"
              className="home-button home-button--secondary"
            >
              See how it works
            </a>
          </div>

          <div className="home-hero__trust">
            <span className="home-hero__trust-icon">
              <ShieldCheck size={14} />
            </span>

            <span>
              Designed for accountable, traceable and human-supervised
              decision-making.
            </span>
          </div>
        </div>

        {/* =================================================
            LAND INTELLIGENCE VISUAL
            ================================================= */}

        <div className="home-hero__visual">
          <div className="land-visual">
            <div className="land-visual__top">
              <div className="land-visual__title">
                <Map size={14} />
                Spatial Intelligence View
              </div>

              <div className="land-visual__live">
                <span className="land-visual__live-dot" />
                Monitoring active
              </div>
            </div>

            <div className="land-visual__grid" />

            <div className="land-visual__terrain land-visual__terrain--one" />
            <div className="land-visual__terrain land-visual__terrain--two" />
            <div className="land-visual__terrain land-visual__terrain--three" />

            <div className="land-visual__river" />
            <div className="land-visual__road" />

            <div className="land-visual__parcels">
              <div className="land-parcel land-parcel--1" />
              <div className="land-parcel land-parcel--2" />
              <div className="land-parcel land-parcel--3" />
              <div className="land-parcel land-parcel--4" />
              <div className="land-parcel land-parcel--5" />
              <div className="land-parcel land-parcel--6" />
            </div>

            <div className="land-visual__marker land-visual__marker--one">
              <Map size={14} />
            </div>

            <div className="land-visual__marker land-visual__marker--two">
              <Landmark size={14} />
            </div>

            <div className="land-visual__stats">
              <div className="land-stat">
                <span>PARCELS MONITORED</span>
                <strong>12,480</strong>
              </div>

              <div className="land-stat">
                <span>ACTIVE PROJECTS</span>
                <strong>09</strong>
              </div>

              <div className="land-stat">
                <span>AI OBSERVATIONS</span>
                <strong>147</strong>
              </div>
            </div>

            <div className="land-visual__info">
              <div className="land-visual__info-icon">
                <Satellite size={15} />
              </div>

              <div>
                <strong>Satellite intelligence layer</strong>
                <span>Multi-temporal spatial observations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CAPABILITIES
          ===================================================== */}

      <section className="home-section home-section--soft" id="capabilities">
        <div className="home-section-heading">
          <div>
            <span className="home-eyebrow">CORE CAPABILITIES</span>

            <h2>
              From land records to
              <br />
              actionable intelligence.
            </h2>
          </div>

          <p>
            Bring fragmented land acquisition information together into one
            consistent operational system.
          </p>
        </div>

        <div className="home-capabilities">
          <article className="home-capability">
            <IconBadge tone="primary">
              <Landmark size={18} />
            </IconBadge>

            <h3>Land & Ownership Intelligence</h3>

            <p>
              Connect parcels with recorded ownership, rights, documents,
              disputes and verification status.
            </p>

            <span className="home-capability__number">01</span>
          </article>

          <article className="home-capability">
            <IconBadge tone="success">
              <Map size={18} />
            </IconBadge>

            <h3>Geospatial Intelligence</h3>

            <p>
              Visualize parcels, projects, boundaries, infrastructure and
              spatial relationships on a unified map.
            </p>

            <span className="home-capability__number">02</span>
          </article>

          <article className="home-capability">
            <IconBadge tone="warning">
              <Workflow size={18} />
            </IconBadge>

            <h3>Acquisition Workflow</h3>

            <p>
              Track every stage from project proposal and notification through
              award, compensation and possession.
            </p>

            <span className="home-capability__number">03</span>
          </article>

          <article className="home-capability">
            <IconBadge tone="primary">
              <Satellite size={18} />
            </IconBadge>

            <h3>Satellite Monitoring</h3>

            <p>
              Compare multi-temporal imagery to surface potential changes
              around projects and acquisition areas.
            </p>

            <span className="home-capability__number">04</span>
          </article>

          <article className="home-capability">
            <IconBadge tone="success">
              <BrainCircuit size={18} />
            </IconBadge>

            <h3>Explainable AI Alerts</h3>

            <p>
              Surface potential changes, prioritize attention and support
              human verification without replacing official decisions.
            </p>

            <span className="home-capability__number">05</span>
          </article>

          <article className="home-capability">
            <IconBadge tone="neutral">
              <FileSearch size={18} />
            </IconBadge>

            <h3>Audit & Documents</h3>

            <p>
              Maintain traceable records, documents, decisions and activity
              history across the acquisition lifecycle.
            </p>

            <span className="home-capability__number">06</span>
          </article>
        </div>
      </section>

      {/* =====================================================
          WORKFLOW
          ===================================================== */}

      <section className="home-section" id="workflow">
        <div className="home-workflow">
          <div className="home-workflow__intro">
            <span className="home-eyebrow">END-TO-END WORKFLOW</span>

            <h2>
              Follow the journey of land,
              <br />
              not just the paperwork.
            </h2>

            <p>
              The platform connects project planning, parcels, acquisition
              cases, compensation, rehabilitation, possession and spatial
              observations into a single traceable lifecycle.
            </p>
          </div>

          <div className="workflow-list">
            <div className="workflow-item">
              <div className="workflow-item__number">01</div>

              <div>
                <h3>Project & Land Requirement</h3>
                <p>
                  Define the project, required land and affected geographic
                  area.
                </p>
              </div>
            </div>

            <div className="workflow-item">
              <div className="workflow-item__number">02</div>

              <div>
                <h3>Parcel & Record Linking</h3>
                <p>
                  Connect affected parcels with available land records and
                  ownership information.
                </p>
              </div>
            </div>

            <div className="workflow-item">
              <div className="workflow-item__number">03</div>

              <div>
                <h3>Acquisition & Hearings</h3>
                <p>
                  Track notifications, objections, hearings, valuation and
                  statutory workflow stages.
                </p>
              </div>
            </div>

            <div className="workflow-item">
              <div className="workflow-item__number">04</div>

              <div>
                <h3>Award, Compensation & R&R</h3>
                <p>
                  Monitor awards, compensation, rehabilitation and
                  resettlement activities.
                </p>
              </div>
            </div>

            <div className="workflow-item">
              <div className="workflow-item__number">05</div>

              <div>
                <h3>Possession & Spatial Monitoring</h3>
                <p>
                  Combine field verification with satellite observations and
                  project-level monitoring.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          AI ACCOUNTABILITY
          ===================================================== */}

      <section className="home-section home-section--soft" id="ai">
        <div className="ai-panel">
          <div className="ai-panel__intro">
            <span className="home-eyebrow">RESPONSIBLE AI</span>

            <h2>
              AI assists.
              <br />
              Officers decide.
            </h2>

            <p>
              Artificial intelligence is used as a decision-support layer.
              Every important AI observation remains explainable, reviewable
              and subject to authorized human verification.
            </p>
          </div>

          <div className="ai-list">
            <div className="ai-list__item">
              <div className="ai-list__icon">
                <CheckCircle2 size={14} />
              </div>

              <div>
                <strong>Potential Change Detected</strong>
                <span>
                  Spatial change is surfaced as an observation, not a legal
                  conclusion.
                </span>
              </div>
            </div>

            <div className="ai-list__item">
              <div className="ai-list__icon">
                <CheckCircle2 size={14} />
              </div>

              <div>
                <strong>Confidence & Evidence</strong>
                <span>
                  Alerts can include confidence, imagery date and supporting
                  spatial evidence.
                </span>
              </div>
            </div>

            <div className="ai-list__item">
              <div className="ai-list__icon">
                <CheckCircle2 size={14} />
              </div>

              <div>
                <strong>Requires Field Verification</strong>
                <span>
                  Officers can validate observations before an official
                  decision is made.
                </span>
              </div>
            </div>

            <div className="ai-list__item">
              <div className="ai-list__icon">
                <CheckCircle2 size={14} />
              </div>

              <div>
                <strong>Full Auditability</strong>
                <span>
                  Model outputs, verification actions and officer decisions
                  remain traceable.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
          ===================================================== */}

      <section className="home-cta">
        <span className="home-eyebrow">BUILDING THE FUTURE OF LAND GOVERNANCE</span>

        <h2>
          One platform.
          <br />
          One connected land view.
        </h2>

        <p>
          A foundation for transparent, data-driven and accountable land
          acquisition management at national scale.
        </p>

        <div className="home-hero__actions" style={{ justifyContent: "center" }}>
          <a href="#capabilities" className="home-button home-button--primary">
            Explore capabilities
            <ArrowRight size={14} />
          </a>
        </div>
      </section>

      {/* =====================================================
          FOOTER
          ===================================================== */}

      <footer className="home-footer">
        <div className="home-footer__inner">
          <span className="home-footer__brand">
            National Land Acquisition & Management System
          </span>

          <span className="home-footer__text">
            Integrated land intelligence • Workflow • GIS • AI-assisted
            decision support
          </span>
        </div>
      </footer>
    </main>
  );
}

export default HomePage;