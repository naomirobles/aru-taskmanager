// components/ClerkProviderWrapper.tsx
'use client';

import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';

type Props = {
  children: React.ReactNode;
};

/**
 * Wrapper cliente para Clerk. Usa la variable de entorno NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
 * Configura aquí proxyUrl, domain, etc. si los usas (lee los comentarios).
 */
export default function ClerkProviderWrapper({ children }: Props) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      // proxyUrl={process.env.NEXT_PUBLIC_CLERK_PROXY_URL}
      // domain={process.env.NEXT_PUBLIC_CLERK_DOMAIN}
      // Puedes agregar isSatellite, signInUrl, signUpUrl, etc. según tu configuración
    >
      {children}
    </ClerkProvider>
  );
}
