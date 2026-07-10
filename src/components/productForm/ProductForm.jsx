import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './ProductForm.css';

const API_BASE = 'http://localhost:3001';

function ProductForm({ categories, products, onAddSuccess, onCancel, showToast }) {
  const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

  const formik = useFormik({
    initialValues: {
      id: '',
      name: '',
      description: '',
      category: '',
      price: '',
      quantity: '',
      date: '',
    },
    validationSchema: Yup.object().shape({
      id: Yup.string()
        .required('Mã sản phẩm không được để trống')
        .matches(/^PROD-\d{4}$/, 'Mã sản phẩm phải đúng định dạng PROD-XXXX (ví dụ: PROD-0021)')
        .test('duplicate-check', 'Mã sản phẩm này đã tồn tại trong hệ thống', function (value) {
          if (!value) return true;
          return !products.some((p) => p.id.toUpperCase() === value.trim().toUpperCase());
        }),
      name: Yup.string().required('Tên sản phẩm không được để trống'),
      description: Yup.string().required('Mô tả sản phẩm không được để trống'),
      category: Yup.string().required('Vui lòng chọn thể loại sản phẩm'),
      price: Yup.number()
        .required('Giá bán không được để trống')
        .positive('Giá bán sản phẩm phải lớn hơn 0'),
      quantity: Yup.number()
        .required('Số lượng không được để trống')
        .integer('Số lượng sản phẩm phải là số nguyên')
        .positive('Số lượng sản phẩm phải lớn hơn 0'),
      date: Yup.date()
        .required('Ngày nhập sản phẩm không được để trống')
        .max(todayStr, 'Ngày nhập sản phẩm không được lớn hơn ngày hiện tại'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch(`${API_BASE}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...values,
            id: values.id.trim(),
            name: values.name.trim(),
            description: values.description.trim(),
            price: parseFloat(values.price),
            quantity: parseInt(values.quantity, 10),
          }),
        });

        if (response.ok) {
          showToast('Thêm mới sản phẩm thành công!');
          onAddSuccess();
        } else {
          showToast('Thêm mới thất bại, vui lòng thử lại!', 'error');
        }
      } catch (error) {
        console.error(error);
        showToast('Có lỗi xảy ra khi lưu sản phẩm!', 'error');
      }
    },
  });

  return (
    <section className="section-container form-section-container animated fadeIn">
      <div className="section-header">
        <h2>Thêm Mới Sản Phẩm</h2>
        <p className="section-desc">Vui lòng điền đầy đủ các thông tin chi tiết dưới đây để thêm sản phẩm vào hệ thống</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="add-product-form" noValidate>
        <div className="form-grid">

          <div className="form-group">
            <label htmlFor="id" className="required">Mã sản phẩm</label>
            <input
              id="id"
              name="id"
              type="text"
              placeholder="PROD-XXXX (ví dụ: PROD-1024)"
              {...formik.getFieldProps('id')}
              className={formik.touched.id && formik.errors.id ? 'error' : ''}
            />
            {formik.touched.id && formik.errors.id && (
              <span className="error-text">{formik.errors.id}</span>
            )}
          </div>


          <div className="form-group">
            <label htmlFor="name" className="required">Tên sản phẩm</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Nhập tên thuốc hoặc sản phẩm..."
              {...formik.getFieldProps('name')}
              className={formik.touched.name && formik.errors.name ? 'error' : ''}
            />
            {formik.touched.name && formik.errors.name && (
              <span className="error-text">{formik.errors.name}</span>
            )}
          </div>


          <div className="form-group">
            <label htmlFor="category" className="required">Thể loại</label>
            <select
              id="category"
              name="category"
              {...formik.getFieldProps('category')}
              className={formik.touched.category && formik.errors.category ? 'error' : ''}
            >
              <option value="">-- Chọn thể loại --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            {formik.touched.category && formik.errors.category && (
              <span className="error-text">{formik.errors.category}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="price" className="required">Giá bán (VND)</label>
            <input
              id="price"
              name="price"
              type="number"
              min="1"
              placeholder="Ví dụ: 15000"
              {...formik.getFieldProps('price')}
              className={formik.touched.price && formik.errors.price ? 'error' : ''}
            />
            {formik.touched.price && formik.errors.price && (
              <span className="error-text">{formik.errors.price}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="quantity" className="required">Số lượng</label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              step="1"
              placeholder="Nhập số lượng nhập kho..."
              {...formik.getFieldProps('quantity')}
              className={formik.touched.quantity && formik.errors.quantity ? 'error' : ''}
            />
            {formik.touched.quantity && formik.errors.quantity && (
              <span className="error-text">{formik.errors.quantity}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="date" className="required">Ngày nhập sản phẩm</label>
            <input
              id="date"
              name="date"
              type="date"
              max={todayStr}
              {...formik.getFieldProps('date')}
              className={formik.touched.date && formik.errors.date ? 'error' : ''}
            />
            {formik.touched.date && formik.errors.date && (
              <span className="error-text">{formik.errors.date}</span>
            )}
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="description" className="required">Mô tả sản phẩm</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            placeholder="Mô tả công dụng, cách dùng hoặc thành phần của sản phẩm..."
            {...formik.getFieldProps('description')}
            className={formik.touched.description && formik.errors.description ? 'error' : ''}
          ></textarea>
          {formik.touched.description && formik.errors.description && (
            <span className="error-text">{formik.errors.description}</span>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Hủy bỏ
          </button>
          <button type="submit" className="btn btn-primary">
            Lưu sản phẩm
          </button>
        </div>
      </form>
    </section>
  );
}

export default ProductForm;
