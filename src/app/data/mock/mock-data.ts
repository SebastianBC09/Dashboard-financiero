import {
  User,
  Transaction,
  AccountBalance,
  LoanApplication,
} from '../../models/types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'carlos.rodriguez@email.com',
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    dateOfBirth: new Date('1990-05-15'),
    phoneNumber: '+57-300-123-4567',
    address: {
      street: 'Calle 123 # 45-67',
      city: 'Bogotá',
      state: 'Cundinamarca',
      zipCode: '110111',
      country: 'Colombia',
    },
    employmentInfo: {
      employer: 'Bancolombia S.A.',
      position: 'Ingeniero de Software Senior',
      monthlyIncome: 8500000, // 8.5 millones COP
      employmentStartDate: new Date('2020-03-01'),
    },
    creditScore: 750,
    accountBalance: 25000000, // 25 millones COP
    isActive: true,
    createdAt: new Date('2020-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    email: 'maria.gonzalez@email.com',
    firstName: 'María',
    lastName: 'González',
    dateOfBirth: new Date('1985-08-22'),
    phoneNumber: '+57-310-987-6543',
    address: {
      street: 'Carrera 78 # 90-12',
      city: 'Medellín',
      state: 'Antioquia',
      zipCode: '050001',
      country: 'Colombia',
    },
    employmentInfo: {
      employer: 'Grupo Sura',
      position: 'Analista Financiera',
      monthlyIncome: 7200000, // 7.2 millones COP
      employmentStartDate: new Date('2019-07-15'),
    },
    creditScore: 780,
    accountBalance: 18000000, // 18 millones COP
    isActive: true,
    createdAt: new Date('2019-06-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    email: 'juan.perez@email.com',
    firstName: 'Juan',
    lastName: 'Pérez',
    dateOfBirth: new Date('1988-12-03'),
    phoneNumber: '+57-315-456-7890',
    address: {
      street: 'Avenida 4 Norte # 6-78',
      city: 'Cali',
      state: 'Valle del Cauca',
      zipCode: '760001',
      country: 'Colombia',
    },
    employmentInfo: {
      employer: 'Carvajal S.A.',
      position: 'Contador Público',
      monthlyIncome: 6500000, // 6.5 millones COP
      employmentStartDate: new Date('2021-01-10'),
    },
    creditScore: 720,
    accountBalance: 12000000, // 12 millones COP
    isActive: true,
    createdAt: new Date('2021-01-10'),
    updatedAt: new Date('2024-01-12'),
  },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    userId: '1',
    type: 'DEPOSIT',
    amount: 8500000,
    description: 'Depósito de nómina - Bancolombia',
    category: 'SALARY',
    status: 'COMPLETED',
    transactionDate: new Date('2024-01-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    userId: '1',
    type: 'WITHDRAWAL',
    amount: 500000,
    description: 'Retiro en cajero Bancolombia - Centro Comercial Andino',
    category: 'CASH_WITHDRAWAL',
    status: 'COMPLETED',
    transactionDate: new Date('2024-01-14'),
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
  },
  {
    id: '3',
    userId: '1',
    type: 'PAYMENT',
    amount: 1200000,
    description: 'Pago tarjeta de crédito Bancolombia',
    category: 'CREDIT_CARD_PAYMENT',
    status: 'COMPLETED',
    transactionDate: new Date('2024-01-13'),
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
  },
  {
    id: '4',
    userId: '1',
    type: 'TRANSFER',
    amount: 3000000,
    description: 'Transferencia a cuenta de ahorros',
    category: 'SAVINGS_TRANSFER',
    status: 'COMPLETED',
    transactionDate: new Date('2024-01-12'),
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: '5',
    userId: '1',
    type: 'PAYMENT',
    amount: 2500000,
    description: 'Pago arriendo - Apartamento Chapinero',
    category: 'RENT',
    status: 'PENDING',
    transactionDate: new Date('2024-01-16'),
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: '6',
    userId: '2',
    type: 'DEPOSIT',
    amount: 7200000,
    description: 'Depósito de nómina - Grupo Sura',
    category: 'SALARY',
    status: 'COMPLETED',
    transactionDate: new Date('2024-01-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '7',
    userId: '2',
    type: 'PAYMENT',
    amount: 3500000,
    description: 'Pago hipoteca - Banco de Bogotá',
    category: 'MORTGAGE',
    status: 'COMPLETED',
    transactionDate: new Date('2024-01-14'),
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
  },
  {
    id: '8',
    userId: '2',
    type: 'PAYMENT',
    amount: 450000,
    description: 'Pago servicios públicos - EPM',
    category: 'UTILITIES',
    status: 'COMPLETED',
    transactionDate: new Date('2024-01-13'),
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
  },
  {
    id: '9',
    userId: '3',
    type: 'DEPOSIT',
    amount: 6500000,
    description: 'Depósito de nómina - Carvajal S.A.',
    category: 'SALARY',
    status: 'COMPLETED',
    transactionDate: new Date('2024-01-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '10',
    userId: '3',
    type: 'PAYMENT',
    amount: 800000,
    description: 'Pago préstamo de estudio - ICETEX',
    category: 'EDUCATION_LOAN',
    status: 'COMPLETED',
    transactionDate: new Date('2024-01-14'),
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
  },
];

export const MOCK_ACCOUNT_BALANCES: AccountBalance[] = [
  {
    userId: '1',
    currentBalance: 25000000,
    availableBalance: 24800000,
    pendingTransactions: 200000,
    lastUpdated: new Date('2024-01-15T10:30:00'),
  },
  {
    userId: '2',
    currentBalance: 18000000,
    availableBalance: 17950000,
    pendingTransactions: 50000,
    lastUpdated: new Date('2024-01-15T09:15:00'),
  },
  {
    userId: '3',
    currentBalance: 12000000,
    availableBalance: 11980000,
    pendingTransactions: 200000,
    lastUpdated: new Date('2024-01-15T11:45:00'),
  },
];

export const MOCK_LOAN_APPLICATIONS: LoanApplication[] = [
  {
    id: '1',
    userId: '1',
    loanAmount: 50000000, // 50 millones COP
    purpose: 'Renovación de apartamento en Chapinero',
    termInMonths: 36,
    monthlyPayment: 1800000, // 1.8 millones COP
    interestRate: 18.5, // Tasa colombiana típica
    status: 'APPROVED',
    documents: [
      'cedula.pdf',
      'certificado_laboral.pdf',
      'declaracion_renta.pdf',
    ],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
    reviewedAt: new Date('2024-01-12'),
    reviewedBy: 'asesor-001',
  },
  {
    id: '2',
    userId: '2',
    loanAmount: 35000000, // 35 millones COP
    purpose: 'Compra de automóvil - Toyota Corolla',
    termInMonths: 60,
    monthlyPayment: 1200000, // 1.2 millones COP
    interestRate: 16.8,
    status: 'UNDER_REVIEW',
    documents: [
      'cedula.pdf',
      'certificado_laboral.pdf',
      'cotizacion_vehiculo.pdf',
    ],
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
  },
  {
    id: '3',
    userId: '3',
    loanAmount: 15000000, // 15 millones COP
    purpose: 'Maestría en Administración - Universidad de los Andes',
    termInMonths: 24,
    monthlyPayment: 750000, // 750 mil COP
    interestRate: 12.5,
    status: 'DRAFT',
    documents: ['cedula.pdf', 'certificado_laboral.pdf'],
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
  },
];

// Configuraciones específicas del contexto local
export const LOCAL_CONFIG = {
  currency: 'COP',
  currencySymbol: '$',
  decimalSeparator: ',',
  thousandsSeparator: '.',
  exchangeRate: {
    USD: 4000, // 1 USD = 4000 COP (aproximado)
    EUR: 4400, // 1 EUR = 4400 COP (aproximado)
  },
  banks: [
    'Bancolombia',
    'Banco de Bogotá',
    'Banco Popular',
    'Davivienda',
    'BBVA Colombia',
    'Colpatria',
    'Banco AV Villas',
    'Banco Caja Social',
  ],
  cities: [
    { name: 'Bogotá', state: 'Cundinamarca' },
    { name: 'Medellín', state: 'Antioquia' },
    { name: 'Cali', state: 'Valle del Cauca' },
    { name: 'Barranquilla', state: 'Atlántico' },
    { name: 'Cartagena', state: 'Bolívar' },
    { name: 'Bucaramanga', state: 'Santander' },
    { name: 'Pereira', state: 'Risaralda' },
    { name: 'Manizales', state: 'Caldas' },
  ],
  documentTypes: [
    'Cédula de Ciudadanía',
    'Cédula de Extranjería',
    'Pasaporte',
    'Tarjeta de Identidad',
  ],
};
