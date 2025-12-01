// frontend/constants/paises.ts
export interface Pais {
  value: string;
  label: string;
  bandera: string;
  codigoPostalEjemplo: string;
  patronCodigoPostal: string;
}

export const PAISES: Pais[] = [
  { value: "mx", label: "México", bandera: "🇲🇽", codigoPostalEjemplo: "03810", patronCodigoPostal: "^[0-9]{5}$" },
  { value: "us", label: "Estados Unidos", bandera: "🇺🇸", codigoPostalEjemplo: "90210", patronCodigoPostal: "^[0-9]{5}(-[0-9]{4})?$" },
  { value: "es", label: "España", bandera: "🇪🇸", codigoPostalEjemplo: "28001", patronCodigoPostal: "^[0-9]{5}$" },
  { value: "ar", label: "Argentina", bandera: "🇦🇷", codigoPostalEjemplo: "C1425", patronCodigoPostal: "^[A-Z][0-9]{4}[A-Z]{0,3}$" },
  { value: "co", label: "Colombia", bandera: "🇨🇴", codigoPostalEjemplo: "110111", patronCodigoPostal: "^[0-9]{6}$" },
  { value: "pe", label: "Perú", bandera: "🇵🇪", codigoPostalEjemplo: "15001", patronCodigoPostal: "^[0-9]{5}$" },
  { value: "cl", label: "Chile", bandera: "🇨🇱", codigoPostalEjemplo: "8320000", patronCodigoPostal: "^[0-9]{7}$" },
  { value: "br", label: "Brasil", bandera: "🇧🇷", codigoPostalEjemplo: "01310-000", patronCodigoPostal: "^[0-9]{5}-[0-9]{3}$" },
  { value: "fr", label: "Francia", bandera: "🇫🇷", codigoPostalEjemplo: "75001", patronCodigoPostal: "^[0-9]{5}$" },
  { value: "de", label: "Alemania", bandera: "🇩🇪", codigoPostalEjemplo: "10115", patronCodigoPostal: "^[0-9]{5}$" },
  { value: "it", label: "Italia", bandera: "🇮🇹", codigoPostalEjemplo: "00100", patronCodigoPostal: "^[0-9]{5}$" },
  { value: "uk", label: "Reino Unido", bandera: "🇬🇧", codigoPostalEjemplo: "SW1A 1AA", patronCodigoPostal: "^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$" },
  { value: "ca", label: "Canadá", bandera: "🇨🇦", codigoPostalEjemplo: "M5V 2T6", patronCodigoPostal: "^[A-Z][0-9][A-Z] ?[0-9][A-Z][0-9]$" },
  { value: "jp", label: "Japón", bandera: "🇯🇵", codigoPostalEjemplo: "100-0001", patronCodigoPostal: "^[0-9]{3}-[0-9]{4}$" },
  { value: "au", label: "Australia", bandera: "🇦🇺", codigoPostalEjemplo: "2000", patronCodigoPostal: "^[0-9]{4}$" },
  { value: "kr", label: "Corea del Sur", bandera: "🇰🇷", codigoPostalEjemplo: "03151", patronCodigoPostal: "^[0-9]{5}$" },
  { value: "se", label: "Suecia", bandera: "🇸🇪", codigoPostalEjemplo: "111 20", patronCodigoPostal: "^[0-9]{3} ?[0-9]{2}$" },
  { value: "nl", label: "Países Bajos", bandera: "🇳🇱", codigoPostalEjemplo: "1012 JS", patronCodigoPostal: "^[0-9]{4} ?[A-Z]{2}$" },
  { value: "pt", label: "Portugal", bandera: "🇵🇹", codigoPostalEjemplo: "1000-001", patronCodigoPostal: "^[0-9]{4}-[0-9]{3}$" },
  { value: "ru", label: "Rusia", bandera: "🇷🇺", codigoPostalEjemplo: "101000", patronCodigoPostal: "^[0-9]{6}$" },
  { value: "cn", label: "China", bandera: "🇨🇳", codigoPostalEjemplo: "100000", patronCodigoPostal: "^[0-9]{6}$" },
  { value: "in", label: "India", bandera: "🇮🇳", codigoPostalEjemplo: "110001", patronCodigoPostal: "^[0-9]{6}$" },
  { value: "id", label: "Indonesia", bandera: "🇮🇩", codigoPostalEjemplo: "10110", patronCodigoPostal: "^[0-9]{5}$" },
  { value: "za", label: "Sudáfrica", bandera: "🇿🇦", codigoPostalEjemplo: "0002", patronCodigoPostal: "^[0-9]{4}$" },
  { value: "nz", label: "Nueva Zelanda", bandera: "🇳🇿", codigoPostalEjemplo: "6011", patronCodigoPostal: "^[0-9]{4}$" },
  { value: "ch", label: "Suiza", bandera: "🇨🇭", codigoPostalEjemplo: "8001", patronCodigoPostal: "^[0-9]{4}$" },
  { value: "at", label: "Austria", bandera: "🇦🇹", codigoPostalEjemplo: "1010", patronCodigoPostal: "^[0-9]{4}$" },
  { value: "be", label: "Bélgica", bandera: "🇧🇪", codigoPostalEjemplo: "1000", patronCodigoPostal: "^[0-9]{4}$" },
  { value: "dk", label: "Dinamarca", bandera: "🇩🇰", codigoPostalEjemplo: "1000", patronCodigoPostal: "^[0-9]{4}$" },
  { value: "no", label: "Noruega", bandera: "🇳🇴", codigoPostalEjemplo: "0010", patronCodigoPostal: "^[0-9]{4}$" },
  { value: "fi", label: "Finlandia", bandera: "🇫🇮", codigoPostalEjemplo: "00100", patronCodigoPostal: "^[0-9]{5}$" },
  { value: "pl", label: "Polonia", bandera: "🇵🇱", codigoPostalEjemplo: "00-001", patronCodigoPostal: "^[0-9]{2}-[0-9]{3}$" },
  { value: "cz", label: "República Checa", bandera: "🇨🇿", codigoPostalEjemplo: "110 00", patronCodigoPostal: "^[0-9]{3} ?[0-9]{2}$" },
  { value: "hu", label: "Hungría", bandera: "🇭🇺", codigoPostalEjemplo: "1011", patronCodigoPostal: "^[0-9]{4}$" },
  { value: "ro", label: "Rumanía", bandera: "🇷🇴", codigoPostalEjemplo: "010101", patronCodigoPostal: "^[0-9]{6}$" },
  { value: "gr", label: "Grecia", bandera: "🇬🇷", codigoPostalEjemplo: "101 83", patronCodigoPostal: "^[0-9]{3} ?[0-9]{2}$" },
  { value: "tr", label: "Turquía", bandera: "🇹🇷", codigoPostalEjemplo: "06100", patronCodigoPostal: "^[0-9]{5}$" },
  { value: "sa", label: "Arabia Saudita", bandera: "🇸🇦", codigoPostalEjemplo: "11564", patronCodigoPostal: "^[0-9]{5}$" },
  { value: "ae", label: "Emiratos Árabes", bandera: "🇦🇪", codigoPostalEjemplo: "00000", patronCodigoPostal: "^[0-9]{5}$" },
  { value: "il", label: "Israel", bandera: "🇮🇱", codigoPostalEjemplo: "9614303", patronCodigoPostal: "^[0-9]{7}$" },
  { value: "eg", label: "Egipto", bandera: "🇪🇬", codigoPostalEjemplo: "11511", patronCodigoPostal: "^[0-9]{5}$" },
  { value: "ng", label: "Nigeria", bandera: "🇳🇬", codigoPostalEjemplo: "900001", patronCodigoPostal: "^[0-9]{6}$" },
  { value: "za", label: "Sudáfrica", bandera: "🇿🇦", codigoPostalEjemplo: "0002", patronCodigoPostal: "^[0-9]{4}$" },
  { value: "ke", label: "Kenia", bandera: "🇰🇪", codigoPostalEjemplo: "00100", patronCodigoPostal: "^[0-9]{5}$" }
];

// Función para obtener patrones de validación más flexibles
export const getPatronFlexible = (codigoPais: string): string => {
  const pais = PAISES.find(p => p.value === codigoPais);
  if (!pais) return "^[A-Z0-9\\-\\s]{3,12}$"; // Patrón genérico flexible
  
  // Convertir patrones estrictos a patrones flexibles
  const patron = pais.patronCodigoPostal
    .replace(/\\^/g, '') // Quitar ^
    .replace(/\\\$/g, '') // Quitar $
    .replace(/\?/g, '*') // Cambiar ? por *
    .replace(/\{(\d+)\}/g, '{$1,}') // Cambiar {n} por {n,}
    .replace(/\{(\d+),(\d+)\}/g, '{$1,$2}'); // Mantener rangos
  
  return `^${patron}$`;
};

// Función para validar código postal de forma flexible
export const validarCodigoPostal = (codigo: string, paisCodigo: string): boolean => {
  if (!codigo || !paisCodigo) return false;
  
  const codigoLimpio = codigo.trim().toUpperCase();
  
  // Validación básica: longitud entre 3 y 12 caracteres
  if (codigoLimpio.length < 3 || codigoLimpio.length > 12) {
    return false;
  }
  
  // Validación por país usando patrones flexibles
  const pais = PAISES.find(p => p.value === paisCodigo);
  if (!pais) {
    // Patrón genérico para países no listados
    const patronGenerico = /^[A-Z0-9\-\s]{3,12}$/;
    return patronGenerico.test(codigoLimpio);
  }
  
  try {
    // Usar el patrón específico del país
    const regex = new RegExp(pais.patronCodigoPostal, 'i');
    return regex.test(codigoLimpio);
  } catch {
    // Si hay error con el regex, usar validación básica
    const patronBasico = /^[A-Z0-9\-\s]{3,12}$/;
    return patronBasico.test(codigoLimpio);
  }
};

// Función para formatear código postal según el país
export const formatearCodigoPostal = (codigo: string, paisCodigo: string): string => {
  if (!codigo) return '';
  
  const codigoLimpio = codigo.trim().toUpperCase();
  const pais = PAISES.find(p => p.value === paisCodigo);
  
  if (!pais) return codigoLimpio;
  
  // Ejemplos de formato según el país
  switch (paisCodigo) {
    case 'se': // Suecia: 111 20
      if (/^\d{3}\d{2}$/.test(codigoLimpio)) {
        return `${codigoLimpio.substring(0, 3)} ${codigoLimpio.substring(3)}`;
      }
      break;
    case 'nl': // Países Bajos: 1012 JS
      if (/^\d{4}[A-Z]{2}$/.test(codigoLimpio)) {
        return `${codigoLimpio.substring(0, 4)} ${codigoLimpio.substring(4)}`;
      }
      break;
    case 'uk': // Reino Unido: SW1A 1AA
      if (/^[A-Z]{1,2}\d[A-Z0-9]?\d[A-Z]{2}$/.test(codigoLimpio.replace(/\s/g, ''))) {
        const limpio = codigoLimpio.replace(/\s/g, '');
        return `${limpio.substring(0, limpio.length - 3)} ${limpio.substring(limpio.length - 3)}`;
      }
      break;
    case 'ca': // Canadá: M5V 2T6
      if (/^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(codigoLimpio.replace(/\s/g, ''))) {
        const limpio = codigoLimpio.replace(/\s/g, '');
        return `${limpio.substring(0, 3)} ${limpio.substring(3)}`;
      }
      break;
  }
  
  return codigoLimpio;
};