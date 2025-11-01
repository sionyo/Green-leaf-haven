import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout, fetchProfile } from '../../store/slices/authSlice'

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isLoading, token } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!token) {
      navigate('/admin/login')
      return
    }
    dispatch(fetchProfile())
  }, [dispatch, navigate, token])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/admin/login')
  }

  const navigateToProducts = () => {
    navigate('/admin/products')
  }

  if (isLoading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.email}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>
      <main className="dashboard-content">
        <div className="dashboard-grid">
          <div className="dashboard-card" onClick={navigateToProducts} style={{cursor: 'pointer'}}>
            <h3>Manage Products</h3>
            <p>Add, edit, or remove products from your store</p>
          </div>
          <div className="dashboard-card">
            <h3>Orders</h3>
            <p>View and manage customer orders</p>
          </div>
          <div className="dashboard-card">
            <h3>Analytics</h3>
            <p>View store performance and sales data</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard