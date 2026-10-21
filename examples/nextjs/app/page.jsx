import Link from 'next/link';

// Home page: plain LightWebsiteUi markup written as JSX (class → className, data-name → data-name="")
const REVIEWS = [
  { name: 'Emma', role: 'regular guest', text: 'The crust is perfect and the delivery is always on time.' },
  { name: 'Oliver', role: 'office lunch', text: 'We order for the whole team every Friday. Never disappointed.' },
  { name: 'Sophia', role: 'family dinner', text: 'Kids love the Margherita, we love the truffle one.' },
  { name: 'Liam', role: 'pizza nerd', text: 'Real wood-fired oven, you can taste it.' }
];

export default function Home() {
  return (
    <>
      <section className="bui-hero" id="top">
        <div className="bui-container">
          <div>
            <span className="bui-badge">Wood-fired since 2012</span>
            <h1 data-name="">Margherita</h1>
            <p>Neapolitan pizza baked in 90 seconds and delivered hot in 30 minutes.</p>
            <div className="bui-row">
              <button className="bui-btn" data-open="order">Order now</button>
              <Link className="bui-btn bui-btn-ghost" href="/menu">See the menu</Link>
            </div>
            <ul className="bui-facts">
              <li><b>4.9 ⭐</b><span>rating</span></li>
              <li><b>30 min</b><span>delivery</span></li>
              <li><b>12</b><span>pizzas</span></li>
            </ul>
          </div>
          <div className="bui-hero-picture">
            <img data-photo="pizza" alt="Pizza" />
            <span className="bui-sticker">−20% today</span>
          </div>
        </div>
      </section>

      <section className="bui-section" id="why">
        <div className="bui-container">
          <div className="bui-head"><span className="bui-label">Why us</span><h2>Simple things done right</h2></div>
          <div className="bui-grid">
            <div className="bui-feature"><div className="bui-icon" data-icon="mdi:fire"></div><h3>Wood-fired oven</h3><p>485 °C and a crust with leopard spots.</p></div>
            <div className="bui-feature"><div className="bui-icon" data-icon="mdi:truck-fast"></div><h3>Fast delivery</h3><p>30 minutes or the next pizza is on us.</p></div>
            <div className="bui-feature"><div className="bui-icon" data-icon="mdi:leaf"></div><h3>Fresh produce</h3><p>Tomatoes from Campania, basil from our garden.</p></div>
          </div>
        </div>
      </section>

      <section className="bui-section bui-section-alt">
        <div className="bui-container">
          <div className="bui-grid">
            <div className="bui-stat"><b data-count="25000" data-suffix="+">0</b><span>pizzas a year</span></div>
            <div className="bui-stat"><b data-count="12">0</b><span>recipes</span></div>
            <div className="bui-stat"><b data-count="4.9">0</b><span>average rating</span></div>
          </div>
        </div>
      </section>

      <section className="bui-section" id="reviews">
        <div className="bui-container">
          <div className="bui-head"><span className="bui-label">Reviews</span><h2>Guests say</h2></div>
          {/* Slider contents must stay static: Swiper moves these nodes */}
          <div className="bui-slider" data-per-view="3">
            {REVIEWS.map(r => (
              <div className="bui-review" key={r.name}>
                <div className="bui-stars">★★★★★</div>
                <blockquote>{r.text}</blockquote>
                <div className="bui-author"><img data-avatar={r.name} alt={r.name} /><span>{r.name}<small>{r.role}</small></span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bui-section">
        <div className="bui-container">
          <div className="bui-cta">
            <h2>Hungry already?</h2>
            <p>Pick a pizza and we start the oven.</p>
            <Link className="bui-btn bui-btn-light bui-btn-big" href="/menu">Open the menu</Link>
          </div>
        </div>
      </section>
    </>
  );
}
