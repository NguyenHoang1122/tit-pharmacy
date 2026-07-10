import React, { useState } from 'react';
import './ProductList.css';

function ProductList({ products, categories, loading }) {
  const [searchName, setSearchName] = useState('');
  const [searchCategory, setSearchCategory] = useState('');

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const filteredProducts = products.filter((prod) => {
    const matchesName = prod.name.toLowerCase().includes(searchName.toLowerCase().trim());
    const matchesCategory = searchCategory === '' || prod.category === searchCategory;
    return matchesName && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) =>
    a.name.localeCompare(b.name, 'vi', { sensitivity: 'base' })
  );

  return (
    <section className="section-container animated fadeIn">
      <div className="section-header">
        <h2>Quản Lý Sản Phẩm</h2>
        <p className="section-desc">Tìm kiếm, lọc và sắp xếp toàn bộ danh mục sản phẩm của nhà thuốc</p>
      </div>

      <div className="search-panel">
        <div className="search-group">
          <label htmlFor="searchName">Tên sản phẩm</label>
          <div className="input-with-icon">
            <span className="input-icon">🔍</span>
            <input
              id="searchName"
              type="text"
              placeholder="Nhập tên sản phẩm cần tìm..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>
        </div>

        <div className="search-group">
          <label htmlFor="searchCategory">Thể loại sản phẩm</label>
          <select
            id="searchCategory"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
          >
            <option value="">-- Tất cả thể loại --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải danh sách sản phẩm...</p>
        </div>
      ) : sortedProducts.length > 0 ? (
        <div className="table-responsive">
          <table className="product-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã sản phẩm</th>
                <th>Tên sản phẩm</th>
                <th>Thể loại</th>
                <th className="text-right">Số lượng</th>
                <th className="text-right">Giá bán</th>
                <th>Ngày nhập sản phẩm</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.map((prod, index) => (
                <tr key={prod.id}>
                  <td>{index + 1}</td>
                  <td className="prod-code">{prod.id}</td>
                  <td className="prod-name">{prod.name}</td>
                  <td>
                    <span className="category-badge">{prod.category}</span>
                  </td>
                  <td className="text-right">{prod.quantity}</td>
                  <td className="text-right val-price">{formatCurrency(prod.price)}</td>
                  <td>{formatDate(prod.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📂</div>
          <h3>Không có kết quả</h3>
          <p>Không tìm thấy sản phẩm nào khớp với tiêu chí tìm kiếm của bạn.</p>
        </div>
      )}
    </section>
  );
}

export default ProductList;
