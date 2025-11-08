
document.addEventListener('DOMContentLoaded', function () {

  let landingContent = document.querySelector('.landingContent');
  let highlightsSection = document.querySelector('.highlightsSection'); //Hiii change 
  let landingHeading = document.querySelector('.bigHeading')
  
  if (!landingContent || !highlightsSection) return;

  // How close the highlights top should be to the viewport top before change
  let triggerOffset = 400;
  let bufferZone = 5;

  let ticking = false;
  let stopped = false;

  function check() {
    ticking = false;
    let rect = highlightsSection.getBoundingClientRect();
    let top = rect.top;



 if (!stopped && top <= triggerOffset) {
      

    gsap.to(landingContent, {
    opacity: 0,
    duration: 0.5,
    ease: "expo.out",
    //overwrite: true,
    onComplete: () => {
    landingContent.style.pointerEvents = 'none';
    stopped = true;  }
       });


    } else if (stopped && top > (triggerOffset + bufferZone)) { 
      
     landingContent.style.pointerEvents = '';
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

  function onResize() {
    if (!stopped) return;
    let landingRect = landingContent.getBoundingClientRect();
    let absoluteTop = window.scrollY + landingRect.top;
    landingContent.style.setProperty('--landing-stop-top', absoluteTop + 'px');
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  // initial check in case page already scrolled
  check();

  (function () {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.warn("GSAP/ScrollTrigger not found — heading shrink disabled.");
    return;
  }



  //ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  const bigHeading = document.querySelector('.bigHeading');
  const navCentre = document.querySelector('.navCentre');  
  if (!bigHeading || !navCentre) return;

  //Timeline
  let headingTl;
  function buildHeadingShrink() {

    if (headingTl) {
      headingTl.scrollTrigger.kill();
      headingTl.kill();
      headingTl = null;
    }

    const startRect = bigHeading.getBoundingClientRect();
    const endRect = navCentre.getBoundingClientRect();

    const startCenter = {
      x: startRect.left + startRect.width / 2,
      y: startRect.top + startRect.height / 2
    };

    const endCenter = {
      x: endRect.left + endRect.width / 2,
      y: endRect.top + endRect.height / 2
    };

    const deltaX = endCenter.x - startCenter.x;
    const deltaY = endCenter.y - startCenter.y;
    
    const targetScale = Math.max(Math.min((endRect.width / startRect.width) * 0.9, 1), 0.25);

    const fixedTop = startRect.top + window.scrollY; 
    const fixedLeft = startRect.left + window.scrollX; 

    gsap.set(bigHeading, {
      position: "fixed",
      top: fixedTop + "px",
      left: fixedLeft + "px",
      width: startRect.width + "px",
      height: startRect.height + "px",
      margin: 0,
      zIndex: 2000,
      transformOrigin: "center center",
      willChange: "transform, opacity"
    });

      headingTl = gsap.timeline({
      scrollTrigger: {
        trigger: document.querySelector('.highlightsSection') || document.body,
      
        // start when highlights top (triggerOffset)
        start: `top ${500}px`,
        end: `+=200`,
        scrub: 0.6,
        // markers: true,
        onEnter: () => { },
        onLeaveBack: () => {  }
      }
    });

    headingTl.to(bigHeading, {
      x: deltaX,
      y: deltaY,
      scale: targetScale,
      ease: "none"
    }, 0);

    
    headingTl.to(bigHeading, { opacity: 0.95 }, 0);

    // onKill / when scrolling back past it restores original inline styles
    headingTl.scrollTrigger._onKill = () => {
      restoreHeading();
    };
    headingTl.scrollTrigger.addEventListener("leaveBack", restoreHeading);
  }

  // Normalize and restore function
  function restoreHeading() {
    if (!bigHeading) return;
    // remove the inline styles added
    bigHeading.style.position = "";
    bigHeading.style.top = "";
    bigHeading.style.left = "";
    bigHeading.style.width = "";
    bigHeading.style.height = "";
    bigHeading.style.margin = "";
    bigHeading.style.zIndex = "";
    bigHeading.style.transformOrigin = "";
    bigHeading.style.willChange = "";
    // clear transform/opacity (so it returns to CSS-defined state)
    gsap.set(bigHeading, { clearProps: "transform, x, y, scale, opacity" });
    // kill existing timeline/trigger if present
    if (headingTl) {
      try { headingTl.scrollTrigger.kill(); } catch(e){}
      try { headingTl.kill(); } catch(e){}
      headingTl = null;
    }
  }

  buildHeadingShrink();

  let resizeTO;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTO);
    resizeTO = setTimeout(() => {
      // restore first (so getBoundingClientRect is correct), then rebuild
      restoreHeading();
      buildHeadingShrink();
      ScrollTrigger.refresh();
    }, 150);
  });

})();
});