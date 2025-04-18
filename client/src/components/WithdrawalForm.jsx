import React, { useState } from 'react';

const WithdrawalForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    account: '',
    confirmAccount: '',
    ifsc: '',
    bank: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.account !== formData.confirmAccount) {
      alert('Account numbers do not match!');
      return;
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
