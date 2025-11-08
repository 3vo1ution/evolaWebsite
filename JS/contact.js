document.addEventListener('DOMContentLoaded', function () {
  console.log('✅ DOM Loaded - checking elements...');
  
  // Debug: Check if elements exist
  const landingContent = document.querySelector('.landingContent');
  const contactUsSection = document.querySelector('.contactUsSection');
  const bigHeading = document.querySelector('.bigHeading');
  const navCentre = document.querySelector('.navCentre');
  
  console.log('Elements found:', {
    landingContent: !!landingContent,
    contactUsSection: !!contactUsSection,
    bigHeading: !!bigHeading,
    navCentre: !!navCentre
  });

  // If any critical elements are missing, stop here
  if (!landingContent || !contactUsSection) {
    console.error('❌ Missing landingContent or contactUsSection');
    return;
  }

  // Landing fade animation
  let triggerOffset = 800;
  let bufferZone = 5;
  let ticking = false;
  let stopped = false;

  function check() {
    ticking = false;
    let rect = contactUsSection.getBoundingClientRect();
    let top = rect.top;

    if (!stopped && top <= triggerOffset) {
      gsap.to(landingContent, {
        opacity: 0,
        duration: 0.5,
        ease: "expo.out",
        onComplete: () => {
          landingContent.style.pointerEvents = 'none';
          stopped = true;
        }
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

  window.addEventListener('scroll', onScroll, { passive: true });
  check();

  // Heading shrink animation (only if elements exist)
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && bigHeading && navCentre) {
    gsap.registerPlugin(ScrollTrigger);
    
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
          trigger: document.querySelector('.contactUsSection') || document.body,
          start: `top ${300}px`,
          end: `+=200`,
          scrub: 0.6
        }
      });

      headingTl.to(bigHeading, {
        x: deltaX,
        y: deltaY,
        scale: targetScale,
        ease: "none"
      }, 0);

      headingTl.to(bigHeading, { opacity: 0.95 }, 0);

      function restoreHeading() {
        if (!bigHeading) return;
        bigHeading.style.position = "";
        bigHeading.style.top = "";
        bigHeading.style.left = "";
        bigHeading.style.width = "";
        bigHeading.style.height = "";
        bigHeading.style.margin = "";
        bigHeading.style.zIndex = "";
        bigHeading.style.transformOrigin = "";
        bigHeading.style.willChange = "";
        gsap.set(bigHeading, { clearProps: "transform, x, y, scale, opacity" });
        if (headingTl) {
          try { headingTl.scrollTrigger.kill(); } catch(e){}
          try { headingTl.kill(); } catch(e){}
          headingTl = null;
        }
      }

      headingTl.scrollTrigger._onKill = restoreHeading;
headingTl = gsap.timeline({
    scrollTrigger: {
        trigger: document.querySelector('.contactUsSection') || document.body,
        start: `top ${300}px`,
        end: `+=200`,
        scrub: 0.6,
        onLeaveBack: restoreHeading  // ✅ Fixed: use callback instead of addEventListener
    }
});

headingTl.to(bigHeading, {
    x: deltaX,
    y: deltaY,
    scale: targetScale,
    ease: "none"
}, 0);    }

    buildHeadingShrink();

    let resizeTO;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTO);
      resizeTO = setTimeout(() => {
        
        if (bigHeading) {
          bigHeading.style.position = "";
          bigHeading.style.top = "";
          bigHeading.style.left = "";
          bigHeading.style.width = "";
          bigHeading.style.height = "";
          bigHeading.style.margin = "";
          bigHeading.style.zIndex = "";
          bigHeading.style.transformOrigin = "";
          bigHeading.style.willChange = "";
          gsap.set(bigHeading, { clearProps: "transform, x, y, scale, opacity" });
        }
        if (headingTl) {
          try { headingTl.scrollTrigger.kill(); } catch(e){}
          try { headingTl.kill(); } catch(e){}
          headingTl = null;
        }
        buildHeadingShrink();
        ScrollTrigger.refresh();
      }, 150);
    });
  } else {
    console.log('❌ Heading animation skipped - missing elements or GSAP');
  }



    // contact form and all that 
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const status = document.getElementById('formStatus');

  const fields = {
    fullName: {el: document.getElementById('fullName'), required: true, validator: v => v.trim().length >= 2},
    company: {el: document.getElementById('company'), required: false, validator: () => true},
    email: {el: document.getElementById('email'), required: true, validator: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)},
    phone: {el: document.getElementById('phone'), required: false, validator: v => v.trim() === '' || /^\+?[0-9\s\-()]{6,20}$/.test(v)},
    reason: {el: document.getElementById('reason'), required: false, validator: () => true},
    message: {el: document.getElementById('message'), required: false, validator: () => true}
  };

  function setFieldState(name, valid, message = '') {
    const field = fields[name];
    const input = field.el;
    const errorEl = document.getElementById(name + 'Error');
    if (valid) {
      input.classList.remove('inputInvalid');
      input.classList.add('inputValid');
      errorEl.textContent = '';
    } else {
      input.classList.remove('inputValid');
      input.classList.add('inputInvalid');
      errorEl.textContent = message;
    }
  }

  function validateAll() {
    let allValid = true;
    Object.keys(fields).forEach(name => {
      const field = fields[name];
      const value = field.el.value;
      const ok = field.validator(value);
      if (field.required && !ok) {
        allValid = false;
        setFieldState(name, false, name === 'email' ? 'Please enter a valid email.' : 'Please fill out this field.');
      } else {
        setFieldState(name, ok, ok ? '' : 'Invalid value.');
      }
    });
    return allValid;
  }

  Object.keys(fields).forEach(name => {
    const field = fields[name];
    field.el.addEventListener('input', () => {
      const ok = field.validator(field.el.value);
      if (field.required) {
        setFieldState(name, ok, ok ? '' : 'Please provide a valid value.');
      } else {
        setFieldState(name, ok, ok ? '' : 'Invalid value.');
      }
      submitBtn.disabled = !validateAll();
      status.textContent = '';
    });
  });

  // EmailJS integration 
  const EMAILJS_SERVICE_ID = 'service_92sse1i';       
  const EMAILJS_TEMPLATE_OWNER = 'template_3cw19fd'; 
  const EMAILJS_TEMPLATE_CONFIRM = 'template_l34qn18'; 

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = validateAll();
    if (!ok) {
      status.textContent = 'Please correct the highlighted fields.';
      status.style.color = '#c0392b';
      return;
    }

    const templateParams = {
      full_name: fields.fullName.el.value.trim(),
      company: fields.company.el.value.trim(),
      user_email: fields.email.el.value.trim(),
      phone: fields.phone.el.value.trim(),
      reason: fields.reason.el.value.trim(),
      message: fields.message.el.value.trim(),
    };

    submitBtn.disabled = true;
    status.textContent = 'Sending…';
    status.style.color = '#444';


    //  send email to owner
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_OWNER, templateParams)
      .then(() => {
        //  after owner email succeeds, send confirmation to the user
        return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_CONFIRM, templateParams);
      })
      .then(() => {
        form.reset();
        Object.keys(fields).forEach(name => {
          fields[name].el.classList.remove('inputValid', 'inputInvalid');
          const err = document.getElementById(name + 'Error');
          if (err) err.textContent = '';
        });
        submitBtn.disabled = true;
        status.textContent = 'Message sent — thank you! A confirmation email has been sent to you.';
        status.style.color = '#2ecc71';
      })

      .catch((err) => {
        // handle any error from either send
        console.error('EmailJS error:', err);
        status.textContent = 'Sorry — something went wrong when sending. Please try again later.';
        status.style.color = '#c0392b';
        submitBtn.disabled = false; // allow retry
      });
  });

  submitBtn.disabled = true;
});
