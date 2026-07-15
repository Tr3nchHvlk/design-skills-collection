
    // Scroll Reveal with Intersection Observer
    const revealElements = document.querySelectorAll('.reveal, .reveal-scale');

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Feature cards staggered reveal
    const featureCards = document.querySelectorAll('.feature-card');
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 80);
        }
      });
    }, { threshold: 0.2 });

    featureCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(40px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      cardObserver.observe(card);
    });

    // Stat cards staggered reveal
    const statCards = document.querySelectorAll('.stat-card');
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
        }
      });
    }, { threshold: 0.2 });

    statCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      statObserver.observe(card);
    });

    // CTA card reveal
    const ctaCard = document.querySelector('.cta-card');
    if (ctaCard) {
      const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'scale(1)';
          }
        });
      }, { threshold: 0.2 });

      ctaCard.style.opacity = '0';
      ctaCard.style.transform = 'scale(0.95)';
      ctaCard.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      ctaObserver.observe(ctaCard);
    }
  