function toggleNav() {
    document.getElementById('navLinks').classList.toggle('open');
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  function trackEvent(eventName, payload = {}) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...payload, timestamp: Date.now() });

    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, payload);
    }
  }

  document.querySelectorAll('[data-track]').forEach((el) => {
    el.addEventListener('click', () => {
      trackEvent('cta_click', {
        label: el.dataset.track,
        text: (el.textContent || '').trim()
      });
    });
  });

  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && submitBtn && formStatus) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      formStatus.className = 'form-status';
      formStatus.textContent = 'Sending your enquiry...';
      submitBtn.disabled = true;

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
          throw new Error('Request failed');
        }

        trackEvent('lead_submit_success', { source: 'contact_form' });
        formStatus.className = 'form-status success';
        formStatus.textContent = 'Thanks! Your message was sent. I will reply within 24 hours.';
        contactForm.reset();
      } catch (error) {
        trackEvent('lead_submit_error', { source: 'contact_form' });
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Something went wrong. Please try again or email me directly at mowebsiteco@gmail.com.';
      } finally {
        submitBtn.disabled = false;
      }
    });
  }
