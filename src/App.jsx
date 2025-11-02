import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Home from "./components/Home";
import { useEffect, useState } from "react";

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}

function OverlayTransition({ isVisible }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed inset-0 bg-black pointer-events-none z-[999]"
    />
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 400);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes key={location.pathname} location={location}>
          <Route
            path="/"
            element={
              <PageWrapper>
                <Home />
              </PageWrapper>
            }
          />
        </Routes>
      </AnimatePresence>

      {/* Black overlay fade during transitions */}
      <OverlayTransition isVisible={isTransitioning} />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}
