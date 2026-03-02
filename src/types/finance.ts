export type TransactionType = 'income' | 'expense';
export type PaymentMethod = 'cash' | 'transfer';

export type IncomeCategory =
  | 'Salario'
  | 'Freelance'
  | 'Inversión'
  | 'Regalo'
  | 'Otro';

export type ExpenseCategory =
  | 'Comida'
  | 'Transporte'
  | 'Salud'
  | 'Entretenimiento'
  | 'Ropa'
  | 'Servicios'
  | 'Educación'
  | 'Hogar'
  | 'Otro';

export type Category = IncomeCategory | ExpenseCategory;

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  note?: string;
  date: string;
  createdAt: string;
  paymentMethod: PaymentMethod;
}

// ─── Fixed Expenses ───────────────────────────────────────────
export interface FixedExpense {
  id: string;
  name: string;
  amount: number;
  icon: string;
  active: boolean;
  category: string;
}

export const DEFAULT_FIXED_EXPENSES: Omit<FixedExpense, 'id'>[] = [
  { name: 'Arriendo / Hipoteca', amount: 0, icon: '🏠', active: false, category: 'Vivienda' },
  { name: 'Electricidad',        amount: 0, icon: '💡', active: false, category: 'Servicios' },
  { name: 'Agua',                amount: 0, icon: '🚿', active: false, category: 'Servicios' },
  { name: 'Internet',            amount: 0, icon: '📡', active: false, category: 'Servicios' },
  { name: 'Plan Teléfono',       amount: 0, icon: '📱', active: false, category: 'Servicios' },
  { name: 'Netflix',             amount: 0, icon: '🎬', active: false, category: 'Entretenimiento' },
  { name: 'Spotify',             amount: 0, icon: '🎵', active: false, category: 'Entretenimiento' },
  { name: 'Transporte / Gasolina', amount: 0, icon: '🚗', active: false, category: 'Transporte' },
  { name: 'Seguro',              amount: 0, icon: '🛡️', active: false, category: 'Salud' },
  { name: 'Gimnasio',            amount: 0, icon: '💪', active: false, category: 'Salud' },
];

// ─── Loans ───────────────────────────────────────────────────
export type LoanType = 'given' | 'received';
export type LoanStatus = 'pending' | 'paid';

export interface Loan {
  id: string;
  type: LoanType;       // given = presté; received = me prestaron
  person: string;
  amount: number;
  date: string;
  dueDate?: string;
  note?: string;
  status: LoanStatus;
  createdAt: string;
}

// ─── Stats & Insights ─────────────────────────────────────────
export interface MonthlyStats {
  month: number;
  year: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  savingsRate: number;
  expensesByCategory: Record<string, number>;
  incomesByCategory: Record<string, number>;
  topExpenseCategory: string | null;
  topIncomeCategory: string | null;
  transactions: Transaction[];
  byCash: number;
  byTransfer: number;
}

export interface FinancialStudy {
  totalIncome: number;
  totalFixed: number;
  remainingAfterFixed: number;
  percentFixed: number;
  totalVariable: number;
  freeAmount: number;
  isHealthy: boolean;
  fixedList: FixedExpense[];
}

export interface Insight {
  type: 'success' | 'warning' | 'info' | 'danger';
  icon: string;
  message: string;
}

// ─── Constants ────────────────────────────────────────────────
export const INCOME_CATEGORIES: IncomeCategory[] = [
  'Salario', 'Freelance', 'Inversión', 'Regalo', 'Otro',
];

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Comida', 'Transporte', 'Salud', 'Entretenimiento',
  'Ropa', 'Servicios', 'Educación', 'Hogar', 'Otro',
];

export const CATEGORY_ICONS: Record<string, string> = {
  // Income
  Salario:   'briefcase',
  Freelance: 'laptop',
  Inversión: 'trending-up',
  Regalo:    'gift',
  // Expense
  Comida:         'hamburger',
  Transporte:     'car',
  Salud:          'pill',
  Entretenimiento:'film',
  Ropa:           'tshirt',
  Servicios:      'zap',
  Educación:      'book',
  Hogar:          'house',
  Otro:           'package',
};

export const MONTHS_ES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
];
