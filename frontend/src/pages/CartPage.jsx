import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchCart, updateCartItem, removeFromCart, clearCart } from '../store/slices/cartSlice'

const CartPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, total, isLoading } = useSelector((state) => state.cart)

  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch])



    const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return
    const result = await dispatch(updateCartItem({ itemId, quantity: newQuantity }))
    if (result.type === 'cart/updateCartItem/fulfilled') {
        dispatch(fetchCart()) // Refresh for header count
    }
    }

    const handleRemoveItem = async (itemId) => {
    const result = await dispatch(removeFromCart(itemId))
    if (result.type === 'cart/removeFromCart/fulfilled') {
        dispatch(fetchCart()) // Refresh for header count
    }
    }

    const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
        const result = await dispatch(clearCart())
        if (result.type === 'cart/clearCart/fulfilled') {
        dispatch(fetchCart()) // Refresh for header count
        }
    }
    }

  const handleContinueShopping = () => {
    navigate('/products')
  }

  if (isLoading) {
    return <div className="loading">Loading cart...</div>
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>
        
        {items.length === 0 ? (
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Add some awesome merchandise to your cart!</p>
            <button onClick={handleContinueShopping} className="btn-primary">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {items.map((item) => (
                <div key={item._id} className="cart-item">
                  <img src={item.product.image} alt={item.product.name} />
                  <div className="item-details">
                    <h3>{item.product.name}</h3>
                    <p className="item-price">${item.product.price}</p>
                    <p className="item-category">{item.product.category}</p>
                  </div>
                  <div className="item-controls">
                    <div className="quantity-controls">
                      <button 
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <div className="item-total">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                    <button 
                      onClick={() => handleRemoveItem(item._id)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <div className="summary-card">
                <h3>Order Summary</h3>
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                    <button 
                        onClick={() => navigate('/checkout')} 
                        className="checkout-btn"
                    >
                    Proceed to Checkout
                    </button>
                <button onClick={handleClearCart} className="clear-cart-btn">
                  Clear Cart
                </button>
                <button onClick={handleContinueShopping} className="continue-shopping-btn">
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage