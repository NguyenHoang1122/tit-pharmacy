import { useState } from 'react';
import './App.css';
import { usePharmacyData } from './hooks/usePharmacyData';
import Toast from './components/Toast/Toast';
import ProductList from './components/ProductList/ProductList';
import ProductForm from './components/ProductForm/ProductForm';

function App() {
  const [activeTab, setActiveTab] = useState('list');

  const [notification, setNotification] = useState(null);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };
  const { products, categories, loading, refreshData } = usePharmacyData(showToast);

  const handleAddSuccess = () => {
    refreshData();
    setActiveTab('list');
  };

  return (
    <div className="app-container">
      <Toast
        message={notification?.message}
        type={notification?.type}
      />

      <header className="app-header">
        <div className="header-brand">
          <div className="logo-icon">➕</div>
          <div>
            <h1>TIT Pharmacy</h1>
            <p className="subtitle">Hệ thống quản lý sản phẩm y khoa hiện đại</p>
          </div>
        </div>
        <nav className="header-nav">
          <button
            className={`nav-btn ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            📋 Danh sách sản phẩm
          </button>
          <button
            className={`nav-btn ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            ➕ Thêm mới sản phẩm
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeTab === 'list' ? (
          <ProductList
            products={products}
            categories={categories}
            loading={loading}
          />
        ) : (
          <ProductForm
            categories={categories}
            products={products}
            onAddSuccess={handleAddSuccess}
            onCancel={() => setActiveTab('list')}
            showToast={showToast}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>© 2026 TIT Pharmacy. Bản quyền thuộc hệ thống chuỗi nhà thuốc TIT.</p>
      </footer>
    </div>
  );
}

export default App;
