'use client';

import { useState } from 'react';
import { useFinanceStore, getMonthlyStats } from '@/lib/financeStore';
import { MONTHS_ES } from '@/types/finance';
import Icon from '@/components/Icon';

export default function AnualPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const { transactions, isLoaded } = useFinanceStore();

  const fmt = (n: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);
  const fmtShort = (n: number) => {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
    return `$${n}`;
  };

  const monthData = MONTHS_ES.map((label, m) => {
    const s = getMonthlyStats(transactions, m, year);
    return { label: label.slice(0, 3), month: m, income: s.totalIncome, expense: s.totalExpense, balance: s.balance };
  });

  const totalIncome  = monthData.reduce((s, d) => s + d.income, 0);
  const totalExpense = monthData.reduce((s, d) => s + d.expense, 0);
  const netBalance   = totalIncome - totalExpense;
  const maxVal       = Math.max(...monthData.map(d => Math.max(d.income, d.expense)), 1);

  const bestIncomeMonth  = monthData.reduce((a, b) => b.income > a.income ? b : a);
  const leastExpenseMonthWithData = monthData.filter(d => d.expense > 0);
  const bestSavingMonth  = leastExpenseMonthWithData.length
    ? leastExpenseMonthWithData.reduce((a, b) => b.expense < a.expense ? b : a)
    : null;

  const hasAnyData = monthData.some(d => d.income > 0 || d.expense > 0);

  return (
    <div className="page-animate">
      <header className="page-header">
        <p className="page-subtitle">Tendencias de ahorro a lo largo del año</p>
        <h1 className="page-title">Comparativa Anual</h1>
      </header>

      <div className="page-content">
        {/* Year selector */}
        <div className="month-selector" style={{ marginBottom: 14 }}>
          <button className="month-btn" onClick={() => setYear(y => y - 1)}><Icon name="chevron-left" size={18} /></button>
          <span className="month-label">{year}</span>
          <button className="month-btn" onClick={() => setYear(y => y + 1)}><Icon name="chevron-right" size={18} /></button>
        </div>

        {/* Annual summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
          <div style={{ background: 'rgba(52,199,89,0.1)', border: '1px solid rgba(52,199,89,0.2)', borderRadius: 16, padding: '14px 16px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'rgba(52,199,89,0.8)', marginBottom: 4 }}>Total Ingresos</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#34C759', letterSpacing: '-0.5px' }}>{fmt(totalIncome)}</div>
          </div>
          <div style={{ background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.18)', borderRadius: 16, padding: '14px 16px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'rgba(255,59,48,0.8)', marginBottom: 4 }}>Total Gastos</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#FF3B30', letterSpacing: '-0.5px' }}>{fmt(totalExpense)}</div>
          </div>
        </div>

        <div style={{ background: netBalance >= 0 ? 'rgba(52,199,89,0.1)' : 'rgba(255,59,48,0.08)', border: `1px solid ${netBalance >= 0 ? 'rgba(52,199,89,0.2)' : 'rgba(255,59,48,0.18)'}`, borderRadius: 16, padding: '14px 16px', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'rgba(0,0,0,0.45)', marginBottom: 4 }}>Balance Anual</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: netBalance >= 0 ? '#34C759' : '#FF3B30', letterSpacing: '-0.5px' }}>{fmt(netBalance)}</div>
          </div>
          <Icon name={netBalance >= 0 ? 'trending-up' : 'arrow-down-circle'} size={36} color={netBalance >= 0 ? 'rgba(52,199,89,0.3)' : 'rgba(255,59,48,0.3)'} />
        </div>

        {/* Highlights */}
        {hasAnyData && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            {bestIncomeMonth.income > 0 && (
              <div style={{ flex: 1, background: 'rgba(0,122,255,0.07)', border: '1px solid rgba(0,122,255,0.15)', borderRadius: 14, padding: '12px 14px' }}>
                <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 2 }}>Mejor ingreso</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ios-blue)' }}>{bestIncomeMonth.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{fmt(bestIncomeMonth.income)}</div>
              </div>
            )}
            {bestSavingMonth && (
              <div style={{ flex: 1, background: 'rgba(52,199,89,0.07)', border: '1px solid rgba(52,199,89,0.15)', borderRadius: 14, padding: '12px 14px' }}>
                <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 2 }}>Menos gastos</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ios-green)' }}>{bestSavingMonth.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{fmt(bestSavingMonth.expense)}</div>
              </div>
            )}
          </div>
        )}

        {/* 12-month chart */}
        <div className="section-header"><h2 className="section-title">Mes a mes — {year}</h2></div>
        <div style={{
          background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          border: '1.5px solid rgba(255,255,255,0.8)', borderRadius: 20, padding: '16px 12px 12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: 14,
        }}>
          {!isLoaded ? (
            <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(0,0,0,0.3)' }}>Cargando…</div>
          ) : !hasAnyData ? (
            <div style={{ height: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Icon name="chart-bar" size={36} color="rgba(0,0,0,0.12)" />
              <p style={{ margin: 0, fontSize: 13, color: 'rgba(0,0,0,0.35)' }}>Sin datos para {year}</p>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', overflowX: 'auto', paddingBottom: 4 }}>
              {monthData.map((d, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto', width: 28 }}>
                  <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 100 }}>
                    {/* Income bar */}
                    <div style={{
                      width: 10, borderRadius: '3px 3px 0 0', background: '#34C759',
                      height: d.income > 0 ? `${Math.max((d.income / maxVal) * 100, 4)}%` : 2,
                      opacity: d.income > 0 ? 1 : 0.2,
                    }} title={`Ingresos: ${fmt(d.income)}`} />
                    {/* Expense bar */}
                    <div style={{
                      width: 10, borderRadius: '3px 3px 0 0', background: '#FF3B30',
                      height: d.expense > 0 ? `${Math.max((d.expense / maxVal) * 100, 4)}%` : 2,
                      opacity: d.expense > 0 ? 1 : 0.2,
                    }} title={`Gastos: ${fmt(d.expense)}`} />
                  </div>
                  {/* Balance dot */}
                  {(d.income > 0 || d.expense > 0) && (
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: d.balance >= 0 ? '#34C759' : '#FF3B30', margin: '3px 0' }} />
                  )}
                  <span style={{ fontSize: 9, color: 'rgba(0,0,0,0.45)', fontWeight: 600, letterSpacing: '-0.2px', textTransform: 'uppercase' }}>
                    {d.label}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(0,0,0,0.5)' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: '#34C759' }} /> Ingresos
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(0,0,0,0.5)' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: '#FF3B30' }} /> Gastos
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(0,0,0,0.5)' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34C759' }} /> Balance
            </div>
          </div>
        </div>

        {/* Month-by-month breakdown list */}
        <div className="section-header"><h2 className="section-title">Detalle mensual</h2></div>
        <div className="tx-group-card">
          {monthData.map((d, i) => {
            const hasData = d.income > 0 || d.expense > 0;
            return (
              <div key={i} className="tx-item" style={{ opacity: hasData ? 1 : 0.4 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                  background: hasData ? (d.balance >= 0 ? 'rgba(52,199,89,0.12)' : 'rgba(255,59,48,0.08)') : 'rgba(0,0,0,0.04)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800, color: hasData ? (d.balance >= 0 ? '#34C759' : '#FF3B30') : 'rgba(0,0,0,0.25)',
                }}>
                  {d.label}
                </div>
                <div className="tx-info">
                  <div className="tx-desc">{MONTHS_ES[d.month]}</div>
                  <div className="tx-meta" style={{ display: 'flex', gap: 8 }}>
                    <span style={{ color: '#34C759' }}>+{fmtShort(d.income)}</span>
                    <span style={{ color: '#FF3B30' }}>−{fmtShort(d.expense)}</span>
                  </div>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: d.balance >= 0 ? '#34C759' : '#FF3B30' }}>
                  {d.balance >= 0 ? '+' : ''}{fmtShort(d.balance)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
