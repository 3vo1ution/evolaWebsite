document.addEventListener('DOMContentLoaded', () => {

// Navigation
  const hamburger = document.querySelector('.hamburgerMenu');
  const navLinks = document.querySelector('.navLinks');

  
  console.log('Hamburger found:', hamburger); 
  console.log('NavLinks found:', navLinks); 
  
  if (!hamburger || !navLinks) return;

  if (!hamburger || !navLinks) {
  console.log('Missing elements - stopping'); // ADD THIS
  return;
  }

  

  // Remove any existing overlay to prevent issues
  const existingOverlay = document.querySelector('.navOverlay');
  if (existingOverlay) {
    existingOverlay.remove();
  }

  const toggleMenu = () => {
    const isOpen = navLinks.classList.contains('open');
    
    if (isOpen) {
   
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.documentElement.style.overflow = '';
    } else {
 
      navLinks.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.documentElement.style.overflow = 'hidden';
    }
  };

  // Hamburger click
  hamburger.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMenu();
  });

  // Close menu when a nav link is clicked
  navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      toggleMenu();
    }
  });

  // Close menu with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      toggleMenu();
    }
  });

  // Close menu when clicking outside the sidebar
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') && 
        !navLinks.contains(e.target) && 
        e.target !== hamburger && 
        !hamburger.contains(e.target)) {
      toggleMenu();
    }
  });

  

});

