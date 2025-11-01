import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const OrderSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const orderId = location.state?.orderId

  useEffect(() => {
    if (!orderId) {
      navigate('/')
    }
  }, [orderId, navigate])

  return (
    <div className="order-success">
      <div className="container">
        <div className="success-card">
          <div className="success-icon"></div>
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase. Your order has been received.</p>
          <div className="order-info">
            <p><strong>Order ID:</strong> {orderId}</p>
            <p>You will receive an email confirmation shortly.</p>
          </div>
          <div className="success-actions">
            <button onClick={() => navigate('/products')} className="btn-primary">
              Continue Shopping
            </button>
            <button onClick={() => navigate('/')} className="btn-secondary">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess