
    // Scroll Reveal with Intersection Observer
    const revealElements = document.querySelectorAll('.reveal, .reveal-3d');

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

    // Product cards with 3D reveal
    const productCards = document.querySelectorAll('.product-card');
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) rotateX(0deg)';
          }, index * 120);
        }
      });
    }, { threshold: 0.15 });

    productCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(50px) rotateX(10deg)';
      card.style.transition = 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
      cardObserver.observe(card);
    });

    // Material cards reveal
    const materialCards = document.querySelectorAll('.material-card');
    const materialObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'scale(1)';
          }, index * 100);
        }
      });
    }, { threshold: 0.2 });

    materialCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.9)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      materialObserver.observe(card);
    });
  