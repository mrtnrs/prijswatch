export default function ProductGrid({ products }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <h3>{product.name}</h3>
          <p>{product.price}</p>
          <img src={product.imageUrl} alt={product.name} />
        </div>
      ))}
      <style jsx>{`
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }

        .product-card {
          border: 1px solid #ccc;
          padding: 1rem;
        }
      `}</style>
    </div>
  );
}
