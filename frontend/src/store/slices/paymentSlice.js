import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
})

// Get session ID (same as cart)
const getSessionId = () => {
  let sessionId = localStorage.getItem('cartSessionId')
  if (!sessionId) {
    sessionId = 'guest_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('cartSessionId', sessionId)
  }
  return sessionId
}

// Async thunks
export const createPaymentIntent = createAsyncThunk(
  'payment/createPaymentIntent',
  async (checkoutData, { rejectWithValue }) => {
    try {
      const sessionId = getSessionId()
      const response = await API.post('/payment/create-payment-intent', {
        sessionId,
        ...checkoutData
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const confirmPayment = createAsyncThunk(
  'payment/confirmPayment',
  async ({ paymentIntentId, orderId }, { rejectWithValue }) => {
    try {
      const response = await API.post('/payment/confirm-payment', {
        paymentIntentId,
        orderId
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const getOrder = createAsyncThunk(
  'payment/getOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/payment/order/${orderId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const getOrdersBySession = createAsyncThunk(
  'payment/getOrdersBySession',
  async (_, { rejectWithValue }) => {
    try {
      const sessionId = getSessionId()
      const response = await API.get(`/payment/orders/${sessionId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    clientSecret: null,
    currentOrder: null,
    orders: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearPaymentData: (state) => {
      state.clientSecret = null
      state.currentOrder = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Payment Intent
      .addCase(createPaymentIntent.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.isLoading = false
        state.clientSecret = action.payload.clientSecret
        state.currentOrder = { _id: action.payload.orderId }
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload.message
      })
      // Confirm Payment
      .addCase(confirmPayment.pending, (state) => {
        state.isLoading = true
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentOrder = action.payload.order
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload.message
      })
      // Get Order
      .addCase(getOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload
      })
      // Get Orders by Session
      .addCase(getOrdersBySession.fulfilled, (state, action) => {
        state.orders = action.payload
      })
  },
})

export const { clearError, clearPaymentData } = paymentSlice.actions
export default paymentSlice.reducer