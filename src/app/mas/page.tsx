'use client';

import Link from 'next/link';
import { useFinanceStore } from '@/lib/financeStore';
import Icon from '@/components/Icon';
import NotificationSettings from '@/components/NotificationSettings';

export default function MasPage() {
  const { loans } = useFinanceStore();
  const pendingLoans = loans.filter(l => l.status === 'pending').length;
  const year = new Date().getFullYear();

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
