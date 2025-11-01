import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { fetchCart } from '../store/slices/cartSlice'

const Header = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { items } = useSelector((state) => state.cart)
  const { token } = useSelector((state) => state.auth)

  useEffect(() => {
    // Fetch cart on component mount to get current cart count
    dispatch(fetchCart())
  }, [dispatch])

  const getCartItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  // Don't show header on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>TheGreenStore</h1>
          </Link>
          
          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/products" className="nav-link">Products</Link>
            {token && (
              <Link to="/admin/dashboard" className="nav-link">Admin</Link>
            )}
          </nav>

          <div className="header-actions">
            <Link to="/cart" className="cart-icon">
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {getCartItemCount() > 0 && (
                <span className="cart-badge">{getCartItemCount()}</span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header