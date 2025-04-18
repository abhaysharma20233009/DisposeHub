import React, { useState } from 'react';
import WithdrawalForm from './WithdrawalForm';

const Wallet = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);

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

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>💰 Your Wallet</h2>
        <p style={styles.balance}>Balance: <span style={styles.amount}>$1000</span></p>
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
