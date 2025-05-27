/**
 * Animations for Multigrafo Bus Routes
 * Handles various animations and transitions for UI elements
 */

// Set CSS variable for primary color RGB for animations
document.documentElement.style.setProperty('--primary-rgb', '53, 103, 177');

/**
 * Add floating animation to elements
 */
function setupFloatingAnimations() {
  // Add floating animation to the logo
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.classList.add('float');
  }
}

/**
 * Add pulse animation to elements that need attention
 */
function setupPulseAnimations() {
  // Pulse the add buttons after delay
  setTimeout(() => {
    const addButtons = document.querySelectorAll('.btn-primary');
    addButtons.forEach(button => {
      button.classList.add('pulse');
      
      // Remove pulse after animation completes
      setTimeout(() => {
        button.classList.remove('pulse');
      }, 3000);
    });
  }, 2000);
}

/**
 * Add card hover effects
 */
function setupCardEffects() {
  // Add hover effect to route cards
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('.route-card')) {
      const card = e.target.closest('.route-card');
      const arrow = card.querySelector('.route-arrow');
      
      if (arrow) {
        arrow.style.color = 'var(--accent-dark)';
        arrow.style.transform = 'translateX(3px)';
        arrow.style.transition = 'all var(--transition-fast)';
      }
    }
  });
  
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('.route-card')) {
      const card = e.target.closest('.route-card');
      const arrow = card.querySelector('.route-arrow');
      
      if (arrow) {
        arrow.style.color = 'var(--accent-color)';
        arrow.style.transform = 'translateX(0)';
      }
    }
  });
}

/**
 * Animate route prices for emphasis
 */
function setupPriceAnimation() {
  // Animate price when routes are rendered
  document.addEventListener('DOMNodeInserted', (e) => {
    if (e.target.classList && e.target.classList.contains('route-card')) {
      const priceElement = e.target.querySelector('.route-price');
      
      if (priceElement) {
        priceElement.style.transform = 'scale(1.1)';
        priceElement.style.transition = 'transform var(--transition-fast)';
        
        setTimeout(() => {
          priceElement.style.transform = 'scale(1)';
        }, 300);
      }
    }
  });
}

/**
 * Add loading animation to simulate route finding
 */
function setupLoadingAnimation() {
  // Add loading effect when filters change
  const filters = document.querySelectorAll('#filter-origin, #filter-destination, #filter-company');
  
  filters.forEach(filter => {
    filter.addEventListener('change', () => {
      const routesContainer = document.getElementById('routes-container');
      
      // Add loading class
      routesContainer.classList.add('route-loading');
      
      // Remove after animation completes
      setTimeout(() => {
        routesContainer.classList.remove('route-loading');
      }, 1000);
    });
  });
}

/**
 * Add scroll animations
 */
function setupScrollAnimations() {
  // Add scroll animation to show sections
  const sections = document.querySelectorAll('section');
  
  // Function to check if element is in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom >= 0
    );
  }
  
  // Function to handle scroll
  function handleScroll() {
    sections.forEach(section => {
      if (isInViewport(section) && !section.classList.contains('visible')) {
        section.classList.add('visible');
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
      }
    });
  }
  
  // Set initial state
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  
  // Add scroll event listener
  window.addEventListener('scroll', handleScroll);
  
  // Trigger once on load
  setTimeout(handleScroll, 100);
}

/**
 * Initialize all animations
 */
function initAnimations() {
  setupFloatingAnimations();
  setupPulseAnimations();
  setupCardEffects();
  setupPriceAnimation();
  setupLoadingAnimation();
  setupScrollAnimations();
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', initAnimations);