'use client';

import { useState, useEffect } from 'react';

interface TimeSlotGroup {
  day: string;
  times: string[];
}

export default function Booking() {
  const [timeSlots, setTimeSlots] = useState<TimeSlotGroup[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    topic: '',
  });

  useEffect(() => {
    fetch('/api/time-slots')
      .then((res) => res.json())
      .then((data) => setTimeSlots(data))
      .catch((err) => console.error('Error fetching time slots:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay || !selectedTime) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          day: selectedDay,
          time: selectedTime,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert('Failed to submit booking. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedDaySlot = timeSlots.find((slot) => slot.day === selectedDay);

  return (
    <section id="booking" className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-sm font-medium mb-6">
            Book Your Session
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Schedule a Free Discovery Call
          </h2>
          <p className="text-xl text-gray-300">
            Take the first step toward transforming your leadership. Book a complimentary 30-minute consultation to discuss your goals.
          </p>
        </div>

        {submitted ? (
          <div className="max-w-xl mx-auto bg-white rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Booking Confirmed!</h3>
            <p className="text-gray-600 mb-2">
              Your discovery call has been scheduled for:
            </p>
            <p className="text-xl font-semibold text-blue-600 mb-6">
              {selectedDay} at {selectedTime}
            </p>
            <p className="text-gray-600">
              You'll receive a confirmation email with meeting details shortly.
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Calendar Selection */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-6">Select a Time</h3>

              {/* Day Selection */}
              <div className="grid grid-cols-5 gap-2 mb-6">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.day}
                    onClick={() => {
                      setSelectedDay(slot.day);
                      setSelectedTime(null);
                    }}
                    className={`py-3 px-2 rounded-lg text-sm font-medium transition-all ${
                      selectedDay === slot.day
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {slot.day.slice(0, 3)}
                  </button>
                ))}
              </div>

              {/* Time Selection */}
              {selectedDay && selectedDaySlot && (
                <div className="space-y-3">
                  <p className="text-gray-400 text-sm mb-4">Available times for {selectedDay}:</p>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedDaySlot.times.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 px-4 rounded-lg font-medium transition-all ${
                          selectedTime === time
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!selectedDay && (
                <p className="text-gray-400 text-center py-8">
                  Select a day to see available time slots
                </p>
              )}

              {/* Integration Note */}
              <div className="mt-8 p-4 bg-blue-500/10 rounded-lg border border-blue-400/20">
                <p className="text-sm text-blue-300">
                  <strong>Pro tip:</strong> You can integrate with Calendly, Cal.com, or Acuity Scheduling for automated booking management.
                </p>
              </div>
            </div>

            {/* Booking Form */}
            <div className="bg-white rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Information</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="John Smith"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="john@company.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                    What would you like to discuss?
                  </label>
                  <textarea
                    id="topic"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Tell me about your leadership challenges and goals..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={!selectedDay || !selectedTime || isSubmitting}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? 'Submitting...'
                    : selectedDay && selectedTime
                    ? `Book for ${selectedDay} at ${selectedTime}`
                    : 'Select a time slot to continue'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
