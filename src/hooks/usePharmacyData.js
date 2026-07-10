import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:3001';

export function usePharmacyData(showToast) {
  const [state, setState] = useState({
    products: [],
    categories: [],
    loading: true,
  });

  const fetchData = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const [resProd, resCat] = await Promise.all([
        fetch(`${API_BASE}/products`),
        fetch(`${API_BASE}/categories`),
      ]);
      if (resProd.ok && resCat.ok) {
        const products = await resProd.json();
        const categories = await resCat.json();
        setState({ products, categories, loading: false });
      } else {
        showToast('Có lỗi xảy ra khi tải dữ liệu từ server!', 'error');
        setState((prev) => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('Không thể kết nối với server. Vui lòng kiểm tra lại!', 'error');
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    products: state.products,
    categories: state.categories,
    loading: state.loading,
    refreshData: fetchData,
  };
}
