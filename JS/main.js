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

// Loading Screen - waits for everything to load
window.addEventListener('load', function() {
  const loadingScreen = document.getElementById('loadingScreen');
  const images = document.images;
  const totalImages = images.length;
  let imagesLoaded = 0;

  // If no images, remove immediately
  if (totalImages === 0) {
    removeLoadingScreen(loadingScreen);
    return;
  }

  // Check each image load
  for (let i = 0; i < totalImages; i++) {
    const img = images[i];
    
    if (img.complete) {
      imagesLoaded++;
    } else {
      img.addEventListener('load', imageLoaded);
      img.addEventListener('error', imageLoaded); // Count errors as loaded too
    }
  }

  // Also set a maximum timeout (5 seconds)
  const maxWaitTime = setTimeout(() => {
    removeLoadingScreen(loadingScreen);
  }, 5000);

  function imageLoaded() {
    imagesLoaded++;
    
    // When all images are loaded, remove loading screen
    if (imagesLoaded >= totalImages) {
      clearTimeout(maxWaitTime);
      removeLoadingScreen(loadingScreen);
    }
  }

  function removeLoadingScreen(loadingScreen) {
    loadingScreen.classList.add('fadeOut');
    setTimeout(() => {
      loadingScreen.remove();
    }, 500);
  }
});

});

 