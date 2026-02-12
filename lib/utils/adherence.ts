/**
 * Funções auxiliares para cálculo de aderência ASO
 */

/**
 * Calcula a aderência em percentual
 */
export function calculateAdherence(
  totalEmployees: number,
  completedExams: number
): number {
  return totalEmployees > 0
    ? Number(((completedExams / totalEmployees) * 100).toFixed(2))
    : 0;
}

/**
 * Calcula a data de vencimento de um exame
 */
export function getExamExpirationDate(
  examDate: string,
  validityMonths: number
): Date {
  const date = new Date(examDate);
  date.setMonth(date.getMonth() + validityMonths);
  return date;
}

/**
 * Verifica se um exame está vencido
 */
export function isExamExpired(expirationDate: string): boolean {
  return new Date(expirationDate) < new Date();
}

/**
 * Verifica se um exame está vencendo dentro de X dias
 */
export function isExpiringWithinDays(
  expirationDate: string,
  days: number
): boolean {
  const expDate = new Date(expirationDate);
  const warningDate = new Date();
  warningDate.setDate(warningDate.getDate() + days);
  const today = new Date();

  return expDate <= warningDate && expDate >= today;
}

/**
 * Formata a data de vencimento para exibição
 */
export function formatExpirationDate(expirationDate: string): string {
  const date = new Date(expirationDate);
  return date.toLocaleDateString('pt-BR');
}

/**
 * Retorna o status de um exame baseado na data de vencimento
 */
export function getExamStatusByExpiration(expirationDate: string | undefined): 'ok' | 'warning' | 'expired' {
  if (!expirationDate) return 'warning';

  if (isExamExpired(expirationDate)) {
    return 'expired';
  }

  if (isExpiringWithinDays(expirationDate, 30)) {
    return 'warning';
  }

  return 'ok';
}
