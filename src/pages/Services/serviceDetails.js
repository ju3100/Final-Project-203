import { useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import { api } from "../../api/APIBook";

export default function ServiceDetails() {
  const { type } = useParams();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const isBooking = params.get("book");

  const user = JSON.parse(localStorage.getItem("user"));
  const [selected, setSelected] = useState(null);

  const options = {
    taxi: [
      { id: 1, name: "Standard Taxi", seats: 4, price: 1000 },
      { id: 2, name: "Family Taxi", seats: 6, price: 1500 }
    ],
    bus: [
      { id: 1, name: "Mini Bus", seats: 12, price: 200 },
      { id: 2, name: "Full Bus", seats: 20, price: 200 }
    ],
    private: [
      { id: 1, name: "Small Car", seats: 4, price: 1500 },
      { id: 2, name: "SUV", seats: 6, price: 2500 },
      { id: 3, name: "Van", seats: 10, price: 4000 }
    ]
  };

  const serviceOptions = options[type] || [];

  const handleBooking = async () => {
    try {
      await api.createBooking({
        type,
        vehicle: selected.name,
        price: selected.price,
        user: user?.name,
        status: "pending"
      });

      alert("Booking Confirmed!");
    } catch (err) {
      console.error(err);
      alert("Booking failed");
    }
  };

  return (
    <div className="service-page">
      <h1>{type.toUpperCase()} Options</h1>

      <div className="trip-grid">
        {serviceOptions.map(opt => (
          <div
            key={opt.id}
            className={`trip-card ${selected?.id === opt.id ? "active" : ""}`}
            onClick={() => setSelected(opt)}
          >
            <h3>{opt.name}</h3>
            <p>Seats: {opt.seats}</p>
            <p>Price: {opt.price} VUV</p>
          </div>
        ))}
      </div>

      {isBooking && selected && (
        <div style={{ marginTop: "30px" }}>
          <h2>Confirm Booking</h2>
          <p>Service: {type}</p>
          <p>Vehicle: {selected.name}</p>
          <p>Price: {selected.price} VUV</p>

          <button className="book-btn" onClick={handleBooking}>
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
}