document.addEventListener('DOMContentLoaded', function () {

  let landingContent = document.querySelector('.landingContent');
  let ourStorySection = document.querySelector('.ourStorySection'); // ✅ CHANGED: highlightsSection → ourStorySection
  let landingHeading = document.querySelector('.bigHeading')
  
  if (!landingContent || !ourStorySection) return;

  let triggerOffset = 400;
  let bufferZone = 20;

  let ticking = false;
  let stopped = false;

  function check() {
    ticking = false;
    let rect = ourStorySection.getBoundingClientRect();
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

  (function () {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const bigHeading = document.querySelector('.bigHeading');
    const navCentre = document.querySelector('.navCentre');  
    if (!bigHeading || !navCentre) return;

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
          trigger: document.querySelector('.ourStorySection') || document.body, // ✅ CHANGED: highlightsSection → ourStorySection
          start: `top ${500}px`,
          end: `+=200`,
          scrub: 0.6,
          onLeaveBack: restoreHeading // ✅ FIXED: removed problematic addEventListener
        }
      });

      headingTl.to(bigHeading, {
        x: deltaX,
        y: deltaY,
        scale: targetScale,
        ease: "none"
      }, 0);

      headingTl.to(bigHeading, { opacity: 0.95 }, 0);
    }

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

    buildHeadingShrink();

    let resizeTO;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTO);
      resizeTO = setTimeout(() => {
        restoreHeading();
        buildHeadingShrink();
        ScrollTrigger.refresh();
      }, 150);
    });
  })();
});



//non External API (eyeroll)

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Drawing styles
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.lineWidth = 5;

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
    if (!isDrawing) return;
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function stopDrawing() {
    isDrawing = false;
}




// Event listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);




//live External API
// Cleveland Museum of Art API Implementation
document.addEventListener('DOMContentLoaded', function() {
    initializeArtAPI();
    initializeDrawingCanvas(); // Keep your existing drawing functionality
});

function initializeArtAPI() {
    const loadButton = document.getElementById('loadArtBtn');
    const searchButton = document.getElementById('searchArtBtn');
    const searchInput = document.getElementById('artSearch');
    
    if (loadButton && searchButton) {
        loadButton.addEventListener('click', () => fetchRandomArtwork());
        searchButton.addEventListener('click', () => {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                fetchArtBySearch(searchTerm);
            } else {
                showErrorState('Please enter a search term');
            }
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const searchTerm = searchInput.value.trim();
                if (searchTerm) {
                    fetchArtBySearch(searchTerm);
                } else {
                    showErrorState('Please enter a search term');
                }
            }
        });
        
        // Load initial artwork
        fetchRandomArtwork();
    }
}

async function fetchRandomArtwork() {
    // Get random artwork from their 30,000+ collection
    const randomSkip = Math.floor(Math.random() * 1000) * 10; // Random position in collection
    const apiUrl = `https://openaccess-api.clevelandart.org/api/artworks/?has_image=1&limit=1&skip=${randomSkip}`;
    
    await fetchArtData(apiUrl, 'random');
}

async function fetchArtBySearch(searchTerm) {
    const apiUrl = `https://openaccess-api.clevelandart.org/api/artworks/?has_image=1&limit=20&q=${encodeURIComponent(searchTerm)}`;
    
    await fetchArtData(apiUrl, 'search');
}

async function fetchArtData(apiUrl, type) {
    showLoadingState();
    hideErrorState();
    hideResultState();
    
    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`Museum API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.data || data.data.length === 0) {
            throw new Error('No artworks found. Try a different search term like "painting", "portrait", or "landscape".');
        }
        
        let artwork;
        if (type === 'search') {
            // Pick random from search results
            artwork = data.data[Math.floor(Math.random() * data.data.length)];
        } else {
            artwork = data.data[0];
        }
        
        displayArtResult(artwork);
        
    } catch (error) {
        console.error('Art API Error:', error);
        showErrorState(error.message);
    } finally {
        hideLoadingState();
    }
}

function displayArtResult(artwork) {
    const titleElement = document.getElementById('artTitle');
    const containerElement = document.getElementById('artContainer');
    const resultElement = document.getElementById('artResult');
    
    const title = artwork.title || 'Untitled Artwork';
    const artist = artwork.creators?.[0]?.description || 'Unknown Artist';
    const date = artwork.creation_date || 'Date unknown';
    const culture = artwork.culture?.[0] || 'Culture unknown';
    const department = artwork.department || 'Unknown Department';
    
    // Get the best available image
    const imageUrl = artwork.images?.web?.url || 
                    artwork.images?.print?.url || 
                    artwork.images?.full?.url || '';
    
    titleElement.textContent = title;
    
    containerElement.innerHTML = `
        <div class="artworkWrapper">
            ${imageUrl ? `
                <img 
                    src="${imageUrl}" 
                    alt="${title}"
                    class="artworkImage"
                    onerror="handleImageError(this)"
                />
            ` : `
                <div class="noImagePlaceholder">
                    <div class="placeholderIcon">🖼️</div>
                    <p>Image not available online</p>
                    <p><em>${title}</em></p>
                </div>
            `}
            <div class="artworkInfo">
                <p><strong>Artist:</strong> ${artist}</p>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Culture:</strong> ${culture}</p>
                <p><strong>Department:</strong> ${department}</p>
                ${artwork.technique ? `<p><strong>Technique:</strong> ${artwork.technique}</p>` : ''}
                ${artwork.measurements ? `<p><strong>Measurements:</strong> ${artwork.measurements}</p>` : ''}
            </div>
        </div>
        <div class="artAttribution">
            via Cleveland Museum of Art • Public Domain
        </div>
    `;
    
    showResultState();
}

function handleImageError(img) {
    img.style.display = 'none';
    const wrapper = img.parentElement;
    const placeholder = wrapper.querySelector('.noImagePlaceholder');
    if (!placeholder) {
        wrapper.innerHTML += `
            <div class="noImagePlaceholder">
                <div class="placeholderIcon">🖼️</div>
                <p>Image failed to load</p>
                <p><em>API demonstration working correctly</em></p>
            </div>
        `;
    }
}

// State Management Functions
function showLoadingState() {
    const loadingElement = document.getElementById('artLoading');
    if (loadingElement) {
        loadingElement.classList.add('active');
    }
}

function hideLoadingState() {
    const loadingElement = document.getElementById('artLoading');
    if (loadingElement) {
        loadingElement.classList.remove('active');
    }
}

function showErrorState(errorMessage = '') {
    const errorElement = document.getElementById('artError');
    if (errorElement) {
        if (errorMessage) {
            const errorText = errorElement.querySelector('p');
            if (errorText) {
                errorText.textContent = errorMessage;
            }
        }
        errorElement.classList.add('active');
    }
}

function hideErrorState() {
    const errorElement = document.getElementById('artError');
    if (errorElement) {
        errorElement.classList.remove('active');
    }
}

function showResultState() {
    const resultElement = document.getElementById('artResult');
    if (resultElement) {
        resultElement.classList.add('active');
    }
}

function hideResultState() {
    const resultElement = document.getElementById('artResult');
    if (resultElement) {
        resultElement.classList.remove('active');
    }
}

// Keep your existing drawing canvas functionality
function initializeDrawingCanvas() {
    // Your existing drawing canvas code here
    const canvas = document.getElementById('myCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        // Add your drawing functionality...
    }
}