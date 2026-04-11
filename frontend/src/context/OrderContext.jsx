import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

const getToken = () => localStorage.getItem('flora_token');

export const OrderProvider = ({ children }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setOrders([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`${API_ENDPOINTS.ORDERS}/${user.id}`, {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const data = await res.json();
        if (res.ok) setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const placeOrder = async (items, paymentMethod, totalAmount, shippingAddress) => {
    if (!user) return { success: false, error: 'User not logged in' };

    try {
      const res = await fetch(API_ENDPOINTS.ORDERS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ items, totalAmount, shippingAddress, paymentMethod })
      });

      const data = await res.json();
      if (res.ok) {
        setOrders(prev => [data, ...prev]);
        return { success: true, orderId: data.id };
      }
      return { success: false, error: data.error };
    } catch (err) {
      console.error('OrderContext: placeOrder failed:', err);
      return { success: false, error: 'Server connection error. Please check if the backend is running.' };
    }
  };

  return (
    <OrderContext.Provider value={{ orders, loading, placeOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
