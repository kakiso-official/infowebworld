export const revenueKPIs = {
  mrr: '$147,520',
  arr: '$1,770,240',
  avgRevenuePerUser: '$38.40',
  ltv: '$1,842',
  churnRate: '2.4%',
}

export const revenueTrend = [
  { month: 'Apr', basic: 12400, pro: 42800, enterprise: 43200 },
  { month: 'May', basic: 13100, pro: 45600, enterprise: 46500 },
  { month: 'Jun', basic: 13800, pro: 48200, enterprise: 50800 },
  { month: 'Jul', basic: 13200, pro: 46900, enterprise: 48400 },
  { month: 'Aug', basic: 14500, pro: 51200, enterprise: 53200 },
  { month: 'Sep', basic: 15200, pro: 53800, enterprise: 55300 },
  { month: 'Oct', basic: 14800, pro: 52400, enterprise: 54500 },
  { month: 'Nov', basic: 16100, pro: 56800, enterprise: 59600 },
  { month: 'Dec', basic: 16800, pro: 58900, enterprise: 62500 },
  { month: 'Jan', basic: 16400, pro: 57200, enterprise: 62200 },
  { month: 'Feb', basic: 17200, pro: 60100, enterprise: 64600 },
  { month: 'Mar', basic: 17820, pro: 62400, enterprise: 67300 },
]

export const planDistribution = [
  { label: 'Enterprise', pct: 46, color: 'var(--accent)', revenue: '$67,300', users: 156 },
  { label: 'Pro', pct: 42, color: 'var(--emerald)', revenue: '$62,400', users: 892 },
  { label: 'Basic', pct: 12, color: 'var(--amber)', revenue: '$17,820', users: 1245 },
]

export const topPayingCustomers = [
  { id: 1, name: 'Priya Sharma', company: 'GlobalRetail India', plan: 'Enterprise', monthly: '$2,985', lifetime: '$35,820', since: 'Sep 2025' },
  { id: 2, name: 'Alexandra Petrov', company: 'EuroTech GmbH', plan: 'Enterprise', monthly: '$2,985', lifetime: '$29,850', since: 'Nov 2025' },
  { id: 3, name: 'Hassan Al-Rashid', company: 'DubaiTech', plan: 'Enterprise', monthly: '$2,985', lifetime: '$23,880', since: 'Jan 2026' },
  { id: 4, name: 'Lisa Park', company: 'HealthSys', plan: 'Enterprise', monthly: '$2,985', lifetime: '$32,835', since: 'May 2025' },
  { id: 5, name: 'Daniel Kim', company: 'Seoul AI', plan: 'Enterprise', monthly: '$2,985', lifetime: '$11,940', since: 'Mar 2026' },
  { id: 6, name: 'Sarah Mitchell', company: 'TechCorp Inc.', plan: 'Enterprise', monthly: '$2,985', lifetime: '$41,790', since: 'Jan 2025' },
  { id: 7, name: 'David Chen', company: 'StartupXYZ', plan: 'Pro', monthly: '$299', lifetime: '$3,588', since: 'Feb 2025' },
  { id: 8, name: 'Yuki Tanaka', company: 'ToyoTech', plan: 'Pro', monthly: '$299', lifetime: '$2,990', since: 'Nov 2025' },
  { id: 9, name: 'Tom Bradley', company: 'FinServ Capital', plan: 'Pro', monthly: '$299', lifetime: '$1,794', since: 'Sep 2025' },
  { id: 10, name: 'Lucas Silva', company: 'BrazilTech', plan: 'Pro', monthly: '$299', lifetime: '$897', since: 'Mar 2026' },
]

export const recentTransactions = [
  { id: 'TXN-2026-4821', customer: 'Priya Sharma', amount: '$2,985.00', plan: 'Enterprise', status: 'completed', date: 'Mar 19, 2026', method: 'Visa ****4242' },
  { id: 'TXN-2026-4820', customer: 'David Chen', amount: '$299.00', plan: 'Pro', status: 'completed', date: 'Mar 19, 2026', method: 'Mastercard ****8821' },
  { id: 'TXN-2026-4819', customer: 'Hassan Al-Rashid', amount: '$2,985.00', plan: 'Enterprise', status: 'completed', date: 'Mar 18, 2026', method: 'Amex ****3456' },
  { id: 'TXN-2026-4818', customer: 'Sophie Martin', amount: '$49.00', plan: 'Basic', status: 'completed', date: 'Mar 18, 2026', method: 'Visa ****7890' },
  { id: 'TXN-2026-4817', customer: 'James Wilson', amount: '$49.00', plan: 'Basic', status: 'failed', date: 'Mar 18, 2026', method: 'Visa ****1234' },
  { id: 'TXN-2026-4816', customer: 'Nina Vasquez', amount: '$299.00', plan: 'Pro', status: 'completed', date: 'Mar 17, 2026', method: 'Mastercard ****5678' },
  { id: 'TXN-2026-4815', customer: 'Carlos Mendez', amount: '$49.00', plan: 'Basic', status: 'refunded', date: 'Mar 17, 2026', method: 'Visa ****9012' },
  { id: 'TXN-2026-4814', customer: 'Alexandra Petrov', amount: '$2,985.00', plan: 'Enterprise', status: 'completed', date: 'Mar 17, 2026', method: 'Wire Transfer' },
  { id: 'TXN-2026-4813', customer: 'Emily Foster', amount: '$49.00', plan: 'Basic', status: 'completed', date: 'Mar 16, 2026', method: 'Visa ****3456' },
  { id: 'TXN-2026-4812', customer: 'Mark Stevens', amount: '$49.00', plan: 'Basic', status: 'failed', date: 'Mar 16, 2026', method: 'Mastercard ****7890' },
]

export const transactionStatusMap = {
  completed: { label: 'Completed', cls: 'db-badge--active' },
  failed: { label: 'Failed', cls: 'db-badge--inactive' },
  refunded: { label: 'Refunded', cls: 'db-badge--pending' },
  pending: { label: 'Pending', cls: 'db-badge--pending' },
}

export const revenueByCategory = [
  { category: 'Cloud Security', revenue: '$42,800', listings: 847, avgPerListing: '$50.53', growth: '+18%' },
  { category: 'Data Protection', revenue: '$28,600', listings: 623, avgPerListing: '$45.91', growth: '+12%' },
  { category: 'Network Security', revenue: '$22,400', listings: 534, avgPerListing: '$41.95', growth: '+8%' },
  { category: 'IAM Solutions', revenue: '$18,900', listings: 412, avgPerListing: '$45.87', growth: '+22%' },
  { category: 'Endpoint Security', revenue: '$14,200', listings: 389, avgPerListing: '$36.50', growth: '+5%' },
  { category: 'Threat Detection', revenue: '$11,800', listings: 298, avgPerListing: '$39.60', growth: '+28%' },
]

export const paymentFailures = [
  { customer: 'James Wilson', amount: '$49.00', reason: 'Insufficient funds', attempts: 3, lastAttempt: 'Mar 18, 2026' },
  { customer: 'Mark Stevens', amount: '$49.00', reason: 'Card expired', attempts: 2, lastAttempt: 'Mar 16, 2026' },
  { customer: 'Aisha Okafor', amount: '$49.00', reason: 'Card declined', attempts: 1, lastAttempt: 'Mar 14, 2026' },
]

export const growthProjections = {
  labels: ['Apr','May','Jun','Jul','Aug','Sep'],
  projected: [152000, 158400, 165200, 172500, 180100, 188200],
  conservative: [149000, 153500, 158200, 163000, 168000, 173200],
}

export const churnData = {
  labels: ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'],
  rate: [3.2, 3.0, 2.8, 2.9, 2.7, 2.5, 2.6, 2.4, 2.3, 2.5, 2.4, 2.4],
}
