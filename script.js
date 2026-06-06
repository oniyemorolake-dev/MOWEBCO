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

  function bindAjaxForm(config) {
    const form = document.getElementById(config.formId);
    const button = document.getElementById(config.buttonId);
    const status = document.getElementById(config.statusId);

    if (!form || !button || !status) {
      return;
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      status.className = 'form-status';
      status.textContent = config.loadingText;
      button.disabled = true;

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
          throw new Error('Request failed');
        }

        trackEvent(config.successEvent, { source: config.source });
        status.className = 'form-status success';
        status.textContent = config.successText;
        form.reset();
      } catch (error) {
        trackEvent(config.errorEvent, { source: config.source });
        status.className = 'form-status error';
        status.textContent = config.errorText;
      } finally {
        button.disabled = false;
      }
    });
  }

  bindAjaxForm({
    formId: 'contactForm',
    buttonId: 'submitBtn',
    statusId: 'formStatus',
    loadingText: 'Sending your enquiry...',
    successText: 'Thanks! Your message was sent. I will reply within 24 hours.',
    errorText: 'Something went wrong. Please try again or email me directly at mowebsiteco@gmail.com.',
    successEvent: 'lead_submit_success',
    errorEvent: 'lead_submit_error',
    source: 'contact_form'
  });

  bindAjaxForm({
    formId: 'projectRequirementsForm',
    buttonId: 'projectSubmitBtn',
    statusId: 'projectFormStatus',
    loadingText: 'Sending your project requirements...',
    successText: 'Thank you! Morolake will review your requirements and get back to you within 24 hours. 🦋',
    errorText: 'Something went wrong. Please try again or email me directly at mowebsiteco@gmail.com.',
    successEvent: 'project_requirements_submit_success',
    errorEvent: 'project_requirements_submit_error',
    source: 'project_requirements_form'
  });
