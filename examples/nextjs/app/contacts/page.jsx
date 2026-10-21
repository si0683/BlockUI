export const metadata = { title: 'Contacts — Margherita' };

// Map and form: LightWebsiteUi loads Leaflet only now, when a page with data-map appears
export default function Contacts() {
  return (
    <section className="bui-section" id="contacts">
      <div className="bui-container">
        <div className="bui-head"><span className="bui-label">Contacts</span><h2>Come by or call us</h2></div>
        <div className="bui-split">
          <div>
            <div className="bui-contacts">
              <a className="bui-contact" href="tel:+442071234567"><span>📞</span><span><small>Phone</small><b>+44 20 7123 4567</b></span></a>
              <a className="bui-contact" href="mailto:hello@margherita.example"><span>✉️</span><span><small>Email</small><b>hello@margherita.example</b></span></a>
              <div className="bui-contact"><span>🕒</span><span><small>Open</small><b>Every day 11:00–23:00</b></span></div>
            </div>
            <form className="bui-form" data-thanks="Thanks! We will reply within an hour.">
              <div className="bui-field"><input name="name" required /><label>Your name</label></div>
              <div className="bui-field"><input name="phone" type="tel" required /><label>Phone</label></div>
              <div className="bui-field"><textarea name="message"></textarea><label>Message</label></div>
              <button className="bui-btn bui-btn-wide">Send</button>
            </form>
          </div>
          <div data-map="London, Covent Garden" data-label="Margherita — we are here"></div>
        </div>
      </div>
    </section>
  );
}
