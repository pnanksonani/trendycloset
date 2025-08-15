import { useState } from 'react';

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Replace this with real backend API call or email service
    console.log("Form submitted:", form);
    alert("Thanks for reaching out!");
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white px-4 py-16 flex items-center justify-center">
      <div className="max-w-xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-zinc-900">Contact Us</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full mt-1 p-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full mt-1 p-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows="5"
              className="w-full mt-1 p-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition font-semibold"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
