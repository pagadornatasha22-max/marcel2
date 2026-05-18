import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductsByCategory: (category: string) => Product[];
  searchProducts: (query: string) => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('macels_products') || '[]');
    setProducts(saved);
  }, []);

  const saveProducts = (items: Product[]) => {
    localStorage.setItem('macels_products', JSON.stringify(items));
    setProducts(items);
  };

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [...products, newProduct];
    saveProducts(updated);
  };

  const updateProduct = (id: string, data: Partial<Product>) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...data } : p));
    saveProducts(updated);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
  };

  const getProductsByCategory = (category: string) => {
    if (category === 'all') return products.filter((p) => p.inStock);
    return products.filter((p) => p.category === category && p.inStock);
  };

  const searchProducts = (query: string) => {
    const lower = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower) ||
        p.category.toLowerCase().includes(lower)
    );
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, getProductsByCategory, searchProducts }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
}
