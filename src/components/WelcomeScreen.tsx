'use client';

import Image from 'next/image';
import { useState } from 'react';
import Icon from './Icon';

const USER_KEY = 'mio-user-name';

export function getUserName(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(USER_KEY) || '';
}

export function saveUserName(name: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, name.trim());
}

interface WelcomeScreenProps {
  onEnter: (name: string) => void;
}

export default function WelcomeScreen({ onEnter }: WelcomeScreenProps) {
  const [name, setName] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [entering, setEntering] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    saveUserName(name.trim());
    setShowAlert(true); // show privacy alert before entering
  }

  function handleConfirm() {
    setShowAlert(false);
    setEntering(true);
    setTimeout(() => onEnter(name.trim()), 600);
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
        background: 'linear-gradient(135deg, #e8f0ff 0%, #f0ebff 30%, #e8fdf4 60%, #fde8f4 100%)',
        transition: 'opacity 0.6s ease',
        opacity: entering ? 0 : 1,
      }}
    >
      {/* Background blobs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '60%', height: '60%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.4) 0%, transparent 70%)', filter: 'blur(30px)' }} />
        <div style={{ position: 'absolute', top: '5%', right: '-10%', width: '50%', height: '50%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(96,165,250,0.35) 0%, transparent 70%)', filter: 'blur(30px)' }} />
        <div style={{ position: 'absolute', bottom: '-5%', left: '20%', width: '60%', height: '50%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,211,153,0.3) 0%, transparent 70%)', filter: 'blur(30px)' }} />
      </div>

      {/* Glass Card */}
      <div style={{
        position: 'relative', width: '100%', maxWidth: 360,
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        border: '1.5px solid rgba(255,255,255,0.85)',
        borderRadius: 36,
        padding: '36px 28px 32px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
        animation: 'slideUp 0.5s cubic-bezier(0.25,0.46,0.45,0.94)',
      }}>
        {/* Highlight */}
        <div style={{ position: 'absolute', inset: 0, borderRadius: 36, background: 'linear-gradient(145deg,rgba(255,255,255,0.7) 0%,rgba(255,255,255,0) 60%)', pointerEvents: 'none' }} />

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 90, height: 90, borderRadius: 26,
            background: '#f0f4f0',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
            overflow: 'hidden',
            marginBottom: 14,
          }}>
            <Image src="/logo.png" alt="Mi Organizador Logo" width={90} height={90}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }} priority />
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: 'rgba(0,0,0,0.88)', letterSpacing: '-0.7px', lineHeight: 1.1 }}>
            Mi Organizador
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 14, color: 'rgba(0,0,0,0.5)', fontWeight: 400 }}>
            Tu finanzas, bajo control
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(0,0,0,0.06)', margin: '20px 0' }} />

        <p style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: 'rgba(0,0,0,0.7)', textAlign: 'center' }}>
          ¿Cómo te llamas?
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ position: 'relative', marginBottom: 14 }}>
            <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(0,0,0,0.35)', pointerEvents: 'none' }}>
              <Icon name="person-circle" size={20} />
            </div>
            <input
              autoFocus type="text" maxLength={30} placeholder="Tu nombre..."
              value={name} onChange={e => setName(e.target.value)}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(0,0,0,0.04)', border: '1.5px solid rgba(0,0,0,0.08)',
                borderRadius: 14, padding: '14px 16px 14px 44px',
                fontSize: 17, fontFamily: 'inherit', fontWeight: 600, color: 'rgba(0,0,0,0.88)',
                outline: 'none', letterSpacing: '-0.2px', transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={e => { e.target.style.borderColor = '#007AFF'; e.target.style.boxShadow = '0 0 0 4px rgba(0,122,255,0.12)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.08)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <button type="submit" disabled={!name.trim()} style={{
            width: '100%', padding: '15px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: name.trim() ? 'linear-gradient(145deg,#1a8f5a,#25a968)' : 'rgba(0,0,0,0.06)',
            color: name.trim() ? '#fff' : 'rgba(0,0,0,0.3)',
            border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
            cursor: name.trim() ? 'pointer' : 'default',
            boxShadow: name.trim() ? '0 4px 14px rgba(52,199,89,0.35)' : 'none',
            transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
            transform: name.trim() ? 'scale(1)' : 'scale(0.98)',
          }}>
            Entrar
            <Icon name="chevron-right" size={18} color={name.trim() ? '#fff' : 'rgba(0,0,0,0.3)'} />
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 14 }}>
          <Icon name="lock" size={12} color="rgba(0,0,0,0.3)" />
          <p style={{ margin: 0, fontSize: 11, color: 'rgba(0,0,0,0.35)', lineHeight: 1.5 }}>
            Tu nombre se guarda solo en este dispositivo
          </p>
        </div>
      </div>

      {/* ── Privacy Alert Sheet ── */}
      {showAlert && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 10,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          background: 'rgba(0,0,0,0.38)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          animation: 'fadeIn 0.2s ease',
        }}>
          <div style={{
            width: '100%', maxWidth: 480,
            background: 'rgba(255,255,255,0.93)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            borderRadius: '28px 28px 0 0',
            padding: '8px 0 36px',
            boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
            animation: 'slideUp 0.35s cubic-bezier(0.25,0.46,0.45,0.94)',
          }}>
            {/* Handle bar */}
            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.15)', margin: '10px auto 22px' }} />

            {/* Icon */}
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 58, height: 58, borderRadius: 18,
                background: 'rgba(255,149,0,0.12)',
              }}>
                <Icon name="info" size={30} color="#FF9500" />
              </div>
            </div>

            <h2 style={{ margin: '0 0 8px', textAlign: 'center', fontSize: 20, fontWeight: 800, color: 'rgba(0,0,0,0.88)', letterSpacing: '-0.4px', padding: '0 24px' }}>
              Aviso importante
            </h2>
            <p style={{ margin: '0 0 18px', textAlign: 'center', fontSize: 14, color: 'rgba(0,0,0,0.55)', lineHeight: 1.55, padding: '0 28px' }}>
              Tus datos financieros se guardan <strong>solo</strong> en este navegador y dispositivo.
            </p>

            {/* Warning list */}
            <div style={{
              margin: '0 20px 22px',
              background: 'rgba(255,149,0,0.07)',
              border: '1.5px solid rgba(255,149,0,0.22)',
              borderRadius: 16, padding: '14px 16px',
            }}>
              {[
                'Si cambias de navegador, tus datos no estarán disponibles.',
                'Si inicias desde otro dispositivo, comenzarás desde cero.',
                'Borrar el caché o historial borrará todos tus registros.',
              ].map((text, i, arr) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: i < arr.length - 1 ? 11 : 0 }}>
                  <div style={{ flexShrink: 0, marginTop: 1 }}>
                    <Icon name="xmark-circle" size={16} color="#FF9500" />
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: 'rgba(0,0,0,0.72)', lineHeight: 1.45 }}>{text}</p>
                </div>
              ))}
            </div>

            <div style={{ padding: '0 20px' }}>
              <button onClick={handleConfirm} style={{
                width: '100%', padding: '15px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: 'linear-gradient(145deg,#1a8f5a,#25a968)',
                color: '#fff', border: 'none', borderRadius: 14,
                fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
                cursor: 'pointer', boxShadow: '0 4px 14px rgba(52,199,89,0.35)',
              }}>
                <Icon name="checkmark-circle" size={18} color="#fff" />
                Entendido, continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
