'use client';

// The bridge between React and LightWebsiteUi. Put it once in the root layout.
// Imported from npm, LightWebsiteUi waits for start(), so React hydrates the page untouched.
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import LightWebsiteUi from 'lightwebsiteui';

export default function LightWebsite({ options }) {
  const pathname = usePathname();

  // Start once React has rendered the page; undo everything if the layout unmounts
  useEffect(() => {
    LightWebsiteUi.start(options);
    return () => LightWebsiteUi.destroy();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Every client-side navigation renders new blocks: photos, icons, sliders, maps, timers, forms
  useEffect(() => {
    LightWebsiteUi.refresh();
  }, [pathname]);

  return null;
}
