import 'lightwebsiteui/lightwebsiteui.css';
import Link from 'next/link';
import LightWebsite from './LightWebsite';

export const metadata = {
  title: 'Margherita — LightWebsiteUi + Next.js',
  description: 'A pizzeria site built with LightWebsiteUi blocks inside the Next.js App Router.'
};

// The same settings as CONFIG in a plain 3-file site
const CONFIG = {
  name: 'Margherita',
  style: 'cozy',
  color: 'red',
  lang: 'en',
  rain: '🍕',
  thanks: 'Thanks! We will call you back in 5 minutes.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LightWebsite options={CONFIG} />

        {/* The header lives in the layout: it stays while pages change.
            Theme toggle, cart and mobile menu are added by LightWebsiteUi. */}
        <header className="bui-header">
          <div className="bui-container">
            <Link className="bui-logo" href="/"><span>🍕</span><span data-name="">Margherita</span></Link>
            <nav className="bui-nav">
              <Link href="/">Home</Link>
              <Link href="/menu">Menu</Link>
              <Link href="/contacts">Contacts</Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="bui-footer">
          © <span data-year=""></span> <span data-name="">Margherita</span> · built with LightWebsiteUi and Next.js
        </footer>
      </body>
    </html>
  );
}
