import { useState } from "react";
import {
  Activity,
  Building2,
  MapPin,
  Satellite,
  ShieldCheck,
  TreePine,
  X,
} from "lucide-react";

interface Parcel {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  status: "active" | "attention" | "verified";
  owner: string;
  area: string;
  project: string;
}

const parcels: Parcel[] = [
  {
    id: "P-1042",
    x: 118,
    y: 112,
    width: 74,
    height: 54,
    status: "verified",
    owner: "Recorded Owner",
    area: "2.84 ha",
    project: "Northern Corridor",
  },
  {
    id: "P-1043",
    x: 196,
    y: 106,
    width: 68,
    height: 60,
    status: "active",
    owner: "Recorded Owner",
    area: "3.17 ha",
    project: "Northern Corridor",
  },
  {
    id: "P-1044",
    x: 270,
    y: 118,
    width: 82,
    height: 48,
    status: "attention",
    owner: "Recorded Owner",
    area: "4.21 ha",
    project: "Northern Corridor",
  },
  {
    id: "P-2071",
    x: 150,
    y: 174,
    width: 92,
    height: 58,
    status: "active",
    owner: "Recorded Owner",
    area: "5.08 ha",
    project: "Regional Expressway",
  },
  {
    id: "P-2072",
    x: 246,
    y: 174,
    width: 72,
    height: 62,
    status: "verified",
    owner: "Recorded Owner",
    area: "3.92 ha",
    project: "Regional Expressway",
  },
  {
    id: "P-2073",
    x: 322,
    y: 174,
    width: 88,
    height: 58,
    status: "attention",
    owner: "Recorded Owner",
    area: "6.34 ha",
    project: "Regional Expressway",
  },
  {
    id: "P-3104",
    x: 112,
    y: 242,
    width: 78,
    height: 54,
    status: "verified",
    owner: "Recorded Owner",
    area: "2.43 ha",
    project: "Green Infrastructure",
  },
  {
    id: "P-3105",
    x: 194,
    y: 246,
    width: 104,
    height: 48,
    status: "active",
    owner: "Recorded Owner",
    area: "4.77 ha",
    project: "Green Infrastructure",
  },
  {
    id: "P-3106",
    x: 302,
    y: 244,
    width: 72,
    height: 54,
    status: "verified",
    owner: "Recorded Owner",
    area: "3.12 ha",
    project: "Green Infrastructure",
  },
];

const statusLabels = {
  active: "Under Acquisition",
  attention: "AI Attention",
  verified: "Field Verified",
};

function LandIntelligenceMap() {
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);

  return (
    <div className="land-map">
      <div className="land-map__toolbar">
        <div className="land-map__toolbar-left">
          <div className="land-map__live">
            <span className="land-map__live-dot" />
            Intelligence Layer
          </div>

          <span className="land-map__separator" />

          <span className="land-map__toolbar-label">
            National Land View
          </span>
        </div>

        <div className="land-map__toolbar-right">
          <div className="land-map__satellite">
            <Satellite size={14} />
            Satellite Analysis
          </div>
        </div>
      </div>

      <div className="land-map__viewport">
        <div className="land-map__terrain land-map__terrain--one" />
        <div className="land-map__terrain land-map__terrain--two" />
        <div className="land-map__terrain land-map__terrain--three" />

        <div className="land-map__grid" />

        <div className="land-map__scan" />

        <svg
          className="land-map__parcels"
          viewBox="0 0 520 340"
          role="img"
          aria-label="Interactive land parcel intelligence map"
        >
          <path
            className="land-map__river"
            d="M20 78 C100 115 110 48 185 91 S285 150 348 100 S430 54 500 91"
          />

          <path
            className="land-map__road"
            d="M32 302 C110 255 150 274 222 220 S350 154 482 42"
          />

          <path
            className="land-map__road land-map__road--secondary"
            d="M80 34 C145 105 215 105 276 140 S386 245 466 302"
          />

          {parcels.map((parcel) => (
            <g
              key={parcel.id}
              className={`land-map__parcel land-map__parcel--${parcel.status}`}
              onClick={() => setSelectedParcel(parcel)}
              tabIndex={0}
              role="button"
              aria-label={`View parcel ${parcel.id}`}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedParcel(parcel);
                }
              }}
            >
              <rect
                x={parcel.x}
                y={parcel.y}
                width={parcel.width}
                height={parcel.height}
                rx="4"
              />

              <text
                x={parcel.x + parcel.width / 2}
                y={parcel.y + parcel.height / 2 + 4}
                textAnchor="middle"
              >
                {parcel.id}
              </text>
            </g>
          ))}

          <g className="land-map__marker" transform="translate(380 120)">
            <circle r="15" />
            <MapPin size={17} x="-8.5" y="-8.5" />
          </g>

          <g className="land-map__marker land-map__marker--secondary" transform="translate(102 222)">
            <circle r="12" />
            <MapPin size={14} x="-7" y="-7" />
          </g>
        </svg>

        <div className="land-map__map-label land-map__map-label--north">
          NORTH ZONE
        </div>

        <div className="land-map__map-label land-map__map-label--project">
          <span />
          Infrastructure Project
        </div>

        <div className="land-map__map-label land-map__map-label--satellite">
          <Satellite size={13} />
          Recent imagery
        </div>

        <div className="land-map__legend">
          <span className="land-map__legend-title">Parcel status</span>

          <span>
            <i className="land-map__legend-dot land-map__legend-dot--verified" />
            Verified
          </span>

          <span>
            <i className="land-map__legend-dot land-map__legend-dot--active" />
            Acquisition
          </span>

          <span>
            <i className="land-map__legend-dot land-map__legend-dot--attention" />
            AI attention
          </span>
        </div>

        <div className="land-map__scale">
          <span />
          <small>2 km</small>
        </div>

        <div className="land-map__activity">
          <div className="land-map__activity-icon">
            <Activity size={15} />
          </div>

          <div>
            <strong>Spatial analysis active</strong>
            <span>Parcel intelligence updating</span>
          </div>
        </div>

        {selectedParcel ? (
          <aside className="land-map__detail">
            <button
              type="button"
              className="land-map__detail-close"
              onClick={() => setSelectedParcel(null)}
              aria-label="Close parcel details"
            >
              <X size={16} />
            </button>

            <div className="land-map__detail-kicker">
              PARCEL INTELLIGENCE
            </div>

            <div className="land-map__detail-title-row">
              <div>
                <h3>{selectedParcel.id}</h3>
                <span>{statusLabels[selectedParcel.status]}</span>
              </div>

              <div className="land-map__detail-icon">
                {selectedParcel.status === "verified" ? (
                  <ShieldCheck size={19} />
                ) : selectedParcel.status === "attention" ? (
                  <Activity size={19} />
                ) : (
                  <Building2 size={19} />
                )}
              </div>
            </div>

            <div className="land-map__detail-data">
              <div>
                <span>Area</span>
                <strong>{selectedParcel.area}</strong>
              </div>

              <div>
                <span>Record</span>
                <strong>{selectedParcel.owner}</strong>
              </div>

              <div>
                <span>Project</span>
                <strong>{selectedParcel.project}</strong>
              </div>
            </div>

            <div className="land-map__detail-note">
              <TreePine size={15} />
              <span>
                Spatial information shown for demonstration. Final decisions
                remain subject to authorized records and field verification.
              </span>
            </div>
          </aside>
        ) : null}
      </div>

      <div className="land-map__footer">
        <div>
          <strong>Click any parcel</strong>
          <span>to explore land intelligence</span>
        </div>

        <div className="land-map__footer-status">
          <span className="land-map__pulse" />
          Monitoring 09 active projects
        </div>
      </div>
    </div>
  );
}

export default LandIntelligenceMap;