/**
 * Cashier Receive Cash - Scan waiter QR codes and confirm cash receipt
 */

import React, { useState, useMemo } from 'react';
import {
  IoCashOutline,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoHelpCircleOutline,
  IoQrCodeOutline,
  IoReceiptOutline,
  IoSearchOutline,
  IoStatsChartOutline,
} from 'react-icons/io5';
import { Layout } from '../../components';
import './CashierReceiveCash.css';

interface PendingCashCollection {
  id: string;
  orderId: string;
  tableId: string;
  customerName: string;
  totalAmount: number;
  timestamp: string;
  status: 'PENDING' | 'COMPLETED';
}

interface ReceivedCash {
  collectionId: string;
  orderId: string;
  tableId: string;
  customerName: string;
  amount: number;
  receivedAt: string;
  receivedBy: string;
}

interface QRPaymentData {
  collectionId: string;
  orderId: string;
  tableId: string;
  customerName: string;
  amount: number;
  timestamp: string;
  type: string;
}

const WAITER_STORAGE_KEY = 'waiter_pending_cash_collections';
const CASHIER_STORAGE_KEY = 'cashier_received_cash';

// Helper to load received cash from localStorage
const loadReceivedCash = (): ReceivedCash[] => {
  try {
    const stored = localStorage.getItem(CASHIER_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as ReceivedCash[];
    }
  } catch (err) {
    console.error('Failed to load received cash:', err);
  }
  return [];
};

const CashierReceiveCash: React.FC = () => {
  const [qrInput, setQrInput] = useState<string>('');
  const [scannedData, setScannedData] = useState<QRPaymentData | null>(null);
  const [receivedCashList, setReceivedCashList] = useState<ReceivedCash[]>(loadReceivedCash);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  // Calculate total received today using useMemo
  const totalReceived = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return receivedCashList
      .filter(r => r.receivedAt.startsWith(today))
      .reduce((sum, r) => sum + r.amount, 0);
  }, [receivedCashList]);

  // Save received cash to localStorage
  const saveReceivedCash = (newCash: ReceivedCash) => {
    const updated = [...receivedCashList, newCash];
    setReceivedCashList(updated);
    localStorage.setItem(CASHIER_STORAGE_KEY, JSON.stringify(updated));
  };

  const handleScanQR = () => {
    if (!qrInput.trim()) {
      alert('Please paste QR code data');
      return;
    }

    try {
      const data = JSON.parse(qrInput);
      
      if (data.type !== 'PROXY_ORDER_PAYMENT') {
        alert('Invalid QR code type');
        return;
      }

      // Check if already received
      const alreadyReceived = receivedCashList.find(
        r => r.collectionId === data.collectionId
      );
      
      if (alreadyReceived) {
        alert(
          `This payment was already received on ${new Date(alreadyReceived.receivedAt).toLocaleString()}`
        );
        return;
      }

      setScannedData(data);
      setShowConfirmModal(true);
    } catch (err) {
      console.error('QR parsing error:', err);
      alert('Invalid QR code format. Please scan a valid waiter QR code.');
    }
  };

  const handleConfirmReceipt = () => {
    if (!scannedData) return;

    const receivedCash: ReceivedCash = {
      collectionId: scannedData.collectionId,
      orderId: scannedData.orderId,
      tableId: scannedData.tableId,
      customerName: scannedData.customerName,
      amount: scannedData.amount,
      receivedAt: new Date().toISOString(),
      receivedBy: 'Cashier', // In real app, use logged-in user
    };

    // Save to cashier records
    saveReceivedCash(receivedCash);

    // Remove from waiter's pending list
    removeFromWaiterPendingList(scannedData.collectionId);

    alert(
      `Cash Received Successfully!\nOrder #${scannedData.orderId}\nAmount: $${scannedData.amount.toFixed(2)}`
    );

    // Reset
    setShowConfirmModal(false);
    setScannedData(null);
    setQrInput('');
  };

  const removeFromWaiterPendingList = (collectionId: string) => {
    try {
      const stored = localStorage.getItem(WAITER_STORAGE_KEY);
      if (stored) {
        const collections = JSON.parse(stored) as PendingCashCollection[];
        const updated = collections.filter(c => c.id !== collectionId);
        localStorage.setItem(WAITER_STORAGE_KEY, JSON.stringify(updated));
      }
    } catch (error) {
      console.error('Failed to update waiter pending list:', error);
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
    setScannedData(null);
  };

  return (
    <Layout>
      <div className="cashier-receive-cash">
        <div className="page-header">
          <h1>
            <IoCashOutline className="title-icon" />
            Receive Cash from Waiters
          </h1>
          <p>Scan waiter QR codes to confirm cash collection</p>
        </div>

        {/* Today's Summary */}
        <div className="today-summary">
          <div className="summary-card total">
            <div className="summary-icon">
              <IoCashOutline />
            </div>
            <div className="summary-content">
              <div className="summary-label">Total Received Today</div>
              <div className="summary-value">${totalReceived.toFixed(2)}</div>
            </div>
          </div>
          <div className="summary-card count">
            <div className="summary-icon">
              <IoStatsChartOutline />
            </div>
            <div className="summary-content">
              <div className="summary-label">Transactions Today</div>
              <div className="summary-value">
                {receivedCashList.filter(r => 
                  r.receivedAt.startsWith(new Date().toISOString().split('T')[0])
                ).length}
              </div>
            </div>
          </div>
        </div>

        {/* QR Scanner Section */}
        <div className="scanner-section">
          <div className="scanner-card">
            <h2>
              <IoQrCodeOutline className="title-icon" />
              Scan Waiter QR Code
            </h2>
            <p className="scanner-instruction">
              Ask the waiter to show their QR code, then paste the QR data below
            </p>
            
            <div className="qr-input-group">
              <textarea
                className="qr-input"
                placeholder='Paste QR code data here (e.g., {"collectionId":"CC-123",...})'
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                rows={4}
              />
              <button 
                className="scan-btn"
                onClick={handleScanQR}
                disabled={!qrInput.trim()}
              >
                <IoSearchOutline className="btn-icon" />
                Process QR Code
              </button>
            </div>

            <div className="scanner-help">
              <h4>
                <IoHelpCircleOutline className="title-icon" />
                How to use:
              </h4>
              <ol>
                <li>Waiter shows QR code on their device</li>
                <li>Copy the QR code data from waiter's screen</li>
                <li>Paste it in the text area above</li>
                <li>Click "Process QR Code"</li>
                <li>Verify details and confirm cash receipt</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="transactions-section">
          <div className="transactions-header">
            <h2>
              <IoReceiptOutline className="title-icon" />
              Recent Cash Receipts
            </h2>
            <span className="transaction-count">
              {receivedCashList.length} total
            </span>
          </div>

          {receivedCashList.length === 0 ? (
            <div className="no-transactions">
              <p>No cash received yet</p>
              <p className="hint">Scan waiter QR codes to start receiving cash</p>
            </div>
          ) : (
            <div className="transactions-list">
              {[...receivedCashList]
                .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime())
                .slice(0, 20)
                .map((transaction) => (
                  <div key={transaction.collectionId} className="transaction-card">
                    <div className="transaction-info">
                      <div className="transaction-row">
                        <span className="label">Order ID:</span>
                        <span className="value">#{transaction.orderId}</span>
                      </div>
                      <div className="transaction-row">
                        <span className="label">Table:</span>
                        <span className="value">{transaction.tableId}</span>
                      </div>
                      <div className="transaction-row">
                        <span className="label">Customer:</span>
                        <span className="value">{transaction.customerName}</span>
                      </div>
                      <div className="transaction-row amount-row">
                        <span className="label">Amount:</span>
                        <span className="value amount">${transaction.amount.toFixed(2)}</span>
                      </div>
                      <div className="transaction-row time-row">
                        <span className="label">Received:</span>
                        <span className="value time">
                          {new Date(transaction.receivedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="transaction-status">
                      <span className="status-badge received">
                        <IoCheckmarkCircle className="status-icon" />
                        Received
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && scannedData && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>
                  <IoCashOutline className="title-icon" />
                  Confirm Cash Receipt
                </h2>
              </div>
              
              <div className="modal-content">
                <div className="verify-details">
                  <h3>Verify Payment Details:</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Order ID:</span>
                      <span className="detail-value">#{scannedData.orderId}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Table:</span>
                      <span className="detail-value">{scannedData.tableId}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Customer:</span>
                      <span className="detail-value">{scannedData.customerName}</span>
                    </div>
                    <div className="detail-item highlight">
                      <span className="detail-label">Cash Amount:</span>
                      <span className="detail-value amount">${scannedData.amount.toFixed(2)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Order Time:</span>
                      <span className="detail-value">
                        {new Date(scannedData.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="confirm-question">
                    <strong>Have you received ${scannedData.amount.toFixed(2)} in cash from the waiter?</strong>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="cancel-btn" onClick={handleCancelConfirm}>
                  <IoCloseCircle className="btn-icon" />
                  Cancel
                </button>
                <button className="confirm-btn" onClick={handleConfirmReceipt}>
                  <IoCheckmarkCircle className="btn-icon" />
                  Confirm Cash Received
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CashierReceiveCash;
