import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'PlacementHub — Your All-in-One Prep Platform',
  description: 'Code, prepare, and land your dream job. PlacementHub combines DSA practice, AI coaching, university resources, and a live portfolio in one powerful dashboard.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* ── Suppress browser-extension errors from crashing the dev overlay ── */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var EXTENSION_PREFIXES = ['chrome-extension://', 'moz-extension://', 'safari-extension://'];
            function isExtensionError(filename) {
              if (!filename) return false;
              return EXTENSION_PREFIXES.some(function(p) { return filename.startsWith(p); });
            }
            window.addEventListener('error', function(e) {
              if (isExtensionError(e.filename)) { e.preventDefault(); e.stopImmediatePropagation(); return false; }
            }, true);
            window.addEventListener('unhandledrejection', function(e) {
              var stack = e.reason && e.reason.stack;
              if (stack && EXTENSION_PREFIXES.some(function(p) { return stack.includes(p); })) {
                e.preventDefault(); e.stopImmediatePropagation(); return false;
              }
            }, true);
          })();
        `}} />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}

