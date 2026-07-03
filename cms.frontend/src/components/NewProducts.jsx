import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewProducts = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL || "https://localhost:7024";

    useEffect(() => {
        axios.get(`${API_URL}/api/Products/latest`)
            .then(res => setProducts(res.data))
            .catch(err => console.error("Lỗi tải sản phẩm mới:", err));
    }, [API_URL]);

    return (
        <section className="my-5">
            <h3 className="fw-bold text-dark mb-4">Sản phẩm mới nhất</h3>
            <div className="row g-4">
                {products.map(product => (
                    <div className="col-md-4" key={product.id}>
                        <div className="card h-100 p-3 shadow-sm">
                            <img src={`${API_URL}/${product.imageUrl}`} className="card-img-top" alt={product.name} style={{ height: '200px', objectFit: 'cover' }} />
                            <div className="card-body text-center">
                                <h5 className="fw-bold">{product.name}</h5>
                                <p className="text-danger fw-bold">{product.price?.toLocaleString('vi-VN')} ₫</p>
                                <button onClick={() => navigate(`/product/${product.id}`)} className="btn btn-outline-dark rounded-pill">Chi tiết</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default NewProducts;