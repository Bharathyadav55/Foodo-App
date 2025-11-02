import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { format, addDays } from "date-fns"; // npm install date-fns

export default function TableBookingModal({ isOpen, onClose, restaurant }) {
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [guests, setGuests] = useState(2);
  const [meal, setMeal] = useState("Lunch");
  const [slot, setSlot] = useState("");
  const slots = ["12:45 PM","1:00 PM","1:15 PM","1:30 PM","1:45 PM","2:00 PM","2:15 PM","2:30 PM","2:45 PM","3:00 PM"];
  const confirm = () => {
    if (!slot) return;
    onClose();
  };
  if (!isOpen || !restaurant) return null;
  const dateOptions = Array.from({ length: 7 }).map((_, i) => {
    const d = addDays(new Date(), i);
    return { label: format(d, "EEE, MMM d"), value: d.toISOString().split("T")[0] };
  });

  return (
    <AnimatePresence>
      <motion.div
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      />
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        className="fixed inset-0 m-auto max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-y-auto z-50"
      >
        <div className="flex items-center px-6 pt-6 space-x-4 border-b">
          {["Overview","Order Online","Reviews","Photos","Menu","Book a Table"].map(tab => (
            <button
              key={tab}
              className={`pb-2 text-sm font-medium ${
                tab === "Book a Table"
                  ? "text-red-600 border-b-2 border-red-600"
                  : "text-gray-600 hover:text-black"
              }`}
              disabled={tab !== "Book a Table"}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="px-6 py-8">
          <h2 className="text-xl font-semibold mb-6">Select your booking details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <select
                className="w-full px-4 py-2 border rounded-lg"
                value={date}
                onChange={e => setDate(e.target.value)}
              >
                {dateOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Guests</label>
              <select
                className="w-full px-4 py-2 border rounded-lg"
                value={guests}
                onChange={e => setGuests(Number(e.target.value))}
              >
                {Array.from({ length: 8 }, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>{n} guest{n > 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Meal</label>
              <select
                className="w-full px-4 py-2 border rounded-lg"
                value={meal}
                onChange={e => setMeal(e.target.value)}
              >
                {["Breakfast","Brunch","Lunch","Dinner"].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-4">Select slot</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {slots.map(time => {
              const active = slot === time;
              return (
                <button
                  key={time}
                  onClick={() => setSlot(time)}
                  className={`px-4 py-3 rounded-lg border transition ${active ? "bg-black text-white border-black" : "bg-gray-50 border-gray-200 hover:bg-gray-100"}`}
                >
                  <div className="font-medium">{time}</div>
                  <div className={`text-xs ${active ? "text-white/80" : "text-blue-600"}`}>2 offers</div>
                </button>
              );
            })}
          </div>
          <button
            onClick={confirm}
            disabled={!slot}
            className={`mt-8 w-full py-3 rounded-lg font-semibold ${slot ? "bg-black text-white hover:bg-black/90" : "bg-black/20 text-black/40 cursor-not-allowed"}`}
          >
            Confirm Booking
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
