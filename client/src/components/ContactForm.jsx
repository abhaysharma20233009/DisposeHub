import { useState, useEffect } from 'react';
import { getMe } from "../../src/apis/userApi";
const ContactBg = "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=1470&q=80";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const ContactForm = () => {
  const [formData, setFormData] = useState({ message: '' });
  const [status, setStatus] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sent, setSent] = useState(false); // ✅ new state

  const fetchUser = async () => {
    try {
      const userData = await getMe();
      setUser(userData);
    } catch (error) {
      console.log(error.message || "Error loading user data ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const firebaseUID = localStorage.getItem("firebaseUID");
      if (!firebaseUID) throw new Error("User UID not found in localStorage");

      const response = await fetch(`${API_BASE_URL}/contact/${firebaseUID.trim()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('✅ Message sent successfully!');
        setFormData({ message: '' });
        setSent(true); // ✅ trigger thank-you message
      } else {
        setStatus(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      setStatus('❌ Failed to send message. Try again later.');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-10"
      style={{ backgroundImage: `url(${ContactBg})` }}
    >
      <div className="w-full max-w-xl bg-black/60 backdrop-blur-md rounded-3xl p-6 shadow-2xl text-white">
        <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">📨 Contact Us</h2>

        {sent ? (
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-semibold text-green-400">Thank you! 🎉</h3>
            <p className="text-gray-200">We’ve received your message. We'll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!loading && user && (
              <div className="text-center">
                <p className="text-lg font-semibold text-cyan-200">{user.name}</p>
                <p className="text-sm text-gray-300">{user.email}</p>
              </div>
            )}

            <textarea
              name="message"
              rows="5"
              placeholder="Write your message here..."
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full p-4 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />

            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-xl font-semibold transition"
            >
              Send
            </button>

            <p className={`text-sm mt-2 ${status.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>
              {status}
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactForm;
