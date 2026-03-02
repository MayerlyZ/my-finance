'use client';

import { useState, useEffect } from 'react';
import {
  useFinanceStore,
  getMonthlyStats,
  generateInsights,
  get6MonthsData,
  getFinancialStudy,
} from '@/lib/financeStore';
import { MONTHS_ES, CATEGORY_ICONS } from '@/types/finance';
import { getUserName } from '@/components/WelcomeScreen';
import Icon, { IconName } from '@/components/Icon';

export default function DashboardPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [userName, setUserName] = useState('');
  const [showSavingsInfo, setShowSavingsInfo] = useState(false);
  const { transactions, fixedExpenses, loans, isLoaded } = useFinanceStore();

  useEffect(() => {
    setUserName(getUserName());
  }, []);

  const stats = getMonthlyStats(transactions, month, year);
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const prevStats = getMonthlyStats(transactions, prevMonth, prevYear);
  const study = getFinancialStudy(stats.totalIncome, fixedExpenses, stats.totalExpense);
  const insights = generateInsights(stats, prevStats, study);
  const chartData = get6MonthsData(transactions, month, year);
  const maxVal = Math.max(...chartData.map((d) => Math.max(d.income, d.expense)), 1);

  function changeMonth(dir: number) {
    let m = month + dir, y = year;
    if (m > 11) { m = 0; y++; } if (m < 0) { m = 11; y--; }
    setMonth(m); setYear(y);
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

  const topExpenses = Object.entries(stats.expensesByCategory).sort(([, a], [, b]) => b - a).slice(0, 4);
  const hasFixedExpenses = study.totalFixed > 0;
  const pendingGiven    = loans.filter(l => l.type === 'given'    && l.status === 'pending').reduce((s, l) => s + l.amount, 0);
  const pendingReceived = loans.filter(l => l.type === 'received' && l.status === 'pending').reduce((s, l) => s + l.amount, 0);
  const hasLoans = pendingGiven > 0 || pendingReceived > 0;

  return (
    <div className="page-animate">
      <header className="page-header">
        <p className="page-subtitle">{userName ? `Hola, ${userName}` : 'Hola'} — Aquí están tus finanzas</p>
        <h1 className="page-title">Mi Organizador</h1>
      </header>

      <div className="page-content">
        {/* Month Selector */}
        <div className="month-selector">
          <button className="month-btn" onClick={() => changeMonth(-1)}>
            <Icon name="chevron-left" size={18} />
          </button>
          <span className="month-label">{MONTHS_ES[month]} {year}</span>
          <button className="month-btn" onClick={() => changeMonth(1)}>
            <Icon name="chevron-right" size={18} />
          </button>
        </div>

        {/* Total Disponible */}
        <div className="disponible-hero">
          <p className="disponible-label">Total Disponible</p>
          <p className={`disponible-amount ${study.freeAmount >= 0 ? 'balance-positive' : 'balance-negative'}`}>
            {isLoaded ? fmt(study.freeAmount) : '—'}
          </p>
          <p className="disponible-sub">
            {hasFixedExpenses
              ? 'Ingresos − Fijos − Variables'
              : 'Configura tus gastos fijos en la pestaña Fijos'}
          </p>
        </div>

        {/* Income / Expense Pills */}
        <div className="summary-grid">
          <div className="summary-pill pill-income">
            <div className="pill-icon"><Icon name="arrow-up-circle" size={22} color="#34C759" /></div>
            <div className="pill-label">Ingresos</div>
            <div className="pill-amount pill-amount-income">{isLoaded ? fmt(stats.totalIncome) : '—'}</div>
          </div>
          <div className="summary-pill pill-expense">
            <div className="pill-icon"><Icon name="arrow-down-circle" size={22} color="#FF3B30" /></div>
            <div className="pill-label">Gastos</div>
            <div className="pill-amount pill-amount-expense">{isLoaded ? fmt(stats.totalExpense) : '—'}</div>
          </div>
        </div>

        {/* Estudio Financiero */}
        {stats.totalIncome > 0 && (
          <>
            <div className="section-header">
              <h2 className="section-title">Estudio Financiero</h2>
            </div>
            <div className="study-card">
              <div className="study-row">
                <span className="study-label">
                  <Icon name="arrow-up-circle" size={16} color="var(--ios-green)" />
                  Ingresos del mes
                </span>
                <span className="study-amount green">{fmt(stats.totalIncome)}</span>
              </div>
              {hasFixedExpenses && (
                <div className="study-row">
                  <span className="study-label">
                    <Icon name="pin" size={16} color="var(--ios-red)" />
                    Gastos fijos mensuales
                  </span>
                  <span className="study-amount red">−{fmt(study.totalFixed)}</span>
                </div>
              )}
              {hasFixedExpenses && (
                <div className="study-row">
                  <span className="study-label bold">
                    <Icon name="creditcard" size={16} color="var(--ios-blue)" />
                    Disponible tras fijos
                  </span>
                  <span className={`study-amount big ${study.remainingAfterFixed >= 0 ? 'green' : 'red'}`}>
                    {fmt(study.remainingAfterFixed)}
                  </span>
                </div>
              )}
              {stats.totalExpense > 0 && (
                <div className="study-row">
                  <span className="study-label">
                    <Icon name="arrow-down-circle" size={16} color="var(--ios-red)" />
                    Gastos variables
                  </span>
                  <span className="study-amount red">−{fmt(stats.totalExpense)}</span>
                </div>
              )}
              <div className="study-row total-row">
                <span className="study-label bold">
                  <Icon name="sparkles" size={16} color="var(--ios-green)" />
                  Libre este mes
                </span>
                <span className={`study-amount big ${study.freeAmount >= 0 ? 'green' : 'red'}`}>
                  {fmt(study.freeAmount)}
                </span>
              </div>
            </div>

            {/* Payment method breakdown */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
              <div className="hist-sum-pill">
                <div className="hist-sum-label" style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                  <Icon name="banknote" size={13} /> Efectivo
                </div>
                <div className="hist-sum-amount" style={{ color: 'var(--ios-green)', fontSize: 14 }}>{fmt(stats.byCash)}</div>
              </div>
              <div className="hist-sum-pill">
                <div className="hist-sum-label" style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                  <Icon name="creditcard" size={13} /> Transf.
                </div>
                <div className="hist-sum-amount" style={{ color: 'var(--ios-blue)', fontSize: 14 }}>{fmt(stats.byTransfer)}</div>
              </div>
              {stats.byPSE > 0 && (
                <div className="hist-sum-pill">
                  <div className="hist-sum-label" style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                    <Icon name="chart-bar" size={13} /> PSE
                  </div>
                  <div className="hist-sum-amount" style={{ color: 'var(--ios-orange)', fontSize: 14 }}>{fmt(stats.byPSE)}</div>
                </div>
              )}
              {stats.byCard > 0 && (
                <div className="hist-sum-pill">
                  <div className="hist-sum-label" style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                    <Icon name="creditcard" size={13} /> Tarjeta
                  </div>
                  <div className="hist-sum-amount" style={{ color: '#AF52DE', fontSize: 14 }}>{fmt(stats.byCard)}</div>
                </div>
              )}
              <button
                className="hist-sum-pill"
                onClick={() => setShowSavingsInfo(true)}
                style={{ cursor: 'pointer', border: 'none', textAlign: 'center', background: 'inherit' }}
              >
                <div className="hist-sum-label" style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                  <Icon name="chart-bar" size={13} /> Ahorro <span style={{ fontSize: 10, opacity: 0.5 }}>ⓘ</span>
                </div>
                {(() => {
                  const realRate = stats.totalIncome > 0 ? (study.freeAmount / stats.totalIncome) * 100 : 0;
                  return (
                    <div className="hist-sum-amount" style={{
                      color: realRate >= 20 ? 'var(--ios-green)' : realRate > 0 ? 'var(--ios-orange)' : 'var(--ios-red)', fontSize: 14
                    }}>{Math.max(0, realRate).toFixed(1)}%</div>
                  );
                })()}
              </button>
            </div>
          </>
        )}

        {/* Loans Summary */}
        {isLoaded && hasLoans && (
          <>
            <div className="section-header">
              <h2 className="section-title">Préstamos Pendientes</h2>
              <a href="/prestamos" style={{ fontSize: 13, color: 'var(--ios-blue)', fontWeight: 600, textDecoration: 'none' }}>Ver todos</a>
            </div>
            <div className="study-card" style={{ marginBottom: 14 }}>
              <div className="study-row">
                <span className="study-label">
                  <Icon name="arrow-up-circle" size={16} color="var(--ios-orange)" />
                  Me deben
                </span>
                <span className="study-amount" style={{ color: 'var(--ios-orange)' }}>{fmt(pendingGiven)}</span>
              </div>
              <div className="study-row">
                <span className="study-label">
                  <Icon name="arrow-down-circle" size={16} color="var(--ios-purple)" />
                  Debo
                </span>
                <span className="study-amount" style={{ color: 'var(--ios-purple)' }}>{fmt(pendingReceived)}</span>
              </div>
              <div className="study-row total-row">
                <span className="study-label bold">
                  <Icon name="arrow-swap" size={16} color="var(--text-secondary)" />
                  Neto
                </span>
                <span className={`study-amount big ${pendingGiven - pendingReceived >= 0 ? 'green' : 'red'}`}>
                  {fmt(pendingGiven - pendingReceived)}
                </span>
              </div>
            </div>
          </>
        )}

        {/* 6-Month Chart */}
        <div className="section-header">
          <h2 className="section-title">Últimos 6 meses</h2>
        </div>
        <div className="chart-wrapper">
          <div className="chart-bars">
            {chartData.map((d, i) => (
              <div key={i} className="chart-bar-group">
                <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', width: '100%', height: 72 }}>
                  <div className="chart-bar chart-bar-income" style={{ height: `${(d.income / maxVal) * 100}%`, flex: 1 }} />
                  <div className="chart-bar chart-bar-expense" style={{ height: `${(d.expense / maxVal) * 100}%`, flex: 1 }} />
                </div>
                <span className="chart-month-label">{d.label}</span>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <div className="legend-item"><div className="legend-dot" style={{ background: '#34C759' }} />Ingresos</div>
            <div className="legend-item"><div className="legend-dot" style={{ background: '#FF3B30' }} />Gastos</div>
          </div>
        </div>

        {/* Category Breakdown */}
        {topExpenses.length > 0 && (
          <>
            <div className="section-header"><h2 className="section-title">Gastos por categoría</h2></div>
            <div className="category-list-card">
              {topExpenses.map(([cat, amount]) => (
                <div key={cat} className="category-row">
                  <div className="cat-icon-wrap">
                    <Icon name={(CATEGORY_ICONS[cat] ?? 'package') as IconName} size={18} color="var(--text-secondary)" />
                  </div>
                  <div className="cat-info">
                    <div className="cat-name">{cat}</div>
                    <div className="cat-progress-bg">
                      <div className="cat-progress-fill" style={{ width: `${(amount / stats.totalExpense) * 100}%` }} />
                    </div>
                  </div>
                  <div className="cat-amount">{fmt(amount)}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Smart Insights */}
        <div className="section-header"><h2 className="section-title">Análisis Inteligente</h2></div>
        <div className="insight-list">
          {insights.map((ins, i) => (
            <div key={i} className={`insight-item ${ins.type}`}>
              <span className="insight-emoji">{ins.icon}</span>
              <p className="insight-msg" dangerouslySetInnerHTML={{ __html: ins.message }} />
            </div>
          ))}
        </div>

        {/* Recent Transactions */}
        {stats.transactions.length > 0 && (
          <>
            <div className="section-header"><h2 className="section-title">Recientes</h2></div>
            <div className="tx-group-card">
              {stats.transactions.slice(0, 5).map((tx) => (
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
                  </div>
                  <span className={`tx-amount ${tx.type === 'income' ? 'tx-amount-income' : 'tx-amount-expense'}`}>
                    {tx.type === 'income' ? '+' : '−'}{fmt(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Savings Rate Info Modal */}
      {showSavingsInfo && (() => {
        const realRate = stats.totalIncome > 0 ? (study.freeAmount / stats.totalIncome) * 100 : 0;
        return (
          <div
            onClick={() => setShowSavingsInfo(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 999,
              background: 'rgba(0,0,0,0.45)',
              display: 'flex', alignItems: 'flex-end',
              backdropFilter: 'blur(4px)',
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                background: 'var(--card-bg, #fff)',
                borderRadius: '24px 24px 0 0',
                padding: '24px 20px 36px',
                width: '100%',
                boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
              }}
            >
              {/* Handle */}
              <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.15)', margin: '0 auto 20px' }} />

              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>📊 Tasa de Ahorro Real</h3>
              <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', marginBottom: 20, lineHeight: 1.5 }}>
                Es el porcentaje de tus ingresos que realmente queda libre después de pagar <strong>todos</strong> tus compromisos.
              </p>

              {/* Formula */}
              <div style={{ background: 'rgba(0,0,0,0.04)', borderRadius: 16, padding: '16px', marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 10 }}>
                  Fórmula
                </div>
                {[
                  { label: 'Ingresos del mes',     value: fmt(stats.totalIncome),    color: 'var(--ios-green)',  sign: '' },
                  { label: 'Gastos fijos',          value: fmt(study.totalFixed),      color: 'var(--ios-red)',    sign: '−' },
                  { label: 'Gastos variables',      value: fmt(stats.totalExpense),   color: 'var(--ios-red)',    sign: '−' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, fontSize: 14 }}>
                    <span style={{ color: 'rgba(0,0,0,0.6)' }}>{row.sign} {row.label}</span>
                    <span style={{ fontWeight: 700, color: row.color }}>{row.value}</span>
                  </div>
                ))}
                <div style={{ height: 1, background: 'rgba(0,0,0,0.1)', margin: '10px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 15 }}>
                  <span style={{ fontWeight: 700 }}>= Dinero libre</span>
                  <span style={{ fontWeight: 800, color: study.freeAmount >= 0 ? 'var(--ios-green)' : 'var(--ios-red)', fontSize: 17 }}>{fmt(study.freeAmount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 15, marginTop: 8 }}>
                  <span style={{ fontWeight: 700 }}>Tasa = libre ÷ ingresos</span>
                  <span style={{ fontWeight: 800, fontSize: 20, color: realRate >= 20 ? 'var(--ios-green)' : realRate > 0 ? 'var(--ios-orange)' : 'var(--ios-red)' }}>
                    {Math.max(0, realRate).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Scale */}
              <div style={{ fontSize: 13, lineHeight: 1.8 }}>
                <div>🟢 <strong>≥ 20%</strong> — Excelente, estás ahorrando bien</div>
                <div>🟡 <strong>1–19%</strong> — Positivo, pero puedes mejorar</div>
                <div>🔴 <strong>0% o menos</strong> — Tus gastos superan tus ingresos</div>
              </div>

              <button
                onClick={() => setShowSavingsInfo(false)}
                style={{
                  marginTop: 20, width: '100%', padding: '14px',
                  background: 'var(--ios-blue)', color: '#fff',
                  border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Entendido
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
