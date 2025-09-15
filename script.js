// Ion App Store 2.0 - Advanced JavaScript
// Enhanced features: Dark mode, user accounts, advanced search, social features, and more

// Global state management
const AppStore = {
  darkMode: localStorage.getItem('darkMode') === 'true',
  searchHistory: JSON.parse(localStorage.getItem('searchHistory') || '[]'),
  downloadHistory: JSON.parse(localStorage.getItem('downloadHistory') || '[]'),
  apps: [],
  filteredApps: [],
  currentView: 'grid',
  currentSort: 'featured',
  currentFilters: {
    category: 'all',
    rating: 'all',
    size: 'all'
  },
  featuredApps: [],
  trendingApps: []
};

// Wait for the DOM to be fully loaded
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
  addCardAnimations();
});

function initializeApp() {
  // Setup theme
  setupTheme();
  
  // Setup navigation
  setupNavigation();
  
  // Setup mobile optimizations
  setupMobileOptimizations();
  
  // Setup search functionality
  setupEnhancedSearch();
  
  // Setup category filters
  setupCategoryFilters();
  
  // Setup advanced filters
  setupAdvancedFilters();
  
  // Setup view options
  setupViewOptions();
  
  // Setup modals
  setupModals();
  
  // Setup app interactions
  setupAppInteractions();
  
  // Load and display apps
  loadApps();
  
  // Setup rating stars
  setupRatingStars();
  
  // Setup social features
  setupSocialFeatures();
  
  // Setup update notifications
  setupUpdateNotifications();
  
  // Setup admin panel (hidden feature)
  setupAdminPanel();
}

// Theme Management
function setupTheme() {
  const themeToggle = document.querySelector('.theme-toggle');
  const body = document.body;
  
  // Apply saved theme
  if (AppStore.darkMode) {
    document.documentElement.setAttribute('data-theme', 'dark');
    body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
  
  themeToggle.addEventListener('click', () => {
    AppStore.darkMode = !AppStore.darkMode;
    
    if (AppStore.darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      body.classList.add('dark-mode');
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      document.documentElement.removeAttribute('data-theme');
      body.classList.remove('dark-mode');
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    localStorage.setItem('darkMode', AppStore.darkMode);
  });
}

// Mobile Optimizations
function setupMobileOptimizations() {
  // Detect touch device
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  
  if (isTouchDevice) {
    document.body.classList.add('touch-device');
    
    // Improve scroll performance on mobile
    if ('scrollBehavior' in document.documentElement.style) {
      document.documentElement.style.scrollBehavior = 'smooth';
    }
    
    // Add touch feedback to interactive elements
    addTouchFeedback();
    
    // Optimize category filter scrolling
    optimizeCategoryScroll();
    
    // Handle orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        // Refresh layout after orientation change
        window.dispatchEvent(new Event('resize'));
        
        // Re-setup any layout-dependent features
        setupRatingStars();
      }, 100);
    });
    
    // Prevent zoom on double tap for better UX
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
  }
  
  // Optimize for mobile viewport
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
  }
}

function addTouchFeedback() {
  // Add haptic feedback on supported devices
  const addHapticFeedback = (element) => {
    element.addEventListener('touchstart', () => {
      if (navigator.vibrate) {
        navigator.vibrate(10); // Very short vibration
      }
    });
  };
  
  // Add to interactive elements
  document.querySelectorAll('.btn, .category-btn, .action-btn, .app-card').forEach(addHapticFeedback);
  
  // Add visual touch feedback
  document.addEventListener('touchstart', (e) => {
    if (e.target.classList.contains('btn') || 
        e.target.classList.contains('category-btn') ||
        e.target.classList.contains('action-btn')) {
      e.target.style.transform = 'scale(0.95)';
      e.target.style.transition = 'transform 0.1s ease';
    }
  });
  
  document.addEventListener('touchend', (e) => {
    if (e.target.classList.contains('btn') || 
        e.target.classList.contains('category-btn') ||
        e.target.classList.contains('action-btn')) {
      setTimeout(() => {
        e.target.style.transform = '';
      }, 100);
    }
  });
}

function optimizeCategoryScroll() {
  const categoryFilters = document.querySelector('.category-filters');
  if (!categoryFilters) return;
  
  let isScrolling = false;
  
  categoryFilters.addEventListener('touchstart', () => {
    isScrolling = true;
  });
  
  categoryFilters.addEventListener('touchend', () => {
    setTimeout(() => {
      isScrolling = false;
    }, 100);
  });
  
  // Prevent click events while scrolling
  categoryFilters.addEventListener('click', (e) => {
    if (isScrolling) {
      e.preventDefault();
      e.stopPropagation();
    }
  });
  
  // Add scroll indicators
  const scrollIndicator = document.createElement('div');
  scrollIndicator.className = 'scroll-indicator';
  scrollIndicator.style.cssText = `
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  `;
  
  const filtersSection = document.querySelector('.filters-section');
  if (filtersSection) {
    filtersSection.style.position = 'relative';
    filtersSection.appendChild(scrollIndicator);
    
    let scrollTimeout;
    categoryFilters.addEventListener('scroll', () => {
      scrollIndicator.style.opacity = '1';
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        scrollIndicator.style.opacity = '0';
      }, 1000);
    });
  }
}


function setupNavigation() {
  const infoBtn = document.querySelector('.info-btn');
  const infoModal = document.getElementById('info-modal');
  
  if (infoBtn && infoModal) {
    infoBtn.addEventListener('click', () => {
      // Update app count in modal
      const totalAppsElement = document.getElementById('total-apps');
      if (totalAppsElement) {
        totalAppsElement.textContent = AppStore.apps.length;
      }
      showModal('info-modal');
    });
  }
}

// Enhanced Search Functionality
function setupEnhancedSearch() {
  const searchInput = document.getElementById('app-search');
  const clearSearchBtn = document.querySelector('.clear-search');
  const searchSuggestions = document.querySelector('.search-suggestions');
  const searchHistory = document.querySelector('.search-history');
  
  if (!searchInput) return;
  
  let searchTimeout;
  
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.trim();
    
    // Show/hide clear button
    clearSearchBtn.style.display = searchTerm ? 'flex' : 'none';
    
    // Clear previous timeout
    clearTimeout(searchTimeout);
    
    if (searchTerm.length > 0) {
      // Show search suggestions with debounce
      searchTimeout = setTimeout(() => {
        showSearchSuggestions(searchTerm);
      }, 300);
      
      // Hide search history
      searchHistory.style.display = 'none';
    } else {
      // Hide suggestions and show history
      searchSuggestions.style.display = 'none';
      if (AppStore.searchHistory.length > 0) {
        showSearchHistory();
      }
    }
    
    // Perform search
    performSearch(searchTerm);
  });
  
  // Focus event - show search history
  searchInput.addEventListener('focus', () => {
    if (!searchInput.value && AppStore.searchHistory.length > 0) {
      showSearchHistory();
    }
  });
  
  // Blur event - hide suggestions and history (with delay for mobile)
  searchInput.addEventListener('blur', () => {
    // Longer delay for mobile to allow taps on suggestions
    const delay = ('ontouchstart' in window) ? 300 : 200;
    setTimeout(() => {
      searchSuggestions.style.display = 'none';
      searchHistory.style.display = 'none';
    }, delay);
  });
  
  // Clear search
  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    searchSuggestions.style.display = 'none';
    performSearch('');
  });
  
  // Search button
  document.querySelector('.search-btn').addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
      addToSearchHistory(searchTerm);
      performSearch(searchTerm);
    }
  });
  
  // Enter key search
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const searchTerm = e.target.value.trim();
      if (searchTerm) {
        addToSearchHistory(searchTerm);
        performSearch(searchTerm);
      }
    }
  });
}

function showSearchSuggestions(searchTerm) {
  const searchSuggestions = document.querySelector('.search-suggestions');
  const suggestions = generateSearchSuggestions(searchTerm);
  
  if (suggestions.length > 0) {
    searchSuggestions.innerHTML = suggestions.map(suggestion => `
      <div class="suggestion-item" data-suggestion="${suggestion.text}">
        <i class="${suggestion.icon} suggestion-icon"></i>
        <span>${suggestion.text}</span>
      </div>
    `).join('');
    
    // Add click handlers
    searchSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
      item.addEventListener('click', () => {
        const suggestion = item.dataset.suggestion;
        document.getElementById('app-search').value = suggestion;
        addToSearchHistory(suggestion);
        performSearch(suggestion);
        searchSuggestions.style.display = 'none';
      });
    });
    
    searchSuggestions.style.display = 'block';
  } else {
    searchSuggestions.style.display = 'none';
  }
}

function showSearchHistory() {
  const searchHistory = document.querySelector('.search-history');
  const historyItems = document.querySelector('.search-history-items');
  
  if (AppStore.searchHistory.length > 0) {
    historyItems.innerHTML = AppStore.searchHistory.slice(-5).reverse().map(term => `
      <div class="suggestion-item" data-suggestion="${term}">
        <i class="fas fa-history suggestion-icon"></i>
        <span>${term}</span>
      </div>
    `).join('');
    
    // Add click handlers
    historyItems.querySelectorAll('.suggestion-item').forEach(item => {
      item.addEventListener('click', () => {
        const suggestion = item.dataset.suggestion;
        document.getElementById('app-search').value = suggestion;
        performSearch(suggestion);
        searchHistory.style.display = 'none';
      });
    });
    
    // Clear history handler
    document.querySelector('.clear-history').addEventListener('click', () => {
      AppStore.searchHistory = [];
      localStorage.setItem('searchHistory', JSON.stringify([]));
      searchHistory.style.display = 'none';
    });
    
    searchHistory.style.display = 'block';
  }
}

function generateSearchSuggestions(searchTerm) {
  const suggestions = [];
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  // App name suggestions
  AppStore.apps.forEach(app => {
    if (app.name.toLowerCase().includes(lowerSearchTerm)) {
      suggestions.push({
        text: app.name,
        icon: 'fas fa-mobile-alt'
      });
    }
  });
  
  // Category suggestions
  const categories = ['games', 'social', 'productivity', 'entertainment', 'christian'];
  categories.forEach(category => {
    if (category.includes(lowerSearchTerm)) {
      suggestions.push({
        text: category.charAt(0).toUpperCase() + category.slice(1),
        icon: 'fas fa-folder'
      });
    }
  });
  
  // Feature suggestions
  const features = ['HD Streaming', 'Offline Mode', 'Mobile Optimized', 'Lightweight', 'Battery Efficient'];
  features.forEach(feature => {
    if (feature.toLowerCase().includes(lowerSearchTerm)) {
      suggestions.push({
        text: feature,
        icon: 'fas fa-star'
      });
    }
  });
  
  return suggestions.slice(0, 5); // Limit to 5 suggestions
}

function addToSearchHistory(term) {
  if (!AppStore.searchHistory.includes(term)) {
    AppStore.searchHistory.push(term);
    if (AppStore.searchHistory.length > 10) {
      AppStore.searchHistory.shift(); // Keep only last 10 searches
    }
    localStorage.setItem('searchHistory', JSON.stringify(AppStore.searchHistory));
  }
}

function performSearch(searchTerm) {
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  if (!searchTerm) {
    AppStore.filteredApps = [...AppStore.apps];
  } else {
    AppStore.filteredApps = AppStore.apps.filter(app => {
      return app.name.toLowerCase().includes(lowerSearchTerm) ||
             app.description.toLowerCase().includes(lowerSearchTerm) ||
             app.category.toLowerCase().includes(lowerSearchTerm) ||
             (app.features && app.features.some(feature => feature.toLowerCase().includes(lowerSearchTerm)));
    });
  }
  
  applyFiltersAndSort();
  updateSearchResultsInfo();
}


// Category Filters Setup
function setupCategoryFilters() {
  const categoryButtons = document.querySelectorAll('.category-btn');
  if (categoryButtons.length === 0) return;
  
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active state
      if (button.classList.contains('active') && button.dataset.category === 'all') {
        return; // Don't deactivate 'All' if it's already active
      }
      
      if (button.dataset.category === 'all') {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        AppStore.currentFilters.category = 'all';
      } else {
        const allButton = document.querySelector('.category-btn[data-category="all"]');
        allButton.classList.remove('active');
        
        // Toggle the clicked category
        categoryButtons.forEach(btn => {
          if (btn !== allButton) btn.classList.remove('active');
        });
        button.classList.add('active');
        AppStore.currentFilters.category = button.dataset.category;
      }
      
      applyFiltersAndSort();
    });
  });
}

// Advanced Filters Setup
function setupAdvancedFilters() {
  const sortSelect = document.getElementById('sort-by');
  const ratingFilter = document.getElementById('filter-rating');
  const sizeFilter = document.getElementById('filter-size');
  
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      AppStore.currentSort = sortSelect.value;
      applyFiltersAndSort();
    });
  }
  
  if (ratingFilter) {
    ratingFilter.addEventListener('change', () => {
      AppStore.currentFilters.rating = ratingFilter.value;
      applyFiltersAndSort();
    });
  }
  
  if (sizeFilter) {
    sizeFilter.addEventListener('change', () => {
      AppStore.currentFilters.size = sizeFilter.value;
      applyFiltersAndSort();
    });
  }
}

// View Options Setup
function setupViewOptions() {
  const viewButtons = document.querySelectorAll('.view-btn');
  const appGrid = document.getElementById('apps-grid');
  
  viewButtons.forEach(button => {
    button.addEventListener('click', () => {
      viewButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      const viewType = button.dataset.view;
      AppStore.currentView = viewType;
      
      if (viewType === 'list') {
        appGrid.classList.add('list-view');
      } else {
        appGrid.classList.remove('list-view');
      }
    });
  });
}

// Modal Management
function setupModals() {
  const modals = document.querySelectorAll('.modal');
  
  modals.forEach(modal => {
    const closeBtn = modal.querySelector('.modal-close');
    
    // Close on close button click
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        hideModal(modal.id);
      });
    }
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        hideModal(modal.id);
      }
    });
  });
  
  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal.active');
      if (activeModal) {
        hideModal(activeModal.id);
      }
    }
  });
}

function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
    document.body.style.overflow = '';
  }
}

// App Interactions
function setupAppInteractions() {
  // Setup download tracking
  setupDownloadTracking();
  
  // Setup app details
  setupAppDetails();
  
  // Setup sharing
  setupSharing();
}

function setupDownloadTracking() {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('download-btn') || e.target.closest('.download-btn')) {
      const downloadBtn = e.target.classList.contains('download-btn') ? e.target : e.target.closest('.download-btn');
      const appId = downloadBtn.dataset.app;
      
      if (appId) {
        trackDownload(appId);
        simulateDownloadProgress(downloadBtn);
      }
    }
  });
}

function trackDownload(appId) {
  const app = AppStore.apps.find(a => a.id === appId);
  if (app && !AppStore.downloadHistory.some(d => d.id === appId)) {
    const downloadRecord = {
      id: appId,
      name: app.name,
      downloadDate: new Date().toISOString(),
      version: app.version || '1.0'
    };
    
    AppStore.downloadHistory.push(downloadRecord);
    localStorage.setItem('downloadHistory', JSON.stringify(AppStore.downloadHistory));
    
    // Update download count
    if (app.downloads) {
      app.downloads = (parseInt(app.downloads.replace(/[^0-9]/g, '')) + 1) + 'K';
    }
    
    showNotification(`${app.name} download started!`, 'success');
  }
}

function simulateDownloadProgress(downloadBtn) {
  const progressContainer = downloadBtn.closest('.app-card').querySelector('.download-progress');
  const progressFill = progressContainer.querySelector('.progress-fill');
  const progressText = progressContainer.querySelector('.progress-text');
  
  // Show progress
  downloadBtn.style.display = 'none';
  progressContainer.style.display = 'block';
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      progressText.textContent = 'Download complete!';
      setTimeout(() => {
        progressContainer.style.display = 'none';
        downloadBtn.style.display = 'flex';
        downloadBtn.innerHTML = '<i class="fas fa-check"></i> Downloaded';
        downloadBtn.classList.add('btn-secondary');
      }, 1500);
    } else {
      progressText.textContent = `Downloading... ${Math.round(progress)}%`;
    }
    
    progressFill.style.width = `${progress}%`;
  }, 200);
}

function setupAppDetails() {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('details-btn') || e.target.closest('.details-btn')) {
      const detailsBtn = e.target.classList.contains('details-btn') ? e.target : e.target.closest('.details-btn');
      const appId = detailsBtn.dataset.app;
      
      if (appId) {
        showAppDetails(appId);
      }
    }
  });
}

function showAppDetails(appId) {
  const app = AppStore.apps.find(a => a.id === appId);
  if (!app) return;
  
  const modal = document.getElementById('app-detail-modal');
  const content = modal.querySelector('.app-detail-content');
  const title = modal.querySelector('.app-detail-title');
  
  title.textContent = app.name;
  
  content.innerHTML = `
    <div class="app-detail-header">
      <img src="${app.icon}" alt="${app.name}" class="detail-app-icon">
      <div class="detail-app-info">
        <h3>${app.name}</h3>
        <p class="detail-category">${app.category}</p>
        <div class="detail-rating" data-rating="${app.rating}"></div>
        <div class="detail-meta">
          <span><i class="fas fa-download"></i> ${app.downloads || '0'} downloads</span>
          <span><i class="fas fa-hdd"></i> ${app.size}</span>
        </div>
      </div>
    </div>
    
    <div class="app-detail-description">
      <h4>Description</h4>
      <p>${app.description}</p>
    </div>
    
    ${app.features ? `
      <div class="app-detail-features">
        <h4>Features</h4>
        <div class="features-list">
          ${app.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
        </div>
      </div>
    ` : ''}
    
    <div class="app-detail-actions">
      <a href="${app.downloadUrl}" class="btn download-btn" data-app="${app.id}">
        <i class="fas fa-download"></i> Download
      </a>
      <button class="btn-secondary share-btn" data-app-id="${app.id}">
        <i class="fas fa-share-alt"></i> Share App
      </button>
    </div>
  `;
  
  // Setup rating stars in details
  setupRatingStars();
  
  showModal('app-detail-modal');
}

function setupSharing() {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('share') || e.target.closest('.share') || 
        e.target.classList.contains('share-btn') || e.target.closest('.share-btn')) {
      const shareBtn = e.target.classList.contains('share') ? e.target : 
                     e.target.classList.contains('share-btn') ? e.target :
                     e.target.closest('.share') || e.target.closest('.share-btn');
      
      let appId;
      if (shareBtn.dataset.appId) {
        appId = shareBtn.dataset.appId;
      } else {
        const appCard = shareBtn.closest('.app-card');
        appId = appCard ? appCard.dataset.appId : null;
      }
      
      if (appId) {
        shareApp(appId);
      }
    }
  });
}

function shareApp(appId) {
  const app = AppStore.apps.find(a => a.id === appId);
  if (!app) return;
  
  const shareData = {
    title: app.name,
    text: `Check out ${app.name} - ${app.description}`,
    url: window.location.href
  };
  
  if (navigator.share) {
    navigator.share(shareData);
  } else {
    // Fallback - copy to clipboard
    const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
    navigator.clipboard.writeText(shareText).then(() => {
      showNotification('Share link copied to clipboard!', 'success');
    }).catch(() => {
      showNotification('Unable to share at this time', 'error');
    });
  }
}


// Load Apps from DOM
function loadApps() {
  const appCards = document.querySelectorAll('.app-card');
  AppStore.apps = [];
  
  appCards.forEach((card, index) => {
    const app = {
      id: card.dataset.appId || `app-${index}`,
      name: card.querySelector('h3').textContent,
      category: card.dataset.category,
      description: card.querySelector('.app-description').textContent,
      rating: parseFloat(card.dataset.rating) || 0,
      size: parseInt(card.dataset.size) || 0,
      downloads: card.dataset.downloads || '0',
      icon: card.querySelector('.app-icon').src,
      downloadUrl: card.querySelector('.download-btn, .btn').href,
      features: [],
      element: card
    };
    
    // Extract features from feature tags
    const featureTags = card.querySelectorAll('.feature-tag');
    featureTags.forEach(tag => {
      app.features.push(tag.textContent.trim());
    });
    
    AppStore.apps.push(app);
  });
  
  AppStore.filteredApps = [...AppStore.apps];
  
  // Set up featured and trending apps
  setupFeaturedAndTrending();
  
  // Apply initial filters
  applyFiltersAndSort();
}

function setupFeaturedAndTrending() {
  // Select featured apps (highest rated or with featured badge)
  AppStore.featuredApps = AppStore.apps
    .filter(app => app.rating >= 4.5 || app.element.querySelector('.badge.featured'))
    .slice(0, 3);
  
  // Select trending apps (those with trending badge or most downloads)
  AppStore.trendingApps = AppStore.apps
    .filter(app => app.element.querySelector('.badge.trending') || 
                   parseInt(app.downloads.replace(/[^0-9]/g, '')) > 10000)
    .slice(0, 4);
  
  // Populate trending section
  populateTrendingSection();
}

function populateTrendingSection() {
  const trendingContainer = document.querySelector('.trending-apps-row');
  if (!trendingContainer) return;
  
  trendingContainer.innerHTML = AppStore.trendingApps.map(app => `
    <div class="trending-app-card" data-app-id="${app.id}">
      <img src="${app.icon}" alt="${app.name}" style="width: 40px; height: 40px; border-radius: 8px; margin-bottom: 0.5rem;">
      <h4 style="font-size: 0.9rem; margin: 0.25rem 0;">${app.name}</h4>
      <div class="app-rating" data-rating="${app.rating}" style="font-size: 0.7rem;"></div>
      <p style="font-size: 0.7rem; margin: 0.25rem 0; opacity: 0.8;">${app.downloads} downloads</p>
    </div>
  `).join('');
  
  // Add click handlers for trending apps
  trendingContainer.querySelectorAll('.trending-app-card').forEach(card => {
    card.addEventListener('click', () => {
      const appId = card.dataset.appId;
      showAppDetails(appId);
    });
  });
  
  // Setup rating stars for trending apps
  setupRatingStars();
}

// Apply Filters and Sorting
function applyFiltersAndSort() {
  let filtered = [...AppStore.filteredApps];
  
  // Apply category filter
  if (AppStore.currentFilters.category !== 'all') {
    filtered = filtered.filter(app => app.category === AppStore.currentFilters.category);
  }
  
  // Apply rating filter
  if (AppStore.currentFilters.rating !== 'all') {
    const minRating = parseFloat(AppStore.currentFilters.rating.replace('+', ''));
    filtered = filtered.filter(app => app.rating >= minRating);
  }
  
  // Apply size filter
  if (AppStore.currentFilters.size !== 'all') {
    filtered = filtered.filter(app => {
      const size = app.size;
      switch (AppStore.currentFilters.size) {
        case 'small': return size < 20;
        case 'medium': return size >= 20 && size <= 50;
        case 'large': return size > 50;
        default: return true;
      }
    });
  }
  
  // Apply sorting
  filtered.sort((a, b) => {
    switch (AppStore.currentSort) {
      case 'rating':
        return b.rating - a.rating;
      case 'downloads':
        return parseInt(b.downloads.replace(/[^0-9]/g, '')) - parseInt(a.downloads.replace(/[^0-9]/g, ''));
      case 'newest':
        // Simulate by app order
        return AppStore.apps.indexOf(b) - AppStore.apps.indexOf(a);
      case 'size-small':
        return a.size - b.size;
      case 'alphabetical':
        return a.name.localeCompare(b.name);
      case 'featured':
      default:
        // Featured apps first, then by rating
        const aFeatured = a.element.querySelector('.badge.featured') ? 1 : 0;
        const bFeatured = b.element.querySelector('.badge.featured') ? 1 : 0;
        if (aFeatured !== bFeatured) return bFeatured - aFeatured;
        return b.rating - a.rating;
    }
  });
  
  // Show/hide apps based on filtered results
  AppStore.apps.forEach(app => {
    const isVisible = filtered.includes(app);
    app.element.style.display = isVisible ? 'flex' : 'none';
    
    if (isVisible) {
      app.element.classList.add('scale-in');
      setTimeout(() => app.element.classList.remove('scale-in'), 500);
    }
  });
  
  updateSearchResultsInfo();
}

function updateSearchResultsInfo() {
  const resultsInfo = document.querySelector('.search-results-info');
  const resultsCount = document.querySelector('.results-count');
  const clearFiltersBtn = document.querySelector('.clear-all-filters');
  
  if (!resultsInfo || !resultsCount) return;
  
  const visibleApps = AppStore.apps.filter(app => app.element.style.display !== 'none');
  const totalApps = AppStore.apps.length;
  
  resultsCount.textContent = `Showing ${visibleApps.length} of ${totalApps} apps`;
  
  // Show/hide results info
  const hasFilters = AppStore.currentFilters.category !== 'all' || 
                    AppStore.currentFilters.rating !== 'all' || 
                    AppStore.currentFilters.size !== 'all' ||
                    document.getElementById('app-search').value.trim() !== '';
  
  if (hasFilters) {
    resultsInfo.style.display = 'flex';
    clearFiltersBtn.style.display = hasFilters && visibleApps.length !== totalApps ? 'block' : 'none';
  } else {
    resultsInfo.style.display = 'none';
  }
  
  // Clear all filters button
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      // Reset all filters
      AppStore.currentFilters = { category: 'all', rating: 'all', size: 'all' };
      document.getElementById('app-search').value = '';
      document.getElementById('sort-by').value = 'featured';
      document.getElementById('filter-rating').value = 'all';
      document.getElementById('filter-size').value = 'all';
      
      // Reset category buttons
      document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelector('.category-btn[data-category="all"]').classList.add('active');
      
      // Reset search
      AppStore.filteredApps = [...AppStore.apps];
      applyFiltersAndSort();
    });
  }
}

// Enhanced Rating Stars
function setupRatingStars() {
  const ratingElements = document.querySelectorAll('.app-rating');
  
  ratingElements.forEach(element => {
    const ratingValue = parseFloat(element.dataset.rating) || 0;
    
    // Skip if already processed
    if (element.querySelector('.stars-container')) return;
    
    element.innerHTML = ''; // Clear any existing content
    const starsContainer = document.createElement('div');
    starsContainer.classList.add('stars-container');
    starsContainer.style.display = 'flex';
    starsContainer.style.alignItems = 'center';
    starsContainer.style.gap = '0.3rem';
    
    // Create the filled stars background
    const starsBackground = document.createElement('div');
    starsBackground.classList.add('stars-background');
    starsBackground.style.width = '80px';
    starsBackground.style.position = 'relative';
    starsBackground.innerHTML = '★★★★★';
    starsBackground.style.color = 'rgba(0,0,0,0.15)';
    starsBackground.style.letterSpacing = '2px';
    starsBackground.style.fontSize = 'inherit';
    
    // Dark mode adjustment
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
      starsBackground.style.color = 'rgba(255,255,255,0.2)';
    }
    
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
    filledStars.style.fontSize = 'inherit';
    
    starsBackground.appendChild(filledStars);
    starsContainer.appendChild(starsBackground);
    
    // Add the rating value with a modern style
    if (ratingValue > 0) {
      const ratingText = document.createElement('span');
      ratingText.textContent = ratingValue.toFixed(1);
      ratingText.style.fontWeight = '600';
      ratingText.style.marginLeft = '8px';
      ratingText.style.fontSize = '0.85em';
      starsContainer.appendChild(ratingText);
    }
    
    // Replace the content
    element.appendChild(starsContainer);
  });
}

// Update Notifications System
function setupUpdateNotifications() {
  // Version management
  const currentVersion = '2.0.0';
  const lastSeenVersion = localStorage.getItem('lastSeenVersion') || '1.0.0';
  const updateDismissed = localStorage.getItem('updateDismissed') === 'true';
  
  // Check if this is a new version
  if (compareVersions(currentVersion, lastSeenVersion) > 0 && !updateDismissed) {
    // Show update notification after a delay
    setTimeout(() => {
      showUpdateNotification();
    }, 2000);
  }
  
  // Setup update notification modal handlers
  setupUpdateModalHandlers();
  
  // Setup version history
  setupVersionHistory();
  
  // Auto-check for updates periodically (simulated)
  setupUpdateChecker();
}

function compareVersions(version1, version2) {
  const v1parts = version1.split('.').map(Number);
  const v2parts = version2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
    const v1part = v1parts[i] || 0;
    const v2part = v2parts[i] || 0;
    
    if (v1part > v2part) return 1;
    if (v1part < v2part) return -1;
  }
  return 0;
}

function showUpdateNotification() {
  const modal = document.getElementById('update-notification-modal');
  if (modal) {
    showModal('update-notification-modal');
    
    // Add special entrance animation
    const content = modal.querySelector('.modal-content');
    content.style.animation = 'bounce-in 0.8s ease-out';
    
    // Track that user has seen this version
    localStorage.setItem('lastSeenVersion', '2.0.0');
  }
}

function setupUpdateModalHandlers() {
  // Update now button
  const updateNowBtn = document.querySelector('.update-now-btn');
  if (updateNowBtn) {
    updateNowBtn.addEventListener('click', () => {
      hideModal('update-notification-modal');
      
      // Simulate update process
      showNotification('Welcome to Ion App Store 2.0!', 'success');
      
      // Show what's new section
      const whatsNewSection = document.querySelector('.whats-new-section');
      if (whatsNewSection) {
        whatsNewSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
        
        // Highlight the section temporarily
        whatsNewSection.style.background = 'linear-gradient(135deg, rgba(67, 97, 238, 0.1), rgba(114, 9, 183, 0.1))';
        whatsNewSection.style.borderRadius = '20px';
        whatsNewSection.style.padding = '2rem';
        whatsNewSection.style.margin = '0 -1rem 3rem -1rem';
        whatsNewSection.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
          whatsNewSection.style.background = '';
          whatsNewSection.style.borderRadius = '';
          whatsNewSection.style.padding = '';
          whatsNewSection.style.margin = '';
        }, 3000);
      }
      
      localStorage.setItem('updateDismissed', 'false');
    });
  }
  
  // View changelog button
  const changelogBtn = document.querySelector('.view-changelog-btn');
  if (changelogBtn) {
    changelogBtn.addEventListener('click', () => {
      hideModal('update-notification-modal');
      setTimeout(() => {
        showModal('version-history-modal');
      }, 300);
    });
  }
  
  // Dismiss update notification
  const updateModal = document.getElementById('update-notification-modal');
  if (updateModal) {
    const closeBtn = updateModal.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        localStorage.setItem('updateDismissed', 'true');
      });
    }
  }
}

function setupVersionHistory() {
  // Add version history trigger to info modal
  const infoModal = document.getElementById('info-modal');
  if (infoModal) {
    // Add version history link to info modal
    const contactInfo = infoModal.querySelector('.contact-info');
    if (contactInfo) {
      const versionLink = document.createElement('button');
      versionLink.className = 'contact-link version-history-link';
      versionLink.innerHTML = '<i class="fas fa-history"></i> Version History';
      versionLink.style.marginTop = '1rem';
      
      versionLink.addEventListener('click', () => {
        hideModal('info-modal');
        setTimeout(() => {
          showModal('version-history-modal');
        }, 300);
      });
      
      contactInfo.appendChild(versionLink);
    }
  }
  
  // Setup version history modal interactions
  const versionHistoryModal = document.getElementById('version-history-modal');
  if (versionHistoryModal) {
    // Add click handlers for version entries
    const versionEntries = versionHistoryModal.querySelectorAll('.version-entry');
    versionEntries.forEach(entry => {
      entry.addEventListener('click', () => {
        // Toggle expanded view
        entry.classList.toggle('expanded');
        
        // Add expanded styles
        if (entry.classList.contains('expanded')) {
          entry.style.background = 'var(--glass-bg)';
          entry.style.padding = '1.5rem';
          entry.style.marginLeft = '-1.5rem';
          entry.style.borderRadius = '15px';
          entry.style.transition = 'all 0.3s ease';
        } else {
          entry.style.background = '';
          entry.style.padding = '';
          entry.style.marginLeft = '';
          entry.style.borderRadius = '';
        }
      });
    });
  }
}

function setupUpdateChecker() {
  // Simulate periodic update checking
  const checkForUpdates = () => {
    // In a real app, this would make an API call
    const hasNewUpdate = Math.random() < 0.1; // 10% chance of "finding" an update
    
    if (hasNewUpdate) {
      showNotification('A new update might be available! Check version history for details.', 'info');
    }
  };
  
  // Check for updates every 5 minutes (in a real app, this would be much less frequent)
  setInterval(checkForUpdates, 5 * 60 * 1000);
  
  // Add manual update check option to info modal
  const infoModal = document.getElementById('info-modal');
  if (infoModal) {
    const statsSection = infoModal.querySelector('.stats-section');
    if (statsSection) {
      const updateButton = document.createElement('button');
      updateButton.className = 'btn-secondary';
      updateButton.innerHTML = '<i class="fas fa-sync-alt"></i> Check for Updates';
      updateButton.style.marginTop = '1rem';
      updateButton.style.width = '100%';
      
      updateButton.addEventListener('click', () => {
        // Simulate update check
        updateButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';
        updateButton.disabled = true;
        
        setTimeout(() => {
          updateButton.innerHTML = '<i class="fas fa-check"></i> You\'re up to date!';
          updateButton.style.background = 'var(--success-color)';
          updateButton.style.color = 'white';
          
          setTimeout(() => {
            updateButton.innerHTML = '<i class="fas fa-sync-alt"></i> Check for Updates';
            updateButton.style.background = '';
            updateButton.style.color = '';
            updateButton.disabled = false;
          }, 2000);
        }, 1500);
      });
      
      statsSection.appendChild(updateButton);
    }
  }
}

// Notification for app updates
function notifyAppUpdate(appId, newVersion) {
  const app = AppStore.apps.find(a => a.id === appId);
  if (!app) return;
  
  const notification = {
    title: `${app.name} Updated!`,
    message: `Version ${newVersion} is now available with new features and improvements.`,
    type: 'info',
    action: () => {
      // Scroll to the app
      if (app.element) {
        app.element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        
        // Highlight the app temporarily
        app.element.style.boxShadow = '0 0 0 3px var(--primary-color)';
        app.element.style.transition = 'box-shadow 0.3s ease';
        
        setTimeout(() => {
          app.element.style.boxShadow = '';
        }, 2000);
      }
    }
  };
  
  showAdvancedNotification(notification);
}

function showAdvancedNotification(notification) {
  const notificationEl = document.createElement('div');
  notificationEl.className = 'advanced-notification';
  notificationEl.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--card-bg);
    color: var(--text-primary);
    padding: 1.5rem;
    border-radius: 15px;
    box-shadow: var(--card-shadow);
    z-index: 10000;
    transform: translateX(400px);
    transition: all 0.3s ease;
    border-left: 4px solid var(--primary-color);
    max-width: 350px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    cursor: pointer;
  `;
  
  notificationEl.innerHTML = `
    <div style="display: flex; align-items: flex-start; gap: 1rem;">
      <div style="flex: 1;">
        <h4 style="margin: 0 0 0.5rem 0; font-size: 1.1rem; font-weight: 600;">${notification.title}</h4>
        <p style="margin: 0; font-size: 0.9rem; line-height: 1.4; color: var(--text-secondary);">${notification.message}</p>
        ${notification.action ? '<p style="margin: 0.5rem 0 0 0; font-size: 0.8rem; color: var(--primary-color); font-weight: 600;">Click to view</p>' : ''}
      </div>
      <button style="background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 1.2rem; padding: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">&times;</button>
    </div>
  `;
  
  document.body.appendChild(notificationEl);
  
  // Animate in
  setTimeout(() => {
    notificationEl.style.transform = 'translateX(0)';
  }, 100);
  
  // Click handler
  notificationEl.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      // Close button clicked
      closeAdvancedNotification(notificationEl);
    } else if (notification.action) {
      // Notification clicked
      notification.action();
      closeAdvancedNotification(notificationEl);
    }
  });
  
  // Auto remove after 6 seconds
  setTimeout(() => {
    closeAdvancedNotification(notificationEl);
  }, 6000);
}

function closeAdvancedNotification(notificationEl) {
  if (notificationEl && notificationEl.parentNode) {
    notificationEl.style.transform = 'translateX(400px)';
    setTimeout(() => {
      if (notificationEl.parentNode) {
        notificationEl.parentNode.removeChild(notificationEl);
      }
    }, 300);
  }
}


function setupSocialFeatures() {
  // Setup sharing functionality (already handled in setupSharing)
  
  // Setup review system (placeholder)
  setupReviewSystem();
}

function setupReviewSystem() {
  // Placeholder for review system
  // This would integrate with a backend service in a real application
  console.log('Review system initialized');
}

// Card Animations
function addCardAnimations() {
  const appCards = document.querySelectorAll('.app-card');
  appCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
    
    // Add stagger effect on load
    setTimeout(() => {
      card.classList.add('fade-in');
    }, Math.random() * 200);
  });
}

// Notification System
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--card-bg);
    color: var(--text-primary);
    padding: 1rem 1.5rem;
    border-radius: 15px;
    box-shadow: var(--card-shadow);
    z-index: 10000;
    transform: translateX(400px);
    transition: all 0.3s ease;
    border-left: 4px solid var(--primary-color);
    max-width: 300px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  `;
  
  // Set border color based on type
  const colors = {
    success: '#28a745',
    error: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8'
  };
  
  notification.style.borderLeftColor = colors[type] || colors.info;
  
  // Add icon based on type
  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  };
  
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.5rem;">
      <i class="${icons[type] || icons.info}" style="color: ${colors[type] || colors.info};"></i>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
  
  // Click to dismiss
  notification.addEventListener('click', () => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  });
}

// Helper function to add new app cards dynamically (preserved from original)
function addAppCard(app) {
  const appGrid = document.querySelector('.app-grid');
  if (!appGrid) return;
  
  const card = document.createElement('div');
  card.className = 'app-card enhanced animate__animated animate__fadeInUp';
  card.setAttribute('data-aos', 'zoom-in');
  card.setAttribute('data-category', app.category);
  card.setAttribute('data-app-id', app.id);
  card.setAttribute('data-rating', app.rating);
  card.setAttribute('data-size', app.size);
  card.setAttribute('data-downloads', app.downloads);
  
  card.innerHTML = `
    <div class="app-card-header">
      <img src="${app.icon}" alt="${app.name}" class="app-icon" loading="lazy">
      <div class="app-info">
        <h3>${app.name}</h3>
        <div class="app-category">${app.category}</div>
        <div class="app-badges">
          ${app.badges ? app.badges.map(badge => `<span class="badge ${badge.type}">${badge.text}</span>`).join('') : ''}
        </div>
      </div>
      <div class="app-actions">
        <button class="action-btn share" title="Share App">
          <i class="fas fa-share-alt"></i>
        </button>
        <button class="action-btn info" title="App Info">
          <i class="fas fa-info-circle"></i>
        </button>
      </div>
    </div>
    
    <div class="app-card-body">
      <p class="app-description">${app.description}</p>
      
      ${app.features ? `
        <div class="app-features">
          ${app.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
        </div>
      ` : ''}
      
      <div class="app-meta">
        <div class="app-rating" data-rating="${app.rating}"></div>
        <div class="app-size">${app.size} MB</div>
        <div class="app-downloads">${app.downloads} downloads</div>
      </div>
      
      <div class="app-actions-bar">
        <a href="${app.downloadUrl}" class="btn download-btn" data-app="${app.id}">
          <i class="fas fa-download"></i> Download
        </a>
        <button class="btn-secondary details-btn" data-app="${app.id}">
          <i class="fas fa-info-circle"></i> Details
        </button>
      </div>
      
      <div class="download-progress" style="display: none;">
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
        <span class="progress-text">Preparing download...</span>
      </div>
    </div>
  `;
  
  appGrid.appendChild(card);
  
  // Add to apps array
  app.element = card;
  AppStore.apps.push(app);
  
  // Refresh functionality
  setupRatingStars();
  addCardAnimations();
}

// Admin Panel System (Hidden Feature)
function setupAdminPanel() {
  let keySequence = [];
  const secretCode = ['KeyA', 'KeyD', 'KeyM', 'KeyI', 'KeyN']; // "ADMIN"
  
  // Listen for secret key combination
  document.addEventListener('keydown', (e) => {
    keySequence.push(e.code);
    
    // Keep only the last 5 keys
    if (keySequence.length > secretCode.length) {
      keySequence.shift();
    }
    
    // Check if the sequence matches
    if (keySequence.length === secretCode.length && 
        keySequence.every((key, index) => key === secretCode[index])) {
      showAdminPanel();
      keySequence = []; // Reset
    }
  });
  
  // Setup admin panel functionality
  setupAdminTabs();
  setupAdminAnalytics();
  setupAdminAppManagement();
  setupAdminSystem();
}

function showAdminPanel() {
  // Flash effect to indicate access
  document.body.style.background = 'linear-gradient(45deg, #4361ee, #7209b7)';
  document.body.style.transition = 'background 0.3s ease';
  
  setTimeout(() => {
    document.body.style.background = '';
    showModal('admin-panel-modal');
    refreshAdminData();
    showNotification('Admin panel accessed!', 'info');
  }, 300);
}

function setupAdminTabs() {
  const adminTabs = document.querySelectorAll('.admin-tab');
  const tabContents = document.querySelectorAll('.admin-tab-content');
  
  adminTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      adminTabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(content => content.style.display = 'none');
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Show corresponding content
      const targetTab = tab.dataset.tab;
      const targetContent = document.getElementById(`${targetTab}-tab`);
      if (targetContent) {
        targetContent.style.display = 'block';
      }
    });
  });
}

function setupAdminAnalytics() {
  // Refresh analytics data when tab is clicked
  const analyticsTab = document.querySelector('[data-tab="analytics"]');
  if (analyticsTab) {
    analyticsTab.addEventListener('click', () => {
      updateAnalyticsData();
    });
  }
}

function updateAnalyticsData() {
  // Update total apps
  const totalAppsElement = document.getElementById('total-apps-admin');
  if (totalAppsElement) {
    totalAppsElement.textContent = AppStore.apps.length;
  }
  
  // Calculate total downloads
  const totalDownloads = AppStore.apps.reduce((total, app) => {
    const downloads = parseInt(app.downloads.replace(/[^0-9]/g, '')) || 0;
    return total + downloads;
  }, 0);
  
  const totalDownloadsElement = document.getElementById('total-downloads');
  if (totalDownloadsElement) {
    totalDownloadsElement.textContent = formatNumber(totalDownloads);
  }
  
  // Calculate average rating
  const avgRating = AppStore.apps.reduce((total, app) => total + app.rating, 0) / AppStore.apps.length;
  const avgRatingElement = document.getElementById('avg-rating');
  if (avgRatingElement) {
    avgRatingElement.textContent = avgRating.toFixed(1);
  }
  
  // Animate the numbers
  animateNumbers();
}

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

function animateNumbers() {
  const numbers = document.querySelectorAll('.analytics-stats .stat-number');
  numbers.forEach(num => {
    num.style.transform = 'scale(1.1)';
    num.style.color = 'var(--accent-color)';
    setTimeout(() => {
      num.style.transform = 'scale(1)';
      num.style.color = 'var(--primary-color)';
    }, 200);
  });
}

function setupAdminAppManagement() {
  const appsTab = document.querySelector('[data-tab="apps"]');
  if (appsTab) {
    appsTab.addEventListener('click', () => {
      populateAppsTable();
    });
  }
  
  // Add new app button
  const addAppBtn = document.querySelector('.add-app-btn');
  if (addAppBtn) {
    addAppBtn.addEventListener('click', () => {
      showAddAppDialog();
    });
  }
}

function populateAppsTable() {
  const tableBody = document.getElementById('admin-apps-list');
  if (!tableBody) return;
  
  tableBody.innerHTML = AppStore.apps.map(app => `
    <div class="app-row">
      <div class="app-info-mini">
        <img src="${app.icon}" alt="${app.name}" class="app-icon-mini">
        <span class="app-name-mini">${app.name}</span>
      </div>
      <span>${app.category}</span>
      <span>${app.downloads}</span>
      <span>${app.rating.toFixed(1)} ★</span>
      <span class="app-status active">Active</span>
      <div class="app-actions">
        <button class="action-btn-mini edit" onclick="editApp('${app.id}')" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn-mini delete" onclick="deleteApp('${app.id}')" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function showAddAppDialog() {
  const appData = {
    name: prompt('App Name:'),
    category: prompt('Category:'),
    description: prompt('Description:'),
    icon: prompt('Icon URL:'),
    downloadUrl: prompt('Download URL:')
  };
  
  if (appData.name && appData.category) {
    const newApp = {
      id: 'app-' + Date.now(),
      name: appData.name,
      category: appData.category,
      description: appData.description || 'New app description',
      rating: 4.0,
      size: 10,
      downloads: '0',
      icon: appData.icon || 'https://via.placeholder.com/64x64/4361ee/white?text=App',
      downloadUrl: appData.downloadUrl || '#',
      features: ['New Feature']
    };
    
    addAppCard(newApp);
    showNotification(`${newApp.name} added successfully!`, 'success');
    populateAppsTable();
  }
}

function editApp(appId) {
  const app = AppStore.apps.find(a => a.id === appId);
  if (!app) return;
  
  const newName = prompt('Edit App Name:', app.name);
  if (newName && newName !== app.name) {
    app.name = newName;
    if (app.element) {
      const nameElement = app.element.querySelector('h3');
      if (nameElement) nameElement.textContent = newName;
    }
    showNotification(`${newName} updated successfully!`, 'success');
    populateAppsTable();
  }
}

function deleteApp(appId) {
  if (confirm('Are you sure you want to delete this app?')) {
    const app = AppStore.apps.find(a => a.id === appId);
    if (app && app.element) {
      app.element.remove();
      AppStore.apps = AppStore.apps.filter(a => a.id !== appId);
      AppStore.filteredApps = AppStore.filteredApps.filter(a => a.id !== appId);
      showNotification(`${app.name} deleted successfully!`, 'warning');
      populateAppsTable();
      updateAnalyticsData();
    }
  }
}

function setupAdminSystem() {
  // Clear cache button
  const clearCacheBtn = document.querySelector('.clear-cache-btn');
  if (clearCacheBtn) {
    clearCacheBtn.addEventListener('click', () => {
      localStorage.clear();
      showNotification('Cache cleared successfully!', 'success');
    });
  }
  
  // Export data button
  const exportDataBtn = document.querySelector('.export-data-btn');
  if (exportDataBtn) {
    exportDataBtn.addEventListener('click', () => {
      const data = {
        apps: AppStore.apps.map(app => ({
          id: app.id,
          name: app.name,
          category: app.category,
          description: app.description,
          rating: app.rating,
          size: app.size,
          downloads: app.downloads
        })),
        settings: {
          darkMode: AppStore.darkMode,
          currentView: AppStore.currentView,
          currentSort: AppStore.currentSort
        },
        analytics: {
          totalApps: AppStore.apps.length,
          searchHistory: AppStore.searchHistory,
          downloadHistory: AppStore.downloadHistory
        }
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ion-app-store-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showNotification('Data exported successfully!', 'success');
    });
  }
  
  // Reset settings button
  const resetSettingsBtn = document.querySelector('.reset-settings-btn');
  if (resetSettingsBtn) {
    resetSettingsBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all settings? This cannot be undone.')) {
        // Reset to defaults
        AppStore.darkMode = false;
        AppStore.currentView = 'grid';
        AppStore.currentSort = 'featured';
        AppStore.currentFilters = { category: 'all', rating: 'all', size: 'all' };
        
        // Apply theme reset
        document.documentElement.removeAttribute('data-theme');
        document.body.classList.remove('dark-mode');
        
        // Update UI
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
          themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        
        // Save to localStorage
        localStorage.setItem('darkMode', 'false');
        
        showNotification('Settings reset successfully!', 'success');
      }
    });
  }
  
  // Update current theme display
  const currentThemeElement = document.getElementById('current-theme');
  if (currentThemeElement) {
    currentThemeElement.textContent = AppStore.darkMode ? 'Dark' : 'Light';
  }
}

function refreshAdminData() {
  updateAnalyticsData();
  
  // Update current theme in system tab
  const currentThemeElement = document.getElementById('current-theme');
  if (currentThemeElement) {
    currentThemeElement.textContent = AppStore.darkMode ? 'Dark' : 'Light';
  }
}

// Expose functions globally for onclick handlers
window.editApp = editApp;
window.deleteApp = deleteApp;


console.log(`
Ion App Store 2.0 - FULLY LOADED!
${AppStore.apps.length} apps available
Dark mode: ${AppStore.darkMode ? 'enabled' : 'disabled'}
Enhanced search with auto-suggestions
Dark/Light theme support
Advanced filtering and sorting
Mobile-first responsive design
Update notifications system active
Version history tracking enabled
What's new section loaded
App sharing functionality
Download progress tracking
Admin panel (Type 'ADMIN' to access)
All features optimized and ready!

Features Summary:
- Enhanced search with autocomplete & history
- Dark/Light mode toggle
- Mobile-optimized responsive design  
- Advanced app filtering & sorting
- Download progress tracking
- App sharing capabilities
- Update notifications & version history
- What's new section
- Hidden admin panel for management
- Performance optimizations

Type 'ADMIN' anywhere to access the admin panel! 🔐
`);

// Export for global access
window.AppStore = AppStore;
window.showNotification = showNotification;
window.addAppCard = addAppCard;
window.notifyAppUpdate = notifyAppUpdate;