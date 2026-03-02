'use client';

import { useState } from 'react';
import { useFinanceStore, useBudgetStore, getMonthlyStats } from '@/lib/financeStore';
import { EXPENSE_CATEGORIES, CATEGORY_ICONS } from '@/types/finance';
import Icon, { IconName } from '@/components/Icon';

export default function PresupuestoPage() {
  const now = new Date();
  const { transactions } = useFinanceStore();
  const { budgets, isLoaded, setBudget, clearBudget } = useBudgetStore();
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [editVal, setEditVal] = useState('');

  const stats = getMonthlyStats(transactions, now.getMonth(), now.getFullYear());

  const fmt = (n: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

  function startEdit(cat: string) {
    setEditingCat(cat);
    setEditVal(budgets[cat] ? String(budgets[cat]) : '');
  }

  function commitEdit(cat: string) {
    const val = parseFloat(editVal);
    if (!isNaN(val) && val > 0) setBudget(cat, val);
    else if (editVal === '' || val === 0) clearBudget(cat);
    setEditingCat(null);
  }

  const totalBudget = Object.values(budgets).reduce((a, b) => a + b, 0);
  const totalSpent  = EXPENSE_CATEGORIES.reduce((s, cat) => s + (stats.expensesByCategory[cat] ?? 0), 0);

  return (
    <div className="page-animate">
      <header className="page-header">
        <p className="page-subtitle">Controla cuánto puedes gastar</p>
        <h1 className="page-title">Presupuestos</h1>
      </header>

      <div className="page-content">
        {/* Monthly overview */}
        {totalBudget > 0 && (
          <div style={{
            background: 'linear-gradient(135deg,rgba(0,122,255,0.12),rgba(0,122,255,0.04))',
            border: '1.5px solid rgba(0,122,255,0.2)',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            borderRadius: 'var(--radius-xl)', padding: '18px 20px', marginBottom: 14,
          }}>
            <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'rgba(0,122,255,0.7)' }}>
              Este mes · {new Date().toLocaleString('es-CO', { month: 'long' })}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>Gastado</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: totalSpent > totalBudget ? '#FF3B30' : '#FF9500', letterSpacing: '-0.5px' }}>{fmt(totalSpent)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>Presupuesto total</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--ios-blue)', letterSpacing: '-0.5px' }}>{fmt(totalBudget)}</div>
              </div>
            </div>
            {/* Global progress bar */}
            <div style={{ height: 6, background: 'rgba(0,0,0,0.07)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 3,
                width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%`,
                background: totalSpent > totalBudget ? '#FF3B30' : totalSpent / totalBudget > 0.8 ? '#FF9500' : '#34C759',
                transition: 'width 0.5s ease',
              }} />
            </div>
            <p style={{ margin: '6px 0 0', fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>
              {totalBudget - totalSpent > 0 ? `Disponible: ${fmt(totalBudget - totalSpent)}` : `Excedido por ${fmt(totalSpent - totalBudget)}`}
            </p>
          </div>
        )}

        <div className="info-banner healthy" style={{ marginBottom: 14 }}>
          <Icon name="info" size={16} color="rgba(0,120,60,0.7)" />
          <span>Toca el monto de cada categoría para establecer un límite mensual.</span>
        </div>

        <div className="tx-group-card">
          {isLoaded && EXPENSE_CATEGORIES.map(cat => {
            const budget  = budgets[cat] ?? 0;
            const spent   = stats.expensesByCategory[cat] ?? 0;
            const pct     = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
            const over    = budget > 0 && spent > budget;
            const warning = budget > 0 && !over && pct >= 80;
            const barColor = over ? '#FF3B30' : warning ? '#FF9500' : '#34C759';

            return (
              <div key={cat} className="fixed-expense-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8, padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="fixed-icon-wrap">
                    <Icon name={(CATEGORY_ICONS[cat] ?? 'package') as IconName} size={20}
                      color={budget > 0 ? 'var(--ios-blue)' : 'var(--text-secondary)'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{cat}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      Gastado: <strong style={{ color: over ? '#FF3B30' : 'var(--text-primary)' }}>{fmt(spent)}</strong>
                    </div>
                  </div>

                  {/* Status badge */}
                  {over && <span style={{ fontSize: 10, fontWeight: 700, color: '#FF3B30', background: 'rgba(255,59,48,0.1)', padding: '2px 7px', borderRadius: 8 }}>EXCEDIDO</span>}
                  {warning && <span style={{ fontSize: 10, fontWeight: 700, color: '#FF9500', background: 'rgba(255,149,0,0.1)', padding: '2px 7px', borderRadius: 8 }}>80%+</span>}

                  {/* Budget amount — tap to edit */}
                  {editingCat === cat ? (
                    <input autoFocus className="fixed-amount-input" type="number" inputMode="decimal"
                      placeholder="Límite $" value={editVal}
                      onChange={e => setEditVal(e.target.value)}
                      onBlur={() => commitEdit(cat)}
                      onKeyDown={e => { if (e.key === 'Enter') commitEdit(cat); }}
                      style={{ width: 110, background: 'rgba(0,122,255,0.07)', borderRadius: 8, padding: '4px 8px', border: '1.5px solid rgba(0,122,255,0.3)', fontSize: 14 }}
                    />
                  ) : (
                    <button onClick={() => startEdit(cat)} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'right' }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: budget > 0 ? 'var(--ios-blue)' : 'var(--text-tertiary)' }}>
                        {budget > 0 ? fmt(budget) : 'Sin límite'}
                      </span>
                    </button>
                  )}
                </div>

                {/* Progress bar (only if budget set) */}
                {budget > 0 && (
                  <div style={{ height: 5, background: 'rgba(0,0,0,0.07)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 3,
                      width: `${pct}%`,
                      background: barColor,
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
