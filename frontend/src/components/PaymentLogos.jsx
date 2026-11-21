export function VisaLogo({ className = 'h-6' }) {
  return (
    <svg
      viewBox="0 0 48 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Visa"
    >
      <rect width="48" height="32" rx="4" fill="#1434CB" />
      <path
        d="M19.2 21.5H16.7L18.3 11.2H20.8L19.2 21.5ZM14.9 11.2L12.5 18.2L12.2 16.9C11.7 15.2 10.3 13.4 8.7 12.5L10.9 21.5H13.6L17.7 11.2H14.9ZM30.5 21.5H32.8L30.8 11.2H28.9C28.4 11.2 28 11.5 27.8 12L23.7 21.5H26.4L26.9 20.1H30.2L30.5 21.5ZM27.6 18.2L29 14.3L29.8 18.2H27.6ZM25.4 14.6C25.4 13.3 24.3 12.8 23.3 12.3C22.2 11.8 21.5 11.4 21.5 10.8C21.5 10.3 22.1 9.8 23.2 9.8C24.1 9.8 24.9 10 25.4 10.3L25.9 8.2C25.2 7.9 24.2 7.7 23 7.7C20.3 7.7 18.5 9.1 18.5 11.2C18.5 12.7 19.8 13.6 20.9 14.1C21.9 14.6 22.4 15 22.4 15.6C22.4 16.3 21.5 16.7 20.6 16.7C19.6 16.7 18.6 16.3 18 15.9L17.4 18.1C18.2 18.5 19.4 18.8 20.5 18.8C23.5 18.8 25.4 17.3 25.4 14.6Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function MastercardLogo({ className = 'h-6' }) {
  return (
    <svg
      viewBox="0 0 48 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Mastercard"
    >
      <rect width="48" height="32" rx="4" fill="#0A0708" />
      <circle cx="19" cy="16" r="9" fill="#EB001B" />
      <circle cx="29" cy="16" r="9" fill="#F79E1B" />
      <path
        d="M24 9.7C25.9 11.3 27 13.5 27 16C27 18.5 25.9 20.7 24 22.3C22.1 20.7 21 18.5 21 16C21 13.5 22.1 11.3 24 9.7Z"
        fill="#FF5F00"
      />
    </svg>
  );
}

export function AmexLogo({ className = 'h-6' }) {
  return (
    <svg
      viewBox="0 0 48 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="American Express"
    >
      <rect width="48" height="32" rx="4" fill="#006FCF" />
      <path
        d="M8 12.5H12.2L14.4 17.5L16.6 12.5H20.8V19.5H18.2V15.5L15.6 19.5H13.2L10.6 15.5V19.5H8V12.5ZM22 12.5H29.5V14.5H24.5V15H28.5V17H24.5V17.5H29.5V19.5H22V12.5ZM32 12.5L34.5 15.8L37 12.5H39.8L36 16L39.8 19.5H37L34.5 16.2L32 19.5H29.2L33 16L29.2 12.5H32Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function ApplePayLogo({ className = 'h-6' }) {
  return (
    <svg
      viewBox="0 0 48 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Apple Pay"
    >
      <rect width="48" height="32" rx="4" fill="#000000" stroke="#333333" strokeWidth="0.5" />
      {/* Apple Logo */}
      <path
        d="M15.4 12.7C14.8 13.4 13.9 14 12.9 13.9C12.8 12.9 13.2 11.9 13.8 11.2C14.4 10.5 15.4 10 16.3 10C16.4 11.1 15.9 12 15.4 12.7ZM16.3 14C14.8 14 14.1 13.1 13.1 13.1C12.1 13.1 11.3 13.9 10.7 15C9.4 17.2 10.4 20.5 11.7 22.3C12.3 23.2 13.1 24.2 14.1 24.2C15.1 24.2 15.5 23.5 16.7 23.5C17.9 23.5 18.2 24.2 19.2 24.2C20.3 24.2 20.9 23.3 21.6 22.4C22.3 21.3 22.6 20.3 22.7 20.2C22.6 20.1 20.7 19.4 20.7 17.2C20.7 15.3 22.2 14.4 22.3 14.3C21.3 12.9 19.8 12.8 19.3 12.8C18 12.7 17.1 13.6 16.3 14Z"
        fill="#FFFFFF"
      />
      {/* Pay text */}
      <path
        d="M26.4 12.2H29C30.6 12.2 31.8 13.3 31.8 14.9C31.8 16.5 30.6 17.6 29 17.6H27.9V21.5H26.4V12.2ZM27.9 16.3H28.9C29.8 16.3 30.3 15.7 30.3 14.9C30.3 14.1 29.8 13.5 28.9 13.5H27.9V16.3ZM33.5 19.4C33.5 18.2 34.5 17.5 36.1 17.4L37.8 17.3V16.7C37.8 15.9 37.3 15.4 36.3 15.4C35.5 15.4 34.8 15.8 34.7 16.4H33.3C33.4 15.1 34.6 14.2 36.4 14.2C38.2 14.2 39.3 15.1 39.3 16.6V21.5H37.8V20.2H37.7C37.2 21 36.2 21.6 35.1 21.6C33.9 21.6 33.5 20.5 33.5 19.4ZM37.8 18.8V18.3L36.3 18.4C35.4 18.5 34.9 18.9 34.9 19.5C34.9 20.1 35.5 20.5 36.2 20.5C37.2 20.5 37.8 19.7 37.8 18.8ZM41.4 23.5L42.8 19.6L41.3 14.4H42.9L43.6 17.6H43.7L44.5 14.4H46L42.8 23.5H41.4Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function GooglePayLogo({ className = 'h-6' }) {
  return (
    <svg
      viewBox="0 0 48 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Google Pay"
    >
      <rect width="48" height="32" rx="4" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="0.5" />
      {/* Google G */}
      <path
        d="M17.4 16.2C17.4 15.7 17.3 15.3 17.3 14.9H12.5V16.9H15.2C15.1 17.6 14.7 18.2 14.1 18.6V20H15.8C16.8 19.1 17.4 17.8 17.4 16.2Z"
        fill="#4285F4"
      />
      <path
        d="M12.5 21.2C13.9 21.2 15.1 20.7 15.8 20L14.1 18.6C13.6 19 13.1 19.2 12.5 19.2C11.1 19.2 9.9 18.2 9.5 17H7.7V18.4C8.6 20.1 10.4 21.2 12.5 21.2Z"
        fill="#34A853"
      />
      <path
        d="M9.5 17C9.4 16.7 9.3 16.4 9.3 16C9.3 15.6 9.4 15.3 9.5 15V13.6H7.7C7.3 14.4 7.1 15.2 7.1 16C7.1 16.8 7.3 17.6 7.7 18.4L9.5 17Z"
        fill="#FBBC04"
      />
      <path
        d="M12.5 12.8C13.3 12.8 14 13.1 14.5 13.6L16 12.1C15 11.2 13.8 10.7 12.5 10.7C10.4 10.7 8.6 11.8 7.7 13.6L9.5 15C9.9 13.8 11.1 12.8 12.5 12.8Z"
        fill="#EA4335"
      />
      {/* Pay text */}
      <path
        d="M22.5 13.5H25.3C26.9 13.5 28 14.6 28 16C28 17.5 26.9 18.6 25.3 18.6H23.9V21.5H22.5V13.5ZM23.9 17.3H25.3C26.2 17.3 26.7 16.8 26.7 16C26.7 15.3 26.2 14.8 25.3 14.8H23.9V17.3ZM29.4 19.4C29.4 18.3 30.3 17.6 31.8 17.5L33.3 17.4V16.9C33.3 16.1 32.8 15.7 32 15.7C31.2 15.7 30.6 16.1 30.5 16.6H29.2C29.3 15.4 30.4 14.5 32 14.5C33.6 14.5 34.6 15.4 34.6 16.8V21.5H33.3V20.2H33.2C32.7 21 31.8 21.6 30.8 21.6C29.7 21.6 29.4 20.5 29.4 19.4ZM33.3 18.9V18.4L32 18.5C31.2 18.6 30.8 18.9 30.8 19.5C30.8 20.1 31.3 20.4 32 20.4C32.9 20.4 33.3 19.7 33.3 18.9ZM36.5 23.3L37.8 19.7L36.3 14.8H37.8L38.5 17.8H38.6L39.3 14.8H40.7L37.8 23.3H36.5Z"
        fill="#5F6368"
      />
    </svg>
  );
}

export function PayPalLogo({ className = 'h-6' }) {
  return (
    <svg
      viewBox="0 0 48 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="PayPal"
    >
      <rect width="48" height="32" rx="4" fill="#003087" />
      <path
        d="M17.8 23.5L20.2 8.5H25.3C28.2 8.5 29.9 9.8 29.4 12.8C29.1 14.8 27.8 16.6 25.5 16.6H22.9L21.7 23.5H17.8Z"
        fill="#0079C1"
      />
      <path
        d="M20.2 23.5L22.2 11.2H26.7C29.3 11.2 30.9 12.4 30.4 15.1C29.9 18 27.9 19.3 25.8 19.3H23.7L22.9 23.5H20.2Z"
        fill="#00457C"
        opacity="0.6"
      />
      <path
        d="M21.2 23.5L23 12.2H27.5C29.7 12.2 31.4 13.3 31 15.6C30.5 18.3 28.6 19.5 26.5 19.5H24.5L23.7 23.5H21.2Z"
        fill="#0079C1"
      />
    </svg>
  );
}

export function KlarnaLogo({ className = 'h-6' }) {
  return (
    <svg
      viewBox="0 0 48 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Klarna"
    >
      <rect width="48" height="32" rx="4" fill="#FFB3C7" />
      {/* Klarna K */}
      <path
        d="M11 9H13.6V23H11V9ZM17.4 9H20.2L14.7 15.6L20.8 23H17.6L12.9 17.3L15.3 14.5L17.4 9ZM22.5 18.5C22.5 16.5 24 15 26.1 15C28.2 15 29.7 16.5 29.7 18.5C29.7 20.5 28.2 22 26.1 22C24 22 22.5 20.5 22.5 18.5ZM24.8 18.5C24.8 19.4 25.4 20.1 26.1 20.1C26.8 20.1 27.4 19.4 27.4 18.5C27.4 17.6 26.8 16.9 26.1 16.9C25.4 16.9 24.8 17.6 24.8 18.5ZM32 23H29.7V15.2H32V16.2C32.5 15.5 33.4 15 34.4 15V17.3C34.2 17.3 34 17.3 33.7 17.3C32.8 17.3 32 18 32 19.1V23ZM36 21.2C36 20.5 36.6 20 37.3 20C38 20 38.6 20.5 38.6 21.2C38.6 21.9 38 22.5 37.3 22.5C36.6 22.5 36 21.9 36 21.2Z"
        fill="#0A0708"
      />
    </svg>
  );
}

export function ClearpayLogo({ className = 'h-6' }) {
  return (
    <svg
      viewBox="0 0 48 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Clearpay"
    >
      <rect width="48" height="32" rx="4" fill="#B2FCE4" />
      {/* Clearpay Arrow/Diamond Symbol */}
      <path
        d="M24 8L16 16L24 24L22 24L14 16L22 8L24 8ZM26 8L34 16L26 24L24 24L32 16L24 8L26 8Z"
        fill="#000000"
      />
      <circle cx="24" cy="16" r="3" fill="#000000" />
    </svg>
  );
}

export function PayPalPayIn3Logo({ className = 'h-6' }) {
  return (
    <svg
      viewBox="0 0 48 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="PayPal Pay in 3"
    >
      <rect width="48" height="32" rx="4" fill="#001435" />
      <path
        d="M13 22L14.7 10H18.7C20.9 10 22.2 11 21.8 13.2C21.6 14.8 20.5 16.2 18.7 16.2H16.7L15.8 22H13Z"
        fill="#0079C1"
      />
      <path
        d="M15.4 22L16.8 12.8H20.4C22.1 12.8 23.4 13.7 23.1 15.5C22.7 17.6 21.2 18.6 19.5 18.6H17.9L17.3 22H15.4Z"
        fill="#00457C"
        opacity="0.6"
      />
      {/* '3' Badge */}
      <rect x="25" y="9" width="16" height="14" rx="3" fill="#0079C1" />
      <text
        x="33"
        y="20"
        fill="#FFFFFF"
        fontSize="10"
        fontWeight="bold"
        fontFamily="sans-serif"
        textAnchor="middle"
      >
        3
      </text>
    </svg>
  );
}

/**
 * High-resolution Accepted Payment Badges Strip
 * For footer and checkout trust badges
 */
export function PaymentLogosStrip({ variant = 'default', showLabels = false, className = '' }) {
  const isDark = variant === 'dark';

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Category: Cards, Wallets, BNPL */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Debit & Credit Cards */}
        <div
          className={`flex items-center gap-1.5 p-1 rounded-lg border ${
            isDark ? 'bg-[#1b130f] border-[#38281e]' : 'bg-white border-[#ebd9c7] shadow-xs'
          }`}
          title="Debit & Credit Cards (Visa, Mastercard, Amex)"
        >
          <VisaLogo className="h-6 w-9 rounded" />
          <MastercardLogo className="h-6 w-9 rounded" />
          <AmexLogo className="h-6 w-9 rounded" />
        </div>

        {/* Digital Wallets */}
        <div
          className={`flex items-center gap-1.5 p-1 rounded-lg border ${
            isDark ? 'bg-[#1b130f] border-[#38281e]' : 'bg-white border-[#ebd9c7] shadow-xs'
          }`}
          title="Digital Wallets (Apple Pay, Google Pay, PayPal)"
        >
          <ApplePayLogo className="h-6 w-9 rounded" />
          <GooglePayLogo className="h-6 w-9 rounded" />
          <PayPalLogo className="h-6 w-9 rounded" />
        </div>

        {/* BNPL (Buy Now, Pay Later) */}
        <div
          className={`flex items-center gap-1.5 p-1 rounded-lg border ${
            isDark ? 'bg-[#1b130f] border-[#38281e]' : 'bg-white border-[#ebd9c7] shadow-xs'
          }`}
          title="Buy Now, Pay Later (Klarna, Clearpay, PayPal Pay in 3)"
        >
          <KlarnaLogo className="h-6 w-9 rounded" />
          <ClearpayLogo className="h-6 w-9 rounded" />
          <PayPalPayIn3Logo className="h-6 w-9 rounded" />
        </div>
      </div>

      {showLabels && (
        <p className={`text-[11px] ${isDark ? 'text-[#a38f7d]' : 'text-[#7d6756]'}`}>
          Accepted: <strong>Visa</strong>, <strong>Mastercard</strong>, <strong>Amex</strong>,{' '}
          <strong>Apple Pay</strong>, <strong>Google Pay</strong>, <strong>PayPal</strong>,{' '}
          <strong>Klarna (Pay in 3)</strong>, <strong>Clearpay (Pay in 4)</strong>, and{' '}
          <strong>PayPal Pay in 3</strong>.
        </p>
      )}
    </div>
  );
}
