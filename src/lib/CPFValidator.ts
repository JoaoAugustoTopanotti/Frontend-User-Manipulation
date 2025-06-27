import { z } from "zod";

export function validateCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '');

  if (cleaned.length !== 11 || /^(\d)\1{10}$/.test(cleaned)) {
    return false; // inválido se não tem 11 dígitos ou todos forem iguais
  }

  const calcCheckDigit = (digits: string, factor: number) => {
    let total = 0;
    for (let i = 0; i < digits.length; i++) {
      total += parseInt(digits[i]) * (factor - i);
    }
    const rest = total % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const firstCheck = calcCheckDigit(cleaned.substring(0, 9), 10);
  const secondCheck = calcCheckDigit(cleaned.substring(0, 10), 11);

  return (
    firstCheck === parseInt(cleaned[9]) &&
    secondCheck === parseInt(cleaned[10])
  );
}