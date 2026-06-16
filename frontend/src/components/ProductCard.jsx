import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0].color : 'Charcoal Black'
  );

  const handleAddToBag = () => {
    if (!selectedSize) {
      alert('Please select a size first.');
      return;
    }
    addToCart(product, selectedSize, selectedColor, 1);
  };

  // Extract unique sizes available for the selected color
  const availableVariants = product.variants || [];
  const sizesForColor = availableVariants
    .filter((v) => v.color === selectedColor)
    .map((v) => ({ size: v.size, stock: v.stockCount }));

  return (
    <div
      className="group relative flex flex-col bg-white p-2 border border-zinc-100 hover:border-zinc-300 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setSelectedSize(''); // Reset temp selected size on leave
      }}
    >
      {/* Product Image Overlay */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100">
        <img
          src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=60'}
          alt={product.title}
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />

        {/* Hover Size Selector Slide Up Drawer */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-white/95 p-4 border-t border-zinc-100 transition-transform duration-300 transform flex flex-col justify-between ${
            isHovered ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <p className="text-[10px] font-semibold tracking-widest text-charcoal mb-2 uppercase">SELECT SIZE</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {sizesForColor.map(({ size, stock }) => (
              <button
                key={size}
                disabled={stock <= 0}
                onClick={() => setSelectedSize(size)}
                className={`border py-1 px-2.5 text-[9px] font-medium tracking-wider uppercase transition-all ${
                  stock <= 0
                    ? 'border-dashed border-zinc-200 text-zinc-300 cursor-not-allowed'
                    : selectedSize === size
                    ? 'border-charcoal bg-charcoal text-white'
                    : 'border-zinc-200 hover:border-charcoal text-charcoal'
                }`}
              >
                {size} {stock <= 5 && stock > 0 && <span className="text-red-500 text-[8px]">({stock} left)</span>}
              </button>
            ))}
          </div>

          <button
            onClick={handleAddToBag}
            disabled={!selectedSize}
            className={`w-full py-2 flex items-center justify-center space-x-2 text-[10px] font-semibold tracking-widest uppercase transition-all ${
              selectedSize
                ? 'bg-charcoal text-white hover:bg-zinc-800'
                : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>ADD TO BAG</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="mt-4 flex flex-col flex-grow text-left">
        <span className="text-[9px] font-medium tracking-widest text-slateMuted uppercase">ZAVIER™</span>
        <h3 className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-charcoal line-clamp-1">{product.title}</h3>
        <p className="mt-1.5 text-[12px] font-bold text-charcoal">Rs. {product.price.toLocaleString()}</p>
      </div>
    </div>
  );
}
