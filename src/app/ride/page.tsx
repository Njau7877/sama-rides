import RideClient from "./ride-client";

export default function RidePage() {
  return <main className="ride-shell">
    <header className="ride-header"><a href="/" className="ride-brand"><span>S</span> SAMA RIDES</a><a href="/">Back to home ↗</a></header>
    <RideClient />
  </main>;
}
