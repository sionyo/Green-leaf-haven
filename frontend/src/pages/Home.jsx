import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>GreenLeaf Haven</h1>
        <p className="tagline">Bring Nature Home</p>
        <div className="hero-content">
          <p>Discover beautiful plants for your home and office. 
          Fresh, healthy, and delivered to your door.</p>
          <div className="cta-buttons">
            <Link to="/products" className="cta-button">
              Shop Plants
            </Link>
            <Link to="/cart" className="cta-button secondary">
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home