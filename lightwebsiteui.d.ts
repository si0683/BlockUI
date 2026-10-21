// Type definitions for LightWebsiteUi 3.1.0
// https://github.com/si0683/LightWebsiteUi — MIT License

declare namespace LightWebsiteUi {
  type StyleName = 'clean' | 'bright' | 'dark' | 'modern' | 'cozy' | 'simple' | 'minimal' | 'playful' | 'neon' | 'warm' | (string & {});
  type ColorName = 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'sky' | 'blue' | 'purple' | 'pink' | 'black' | 'brown' | (string & {});

  interface Texts {
    thanks: string; orderTitle: string; orderText: string; emptyCart: string;
    inCart: string; checkFields: string;
    name: string; phone: string; picked: string; comment: string; send: string; close: string;
    theme: string; cart: string; menu: string; popular: string;
    timerDone: string; days: string; hours: string; minutes: string; seconds: string; currency: string;
  }

  interface Options {
    /** Site name, written into every [data-name] */
    name?: string;
    /** clean, bright, dark, modern, cozy (Russian names work too) */
    style?: StyleName;
    /** Colour name or '#rrggbb' */
    color?: ColorName;
    /** Accent colour ('' = matched automatically) */
    accent?: string;
    /** Start in dark theme */
    dark?: boolean;
    /** Emoji rain in the hero, e.g. '🍕' */
    rain?: string;
    /** Interface language ('' = <html lang> or browser language) */
    lang?: 'en' | 'ru' | '';
    /** Override any interface text */
    texts?: Partial<Texts>;
    thanks?: string;
    orderTitle?: string;
    orderText?: string;
    emptyCart?: string;
    currency?: string;
    /** Add a dark theme toggle to the header */
    themeButton?: boolean;
    /** Tailwind + daisyUI mode */
    tailwind?: boolean;
    /** daisyUI theme: cupcake, retro, emerald, synthwave, corporate, forest, valentine… */
    theme?: string;
    darkTheme?: string;
    /** DiceBear style: lorelei, notionists, thumbs, adventurer, fun-emoji, bottts… */
    avatarStyle?: string;
    /** Confetti emoji */
    confetti?: string[];
  }

  interface LightWebsiteUiStatic {
    readonly version: string;
    readonly languages: string[];
    /** Apply options; may be called before or after the page has loaded.
     *  Imported from npm (ES module) nothing runs until start() is called. */
    start(options?: Options): void;
    /** Enhance content that appeared without a page load (React / Next.js route change). Only new nodes are touched. */
    refresh(): void;
    /** Undo everything LightWebsiteUi did: listeners, timers, sliders, maps, added elements. start() brings it back. */
    destroy(): void;
    toast(text: string): void;
    confetti(emojis?: string[]): void;
    /** Open a dialog by id; `pick` preselects an option in its <select> */
    open(id: string, pick?: string): void;
    close(): void;
    /** URL of the n-th photo for a topic keyword ('pizza', 'кофе', 'dance school') */
    photo(keyword: string, n?: number, width?: number): string;
    /** DiceBear avatar URL for a name */
    avatar(name: string, style?: string): string;
    addToCart(name: string, price?: number | string): void;
    /** Photo topics */
    topics(): string[];
  }
}

declare const LightWebsiteUi: LightWebsiteUi.LightWebsiteUiStatic;

interface Window { LightWebsiteUi: LightWebsiteUi.LightWebsiteUiStatic; }

declare module 'lightwebsiteui' {
  const LightWebsiteUi: LightWebsiteUi.LightWebsiteUiStatic;
  export default LightWebsiteUi;
  export const start: (options?: LightWebsiteUi.Options) => void;
  export const refresh: () => void;
  export const destroy: () => void;
  export const version: string;
  export type Options = LightWebsiteUi.Options;
}
