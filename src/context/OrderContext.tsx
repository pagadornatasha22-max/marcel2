import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order, Review } from '../types';

interface OrderContextType {
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'status' | 'createdAt' | 'updatedAt'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addReview: (orderId: string, review: Review) => void;
  getOrdersByCustomer: (customerId: string) => Order[];
  getAllOrders: () => Order[];
  getAllReviews: () => { order: Order; review: Review }[];
  getTotalSales: () => number;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('macels_orders') || '[]');
    setOrders(saved);
  }, []);

  const saveOrders = (items: Order[]) => {
    localStorage.setItem('macels_orders', JSON.stringify(items));
    setOrders(items);
  };

  const generateOrderNumber = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const rand = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `MFS-${year}${month}${day}-${rand}`;
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'status' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `order-${Date.now()}`,
      orderNumber: generateOrderNumber(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...orders, newOrder];
    saveOrders(updated);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
    );
    saveOrders(updated);
  };

  const addReview = (orderId: string, review: Review) => {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, review, updatedAt: new Date().toISOString() } : o
    );
    saveOrders(updated);
  };

  const getOrdersByCustomer = (customerId: string) => {
    return orders.filter((o) => o.customerId === customerId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getAllOrders = () => {
    return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getAllReviews = () => {
    return orders
      .filter((o) => o.review)
      .map((o) => ({ order: o, review: o.review! }))
      .sort((a, b) => new Date(b.review.createdAt).getTime() - new Date(a.review.createdAt).getTime());
  };

  const getTotalSales = () => {
    return orders.filter((o) => o.status === 'completed').reduce((total, o) => total + o.totalAmount, 0);
  };

  return (
    <OrderContext.Provider value={{ orders, createOrder, updateOrderStatus, addReview, getOrdersByCustomer, getAllOrders, getAllReviews, getTotalSales }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within OrderProvider');
  return context;
}
