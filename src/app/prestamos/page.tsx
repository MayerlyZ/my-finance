'use client';

import { useState } from 'react';
import { useFinanceStore } from '@/lib/financeStore';
import { LoanType } from '@/types/finance';
import Icon from '@/components/Icon';

type FilterLoan = 'all' | LoanType;

export default function PrestamosPage() {
  const { loans, isLoaded, addLoan, updateLoanStatus, deleteLoan } = useFinanceStore();

  const [filter, setFilter] = useState<FilterLoan>('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    type: 'given' as LoanType, person: '', amount: '',
    date: new Date().toISOString().slice(0, 10), dueDate: '', note: '',
  });
  const [success, setSuccess] = useState(false);

  const fmt = (n: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

  const filtered = loans.filter(l => filter === 'all' || l.type === filter);
  const pendingGiven    = loans.filter(l => l.type === 'given'    && l.status === 'pending').reduce((s, l) => s + l.amount, 0);
  const pendingReceived = loans.filter(l => l.type === 'received' && l.status === 'pending').reduce((s, l) => s + l.amount, 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.person || !form.amount) return;
    addLoan({ type: form.type, person: form.person, amount: parseFloat(form.amount), date: form.date, dueDate: form.dueDate || undefined, note: form.note || undefined });
    setForm({ type: 'given', person: '', amount: '', date: new Date().toISOString().slice(0, 10), dueDate: '', note: '' });
    setShowForm(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  }

  function getInitial(name: string) { return name.trim().charAt(0).toUpperCase() || '?'; }

  return (
    <div className="page-animate">
      <header className="page-header">
        <p className="page-subtitle">Controla lo que prestas y lo que te deben</p>
        <h1 className="page-title">Préstamos</h1>
      </header>

      <div className="page-content">
        {/* Summary */}
        <div className="loan-summary">
          <div className="loan-sum-card">
            <div className="loan-sum-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <Icon name="arrow-up-circle" size={12} color="var(--ios-orange)" /> Me deben
            </div>
            <div className="loan-sum-amount" style={{ color: 'var(--ios-orange)' }}>{fmt(pendingGiven)}</div>
          </div>
          <div className="loan-sum-card">
            <div className="loan-sum-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <Icon name="arrow-down-circle" size={12} color="var(--ios-purple)" /> Debo
            </div>
            <div className="loan-sum-amount" style={{ color: 'var(--ios-purple)' }}>{fmt(pendingReceived)}</div>
          </div>
          <div className="loan-sum-card">
            <div className="loan-sum-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <Icon name="arrow-swap" size={12} color="var(--text-secondary)" /> Neto
            </div>
            <div className="loan-sum-amount" style={{ color: pendingGiven - pendingReceived >= 0 ? 'var(--ios-green)' : 'var(--ios-red)' }}>
              {fmt(pendingGiven - pendingReceived)}
            </div>
          </div>
        </div>

        {!showForm && (
          <button className="btn btn-green" style={{ marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            onClick={() => setShowForm(true)}>
            {success ? <><Icon name="checkmark-circle" size={18} color="#fff" /> ¡Guardado!</> : <><Icon name="plus-circle" size={18} color="#fff" /> Registrar Préstamo</>}
          </button>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="form-card">
            <div className="form-group">
              <label className="form-label">Tipo de préstamo</label>
              <div className="payment-toggle">
                <button type="button" className={`payment-option ${form.type === 'given' ? 'selected' : ''}`}
                  onClick={() => setForm({ ...form, type: 'given' })}>
                  <Icon name="arrow-up-circle" size={16} /> Presté yo
                </button>
                <button type="button" className={`payment-option ${form.type === 'received' ? 'selected' : ''}`}
                  onClick={() => setForm({ ...form, type: 'received' })}>
                  <Icon name="arrow-down-circle" size={16} /> Me prestaron
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{form.type === 'given' ? 'Prestado a' : 'Prestado por'}</label>
              <input className="form-input" placeholder="Nombre de la persona"
                value={form.person} onChange={e => setForm({ ...form, person: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Monto ($)</label>
              <input className="form-input" type="number" inputMode="decimal" placeholder="0"
                value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Fecha del préstamo</label>
              <input className="form-input" type="date"
                value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Fecha límite (opcional)</label>
              <input className="form-input" type="date"
                value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Nota (opcional)</label>
              <input className="form-input" placeholder="Ej: Para emergencia médica"
                value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="btn btn-green" style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Icon name="checkmark-circle" size={17} color="#fff" /> Registrar
              </button>
              <button type="button" className="btn"
                style={{ flex: 1, background: 'rgba(0,0,0,0.06)', color: 'var(--text-secondary)', boxShadow: 'none' }}
                onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          </form>
        )}

        <div className="filter-row">
          {(['all', 'given', 'received'] as FilterLoan[]).map(f => (
            <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'Todos' : f === 'given' ? 'Presté' : 'Me prestaron'}
            </button>
          ))}
        </div>

        {isLoaded && (
          filtered.length === 0
            ? <div className="empty-state">
                <div className="empty-state-icon"><Icon name="handshake" size={48} color="rgba(0,0,0,0.15)" /></div>
                <p className="empty-state-text">No hay préstamos registrados.</p>
              </div>
            : filtered.map((loan) => (
                <div key={loan.id} className={`loan-card ${loan.type} ${loan.status}`}>
                  <div className="loan-avatar">{getInitial(loan.person)}</div>
                  <div className="loan-info">
                    <div className="loan-person">{loan.person}</div>
                    <div className="loan-meta" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {loan.type === 'given'
                        ? <><Icon name="arrow-up-circle" size={11} color="var(--ios-orange)" /> Presté</>
                        : <><Icon name="arrow-down-circle" size={11} color="var(--ios-purple)" /> Me prestaron</>}
                      · {loan.date}
                      {loan.dueDate && <><Icon name="calendar" size={11} color="var(--text-secondary)" style={{ marginLeft: 4 }} /> {loan.dueDate}</>}
                    </div>
                    {loan.note && <div className="loan-note">"{loan.note}"</div>}
                    <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                      {loan.status === 'pending' && (
                        <button className="loan-action-btn" style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                          onClick={() => updateLoanStatus(loan.id, 'paid')}>
                          <Icon name="checkmark-circle" size={14} color="var(--ios-blue)" /> Marcar pagado
                        </button>
                      )}
                      {loan.status === 'paid' && (
                        <button className="loan-action-btn" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}
                          onClick={() => updateLoanStatus(loan.id, 'pending')}>
                          Deshacer
                        </button>
                      )}
                      <button className="loan-action-btn" style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                        onClick={() => deleteLoan(loan.id)}>
                        <Icon name="trash" size={14} color="var(--ios-red)" />
                      </button>
                    </div>
                  </div>
                  <div className="loan-right">
                    <div className={`loan-amount ${loan.type === 'given' ? 'loan-given-amount' : 'loan-received-amount'}`}>
                      {fmt(loan.amount)}
                    </div>
                    <span className={`loan-badge ${loan.status}`}>
                      {loan.status === 'pending' ? 'Pendiente' : 'Pagado'}
                    </span>
                  </div>
                </div>
              ))
        )}
      </div>
    </div>
  );
}
