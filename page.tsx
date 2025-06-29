"use client";

import { useEffect, useState } from "react";

const Index = () => {
  const [activeSection, setActiveSection] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState<boolean>(false);
  const [selectedExhibition, setSelectedExhibition] = useState<any>(null);
  const [ticketQuantity, setTicketQuantity] = useState<number>(1);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });
  const [paymentErrors, setPaymentErrors] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });
  useEffect(() => {
    const handleScroll = () => {
      const sections: string[] = [
        "hero",
        "services",
        "latest-work",
        "exhibitions",
        "testimonials",
      ];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMobileMenuOpen && !target.closest(".navbar-fixed")) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Mouse tracking for magnetic effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Scroll tracking for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openTicketModal = (exhibition: any) => {
    setSelectedExhibition(exhibition);
    setIsTicketModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeTicketModal = () => {
    setIsTicketModalOpen(false);
    setSelectedExhibition(null);
    setFormData({ fullName: "", email: "", phone: "" });
    setFormErrors({ fullName: "", email: "", phone: "" });
    setTicketQuantity(1);
    document.body.style.overflow = "unset";
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const errors = { fullName: "", email: "", phone: "" };
    let isValid = true;

    if (!formData.fullName.trim()) {
      errors.fullName = "Please enter your full name";
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = "Please enter your email address";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      errors.phone = "Please enter your phone number";
      isValid = false;
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsPaymentModalOpen(true);
    }
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setPaymentData({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
    });
    setPaymentErrors({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
    });
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    closeTicketModal();
    closePaymentModal();
  };

  const handlePaymentInputChange = (field: string, value: string) => {
    // Format card number with spaces
    if (field === "cardNumber") {
      value = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
      if (value.length > 19) value = value.slice(0, 19);
    }
    // Format expiry date as MM/YY
    if (field === "expiryDate") {
      value = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2");
      if (value.length > 5) value = value.slice(0, 5);
    }
    // Limit CVV to 3 digits
    if (field === "cvv") {
      value = value.replace(/\D/g, "");
      if (value.length > 3) value = value.slice(0, 3);
    }

    setPaymentData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (paymentErrors[field as keyof typeof paymentErrors]) {
      setPaymentErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validatePayment = () => {
    const errors = {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
    };
    let isValid = true;

    if (!paymentData.cardNumber.trim()) {
      errors.cardNumber = "Please enter your card number";
      isValid = false;
    } else if (paymentData.cardNumber.replace(/\s/g, "").length < 16) {
      errors.cardNumber = "Please enter a valid 16-digit card number";
      isValid = false;
    }

    if (!paymentData.expiryDate.trim()) {
      errors.expiryDate = "Please enter expiry date";
      isValid = false;
    } else if (!/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
      errors.expiryDate = "Please enter date in MM/YY format";
      isValid = false;
    }

    if (!paymentData.cvv.trim()) {
      errors.cvv = "Please enter CVV";
      isValid = false;
    } else if (paymentData.cvv.length < 3) {
      errors.cvv = "Please enter a valid 3-digit CVV";
      isValid = false;
    }

    if (!paymentData.cardholderName.trim()) {
      errors.cardholderName = "Please enter cardholder name";
      isValid = false;
    }

    setPaymentErrors(errors);
    return isValid;
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePayment()) {
      // Simulate payment processing
      setTimeout(() => {
        setIsPaymentModalOpen(false);
        setIsSuccessModalOpen(true);
      }, 0);
    }
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      /* Disable horizontal scroll */
      html, body {
        overflow-x: hidden;
      }

      /* Custom Scrollbar Styles */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: rgba(238, 237, 238, 0.3);
        border-radius: 10px;
      }
      
      ::-webkit-scrollbar-thumb {
        background: #DB574D;
        border-radius: 10px;
        transition: all 0.3s ease;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: #c44a40;
        box-shadow: 0 2px 8px rgba(219, 87, 77, 0.3);
      }
      
      ::-webkit-scrollbar-corner {
        background: rgba(238, 237, 238, 0.3);
      }
      
      /* Firefox Scrollbar */
      * {
        scrollbar-width: thin;
        scrollbar-color: #DB574D rgba(238, 237, 238, 0.3);
      }
      
      /* Custom scrollbar for mobile and responsive design */
      @media (max-width: 768px) {
        ::-webkit-scrollbar {
          width: 6px;
        }
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(60px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeInLeft {
        from {
          opacity: 0;
          transform: translateX(-60px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes fadeInRight {
        from {
          opacity: 0;
          transform: translateX(60px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }

      @keyframes glow {
        0%, 100% { 
          box-shadow: 0 0 20px rgba(219, 87, 77, 0.3);
        }
        50% { 
          box-shadow: 0 0 40px rgba(219, 87, 77, 0.6);
        }
      }

      @keyframes slideInScale {
        0% {
          opacity: 0;
          transform: translateY(100px) scale(0.8);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes morphBg {
        0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
        25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        50% { border-radius: 70% 30% 40% 60% / 40% 70% 60% 50%; }
        75% { border-radius: 40% 70% 60% 30% / 70% 40% 50% 60%; }
      }

      @keyframes textReveal {
        0% {
          opacity: 0;
          transform: translateY(100%) rotateX(-90deg);
        }
        100% {
          opacity: 1;
          transform: translateY(0) rotateX(0deg);
        }
      }

      @keyframes magneticPull {
        0% { transform: translate(0, 0); }
        100% { transform: translate(var(--x), var(--y)); }
      }
      
      .scroll-animate {
        opacity: 0;
        transform: translateY(60px);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .scroll-animate-left {
        opacity: 0;
        transform: translateX(-60px);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .scroll-animate-right {
        opacity: 0;
        transform: translateX(60px);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .scroll-animate.visible {
        opacity: 1;
        transform: translateY(0);
      }
      
      .scroll-animate-left.visible {
        opacity: 1;
        transform: translateX(0);
      }
      
      .scroll-animate-right.visible {
        opacity: 1;
        transform: translateX(0);
      }
      
      .animate-fade-in {
        animation: fadeInUp 0.8s ease-out forwards;
        opacity: 0;
      }
      
      .hover-zoom {
        transition: transform 0.3s ease;
      }
      
      .hover-zoom:hover {
        transform: scale(1.05);
      }
      
      .animate-pulse-slow {
        animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }

      .animate-float {
        animation: float 6s ease-in-out infinite;
      }

      .animate-glow {
        animation: glow 2s ease-in-out infinite alternate;
      }

      .animate-slide-scale {
        animation: slideInScale 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }

      .animate-morph {
        animation: morphBg 8s ease-in-out infinite;
      }

      .animate-text-reveal {
        animation: textReveal 0.8s cubic-bezier(0.77, 0, 0.175, 1) forwards;
        transform-origin: bottom;
        perspective: 1000px;
      }

      .magnetic {
        transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        cursor: pointer;
      }

      .magnetic:hover {
        transform: scale(1.05);
      }

      .parallax-element {
        will-change: transform;
        transition: transform 0.1s linear;
      }

      .glass-effect {
        backdrop-filter: blur(20px);
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .text-gradient {
        background: linear-gradient(135deg, #DB574D, #ff8a65, #DB574D);
        background-size: 200% 200%;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: gradient-shift 3s ease infinite;
      }

      @keyframes gradient-shift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }

      .stagger-children > * {
        opacity: 0;
        transform: translateY(50px);
        animation: slideInScale 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }

      .stagger-children > *:nth-child(1) { animation-delay: 0.1s; }
      .stagger-children > *:nth-child(2) { animation-delay: 0.2s; }
      .stagger-children > *:nth-child(3) { animation-delay: 0.3s; }
      .stagger-children > *:nth-child(4) { animation-delay: 0.4s; }
      .stagger-children > *:nth-child(5) { animation-delay: 0.5s; }
      .stagger-children > *:nth-child(6) { animation-delay: 0.6s; }
        .navbar-underline {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.navbar-underline::before {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #DB574D;
  transition: width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-origin: left;
}

.navbar-underline:hover::before {
  width: 100%;
}

.navbar-underline.active::before {
  width: 100%;
}
  .navbar-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  backdrop-filter: blur(10px);
}
.navbar-fixed.light {
  background-color: rgba(238, 237, 238, 0.95);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.navbar-fixed.dark {
  background-color: rgba(17, 24, 39, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.mobile-menu {
  position: fixed;
  top: 73px;
  left: 0;
  right: 0;
  backdrop-filter: blur(10px);
  transform: translateY(-100%);
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 40;
  visibility: hidden;
  opacity: 0;
  max-height: calc(100vh - 73px); /* Prevent overflow */
  overflow-y: auto; /* Allow scrolling if needed */
}
.mobile-menu.light {
  background-color: rgba(238, 237, 238, 0.98);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.mobile-menu.dark {
  background-color: rgba(17, 24, 39, 0.98);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-menu.open {
  transform: translateY(0);
  visibility: visible;
  opacity: 1;
}

@media (min-width: 768px) {
  .mobile-menu {
    display: none !important;
  }
}

/* Prevent body scroll when mobile menu is open */
body.mobile-menu-open {
  overflow: hidden;
}

/* Ensure no horizontal overflow */
.mobile-menu-item {
  position: relative;
  display: block;
  padding: 16px 24px;
  text-align: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
}

.mobile-menu-item:hover {
  background-color: rgba(219, 87, 77, 0.05);
}

.hamburger-line {
  display: block;
  width: 24px;
  height: 2px;
  background-color: currentColor;
  transition: all 0.3s ease;
  transform-origin: center;
  cursor: pointer;
}

.hamburger-line + .hamburger-line {
  margin-top: 4px;
}

.hamburger.open .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translateY(6px);
}

.hamburger.open .hamburger-line:nth-child(2) {
  opacity: 0;
}

.hamburger.open .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translateY(-6px);
}

/* Ticket Modal Styles */
.ticket-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: none;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  padding: 20px;
  box-sizing: border-box;
}

.ticket-modal-overlay.open {
  display: flex;
  opacity: 1;
  visibility: visible;
}

.ticket-modal {
  border-radius: 20px;
  padding: 40px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  transform: scale(0.9) translateY(50px);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  position: relative;
}
.ticket-modal.light {
  background: #EEEDEE;
}
.ticket-modal.dark {
  background: #1f2937;
}

.ticket-modal-overlay.open .ticket-modal {
  transform: scale(1) translateY(0);
}

.ticket-modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  transition: color 0.2s ease;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.ticket-modal-close:hover {
  color: #DB574D;
  background: rgba(219, 87, 77, 0.1);
}

.ticket-form-group {
  margin-bottom: 20px;
}

.ticket-form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: color 0.3s ease;
}
.light .ticket-form-label {
  color: #333;
}
.dark .ticket-form-label {
  color: #e5e7eb;
}

.ticket-form-input, .ticket-form-select {
  width: 100%;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.2s ease;
}
.light .ticket-form-input, .light .ticket-form-select {
  border: 2px solid #ddd;
  background: white;
  color: #333;
}
.dark .ticket-form-input, .dark .ticket-form-select {
  border: 2px solid #4b5563;
  background: #374151;
  color: #e5e7eb;
}

.ticket-form-input:focus, .ticket-form-select:focus {
  outline: none;
  border-color: #DB574D;
}

.ticket-quantity-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.quantity-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #DB574D;
  border-radius: 50%;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
.light .quantity-btn {
  background: white;
  color: #DB574D;
}
.dark .quantity-btn {
  background: #374151;
  color: #DB574D;
}

.quantity-btn:hover {
  background: #DB574D;
  color: white;
}

.quantity-display {
  font-size: 20px;
  font-weight: bold;
  min-width: 30px;
  text-align: center;
  transition: color 0.3s ease;
}
.light .quantity-display {
  color: #333;
}
.dark .quantity-display {
  color: #e5e7eb;
}

.ticket-total {
  padding: 20px;
  border-radius: 10px;
  margin: 20px 0;
  text-align: center;
  transition: background-color 0.3s ease;
}
.light .ticket-total {
  background: rgba(219, 87, 77, 0.1);
}
.dark .ticket-total {
  background: rgba(219, 87, 77, 0.15);
}

.ticket-purchase-btn {
  width: 100%;
  background: #DB574D;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ticket-purchase-btn:hover {
  background: #c44a40;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(219, 87, 77, 0.3);
}

.form-error {
  color: #DB574D;
  font-size: 12px;
  margin-top: 6px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.form-error::before {
  content: '⚠';
  font-size: 14px;
}

.light .ticket-form-input.error, .light .ticket-form-select.error {
  border-color: #DB574D;
  background-color: rgba(219, 87, 77, 0.05);
}
.dark .ticket-form-input.error, .dark .ticket-form-select.error {
  border-color: #DB574D;
  background-color: rgba(219, 87, 77, 0.1);
}

.ticket-form-input.error:focus, .ticket-form-select.error:focus {
  border-color: #DB574D;
  box-shadow: 0 0 0 3px rgba(219, 87, 77, 0.1);
}

.form-field-wrapper {
  position: relative;
}

/* Payment Modal Styles */
.payment-modal {
  border-radius: 20px;
  padding: 30px;
  max-width: 450px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  transform: scale(0.9) translateY(30px);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  position: relative;
}
.payment-modal.light {
  background: #EEEDEE;
}
.payment-modal.dark {
  background: #1f2937;
}

.ticket-modal-overlay.open .payment-modal {
  transform: scale(1) translateY(0);
}

.payment-header {
  text-align: center;
  margin-bottom: 25px;
}

.payment-amount {
  padding: 18px;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 25px;
  transition: all 0.3s ease;
}
.light .payment-amount {
  background: rgba(219, 87, 77, 0.08);
  border: 1px solid rgba(219, 87, 77, 0.15);
}
.dark .payment-amount {
  background: rgba(219, 87, 77, 0.12);
  border: 1px solid rgba(219, 87, 77, 0.25);
}

.card-icons {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 25px;
}

.card-icon {
  width: 45px;
  height: 28px;
  background: linear-gradient(135deg, #DB574D, #c44a40);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 9px;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(219, 87, 77, 0.2);
  transition: transform 0.2s ease;
}

.card-icon:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(219, 87, 77, 0.3);
}

.payment-form-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 15px;
}

.processing-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Success Modal Styles */
.success-modal {
  border-radius: 20px;
  padding: 50px 40px;
  max-width: 400px;
  width: 90%;
  transform: scale(0.9) translateY(50px);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  text-align: center;
  position: relative;
}
.success-modal.light {
  background: #EEEDEE;
}
.success-modal.dark {
  background: #1f2937;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: #DB574D;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 25px;
  color: white;
  font-size: 40px;
}

.success-checkmark {
  animation: checkmark 0.6s ease-in-out 0.3s both;
  transform: scale(0);
}

@keyframes checkmark {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.success-details {
  border-radius: 10px;
  padding: 20px;
  margin: 20px 0;
  text-align: left;
  transition: background-color 0.3s ease;
}
.light .success-details {
  background: rgba(219, 87, 77, 0.05);
}
.dark .success-details {
  background: rgba(219, 87, 77, 0.1);
}

.success-close-btn {
  background: #DB574D;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 20px;
}

.success-close-btn:hover {
  background: #c44a40;
  transform: translateY(-2px);
}

/* Cursor Pointer for All Clickable Elements */
.navbar-underline,
.mobile-menu-item,
button,
.hamburger,
.quantity-btn,
.ticket-modal-close,
.ticket-purchase-btn,
.success-close-btn,
.card-icon,
[onclick],
[role="button"] {
  cursor: pointer !important;
}

/* Hover effects for better UX */
button:hover,
.hamburger:hover,
.mobile-menu-item:hover {
  opacity: 0.9;
  transition: opacity 0.2s ease;
}

/* Disabled state cursor */
button:disabled,
.ticket-purchase-btn:disabled {
  cursor: not-allowed !important;
  opacity: 0.6;
}
    `;
    document.head.appendChild(style);

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    const animateElements = document.querySelectorAll(
      ".scroll-animate, .scroll-animate-left, .scroll-animate-right"
    );
    animateElements.forEach((el) => observer.observe(el));

    return () => {
      document.head.removeChild(style);
      observer.disconnect();
    };
  }, []);

  const services = [
    {
      number: "01",
      title: "PHOTO SHOOTING",
      description:
        "Professional photography sessions capturing authentic moments with artistic vision and technical precision.",
    },
    {
      number: "02",
      title: "VIDEO EDITING",
      description:
        "Expert video post-production bringing your visual stories to life with cinematic quality and creative flair.",
    },
    {
      number: "03",
      title: "ART DIRECTION",
      description:
        "Creative direction and visual storytelling guidance for brands and artistic projects seeking unique perspectives.",
    },
  ];

  const leftColumnImages = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1642613003010-8bf9757517c3?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJhbGxldCUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D",
      alt: "Dancing in Black & White",
      title: "DANCING IN BLACK & White",
      location: "New York, October 2021",
      className: "aspect-[3/4]",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=600&fit=crop&crop=center",
      alt: "Week Fashion",
      title: "WEEK Fashion",
      location: "New York, October 2021",
      className: "aspect-square",
    },
  ];

  const rightColumnImages = [
    {
      id: 3,
      src: "https://images.unsplash.com/flagged/photo-1570733117311-d990c3816c47?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Style & Fashion",
      title: "STYLE & Fashion",
      location: "New York, October 2021",
      className: "aspect-[3/2]",
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=center",
      alt: "One Eye",
      title: "ONE Eye",
      location: "New York, October 2021",
      className: "aspect-[3/2]",
    },
  ];

  const exhibitions = [
    {
      id: 1,
      image:
        "https://plus.unsplash.com/premium_photo-1661896580759-c9c8f1a4862a?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZXhoaWJpdGlvbnxlbnwwfHwwfHx8MA%3D%3D",
      location: "New York",
      year: "2022",
      title: "INDEPENDENT Beauty",
      description:
        "Professional photography sessions capturing authentic moments with artistic vision and technical precision.",
      month: "OCT",
      day: "15",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1497316730643-415fac54a2af?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      location: "London",
      year: "2022",
      title: "MODERN Gallery",
      description:
        "Professional photography sessions capturing authentic moments with artistic vision and technical precision.",
      month: "NOV",
      day: "22",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=150&h=150&fit=crop&crop=center",
      location: "Paris",
      year: "2022",
      title: "ARTISTIC Vision",
      description:
        "Professional photography sessions capturing authentic moments with artistic vision and technical precision.",
      month: "DEC",
      day: "08",
    },
  ];

  const testimonials = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
      text: "Working with Jojo was an incredible experience. His artistic vision and technical skills brought our project to life in ways we never imagined.",
      name: "Sarah Johnson",
      service: "Fashion Photography",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=center",
      text: "Jojo's attention to detail and creative approach made our wedding photos absolutely stunning. We couldn't be happier with the results.",
      name: "Michael Chen",
      service: "Wedding Photography",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=center",
      text: "The video editing work Jojo delivered exceeded our expectations. His artistic flair and technical expertise are truly remarkable.",
      name: "Emma Davis",
      service: "Video Production",
    },
  ];

  return (
    <div
      className={`min-h-screen font-sans md:px-10 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900" : "bg-[#EEEDEE]"
      }`}
    >
      <header
        className="navbar-fixed py-4 animate-fade-in"
        style={{
          backgroundColor: isDarkMode
            ? "rgba(17, 24, 39, 0.95)"
            : "rgba(238, 237, 238, 0.95)",
          borderBottom: isDarkMode
            ? "1px solid rgba(255, 255, 255, 0.1)"
            : "1px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className="text-xl md:text-2xl font-bold text-[#DB574D]">
              Jojo Grønberg
            </div>

            <nav className="hidden md:flex space-x-8 items-center">
              <button
                onClick={() => scrollToSection("hero")}
                className={`text-sm font-medium transition-colors navbar-underline ${
                  activeSection === "hero"
                    ? "text-[#DB574D] active"
                    : isDarkMode
                    ? "text-white hover:text-[#DB574D]"
                    : "text-black hover:text-[#DB574D]"
                }`}
              >
                HOME
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className={`text-sm font-medium transition-colors navbar-underline ${
                  activeSection === "services"
                    ? "text-[#DB574D] active"
                    : isDarkMode
                    ? "text-white hover:text-[#DB574D]"
                    : "text-black hover:text-[#DB574D]"
                }`}
              >
                SERVICES
              </button>
              <button
                onClick={() => scrollToSection("latest-work")}
                className={`text-sm font-medium transition-colors navbar-underline ${
                  activeSection === "latest-work"
                    ? "text-[#DB574D] active"
                    : isDarkMode
                    ? "text-white hover:text-[#DB574D]"
                    : "text-black hover:text-[#DB574D]"
                }`}
              >
                WORK
              </button>
              <button
                onClick={() => scrollToSection("exhibitions")}
                className={`text-sm font-medium transition-colors navbar-underline ${
                  activeSection === "exhibitions"
                    ? "text-[#DB574D] active"
                    : isDarkMode
                    ? "text-white hover:text-[#DB574D]"
                    : "text-black hover:text-[#DB574D]"
                }`}
              >
                EXHIBITIONS
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className={`text-sm font-medium transition-colors navbar-underline ${
                  activeSection === "testimonials"
                    ? "text-[#DB574D] active"
                    : isDarkMode
                    ? "text-white hover:text-[#DB574D]"
                    : "text-black hover:text-[#DB574D]"
                }`}
              >
                TESTIMONIALS
              </button>

              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`ml-4 relative w-14 h-8 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#DB574D] focus:ring-opacity-50 ${
                  isDarkMode
                    ? "bg-gray-700 shadow-inner"
                    : "bg-[#e1736b] shadow-md"
                }`}
                aria-label="Toggle dark mode"
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center text-sm ${
                    isDarkMode
                      ? "translate-x-6 bg-gray-900 text-yellow-300 shadow-lg"
                      : "translate-x-0 bg-white text-amber-600 shadow-md"
                  }`}
                >
                  {isDarkMode ? "🌙" : "☀️"}
                </div>
              </button>
            </nav>

            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`relative w-12 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#DB574D] focus:ring-opacity-50 ${
                  isDarkMode
                    ? "bg-gray-700 shadow-inner"
                    : "bg-[#e1736b] shadow-md"
                }`}
                aria-label="Toggle dark mode"
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center text-sm ${
                    isDarkMode
                      ? "translate-x-5 bg-gray-900 text-yellow-300 shadow-lg"
                      : "translate-x-0 bg-white text-amber-600 shadow-md"
                  }`}
                >
                  {isDarkMode ? "🌙" : "☀️"}
                </div>
              </button>
              <button
                className={`hamburger ${isMobileMenuOpen ? "open" : ""} ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
              </button>
            </div>
          </div>
        </div>

        <div
          className={`-mt-3 mobile-menu md:hidden ${
            isMobileMenuOpen ? "open" : ""
          }`}
          style={{
            backgroundColor: isDarkMode
              ? "rgba(17, 24, 39, 0.98)"
              : "rgba(238, 237, 238, 0.98)",
            borderBottom: isDarkMode
              ? "1px solid rgba(255, 255, 255, 0.1)"
              : "1px solid rgba(0, 0, 0, 0.1)",
          }}
        >
          <button
            onClick={() => scrollToSection("hero")}
            className={`mobile-menu-item text-sm font-medium w-full ${
              activeSection === "hero"
                ? "text-[#DB574D]"
                : isDarkMode
                ? "text-white hover:text-[#DB574D]"
                : "text-black hover:text-[#DB574D]"
            }`}
          >
            HOME
          </button>
          <button
            onClick={() => scrollToSection("services")}
            className={`mobile-menu-item text-sm font-medium w-full ${
              activeSection === "services"
                ? "text-[#DB574D]"
                : isDarkMode
                ? "text-white hover:text-[#DB574D]"
                : "text-black hover:text-[#DB574D]"
            }`}
          >
            SERVICES
          </button>
          <button
            onClick={() => scrollToSection("latest-work")}
            className={`mobile-menu-item text-sm font-medium w-full ${
              activeSection === "latest-work"
                ? "text-[#DB574D]"
                : isDarkMode
                ? "text-white hover:text-[#DB574D]"
                : "text-black hover:text-[#DB574D]"
            }`}
          >
            WORK
          </button>
          <button
            onClick={() => scrollToSection("exhibitions")}
            className={`mobile-menu-item text-sm font-medium w-full ${
              activeSection === "exhibitions"
                ? "text-[#DB574D]"
                : isDarkMode
                ? "text-white hover:text-[#DB574D]"
                : "text-black hover:text-[#DB574D]"
            }`}
          >
            EXHIBITIONS
          </button>
          <button
            onClick={() => scrollToSection("testimonials")}
            className={`mobile-menu-item text-sm font-medium w-full ${
              activeSection === "testimonials"
                ? "text-[#DB574D]"
                : isDarkMode
                ? "text-white hover:text-[#DB574D]"
                : "text-black hover:text-[#DB574D]"
            }`}
          >
            TESTIMONIALS
          </button>
        </div>
      </header>

      <section
        className={`pt-20 md:pt-0 relative min-h-screen overflow-hidden transition-colors duration-300 ${
          isDarkMode ? "bg-gray-900" : "bg-[#EEEDEE]"
        }`}
        id="hero"
      >
        <div className="container mx-auto px-6 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 min-h-[80vh] items-center">
            <div className="space-y-8 lg:space-y-12 relative z-20">
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl xl:text-9xl font-bold leading-[0.85] ">
                  <span className="text-[#DB574D] block animate-fade-in">
                    Jojo
                  </span>
                  <span
                    className="text-[#DB574D] block animate-fade-in relative z-30"
                    style={{ animationDelay: "0.2s" }}
                  >
                    Grønberg
                  </span>
                </h1>
                <p
                  className={`text-sm md:text-base lg:text-3xl font-medium tracking-[0.2em] uppercase animate-fade-in transition-colors duration-300 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                  style={{ animationDelay: "0.4s" }}
                >
                  PHOTOGRAPHER
                </p>
                <p
                  className={`text-sm md:text-base lg:text-3xl font-medium tracking-[0.2em] uppercase animate-fade-in ml-24 transition-colors duration-300 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                  style={{ animationDelay: "0.6s" }}
                >
                  & VISUAL ARTIST
                </p>
              </div>
            </div>

            <div
              className="relative h-[60vh] lg:h-[70vh] animate-fade-in"
              style={{ animationDelay: "0.8s" }}
            >
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1642613003010-8bf9757517c3?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJhbGxldCUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D"
                  alt="Male ballet dancer in performance"
                  className="w-full h-full object-contain grayscale hover-zoom"
                />
              </div>
            </div>
          </div>

          <div className="mt-26 md:mt-0 flex flex-col sm:flex-row justify-between items-start sm:items-end mt-8 lg:mt-8 gap-6">
            <div
              className="flex items-center gap-4 relative animate-fade-in"
              style={{ animationDelay: "1s" }}
            ></div>

            <div
              className={`flex items-center animate-fade-in absolute bottom-[5.5rem] right-[10rem]  transition-colors -mt-5 hover:text-[#DB574D] ${
                isDarkMode ? "text-white" : "text-black"
              }`}
              style={{ animationDelay: "1.2s" }}
            >
              <svg
                width="21"
                height="164"
                className="w-16 h-16 animate-pulse-slow"
                viewBox="0 0 21 164"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_7_164)">
                  <path
                    d="M20.834 154L19.441 152.57L11.834 160.15L11.834 0L9.83398 0L9.83398 160.15L2.26098 152.57L0.833984 154L10.834 164L20.834 154Z"
                    fill="currentColor"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_7_164">
                    <rect
                      width="164"
                      height="20"
                      fill="white"
                      transform="matrix(0 1 -1 0 20.834 0)"
                    />
                  </clipPath>
                </defs>
              </svg>
              <div className="w-24">
                <p
                  className={`text-sm md:text-base transition-colors duration-300 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  Scroll Down
                </p>
                <p
                  className={`text-sm md:text-base transition-colors duration-300 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  & Explore
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className={`py-20 transition-colors duration-300 ${
          isDarkMode ? "bg-gray-900" : "bg-[#EEEDEE]"
        }`}
        id="services"
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-1">
              <h2
                className={`text-lg font-medium scroll-animate-left transition-colors duration-300 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                — Services
              </h2>
            </div>

            <div className="lg:col-span-2 space-y-12">
              {services.map((service, index) => (
                <div key={index}>
                  <div
                    className="flex gap-8 items-start scroll-animate"
                    style={{ transitionDelay: `${index * 200}ms` }}
                  >
                    <span className="text-[#DB574D] text-4xl md:text-5xl font-bold flex-shrink-0">
                      {service.number}
                    </span>
                    <div>
                      <h3
                        className={`text-xl md:text-2xl font-bold mb-3 transition-colors duration-300 ${
                          isDarkMode ? "text-white" : "text-black"
                        }`}
                      >
                        {service.title}
                      </h3>
                      <p
                        className={`text-base leading-relaxed transition-colors duration-300 ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {service.description}
                      </p>
                    </div>
                  </div>

                  {index < services.length - 1 && (
                    <div className="mt-12">
                      <svg
                        width="700"
                        height="1"
                        viewBox="0 0 700 1"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full"
                      >
                        <rect
                          width="700"
                          height="1"
                          fill="#101010"
                          fillOpacity="0.1"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20" id="latest-work">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold scroll-animate-left">
              <span
                className={`transition-colors duration-300 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                LATEST{" "}
              </span>
              <span className="text-[#DB574D]">Work</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-8">
              {leftColumnImages.map((image, index) => (
                <div
                  key={image.id}
                  className="scroll-animate-left"
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <h3
                    className={`text-lg md:text-xl font-bold transition-colors duration-300 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    {image.title.split(" ").map((word, wordIndex) => (
                      <span
                        key={wordIndex}
                        className={
                          wordIndex === image.title.split(" ").length - 1
                            ? "text-[#DB574D]"
                            : isDarkMode
                            ? "text-white"
                            : "text-black"
                        }
                      >
                        {word}
                        {wordIndex < image.title.split(" ").length - 1
                          ? " "
                          : ""}
                      </span>
                    ))}
                  </h3>
                  <div
                    className={`overflow-hidden mb-4 rounded-2xl ${image.className}`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 hover:scale-110 hover:rotate-2 transition-all duration-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <p
                      className={`text-sm transition-colors duration-300 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {image.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-8">
              {rightColumnImages.map((image, index) => (
                <div
                  key={image.id}
                  className="scroll-animate-right"
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  {" "}
                  <h3
                    className={`text-lg md:text-xl font-bold transition-colors duration-300 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    {image.title.split(" ").map((word, wordIndex) => (
                      <span
                        key={wordIndex}
                        className={
                          wordIndex === image.title.split(" ").length - 1
                            ? "text-[#DB574D]"
                            : isDarkMode
                            ? "text-white"
                            : "text-black"
                        }
                      >
                        {word}
                        {wordIndex < image.title.split(" ").length - 1
                          ? " "
                          : ""}
                      </span>
                    ))}
                  </h3>
                  <div
                    className={`overflow-hidden mb-4 rounded-2xl ${image.className}`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 hover:scale-110 hover:rotate-2 transition-all duration-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <p
                      className={`text-sm transition-colors duration-300 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {image.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20" id="exhibitions">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold scroll-animate-left">
              <span
                className={`transition-colors duration-300 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                EXHIBITIONS{" "}
              </span>
              <span className="text-[#DB574D]">'22</span>
            </h2>
          </div>

          <div className="space-y-12">
            {exhibitions.map((exhibition, index) => (
              <div key={exhibition.id}>
                <div
                  className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center scroll-animate"
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className="md:col-span-2">
                    <div className="w-20 h-20 md:w-24 md:h-24 overflow-hidden">
                      <img
                        src={exhibition.image}
                        alt={exhibition.title}
                        className="w-full h-full object-cover grayscale hover-zoom"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-7 space-y-2">
                    <p
                      className={`text-sm transition-colors duration-300 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {exhibition.location}, {exhibition.year}
                    </p>
                    <h3
                      className={`text-xl md:text-2xl font-bold transition-colors duration-300 ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      {exhibition.title.split(" ").map((word, wordIndex) => (
                        <span
                          key={wordIndex}
                          className={
                            word === "Beauty" ||
                            word === "Gallery" ||
                            word === "Vision"
                              ? "text-[#DB574D]"
                              : isDarkMode
                              ? "text-white"
                              : "text-black"
                          }
                        >
                          {word}
                          {wordIndex < exhibition.title.split(" ").length - 1
                            ? " "
                            : ""}
                        </span>
                      ))}
                    </h3>
                    <p
                      className={`text-sm md:text-base leading-relaxed transition-colors duration-300 ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {exhibition.description}
                    </p>
                  </div>

                  <div className="md:col-span-3 flex md:flex-col items-start md:items-end gap-4">
                    <div className="text-[#DB574D] text-center">
                      <div className="text-lg md:text-xl">
                        {exhibition.month}
                      </div>
                      <div className="text-xl md:text-6xl font-bold tracking-wide">
                        {exhibition.day}
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-2 text-[#DB574D] hover:opacity-80 transition-opacity cursor-pointer"
                      onClick={() => openTicketModal(exhibition)}
                    >
                      <span className="text-sm font-medium">Buy Ticket</span>
                      <svg
                        width="21"
                        height="22"
                        viewBox="0 0 21 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.02002 16.48L15.6266 5.87338"
                          stroke="currentColor"
                        />
                        <path
                          d="M6.08057 5.52002H15.9801V15.4195"
                          stroke="currentColor"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                {index < exhibitions.length - 1 && (
                  <div className="mt-8">
                    <svg
                      width="700"
                      height="1"
                      viewBox="0 0 700 1"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full"
                    >
                      <rect
                        width="700"
                        height="1"
                        fill="#101010"
                        fillOpacity="0.1"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className={`py-20 transition-colors duration-300 ${
          isDarkMode ? "bg-gray-900" : "bg-[#EEEDEE]"
        }`}
        id="testimonials"
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold scroll-animate-left">
                  <span
                    className={`transition-colors duration-300 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    WHAT MY CLIENTS{" "}
                  </span>
                  <span className="text-[#DB574D]">Say</span>
                </h2>
                <p
                  className={`text-sm md:text-base font-medium tracking-wider scroll-animate-left transition-colors duration-300 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                  style={{ transitionDelay: "200ms" }}
                >
                  <span>WORKED WITH OVER </span>
                  <span className="text-[#DB574D]">50 CLIENTS</span>
                  <span> AROUND THE WORLD</span>
                </p>
              </div>

              <button
                onClick={() => scrollToSection("footer")}
                className="border-2 border-[#DB574D] text-[#DB574D] px-8 py-4 rounded-full text-sm md:text-base font-medium hover:bg-[#DB574D] hover:text-white transition-all flex items-center gap-2 scroll-animate-left cursor-pointer"
                style={{ transitionDelay: "100ms" }}
              >
                Work With Me
                <svg
                  width="32"
                  height="16"
                  viewBox="0 0 32 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 8H30" stroke="currentColor" />
                  <path d="M23.5 1L30.5 8L23.5 15" stroke="currentColor" />
                </svg>
              </button>
            </div>

            <div className="space-y-8">
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id}>
                  <div
                    className="scroll-animate-right"
                    style={{ transitionDelay: `${index * 200}ms` }}
                  >
                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full object-cover grayscale hover-zoom"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="text-[#DB574D] text-2xl md:text-3xl flex items-start gap-2">
                          <svg
                            width="51"
                            height="52"
                            viewBox="0 0 51 52"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="flex-shrink-0 mt-2"
                          >
                            <path
                              d="M15.2775 0.5C5.61674 0.5 0 5.44273 0 15.3282V51.5H19.7709V20.4956H11.0088V15.1035C11.0088 11.0595 12.5815 10.3855 15.5022 10.3855H19.9956V0.5H15.2775ZM46.2819 0.5C36.6211 0.5 31.0044 5.44273 31.0044 15.3282V51.5H50.7753V20.4956H42.0132V15.1035C42.0132 11.0595 43.3612 10.3855 46.5066 10.3855H51V0.5H46.2819Z"
                              fill="currentColor"
                            />
                          </svg>
                          <p
                            className={`text-sm md:text-base font-medium leading-relaxed italic transition-colors duration-300 ${
                              isDarkMode ? "text-white" : "text-black"
                            }`}
                          >
                            {testimonial.text}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <p
                            className={`font-medium transition-colors duration-300 ${
                              isDarkMode ? "text-white" : "text-black"
                            }`}
                          >
                            {testimonial.name}
                          </p>
                          <p
                            className={`text-sm transition-colors duration-300 ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {testimonial.service}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < testimonials.length - 1 && (
                    <div className="mt-8">
                      <svg
                        width="700"
                        height="1"
                        viewBox="0 0 700 1"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full"
                      >
                        <rect
                          width="700"
                          height="1"
                          fill="#101010"
                          fillOpacity="0.1"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer
        className={`py-20 transition-colors duration-300 ${
          isDarkMode ? "bg-gray-900" : "bg-[#EEEDEE]"
        }`}
        id="footer"
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-16 items-center mb-16">
            <div className="flex items-center gap-4 scroll-animate justify-center">
              <svg
                width="230"
                height="220"
                viewBox="0 0 230 220"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="hover:scale-105 transition-transform duration-300"
              >
                <rect
                  y="10.5"
                  width="200"
                  height="200"
                  rx="100"
                  fill="#DB574D"
                />
                <path
                  d="M71.972 105.74C74.828 105.74 77.156 104.588 77.972 101.996H78.092V105.5H79.628V97.58H71.516V98.924H77.9V99.524C77.9 102.644 76.028 104.084 72.212 104.084C68.204 104.084 65.972 101.828 65.972 97.46C65.972 93.092 68.228 90.836 72.284 90.836C75.836 90.836 77.756 92.372 77.756 95.036V95.252H79.604V95.036C79.604 91.46 76.484 89.18 72.308 89.18C67.508 89.18 64.172 92.444 64.172 97.46C64.172 102.476 67.388 105.74 71.972 105.74ZM94.4021 105.5V103.94H83.8901V98.18H94.0421V96.644H83.8901V90.98H94.4021V89.42H82.1861V105.5H94.4021ZM103.94 105.5V90.98H110.54V89.42H95.6117V90.98H102.236V105.5H103.94ZM118.343 105.5V89.42H116.639V105.5H118.343ZM122.914 105.5V94.676L122.866 91.988H122.986L125.002 94.7L133.378 105.5H135.25V89.42H133.546V100.388L133.594 103.028H133.45L131.506 100.34L123.082 89.42H121.21V105.5H122.914ZM66.51 131.5V116.98H73.11V115.42H58.182V116.98H64.806V131.5H66.51ZM82.3153 131.74C87.1393 131.74 90.4753 128.476 90.4753 123.46C90.4753 118.444 87.1393 115.18 82.3153 115.18C77.5393 115.18 74.2033 118.444 74.2033 123.46C74.2033 128.476 77.5393 131.74 82.3153 131.74ZM82.3153 130.084C78.2593 130.084 76.0033 127.828 76.0033 123.46C76.0033 119.092 78.2593 116.836 82.3153 116.836C86.3953 116.836 88.6753 119.092 88.6753 123.46C88.6753 127.828 86.3953 130.084 82.3153 130.084ZM99.8844 131.74C104.348 131.74 107.132 129.268 107.132 124.852V115.42H105.428V124.78C105.428 128.452 103.628 130.06 99.8844 130.06C96.1404 130.06 94.3404 128.452 94.3404 124.78V115.42H92.6364V124.852C92.6364 129.268 95.4204 131.74 99.8844 131.74ZM117.305 131.74C121.481 131.74 124.601 129.412 124.601 125.764V125.476H122.753V125.764C122.753 128.5 120.857 130.084 117.329 130.084C113.321 130.084 111.089 127.828 111.089 123.46C111.089 119.092 113.321 116.836 117.329 116.836C120.857 116.836 122.753 118.42 122.753 121.156V121.444H124.601V121.156C124.601 117.508 121.457 115.18 117.305 115.18C112.601 115.18 109.289 118.444 109.289 123.46C109.289 128.476 112.601 131.74 117.305 131.74ZM128.585 131.5V124.18H138.929V131.5H140.633V115.42H138.929V122.62H128.585V115.42H126.881V131.5H128.585Z"
                  fill="white"
                />
                <circle cx="120" cy="110" r="109.5" stroke="#DB574D" />
              </svg>
              <h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight scroll-animate"
                style={{ transitionDelay: "200ms" }}
              >
                <span
                  className={`transition-colors duration-300 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  LET'S WORK{" "}
                </span>
                <span className="text-[#DB574D]">Together</span>
              </h2>
            </div>
          </div>

          <div className="pt-16 border-t border-gray-300">
            <div className="space-y-4 scroll-animate-left text-center">
              <h3 className="text-[#DB574D] text-xl md:text-2xl font-bold">
                Jojo Grønberg
              </h3>
              <p
                className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Photographer & Visual Artist
              </p>
              <div className="space-y-2">
                <div>
                  <p
                    className={`text-sm md:text-sm transition-colors duration-300 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Email
                  </p>
                  <p
                    className={`text-sm md:text-sm transition-colors duration-300 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    hello@jojogronberg.com
                  </p>
                </div>
                <div>
                  <p
                    className={`text-sm md:text-sm transition-colors duration-300 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Phone
                  </p>
                  <p
                    className={`text-sm md:text-sm transition-colors duration-300 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    +1 (555) 123-4567
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 mt-8 border-t border-gray-200 gap-4 scroll-animate">
            <p
              className={`text-xs md:text-sm transition-colors duration-300 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              2025.
            </p>
          </div>
        </div>
      </footer>

      {/* Ticket Purchase Modal */}
      <div
        className={`ticket-modal-overlay ${isTicketModalOpen ? "open" : ""}`}
        onClick={closeTicketModal}
      >
        <div
          className="ticket-modal"
          style={{
            backgroundColor: isDarkMode ? "#1f2937" : "#EEEDEE",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="ticket-modal-close" onClick={closeTicketModal}>
            ×
          </button>

          {selectedExhibition && (
            <>
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 overflow-hidden rounded-lg">
                    <img
                      src={selectedExhibition.image}
                      alt={selectedExhibition.title}
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>
                  <div>
                    <h3
                      className={`text-2xl font-bold mb-1 transition-colors duration-300 ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      {selectedExhibition.title
                        .split(" ")
                        .map((word: string, wordIndex: number) => (
                          <span
                            key={wordIndex}
                            className={
                              word === "Beauty" ||
                              word === "Gallery" ||
                              word === "Vision"
                                ? "text-[#DB574D]"
                                : isDarkMode
                                ? "text-white"
                                : "text-black"
                            }
                          >
                            {word}
                            {wordIndex <
                            selectedExhibition.title.split(" ").length - 1
                              ? " "
                              : ""}
                          </span>
                        ))}
                    </h3>
                    <p
                      className={`text-sm transition-colors duration-300 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {selectedExhibition.location}, {selectedExhibition.year} •{" "}
                      {selectedExhibition.month} {selectedExhibition.day}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleFormSubmit} noValidate>
                <div className="ticket-form-group">
                  <label
                    className="ticket-form-label"
                    style={{
                      color: isDarkMode ? "#e5e7eb" : "#333",
                    }}
                  >
                    Full Name
                  </label>
                  <div className="form-field-wrapper">
                    <input
                      type="text"
                      className={`ticket-form-input ${
                        formErrors.fullName ? "error" : ""
                      }`}
                      style={{
                        backgroundColor: isDarkMode ? "#374151" : "white",
                        color: isDarkMode ? "#e5e7eb" : "#333",
                        borderColor: formErrors.fullName
                          ? "#DB574D"
                          : isDarkMode
                          ? "#4b5563"
                          : "#ddd",
                      }}
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                    />
                    {formErrors.fullName && (
                      <div className="form-error">{formErrors.fullName}</div>
                    )}
                  </div>
                </div>

                <div className="ticket-form-group">
                  <label
                    className="ticket-form-label"
                    style={{
                      color: isDarkMode ? "#e5e7eb" : "#333",
                    }}
                  >
                    Email Address
                  </label>
                  <div className="form-field-wrapper">
                    <input
                      type="email"
                      className={`ticket-form-input ${
                        formErrors.email ? "error" : ""
                      }`}
                      style={{
                        backgroundColor: isDarkMode ? "#374151" : "white",
                        color: isDarkMode ? "#e5e7eb" : "#333",
                        borderColor: formErrors.email
                          ? "#DB574D"
                          : isDarkMode
                          ? "#4b5563"
                          : "#ddd",
                      }}
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                    />
                    {formErrors.email && (
                      <div className="form-error">{formErrors.email}</div>
                    )}
                  </div>
                </div>

                <div className="ticket-form-group">
                  <label
                    className="ticket-form-label"
                    style={{
                      color: isDarkMode ? "#e5e7eb" : "#333",
                    }}
                  >
                    Phone Number
                  </label>
                  <div className="form-field-wrapper">
                    <input
                      type="tel"
                      className={`ticket-form-input ${
                        formErrors.phone ? "error" : ""
                      }`}
                      style={{
                        backgroundColor: isDarkMode ? "#374151" : "white",
                        color: isDarkMode ? "#e5e7eb" : "#333",
                        borderColor: formErrors.phone
                          ? "#DB574D"
                          : isDarkMode
                          ? "#4b5563"
                          : "#ddd",
                      }}
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                    />
                    {formErrors.phone && (
                      <div className="form-error">{formErrors.phone}</div>
                    )}
                  </div>
                </div>

                <div className="ticket-form-group">
                  <label
                    className="ticket-form-label"
                    style={{
                      color: isDarkMode ? "#e5e7eb" : "#333",
                    }}
                  >
                    Quantity
                  </label>
                  <div className="ticket-quantity-controls">
                    <button
                      type="button"
                      className="quantity-btn"
                      style={{
                        backgroundColor: isDarkMode ? "#374151" : "white",
                        color: "#DB574D",
                      }}
                      onClick={() =>
                        setTicketQuantity(Math.max(1, ticketQuantity - 1))
                      }
                    >
                      -
                    </button>
                    <span
                      className="quantity-display"
                      style={{
                        color: isDarkMode ? "#e5e7eb" : "#333",
                      }}
                    >
                      {ticketQuantity}
                    </span>
                    <button
                      type="button"
                      className="quantity-btn"
                      style={{
                        backgroundColor: isDarkMode ? "#374151" : "white",
                        color: "#DB574D",
                      }}
                      onClick={() => setTicketQuantity(ticketQuantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="ticket-total">
                  <div
                    className={`text-lg font-bold mb-2 transition-colors duration-300 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    Order Summary
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className={`transition-colors duration-300 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      General Admission × {ticketQuantity}
                    </span>
                    <span
                      className={`font-bold transition-colors duration-300 ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      ${25 * ticketQuantity}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className={`transition-colors duration-300 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Service Fee
                    </span>
                    <span
                      className={`font-bold transition-colors duration-300 ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      $2.50
                    </span>
                  </div>
                  <hr className="my-3 border-gray-300" />
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-lg font-bold transition-colors duration-300 ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      Total
                    </span>
                    <span className="text-xl font-bold text-[#DB574D]">
                      ${25 * ticketQuantity + 2.5}
                    </span>
                  </div>
                </div>

                <button type="submit" className="ticket-purchase-btn">
                  Purchase Tickets
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div
          className={`ticket-modal-overlay ${isPaymentModalOpen ? "open" : ""}`}
          onClick={closePaymentModal}
        >
          <div
            className="payment-modal"
            style={{
              backgroundColor: isDarkMode ? "#1f2937" : "#EEEDEE",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="ticket-modal-close" onClick={closePaymentModal}>
              ×
            </button>

            <div className="payment-header">
              <h3
                className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                Complete Payment
              </h3>
              <p
                className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Enter your card details to purchase tickets
              </p>
            </div>

            <div className="payment-amount">
              <div
                className={`text-lg font-bold mb-1 transition-colors duration-300 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                Total Amount
              </div>
              <div className="text-2xl font-bold text-[#DB574D]">
                ${25 * ticketQuantity + 2.5}
              </div>
              <div
                className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                General Admission × {ticketQuantity} + Service Fee
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} noValidate>
              <div className="ticket-form-group">
                <label
                  className="ticket-form-label"
                  style={{
                    color: isDarkMode ? "#e5e7eb" : "#333",
                  }}
                >
                  Card Number
                </label>
                <div className="form-field-wrapper">
                  <input
                    type="text"
                    className={`ticket-form-input ${
                      paymentErrors.cardNumber ? "error" : ""
                    }`}
                    style={{
                      backgroundColor: isDarkMode ? "#374151" : "white",
                      color: isDarkMode ? "#e5e7eb" : "#333",
                      borderColor: paymentErrors.cardNumber
                        ? "#DB574D"
                        : isDarkMode
                        ? "#4b5563"
                        : "#ddd",
                    }}
                    placeholder="1234 5678 9012 3456"
                    value={paymentData.cardNumber}
                    onChange={(e) =>
                      handlePaymentInputChange("cardNumber", e.target.value)
                    }
                  />
                  {paymentErrors.cardNumber && (
                    <div className="form-error">{paymentErrors.cardNumber}</div>
                  )}
                </div>
              </div>

              <div className="payment-form-row">
                <div className="ticket-form-group">
                  <label
                    className="ticket-form-label"
                    style={{
                      color: isDarkMode ? "#e5e7eb" : "#333",
                    }}
                  >
                    Expiry Date
                  </label>
                  <div className="form-field-wrapper">
                    <input
                      type="text"
                      className={`ticket-form-input ${
                        paymentErrors.expiryDate ? "error" : ""
                      }`}
                      style={{
                        backgroundColor: isDarkMode ? "#374151" : "white",
                        color: isDarkMode ? "#e5e7eb" : "#333",
                        borderColor: paymentErrors.expiryDate
                          ? "#DB574D"
                          : isDarkMode
                          ? "#4b5563"
                          : "#ddd",
                      }}
                      placeholder="MM/YY"
                      value={paymentData.expiryDate}
                      onChange={(e) =>
                        handlePaymentInputChange("expiryDate", e.target.value)
                      }
                    />
                    {paymentErrors.expiryDate && (
                      <div className="form-error">
                        {paymentErrors.expiryDate}
                      </div>
                    )}
                  </div>
                </div>

                <div className="ticket-form-group">
                  <label
                    className="ticket-form-label"
                    style={{
                      color: isDarkMode ? "#e5e7eb" : "#333",
                    }}
                  >
                    CVV
                  </label>
                  <div className="form-field-wrapper">
                    <input
                      type="text"
                      className={`ticket-form-input ${
                        paymentErrors.cvv ? "error" : ""
                      }`}
                      style={{
                        backgroundColor: isDarkMode ? "#374151" : "white",
                        color: isDarkMode ? "#e5e7eb" : "#333",
                        borderColor: paymentErrors.cvv
                          ? "#DB574D"
                          : isDarkMode
                          ? "#4b5563"
                          : "#ddd",
                      }}
                      placeholder="123"
                      value={paymentData.cvv}
                      onChange={(e) =>
                        handlePaymentInputChange("cvv", e.target.value)
                      }
                    />
                    {paymentErrors.cvv && (
                      <div className="form-error">{paymentErrors.cvv}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="ticket-form-group">
                <label
                  className="ticket-form-label"
                  style={{
                    color: isDarkMode ? "#e5e7eb" : "#333",
                  }}
                >
                  Cardholder Name
                </label>
                <div className="form-field-wrapper">
                  <input
                    type="text"
                    className={`ticket-form-input ${
                      paymentErrors.cardholderName ? "error" : ""
                    }`}
                    style={{
                      backgroundColor: isDarkMode ? "#374151" : "white",
                      color: isDarkMode ? "#e5e7eb" : "#333",
                      borderColor: paymentErrors.cardholderName
                        ? "#DB574D"
                        : isDarkMode
                        ? "#4b5563"
                        : "#ddd",
                    }}
                    placeholder="John Doe"
                    value={paymentData.cardholderName}
                    onChange={(e) =>
                      handlePaymentInputChange("cardholderName", e.target.value)
                    }
                  />
                  {paymentErrors.cardholderName && (
                    <div className="form-error">
                      {paymentErrors.cardholderName}
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className="ticket-purchase-btn">
                <span
                  className="processing-spinner"
                  style={{ display: "none" }}
                ></span>
                Complete Payment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div
          className={`ticket-modal-overlay ${isSuccessModalOpen ? "open" : ""}`}
          onClick={closeSuccessModal}
        >
          <div
            className="success-modal"
            style={{
              backgroundColor: isDarkMode ? "#1f2937" : "#EEEDEE",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="success-icon">
              <span className="success-checkmark">✓</span>
            </div>

            <h3
              className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              Payment Successful!
            </h3>
            <p
              className={`mb-4 transition-colors duration-300 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Your tickets have been purchased successfully.
            </p>

            {selectedExhibition && (
              <div className="success-details">
                <div
                  className={`text-sm mb-2 transition-colors duration-300 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Ticket Details:
                </div>
                <div
                  className={`font-medium mb-1 transition-colors duration-300 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  {selectedExhibition.title}
                </div>
                <div
                  className={`text-sm mb-2 transition-colors duration-300 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {selectedExhibition.location} • {selectedExhibition.month}{" "}
                  {selectedExhibition.day}, {selectedExhibition.year}
                </div>
                <div
                  className={`text-sm mb-1 transition-colors duration-300 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Quantity: {ticketQuantity} ticket
                  {ticketQuantity > 1 ? "s" : ""}
                </div>
                <div className="text-sm font-bold text-[#DB574D]">
                  Total Paid: ${25 * ticketQuantity + 2.5}
                </div>
              </div>
            )}

            <p
              className={`text-sm mb-4 transition-colors duration-300 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              A confirmation email has been sent to {formData.email}
            </p>

            <button className="success-close-btn" onClick={closeSuccessModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
