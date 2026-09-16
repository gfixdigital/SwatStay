import { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  AlertTriangle,
  Banknote,
  Bell,
  Bus,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  Hotel,
  LifeBuoy,
  MapPin,
  Menu,
  MessageCircle,
  Mountain,
  PhoneCall,
  QrCode,
  Send,
  ShieldCheck,
  UserRound,
  Utensils,
  WalletCards,
  X,
} from "lucide-react";
import "./styles.css";

type View =
  | "overview"
  | "assignments"
  | "availability"
  | "scan"
  | "handoff"
  | "earnings"
  | "support"
  | "profile";
type Kind =
  | "Hotel"
  | "Transport"
  | "Tour guide"
  | "Restaurant"
  | "Photographer"
  | "Activity provider";
type Status =
  | "Awaiting response"
  | "Accepted"
  | "Completed"
  | "Declined"
  | "Issue reported";
type Provider = {
  id: string;
  name: string;
  owner: string;
  kind: Kind;
  location: string;
  capacity: string;
  resourceLabel: string;
  completionLabel: string;
  icon: typeof Hotel;
  profileNote: string;
};
type Assignment = {
  id: string;
  reference: string;
  providerId: string;
  date: string;
  time: string;
  travelers: number;
  service: string;
  resource: string;
  request: string;
  status: Status;
};

const providers: Provider[] = [
  {
    id: "hotel",
    name: "Pine View Hotel Kalam",
    owner: "Javed Khan",
    kind: "Hotel",
    location: "Kalam",
    capacity: "18 rooms",
    resourceLabel: "Room inventory",
    completionLabel: "Mark check-in handoff complete",
    icon: Hotel,
    profileNote: "Room type, meal needs, check-in and check-out only.",
  },
  {
    id: "transport",
    name: "Swat River Transport",
    owner: "Faisal Ahmad",
    kind: "Transport",
    location: "Mingora",
    capacity: "6 vehicles",
    resourceLabel: "Vehicle availability",
    completionLabel: "Mark transport handoff complete",
    icon: Bus,
    profileNote:
      "Pickup point, route, time, party size, and luggage note only.",
  },
  {
    id: "guide",
    name: "Ushu Valley Hiking Support",
    owner: "Naveed Khan",
    kind: "Tour guide",
    location: "Kalam",
    capacity: "6 guests per guide",
    resourceLabel: "Guide slots",
    completionLabel: "Mark guided activity complete",
    icon: Mountain,
    profileNote:
      "Meeting point, activity route, party size, and safety-relevant request only.",
  },
  {
    id: "restaurant",
    name: "Kalam Family Kitchen",
    owner: "Noman Ali",
    kind: "Restaurant",
    location: "Kalam",
    capacity: "45 seats",
    resourceLabel: "Table availability",
    completionLabel: "Mark meal service complete",
    icon: Utensils,
    profileNote:
      "Meal timing, party size, dietary requirement, and booking reference only.",
  },
  {
    id: "photographer",
    name: "Swat Frame Studio",
    owner: "Sana Noor",
    kind: "Photographer",
    location: "Malam Jabba",
    capacity: "2 sessions per day",
    resourceLabel: "Session slots",
    completionLabel: "Mark photo session complete",
    icon: Camera,
    profileNote:
      "Meeting point, session time, party size, and chosen package only.",
  },
  {
    id: "activity",
    name: "Malam Jabba Activity Desk",
    owner: "Adeel Khan",
    kind: "Activity provider",
    location: "Malam Jabba",
    capacity: "8 guests per slot",
    resourceLabel: "Activity slots",
    completionLabel: "Mark activity handoff complete",
    icon: Activity,
    profileNote:
      "Activity time, safety constraints, party size, and assigned add-on only.",
  },
];

const seedAssignments: Assignment[] = [
  {
    id: "hotel-2048",
    providerId: "hotel",
    reference: "SS-2048",
    date: "12 Oct 2026",
    time: "14:00",
    travelers: 2,
    service: "Double room and vegetarian dinner",
    resource: "1 double room",
    request:
      "Quiet room where available. Confirm vegetarian dinner before arrival.",
    status: "Awaiting response",
  },
  {
    id: "hotel-2042",
    providerId: "hotel",
    reference: "SS-2042",
    date: "10 Oct 2026",
    time: "14:00",
    travelers: 2,
    service: "Double room stay",
    resource: "1 double room",
    request: "Early arrival requested if the room is ready.",
    status: "Accepted",
  },
  {
    id: "transport-2048",
    providerId: "transport",
    reference: "SS-2048",
    date: "12 Oct 2026",
    time: "08:00",
    travelers: 2,
    service: "Mingora to Kalam private transfer",
    resource: "1 SUV with driver",
    request: "No late-night road travel. Confirm pickup at Mingora.",
    status: "Awaiting response",
  },
  {
    id: "guide-2048",
    providerId: "guide",
    reference: "SS-2048",
    date: "13 Oct 2026",
    time: "09:30",
    travelers: 2,
    service: "Ushu Forest guided walk",
    resource: "1 local guide",
    request: "Moderate walking pace. Keep route conditions in mind.",
    status: "Accepted",
  },
  {
    id: "restaurant-2055",
    providerId: "restaurant",
    reference: "SS-2055",
    date: "25 Oct 2026",
    time: "19:00",
    travelers: 4,
    service: "Family dinner reservation",
    resource: "Table for 4",
    request: "Vegetarian option for one traveler.",
    status: "Awaiting response",
  },
  {
    id: "photographer-2053",
    providerId: "photographer",
    reference: "SS-2053",
    date: "20 Oct 2026",
    time: "15:30",
    travelers: 3,
    service: "Malam Jabba family photo session",
    resource: "60 minute session",
    request: "Confirm weather-safe meeting point before the session.",
    status: "Awaiting response",
  },
  {
    id: "activity-2053",
    providerId: "activity",
    reference: "SS-2053",
    date: "21 Oct 2026",
    time: "10:00",
    travelers: 3,
    service: "Malam Jabba activity slot",
    resource: "3 activity passes",
    request: "Weather dependent. GFix must call before any change.",
    status: "Awaiting response",
  },
];

const views: { id: View; label: string; icon: typeof ClipboardCheck }[] = [
  { id: "overview", label: "Overview", icon: ClipboardCheck },
  { id: "assignments", label: "Assigned services", icon: CalendarDays },
  { id: "availability", label: "Availability", icon: Clock3 },
  { id: "scan", label: "Scan or enter code", icon: QrCode },
  { id: "earnings", label: "Earnings and payouts", icon: WalletCards },
  { id: "support", label: "GFix support", icon: LifeBuoy },
  { id: "profile", label: "Profile and documents", icon: UserRound },
];

function playProviderTone() {
  const AudioContextClass =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.frequency.setValueAtTime(820, context.currentTime);
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.07, context.currentTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.2);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.22);
  oscillator.addEventListener("ended", () => void context.close());
}

function App() {
  const [view, setView] = useState<View>("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [providerId, setProviderId] = useState("hotel");
  const [assignments, setAssignments] = useState(seedAssignments);
  const [activeHandoffId, setActiveHandoffId] = useState<string | null>(null);
  const [availability, setAvailability] = useState<Record<string, string>>({
    "12 Oct": "Limited",
    "13 Oct": "Available",
    "14 Oct": "Available",
    "20 Oct": "Limited",
    "21 Oct": "Available",
    "25 Oct": "Limited",
  });
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      author: "GFix Operations",
      text: "Please confirm the assigned service or tell us about an operational issue.",
      time: "Today, 11:10 AM",
    },
  ]);
  const provider = providers.find((item) => item.id === providerId)!;
  const assigned = assignments.filter((item) => item.providerId === providerId);
  const waiting = assigned.filter(
    (item) => item.status === "Awaiting response",
  ).length;
  const accepted = assigned.filter((item) => item.status === "Accepted").length;
  const open = (next: View) => {
    setView(next);
    setMenuOpen(false);
  };
  const update = (id: string, status: Status) =>
    setAssignments((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  const send = () => {
    if (!message.trim()) return;
    setMessages((current) => [
      ...current,
      { author: provider.name, text: message.trim(), time: "Just now" },
    ]);
    setMessage("");
  };
  const handoff =
    assigned.find((item) => item.id === activeHandoffId) ??
    assigned.find((item) => item.status === "Accepted") ??
    assigned[0];
  const openHandoff = (id: string) => {
    setActiveHandoffId(id);
    open("handoff");
  };
  return (
    <div className="provider-app">
      <div
        className={`mobile-shade ${menuOpen ? "show" : ""}`}
        onClick={() => setMenuOpen(false)}
      />
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="brand">
          <span className="brand-mark">
            <Hotel size={18} />
          </span>
          <div>
            <strong>
              Swat<span>Stay</span>
            </strong>
            <small>PROVIDER PORTAL</small>
          </div>
          <button className="mobile-close" onClick={() => setMenuOpen(false)}>
            <X size={18} />
          </button>
        </div>
        <div className="provider-card">
          <span className="avatar">
            {provider.name.slice(0, 2).toUpperCase()}
          </span>
          <div>
            <strong>{provider.name}</strong>
            <small>
              {provider.kind} · {provider.location}
            </small>
          </div>
          <span className="approved">
            <ShieldCheck size={13} /> Approved
          </span>
        </div>
        <nav>
          {views.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={view === item.id ? "active" : ""}
                onClick={() => open(item.id)}
              >
                <Icon size={17} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-foot">
          <ShieldCheck size={14} /> Frontend-only preview
          <p>
            No real guest contact, payment proof, scan, or admin synchronization
            yet.
          </p>
        </div>
      </aside>
      <main>
        <header className="topbar">
          <button className="menu-button" onClick={() => setMenuOpen(true)}>
            <Menu size={20} />
          </button>
          <div>
            <p className="eyebrow">PROVIDER OPERATIONS</p>
            <h1>{title(view)}</h1>
          </div>
          <div className="top-actions">
            <label className="profile-switch">
              Preview provider
              <select
                value={providerId}
                onChange={(event) => setProviderId(event.target.value)}
              >
                {providers.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.kind}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="outline-button"
              onClick={playProviderTone}
              title="Test the browser tone used for a future new assignment"
            >
              <Bell size={15} /> Test alert
            </button>
            <button className="outline-button" onClick={() => open("support")}>
              <LifeBuoy size={15} /> GFix support
            </button>
          </div>
        </header>
        <section className="notice">
          <AlertTriangle size={17} />
          <p>
            <strong>Demo profile switch:</strong> reviewers can preview each
            provider type. In the real system, a provider login will show only
            its own business and assigned services.
          </p>
        </section>
        {view === "overview" && (
          <Overview
            provider={provider}
            assigned={assigned}
            waiting={waiting}
            accepted={accepted}
            onOpen={() => open("assignments")}
          />
        )}{" "}
        {view === "assignments" && (
          <Assignments
            provider={provider}
            assignments={assigned}
            onUpdate={update}
            onOpenScan={(id) => {
              setActiveHandoffId(id);
              open("scan");
            }}
          />
        )}{" "}
        {view === "availability" && (
          <Availability
            provider={provider}
            availability={availability}
            onChange={(date, value) =>
              setAvailability((current) => ({ ...current, [date]: value }))
            }
          />
        )}{" "}
        {view === "scan" && (
          <Voucher
            provider={provider}
            assignments={assigned}
            onVerified={openHandoff}
          />
        )}{" "}
        {view === "handoff" && (
          <Handoff
            provider={provider}
            service={handoff}
            onComplete={(id) => update(id, "Completed")}
            onIssue={(id) => update(id, "Issue reported")}
            onBack={() => open("scan")}
          />
        )}{" "}
        {view === "earnings" && (
          <Earnings provider={provider} assignments={assigned} />
        )}{" "}
        {view === "support" && (
          <Support
            provider={provider}
            messages={messages}
            message={message}
            onMessage={setMessage}
            onSend={send}
          />
        )}{" "}
        {view === "profile" && <Profile provider={provider} />}
      </main>
    </div>
  );
}

function Overview({
  provider,
  assigned,
  waiting,
  accepted,
  onOpen,
}: {
  provider: Provider;
  assigned: Assignment[];
  waiting: number;
  accepted: number;
  onOpen: () => void;
}) {
  const Icon = provider.icon;
  const next =
    assigned.find((item) => item.status === "Awaiting response") ?? assigned[0];
  return (
    <div className="page">
      <section className="intro">
        <div>
          <p className="eyebrow">{provider.kind.toUpperCase()} OPERATIONS</p>
          <h2>Clear handoffs for every assigned service.</h2>
          <p>
            {provider.profileNote} Review the service queue and respond only
            when you can meet the request.
          </p>
        </div>
        <button className="primary-button" onClick={onOpen}>
          Start with assignments <ChevronRight size={16} />
        </button>
      </section>
      <section className="panel workflow-card">
        <div className="panel-head">
          <div>
            <p className="eyebrow">HOW THIS PORTAL WORKS</p>
            <h3>Follow these steps in order</h3>
          </div>
          <span className="preview-label">Workflow preview</span>
        </div>
        <div className="provider-flow">
          <span>
            <b>1</b>Update availability
          </span>
          <span>
            <b>2</b>Receive assignment
          </span>
          <span>
            <b>3</b>Accept or decline
          </span>
          <span>
            <b>4</b>Scan or enter code
          </span>
          <span>
            <b>5</b>Confirm outcome or report issue
          </span>
          <span>
            <b>6</b>GFix confirms settlement
          </span>
        </div>
        <p className="muted">
          You cannot complete an accepted service from the assignment list.
          Completion only happens after the code validation screen and actual
          service confirmation.
        </p>
      </section>
      <div className="stats">
        <Stat
          icon={<Clock3 />}
          label="Awaiting response"
          value={String(waiting)}
          note="Needs provider decision"
        />
        <Stat
          icon={<CheckCircle2 />}
          label="Accepted services"
          value={String(accepted)}
          note="Ready for service"
        />
        <Stat
          icon={<WalletCards />}
          label="Settlement"
          value="Pending"
          note="Final amount set by GFix Finance"
        />
      </div>
      {next ? (
        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">NEXT ASSIGNED SERVICE</p>
              <h3>
                {next.reference} · {next.service}
              </h3>
            </div>
            <Status status={next.status} />
          </div>
          <div className="service-summary">
            <span>
              <CalendarDays size={16} />
              {next.date} · {next.time}
            </span>
            <span>
              <UserRound size={16} />
              {next.travelers} travelers
            </span>
            <span>
              <Icon size={16} />
              {next.resource}
            </span>
            <span>
              <MapPin size={16} />
              {provider.location}
            </span>
          </div>
          <div className="request-note">
            <strong>Relevant traveler request</strong>
            <p>{next.request}</p>
          </div>
        </section>
      ) : (
        <section className="panel empty">
          No assigned services for this provider profile.
        </section>
      )}
      <section className="panel compact">
        <div className="panel-head">
          <div>
            <p className="eyebrow">PROVIDER PRIVACY</p>
            <h3>Service-scoped information only</h3>
          </div>
          <ShieldCheck className="river" size={20} />
        </div>
        <div className="privacy-grid">
          <span>Assigned schedule and location</span>
          <span>Party size and resource need</span>
          <span>Relevant service request</span>
          <span>GFix coordination context</span>
        </div>
        <p className="muted">
          CNIC, passport, payment proof, unrelated services, and internal admin
          notes stay hidden.
        </p>
      </section>
    </div>
  );
}

function Assignments({
  provider,
  assignments,
  onUpdate,
  onOpenScan,
}: {
  provider: Provider;
  assignments: Assignment[];
  onUpdate: (id: string, status: Status) => void;
  onOpenScan: (id: string) => void;
}) {
  const [selectedId, setSelectedId] = useState(assignments[0]?.id ?? "");
  const selected =
    assignments.find((item) => item.id === selectedId) ?? assignments[0];
  return (
    <div className="page">
      <section className="section-heading">
        <div>
          <p className="eyebrow">ASSIGNED SERVICES</p>
          <h2>{provider.kind} service queue</h2>
          <p>
            First accept the assignment. Service completion is available only
            after QR or code validation.
          </p>
        </div>
      </section>
      {assignments.length ? (
        <div className="assignment-layout">
          <section className="assignment-list">
            {assignments.map((item) => (
              <button
                key={item.id}
                className={
                  item.id === selected?.id ? "assignment active" : "assignment"
                }
                onClick={() => setSelectedId(item.id)}
              >
                <div>
                  <strong>{item.reference}</strong>
                  <span>{item.service}</span>
                  <small>
                    {item.date} · {item.time} · {item.travelers} travelers
                  </small>
                </div>
                <Status status={item.status} />
              </button>
            ))}
          </section>
          {selected && (
            <section className="panel assignment-detail">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">{selected.reference}</p>
                  <h3>{selected.service}</h3>
                </div>
                <Status status={selected.status} />
              </div>
              <dl className="detail-grid">
                <Detail
                  label="Service date"
                  value={`${selected.date} · ${selected.time}`}
                />
                <Detail label="Travelers" value={`${selected.travelers}`} />
                <Detail
                  label={provider.resourceLabel}
                  value={selected.resource}
                />
                <Detail label="Service location" value={provider.location} />
              </dl>
              <div className="request-note">
                <strong>Relevant request</strong>
                <p>{selected.request}</p>
              </div>
              {selected.status === "Awaiting response" && (
                <div className="action-row">
                  <button
                    className="primary-button"
                    onClick={() => onUpdate(selected.id, "Accepted")}
                  >
                    <CheckCircle2 size={16} /> Accept service
                  </button>
                  <button
                    className="danger-button"
                    onClick={() => onUpdate(selected.id, "Declined")}
                  >
                    <X size={16} /> Decline
                  </button>
                </div>
              )}
              {selected.status === "Accepted" && (
                <div>
                  <button
                    className="primary-button"
                    onClick={() => onOpenScan(selected.id)}
                  >
                    <QrCode size={16} /> Scan or enter code to complete
                  </button>
                  <p className="muted">
                    A valid service code is required before the completion
                    screen opens.
                  </p>
                </div>
              )}
              {selected.status === "Completed" && (
                <p className="success-note">
                  <CheckCircle2 size={16} /> Service completion stored in this
                  browser preview.
                </p>
              )}
              {selected.status === "Declined" && (
                <p className="warning-note">
                  <AlertTriangle size={16} /> Declined in this preview. Future
                  flow requires a reason and returns the service to GFix
                  Operations.
                </p>
              )}
              {selected.status === "Issue reported" && (
                <p className="warning-note">
                  <AlertTriangle size={16} /> Issue reported. GFix Operations
                  must review, reschedule, replace, or cancel this service.
                </p>
              )}
            </section>
          )}
        </div>
      ) : (
        <section className="panel empty">
          No assignment is available for this provider profile.
        </section>
      )}
    </div>
  );
}

function Availability({
  provider,
  availability,
  onChange,
}: {
  provider: Provider;
  availability: Record<string, string>;
  onChange: (date: string, value: string) => void;
}) {
  const dates = [
    "12 Oct",
    "13 Oct",
    "14 Oct",
    "20 Oct",
    "21 Oct",
    "25 Oct",
    "26 Oct",
    "27 Oct",
  ];
  return (
    <div className="page">
      <section className="section-heading">
        <div>
          <p className="eyebrow">AVAILABILITY</p>
          <h2>{provider.resourceLabel}</h2>
          <p>
            Set a simple availability state for matching. The future API will
            sync this to Admin provider suggestions.
          </p>
        </div>
      </section>
      <section className="panel">
        <div className="availability-head">
          <div>
            <h3>October 2026</h3>
            <p className="muted">
              {provider.kind} capacity: {provider.capacity}
            </p>
          </div>
          <span className="preview-label">Frontend preview</span>
        </div>
        <div className="availability-grid">
          {dates.map((date) => (
            <label
              key={date}
              className={`day ${(availability[date] ?? "Available").toLowerCase()}`}
            >
              <span>{date}</span>
              <select
                value={availability[date] ?? "Available"}
                onChange={(event) => onChange(date, event.target.value)}
              >
                <option>Available</option>
                <option>Limited</option>
                <option>Blocked</option>
              </select>
            </label>
          ))}
        </div>
      </section>
      <section className="panel compact">
        <h3>Future matching flow</h3>
        <ol className="workflow-list">
          <li>
            The provider updates room, vehicle, guide, table, session, or
            activity-slot availability.
          </li>
          <li>
            Admin compares this availability while selecting providers for a
            confirmed booking.
          </li>
          <li>
            The provider receives a service assignment and confirms or declines
            it.
          </li>
        </ol>
      </section>
    </div>
  );
}

function Voucher({
  provider,
  assignments,
  onVerified,
}: {
  provider: Provider;
  assignments: Assignment[];
  onVerified: (id: string) => void;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const verify = (candidate = code) => {
    const service = assignments.find(
      (item) =>
        candidate.toUpperCase().includes(item.reference.replace("SS-", "")) &&
        item.status === "Accepted",
    );
    if (!service) {
      setError(
        "No accepted service matches this preview code. Use an accepted assignment or select the demo scan result.",
      );
      return;
    }
    setError("");
    onVerified(service.id);
  };
  const accepted = assignments.find((item) => item.status === "Accepted");
  return (
    <div className="page">
      <section className="section-heading">
        <div>
          <p className="eyebrow">SERVICE CHECK-IN</p>
          <h2>Scan QR or enter service code</h2>
          <p>
            Validate a traveler’s assigned service before opening its private
            handoff details. This is a browser-only preview, not a working
            camera scanner.
          </p>
        </div>
      </section>
      <section className="panel scan-panel">
        <QrCode className="river" size={30} />
        <h3>Verify before providing service</h3>
        <p>
          Use the traveler QR with the future camera scanner, or enter the
          voucher code shown by the traveler.
        </p>
        <div className="voucher-entry">
          <label>
            Voucher code
            <input
              value={code}
              onChange={(event) => {
                setCode(event.target.value);
                setError("");
              }}
              placeholder="Example: SV-2042-HOTEL"
            />
          </label>
          <button className="primary-button" onClick={() => verify()}>
            <CheckCircle2 size={16} /> Validate code
          </button>
        </div>
        <div className="scan-actions">
          <button
            className="outline-button"
            onClick={() =>
              accepted &&
              verify(
                `SV-${accepted.reference.replace("SS-", "")}-${provider.kind.replaceAll(" ", "").toUpperCase()}`,
              )
            }
          >
            <Camera size={15} /> Scan QR code
          </button>
          <button
            className="text-button"
            onClick={() =>
              accepted &&
              verify(
                `SV-${accepted.reference.replace("SS-", "")}-${provider.kind.replaceAll(" ", "").toUpperCase()}`,
              )
            }
          >
            Use prototype scan result
          </button>
        </div>
        {error && (
          <p className="warning-note">
            <AlertTriangle size={16} />
            {error}
          </p>
        )}
        <p className="muted">
          Production validation checks the signed code, service assignment,
          provider account, time window, expiry, cancellation, and previous
          completion.
        </p>
      </section>
    </div>
  );
}

function Handoff({
  provider,
  service,
  onComplete,
  onIssue,
  onBack,
}: {
  provider: Provider;
  service?: Assignment;
  onComplete: (id: string) => void;
  onIssue: (id: string) => void;
  onBack: () => void;
}) {
  const [delivered, setDelivered] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [issue, setIssue] = useState(false);
  if (!service)
    return (
      <div className="page">
        <section className="panel empty">
          No matching service handoff was found. Return to code verification and
          try again.
        </section>
      </div>
    );
  const actualOutcome =
    provider.kind === "Restaurant"
      ? "Meal was served"
      : provider.kind === "Hotel"
        ? "Guest completed check-in"
        : provider.kind === "Transport"
          ? "Pickup or drop-off was completed"
          : provider.kind === "Tour guide"
            ? "Guided route was completed"
            : provider.kind === "Photographer"
              ? "Photo session was completed"
              : "Activity handoff was completed";
  const finalState =
    service.status === "Completed" || service.status === "Issue reported";
  return (
    <div className="page">
      <section className="section-heading">
        <div>
          <p className="eyebrow">VALIDATED SERVICE HANDOFF</p>
          <h2>
            {service.reference} · {service.service}
          </h2>
          <p>
            Only this provider’s relevant service details are visible. Confirm
            the real outcome below.
          </p>
        </div>
        <button className="outline-button" onClick={onBack}>
          Verify another code
        </button>
      </section>
      <section className="panel">
        <div className="success-note">
          <CheckCircle2 size={16} /> Valid for {provider.name}. The voucher is
          assigned to this service.
        </div>
        <dl className="detail-grid">
          <Detail
            label="Scheduled time"
            value={`${service.date} · ${service.time}`}
          />
          <Detail label="Travelers" value={String(service.travelers)} />
          <Detail label={provider.resourceLabel} value={service.resource} />
          <Detail label="Location" value={provider.location} />
        </dl>
        <div className="request-note">
          <strong>Relevant service note</strong>
          <p>{service.request}</p>
        </div>
        {service.status === "Completed" && (
          <div className="success-note">
            <CheckCircle2 size={16} /> Service marked complete in this frontend
            preview. GFix Finance can now review settlement.
          </div>
        )}
        {service.status === "Issue reported" && (
          <div className="warning-note">
            <AlertTriangle size={16} /> Issue reported to GFix review. This
            service is not complete. GFix can reschedule, replace the provider,
            or cancel it.
          </div>
        )}
        {!finalState && (
          <div className="completion-check">
            <p className="eyebrow">SERVICE OUTCOME</p>
            <label>
              <input
                type="checkbox"
                checked={delivered}
                onChange={(event) => setDelivered(event.target.checked)}
              />{" "}
              {actualOutcome}
            </label>
            <label>
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(event) => setAcknowledged(event.target.checked)}
              />{" "}
              Guest confirmed completion, when available
            </label>
            <div className="action-row">
              <button
                className="primary-button"
                disabled={!delivered}
                onClick={() => onComplete(service.id)}
              >
                <CheckCircle2 size={16} />
                {provider.completionLabel}
              </button>
              <button className="outline-button" onClick={() => setIssue(true)}>
                <AlertTriangle size={15} /> Report an issue
              </button>
            </div>
            {issue && (
              <div className="warning-note">
                <AlertTriangle size={16} />
                <span>
                  <strong>Issue report preview</strong>
                  <br />
                  This service will be sent to GFix review, not marked complete.
                  The future form records issue type, note, evidence, and
                  preferred callback contact.
                  <br />
                  <button
                    className="text-button"
                    onClick={() => onIssue(service.id)}
                  >
                    Send issue to GFix review
                  </button>
                </span>
              </div>
            )}{" "}
            {!delivered && (
              <p className="muted">
                Completion remains locked until the provider confirms the actual
                service outcome.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function Earnings({
  provider,
  assignments,
}: {
  provider: Provider;
  assignments: Assignment[];
}) {
  return (
    <div className="page">
      <section className="section-heading">
        <div>
          <p className="eyebrow">EARNINGS AND PAYOUTS</p>
          <h2>Settlement status</h2>
          <p>
            GFix Finance confirms final service amount, commission, payout
            status, and transfer reference after the approved service rate is
            connected.
          </p>
        </div>
      </section>
      <div className="stats">
        <Stat
          icon={<Banknote />}
          label="Service rates"
          value="Pending"
          note="Set in the confirmed provider agreement"
        />
        <Stat
          icon={<WalletCards />}
          label="Commission"
          value="Pending"
          note="Calculated from the approved rate"
        />
        <Stat
          icon={<CheckCircle2 />}
          label="Payout"
          value="Not released"
          note="Released after finance review"
        />
      </div>
      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">SERVICE SETTLEMENTS</p>
            <h3>{provider.name}</h3>
          </div>
          <span className="preview-label">Frontend preview</span>
        </div>
        {assignments.map((item) => (
          <div key={item.id} className="finance-row">
            <div>
              <strong>
                {item.reference} · {item.service}
              </strong>
              <span>
                Final rate, commission, and transfer reference are pending
                backend finance approval.
              </span>
            </div>
            <span>Not calculated</span>
            <Status
              status={
                item.status === "Completed" ? "Completed" : "Awaiting response"
              }
            />
          </div>
        ))}
        <p className="muted">
          Future finance records include tax rules, payout method, settlement
          conditions, transfer reference, and dispute handling.
        </p>
      </section>
    </div>
  );
}

function Support({
  provider,
  messages,
  message,
  onMessage,
  onSend,
}: {
  provider: Provider;
  messages: { author: string; text: string; time: string }[];
  message: string;
  onMessage: (value: string) => void;
  onSend: () => void;
}) {
  return (
    <div className="page">
      <section className="section-heading">
        <div>
          <p className="eyebrow">GFIX SUPPORT</p>
          <h2>Provider coordination</h2>
          <p>
            Report availability, assignment, guest-service, route, payout, or
            operational issues to GFix.
          </p>
        </div>
      </section>
      <div className="support-layout">
        <section className="panel support-context">
          <h3>Help options</h3>
          <div className="context-item">
            <strong>Provider type</strong>
            <span>{provider.kind}</span>
            <small>{provider.name}</small>
          </div>
          <a className="outline-button" href="tel:+92946000000">
            <PhoneCall size={15} /> Call GFix desk
          </a>
          <a className="outline-button" href="https://wa.me/92946000000">
            <MessageCircle size={15} /> WhatsApp GFix
          </a>
        </section>
        <section className="panel conversation">
          <div className="panel-head">
            <div>
              <p className="eyebrow">OPERATIONS THREAD</p>
              <h3>{provider.kind} coordination</h3>
            </div>
            <span className="preview-label">Preview</span>
          </div>
          <div className="messages">
            {messages.map((item, index) => (
              <article
                key={`${item.time}-${index}`}
                className={
                  item.author === provider.name ? "from-provider" : "from-gfix"
                }
              >
                <strong>{item.author}</strong>
                <p>{item.text}</p>
                <small>{item.time}</small>
              </article>
            ))}
          </div>
          <div className="message-box">
            <input
              value={message}
              onChange={(event) => onMessage(event.target.value)}
              placeholder="Write to GFix Operations"
            />
            <button onClick={onSend}>
              <Send size={16} /> Send
            </button>
          </div>
          <p className="muted">
            Frontend preview only. A real API is required to route this message
            into the admin support workspace.
          </p>
        </section>
      </div>
    </div>
  );
}

function Profile({ provider }: { provider: Provider }) {
  const Icon = provider.icon;
  return (
    <div className="page">
      <section className="section-heading">
        <div>
          <p className="eyebrow">PROFILE AND DOCUMENTS</p>
          <h2>{provider.name}</h2>
          <p>
            Provider fields adapt to the service type so GFix can verify the
            business and plan provider matching.
          </p>
        </div>
      </section>
      <div className="two-column">
        <section className="panel">
          <h3>Business details</h3>
          <dl className="detail-grid">
            <Detail label="Provider category" value={provider.kind} />
            <Detail label="Location" value={provider.location} />
            <Detail label="Owner" value={provider.owner} />
            <Detail label="Capacity" value={provider.capacity} />
            <Detail label="Service setup" value={provider.resourceLabel} />
            <Detail label="Status" value="Approved preview" />
          </dl>
        </section>
        <section className="panel">
          <h3>Compliance checklist</h3>
          <div className="document-row">
            <Icon size={18} />
            <span>
              <strong>Business registration</strong>
              <small>Complete</small>
            </span>
            <Status status="Completed" />
          </div>
          <div className="document-row">
            <FileCheck2 />
            <span>
              <strong>{provider.kind} evidence and photos</strong>
              <small>Needs admin review</small>
            </span>
            <Status status="Awaiting response" />
          </div>
          <div className="document-row">
            <WalletCards size={18} />
            <span>
              <strong>Settlement details</strong>
              <small>Bank or wallet placeholder</small>
            </span>
            <Status status="Accepted" />
          </div>
          <p className="muted">
            Future uploads keep provider documents private. Travelers never see
            provider settlement details or compliance records.
          </p>
        </section>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <article className="stat">
      <span>{icon}</span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
        <p>{note}</p>
      </div>
    </article>
  );
}
function Status({ status }: { status: Status }) {
  return (
    <span
      className={`status ${status === "Accepted" || status === "Completed" ? "good" : status === "Declined" || status === "Issue reported" ? "bad" : "wait"}`}
    >
      {status}
    </span>
  );
}
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
function title(view: View) {
  return {
    overview: "Provider overview",
    assignments: "Assigned services",
    availability: "Availability",
    scan: "Scan or enter code",
    handoff: "Validated service handoff",
    earnings: "Earnings and payouts",
    support: "GFix support",
    profile: "Profile and documents",
  }[view];
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
