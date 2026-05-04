import { useState, useEffect, useCallback } from "react";
import { api } from "../api/APIBook";
import "../styles/Passenger.css";

export default function Passenger() {
  // GET LOGGED USER
  const currentUser =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));

  // PASSENGER PROFILE
  const passenger = {
    username: currentUser?.username || "",
    contact: currentUser?.contact || "",
    email: currentUser?.email || "",
    fullName: currentUser?.fullName || ""
  };

  // AVAILABLE TRIPS
  const [trips, setTrips] = useState([]);

  // MY BOOKINGS
  const [bookings, setBookings] = useState([]);

  //  NOTIFICATIONS
  const [notifications, setNotifications] = useState([]);

  const addNotification = (msg) => {
    setNotifications(prev => [{ id: Date.now(), msg }, ...prev]);
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // DATA
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("summary");

  // LOAD AVAILABLE TRIPS
  const loadTrips = useCallback(() => {
    setLoading(true);
    api.getTrips()
      .then(data => {
        const now = new Date();
        const available = data.filter(t => {
          const inFuture = t.type === "bus"
            ? new Date(t.time) > now
            : t.endTime ? new Date(t.endTime) > now : false;
          return t.status !== "Full" && t.status !== "Booked" && inFuture;
        });
        setTrips(available);
      })
      .catch(() => setMessage("Failed to load trips"))
      .finally(() => setLoading(false));
  }, []);

  // LOAD MY BOOKINGS
  const loadBookings = useCallback(() => {
    api.getBookings()
      .then(data => {
        const myBookings = data.filter(b => b.user === currentUser?.username);
        setBookings(myBookings);
      })
      .catch(() => console.log("Failed to load bookings"));
  }, [currentUser]);

  // LIVE EFFECT
  useEffect(() => {
    loadTrips();
    loadBookings();

    // 🔥 AUTO REFRESH
    const interval = setInterval(() => {
      loadTrips();
      loadBookings();
    }, 10000); // Less frequent for passengers

    return () => clearInterval(interval);
  }, [loadTrips, loadBookings]);

  // ✅ BOOK TRIP
  const bookTrip = async (tripId) => {
    try {
      await api.createBooking({
        tripId,
        user: passenger.username,
        passengers: 1,
        status: "pending"
      });

      // For taxi/private availabilities, mark as booked immediately
      const trip = trips.find(t => t.id === tripId);
      if (trip && (trip.type === "taxi" || trip.type === "private")) {
        await api.updateTrip(tripId, { ...trip, status: "Booked" });
      }

      setMessage("Booking request sent!");
      addNotification("Booking request sent to driver");
      loadBookings();
      loadTrips(); // Refresh to hide booked trips
    } catch (err) {
      setMessage("Booking failed: " + err.message);
    }
  };

  return (
    <div className="passenger-container">

      <h2 className="title">Passenger Dashboard</h2>

      <div className="passenger-tabs">
        <button
          className={activeSection === "summary" ? "tab active" : "tab"}
          onClick={() => setActiveSection("summary")}
        >
          Summary
        </button>
        <button
          className={activeSection === "bookings" ? "tab active" : "tab"}
          onClick={() => setActiveSection("bookings")}
        >
          Booking History
        </button>
        <button
          className={activeSection === "trips" ? "tab active" : "tab"}
          onClick={() => setActiveSection("trips")}
        >
          Available Trips
        </button>
      </div>

      {activeSection === "summary" && (
        <div className="passenger-summary-card">
          <h3>Profile Summary</h3>
          <div className="summary-row">
            <span>Full Name</span>
            <strong>{passenger.fullName || "Not available"}</strong>
          </div>
          <div className="summary-row">
            <span>Username</span>
            <strong>{passenger.username || "Not available"}</strong>
          </div>
          <div className="summary-row">
            <span>Contact</span>
            <strong>{passenger.contact || "Not available"}</strong>
          </div>
        </div>
      )}

      {message && <div className="info">{message}</div>}

      {/* 🔄 LOADING */}
      {loading && <p>Loading trips...</p>}

      {/* NOTIFICATIONS */}
      {notifications.length > 0 && (
        <div className="notifications">
          <h3>Notifications</h3>
          {notifications.map(n => (
            <div key={n.id} className="notification">
              {n.msg}
              <button onClick={() => dismissNotification(n.id)}>Dismiss</button>
            </div>
          ))}
        </div>
      )}

      {activeSection === "bookings" && (
        <div className="booking-section">
          <h3>Booking History</h3>

          {bookings.length === 0 ? (
            <p>No bookings yet</p>
          ) : (
            <div className="booking-grid">
              {bookings.map(b => (
                <div key={b.id} className="booking-card">
                  <h4>Trip #{b.tripId}</h4>
                  <p><strong>Status:</strong> {b.status}</p>
                  <p><strong>Passengers:</strong> {b.passengers || 1}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSection === "trips" && (
        <div className="trips-section">
          <h3>Available Trips</h3>

          <div className="trip-grid">
            {trips.length === 0 ? (
              <p>No available trips</p>
            ) : (
              trips.map(trip => (
                <div key={trip.id} className="trip-card">
                  <h3>{trip.type.toUpperCase()} {trip.busSize && `- ${trip.busSize}`}</h3>
                  
                  {trip.type === "bus" ? (
                    <>
                      <p><strong>Driver:</strong> {trip.driver}</p>
                      <p><strong>Contact:</strong> {trip.contact}</p>
                      <p>{trip.from} → {trip.to}</p>
                      <p>{new Date(trip.time).toLocaleString()}</p>
                      <p>Available Seats: {trip.capacity - (trip.booked || 0)}</p>
                    </>
                  ) : (
                    <>
                      <p><strong>Driver:</strong> {trip.driver}</p>
                      <p><strong>Contact:</strong> {trip.contact}</p>
                      <p><strong>Start:</strong> {trip.startTime ? new Date(trip.startTime).toLocaleString() : "N/A"}</p>
                      <p><strong>End:</strong> {trip.endTime ? new Date(trip.endTime).toLocaleString() : "N/A"}</p>
                      <p><strong>Status:</strong> {trip.status}</p>
                      <p><strong>Availability:</strong> {trip.availability === "available" ? "Available for Service" : "Not Available"}</p>
                    </>
                  )}

                  <button
                    onClick={() => bookTrip(trip.id)}
                    className="book-btn"
                  >
                    Book {trip.type === "bus" ? "Trip" : "Service"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}