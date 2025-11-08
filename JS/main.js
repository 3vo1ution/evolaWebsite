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

   // GSAP SCROLLTRIGGER STICKY NAV 
    const navBarSection = document.querySelector('.navBarSection');
    
    if (navBarSection && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Store original styles
        const originalStyles = {
            position: navBarSection.style.position,
            background: navBarSection.style.background,
            padding: navBarSection.style.padding,
            backdropFilter: navBarSection.style.backdropFilter,
            boxShadow: navBarSection.style.boxShadow
        };

        // Create the sticky animation timeline
        const stickyTimeline = gsap.timeline({
            paused: true,
            defaults: { duration: 0.3, ease: "power2.out" }
        });

        stickyTimeline
            .to(navBarSection, {
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                padding: "10px 80px",
                boxShadow: "0 5px 30px rgba(0, 0, 0, 0.1)",
                zIndex: 1000,
                immediateRender: false
            })
            .fromTo(navBarSection, 
                { y: -12 }, 
                { y: 0, duration: 0.4, ease: "power2.out" }, 
                "<"
            );

        // Create ScrollTrigger
        ScrollTrigger.create({
            trigger: "body",
            start: "top -100", // Starts when nav is 100px from top
            end: "max",
            onEnter: () => stickyTimeline.play(),
            onLeaveBack: () => stickyTimeline.reverse(),
            onUpdate: (self) => {
                // Optional: Add progress-based effects
                if (self.progress > 0.1) {
                    gsap.to(navBarSection, {
                        scale: 0.95,
                        duration: 0.2
                    });
                } else {
                    gsap.to(navBarSection, {
                        scale: 1,
                        duration: 0.2
                    });
                }
            }
        });

        // Handle responsive adjustments
        const handleResize = () => {
            ScrollTrigger.refresh();
        };

        window.addEventListener('resize', handleResize);

        // Cleanup function (optional)
        const cleanupStickyNav = () => {
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.trigger === "body") {
                    trigger.kill();
                }
            });
            stickyTimeline.kill();
            window.removeEventListener('resize', handleResize);
            
            // Restore original styles
            gsap.set(navBarSection, originalStyles);
        };

        // Optional: Expose cleanup for use elsewhere
        window.cleanupStickyNav = cleanupStickyNav;

    } else if (navBarSection) {
        console.warn('GSAP or ScrollTrigger not loaded - falling back to basic sticky nav');
        
        // Fallback basic sticky nav
        let lastScrollY = window.scrollY;
        
        const updateNav = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                navBarSection.style.position = 'fixed';
                navBarSection.style.top = '0';
                navBarSection.style.left = '0';
                navBarSection.style.right = '0';
                navBarSection.style.background = 'rgba(255, 255, 255, 0.95)';
                navBarSection.style.backdropFilter = 'blur(10px)';
                navBarSection.style.padding = '10px 80px';
                navBarSection.style.zIndex = '1000';
                navBarSection.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navBarSection.style.position = 'relative';
                navBarSection.style.background = 'transparent';
                navBarSection.style.backdropFilter = 'none';
                navBarSection.style.padding = '20px 0';
                navBarSection.style.boxShadow = 'none';
            }
            
            lastScrollY = currentScrollY;
        };
        
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateNav();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        updateNav();
        window.addEventListener('scroll', onScroll);
    }

  

});

