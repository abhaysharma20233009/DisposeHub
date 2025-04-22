import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const WithdrawalForm = ({ onSubmit, onCancel, setBalance, setWithdrawRequest }) => {
  const [formData, setFormData] = useState({
    name: '',
    account: '',
    confirmAccount: '',
    ifsc: '',
    bank: '',
    amount: 0,
  });

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.account !== formData.confirmAccount) {
      alert('Account numbers do not match!');
      return;
    }
    onSubmit(formData);
    try {
      const firebaseUID = localStorage.getItem("firebaseUID");
      if (!firebaseUID) throw new Error("User UID not found");

      const res = await axios.post(`${API_BASE_URL}/wallet/withdraw/${firebaseUID.trim()}`, formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      setBalance(res.data.walletBalance );
      setWithdrawRequest(false);
    } catch (err) {
      console.error("Failed to submit withdrawal", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-black/50 backdrop-blur-md p-6 rounded-2xl space-y-4 shadow-xl"
    >
      {[
        { name: 'name', placeholder: 'Account Holder Name', type: 'text' },
        { name: 'amount', placeholder: 'Amount', type: 'number' },
        { name: 'account', placeholder: 'Account Number', type: 'text' },
        { name: 'confirmAccount', placeholder: 'Confirm Account Number', type: 'text' },
        { name: 'ifsc', placeholder: 'IFSC Code', type: 'text' },
        { name: 'bank', placeholder: 'Bank Name', type: 'text' },
      ].map(({ name, placeholder, type }) => (
        <input
          key={name}
          type={type}
          name={name}
          placeholder={placeholder}
          value={formData[name]}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      ))}

      <div className="flex justify-between mt-4">
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default WithdrawalForm;
