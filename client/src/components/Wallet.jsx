import React, { useState, useEffect } from 'react';
import WithdrawalForm from './WithdrawalForm';
import axios from 'axios';
import WalletBg from '../assets/transactionPage-bg.jpeg'; // use same bg

export const Wallet = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [balance, setBalance] = useState(0);
  const [withdrawRequest, setWithdrawRequest] = useState(false);

  const handleWithdrawClick = () => setIsFormVisible(true);
  const handleCancel = () => setIsFormVisible(false);
  const handleFormSubmit = (formData) => {
    setIsFormVisible(false);
    setWithdrawRequest(true);
  };

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const firebaseUID = localStorage.getItem("firebaseUID"); 
        if (!firebaseUID) throw new Error("User UID not found");
        const response = await axios.get(`${API_BASE_URL}/users/${firebaseUID.trim()}`);
        setBalance(response.data.user.walletBalance);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchWalletBalance();
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-10"
      style={{ backgroundImage: `url(${WalletBg})` }}
    >
      <div className="w-full max-w-xl bg-black/60 backdrop-blur-md rounded-3xl p-6 shadow-2xl text-center text-white">
        <h2 className="text-3xl font-bold text-cyan-400 mb-4">💰 Your Wallet</h2>
        <p className="text-lg text-gray-300 mb-6">
          Balance: <span className="text-cyan-300 font-bold text-xl">{withdrawRequest ?  'processing ...' : `₹${balance}`}</span>
        </p>

        {balance >= 500 && (
          <button
            onClick={handleWithdrawClick}
            className="bg-cyan-500 hover:bg-cyan-600 transition text-white py-2 px-4 rounded-xl font-semibold"
          >
            Withdraw Money
          </button>
        )}

        {isFormVisible && (
          <div className="mt-8">
            <WithdrawalForm onSubmit={handleFormSubmit} onCancel={handleCancel} setBalance={setBalance} setWithdrawRequest={setWithdrawRequest}/>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
