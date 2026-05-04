const BASE_URL = "http://localhost:5001";

const handleResponse = async (res) => {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Request failed");
  }
  return res.json();
};

export const api = {
  getTrips: async () => {
    try {
      const data = await fetch(`${BASE_URL}/trips`).then(handleResponse);
      // Persist to IndexedDB
      const { addData } = await import("../utils/indexDB");
      for (const trip of data) {
        await addData("trips", trip);
      }
      return data;
    } catch (error) {
      // Fallback to IndexedDB
      const { getAllData } = await import("../utils/indexDB");
      return await getAllData("trips");
    }
  },

  createTrip: async (data) => {
    try {
      const result = await fetch(`${BASE_URL}/trips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(handleResponse);
      
      // Persist to IndexedDB
      const { addData } = await import("../utils/indexDB");
      await addData("trips", result.trip || result);
      
      return result;
    } catch (error) {
      // Fallback: store locally
      const { addData } = await import("../utils/indexDB");
      await addData("trips", { ...data, id: Date.now() });
      throw error;
    }
  },

  updateTrip: (id, data) =>
    fetch(`${BASE_URL}/trips/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(handleResponse),

  deleteTrip: (id) =>
    fetch(`${BASE_URL}/trips/${id}`, {
      method: "DELETE"
    }).then(handleResponse),

  createBooking: async (data) => {
    try {
      const result = await fetch(`${BASE_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(handleResponse);
      
      // Persist to IndexedDB
      const { addData } = await import("../utils/indexDB");
      await addData("bookings", result.booking || result);
      
      return result;
    } catch (error) {
      // Fallback: store locally
      const { addData } = await import("../utils/indexDB");
      await addData("bookings", { ...data, id: Date.now() });
      throw error;
    }
  },

  getBookings: async () => {
    try {
      const data = await fetch(`${BASE_URL}/bookings`).then(handleResponse);
      // Persist to IndexedDB
      const { addData } = await import("../utils/indexDB");
      for (const booking of data) {
        await addData("bookings", booking);
      }
      return data;
    } catch (error) {
      // Fallback to IndexedDB
      const { getAllData } = await import("../utils/indexDB");
      return await getAllData("bookings");
    }
  },

  updateBooking: (id, data) =>
    fetch(`${BASE_URL}/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(handleResponse)
};