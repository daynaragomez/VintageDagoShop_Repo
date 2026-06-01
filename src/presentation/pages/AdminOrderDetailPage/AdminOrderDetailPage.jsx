import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOrder, updateOrderStatus } from '../../../infrastructure/api/orderService';
import AdminPageLayout from '../../components/layout/AdminPageLayout/AdminPageLayout';
import './AdminOrderDetailPage.css';

const VALID_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const STATUS_LABELS = {
  pending:   'Pending',
  confirmed: 'Confirmed',
  shipped:   'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [saving, setSaving]     = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    fetchOrder(id)
      .then(setOrder)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleStatusChange(e) {
    const newStatus = e.target.value;
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await updateOrderStatus(id, newStatus);
      setOrder((prev) => ({ ...prev, status: updated.status }));
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AdminPageLayout title="Order detail" backTo="/admin/orders" backLabel="Back to orders"><div className="order-detail-loading">Loading order…</div></AdminPageLayout>;
  if (error)   return <AdminPageLayout title="Order detail" backTo="/admin/orders" backLabel="Back to orders"><div className="order-detail-error">Error: {error}</div></AdminPageLayout>;
  if (!order)  return null;

  return (
    <AdminPageLayout
      title={`Order #${order.id}`}
      subtitle={`Placed on ${new Date(order.created_at).toLocaleString()}`}
      backTo="/admin/orders"
      backLabel="Back to orders"
    >
    <div className="order-detail">

      <section className="order-detail__section">
        <h2>Status</h2>
        <div className="order-detail__status-row">
          <select
            className={`order-detail__status-select order-detail__status-select--${order.status}`}
            value={order.status}
            onChange={handleStatusChange}
            disabled={saving}
            data-testid="status-select"
          >
            {VALID_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
          {saving && <span className="order-detail__saving">Saving…</span>}
          {saveError && <span className="order-detail__save-error">{saveError}</span>}
        </div>
      </section>

      <section className="order-detail__section">
        <h2>Customer</h2>
        <p>{order.customer_name}</p>
        <p>{order.customer_email}</p>
        {order.customer_phone && <p>{order.customer_phone}</p>}
      </section>

      <section className="order-detail__section">
        <h2>Shipping Address</h2>
        <p>{order.street}</p>
        <p>{order.city}{order.state ? `, ${order.state}` : ''} {order.zip_code}</p>
        <p>{order.country}</p>
      </section>

      <section className="order-detail__section">
        <h2>Items</h2>
        <table className="order-detail__items-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Unit Price</th>
              <th>Qty</th>
              <th>Line Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.product_id}>
                <td>{item.product_name}</td>
                <td>${Number(item.unit_price).toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td>${(item.unit_price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="order-detail__totals">
        <div className="order-detail__totals-row">
          <span>Subtotal</span>
          <span>${Number(order.subtotal).toFixed(2)}</span>
        </div>
        <div className="order-detail__totals-row">
          <span>Tax (15%)</span>
          <span>${Number(order.tax).toFixed(2)}</span>
        </div>
        <div className="order-detail__totals-row order-detail__totals-row--total">
          <span>Total</span>
          <span>${Number(order.total).toFixed(2)}</span>
        </div>
      </section>
    </div>
    </AdminPageLayout>
  );
}
