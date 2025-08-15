import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { PanicProvider } from '@/context/panic-context';
import { IncidentReportProvider } from '@/context/incident-report-context';
import { ActiveGuardsProvider } from '@/context/active-guards-context';
import { ShiftProvider } from '@/context/shift-context';
import { DataProvider } from '@/context/data-context';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'Guardian Angel',
  description: 'Security Guard Monitoring App',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} dark`} style={{ colorScheme: 'dark' }} suppressHydrationWarning>
      <body className="font-body antialiased">
        <PanicProvider>
          <IncidentReportProvider>
            <DataProvider>
              <ActiveGuardsProvider>
                <ShiftProvider>
                    {children}
                  <Toaster />
                </ShiftProvider>
              </ActiveGuardsProvider>
            </DataProvider>
          </IncidentReportProvider>
        </PanicProvider>
      </body>
    </html>
  );
}
