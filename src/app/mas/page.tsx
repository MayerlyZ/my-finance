'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useFinanceStore } from '@/lib/financeStore';
import Icon from '@/components/Icon';
import NotificationSettings from '@/components/NotificationSettings';
import { getUserName, saveUserName } from '@/components/WelcomeScreen';

export default function MasPage() {
  const { loans } = useFinanceStore();
  const pendingLoans = loans.filter(l => l.status === 'pending').length;
  const year = new Date().getFullYear();

  // ── Profile name editing ──
  const [currentName, setCurrentName] = useState('');
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setCurrentName(getUserName());
  }, []);

  function startEdit() {
    setEditVal(currentName);
    setEditing(true);
  }

  function commitEdit() {
    const trimmed = editVal.trim();
    if (trimmed && trimmed !== currentName) {
      saveUserName(trimmed);
      setCurrentName(trimmed);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') setEditing(false);
  }

  const HUBS = [
    {
      href: '/historial',
      iconName: 'chart-bar' as const,
      iconBg: 'rgba(0,122,255,0.12)',
      iconColor: 'var(--ios-blue)',
      title: 'Historial',
      desc: 'Todas tus transacciones organizadas por fecha',
    },
    {
      href: '/prestamos',
      iconName: 'handshake' as const,
      iconBg: 'rgba(255,149,0,0.12)',
      iconColor: 'var(--ios-orange)',
      title: 'Préstamos',
      desc: `Controla lo que prestas y lo que te deben${pendingLoans > 0 ? ` · ${pendingLoans} pendiente${pendingLoans !== 1 ? 's' : ''}` : ''}`,
    },
    {
      href: '/presupuesto',
      iconName: 'creditcard' as const,
      iconBg: 'rgba(52,199,89,0.12)',
      iconColor: 'var(--ios-green)',
      title: 'Presupuestos',
      desc: 'Establece límites mensuales por categoría',
    },
    {
      href: '/anual',
      iconName: 'chart-pie' as const,
      iconBg: 'rgba(175,82,222,0.12)',
      iconColor: 'var(--ios-purple)',
      title: `Comparativa ${year}`,
      desc: 'Tendencias de ingresos y gastos por mes del año',
    },
  ];

  const TIPS = [
    { iconName: 'pin' as const, title: 'Gastos Fijos', text: 'Configura tus compromisos mensuales para ver cuánto te queda disponible.' },
    { iconName: 'creditcard' as const, title: 'Presupuestos', text: 'Pon un límite por categoría y la app te avisa cuando te acerques al tope.' },
    { iconName: 'sparkles' as const, title: 'Total Disponible', text: 'En el Dashboard verás cuánto tienes libre después de todos tus gastos fijos y variables del mes.' },
    { iconName: 'arrow-swap' as const, title: 'Método de pago', text: 'Al registrar, indica si fue efectivo o transferencia para un seguimiento completo.' },
    { iconName: 'handshake' as const, title: 'Préstamos', text: 'Registra cada préstamo, márcalo como pagado cuando se liquide.' },
  ];

  return (
    <div className="page-animate">
      <header className="page-header">
        <p className="page-subtitle">Accede a más herramientas</p>
        <h1 className="page-title">Más</h1>
      </header>

      <div className="page-content" style={{ paddingTop: 16 }}>

        {/* ── Profile Card ── */}
        <div style={{
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          border: '1.5px solid rgba(255,255,255,0.8)',
          borderRadius: 20, padding: '16px', marginBottom: 14,
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Avatar circle */}
            <div style={{
              width: 52, height: 52, borderRadius: 16, flexShrink: 0,
              background: 'linear-gradient(145deg, #a78bfa, #818cf8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 800, color: '#fff',
              boxShadow: '0 4px 12px rgba(129,140,248,0.4)',
            }}>
              {currentName ? currentName[0].toUpperCase() : '?'}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              {editing ? (
                <input
                  autoFocus
                  type="text"
                  value={editVal}
                  onChange={e => setEditVal(e.target.value)}
                  onBlur={commitEdit}
                  onKeyDown={handleKeyDown}
                  maxLength={30}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: 'rgba(0,0,0,0.04)',
                    border: '1.5px solid rgba(0,122,255,0.4)',
                    borderRadius: 10, padding: '8px 12px',
                    fontSize: 17, fontWeight: 700, fontFamily: 'inherit',
                    color: 'var(--text-primary)', outline: 'none',
                    boxShadow: '0 0 0 4px rgba(0,122,255,0.1)',
                  }}
                />
              ) : (
                <>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
                    {currentName || '—'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                    {saved ? '✅ Nombre actualizado' : 'Mi Organizador Personal'}
                  </div>
                </>
              )}
            </div>

            {/* Edit / Done button */}
            {editing ? (
              <button onClick={commitEdit} style={{
                background: 'var(--ios-blue)', color: '#fff', border: 'none',
                borderRadius: 10, padding: '8px 14px', fontSize: 14,
                fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
                flexShrink: 0,
              }}>
                Listo
              </button>
            ) : (
              <button onClick={startEdit} style={{
                background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: 10,
                padding: '8px 14px', fontSize: 13, fontWeight: 600,
                fontFamily: 'inherit', color: 'var(--ios-blue)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
              }}>
                <Icon name="person-circle" size={15} color="var(--ios-blue)" />
                Editar
              </button>
            )}
          </div>
        </div>

        <div className="hub-grid">
          {HUBS.map((hub) => (
            <Link key={hub.href} href={hub.href} className="hub-card">
              <div className="hub-icon-wrap" style={{ background: hub.iconBg }}>
                <Icon name={hub.iconName} size={26} color={hub.iconColor} />
              </div>
              <div className="hub-text">
                <div className="hub-title">{hub.title}</div>
                <div className="hub-desc">{hub.desc}</div>
              </div>
              <Icon name="chevron-right" size={20} color="var(--text-tertiary)" />
            </Link>
          ))}
        </div>

        {/* Notification Settings */}
        <NotificationSettings />

        <div className="section-header" style={{ marginTop: 8 }}>
          <h2 className="section-title">Cómo usar la app</h2>
        </div>

        {TIPS.map((tip, i) => (
          <div key={i} className="insight-item info" style={{ marginBottom: 8, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <Icon name={tip.iconName} size={18} color="var(--ios-blue)" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <p className="insight-msg" style={{ marginBottom: 2 }}><strong>{tip.title}</strong></p>
              <p className="insight-msg">{tip.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
