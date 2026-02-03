import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Search, User, Heart, Menu, X, ChevronRight, ChevronDown, Mail, Lock, Eye, EyeOff, ArrowLeft, Bookmark } from 'lucide-react';

/* ================= AUTH CONTEXT ================= */

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [authError, setAuthError] = useState('');

  const signUp = (name, email, password) => {
    setAuthError('');
    if (!name || !email || !password) { setAuthError('All fields are required.'); return false; }
    if (password.length < 6) { setAuthError('Password must be at least 6 characters.'); return false; }
    if (users.find(u => u.email === email)) { setAuthError('An account with this email already exists.'); return false; }
    const newUser = { name, email, password };
    setUsers(prev => [...prev, newUser]);
    setUser({ name, email });
    return true;
  };

  const login = (email, password) => {
    setAuthError('');
    if (!email || !password) { setAuthError('All fields are required.'); return false; }
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) { setAuthError('Invalid email or password.'); return false; }
    setUser({ name: found.name, email: found.email });
    return true;
  };

  const logout = () => { setUser(null); setAuthError(''); };
  const clearError = () => setAuthError('');

  return (
    <AuthContext.Provider value={{ user, signUp, login, logout, authError, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

/* ================= CART CONTEXT ================= */

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product, size) => {
    setCart(prev => {
      const found = prev.find(i => i.id === product.id && i.size === size);
      if (found) return prev.map(i => i.id === product.id && i.size === size ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, size, qty: 1 }];
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => useContext(CartContext);

/* ================= PRODUCTS DATA ================= */

const productsData = [
  { id: 1, name: 'IVORY LINEN DUVET COVERS WITH PILLOW COVERS', price: 189.99, description: 'Soft and breathable linen duvet cover made from premium linen fabric. Features a smooth finish and hypoallergenic properties for comfortable sleep. Easy to wash and maintain.', sizes: ['S', 'M', 'L'], images: ['https://i.pinimg.com/736x/76/a2/f0/76a2f0891e648be9f8841c0b5ffc2055.jpg','https://i.pinimg.com/736x/dd/c2/97/ddc2974e97cb47e06be8464a4b742985.jpg'], category: 'duvet', color: 'IVORY WHITE', code: '1001/001/001' },
  { id: 2, name: 'IVORY COTTON BEDSHEETS WITH PILLOW COVERS', price: 159.99, description: 'Premium cotton bedsheet with a soft finish and a subtle weave pattern. Made from 100% organic cotton for a gentle touch against your skin.', sizes: ['S', 'M', 'L'], images: ['https://i.pinimg.com/736x/dd/c2/97/ddc2974e97cb47e06be8464a4b742985.jpg'], category: 'duvet', color: 'CREAM', code: '1002/002/001' },
  { id: 3, name: 'WATER COLOR PRINT CERAMIC DINNER PLATE', price: 145.99, description: 'Elegant dinner plates set crafted from fine ceramic. Perfect for any dining table, featuring a minimalist design with a subtle rim detail.', sizes: ['Standard'], images: ['https://i.pinimg.com/736x/63/06/6f/63066f6ebf1dd9862e2de5f21c2a4fe3.jpg'], category: 'dinning', color: 'WHITE MATTE', code: '1003/003/001' },
  { id: 4, name: 'OAK WOOD COFFEE TABLE STORAGE UNIT', price: 1034.99, description: 'Stylish storage set for home organization. Includes three nesting boxes in premium materials with clean geometric lines and a modern aesthetic.', sizes: ['Standard'], images: ['https://i.pinimg.com/1200x/6f/4f/1b/6f4f1b6fd94b91a7681a2c7b11321ce8.jpg'], category: 'tables', color: 'OAK NATURAL', code: '1004/004/001' },
  { id: 5, name: 'BLUSH HANDKNIT THROW PILLOWS', price: 129.99, description: 'Comfortable throw pillows for your living room. Made from premium velvet fabric with a soft fill for the perfect lounging experience.', sizes: ['S', 'M'], images: ['https://i.pinimg.com/1200x/a2/4e/cc/a24eccc5c7c4a4564d821edfb0f1fa77.jpg'], category: 'duvet', color: 'SAGE GREEN', code: '1005/005/001' },
  { id: 6, name: 'SEE THROUGH BLUSH LINEN TABLE RUNNER', price: 89.99, description: 'Elegant table runner for dining tables. Handwoven from natural cotton threads with a subtle texture and fringe detailing at both ends.', sizes: ['Standard'], images: ['https://i.pinimg.com/1200x/b9/c5/fa/b9c5fac1577b4285b6e52c74534bac1b.jpg'], category: 'tables', color: 'LINEN BEIGE', code: '1006/006/001' },
  { id: 7, name: 'CERAMIC COOKING POTS', price: 529.99, description: 'High-quality cookware set for all your cooking needs. Features non-stick coating, ergonomic handles, and even heat distribution for consistent results.', sizes: ['Standard'], images: ['https://i.pinimg.com/736x/b9/22/78/b922786808656d21bc8658b225466dbf.jpg'], category: 'stove-tops', color: 'MATTE BLACK', code: '1007/007/001' },
  { id: 8, name: 'WATERCOLOR PRINT CERAMIC BLATES', price: 154.99, description: 'Stylish serving tray for your home, perfect for breakfast in bed or entertaining guests. Crafted from sustainably sourced wood with a smooth finish.', sizes: ['Standard'], images: ['https://i.pinimg.com/736x/14/bc/9d/14bc9d6e01df31e88165d0e25ced89e4.jpg'], category: 'dinning', color: 'WALNUT', code: '1008/008/001' }
];

/* ================= SEARCH OVERLAY ================= */

const SearchOverlay = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const tabs = ['All', 'DUVET', 'STOVE TOPS', 'TABLES', 'DINNING'];
  const tabToCat = { 'All': null, 'DUVET': 'duvet', 'STOVE TOPS': 'stove-tops', 'TABLES': 'tables', 'DINNING': 'dinning' };

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
    if (!open) { setQuery(''); setActiveTab('All'); }
  }, [open]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const getFiltered = () => {
    let result = productsData;
    if (activeTab !== 'All') result = result.filter(p => p.category === tabToCat[activeTab]);
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return result;
  };

  const filtered = getFiltered();
  const hasQuery = query.trim().length > 0;

  const goToProduct = (p) => {
    onClose();
    navigate(`/product/${p.id}`);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <Link to="/" onClick={onClose}><h1 className="text-2xl font-bold tracking-widest text-black">AVANT</h1></Link>
        <button onClick={onClose} className="p-1"><X size={22} className="text-gray-600" /></button>
      </div>

      <div className="px-6 pt-6 pb-2">
        <div className="flex gap-6">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`text-sm tracking-wide transition ${activeTab === tab ? 'font-bold text-black' : 'font-normal text-gray-400 hover:text-black'}`}>{tab}</button>
          ))}
        </div>
      </div>

      <div className="px-6 py-10 border-b border-gray-100">
        <input ref={inputRef} type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="WHAT ARE YOU LOOKING FOR?"
          className="w-full text-center text-sm text-gray-300 placeholder-gray-300 focus:outline-none focus:text-black transition tracking-widest bg-transparent border-b border-gray-300 pb-2" />
      </div>

      <div className="px-6 py-10">
        <p className="text-xs font-bold tracking-widest text-black mb-6">{hasQuery ? `RESULTS FOR "${query.toUpperCase()}"` : 'YOU MIGHT BE INTERESTED IN'}</p>
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-10">
            {filtered.map(p => (
              <button key={p.id} onClick={() => goToProduct(p)} className="group text-left">
                <div className="relative overflow-hidden bg-gray-100 aspect-[3/4] mb-3">
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute bottom-3 left-3 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-black text-lg leading-none">+</span>
                  </div>
                </div>
                <p className="text-xs text-gray-800 truncate">{p.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">${p.price}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-16"><p className="text-gray-400 text-sm tracking-widest">NO RESULTS FOUND</p></div>
        )}
      </div>
    </div>
  );
};

/* ================= HEADER ================= */

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const location = window.location.pathname;
  const isHomePage = location === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = isHomePage && !scrolled;
  const textColor = isTransparent ? 'text-white' : 'text-black';
  const hoverColor = isTransparent ? 'hover:text-gray-300' : 'hover:text-gray-600';
  const bgColor = isTransparent ? 'bg-transparent' : 'bg-white border-b border-gray-200';
  const iconColor = isTransparent ? 'text-white' : 'text-black';
  const hoverBg = isTransparent ? 'hover:bg-white/10' : 'hover:bg-gray-100';

  return (
    <>
      <header className={`${location === '/login' || location === '/signup' ? 'hidden' : isHomePage ? 'absolute' : 'sticky'} top-0 left-0 right-0 z-50 transition-all duration-300 ${bgColor}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2">
              {menuOpen ? <X size={24} className={iconColor} /> : <Menu size={24} className={iconColor} />}
            </button>
            <div className="flex-shrink-0">
              <Link to="/"><h1 className={`text-2xl font-bold tracking-widest ${textColor}`}>AVANT</h1></Link>
            </div>
            <nav className="hidden lg:flex space-x-8">
              <Link to="/shop/duvet" className={`text-sm tracking-wide ${textColor} ${hoverColor} transition`}>DUVET</Link>
              <Link to="/shop/stove-tops" className={`text-sm tracking-wide ${textColor} ${hoverColor} transition`}>STOVE TOPS</Link>
              <Link to="/shop/tables" className={`text-sm tracking-wide ${textColor} ${hoverColor} transition`}>TABLES</Link>
              <Link to="/shop/dinning" className={`text-sm tracking-wide ${textColor} ${hoverColor} transition`}>DINNING</Link>
              <Link to="/shop" className={`text-sm tracking-wide ${textColor} ${hoverColor} transition`}>ALL PRODUCTS</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <button onClick={() => setSearchOpen(true)} className={`p-2 ${hoverBg} rounded-full transition`}><Search size={20} className={iconColor} /></button>
              {user ? (
                <div className="relative group">
                  <button className={`p-2 ${hoverBg} rounded-full transition`}><User size={20} className={iconColor} /></button>
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 shadow-lg rounded opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <button onClick={() => { logout(); navigate('/'); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">Log Out</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => navigate('/login')} className={`p-2 ${hoverBg} rounded-full transition`}><User size={20} className={iconColor} /></button>
              )}
              <button className={`p-2 ${hoverBg} rounded-full transition`}><Heart size={20} className={iconColor} /></button>
              <button className={`p-2 ${hoverBg} rounded-full transition flex items-center gap-1`}>
                <span className={`text-sm tracking-wide ${textColor}`}>SHOPPING BAG</span>
                {totalQty > 0 && <span className={`text-xs ${textColor}`}>({totalQty})</span>}
              </button>
            </div>
          </div>
        </div>
        {menuOpen && (
          <div className={`lg:hidden border-t ${isTransparent ? 'border-white/20 bg-black/80 backdrop-blur' : 'border-gray-200 bg-white'}`}>
            <nav className="px-4 py-4 space-y-3">
              <Link to="/shop/duvet" className={`block text-sm tracking-wide py-2 ${textColor}`} onClick={() => setMenuOpen(false)}>DUVET</Link>
              <Link to="/shop/stove-tops" className={`block text-sm tracking-wide py-2 ${textColor}`} onClick={() => setMenuOpen(false)}>STOVE TOPS</Link>
              <Link to="/shop/tables" className={`block text-sm tracking-wide py-2 ${textColor}`} onClick={() => setMenuOpen(false)}>TABLES</Link>
              <Link to="/shop" className={`block text-sm tracking-wide py-2 ${textColor}`} onClick={() => setMenuOpen(false)}>ALL PRODUCTS</Link>
              {user ? (
                <button onClick={() => { logout(); setMenuOpen(false); navigate('/'); }} className={`block text-sm tracking-wide py-2 ${textColor}`}>LOG OUT</button>
              ) : (
                <Link to="/login" className={`block text-sm tracking-wide py-2 ${textColor}`} onClick={() => setMenuOpen(false)}>LOG IN</Link>
              )}
            </nav>
          </div>
        )}
      </header>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

/* ================= FOOTER ================= */

const Footer = () => (
  <footer className="bg-gray-50 border-t border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="text-sm font-semibold mb-4 tracking-wide">HELP</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link to="/" className="hover:underline">Customer Service</Link></li>
            <li><Link to="/" className="hover:underline">Track Order</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4 tracking-wide">COMPANY</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link to="/" className="hover:underline">About Us</Link></li>
            <li><Link to="/" className="hover:underline">Careers</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4 tracking-wide">FOLLOW</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="https://instagram.com" className="hover:underline">Instagram</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4 tracking-wide">NEWSLETTER</h4>
          <div className="flex">
            <input type="email" placeholder="Email" className="flex-1 px-4 py-2 border border-gray-300 text-sm" />
            <button className="bg-black text-white px-4 py-2"><ChevronRight size={20} /></button>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
        <p>© 2026 AVANT. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

/* ================= LOGIN PAGE ================= */

const LoginPage = () => {
  const { login, authError, clearError, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => { clearError(); if (user) navigate('/'); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(email, password)) navigate('/');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] relative">
      <img src="https://i.pinimg.com/736x/f6/77/82/f677825dec17db0c188809362ce6eaf0.jpg" alt="AVANT" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 flex items-center justify-center min-h-full px-4 py-16">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center text-sm text-white/70 hover:text-white transition mb-8"><ArrowLeft size={16} className="mr-2" /> Back to Shop</Link>
          <h1 className="text-3xl font-light tracking-wider mb-2 text-white">LOG IN</h1>
          <p className="text-white/60 text-sm mb-8">Enter your credentials to access your account</p>
          {authError && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded mb-6">{authError}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs tracking-widest text-white/60 mb-2">EMAIL</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white transition" />
              </div>
            </div>
            <div>
              <label className="block text-xs tracking-widest text-white/60 mb-2">PASSWORD</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-10 py-3 bg-white/10 backdrop-blur border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white transition" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>
            <div className="flex justify-end"><button type="button" className="text-xs text-white/50 hover:text-white transition tracking-wide">Forgot password?</button></div>
            <button type="submit" className="w-full bg-white text-black py-3 text-sm tracking-widest hover:bg-white/90 transition">LOG IN</button>
          </form>
          <div className="mt-8 pt-8 border-t border-white/20 text-center">
            <p className="text-sm text-white/60">Don't have an account?{' '}<Link to="/signup" className="text-white underline hover:text-white/70 transition">Sign Up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= SIGN UP PAGE ================= */

const SignUpPage = () => {
  const { signUp, authError, clearError, user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => { clearError(); if (user) navigate('/'); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');
    if (password !== confirmPassword) { setLocalError('Passwords do not match.'); return; }
    if (signUp(name, email, password)) navigate('/');
  };

  const error = localError || authError;

  return (
    <div className="min-h-[calc(100vh-64px)] relative">
      <img src="https://i.pinimg.com/474x/9d/3c/cb/9d3ccbc1dd4f7dc069ce25a00eae1371.jpg" alt="AVANT" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 flex items-center justify-center min-h-full px-4 py-16">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center text-sm text-white/70 hover:text-white transition mb-8"><ArrowLeft size={16} className="mr-2" /> Back to Shop</Link>
          <h1 className="text-3xl font-light tracking-wider mb-2 text-white">SIGN UP</h1>
          <p className="text-white/60 text-sm mb-8">Create your account to get started</p>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded mb-6">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs tracking-widest text-white/60 mb-2">FULL NAME</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white transition" />
              </div>
            </div>
            <div>
              <label className="block text-xs tracking-widests text-white/60 mb-2">EMAIL</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white transition" />
              </div>
            </div>
            <div>
              <label className="block text-xs tracking-widest text-white/60 mb-2">PASSWORD</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-10 py-3 bg-white/10 backdrop-blur border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white transition" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
              <p className="text-xs text-white/40 mt-1">Must be at least 6 characters</p>
            </div>
            <div>
              <label className="block text-xs tracking-widest text-white/60 mb-2">CONFIRM PASSWORD</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-10 py-3 bg-white/10 backdrop-blur border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white transition" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition">{showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>
            <button type="submit" className="w-full bg-white text-black py-3 text-sm tracking-widest hover:bg-white/90 transition">CREATE ACCOUNT</button>
          </form>
          <div className="mt-8 pt-8 border-t border-white/20 text-center">
            <p className="text-sm text-white/60">Already have an account?{' '}<Link to="/login" className="text-white underline hover:text-white/70 transition">Log In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= HOME PAGE ================= */

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const heroImages = [
    { url: 'https://i.pinimg.com/736x/6d/f6/5c/6df65c05cf21a86b78c779053b5ebf29.jpg', title: 'NEW SEASON', subtitle: 'Discover the latest collection' },
    { url: 'https://i.pinimg.com/474x/50/2c/6f/502c6f3e7cf6ba50da244904056c4c11.jpg', title: 'FALL COLLECTION', subtitle: 'Timeless elegance' },
    { url: 'https://i.pinimg.com/736x/f6/77/82/f677825dec17db0c188809362ce6eaf0.jpg', title: 'ESSENTIALS', subtitle: 'Household staples' }
  ];
  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide(p => (p + 1) % heroImages.length), 4000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <>
      <section className="relative h-screen overflow-hidden">
        <div className="flex transition-transform duration-1000 ease-in-out h-full" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {heroImages.map((slide, i) => (
            <div key={i} className="min-w-full h-full relative">
              <img src={slide.url} alt={slide.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <div className="text-center text-white">
                  <h2 className="text-5xl md:text-7xl font-light tracking-wider mb-4">{slide.title}</h2>
                  <p className="text-lg md:text-xl mb-8 tracking-wide">{slide.subtitle}</p>
                  <button onClick={() => navigate('/shop')} className="bg-white text-black px-8 py-3 text-sm tracking-widest hover:bg-gray-100">SHOP NOW</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroImages.map((_, i) => <button key={i} onClick={() => setCurrentSlide(i)} className={`w-2 h-2 rounded-full transition-all ${currentSlide === i ? 'bg-white w-8' : 'bg-white bg-opacity-50'}`} />)}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div onClick={() => navigate('/shop')} className="relative group cursor-pointer overflow-hidden">
            <div className="aspect-[4/5] overflow-hidden">
              <img src="https://i.pinimg.com/736x/ef/d1/e4/efd1e4bbf1a8a3b22d62585d23bf3a13.jpg" alt="The New" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="absolute bottom-8 left-8 text-white">
              <p className="text-xs tracking-widest mb-2">NEW SEASON</p>
              <h3 className="text-3xl font-light tracking-wide mb-1">THE NEW</h3>
              <p className="text-sm tracking-wider">AVANT HOME COLLECTION</p>
            </div>
          </div>
          <div onClick={() => navigate('/shop')} className="relative group cursor-pointer overflow-hidden">
            <div className="aspect-[4/5] overflow-hidden">
              <img src="https://i.pinimg.com/1200x/5b/9e/7e/5b9e7ee02d9b962dde2c3954eac00282.jpg" alt="Classics" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-3xl font-light tracking-wide mb-1">AVANT CLASSICS</h3>
              <p className="text-sm tracking-wider">+ INFO</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-4xl md:text-5xl font-light mb-4 tracking-wide">JOIN LIFE</h3>
          <p className="text-lg mb-8 text-gray-300">Products made with care for the planet and the people who make them</p>
          <button onClick={() => navigate('/shop')} className="border border-white px-8 py-3 text-sm tracking-widest hover:bg-white hover:text-black transition">DISCOVER MORE</button>
        </div>
      </section>
    </>
  );
};

/* ================= COLLAPSIBLE SECTION ================= */

const CollapsibleSection = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(!open)} className="w-full text-left py-3">
        <span className="text-xs font-semibold tracking-widest text-black">{title}</span>
      </button>
      {open && <div className="pb-3 text-sm text-gray-600 leading-relaxed">{children}</div>}
    </div>
  );
};

/* ================= PRODUCT DETAIL PAGE ================= */

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [imgIndex, setImgIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  const product = productsData.find(p => p.id === parseInt(id));

  useEffect(() => {
    if (product) setSelectedSize(product.sizes[0]);
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 tracking-widest text-sm">PRODUCT NOT FOUND</p>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back button */}
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm text-gray-500 hover:text-black transition mb-8">
          <ArrowLeft size={16} className="mr-2" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left - Images */}
          <div>
            <div className="relative overflow-hidden bg-gray-100 aspect-[3/4] mb-3">
              <img src={product.images[imgIndex]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <img key={i} src={img} alt="" onClick={() => setImgIndex(i)}
                    className={`w-20 h-24 object-cover cursor-pointer border transition ${imgIndex === i ? 'border-black' : 'border-gray-200 hover:border-gray-400'}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right - Details */}
          <div className="flex flex-col justify-start pt-2">
            {/* Few items left badge */}
            <p className="text-xs font-semibold tracking-widest text-black mb-3">FEW ITEMS LEFT</p>

            {/* Name + bookmark */}
            <div className="flex items-start justify-between">
              <h1 className="text-2xl font-semibold tracking-wide text-black">{product.name.toUpperCase()}</h1>
              <button onClick={() => setWishlisted(!wishlisted)} className="mt-1">
                <Bookmark size={22} className={wishlisted ? 'fill-black text-black' : 'text-black'} />
              </button>
            </div>

            {/* Price */}
            <p className="text-2xl font-light text-black mt-2">₹ {(product.price * 83).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
            <p className="text-xs text-gray-400 tracking-widest mt-1">MRP INCL. OF ALL TAXES</p>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Color + Code */}
            <p className="text-sm text-gray-700 tracking-wide">{product.color} | {product.code}</p>

            {/* ADD button */}
            <button onClick={handleAdd} className="w-full border border-black text-black py-4 text-sm tracking-widest mt-8 hover:bg-black hover:text-white transition">
              {added ? 'ADDED ✓' : 'ADD'}
            </button>

            {/* Divider */}
            <div className="border-t border-gray-200 mt-8"></div>

            {/* Description */}
            <p className="text-sm text-gray-700 leading-relaxed mt-4">{product.description}</p>

            {/* Collapsible sections */}
            <div className="mt-8">
              <CollapsibleSection title="PRODUCT MEASUREMENTS">
                <p>Depending on the size, this product measures approximately 60 x 40 cm. Please refer to our size guide for exact measurements.</p>
              </CollapsibleSection>
              <CollapsibleSection title="COMPOSITION, CARE & ORIGIN">
                <p>100% Premium Cotton. Machine wash cold. Do not bleach. Tumble dry on low heat. Manufactured in India.</p>
              </CollapsibleSection>
              <CollapsibleSection title="CHECK IN-STORE AVAILABILITY">
                <p>This product is available in select stores. Visit your nearest AVANT store or contact customer service for availability.</p>
              </CollapsibleSection>
              <CollapsibleSection title="SHIPPING, EXCHANGES AND RETURNS">
                <p>Free shipping on orders above ₹2,000. Exchanges and returns accepted within 30 days of purchase with original tags attached.</p>
              </CollapsibleSection>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= SHOP PAGE ================= */

const ShopPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const filtered = category ? productsData.filter(p => p.category === category) : productsData;

  const toggleWishlist = (id) => setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  return (
    <div>
      <div className="bg-gray-50 py-8 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-light tracking-wider mb-2">{category ? category.replace('-', ' ').toUpperCase() : 'ALL PRODUCTS'}</h2>
          <p className="text-gray-600">{filtered.length} items</p>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(p => (
            <div key={p.id} className="group relative cursor-pointer" onClick={() => navigate(`/product/${p.id}`)}>
              <div className="relative overflow-hidden bg-gray-100 mb-3 aspect-square">
                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <button onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }} className="absolute top-2 right-2 bg-white p-2 rounded-full">
                  <Heart size={18} className={wishlist.includes(p.id) ? 'text-red-500' : ''} />
                </button>
              </div>
              <h4 className="text-sm mb-1 font-light">{p.name}</h4>
              <p className="text-sm font-semibold">${p.price}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

/* ================= APP ================= */

const App = () => (
  <AuthProvider>
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/:category" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  </AuthProvider>
);

export default App;