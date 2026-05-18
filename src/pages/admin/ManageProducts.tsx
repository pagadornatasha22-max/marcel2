import { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { Product } from '../../types';
import { Plus, Edit3, Trash2, X, Save, Package, Search } from 'lucide-react';

export default function ManageProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'bouquet' as 'bouquet' | 'dozen' | 'custom',
    description: '',
    image: '/images/bouquet1.jpg',
    inStock: true,
  });

  const imageOptions = [
    '/images/bouquet1.jpg',
    '/images/bouquet2.jpg',
    '/images/bouquet3.jpg',
    '/images/dozen1.jpg',
    '/images/dozen2.jpg',
    '/images/custom1.jpg',
    '/images/custom2.jpg',
  ];

  const resetForm = () => {
    setFormData({ name: '', price: '', category: 'bouquet', description: '', image: '/images/bouquet1.jpg', inStock: true });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
      image: product.image,
      inStock: product.inStock,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      description: formData.description,
      image: formData.image,
      inStock: formData.inStock,
    };

    if (editingId) {
      updateProduct(editingId, data);
    } else {
      addProduct(data);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };

  const formatPrice = (price: number) => `₱${price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

  const filteredProducts = searchQuery
    ? products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.includes(searchQuery.toLowerCase()))
    : products;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>Manage Products</h1>
            <p className="text-gray-500 text-sm">{products.length} flower product{products.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="px-5 py-2.5 rounded-xl text-white font-semibold flex items-center gap-2 transition-all hover:shadow-lg text-sm"
            style={{ background: 'linear-gradient(135deg, #e11d48, #f43f5e)' }}
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 text-sm text-gray-700"
            />
          </div>
        </div>

        {/* Product Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => resetForm()}>
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slideUp" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button onClick={resetForm} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 text-gray-700"
                    placeholder="e.g., Rose Bouquet"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₱)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 text-gray-700"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 text-gray-700"
                    >
                      <option value="bouquet">Bouquet</option>
                      <option value="dozen">Dozen Flowers</option>
                      <option value="custom">Custom Arrangement</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 text-gray-700 resize-none"
                    placeholder="Describe the product..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                  <div className="grid grid-cols-4 gap-2">
                    {imageOptions.map((img) => (
                      <button
                        key={img}
                        type="button"
                        onClick={() => setFormData({ ...formData, image: img })}
                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                          formData.image === img ? 'border-rose-500 ring-2 ring-rose-200' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded"
                    id="inStock"
                  />
                  <label htmlFor="inStock" className="text-sm text-gray-700">In Stock</label>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #e11d48, #f43f5e)' }}
                  >
                    <Save size={16} />
                    {editingId ? 'Update Product' : 'Add Product'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2.5 rounded-xl text-gray-600 font-semibold border border-gray-200 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center animate-slideUp">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={28} className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Product?</h3>
              <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl text-gray-600 font-semibold border border-gray-200 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Table */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Package size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-600 mb-1">No products found</h3>
            <p className="text-gray-400 text-sm">Add your first flower product to get started!</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-rose-50 overflow-hidden">
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Product</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Price</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{product.name}</p>
                            <p className="text-xs text-gray-400 truncate max-w-xs">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          product.category === 'bouquet' ? 'bg-pink-100 text-pink-700' :
                          product.category === 'dozen' ? 'bg-red-100 text-red-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {product.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-bold text-gray-800">{formatPrice(product.price)}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${product.inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-all"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(product.id)}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-50">
              {filteredProducts.map((product) => (
                <div key={product.id} className="p-4">
                  <div className="flex gap-3">
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-xl" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 text-sm truncate">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          product.category === 'bouquet' ? 'bg-pink-100 text-pink-700' :
                          product.category === 'dozen' ? 'bg-red-100 text-red-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>{product.category}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${product.inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {product.inStock ? 'In Stock' : 'Out'}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-rose-600 mt-1">{formatPrice(product.price)}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button onClick={() => handleEdit(product)} className="p-2 rounded-lg text-blue-500 hover:bg-blue-50">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => setDeleteConfirm(product.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
