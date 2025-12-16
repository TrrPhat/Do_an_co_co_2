import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Zap, Search, ChevronDown, CarFrontIcon } from 'lucide-react';



const navItems = [
  { name: 'Trang chủ', href: '/' },
  {
    name: 'Thi thử lý thuyết',
    href: '/lythuyet',
    subItems: [
      { name: '600 câu lý thuyết (tất cả)', href: '/lythuyet/600-cau' },
      { name: 'Hạng B (30 câu - 20 đề + ngẫu nhiên)', href: '/lythuyet/hang-b' },
      { name: 'Hạng A1 (25 câu - 10 đề + ngẫu nhiên)', href: '/lythuyet/hang-a1' },
    ]
  },
  {
    name: 'Tài liệu',
    href: '/tailieu',
    subItems: [
      { name: 'Tất cả', href: '/tailieu' },
      { name: 'Mẹo', href: '/tailieu?type=tip' },
      { name: 'Kinh nghiệm', href: '/tailieu?type=experience' },
      { name: 'Luật', href: '/tailieu?type=law' },
      { name: 'Kỹ thuật', href: '/tailieu?type=technique' },
    ]
  },
  { name: 'Khóa học', href: '/khoahoc' },
  { name: 'Liên hệ', href: '/lienhe' },
];

export default function Header() { const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: '100%',
      transition: {
        duration: 0.3,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const mobileItemVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${isScrolled
            ? 'border-b border-gray-400 shadow-xl backdrop-blur-lg'
            : 'bg-transparent'
          }`}
        style={
          isScrolled
            ? {
              backgroundImage: 'linear-gradient(to top, #d5d4d0 0%, #d5d4d0 1%, #eeeeec 31%, #efeeec 75%, #e9e9e7 100%)',
              backgroundColor: '#e9e9e7', 
            }
            : {}
        }
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-3"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Link to="/" className="flex items-center space-x-3">
                <div className="relative">
<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg shadow-white/5">                    <CarFrontIcon className="h-5 w-5 text-black" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-900 text-lg font-bold">
                   Học tốt
                  </span>
                  <span className="text-gray-600 -mt-1 text-xs">
                    Thi tốt
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden items-center space-x-1 lg:flex">
              {navItems.map((item) => (
                <motion.div
                  key={item.name}
                  variants={itemVariants}
                  className="relative"
                  onMouseEnter={() => {
                    setHoveredItem(item.name);
                    if (item.subItems) setOpenDropdown(item.name);
                  }}
                  onMouseLeave={() => {
                    setHoveredItem(null);
                    setOpenDropdown(null);
                  }}
                >
                  <Link
                    to={item.href}
                    className="text-gray-700 hover:text-gray-900 relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                  >
                    {hoveredItem === item.name && (
                      <motion.div
                        className="bg-gray-100 absolute inset-0 rounded-lg"
                        layoutId="navbar-hover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">{item.name}</span>
                    {item.subItems && (
                      <ChevronDown className={`h-4 w-4 relative z-10 transition-transform duration-200 ${openDropdown === item.name ? 'rotate-180' : ''}`} />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {item.subItems && openDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
                      >
                        <div className="p-2">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              className="block rounded-lg px-4 py-3 hover:bg-gray-50 transition-colors duration-200 group"
                            >
                              <div className="font-medium text-gray-900 group-hover:text-rose-600 transition-colors">
                                {subItem.name}
                              </div>
                              {subItem.description && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {subItem.description}
                                </div>
                              )}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </nav>

            {/* Desktop Actions */}
            <motion.div
              className="hidden items-center space-x-3 lg:flex"
              variants={itemVariants}
            >
              <motion.button
                className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg p-2 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="h-5 w-5" />
              </motion.button>

              {user ? (
                <>
                  <div className="text-gray-700 px-2 text-sm">Xin chào, <span className="font-semibold">{user.name}</span></div>
                  <motion.button
                    onClick={logout}
                    className="bg-gray-900 text-white hover:bg-gray-800 inline-flex items-center space-x-2 rounded-lg px-4 py-2.5 text-sm font-medium shadow-sm transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Đăng xuất
                  </motion.button>
                </>
              ) : (
                <>
              <a
                href="/login"
                className="text-gray-700 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors duration-200"
              >
                Sign In
              </a>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <a
                  href="/signup"
                  className="bg-gray-900 text-white hover:bg-gray-800 inline-flex items-center space-x-2 rounded-lg px-5 py-2.5 text-sm font-medium shadow-sm transition-all duration-200"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </motion.div>
                </>
              )}
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              className="text-gray-900 hover:bg-gray-100 rounded-lg p-2 transition-colors duration-200 lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variants={itemVariants}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="bg-white fixed top-16 right-4 z-50 w-80 overflow-hidden rounded-2xl border border-gray-200 shadow-2xl lg:hidden"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="space-y-6 p-6">
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <motion.div key={item.name} variants={mobileItemVariants}>
                      {item.subItems ? (
                        <div>
                          <button
                            className="text-gray-900 hover:bg-gray-50 w-full flex items-center justify-between rounded-lg px-4 py-3 font-medium transition-colors duration-200"
                            onClick={() => setOpenMobileDropdown(openMobileDropdown === item.name ? null : item.name)}
                          >
                            <span>{item.name}</span>
                            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openMobileDropdown === item.name ? 'rotate-180' : ''}`} />
                          </button>
                          <AnimatePresence>
                            {openMobileDropdown === item.name && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-4 pt-1 space-y-1">
                                  {item.subItems.map((subItem) => (
                                    <Link
                                      key={subItem.name}
                                      to={subItem.href}
                                      className="block rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-rose-600 transition-colors duration-200"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      <div className="font-medium">{subItem.name}</div>
                                      {subItem.description && (
                                        <div className="text-xs text-gray-500 mt-0.5">
                                          {subItem.description}
                                        </div>
                                      )}
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          to={item.href}
                          className="text-gray-900 hover:bg-gray-50 block rounded-lg px-4 py-3 font-medium transition-colors duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="space-y-3 border-t border-gray-200 pt-6"
                  variants={mobileItemVariants}
                >
                  {user ? (
                    <>
                      <div className="text-gray-700 text-center">Xin chào, <span className="font-semibold">{user.name}</span></div>
                      <button
                        onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                        className="bg-gray-900 text-white hover:bg-gray-800 block w-full rounded-lg py-3 text-center font-medium transition-all duration-200"
                      >
                        Đăng xuất
                      </button>
                    </>
                  ) : (
                    <>
                  <a
                    href="/login"
                    className="text-gray-900 hover:bg-gray-50 block w-full rounded-lg py-3 text-center font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </a>
                  <a
                    href="/signup"
                    className="bg-gray-900 text-white hover:bg-gray-800 block w-full rounded-lg py-3 text-center font-medium transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </a>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </>
  );
}

