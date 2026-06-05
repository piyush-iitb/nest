/**
 * Client-side providers wrapper.
 *
 * Next.js renders layouts on the server by default. React Context
 * (which AuthProvider uses) needs to run in the browser. The 'use client'
 * directive at the top tells Next.js to mount this part on the client.
 *
 * We use this wrapper instead of putting 'use client' on layout.tsx itself,
 * because keeping the layout as a server component is good practice — only
 * the provider tree needs to be client-side.
 */

'use client';

import { AuthProvider } from '@/lib/auth-context';

export function Providers({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
