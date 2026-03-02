'use client';

import { useState } from 'react';
import { useFinanceStore } from '@/lib/financeStore';
import { MONTHS_ES, CATEGORY_ICONS, TransactionType } from '@/types/finance';
import Icon, { IconName } from '@/components/Icon';

type FilterType = 'all' | TransactionType;

export default function HistorialPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear]   = useState(now.getFullYear());
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const { transactions, isLoaded, deleteTransaction } = useFinanceStore();

  const fmt = (n: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

  const monthFiltered = transactions
    .filter(tx => {
      const d = new Date(tx.date + 'T00:00:00');
      return d.getMonth() === month && d.getFullYear() === year &&
        (filter === 'all' || tx.type === filter);
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const q = search.trim().toLowerCase();
  const filtered = q
    ? monthFiltered.filter(tx =>
        tx.description.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q) ||
        (tx.note ?? '').toLowerCase().includes(q) ||
        String(tx.amount).includes(q)
      )
    : monthFiltered;

  const totalIncome  = monthFiltered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = monthFiltered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const byCash       = monthFiltered.reduce((s, t) => s + (t.paymentMethod === 'cash' ? t.amount : 0), 0);
  const byTransfer   = monthFiltered.reduce((s, t) => s + (t.paymentMethod === 'transfer' ? t.amount : 0), 0);

  function changeMonth(dir: number) {
    let m = month + dir, y = year;
    if (m > 11) { m = 0; y++; } if (m < 0) { m = 11; y--; }
    setMonth(m); setYear(y);
    setSearch('');
  }

  const groupedByDate: Record<string, typeof filtered> = {};
  filtered.forEach(tx => { if (!groupedByDate[tx.date]) groupedByDate[tx.date] = []; groupedByDate[tx.date].push(tx); });
  const dates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));

  function formatDateLabel(dateStr: string) {
    const d = new Date(dateStr + 'T00:00:00');
    const today = new Date(), yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return 'Hoy';
    if (d.toDateString() === yesterday.toDateString()) return 'Ayer';
    return d.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  return (
    <div className="page-animate">
      <header className="page-header">
        <p className="page-subtitle">Revisa todas tus transacciones</p>
        <h1 className="page-title">Historial</h1>
      </header>

      <div className="page-content">
        <div className="month-selector">
          <button className="month-btn" onClick={() => changeMonth(-1)}><Icon name="chevron-left" size={18} /></button>
          <span className="month-label">{MONTHS_ES[month]} {year}</span>
          <button className="month-btn" onClick={() => changeMonth(1)}><Icon name="chevron-right" size={18} /></button>
        </div>

        {/* ── Search Bar ── */}
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(0,0,0,0.35)', pointerEvents: 'none' }}>
            <Icon name="chart-bar" size={17} />
          </div>
          <input
            type="search"
            placeholder="Buscar por descripción, categoría o nota..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'rgba(0,0,0,0.04)',
              border: '1.5px solid rgba(0,0,0,0.08)',
              borderRadius: 14, padding: '12px 16px 12px 42px',
              fontSize: 14, fontFamily: 'inherit', color: 'rgba(0,0,0,0.88)',
              outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={e => { e.target.style.borderColor = '#007AFF'; e.target.style.boxShadow = '0 0 0 4px rgba(0,122,255,0.1)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.08)'; e.target.style.boxShadow = 'none'; }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.12)', border: 'none', borderRadius: '50%',
              width: 20, height: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="xmark-circle" size={14} color="rgba(0,0,0,0.5)" />
            </button>
          )}
        </div>

        {/* Summary pills */}
        <div className="historial-summary">
          <div className="hist-sum-pill">
            <div className="hist-sum-label">Ingresos</div>
            <div className="hist-sum-amount" style={{ color: '#34C759' }}>{fmt(totalIncome)}</div>
          </div>
          <div className="hist-sum-pill">
            <div className="hist-sum-label">Gastos</div>
            <div className="hist-sum-amount" style={{ color: '#FF3B30' }}>{fmt(totalExpense)}</div>
          </div>
          <div className="hist-sum-pill">
            <div className="hist-sum-label">Balance</div>
            <div className="hist-sum-amount" style={{ color: totalIncome - totalExpense >= 0 ? '#34C759' : '#FF3B30' }}>
              {fmt(totalIncome - totalExpense)}
            </div>
          </div>
        </div>

        {monthFiltered.length > 0 && (
          <div className="historial-summary" style={{ marginBottom: 12 }}>
            <div className="hist-sum-pill">
              <div className="hist-sum-label" style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                <Icon name="banknote" size={12} /> Efectivo
              </div>
              <div className="hist-sum-amount" style={{ color: 'var(--ios-green)', fontSize: 14 }}>{fmt(byCash)}</div>
            </div>
            <div className="hist-sum-pill">
              <div className="hist-sum-label" style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                <Icon name="creditcard" size={12} /> Transferencia
              </div>
              <div className="hist-sum-amount" style={{ color: 'var(--ios-blue)', fontSize: 14 }}>{fmt(byTransfer)}</div>
            </div>
          </div>
        )}

        <div className="filter-row">
          {(['all', 'income', 'expense'] as FilterType[]).map(f => (
            <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'Todos' : f === 'income' ? 'Ingresos' : 'Gastos'}
            </button>
          ))}
        </div>

        {/* Search result count */}
        {search && isLoaded && (
          <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', marginBottom: 8, fontWeight: 600 }}>
            {filtered.length === 0
              ? `Sin resultados para "${search}"`
              : `${filtered.length} resultado${filtered.length !== 1 ? 's' : ''} para "${search}"`}
          </p>
        )}

        {!isLoaded ? null : filtered.length === 0
          ? <div className="empty-state">
              <div className="empty-state-icon">
                {search
                  ? <Icon name="xmark-circle" size={48} color="rgba(0,0,0,0.15)" />
                  : <Icon name="chart-bar" size={48} color="rgba(0,0,0,0.15)" />
                }
              </div>
              <p className="empty-state-text">
                {search
                  ? `Sin resultados para "${search}"`
                  : `No hay transacciones\nen ${MONTHS_ES[month]} ${year}.`}
              </p>
            </div>
          : dates.map(date => (
              <div key={date}>
                <div className="date-group-label">{formatDateLabel(date)}</div>
                <div className="tx-group-card" style={{ marginBottom: 12 }}>
                  {groupedByDate[date].map(tx => (
                    <div key={tx.id} className="tx-item">
                      <div className={`tx-icon ${tx.type === 'income' ? 'tx-icon-income' : 'tx-icon-expense'}`}>
                        <Icon name={(CATEGORY_ICONS[tx.category] ?? 'package') as IconName} size={18}
                          color={tx.type === 'income' ? '#34C759' : '#FF3B30'} />
                      </div>
                      <div className="tx-info">
                        <div className="tx-desc">{tx.description}</div>
                        <div className="tx-meta">
                          {tx.category}
                          <span className={`method-badge ${tx.paymentMethod}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                            <Icon name={tx.paymentMethod === 'cash' ? 'banknote' : 'creditcard'} size={10} />
                            {tx.paymentMethod === 'cash' ? 'Efectivo' : 'Transfer'}
                          </span>
                        </div>
                        {tx.note && (
                          <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.4)', marginTop: 2, fontStyle: 'italic' }}>
                            📝 {tx.note}
                          </div>
                        )}
                      </div>
                      <span className={`tx-amount ${tx.type === 'income' ? 'tx-amount-income' : 'tx-amount-expense'}`}>
                        {tx.type === 'income' ? '+' : '−'}{fmt(tx.amount)}
                      </span>
                      <button className="tx-delete-btn" onClick={() => deleteTransaction(tx.id)}>
                        <Icon name="trash" size={16} color="var(--ios-red)" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
        }
      </div>
    </div>
  );
}
