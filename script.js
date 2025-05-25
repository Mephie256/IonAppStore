// Modern APK Store JavaScript

document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS animation library with enhanced settings
  AOS.init({
    duration: 800,
    once: false,
    mirror: true,
    offset: 50,
    easing: 'ease-out-cubic',
    delay: 100,
    anchorPlacement: 'top-bottom'
  });
  
  // Initialize the app
  initializeApp();
  
  // Add subtle hover effects to app cards
  const appCards = document.querySelectorAll('.app-card');
  appCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
  });
});

function initializeApp() {
  // Setup search functionality
  setupSearch();
  
  // Setup category filters
  setupCategoryFilters();
  
  // Add rating stars functionality
  setupRatingStars();
}

function setupSearch() {
  const searchInput = document.getElementById('app-search');
  if (!searchInput) return;
  
  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const appCards = document.querySelectorAll('.app-card');
    
    appCards.forEach(card => {
      const appName = card.querySelector('h3').textContent.toLowerCase();
      const appDescription = card.querySelector('.app-description')?.textContent.toLowerCase() || '';
      const appCategory = card.querySelector('.app-category')?.textContent.toLowerCase() || '';
      
      const isVisible = 
        appName.includes(searchTerm) || 
        appDescription.includes(searchTerm) || 
        appCategory.includes(searchTerm);
      
      card.style.display = isVisible ? 'flex' : 'none';
    });
  });
}

function setupCategoryFilters() {
  const categoryButtons = document.querySelectorAll('.category-btn');
  if (categoryButtons.length === 0) return;
  
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active state
      if (button.classList.contains('active') && button.dataset.category === 'all') {
        return; // Don't deactivate 'All' if it's already active
      }
      
      if (button.dataset.category === 'all') {
        // If 'All' is clicked, deactivate all other buttons
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
      } else {
        // If a specific category is clicked
        const allButton = document.querySelector('.category-btn[data-category="all"]');
        allButton.classList.remove('active');
        button.classList.toggle('active');
      }
      
      // Filter the apps
      filterAppsByCategory();
    });
  });
}

function filterAppsByCategory() {
  const activeCategories = Array.from(
    document.querySelectorAll('.category-btn.active')
  ).map(button => button.dataset.category);
  
  const showAll = activeCategories.includes('all') || activeCategories.length === 0;
  const appCards = document.querySelectorAll('.app-card');
  
  appCards.forEach(card => {
    const cardCategory = card.dataset.category;
    const isVisible = showAll || activeCategories.includes(cardCategory);
    
    if (isVisible) {
      card.style.display = 'flex';
      // Add a small animation when cards become visible
      card.classList.add('scale-in');
      setTimeout(() => card.classList.remove('scale-in'), 500);
    } else {
      card.style.display = 'none';
    }
  });
}

function setupRatingStars() {
  const ratingElements = document.querySelectorAll('.app-rating');
  
  ratingElements.forEach(element => {
    const ratingValue = parseFloat(element.dataset.rating) || 0;
    element.innerHTML = ''; // Clear any existing content
    const starsContainer = document.createElement('div');
    starsContainer.classList.add('stars-container');
    
    // Create a more modern star rating display
    // First create the filled stars background
    const starsBackground = document.createElement('div');
    starsBackground.classList.add('stars-background');
    starsBackground.style.width = '80px';
    starsBackground.style.position = 'relative';
    starsBackground.innerHTML = '★★★★★';
    starsBackground.style.color = 'rgba(0,0,0,0.15)';
    starsBackground.style.letterSpacing = '2px';
    
    // Then create the filled stars based on rating
    const filledStars = document.createElement('div');
    filledStars.classList.add('stars-filled');
    filledStars.style.position = 'absolute';
    filledStars.style.top = '0';
    filledStars.style.left = '0';
    filledStars.style.width = `${(ratingValue / 5) * 100}%`;
    filledStars.style.overflow = 'hidden';
    filledStars.style.whiteSpace = 'nowrap';
    filledStars.innerHTML = '★★★★★';
    filledStars.style.color = '#ffc107';
    filledStars.style.letterSpacing = '2px';
    
    starsBackground.appendChild(filledStars);
    starsContainer.appendChild(starsBackground);
    
    // Add the rating value with a modern style
    const ratingText = document.createElement('span');
    ratingText.textContent = ` ${ratingValue.toFixed(1)}`;
    ratingText.style.fontWeight = '600';
    ratingText.style.marginLeft = '8px';
    starsContainer.appendChild(ratingText);
    
    // Replace the content
    element.innerHTML = '';
    element.appendChild(starsContainer);
  });
}

// Helper function to add new app cards dynamically
function addAppCard(app) {
  const appGrid = document.querySelector('.app-grid');
  if (!appGrid) return;
  
  const card = document.createElement('div');
  card.className = 'app-card animate__animated animate__fadeInUp';
  card.setAttribute('data-aos', 'zoom-in');
  card.setAttribute('data-category', app.category);
  
  card.innerHTML = `
    <div class="app-card-header">
      <img src="${app.icon}" alt="${app.name}" class="app-icon">
      <div class="app-info">
        <h3>${app.name}</h3>
        <div class="app-category">${app.category}</div>
      </div>
    </div>
    <div class="app-card-body">
      <p class="app-description">${app.description}</p>
      <div class="app-meta">
        <div class="app-rating" data-rating="${app.rating}"></div>
        <div class="app-size">${app.size}</div>
      </div>
      <a href="${app.downloadUrl}" download class="btn">Download</a>
    </div>
  `;
  
  appGrid.appendChild(card);
  setupRatingStars(); // Refresh the rating stars
}