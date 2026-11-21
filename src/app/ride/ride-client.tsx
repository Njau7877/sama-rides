"use client";

import { FormEvent, useEffect, useState } from "react";

type User = { id: string; fullName: string; phone: string; role: string };
type Ride = { id: string; pickupAddress: string; destinationAddress: string; fareKes: number; status: string; createdAt: string };

async function api(path: string, method = "GET", body?: unknown) {
  const response = await fetch(path, { method, headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Something went wrong. Please try again.");
  return payload.data;
}

export default function RideClient() {
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<"login" | "register">("register");
  const [rides, setRides] = useState<Ride[]>([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", password: "" });
  const [trip, setTrip] = useState({ pickupAddress: "", destinationAddress: "", pickupLat: "-1.2864", pickupLng: "36.8172", destinationLat: "-1.2921", destinationLng: "36.8219", distanceKm: "5", estimatedMinutes: "18", vehicleType: "ECONOMY" });

  async function refresh() {
    try {
      const me = await api("/api/auth/me");
      setUser(me);
      const list = await api("/api/rides");
      setRides(list);
    } catch { setUser(null); setRides([]); }
  }
  useEffect(() => { void refresh(); }, []);

  async function authenticate(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      const path = mode === "register" ? "/api/auth/register" : "/api/auth/login";
      const body = mode === "register" ? form : { phone: form.phone, password: form.password };
      const result = await api(path, "POST", body);
      setUser(result); setNotice("You're signed in. You can now request a ride.");
      setRides(await api("/api/rides"));
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to sign in."); }
    finally { setBusy(false); }
  }

  async function requestRide(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      const payload = { ...trip, pickupLat: Number(trip.pickupLat), pickupLng: Number(trip.pickupLng), destinationLat: Number(trip.destinationLat), destinationLng: Number(trip.destinationLng), distanceKm: Number(trip.distanceKm), estimatedMinutes: Number(trip.estimatedMinutes) };
      const ride = await api("/api/rides", "POST", payload);
      setNotice("Ride request created. Dispatch will assign a verified available driver when operations matches it.");
      setRides([ride, ...rides]);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to request your ride."); }
    finally { setBusy(false); }
  }

  async function signOut() { await api("/api/auth/logout", "POST"); setUser(null); setRides([]); setNotice("You have signed out."); }
  async function cancelRide(id: string) {
    setBusy(true); setError(""); setNotice("");
    try { await api("/api/rides/" + id, "PATCH", { status: "CANCELLED" }); setNotice("Ride cancelled."); await refresh(); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to cancel ride."); }
    finally { setBusy(false); }
  }

  if (!user) return <section className="auth-panel">
    <div className="portal-intro"><p className="portal-kicker">SAMA RIDES · PASSENGER</p><h1>Good journeys<br/><em>start here.</em></h1><p>Sign in or create your account to request and manage rides.</p><div className="portal-perks"><span>✓ Simple ride requests</span><span>✓ Clear trip records</span><span>✓ Kenya-first mobility</span></div></div>
    <form className="auth-card" onSubmit={authenticate}><div className="switcher"><button type="button" className={mode === "register" ? "selected" : ""} onClick={() => setMode("register")}>Create account</button><button type="button" className={mode === "login" ? "selected" : ""} onClick={() => setMode("login")}>Sign in</button></div><h2>{mode === "register" ? "Join Sama" : "Welcome back"}</h2><p className="form-hint">Use your mobile number to continue.</p>
      {mode === "register" && <><label>Full name<input required minLength={2} maxLength={80} value={form.fullName} onChange={e => setForm({...form, fullName:e.target.value})} placeholder="Your full name"/></label><label>Email <span>(optional)</span><input type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} placeholder="you@example.com"/></label></>}
      <label>Phone number<input required value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} placeholder="+254 7xx xxx xxx"/></label><label>Password<input required type="password" minLength={mode === "register" ? 10 : 1} value={form.password} onChange={e => setForm({...form,password:e.target.value})} placeholder={mode === "register" ? "At least 10 characters" : "Your password"}/></label>
      {error && <p className="alert error">{error}</p>}{notice && <p className="alert success">{notice}</p>}<button className="submit" disabled={busy}>{busy ? "Please wait…" : mode === "register" ? "Create my account →" : "Sign in →"}</button><small className="fineprint">By continuing, you agree to use Sama Rides responsibly and provide accurate trip information.</small>
    </form>
  </section>;

  if (user.role !== "PASSENGER") return <section className="dashboard"><div className="dash-top"><div><p className="portal-kicker">SAMA OPERATIONS</p><h1>Hello, {user.fullName.split(" ")[0]}.</h1><p>Your account role is {user.role.toLowerCase()}. This portal is currently the passenger experience.</p></div><button className="outline" onClick={signOut}>Sign out</button></div><p className="alert success">Your account is authenticated. Driver and admin operations are available through secured API endpoints; their dedicated workspaces are not yet included in this web release.</p></section>;

  return <section className="dashboard"><div className="dash-top"><div><p className="portal-kicker">YOUR SAMA ACCOUNT</p><h1>Where to today, {user.fullName.split(" ")[0]}?</h1><p>Request your next ride and keep track of your journeys.</p></div><button className="outline" onClick={signOut}>Sign out</button></div>
    <div className="dash-grid"><form className="booking-card" onSubmit={requestRide}><div className="card-heading"><span>01</span><div><h2>Plan your ride</h2><p>Enter your pickup and destination details.</p></div></div>
      <label>Pickup location<input required minLength={3} value={trip.pickupAddress} onChange={e=>setTrip({...trip,pickupAddress:e.target.value})} placeholder="e.g. Westlands, Nairobi"/></label><label>Destination<input required minLength={3} value={trip.destinationAddress} onChange={e=>setTrip({...trip,destinationAddress:e.target.value})} placeholder="e.g. Kilimani, Nairobi"/></label>
      <div className="form-row"><label>Distance (km)<input type="number" min="0.1" max="500" step="0.1" required value={trip.distanceKm} onChange={e=>setTrip({...trip,distanceKm:e.target.value})}/></label><label>ETA (minutes)<input type="number" min="1" max="1000" required value={trip.estimatedMinutes} onChange={e=>setTrip({...trip,estimatedMinutes:e.target.value})}/></label></div>
      <label>Ride category<select value={trip.vehicleType} onChange={e=>setTrip({...trip,vehicleType:e.target.value})}><option value="ECONOMY">Sama Economy</option><option value="COMFORT">Sama Comfort</option><option value="XL">Sama XL</option><option value="MOTORBIKE">Sama Bike</option></select></label>
      <div className="form-row coords"><label>Pickup latitude<input required value={trip.pickupLat} onChange={e=>setTrip({...trip,pickupLat:e.target.value})}/></label><label>Pickup longitude<input required value={trip.pickupLng} onChange={e=>setTrip({...trip,pickupLng:e.target.value})}/></label></div>
      <div className="form-row coords"><label>Destination latitude<input required value={trip.destinationLat} onChange={e=>setTrip({...trip,destinationLat:e.target.value})}/></label><label>Destination longitude<input required value={trip.destinationLng} onChange={e=>setTrip({...trip,destinationLng:e.target.value})}/></label></div>
      <p className="form-hint">Coordinates and route distance are currently entered manually. A maps and routing provider must be connected before public launch.</p>
      {error && <p className="alert error">{error}</p>}{notice && <p className="alert success">{notice}</p>}<button className="submit" disabled={busy}>{busy ? "Sending request…" : "Request a ride →"}</button>
    </form>
    <aside className="ride-history"><div className="card-heading"><span>02</span><div><h2>Your journeys</h2><p>Your latest ride requests.</p></div></div>{rides.length === 0 ? <div className="empty"><span>⌁</span><b>No rides yet</b><p>Your ride history will appear here once you book your first trip.</p></div> : rides.map(ride=><article className="ride-row" key={ride.id}><div className="ride-status">{ride.status.replace("_"," ")}</div><b>{ride.pickupAddress}</b><span className="journey-arrow">↓</span><b>{ride.destinationAddress}</b><div className="ride-meta"><strong>KES {ride.fareKes.toLocaleString("en-KE")}</strong><small>{new Date(ride.createdAt).toLocaleString("en-KE")}</small></div>{["REQUESTED","MATCHED","ACCEPTED","ARRIVING"].includes(ride.status) && <button className="cancel" disabled={busy} onClick={()=>cancelRide(ride.id)}>Cancel ride</button>}</article>)}</aside></div>
  </section>;
}
