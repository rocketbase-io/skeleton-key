export interface ValidationResponse {
  errorCodes: string[];
  valid: boolean;
  fields: Record<string, string[]>
}
