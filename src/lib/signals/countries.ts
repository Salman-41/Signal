// Country configuration for multi-country signal data
// Maps country codes to their display names and API-specific identifiers

export interface Country {
  code: string;
  name: string;
  flag: string;
  fredSuffix?: string; // Suffix for FRED series IDs
  isDefault?: boolean;
}

// Comprehensive list of countries and territories (expanded to ~100+)
export const COUNTRIES: Country[] = [
  // North America
  { code: "US", name: "United States", flag: "🇺🇸", fredSuffix: "", isDefault: true },
  { code: "CA", name: "Canada", flag: "🇨🇦", fredSuffix: "CAN" },
  { code: "MX", name: "Mexico", flag: "🇲🇽", fredSuffix: "MEX" },
  { code: "PR", name: "Puerto Rico", flag: "🇵🇷", fredSuffix: "PRI" },
  { code: "CU", name: "Cuba", flag: "🇨🇺" },
  { code: "DO", name: "Dominican Republic", flag: "🇩🇴" },
  { code: "PA", name: "Panama", flag: "🇵🇦" },
  { code: "CR", name: "Costa Rica", flag: "🇨🇷" },
  
  // Europe
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", fredSuffix: "GBR" },
  { code: "DE", name: "Germany", flag: "🇩🇪", fredSuffix: "DEU" },
  { code: "FR", name: "France", flag: "🇫🇷", fredSuffix: "FRA" },
  { code: "IT", name: "Italy", flag: "🇮🇹", fredSuffix: "ITA" },
  { code: "ES", name: "Spain", flag: "🇪🇸", fredSuffix: "ESP" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", fredSuffix: "NLD" },
  { code: "BE", name: "Belgium", flag: "🇧🇪", fredSuffix: "BEL" },
  { code: "AT", name: "Austria", flag: "🇦🇹", fredSuffix: "AUT" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭", fredSuffix: "CHE" },
  { code: "SE", name: "Sweden", flag: "🇸🇪", fredSuffix: "SWE" },
  { code: "NO", name: "Norway", flag: "🇳🇴", fredSuffix: "NOR" },
  { code: "DK", name: "Denmark", flag: "🇩🇰", fredSuffix: "DNK" },
  { code: "FI", name: "Finland", flag: "🇫🇮", fredSuffix: "FIN" },
  { code: "PL", name: "Poland", flag: "🇵🇱", fredSuffix: "POL" },
  { code: "PT", name: "Portugal", flag: "🇵🇹", fredSuffix: "PRT" },
  { code: "GR", name: "Greece", flag: "🇬🇷", fredSuffix: "GRC" },
  { code: "IE", name: "Ireland", flag: "🇮🇪", fredSuffix: "IRL" },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿", fredSuffix: "CZE" },
  { code: "HU", name: "Hungary", flag: "🇭🇺", fredSuffix: "HUN" },
  { code: "RO", name: "Romania", flag: "🇷🇴" },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬" },
  { code: "HR", name: "Croatia", flag: "🇭🇷" },
  { code: "SK", name: "Slovakia", flag: "🇸🇰" },
  { code: "EE", name: "Estonia", flag: "🇪🇪" },
  { code: "LV", name: "Latvia", flag: "🇱🇻" },
  { code: "LT", name: "Lithuania", flag: "🇱🇹" },
  { code: "SI", name: "Slovenia", flag: "🇸🇮" },
  { code: "LU", name: "Luxembourg", flag: "🇱🇺" },
  { code: "IS", name: "Iceland", flag: "🇮🇸" },
  { code: "MT", name: "Malta", flag: "🇲🇹" },
  { code: "CY", name: "Cyprus", flag: "🇨🇾" },
  
  // Asia Pacific
  { code: "JP", name: "Japan", flag: "🇯🇵", fredSuffix: "JPN" },
  { code: "CN", name: "China", flag: "🇨🇳", fredSuffix: "CHN" },
  { code: "IN", name: "India", flag: "🇮🇳", fredSuffix: "IND" },
  { code: "KR", name: "South Korea", flag: "🇰🇷", fredSuffix: "KOR" },
  { code: "AU", name: "Australia", flag: "🇦🇺", fredSuffix: "AUS" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿", fredSuffix: "NZL" },
  { code: "SG", name: "Singapore", flag: "🇸🇬", fredSuffix: "SGP" },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰", fredSuffix: "HKG" },
  { code: "TW", name: "Taiwan", flag: "🇹🇼" },
  { code: "ID", name: "Indonesia", flag: "��", fredSuffix: "IDN" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾", fredSuffix: "MYS" },
  { code: "TH", name: "Thailand", flag: "��", fredSuffix: "THA" },
  { code: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩" },
  { code: "LK", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "MM", name: "Myanmar", flag: "🇲🇲" },
  { code: "KH", name: "Cambodia", flag: "🇰🇭" },
  { code: "MN", name: "Mongolia", flag: "🇲🇳" },
  
  // Middle East & Central Asia
  { code: "AE", name: "UAE", flag: "🇦🇪", fredSuffix: "ARE" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", fredSuffix: "SAU" },
  { code: "IL", name: "Israel", flag: "🇮🇱", fredSuffix: "ISR" },
  { code: "TR", name: "Turkey", flag: "🇹🇷", fredSuffix: "TUR" },
  { code: "QA", name: "Qatar", flag: "🇶🇦" },
  { code: "KW", name: "Kuwait", flag: "🇰🇼" },
  { code: "OM", name: "Oman", flag: "🇴🇲" },
  { code: "JO", name: "Jordan", flag: "🇯🇴" },
  { code: "LB", name: "Lebanon", flag: "🇱🇧" },
  { code: "KZ", name: "Kazakhstan", flag: "🇰�" },
  { code: "UZ", name: "Uzbekistan", flag: "🇺🇿" },
  
  // South & Central America
  { code: "BR", name: "Brazil", flag: "🇧🇷", fredSuffix: "BRA" },
  { code: "AR", name: "Argentina", flag: "🇦🇷", fredSuffix: "ARG" },
  { code: "CL", name: "Chile", flag: "🇨🇱", fredSuffix: "CHL" },
  { code: "CO", name: "Colombia", flag: "🇨🇴", fredSuffix: "COL" },
  { code: "PE", name: "Peru", flag: "🇵🇪" },
  { code: "UY", name: "Uruguay", flag: "🇺🇾" },
  { code: "VE", name: "Venezuela", flag: "🇻🇪" },
  { code: "EC", name: "Ecuador", flag: "🇪🇨" },
  { code: "PY", name: "Paraguay", flag: "🇵🇾" },
  { code: "BO", name: "Bolivia", flag: "🇧🇴" },
  
  // Africa
  { code: "ZA", name: "South Africa", flag: "🇿🇦", fredSuffix: "ZAF" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", fredSuffix: "NGA" },
  { code: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "MA", name: "Morocco", flag: "🇲🇦" },
  { code: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "ET", name: "Ethiopia", flag: "🇪🇹" },
  { code: "TZ", name: "Tanzania", flag: "🇹🇿" },
  { code: "DZ", name: "Algeria", flag: "🇩🇿" },
  { code: "TN", name: "Tunisia", flag: "🇹🇳" },
  
  // Eurasia
  { code: "RU", name: "Russia", flag: "🇷🇺", fredSuffix: "RUS" },
  { code: "UA", name: "Ukraine", flag: "🇺🇦" },
  { code: "GE", name: "Georgia", flag: "🇬🇪" },
  { code: "AZ", name: "Azerbaijan", flag: "🇦🇿" },
  { code: "AM", name: "Armenia", flag: "🇦🇲" },
  { code: "RS", name: "Serbia", flag: "🇷🇸" },
  { code: "ME", name: "Montenegro", flag: "🇲🇪" },
  { code: "AL", name: "Albania", flag: "🇦🇱" },
  { code: "MK", name: "North Macedonia", flag: "🇲🇰" },
  { code: "BA", name: "Bosnia & Herzegovina", flag: "🇧🇦" },

  // More Africa
  { code: "SN", name: "Senegal", flag: "🇸🇳" },
  { code: "CI", name: "Cote d'Ivoire", flag: "🇨🇮" },
  { code: "CM", name: "Cameroon", flag: "🇨🇲" },
  { code: "UG", name: "Uganda", flag: "🇺🇬" },
  { code: "RW", name: "Rwanda", flag: "🇷🇼" },
  { code: "MU", name: "Mauritius", flag: "🇲🇺" },
  { code: "BW", name: "Botswana", flag: "🇧🇼" },
  { code: "NA", name: "Namibia", flag: "🇳🇦" },
  { code: "AO", name: "Angola", flag: "🇦🇴" },
  { code: "ZM", name: "Zambia", flag: "🇿🇲" },
  { code: "ZW", name: "Zimbabwe", flag: "🇿🇼" },
  { code: "MG", name: "Madagascar", flag: "🇲🇬" },
  { code: "SD", name: "Sudan", flag: "🇸🇩" },
  { code: "LY", name: "Libya", flag: "🇱🇾" },

  // More Middle East & Asia
  { code: "BH", name: "Bahrain", flag: "🇧🇭" },
  { code: "IR", name: "Iran", flag: "🇮🇷" },
  { code: "IQ", name: "Iraq", flag: "🇮🇶" },
  { code: "YE", name: "Yemen", flag: "🇾🇪" },
  { code: "SY", name: "Syria", flag: "🇸🇾" },
  { code: "AF", name: "Afghanistan", flag: "🇦🇫" },
  { code: "NP", name: "Nepal", flag: "🇳🇵" },
  { code: "BT", name: "Bhutan", flag: "🇧🇹" },
  { code: "MV", name: "Maldives", flag: "🇲🇻" },
  { code: "BN", name: "Brunei", flag: "🇧🇳" },
  { code: "LA", name: "Laos", flag: "🇱🇦" },

  // More Americas & Caribbean
  { code: "JM", name: "Jamaica", flag: "🇯🇲" },
  { code: "TT", name: "Trinidad & Tobago", flag: "🇹🇹" },
  { code: "BS", name: "Bahamas", flag: "🇧🇸" },
  { code: "BB", name: "Barbados", flag: "🇧🇧" },
  { code: "GT", name: "Guatemala", flag: "🇬🇹" },
  { code: "SV", name: "El Salvador", flag: "🇸🇻" },
  { code: "HN", name: "Honduras", flag: "🇭🇳" },
  { code: "NI", name: "Nicaragua", flag: "🇳🇮" },
  { code: "BZ", name: "Belize", flag: "🇧🇿" },
  { code: "HT", name: "Haiti", flag: "🇭🇹" },
  { code: "GY", name: "Guyana", flag: "🇬🇾" },
  { code: "SR", name: "Suriname", flag: "🇸🇷" },
  
  // Oceania
  { code: "FJ", name: "Fiji", flag: "🇫🇯" },
  { code: "PG", name: "Papua New Guinea", flag: "🇵🇬" },
  { code: "VU", name: "Vanuatu", flag: "🇻🇺" },
  { code: "WS", name: "Samoa", flag: "🇼🇸" },
  { code: "TO", name: "Tonga", flag: "🇹🇴" },
];

// Signal types that support country selection
export const COUNTRY_ENABLED_SIGNALS = [
  "gdp-growth",
  "inflation-cpi",
  "unemployment",
  "consumer-sentiment",
];

// FRED series mappings per signal type and country
// Format: { signalId: { countryCode: seriesId } }
export const FRED_SERIES_MAP: Record<string, Record<string, string>> = {
  "gdp-growth": {
    US: "GDP",
    CA: "NGDPRSAXDCCAQ", // Canada Real GDP
    GB: "CLVMNACSCAB1GQUK", // UK Real GDP
    DE: "CLVMNACSCAB1GQDE", // Germany Real GDP
    FR: "CLVMNACSCAB1GQFR", // France Real GDP
    JP: "JPNRGDPEXP", // Japan Real GDP
    CN: "MKTGDPCNA646NWDB", // China GDP
    IN: "MKTGDPINA646NWDB", // India GDP
    AU: "AUSGDPNQDSMEI", // Australia GDP
    BR: "BRAGDPRQPSMEI", // Brazil GDP
    MX: "MEXGDPNQDSMEI", // Mexico GDP
    KR: "KORGDPNQDSMEI", // South Korea GDP
    IT: "ITANRGDPQDSNAQ", // Italy GDP
    ES: "ESPNRGDPQDSNAQ", // Spain GDP
    NL: "NLDNRGDPQDSNAQ", // Netherlands GDP
    CH: "CHLNRGDPQDSNAQ", // Switzerland GDP
    SE: "SWENRGDPQDSNAQ", // Sweden GDP
    PL: "POLNRGDPQDSNAQ", // Poland GDP
    TR: "TURNRGDPQDSNAQ", // Turkey GDP
    ZA: "ZAFNRGDPQDSNAQ", // South Africa GDP
    SA: "SAUNRGDPQDSNAQ", // Saudi Arabia GDP
    IL: "ISRNRGDPQDSNAQ", // Israel GDP
  },
  "inflation-cpi": {
    US: "CPIAUCSL",
    CA: "CPALCY01CAM661N", // Canada CPI
    GB: "CPALCY01GBM659N", // UK CPI
    DE: "CPALCY01DEM659N", // Germany CPI
    FR: "CPALCY01FRM659N", // France CPI
    JP: "CPALCY01JPM659N", // Japan CPI
    CN: "CHNCPIALLMINMEI", // China CPI
    IN: "INDCPIALLMINMEI", // India CPI
    AU: "AUSCPIALLQINMEI", // Australia CPI
    BR: "BRACPIALLMINMEI", // Brazil CPI
    MX: "MEXCPIALLMINMEI", // Mexico CPI
    KR: "KORCPIALLMINMEI", // South Korea CPI
    IT: "ITACPIALLMINMEI", // Italy CPI
    ES: "ESPCPIALLMINMEI", // Spain CPI
    NL: "NLDCPIALLMINMEI", // Netherlands CPI
    CH: "CHECPIALLMINMEI", // Switzerland CPI
    SE: "SWECPIALLMINMEI", // Sweden CPI
    PL: "POLCPIALLMINMEI", // Poland CPI
    TR: "TURCPIALLMINMEI", // Turkey CPI
    ZA: "ZAFCPIALLMINMEI", // South Africa CPI
    RU: "RUSCPIALLMINMEI", // Russia CPI
    SA: "SAUCPIALLMINMEI", // Saudi Arabia CPI
    AE: "ARECPIALLMINMEI", // UAE CPI
    SG: "SGPCPIALLMINMEI", // Singapore CPI
    HK: "HKGCPIALLMINMEI", // Hong Kong CPI
  },
  "unemployment": {
    US: "UNRATE",
    CA: "LRUNTTTTCAM156S", // Canada Unemployment
    GB: "LRUNTTTTGBM156S", // UK Unemployment
    DE: "LRUNTTTTDEM156S", // Germany Unemployment
    FR: "LRUNTTTTFRM156S", // France Unemployment
    JP: "LRUNTTTTJPM156S", // Japan Unemployment
    AU: "LRUNTTTTAUM156S", // Australia Unemployment
    BR: "LRUNTTTTBRM156S", // Brazil Unemployment
    MX: "LRUNTTTTMXM156S", // Mexico Unemployment
    KR: "LRUNTTTTKRM156S", // South Korea Unemployment
    IT: "LRUNTTTTITM156S", // Italy Unemployment
    ES: "LRUNTTTTESM156S", // Spain Unemployment
    NL: "LRUNTTTTNLM156S", // Netherlands Unemployment
    CH: "LRUNTTTTCHM156S", // Switzerland Unemployment
    SE: "LRUNTTTTSEM156S", // Sweden Unemployment
    PL: "LRUNTTTTPLM156S", // Poland Unemployment
    TR: "LRUNTTTTTRM156S", // Turkey Unemployment
    ZA: "LRUNTTTTZAM156S", // South Africa Unemployment
    RU: "LRUNTTTTRUM156S", // Russia Unemployment
    IN: "LRUNTTTTINQ156S", // India Unemployment (Quarterly)
    CN: "LRUNTTTTCNQ156S", // China Unemployment (Quarterly)
  },
  "consumer-sentiment": {
    US: "UMCSENT",
    // Consumer sentiment is primarily US-focused via University of Michigan
    // Other countries have different sentiment indicators
    GB: "GBRCCIS", // UK Consumer Confidence
    DE: "DEUCCIS", // Germany Consumer Confidence
    FR: "FRACCIS", // France Consumer Confidence
    JP: "JPNCCIS", // Japan Consumer Confidence
    AU: "AUSCCIS", // Australia Consumer Confidence
  },
};

// Get countries available for a specific signal
export function getCountriesForSignal(signalId: string): Country[] {
  if (!COUNTRY_ENABLED_SIGNALS.includes(signalId)) {
    return [];
  }
  
  // Return all countries if the signal is enabled for country selection
  // This allows us to show mock data even for countries without real FRED IDs
  return COUNTRIES;
}

// Get FRED series ID for a signal and country combination
export function getFREDSeriesForCountry(signalId: string, countryCode: string): string | null {
  const signalSeries = FRED_SERIES_MAP[signalId];
  if (!signalSeries) return null;
  
  return signalSeries[countryCode] || null;
}

// Get default country
export function getDefaultCountry(): Country {
  return COUNTRIES.find(c => c.isDefault) || COUNTRIES[0];
}
