import { useState, useEffect } from 'react';
import '../styles/contact.css';
import { getMe } from "../../src/apis/userApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const ContactForm = () => {
  const [formData, setFormData] = useState({ message: '' });
  const [status, setStatus] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      } else {
        setStatus(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      setStatus('❌ Failed to send message. Try again later.');
    }
  };

  return (
    <div className="contact-container">
      <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
      <form onSubmit={handleSubmit} className="contact-form space-y-4">

        {!loading && user && (
          <div>
            <p className="text-lg font-semibold text-gray-800 mb-1">{user.name}</p>
            <p className="text-base text-gray-500">{user.email}</p>
          </div>
        )}

        <textarea
          name="message"
          rows="5"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
        >
          Send
        </button>

        <p className="form-status text-sm text-green-600">{status}</p>
      </form>
    </div>
  );
};

export default ContactForm;
