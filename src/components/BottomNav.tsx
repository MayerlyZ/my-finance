'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from './Icon';

const NAV_ITEMS = [
  { href: '/',         label: 'Inicio',   icon: 'home'         as const },
  { href: '/ingresos', label: 'Ingresos', icon: 'arrow-up-circle' as const },
  { href: '/gastos',   label: 'Gastos',   icon: 'arrow-down-circle' as const },
  { href: '/fijos',    label: 'Fijos',    icon: 'pin'          as const },
  { href: '/mas',      label: 'Más',      icon: 'ellipsis'     as const },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Navegación principal">
      <div className="bottom-nav-inner">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${active ? 'active' : ''}`}
              aria-label={item.label}
            >
              <span className="nav-icon">
                <Icon
                  name={item.icon}
                  size={22}
                  color={active ? 'var(--ios-blue)' : 'rgba(0,0,0,0.38)'}
                />
              </span>
              <span className="nav-label">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
