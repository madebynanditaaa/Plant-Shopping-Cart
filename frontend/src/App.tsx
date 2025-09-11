import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <nav className="navbar">
          <Link className="nav-link" to="/">
            Home
          </Link>
          <Link className="nav-link" to="/cart">
            Cart
          </Link>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
// import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
// import { useState } from "react";
// import HomePage from "./pages/HomePage";
// import CartPage from "./pages/CartPage";
// import type { Product, CartItem } from "./types";
// import "./App.css";

// export default function App() {
//   const [cart, setCart] = useState<CartItem[]>([]);

//   // Add to cart logic
//   const handleAddToCart = (product: Product) => {
//   setCart((prevCart) => {
//     const existing = prevCart.find((item) => item.product_id === product.id);
//     if (existing) {
//       return prevCart.map((item) =>
//         item.product_id === product.id
//           ? { ...item, quantity: item.quantity + 1 }
//           : item
//       );
//     } else {
//       return [
//         ...prevCart,
//         {
//           id: Date.now(),
//           product_id: product.id,
//           product,
//           quantity: 1,
//         },
//       ];
//     }
//   });
// };

//   // Update quantity logic
//   const handleQuantityChange = (productId: number, quantity: number) => {
//   setCart((prevCart) =>
//     prevCart.map((item) =>
//       item.product_id === productId ? { ...item, quantity } : item
//     )
//   );
// };

//   // Remove item from cart
//   const handleRemove = (productId: number) => {
//   setCart((prevCart) => prevCart.filter((item) => item.product_id !== productId));
// };

//   return (
//     <BrowserRouter>
//       <div className="app-container">
//         <nav className="navbar">
//           <Link className="nav-link" to="/">Home</Link>
//           <Link className="nav-link" to="/cart">
//             Cart ({cart.reduce((acc, i) => acc + i.quantity, 0)})
//           </Link>
//         </nav>
//         <main className="main-content">
//           <Routes>
//             <Route path="/" element={<HomePage onAddToCart={handleAddToCart} />} />
//             <Route
//               path="/cart"
//               element={
//                 <CartPage
//                   cart={cart}
//                   onQuantityChange={handleQuantityChange}
//                   onRemove={handleRemove}
//                 />
//               }
//             />
//           </Routes>
//         </main>
//       </div>
//     </BrowserRouter>
//   );
// }
