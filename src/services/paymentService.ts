// ============================================
// TYPES & INTERFACES
// ============================================

export interface CreatePaymentRequest {
  orderId: string;
  amount: number;
  currency?: string;
}

export interface CreatePaymentResponse {
  orderId: string;
  approvalLink: string;
  paymentId?: string;
  expiresAt?: string;
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface PaymentDetails {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  approvalLink: string;
  createdAt: string;
  completedAt?: string;
}

// ============================================
// MOCK DATA PERSISTENCE
// ============================================

// In-memory storage for payments
let mockPayments: Map<string, PaymentDetails> = new Map();
let nextPaymentId = 1;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Simulates API delay for realistic behavior
 */
const simulateDelay = (min: number = 200, max: number = 500): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

/**
 * Generates a mock PayPal approval link
 */
const generateApprovalLink = (paymentId: string): string => {
  // In production, this will be a real PayPal approval URL
  return `https://www.sandbox.paypal.com/checkoutnow?token=EC-${paymentId}`;
};

// ============================================
// PAYMENT API ENDPOINTS
// ============================================

/**
 * POST /payments/create
 * Creates a new payment session (No JWT required - PayPal handles its own auth)
 * 
 * @param orderId - Order ID to create payment for
 * @param amount - Payment amount (optional, for validation)
 * @returns Payment ID and approval link for PayPal redirect
 */
const createPayment = async (
  orderId: string,
  amount?: number
): Promise<CreatePaymentResponse> => {
  await simulateDelay();
  
  // TODO: Replace with real API call
  // const response = await fetch('/payments/create', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ orderId, amount }),
  // });
  // if (!response.ok) throw new Error('Failed to create payment');
  // return response.json();
  
  // Validate order ID
  if (!orderId || orderId.trim() === '') {
    throw new Error('Order ID is required');
  }
  
  // Generate payment ID (mock PayPal transaction ID)
  const paymentId = `PAYPAL-${String(nextPaymentId++).padStart(8, '0')}`;
  
  // Create payment details
  const payment: PaymentDetails = {
    paymentId,
    orderId,
    amount: amount || 0,
    currency: 'USD',
    status: PaymentStatus.PENDING,
    approvalLink: generateApprovalLink(paymentId),
    createdAt: new Date().toISOString(),
  };
  
  // Store payment
  mockPayments.set(paymentId, payment);
  
  console.log('[paymentService] Payment created:', paymentId, 'for order:', orderId);
  
  // Return approval link for redirect
  return {
    orderId: paymentId, // PayPal transaction ID (not order ID)
    approvalLink: payment.approvalLink,
    paymentId,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
  };
};

/**
 * Simulates payment approval (for testing)
 * In production, PayPal will redirect back to success/cancel URLs
 */
const approvePayment = async (paymentId: string): Promise<PaymentDetails> => {
  await simulateDelay(500, 1000);
  
  const payment = mockPayments.get(paymentId);
  if (!payment) {
    throw new Error(`Payment not found: ${paymentId}`);
  }
  
  payment.status = PaymentStatus.APPROVED;
  payment.completedAt = new Date().toISOString();
  mockPayments.set(paymentId, payment);
  
  console.log('[paymentService] Payment approved:', paymentId);
  return payment;
};

/**
 * Cancels a payment (for testing)
 */
const cancelPayment = async (paymentId: string): Promise<PaymentDetails> => {
  await simulateDelay();
  
  const payment = mockPayments.get(paymentId);
  if (!payment) {
    throw new Error(`Payment not found: ${paymentId}`);
  }
  
  payment.status = PaymentStatus.CANCELLED;
  mockPayments.set(paymentId, payment);
  
  console.log('[paymentService] Payment cancelled:', paymentId);
  return payment;
};

/**
 * Gets payment details
 */
const getPaymentDetails = async (paymentId: string): Promise<PaymentDetails> => {
  await simulateDelay();
  
  const payment = mockPayments.get(paymentId);
  if (!payment) {
    throw new Error(`Payment not found: ${paymentId}`);
  }
  
  return payment;
};

// ============================================
// ADDITIONAL HELPERS
// ============================================

/**
 * Resets all mock data (for testing)
 */
const resetMockData = (): void => {
  mockPayments.clear();
  nextPaymentId = 1;
  console.log('[paymentService] Mock data reset to initial state');
};

// ============================================
// EXPORTED SERVICE
// ============================================

export const paymentService = {
  // API endpoints
  createPayment,
  
  // Testing helpers (not part of production API)
  approvePayment,
  cancelPayment,
  getPaymentDetails,
  resetMockData,
};
