import React, { useState, useEffect } from 'react';
import WithdrawalForm from './WithdrawalForm';

export const Wallet = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [balance, setBalance] = useState(null);

  const handleWithdrawClick = () => {
    setIsFormVisible(true);
  };

  const handleFormSubmit = (formData) => {
    console.log('Withdrawal Request:', formData);
    setIsFormVisible(false);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
  };

  // ✅ Fetch wallet balance
  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const firebaseUID = localStorage.getItem('firebaseUID'); // or get from context
        const res = await fetch(`http://localhost:3000/api/user/${firebaseUID}`);
        const data = await res.json();
        setBalance(data.walletBalance);
      } catch (err) {
        console.error("Failed to fetch wallet balance", err);
      }
    };

    fetchWalletBalance();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>💰 Your Wallet</h2>
        <p style={styles.balance}>
          Balance: <span style={styles.amount}>
            {balance !== null ? `$${balance}` : 'Loading...'}
          </span>
        </p>
        <button style={styles.button} onClick={handleWithdrawClick}>Withdraw Money</button>

        {isFormVisible && (
          <div style={styles.formContainer}>
            <WithdrawalForm onSubmit={handleFormSubmit} onCancel={handleCancel} />
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    padding: '2rem',
    width: '100%',
    maxWidth: '500px',
    textAlign: 'center',
  },
  heading: {
    fontSize: '1.8rem',
    marginBottom: '1rem',
    color: '#2b2d42',
  },
  balance: {
    fontSize: '1.2rem',
    marginBottom: '1.5rem',
  },
  amount: {
    color: '#0077cc',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#0077cc',
    color: 'white',
    padding: '0.6rem 1.2rem',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  formContainer: {
    marginTop: '1.5rem',
  }
};

export default Wallet;
