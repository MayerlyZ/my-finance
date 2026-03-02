'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Transaction, TransactionType, Category, PaymentMethod,
  MonthlyStats, Insight, FinancialStudy,
  FixedExpense, DEFAULT_FIXED_EXPENSES,
  Loan, LoanType,
  MONTHS_ES,
} from '@/types/finance';

const STORAGE_KEYS = {
  transactions: 'mio-transactions',
  fixedExpenses: 'mio-fixed-expenses',
  loans: 'mio-loans',
};

function genId() { return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; } catch { return fallback; }
}
function save(key: string, data: unknown) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// ─── Monthly Stats ────────────────────────────────────────────
export function getMonthlyStats(txs: Transaction[], month: number, year: number): MonthlyStats {
  const filtered = txs.filter((tx) => {
    const d = new Date(tx.date + 'T00:00:00');
    return d.getMonth() === month && d.getFullYear() === year;
  });

  const totalIncome = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

  const expensesByCategory: Record<string, number> = {};
  const incomesByCategory: Record<string, number> = {};
  let byCash = 0, byTransfer = 0, byPSE = 0, byCard = 0;

  filtered.forEach((tx) => {
    if (tx.type === 'expense') {
      expensesByCategory[tx.category] = (expensesByCategory[tx.category] || 0) + tx.amount;
      // Track expenses by payment method
      if (tx.paymentMethod === 'cash') byCash += tx.amount;
      else if (tx.paymentMethod === 'transfer') byTransfer += tx.amount;
      else if (tx.paymentMethod === 'pse') byPSE += tx.amount;
      else if (tx.paymentMethod === 'card') byCard += tx.amount;
    } else {
      incomesByCategory[tx.category] = (incomesByCategory[tx.category] || 0) + tx.amount;
    }
  });

  const topExpenseCategory = Object.keys(expensesByCategory).sort((a, b) => expensesByCategory[b] - expensesByCategory[a])[0] || null;
  const topIncomeCategory = Object.keys(incomesByCategory).sort((a, b) => incomesByCategory[b] - incomesByCategory[a])[0] || null;

  return {
    month, year, totalIncome, totalExpense, balance, savingsRate,
    expensesByCategory, incomesByCategory, topExpenseCategory, topIncomeCategory,
    transactions: filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    byCash, byTransfer, byPSE, byCard,
  };
}

// ─── Financial Study ──────────────────────────────────────────
export function getFinancialStudy(
  totalIncome: number,
  fixedExpenses: FixedExpense[],
  totalVariableExpense: number
): FinancialStudy {
  const activeFixed = fixedExpenses.filter(f => f.active);
  const totalFixed = activeFixed.reduce((s, f) => s + f.amount, 0);
  const remainingAfterFixed = totalIncome - totalFixed;
  const percentFixed = totalIncome > 0 ? (totalFixed / totalIncome) * 100 : 0;
  const freeAmount = remainingAfterFixed - totalVariableExpense;
  const isHealthy = totalFixed < totalIncome * 0.6 && freeAmount >= 0;

  return { totalIncome, totalFixed, remainingAfterFixed, percentFixed, totalVariable: totalVariableExpense, freeAmount, isHealthy, fixedList: activeFixed };
}

// ─── Insights ─────────────────────────────────────────────────
export function generateInsights(current: MonthlyStats, previous: MonthlyStats | null, study: FinancialStudy): Insight[] {
  const insights: Insight[] = [];

  if (current.totalIncome === 0 && current.totalExpense === 0) {
    insights.push({ type: 'info', icon: '👋', message: '¡Empieza registrando un ingreso o gasto!' });
    return insights;
  }

  if (current.totalIncome > 0) {
    const realRate = (study.freeAmount / current.totalIncome) * 100;
    if (realRate >= 20) insights.push({ type: 'success', icon: '🎉', message: `¡Excelente! Tu tasa de ahorro real es <strong>${realRate.toFixed(0)}%</strong>.` });
    else if (realRate > 0) insights.push({ type: 'warning', icon: '💡', message: `Ahorro real del <strong>${realRate.toFixed(0)}%</strong>. Intenta reducir gastos.` });
    else insights.push({ type: 'danger', icon: '🚨', message: `Tus gastos superan tus ingresos este mes. ¡Revisa tus finanzas!` });
  }

  if (study.totalFixed > 0 && current.totalIncome > 0) {
    if (study.percentFixed > 60) insights.push({ type: 'danger', icon: '⚠️', message: `Tus gastos fijos representan el <strong>${study.percentFixed.toFixed(0)}%</strong> de tus ingresos. ¡Demasiado alto!` });
    else if (study.percentFixed > 40) insights.push({ type: 'warning', icon: '📌', message: `Tus gastos fijos son el <strong>${study.percentFixed.toFixed(0)}%</strong> de tus ingresos.` });
    else insights.push({ type: 'success', icon: '✅', message: `Tus gastos fijos son el <strong>${study.percentFixed.toFixed(0)}%</strong> de tus ingresos. Bajo control.` });
  }

  if (study.freeAmount > 0) insights.push({ type: 'success', icon: '💰', message: `Tienes <strong>${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(study.freeAmount)}</strong> realmente libres este mes.` });
  else if (study.totalIncome > 0) insights.push({ type: 'danger', icon: '🔴', message: `No tienes dinero libre este mes después de gastos fijos y variables.` });

  if (current.topExpenseCategory) {
    const amt = current.expensesByCategory[current.topExpenseCategory];
    insights.push({ type: 'info', icon: '📊', message: `Mayor gasto: <strong>${current.topExpenseCategory}</strong> (${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amt)}).` });
  }

  if (previous && previous.totalExpense > 0 && current.totalExpense > 0) {
    const diff = ((current.totalExpense - previous.totalExpense) / previous.totalExpense) * 100;
    if (diff > 10) insights.push({ type: 'warning', icon: '📈', message: `Gastaste un <strong>${diff.toFixed(0)}% más</strong> que el mes pasado.` });
    else if (diff < -10) insights.push({ type: 'success', icon: '📉', message: `¡Redujiste tus gastos un <strong>${Math.abs(diff).toFixed(0)}%</strong> vs el mes anterior!` });
  }

  return insights;
}

// ─── 6-Month Chart Data ───────────────────────────────────────
export function get6MonthsData(txs: Transaction[], currentMonth: number, currentYear: number) {
  const result = [];
  for (let i = 5; i >= 0; i--) {
    let m = currentMonth - i, y = currentYear;
    while (m < 0) { m += 12; y--; }
    const s = getMonthlyStats(txs, m, y);
    result.push({ label: MONTHS_ES[m].slice(0, 3), income: s.totalIncome, expense: s.totalExpense });
  }
  return result;
}

// ─── Store Hook ───────────────────────────────────────────────
export function useFinanceStore() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedFixed = load<FixedExpense[]>(STORAGE_KEYS.fixedExpenses, []);
    // If no fixed expenses saved yet, seed with defaults (all inactive)
    const initialFixed = savedFixed.length > 0
      ? savedFixed
      : DEFAULT_FIXED_EXPENSES.map(f => ({ ...f, id: genId() }));

    setTransactions(load<Transaction[]>(STORAGE_KEYS.transactions, []));
    setFixedExpenses(initialFixed);
    setLoans(load<Loan[]>(STORAGE_KEYS.loans, []));
    setIsLoaded(true);
  }, []);

  // ── Transactions ──
  const addTransaction = useCallback((data: {
    type: TransactionType; amount: number; category: string;
    description: string; date: string; paymentMethod: PaymentMethod;
    note?: string;
  }) => {
    const tx: Transaction = { id: genId(), ...data, createdAt: new Date().toISOString() };
    setTransactions(prev => { const u = [tx, ...prev]; save(STORAGE_KEYS.transactions, u); return u; });
    return tx;
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => { const u = prev.filter(t => t.id !== id); save(STORAGE_KEYS.transactions, u); return u; });
  }, []);

  // ── Fixed Expenses ──
  const updateFixedExpense = useCallback((id: string, patch: Partial<FixedExpense>) => {
    setFixedExpenses(prev => {
      const u = prev.map(f => f.id === id ? { ...f, ...patch } : f);
      save(STORAGE_KEYS.fixedExpenses, u);
      return u;
    });
  }, []);

  const addFixedExpense = useCallback((data: Omit<FixedExpense, 'id'>) => {
    const fe: FixedExpense = { id: genId(), ...data };
    setFixedExpenses(prev => { const u = [...prev, fe]; save(STORAGE_KEYS.fixedExpenses, u); return u; });
  }, []);

  const deleteFixedExpense = useCallback((id: string) => {
    setFixedExpenses(prev => { const u = prev.filter(f => f.id !== id); save(STORAGE_KEYS.fixedExpenses, u); return u; });
  }, []);

  // ── Loans ──
  const addLoan = useCallback((data: {
    type: LoanType; person: string; amount: number;
    date: string; dueDate?: string; note?: string;
  }) => {
    const loan: Loan = { id: genId(), ...data, status: 'pending', createdAt: new Date().toISOString() };
    setLoans(prev => { const u = [loan, ...prev]; save(STORAGE_KEYS.loans, u); return u; });
  }, []);

  const updateLoanStatus = useCallback((id: string, status: Loan['status']) => {
    setLoans(prev => { const u = prev.map(l => l.id === id ? { ...l, status } : l); save(STORAGE_KEYS.loans, u); return u; });
  }, []);

  const deleteLoan = useCallback((id: string) => {
    setLoans(prev => { const u = prev.filter(l => l.id !== id); save(STORAGE_KEYS.loans, u); return u; });
  }, []);

  return {
    transactions, fixedExpenses, loans, isLoaded,
    addTransaction, deleteTransaction,
    updateFixedExpense, addFixedExpense, deleteFixedExpense,
    addLoan, updateLoanStatus, deleteLoan,
  };
}

// ─── Budget Store ─────────────────────────────────────────────
export function useBudgetStore() {
  const [budgets, setBudgets] = useState<Record<string, number>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setBudgets(load<Record<string, number>>('mio-budgets', {}));
    setIsLoaded(true);
  }, []);

  const setBudget = useCallback((category: string, amount: number) => {
    setBudgets(prev => {
      const u = { ...prev, [category]: amount };
      save('mio-budgets', u);
      return u;
    });
  }, []);

  const clearBudget = useCallback((category: string) => {
    setBudgets(prev => {
      const u = { ...prev };
      delete u[category];
      save('mio-budgets', u);
      return u;
    });
  }, []);

  return { budgets, isLoaded, setBudget, clearBudget };
}
