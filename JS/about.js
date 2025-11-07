document.addEventListener('DOMContentLoaded', function () {
  // SCROLLDOWN
  let landingContent = document.querySelector('.landingContent');
  let ourStorySection = document.querySelector('.recentProjectSection');
  let landingHeading = document.querySelector('.bigHeading');
  
  if (!landingContent || !ourStorySection) {
    console.log('Missing elements:', {
      landingContent: !!landingContent,
      recentProjectSection: !!ourStorySection
    });
    return;
  }

  // How close the section top should be to the viewport top before stopping (px)
  let triggerOffset = 70;
  let bufferZone = 20;

  let ticking = false;
  let stopped = false;

  function check() {
    ticking = false;
    let rect = ourStorySection.getBoundingClientRect();
    let top = rect.top;

    if (!stopped && top <= triggerOffset) {
      gsap.to(landingContent, {
        opacity: 0,
        duration: 0.5, // Fixed: was 0. (invalid)
        ease: "sine.inOut",
        overwrite: true
      });
      
      // compute page absolute top to pin landing in place
      let landingRect = landingContent.getBoundingClientRect();
      let absoluteTop = window.scrollY + landingRect.top;

      // expose value to CSS via custom property then add class
      landingContent.style.setProperty('--landing-stop-top', absoluteTop + 'px');
      landingContent.classList.add('landing-stopped');
      stopped = true;

    } else if (stopped && top > (triggerOffset + bufferZone)) { 
      landingContent.classList.remove('landing-stopped');
      landingContent.style.removeProperty('--landing-stop-top');
      stopped = false;

      gsap.to(landingContent, {
        opacity: 1,
        duration: 1.5, 
        ease: "expo.out"
      });
    }
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(check);
      ticking = true;
    }
  }

  // recompute anchored position if window is resized while stopped
  function onResize() {
    if (!stopped) return;
    // recalc and update --landing-stop-top so anchored position is stable
    let landingRect = landingContent.getBoundingClientRect();
    let absoluteTop = window.scrollY + landingRect.top;
    landingContent.style.setProperty('--landing-stop-top', absoluteTop + 'px');
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  
  // initial check in case page already scrolled
  check();
});