import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../store/slices/productSlice'
import { addToCart } from '../store/slices/cartSlice'

const ProductsPage = () => {
  const dispatch = useDispatch()
  const { items, isLoading } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

    const handleAddToCart = async (productId) => {
      const result = await dispatch(addToCart({ productId, quantity: 1 }))
      if (result.type === 'cart/addToCart/fulfilled') {
        // Refresh cart to get updated count for header
        dispatch(fetchCart())
        alert('Product added to cart!')
      } else {
        alert('Failed to add product to cart')
      }
    }

  if (isLoading) {
    return <div className="loading">Loading products...</div>
  }

  return (
    <div className="products-page">
      <div className="container">
        <h1>Our Merchandise</h1>
        <div className="products-grid">
          {items.map((product) => (
            <div key={product._id} className="product-card">
              <img src={product.image} alt={product.name} />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">${product.price}</p>
                <p className="product-category">{product.category}</p>
                <div className="product-actions">
                  {product.inStock ? (
                    <button 
                      onClick={() => handleAddToCart(product._id)}
                      className="add-to-cart-btn"
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <span className="out-of-stock">Out of Stock</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length === 0 && (
          <div className="no-products">
            <p>No products available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage