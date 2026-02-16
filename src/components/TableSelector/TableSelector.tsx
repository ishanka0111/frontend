/**
 * Table ID Selector Component
 * Allows customers to select/change their table number
 */

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../Button/Button';
import './TableSelector.css';

interface TableSelectorProps {
  onClose?: () => void;
}

const TableSelector: React.FC<TableSelectorProps> = ({ onClose }) => {
  const { tableId, setTableId } = useAuth();
  const [selectedTable, setSelectedTable] = useState<string>(tableId?.toString() || '');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedTable || selectedTable.trim() === '') {
      setError('Please enter a table number');
      return;
    }

    const tableNum = Number.parseInt(selectedTable);
    if (Number.isNaN(tableNum) || tableNum < 1 || tableNum > 50) {
      setError('Please enter a valid table number (1-50)');
      return;
    }

    setTableId(tableNum);
    setError('');
    if (onClose) onClose();
  };

  return (
    <div className="table-selector">
      <div className="table-selector__content">
        <h2 className="table-selector__title">Select Table</h2>
        <p className="table-selector__description">
          {tableId 
            ? `You are currently at Table ${tableId}. Change table?`
            : 'Please select your table number to continue.'
          }
        </p>

        <form onSubmit={handleSubmit} className="table-selector__form">
          <div className="table-selector__input-group">
            <label htmlFor="tableNumber" className="table-selector__label">
              Table Number
            </label>
            <input
              type="number"
              id="tableNumber"
              min="1"
              max="50"
              value={selectedTable}
              onChange={(e) => {
                setSelectedTable(e.target.value);
                setError('');
              }}
              className="table-selector__input"
              placeholder="Enter table number (1-50)"
              autoFocus
            />
            {error && <p className="table-selector__error">{error}</p>}
          </div>

          <div className="table-selector__actions">
            <Button type="submit" variant="primary">
              {tableId ? 'Change Table' : 'Confirm Table'}
            </Button>
            {onClose && (
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
            )}
          </div>
        </form>

        {!tableId && (
          <div className="table-selector__info">
            <p className="table-selector__info-text">
              💡 Tip: You can also scan the QR code on your table to automatically set your table number.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableSelector;
