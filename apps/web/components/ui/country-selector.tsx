"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { getCountries, getCountryCallingCode, CountryCode } from "libphonenumber-js";
import * as flags from "country-flag-icons/react/3x2";

import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";

export interface CountryData {
  code: CountryCode;
  dialCode: string;
  name: string;
}

// Flag component that renders SVG flags
function FlagIcon({
  countryCode,
  className,
}: {
  countryCode: string;
  className?: string;
}) {
  const FlagComponent = flags[countryCode as keyof typeof flags];
  if (!FlagComponent) {
    // Fallback to country code if flag not found
    return (
      <span className={cn("inline-flex items-center justify-center text-xs font-medium", className)}>
        {countryCode}
      </span>
    );
  }
  return <FlagComponent className={cn("inline-block rounded-sm", className)} />;
}

// Get country name from code (basic mapping for common countries)
function getCountryName(code: CountryCode): string {
  const countryNames: Record<string, string> = {
    AF: "Afghanistan",
    AL: "Albania",
    DZ: "Algeria",
    AD: "Andorra",
    AO: "Angola",
    AR: "Argentina",
    AM: "Armenia",
    AU: "Australia",
    AT: "Austria",
    AZ: "Azerbaijan",
    BH: "Bahrain",
    BD: "Bangladesh",
    BY: "Belarus",
    BE: "Belgium",
    BJ: "Benin",
    BT: "Bhutan",
    BO: "Bolivia",
    BA: "Bosnia and Herzegovina",
    BW: "Botswana",
    BR: "Brazil",
    BN: "Brunei",
    BG: "Bulgaria",
    BF: "Burkina Faso",
    BI: "Burundi",
    KH: "Cambodia",
    CM: "Cameroon",
    CA: "Canada",
    CF: "Central African Republic",
    TD: "Chad",
    CL: "Chile",
    CN: "China",
    CO: "Colombia",
    CG: "Congo",
    CR: "Costa Rica",
    HR: "Croatia",
    CU: "Cuba",
    CY: "Cyprus",
    CZ: "Czech Republic",
    DK: "Denmark",
    DJ: "Djibouti",
    DO: "Dominican Republic",
    EC: "Ecuador",
    EG: "Egypt",
    SV: "El Salvador",
    GQ: "Equatorial Guinea",
    ER: "Eritrea",
    EE: "Estonia",
    ET: "Ethiopia",
    FI: "Finland",
    FR: "France",
    GA: "Gabon",
    GM: "Gambia",
    GE: "Georgia",
    DE: "Germany",
    GH: "Ghana",
    GR: "Greece",
    GT: "Guatemala",
    GN: "Guinea",
    GW: "Guinea-Bissau",
    GY: "Guyana",
    HT: "Haiti",
    HN: "Honduras",
    HK: "Hong Kong",
    HU: "Hungary",
    IS: "Iceland",
    IN: "India",
    ID: "Indonesia",
    IR: "Iran",
    IQ: "Iraq",
    IE: "Ireland",
    IL: "Israel",
    IT: "Italy",
    CI: "Ivory Coast",
    JM: "Jamaica",
    JP: "Japan",
    JO: "Jordan",
    KZ: "Kazakhstan",
    KE: "Kenya",
    KW: "Kuwait",
    KG: "Kyrgyzstan",
    LA: "Laos",
    LV: "Latvia",
    LB: "Lebanon",
    LS: "Lesotho",
    LR: "Liberia",
    LY: "Libya",
    LI: "Liechtenstein",
    LT: "Lithuania",
    LU: "Luxembourg",
    MO: "Macau",
    MK: "Macedonia",
    MG: "Madagascar",
    MW: "Malawi",
    MY: "Malaysia",
    MV: "Maldives",
    ML: "Mali",
    MT: "Malta",
    MR: "Mauritania",
    MU: "Mauritius",
    MX: "Mexico",
    MD: "Moldova",
    MC: "Monaco",
    MN: "Mongolia",
    ME: "Montenegro",
    MA: "Morocco",
    MZ: "Mozambique",
    MM: "Myanmar",
    NA: "Namibia",
    NP: "Nepal",
    NL: "Netherlands",
    NZ: "New Zealand",
    NI: "Nicaragua",
    NE: "Niger",
    NG: "Nigeria",
    KP: "North Korea",
    NO: "Norway",
    OM: "Oman",
    PK: "Pakistan",
    PA: "Panama",
    PG: "Papua New Guinea",
    PY: "Paraguay",
    PE: "Peru",
    PH: "Philippines",
    PL: "Poland",
    PT: "Portugal",
    QA: "Qatar",
    RE: "Réunion",
    RO: "Romania",
    RU: "Russia",
    RW: "Rwanda",
    SA: "Saudi Arabia",
    SN: "Senegal",
    RS: "Serbia",
    SG: "Singapore",
    SK: "Slovakia",
    SI: "Slovenia",
    SO: "Somalia",
    ZA: "South Africa",
    KR: "South Korea",
    ES: "Spain",
    LK: "Sri Lanka",
    SD: "Sudan",
    SR: "Suriname",
    SZ: "Swaziland",
    SE: "Sweden",
    CH: "Switzerland",
    SY: "Syria",
    TW: "Taiwan",
    TJ: "Tajikistan",
    TZ: "Tanzania",
    TH: "Thailand",
    TG: "Togo",
    TN: "Tunisia",
    TR: "Turkey",
    TM: "Turkmenistan",
    UG: "Uganda",
    UA: "Ukraine",
    AE: "United Arab Emirates",
    GB: "United Kingdom",
    US: "United States",
    UY: "Uruguay",
    UZ: "Uzbekistan",
    VE: "Venezuela",
    VN: "Vietnam",
    YE: "Yemen",
    ZM: "Zambia",
    ZW: "Zimbabwe",
    GP: "Guadeloupe",
    MQ: "Martinique",
    GF: "French Guiana",
    NC: "New Caledonia",
    PF: "French Polynesia",
    PM: "Saint Pierre and Miquelon",
    WF: "Wallis and Futuna",
    YT: "Mayotte",
  };
  return countryNames[code] || code;
}

// Build countries list with dial codes
function buildCountriesList(): CountryData[] {
  const countryCodes = getCountries();

  return countryCodes
    .map((code) => {
      try {
        const dialCode = `+${getCountryCallingCode(code)}`;
        return {
          code,
          dialCode,
          name: getCountryName(code),
        };
      } catch {
        return null;
      }
    })
    .filter((country): country is CountryData => country !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
}

const COUNTRIES = buildCountriesList();

// Put France at the top for quick access
const COUNTRIES_WITH_FRANCE_FIRST = [
  COUNTRIES.find((c) => c.code === "FR")!,
  ...COUNTRIES.filter((c) => c.code !== "FR"),
];

interface CountrySelectorProps {
  value: CountryCode;
  onChange: (country: CountryData) => void;
  disabled?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  noResultsText?: string;
  className?: string;
}

export function CountrySelector({
  value,
  onChange,
  disabled = false,
  placeholder = "Select country",
  searchPlaceholder = "Search country...",
  noResultsText = "No country found",
  className,
}: CountrySelectorProps) {
  const [open, setOpen] = React.useState(false);

  const selectedCountry = COUNTRIES.find((c) => c.code === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "justify-between font-normal",
            !selectedCountry && "text-muted-foreground",
            className
          )}
        >
          {selectedCountry ? (
            <span className="flex items-center gap-2 truncate">
              <FlagIcon countryCode={selectedCountry.code} className="h-4 w-5" />
              <span className="hidden sm:inline">{selectedCountry.name}</span>
              <span className="text-muted-foreground">
                {selectedCountry.dialCode}
              </span>
            </span>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{noResultsText}</CommandEmpty>
            <CommandGroup>
              {COUNTRIES_WITH_FRANCE_FIRST.map((country) => (
                <CommandItem
                  key={country.code}
                  value={`${country.name} ${country.code} ${country.dialCode}`}
                  onSelect={() => {
                    onChange(country);
                    setOpen(false);
                  }}
                >
                  <span className="flex items-center gap-2 flex-1">
                    <FlagIcon countryCode={country.code} className="h-4 w-5" />
                    <span className="truncate">{country.name}</span>
                    <span className="text-muted-foreground text-xs ml-auto">
                      {country.dialCode}
                    </span>
                  </span>
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4",
                      value === country.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { COUNTRIES, getCountryName, FlagIcon };
