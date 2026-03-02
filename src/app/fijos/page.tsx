'use client';

import { useState } from 'react';
import { useFinanceStore } from '@/lib/financeStore';
import Icon from '@/components/Icon';

// Fixed expense icon mapping to Icon names
const FIXED_ICONS: Record<string, string> = {
  '🏠': 'house', '💡': 'zap', '🚿': 'banknote', '📡': 'creditcard',
  '📱': 'laptop', '🎬': 'film', '🎵': 'sparkles', '🚗': 'car',
  '🛡️': 'pill', '💪': 'trending-up', '📦': 'package',
};

function fixedIcon(icon: string) {
  return FIXED_ICONS[icon] ?? 'package';
}

export default function FijosPage() {
  const { fixedExpenses, isLoaded, updateFixedExpense, addFixedExpense, deleteFixedExpense } = useFinanceStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmt, setEditAmt]     = useState('');

  const [showAdd, setShowAdd] = useState(false);
  const [newForm, setNewForm] = useState({ name: '', amount: '', icon: '📦' });

  const activeExpenses = fixedExpenses.filter(f => f.active);
  const totalFixed = activeExpenses.reduce((s, f) => s + f.amount, 0);

  const fmt = (n: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

  function startEdit(id: string, amount: number) {
    setEditingId(id);
    setEditAmt(amount > 0 ? String(amount) : '');
  }

  function commitEdit(id: string) {
    const val = parseFloat(editAmt);
    if (!isNaN(val) && val >= 0) updateFixedExpense(id, { amount: val });
    setEditingId(null);
  }

  function handleAddFixed(e: React.FormEvent) {
    e.preventDefault();
    if (!newForm.name || !newForm.amount) return;
    addFixedExpense({ name: newForm.name, amount: parseFloat(newForm.amount), icon: newForm.icon, active: true, category: 'Personalizado' });
    setNewForm({ name: '', amount: '', icon: '📦' });
    setShowAdd(false);
  }

  return (
    <div className="page-animate">
      <header className="page-header">
        <p className="page-subtitle">Configura tus compromisos mensuales</p>
        <h1 className="page-title">Gastos Fijos</h1>
      </header>

      <div className="page-content">
        {totalFixed > 0 && (
          <div style={{
            background: 'linear-gradient(135deg,rgba(255,59,48,0.15),rgba(255,59,48,0.05))',
            border: '1.5px solid rgba(255,59,48,0.25)',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            borderRadius: 'var(--radius-xl)', padding: '18px 20px', marginBottom: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'rgba(255,59,48,0.7)', marginBottom: 4 }}>
                Total compromisos fijos
              </div>
              <div style={{ fontSize: 30, fontWeight: 800, color: '#FF3B30', letterSpacing: '-1px' }}>
                {fmt(totalFixed)}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', marginTop: 2 }}>
                {activeExpenses.length} gasto{activeExpenses.length !== 1 ? 's' : ''} activo{activeExpenses.length !== 1 ? 's' : ''}
              </div>
            </div>
            <Icon name="pin" size={40} color="rgba(255,59,48,0.3)" />
          </div>
        )}

        <div className="info-banner healthy" style={{ marginBottom: 14 }}>
          <Icon name="info" size={16} color="rgba(0,120,60,0.7)" />
          <span>Activa cada gasto con el toggle y pon su monto. Esto alimenta el <strong>Estudio Financiero</strong> del dashboard.</span>
        </div>

        {isLoaded && (
          <div className="tx-group-card" style={{ marginBottom: 12 }}>
            {fixedExpenses.map((fe) => (
              <div key={fe.id} className={`fixed-expense-row ${!fe.active ? 'inactive' : ''}`}>
                <div className="fixed-icon-wrap">
                  <Icon name={fixedIcon(fe.icon) as never} size={20} color={fe.active ? 'var(--ios-blue)' : 'var(--text-secondary)'} />
                </div>
                <div className="fixed-info">
                  <div className="fixed-name">{fe.name}</div>
                  {fe.active && (
                    editingId === fe.id
                      ? <input autoFocus className="fixed-amount-input" type="number" inputMode="decimal"
                          placeholder="Monto $" value={editAmt}
                          onChange={e => setEditAmt(e.target.value)}
                          onBlur={() => commitEdit(fe.id)}
                          onKeyDown={e => { if (e.key === 'Enter') commitEdit(fe.id); }}
                          style={{ background: 'rgba(0,122,255,0.06)', borderRadius: 6, padding: '2px 6px', border: '1.5px solid rgba(0,122,255,0.3)' }}
                        />
                      : <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
                          onClick={() => startEdit(fe.id, fe.amount)}>
                          <span style={{ fontSize: 13, color: fe.amount > 0 ? 'var(--ios-blue)' : 'var(--text-tertiary)', fontWeight: 600 }}>
                            {fe.amount > 0 ? fmt(fe.amount) : 'Toca para poner monto →'}
                          </span>
                        </button>
                  )}
                </div>

                <label className="ios-toggle">
                  <input type="checkbox" checked={fe.active}
                    onChange={e => {
                      updateFixedExpense(fe.id, { active: e.target.checked });
                      if (e.target.checked && fe.amount === 0) startEdit(fe.id, 0);
                    }} />
                  <span className="ios-toggle-track" />
                </label>

                {fe.category === 'Personalizado' && (
                  <button className="tx-delete-btn" onClick={() => deleteFixedExpense(fe.id)}>
                    <Icon name="trash" size={15} color="var(--ios-red)" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {!showAdd ? (
          <button className="btn btn-green"
            style={{ background: 'rgba(52,199,89,0.12)', color: 'var(--ios-green)', boxShadow: 'none', border: '1.5px dashed rgba(52,199,89,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            onClick={() => setShowAdd(true)}>
            <Icon name="plus-circle" size={18} color="var(--ios-green)" /> Agregar gasto fijo personalizado
          </button>
        ) : (
          <form onSubmit={handleAddFixed} className="add-fixed-form">
            <div style={{ marginBottom: 10 }}>
              <label className="form-label">Nombre</label>
              <input className="form-input" placeholder="Ej: Disney+" value={newForm.name}
                onChange={e => setNewForm({ ...newForm, name: e.target.value })} required />
            </div>
            <div className="add-fixed-row">
              <div style={{ flex: 1 }}>
                <label className="form-label">Monto $</label>
                <input className="form-input" type="number" inputMode="decimal" placeholder="0"
                  value={newForm.amount} onChange={e => setNewForm({ ...newForm, amount: e.target.value })} required />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button type="submit" className="btn btn-green" style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Icon name="checkmark-circle" size={17} color="#fff" /> Guardar
              </button>
              <button type="button" className="btn"
                style={{ flex: 1, background: 'rgba(0,0,0,0.06)', color: 'var(--text-secondary)', boxShadow: 'none' }}
                onClick={() => setShowAdd(false)}>Cancelar</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
