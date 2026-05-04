import { useEffect, useState } from "react";
import { getAllData } from "../utils/indexDB";
import AdminChart from "../components/AdminChart";
import "../styles/admin.css";

export default function Admin() {
  const [bookings, setBookings] = useState([]);
  const [trips, setTrips] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  // 🔥 Load bookings (IndexedDB)
  useEffect(() => {
    getAllData("bookings")
      .then(setBookings)
      .catch(() => setError("Failed to load bookings"));
  }, []);

  // 🔥 Load trips (backend)
  useEffect(() => {
    fetch("http://localhost:5001/trips")
      .then(res => res.json())
      .then(setTrips)
      .catch(() => setError("Failed to load trips"));
  }, []);

  // 🔥 Load users (backend admin endpoint)
  useEffect(() => {
    fetch("http://localhost:5001/admin/data")
      .then(res => res.json())
      .then(data => setUsers(data.users || []))
      .catch(() => setError("Failed to load users"));
  }, []);

  return (
    <div className="admin-container">

      <h2>Admin Dashboard 🛠</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* ================= STATS ================= */}
      <div className="admin-stats">

        <div className="stat-card">
          <h3>Users</h3>
          <p>{users.length}</p>
        </div>

        <div className="stat-card">
          <h3>Trips</h3>
          <p>{trips.length}</p>
        </div>

        <div className="stat-card">
          <h3>Bookings</h3>
          <p>{bookings.length}</p>
        </div>

      </div>

      {/* ================= CHART ================= */}
      <div className="chart-container">
        <AdminChart bookings={bookings} />
      </div>

      {/* ================= TRIPS TABLE ================= */}
      <div className="table-section">
        <h3>Trips (Driver Created)</h3>

        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th>Time / Availability Window</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {trips.map((t) => (
              <tr key={t.id}>
                <td>{t.type}</td>
                <td>{t.from || "—"}</td>
                <td>{t.to || "—"}</td>
                <td>
                  {t.type === "bus"
                    ? (t.time ? new Date(t.time).toLocaleString() : "N/A")
                    : (t.startTime && t.endTime
                        ? `${new Date(t.startTime).toLocaleString()} → ${new Date(t.endTime).toLocaleString()}`
                        : "N/A")}
                </td>
                <td>{t.status || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= USERS TABLE ================= */}
      <div className="table-section">
        <h3>Users</h3>

        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, i) => (
              <tr key={i}>
                <td>{u.username}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= BOOKINGS TABLE ================= */}
      <div className="table-section">
        <h3>Bookings</h3>

        <table>
          <thead>
            <tr>
              <th>Trip ID</th>
              <th>Passenger</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b, i) => (
              <tr key={i}>
                <td>{b.tripId}</td>
                <td>{b.passenger}</td>
                <td>{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}