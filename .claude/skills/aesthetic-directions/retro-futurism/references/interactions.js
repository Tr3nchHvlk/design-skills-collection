
    // Scroll Reveal with Intersection Observer
    const revealElements = document.querySelectorAll('.reveal, .reveal-glitch');

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
            entry.target.style.transform = 'translateX(0)';
          }, index * 80);
        }
      });
    }, { threshold: 0.15 });

    featureCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateX(-30px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      cardObserver.observe(card);
    });

    // Terminal reveal
    const terminal = document.querySelector('.terminal');
    if (terminal) {
      const terminalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      }, { threshold: 0.2 });

      terminal.style.opacity = '0';
      terminal.style.transform = 'translateY(40px)';
      terminal.style.transition = 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
      terminalObserver.observe(terminal);
    }
  