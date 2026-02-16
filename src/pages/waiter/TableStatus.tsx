/**
 * Table Status - View and manage table assignments
 */

import React, { useState, useEffect } from 'react';
import {
  IoBrushOutline,
  IoCalendarOutline,
  IoCheckmarkCircle,
  IoGridOutline,
  IoLockClosedOutline,
  IoRestaurantOutline,
} from 'react-icons/io5';
import { Layout } from '../../components';
import { MOCK_ORDERS } from '../../services/mockDataGenerator';
import type { Order } from '../../services/mockDataGenerator';
import './TableStatus.css';

interface TableInfo {
  tableId: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'DIRTY';
  currentOrder: Order | null;
  occupiedTime?: string;
}

const TableStatus: React.FC = () => {
  const [tables, setTables] = useState<TableInfo[]>([]);

  useEffect(() => {
    loadTableStatus();
  }, []);

  const loadTableStatus = () => {
    const tableList: TableInfo[] = [];
    for (let i = 1; i <= 12; i++) {
      const order = MOCK_ORDERS.find((o) => o.tableId === String(i) && o.status !== 'PAID');
      
      tableList.push({
        tableId: i,
        status: order ? 'OCCUPIED' : 'AVAILABLE',
        currentOrder: order || null,
        occupiedTime: order ? new Date(order.createdAt).toLocaleTimeString() : undefined,
      });
    }
    setTables(tableList);
  };

  // Can only change status if no order assigned
  const handleChangeStatus = (tableId: number, newStatus: 'AVAILABLE' | 'RESERVED' | 'DIRTY') => {
    const table = tables.find((t) => t.tableId === tableId);
    if (table && !table.currentOrder) {
      setTables(
        tables.map((t) =>
          t.tableId === tableId ? { ...t, status: newStatus } : t
        )
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'status-available';
      case 'OCCUPIED':
        return 'status-occupied';
      case 'RESERVED':
        return 'status-reserved';
      case 'DIRTY':
        return 'status-dirty';
      default:
        return '';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return (
          <>
            <IoCheckmarkCircle className="status-icon" />
            Available
          </>
        );
      case 'OCCUPIED':
        return (
          <>
            <IoRestaurantOutline className="status-icon" />
            Occupied
          </>
        );
      case 'RESERVED':
        return (
          <>
            <IoCalendarOutline className="status-icon" />
            Reserved
          </>
        );
      case 'DIRTY':
        return (
          <>
            <IoBrushOutline className="status-icon" />
            Needs Cleaning
          </>
        );
      default:
        return 'Unknown';
    }
  };

  const stats = {
    available: tables.filter((t) => t.status === 'AVAILABLE').length,
    occupied: tables.filter((t) => t.status === 'OCCUPIED').length,
    reserved: tables.filter((t) => t.status === 'RESERVED').length,
    dirty: tables.filter((t) => t.status === 'DIRTY').length,
  };

  return (
    <Layout>
      <div className="table-status">
        <div className="page-header">
          <h1>
            <IoGridOutline className="title-icon" />
            Table Status
          </h1>
          <p>View table status • Change status only if no order assigned</p>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card available">
            <div className="stat-value">{stats.available}</div>
            <div className="stat-label">Available</div>
          </div>
          <div className="stat-card occupied">
            <div className="stat-value">{stats.occupied}</div>
            <div className="stat-label">Occupied</div>
          </div>
          <div className="stat-card reserved">
            <div className="stat-value">{stats.reserved}</div>
            <div className="stat-label">Reserved</div>
          </div>
          <div className="stat-card dirty">
            <div className="stat-value">{stats.dirty}</div>
            <div className="stat-label">Needs Cleaning</div>
          </div>
        </div>

        {/* Tables Grid */}
        <div className="tables-grid">
          {tables.map((table) => (
            <div
              key={table.tableId}
              className={`table-card ${getStatusColor(table.status)}`}
            >
              <div className="table-number">Table {table.tableId}</div>
              <div className="table-status-badge">{getStatusLabel(table.status)}</div>

              {table.currentOrder && (
                <div className="table-order-info">
                  <div className="info-row">
                    <strong>Order #{table.currentOrder.id}</strong>
                  </div>
                  <div className="info-row">
                    Items: {table.currentOrder.items.length}
                  </div>
                  <div className="info-row">
                    Total: ${table.currentOrder.totalAmount.toFixed(2)}
                  </div>
                  {table.occupiedTime && (
                    <div className="info-row time">Since {table.occupiedTime}</div>
                  )}
                  <div className="lock-notice">
                    <IoLockClosedOutline className="status-icon" />
                    Order active - status locked
                  </div>
                </div>
              )}

              {!table.currentOrder && (
                <div className="table-actions">
                  <div className="status-note">No active order - you can change status:</div>
                  {table.status !== 'AVAILABLE' && (
                    <button
                      className="status-btn available-btn"
                      onClick={() => handleChangeStatus(table.tableId, 'AVAILABLE')}
                    >
                      Mark Available
                    </button>
                  )}
                  {table.status !== 'RESERVED' && (
                    <button
                      className="status-btn reserved-btn"
                      onClick={() => handleChangeStatus(table.tableId, 'RESERVED')}
                    >
                      Mark Reserved
                    </button>
                  )}
                  {table.status !== 'DIRTY' && (
                    <button
                      className="status-btn dirty-btn"
                      onClick={() => handleChangeStatus(table.tableId, 'DIRTY')}
                    >
                      Mark Dirty
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default TableStatus;
