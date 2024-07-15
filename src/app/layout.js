import './globals.css';
import Header from '../components/Header';

export const metadata = {
  title: 'Krzysztof Kaim | Personal site',
  description: 'Krzysztof Kaim programming showcase.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Header />
        {children}
      </body>
    </html>
  );
}
