import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, createProduct, updateProduct, deleteProduct, clearError } from '../../store/slices/productSlice'

const Products = () => {
  const dispatch = useDispatch()
  const { items, isLoading, error } = useSelector((state) => state.products)
  
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    inStock: true,
    featured: false
  })

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      alert(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    const productData = {
      ...formData,
      price: parseFloat(formData.price)
    }

    if (editingProduct) {
      dispatch(updateProduct({ id: editingProduct._id, productData }))
    } else {
      dispatch(createProduct(productData))
    }

    setShowForm(false)
    setEditingProduct(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      category: '',
      inStock: true,
      featured: false
    })
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
      inStock: product.inStock,
      featured: product.featured
    })
    setShowForm(true)
  }

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(productId))
    }
  }

  return (
    <div className="admin-products">
      <div className="admin-header">
        <h2>Manage Products</h2>
        <button 
          onClick={() => setShowForm(true)} 
          className="btn-primary"
        >
          Add New Product
        </button>
      </div>

      {showForm && (
        <div className="product-form-overlay">
          <div className="product-form">
            <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Price"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Image URL"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              />
              <div className="form-checkboxes">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({...formData, inStock: e.target.checked})}
                  />
                  In Stock
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  />
                  Featured
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowForm(false)
                    setEditingProduct(null)
                    setFormData({
                      name: '',
                      description: '',
                      price: '',
                      image: '',
                      category: '',
                      inStock: true,
                      featured: false
                    })
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="products-list">
        {items.map((product) => (
          <div key={product._id} className="product-item">
            <img src={product.image} alt={product.name} />
            <div className="product-details">
              <h4>{product.name}</h4>
              <p>${product.price} • {product.category}</p>
              <p>{product.inStock ? 'In Stock' : 'Out of Stock'}</p>
            </div>
            <div className="product-actions">
              <button onClick={() => handleEdit(product)} className="btn-edit">
                Edit
              </button>
              <button onClick={() => handleDelete(product._id)} className="btn-delete">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && !isLoading && (
        <div className="no-products">
          <p>No products yet. Add your first product!</p>
        </div>
      )}
    </div>
  )
}

export default Products