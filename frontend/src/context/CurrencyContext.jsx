import React, { createContext, useState, useEffect } from 'react';

export const CurrencyContext = createContext();

const rates = {
  INR: { symbol: '₹', rate: 1, label: 'INR (₹)' },
  USD: { symbol: '$', rate: 0.012, label: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.011, label: 'EUR (€)' },
  GBP: { symbol: '£', rate: 0.0095, label: 'GBP (£)' },
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('luxora_currency') || 'INR';
  });

  useEffect(() => {
    localStorage.setItem('luxora_currency', currency);
  }, [currency]);

  const formatPrice = (amountInINR) => {
    if (amountInINR === undefined || amountInINR === null) return '';
    const curr = rates[currency] || rates.INR;
    const converted = amountInINR * curr.rate;
    
    if (currency === 'INR') {
      return `₹${Math.round(converted).toLocaleString('en-IN')}`;
    }
    return `${curr.symbol}${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        currencies: rates,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
