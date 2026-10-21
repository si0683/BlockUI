export const metadata = { title: 'Menu — Margherita' };

const PIZZAS = [
  { name: 'Margherita', text: 'Tomatoes, mozzarella, basil', price: 9, photo: 'pizza 2', tag: 'Hit' },
  { name: 'Pepperoni', text: 'Spicy salami, mozzarella', price: 12, photo: 'pizza 3' },
  { name: 'Four Cheese', text: 'Mozzarella, gorgonzola, parmesan, fontina', price: 13, photo: 'pizza 4' },
  { name: 'Truffle', text: 'Black truffle cream, mushrooms', price: 16, photo: 'pizza 5', tag: 'New' },
  { name: 'Diavola', text: 'Hot salami, chili, olives', price: 12, photo: 'pizza 6' },
  { name: 'Veggie', text: 'Peppers, zucchini, eggplant', price: 11, photo: 'pizza 7' }
];

// Products with data-add: the cart button appears in the header as soon as this page opens
export default function Menu() {
  return (
    <section className="bui-section" id="menu">
      <div className="bui-container">
        <div className="bui-head">
          <span className="bui-label">Menu</span>
          <h2>Pick your pizza</h2>
          <p>Happy hour ends in <b data-timer="2027-12-31T23:59"></b></p>
        </div>
        <div className="bui-grid">
          {PIZZAS.map(p => (
            <div className="bui-product" key={p.name}>
              <div className="bui-product-image">
                <img data-photo={p.photo} alt={p.name} />
                {p.tag && <span className="bui-tag">{p.tag}</span>}
              </div>
              <div className="bui-product-body">
                <h3>{p.name}</h3>
                <p>{p.text}</p>
                <div className="bui-product-footer">
                  <span className="bui-price">${p.price}</span>
                  <button className="bui-btn bui-btn-small" data-add={p.name} data-price={p.price}>Add to cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
