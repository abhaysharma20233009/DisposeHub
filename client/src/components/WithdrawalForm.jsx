import React, { useState } from 'react';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const WithdrawalForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    account: '',
    amount:0,
    confirmAccount: '',
    ifsc: '',
    bank: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.account !== formData.confirmAccount) {
      alert('Account numbers do not match!');
      return;
    }
    try {
      const firebaseUID = localStorage.getItem("firebaseUID"); 
    
      if (!firebaseUID) {
        throw new Error("User UID not found in localStorage");
      }
  
      const response = await axios.post(
        `${API_BASE_URL}/wallet/withdraw/${firebaseUID.trim()}`,
        formData, // ✅ sending form data here
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      console.log(response);
     // setBalance(response.data.user.walletBalance);
    } catch (err) {
      console.error("Failed to fetch wallet balance", err);
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        name="name"
        placeholder="Account Holder Name"
        value={formData.name}
        onChange={handleChange}
        required
        style={styles.input}
      />
            <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={formData.amount}
        onChange={handleChange}
        required
        style={styles.input}
      />
      
      <input
        type="text"
        name="account"
        placeholder="Account Number"
        value={formData.account}
        onChange={handleChange}
        required
        style={styles.input}
      />
      <input
        type="text"
        name="confirmAccount"
        placeholder="Confirm Account Number"
        value={formData.confirmAccount}
        onChange={handleChange}
        required
        style={styles.input}
      />
      <input
        type="text"
        name="ifsc"
        placeholder="IFSC Code"
        value={formData.ifsc}
        onChange={handleChange}
        required
        style={styles.input}
      />
      <input
        type="text"
        name="bank"
        placeholder="Bank Name"
        value={formData.bank}
        onChange={handleChange}
        required
        style={styles.input}
      />
      <div style={styles.buttons}>
        <button type="submit" style={styles.submit}>Submit</button>
        <button type="button" style={styles.cancel} onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  input: {
    padding: '0.6rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1rem',
  },
  submit: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  cancel: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  }
};

export default WithdrawalForm;
