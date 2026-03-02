'use client';

import { useState } from 'react';
import { useFinanceStore, getMonthlyStats } from '@/lib/financeStore';
import { EXPENSE_CATEGORIES, CATEGORY_ICONS, MONTHS_ES, PaymentMethod } from '@/types/finance';
import Icon, { IconName } from '@/components/Icon';

export default function GastosPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear]   = useState(now.getFullYear());
  const { transactions, isLoaded, addTransaction, deleteTransaction } = useFinanceStore();

  const [form, setForm] = useState({
    amount: '',
    description: '',
    note: '',
    category: EXPENSE_CATEGORIES[0],
    date: now.toISOString().slice(0, 10),
    paymentMethod: 'cash' as PaymentMethod,
  });
  const [customCategory, setCustomCategory] = useState('');
  const [success, setSuccess] = useState(false);

  const stats    = getMonthlyStats(transactions, month, year);
  const expenses = stats.transactions.filter((t) => t.type === 'expense');

  const fmt = (n: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.amount || parseFloat(form.amount) <= 0) return;
    const finalCategory = form.category === 'Otro' && customCategory.trim()
      ? customCategory.trim()
      : form.category;
    addTransaction({
      type: 'expense', amount: parseFloat(form.amount),
      category: finalCategory, description: form.description || finalCategory,
      note: form.note.trim() || undefined,
      date: form.date, paymentMethod: form.paymentMethod,
    });
    setForm({ ...form, amount: '', description: '', note: '' });
    setCustomCategory('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2200);
  }

  function changeMonth(dir: number) {
    let m = month + dir, y = year;
    if (m > 11) { m = 0; y++; } if (m < 0) { m = 11; y--; }
    setMonth(m); setYear(y);
  }

  return (
    <div className="page-animate">
      <header className="page-header">
        <p className="page-subtitle">¿En qué gastaste hoy?</p>
        <h1 className="page-title">Gastos</h1>
      </header>

      <div className="page-content">
        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-group">
            <label className="form-label">Monto ($)</label>
            <input id="expense-amount" type="number" inputMode="decimal" step="0.01" min="0"
              className="form-input" placeholder="0"
              value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          </div>

          <div className="form-group">
            <label className="form-label">¿Cómo pagaste?</label>
            <div className="payment-toggle">
              <button type="button"
                className={`payment-option ${form.paymentMethod === 'cash' ? 'selected' : ''}`}
                onClick={() => setForm({ ...form, paymentMethod: 'cash' })}>
                <Icon name="banknote" size={16} /> Efectivo
              </button>
              <button type="button"
                className={`payment-option ${form.paymentMethod === 'transfer' ? 'selected' : ''}`}
                onClick={() => setForm({ ...form, paymentMethod: 'transfer' })}>
                <Icon name="creditcard" size={16} /> Transferencia
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Categoría</label>
            <select id="expense-category" className="form-input"
              value={form.category}
              onChange={(e) => {
                setForm({ ...form, category: e.target.value as typeof form.category });
                if (e.target.value !== 'Otro') setCustomCategory('');
              }}>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {form.category === 'Otro' && (
              <input
                autoFocus
                type="text"
                className="form-input"
                placeholder="¿Cuál categoría? Ej: Mascotas, Barbería..."
                value={customCategory}
                onChange={e => setCustomCategory(e.target.value)}
                style={{ marginTop: 8 }}
              />
            )}
          </div>

          <div className="form-group">
            <label className="form-label">¿Dónde? / Descripción</label>
            <input id="expense-description" type="text" className="form-input"
              placeholder="Ej: Supermercado"
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Nota (opcional)</label>
            <textarea id="expense-note" className="form-input" rows={2}
              placeholder="Ej: Cena con clientes, pago adelantado..."
              value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })}
              style={{ resize: 'none', paddingTop: 10, paddingBottom: 10, lineHeight: 1.45 }} />
          </div>

          <div className="form-group">
            <label className="form-label">Fecha</label>
            <input id="expense-date" type="date" className="form-input"
              value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          </div>

          <button type="submit" className="btn btn-red" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {success ? <><Icon name="checkmark-circle" size={18} color="#fff" /> ¡Guardado!</> : <><Icon name="plus-circle" size={18} color="#fff" /> Agregar Gasto</>}
          </button>
        </form>

        <div className="month-selector">
          <button className="month-btn" onClick={() => changeMonth(-1)}><Icon name="chevron-left" size={18} /></button>
          <span className="month-label">{MONTHS_ES[month]} {year}</span>
          <button className="month-btn" onClick={() => changeMonth(1)}><Icon name="chevron-right" size={18} /></button>
        </div>

        <div className="monthly-total-card monthly-expense-card">
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'rgba(255,59,48,0.7)', marginBottom: 4 }}>
              Total {MONTHS_ES[month]}
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, color: '#FF3B30', letterSpacing: '-1px' }}>
              {isLoaded ? fmt(stats.totalExpense) : '—'}
            </div>
          </div>
          <Icon name="arrow-down-circle" size={44} color="rgba(255,59,48,0.3)" />
        </div>

        {isLoaded && (
          expenses.length === 0
            ? <div className="empty-state">
                <div className="empty-state-icon"><Icon name="arrow-down-circle" size={48} color="rgba(0,0,0,0.15)" /></div>
                <p className="empty-state-text">No hay gastos en<br />{MONTHS_ES[month]} {year}.</p>
              </div>
            : <div className="tx-group-card">
                {expenses.map((tx) => (
                  <div key={tx.id} className="tx-item">
                    <div className="tx-icon tx-icon-expense">
                      <Icon name={(CATEGORY_ICONS[tx.category] ?? 'package') as IconName} size={18} color="#FF3B30" />
                    </div>
                    <div className="tx-info">
                      <div className="tx-desc">{tx.description}</div>
                      <div className="tx-meta">
                        {tx.category} · {tx.date}
                        <span className={`method-badge ${tx.paymentMethod}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                          <Icon name={tx.paymentMethod === 'cash' ? 'banknote' : 'creditcard'} size={10} />
                        </span>
                      </div>
                      {tx.note && <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.4)', marginTop: 2, fontStyle: 'italic' }}>📝 {tx.note}</div>}
                    </div>
                    <span className="tx-amount tx-amount-expense">−{fmt(tx.amount)}</span>
                    <button className="tx-delete-btn" onClick={() => deleteTransaction(tx.id)}>
                      <Icon name="trash" size={16} color="var(--ios-red)" />
                    </button>
                  </div>
                ))}
              </div>
        )}
      </div>
    </div>
  );
}
