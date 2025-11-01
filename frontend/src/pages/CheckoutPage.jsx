import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createPaymentIntent, confirmPayment, clearError } from '../store/slices/paymentSlice'
import { fetchCart } from '../store/slices/cartSlice'

const CheckoutPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, total } = useSelector((state) => state.cart)
  const { clientSecret, currentOrder, isLoading, error } = useSelector((state) => state.payment)
  
  const [checkoutData, setCheckoutData] = useState({
    customerEmail: '',
    customerName: '',
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  })
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expDate: '',
    cvc: '',
    nameOnCard: ''
  })

  useEffect(() => {
    dispatch(fetchCart())
    dispatch(clearError())
  }, [dispatch])

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart')
    }
  }, [items, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setCheckoutData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setCheckoutData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleCardChange = (e) => {
    const { name, value } = e.target
    setCardData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // First create payment intent
    await dispatch(createPaymentIntent(checkoutData))
  }

  const processPayment = async () => {
    if (!clientSecret || !currentOrder) return

    try {
      // Simulate Stripe payment with HTTP call
      const paymentData = {
        payment_method: {
          type: 'card',
          card: {
            number: cardData.cardNumber.replace(/\s/g, ''),
            exp_month: cardData.expDate.split('/')[0],
            exp_year: cardData.expDate.split('/')[1],
            cvc: cardData.cvc
          },
          billing_details: {
            name: cardData.nameOnCard,
            email: checkoutData.customerEmail
          }
        }
      }

      // Make direct HTTP call to Stripe to confirm payment
      const response = await fetch(`https://api.stripe.com/v1/payment_intents/${clientSecret.split('_secret_')[0]}/confirm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.STRIPE_PUBLISHABLE_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          payment_method_data: JSON.stringify(paymentData.payment_method)
        })
      })

      const paymentResult = await response.json()

      if (paymentResult.status === 'succeeded') {
        // Confirm payment with our backend
        const result = await dispatch(confirmPayment({
          paymentIntentId: paymentResult.id,
          orderId: currentOrder._id
        }))

        if (result.payload.success) {
          navigate('/order-success', { state: { orderId: currentOrder._id } })
        }
      } else {
        alert('Payment failed: ' + (paymentResult.error?.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment processing failed. Please try again.')
    }
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <h1>Checkout</h1>
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <button onClick={() => navigate('/products')} className="btn-primary">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>
        
        <div className="checkout-content">
          <div className="checkout-form">
            {!clientSecret ? (
              <form onSubmit={handleSubmit}>
                <div className="form-section">
                  <h3>Contact Information</h3>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={checkoutData.customerEmail}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="customerName"
                      value={checkoutData.customerName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3>Shipping Address</h3>
                  <div className="form-group">
                    <label>Street Address</label>
                    <input
                      type="text"
                      name="shippingAddress.street"
                      value={checkoutData.shippingAddress.street}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        name="shippingAddress.city"
                        value={checkoutData.shippingAddress.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        name="shippingAddress.state"
                        value={checkoutData.shippingAddress.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>ZIP Code</label>
                      <input
                        type="text"
                        name="shippingAddress.zipCode"
                        value={checkoutData.shippingAddress.zipCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Country</label>
                      <input
                        type="text"
                        name="shippingAddress.country"
                        value={checkoutData.shippingAddress.country}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <button type="submit" disabled={isLoading} className="btn-primary">
                  {isLoading ? 'Processing...' : 'Continue to Payment'}
                </button>
              </form>
            ) : (
              <div className="payment-section">
                <h3>Payment Information</h3>
                
                <div className="form-group">
                  <label>Name on Card</label>
                  <input
                    type="text"
                    name="nameOnCard"
                    value={cardData.nameOnCard}
                    onChange={handleCardChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={cardData.cardNumber}
                    onChange={handleCardChange}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Expiration Date</label>
                    <input
                      type="text"
                      name="expDate"
                      value={cardData.expDate}
                      onChange={handleCardChange}
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>CVC</label>
                    <input
                      type="text"
                      name="cvc"
                      value={cardData.cvc}
                      onChange={handleCardChange}
                      placeholder="123"
                      required
                    />
                  </div>
                </div>

                <button 
                  onClick={processPayment} 
                  disabled={isLoading}
                  className="pay-now-btn"
                >
                  {isLoading ? 'Processing Payment...' : `Pay $${total.toFixed(2)}`}
                </button>
              </div>
            )}
          </div>

          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="order-items">
              {items.map((item) => (
                <div key={item._id} className="order-item">
                  <img src={item.product.image} alt={item.product.name} />
                  <div className="item-details">
                    <h4>{item.product.name}</h4>
                    <p>Qty: {item.quantity}</p>
                    <p>${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="total-row final">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage