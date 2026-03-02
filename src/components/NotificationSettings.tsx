'use client';

import { useState, useEffect, useCallback } from 'react';
import Icon from './Icon';

const PREFS_KEY = 'mio-notif-prefs';

interface NotifPrefs {
  endOfMonth: boolean;
  budgetAlert: boolean;
}

function loadPrefs(): NotifPrefs {
  if (typeof window === 'undefined') return { endOfMonth: true, budgetAlert: true };
  try {
    const r = localStorage.getItem(PREFS_KEY);
    return r ? JSON.parse(r) : { endOfMonth: true, budgetAlert: true };
  } catch { return { endOfMonth: true, budgetAlert: true }; }
}

function savePrefs(prefs: NotifPrefs) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [prefs, setPrefs] = useState<NotifPrefs>({ endOfMonth: true, budgetAlert: true });

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
    setPrefs(loadPrefs());
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  const notify = useCallback((title: string, body: string, icon = '/logo.png') => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    new Notification(title, { body, icon });
  }, []);

  // Check end-of-month reminder: fires if today is the last day of the month and prefs say so
  const checkEndOfMonth = useCallback(() => {
    if (!prefs.endOfMonth) return;
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    if (now.getDate() === lastDay) {
      notify('📅 ¡Cierra las cuentas del mes!', 'Hoy es el último día de ' + now.toLocaleString('es-CO', { month: 'long' }) + '. Revisa tus finanzas en Mi Organizador.');
    }
  }, [prefs.endOfMonth, notify]);

  // Budget alert
  const checkBudgetAlert = useCallback((category: string, spent: number, budget: number) => {
    if (!prefs.budgetAlert || Notification.permission !== 'granted') return;
    if (spent > budget) {
      notify(`⚠️ Presupuesto excedido: ${category}`, `Gastaste ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(spent)} de ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(budget)}.`);
    } else if (spent / budget >= 0.8) {
      notify(`📊 ${category}: 80% del presupuesto usado`, `Llevas ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(spent)} de ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(budget)}.`);
    }
  }, [prefs.budgetAlert, notify]);

  const updatePref = useCallback((key: keyof NotifPrefs, value: boolean) => {
    setPrefs(prev => { const u = { ...prev, [key]: value }; savePrefs(u); return u; });
  }, []);

  return { permission, prefs, requestPermission, checkEndOfMonth, checkBudgetAlert, updatePref };
}

// ── UI Section for /mas page ──────────────────────────────────
export default function NotificationSettings() {
  const { permission, prefs, requestPermission, updatePref } = useNotifications();
  const [requesting, setRequesting] = useState(false);

  async function handleRequest() {
    setRequesting(true);
    await requestPermission();
    setRequesting(false);
  }

  const isSupported = typeof window !== 'undefined' && 'Notification' in window;
  const isGranted   = permission === 'granted';
  const isDenied    = permission === 'denied';

  return (
    <div style={{ marginBottom: 20, marginTop: 4 }}>
      <div className="section-header">
        <h2 className="section-title">Notificaciones</h2>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: '1.5px solid rgba(255,255,255,0.8)', borderRadius: 20, overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      }}>
        {/* Permission row */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, flexShrink: 0,
            background: isGranted ? 'rgba(52,199,89,0.12)' : isDenied ? 'rgba(255,59,48,0.1)' : 'rgba(0,122,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name={isGranted ? 'checkmark-circle' : isDenied ? 'xmark-circle' : 'sparkles'} size={20}
              color={isGranted ? 'var(--ios-green)' : isDenied ? 'var(--ios-red)' : 'var(--ios-blue)'} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Notificaciones del navegador</div>
            <div style={{ fontSize: 12, color: isGranted ? 'var(--ios-green)' : isDenied ? 'var(--ios-red)' : 'var(--text-secondary)' }}>
              {!isSupported ? 'No compatible en este navegador' : isGranted ? 'Activadas' : isDenied ? 'Bloqueadas — actívalas en ajustes del navegador' : 'Desactivadas'}
            </div>
          </div>
          {isSupported && !isGranted && !isDenied && (
            <button onClick={handleRequest} disabled={requesting} style={{
              background: 'var(--ios-blue)', color: '#fff', border: 'none', borderRadius: 10,
              padding: '8px 14px', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
            }}>
              {requesting ? 'Activando…' : 'Activar'}
            </button>
          )}
        </div>

        {/* End-of-month toggle */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 12, opacity: !isGranted ? 0.5 : 1 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Recordatorio fin de mes</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Te avisa el último día del mes para cerrar cuentas</div>
          </div>
          <label className="ios-toggle">
            <input type="checkbox" checked={prefs.endOfMonth} disabled={!isGranted}
              onChange={e => updatePref('endOfMonth', e.target.checked)} />
            <span className="ios-toggle-track" />
          </label>
        </div>

        {/* Budget alert toggle */}
        <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, opacity: !isGranted ? 0.5 : 1 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Alerta de presupuesto</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Avisa cuando superas o te acercas al límite de una categoría</div>
          </div>
          <label className="ios-toggle">
            <input type="checkbox" checked={prefs.budgetAlert} disabled={!isGranted}
              onChange={e => updatePref('budgetAlert', e.target.checked)} />
            <span className="ios-toggle-track" />
          </label>
        </div>
      </div>
    </div>
  );
}
