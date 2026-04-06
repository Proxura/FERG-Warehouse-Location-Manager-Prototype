import './globals.css';

export const metadata = {
  title: 'Korber One Location Manager',
  description: 'WMS Location Creation Tool - Branch 181 Simulation',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
