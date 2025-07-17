// Fluid Cursor Controls
console.clear();
const TAIL_LENGTH = 20;
const cursor = document.getElementById('cursor');
let mouseX = 0;
let mouseY = 0;
let cursorCircles;
let cursorHistory = Array(TAIL_LENGTH).fill({x: 0, y: 0});
function onMouseMove(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
}

function initCursor() {
  for (let i = 0; i < TAIL_LENGTH; i++) {
    let div = document.createElement('div');
    div.classList.add('cursor-circle') ;
    cursor.append(div);
  }
  cursorCircles = Array.from(document.querySelectorAll('.cursor-circle'));
}

function updateCursor() {  
  cursorHistory.shift();
  cursorHistory.push({ x: mouseX, y: mouseY });
    
  for (let i = 0; i < TAIL_LENGTH; i++) {
    let current = cursorHistory[i];
    let next = cursorHistory[i + 1] || cursorHistory[TAIL_LENGTH - 1];
    let xDiff = next.x - current.x;
    let yDiff = next.y - current.y;
    current.x += xDiff * 0.35;
    current.y += yDiff * 0.35;
    cursorCircles[i].style.transform = `translate(${current.x}px, ${current.y}px) scale(${i/TAIL_LENGTH})`;  
  }
  requestAnimationFrame(updateCursor)
}
document.addEventListener('mousemove', onMouseMove, false);
initCursor();
updateCursor();

// End of Fluid Cursor controls

document.addEventListener('DOMContentLoaded', function () {

    const track = document.querySelector('.rolling-track');
    
    // Pause animation on hover
    track.addEventListener('mouseenter', () => {
        track.style.animationPlayState = 'paused';
    });
    
    track.addEventListener('mouseleave', () => {
        track.style.animationPlayState = 'running';
    });
    
    // Check if elements need to be duplicated for smooth infinite scroll
    const checkAndDuplicate = () => {
        const cards = track.querySelectorAll('.rolling-card');
        const totalWidth = Array.from(cards).reduce((width, card) => {
            return width + card.offsetWidth + parseFloat(getComputedStyle(card).marginRight);
        }, 0);
        
        if (totalWidth < window.innerWidth * 3) {
            cards.forEach(card => {
                const clone = card.cloneNode(true);
                track.appendChild(clone);
            });
        }
    };
    
    // Initial check
    checkAndDuplicate();
    
    // Check on window resize
    window.addEventListener('resize', checkAndDuplicate);
    const video = document.getElementById('myVideo');
    const playButton = document.getElementById('playButton');
    const fullscreenButton = document.getElementById('fullscreenButton');

    if (playButton) {
        playButton.addEventListener('click', function () {
            if (video.paused) {
                video.play();
                playButton.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                video.pause();
                playButton.innerHTML = '<i class="fas fa-play"></i>';
            }
        });
    }

    if (fullscreenButton) {
        fullscreenButton.addEventListener('click', function () {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            } else if (video.msRequestFullscreen) {
                video.msRequestFullscreen();
            }
        });
    }

    function updatePlayButton() {
        if (video.paused) {
            playButton.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            playButton.innerHTML = '<i class="fas fa-pause"></i>';
        }
    }

    document.addEventListener('fullscreenchange', updatePlayButton);
    document.addEventListener('webkitfullscreenchange', updatePlayButton);
    document.addEventListener('mozfullscreenchange', updatePlayButton);
    document.addEventListener('MSFullscreenChange', updatePlayButton);
});

// Video play/pause functionality
const promoVideo = document.getElementById('promo-video');
const videoContainer = document.querySelector('.video-container');

// Add play/pause icon overlay
const playPauseOverlay = document.createElement('div');
playPauseOverlay.className = 'play-pause-overlay';
playPauseOverlay.innerHTML = '<i class="fas fa-pause"></i>';
videoContainer.appendChild(playPauseOverlay);

function togglePlayPause() {
    if (promoVideo.paused) {
        promoVideo.play();
        playPauseOverlay.innerHTML = '<i class="fas fa-pause"></i>';
        playPauseOverlay.classList.remove('paused');
    } else {
        promoVideo.pause();
        playPauseOverlay.innerHTML = '<i class="fas fa-play"></i>';
        playPauseOverlay.classList.add('paused');
    }
}

videoContainer.addEventListener('click', togglePlayPause);

// Hide overlay after a few seconds of playing
let overlayTimeout;
function hideOverlay() {
    if (!promoVideo.paused) {
        playPauseOverlay.classList.add('fade-out');
    }
}

function showOverlay() {
    playPauseOverlay.classList.remove('fade-out');
    clearTimeout(overlayTimeout);
    overlayTimeout = setTimeout(hideOverlay, 2000);
}

videoContainer.addEventListener('mousemove', showOverlay);
promoVideo.addEventListener('play', () => {
    overlayTimeout = setTimeout(hideOverlay, 2000);
});

// Carousel Navigation
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const prev = document.querySelector('.carousel-nav.prev');
    const next = document.querySelector('.carousel-nav.next');
    const track2 = document.querySelector('.carousel-track2');
    const prev2 = document.querySelector('.carousel-nav.prev2');
    const next2 = document.querySelector('.carousel-nav.next2');
    let position = 0;
    const slideWidth = 100 / 6; // Show 6 items at a time

    // Reset animation when it completes
    track.addEventListener('animationend', () => {
        track.style.animation = 'none';
        track.offsetHeight; // Trigger reflow
        track.style.animation = null;
    });
    
    track2.addEventListener('animationend', () => {
        track2.style.animation = 'none';
        track2.offsetHeight; // Trigger reflow
        track2.style.animation = null;
    });
    
    // Navigation click handlers
    prev.addEventListener('click', () => {
        position = Math.min(position + slideWidth, 0);
        track.style.transform = `translateX(${position}%)`;
        track.style.animation = 'none';
    });

    prev2.addEventListener('click', () => {
        position = Math.min(position + slideWidth, 0);
        track2.style.transform = `translateX(${position}%)`;
        track2.style.animation = 'none';
    });

    next.addEventListener('click', () => {
        position = Math.max(position - slideWidth, -50);
        track.style.transform = `translateX(${position}%)`;
        track.style.animation = 'none';
    });
    next2.addEventListener('click', () => {
        position = Math.max(position - slideWidth, -50);
        track2.style.transform = `translateX(${position}%)`;
        track2.style.animation = 'none';
    });

    // Reset animation when mouse leaves the carousel
    track.addEventListener('mouseleave', () => {
        if (!track.style.animation) {
            track.style.animation = 'carousel 45s linear infinite';
            position = 0;
        }
    });

    // Function to handle video play state
    function handleVideoPlay(iframe) {
        const allIframes = document.querySelectorAll('.carousel-item iframe');
        allIframes.forEach((item) => {
            if (item !== iframe) {
                item.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":[]}', '*');
            }
        });
        // Bring the playing video to the front
        iframe.parentElement.style.zIndex = '10';
    }

    // Add event listeners to iframes for play events
    const iframes = document.querySelectorAll('.carousel-item iframe');
    iframes.forEach((iframe) => {
        iframe.addEventListener('load', () => {
            iframe.contentWindow.postMessage('{"event":"command","func":"addEventListener","args":["onStateChange"]}', '*');
        });
        window.addEventListener('message', (event) => {
            if (event.origin === 'https://www.youtube.com/') {
                const data = JSON.parse(event.data);
                if (data.event === 'onStateChange' && data.info === 1) { // Video is playing
                    handleVideoPlay(iframe);
                }
            }
        });
    });

    // code for scroll animation
// Get the button
const scrollUpBtn = document.getElementById("scrollUpBtn");

// Show the button when scrolling down
window.onscroll = function() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollUpBtn.style.display = "block";
    } else {
        scrollUpBtn.style.display = "none";
    }
};

// Scroll to the top when the button is clicked
scrollUpBtn.onclick = function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};
});


// Form Submission

document.getElementById("gform").addEventListener("submit", function(e) {
  e.preventDefault();

  const form = e.target;
  const data = new FormData(form);
  const scriptURL = "https://script.google.com/macros/s/AKfycbw1b_cjnWpdbfqms57A6m9azPkA9vKMMu5P4e6jWlhfeNPI4qrk3-U6rLVlhhYHw5LD/exec"; // replace this

  fetch(scriptURL, {
    method: "POST",
    body: data
  })
    .then(() => {
      alert("✅ Your message has been sent!");
      form.reset();
    })
    .catch(error => {
      console.error("Error!", error.message);
      alert("❌ Submission failed.");
    });
});



    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });


      const questions = document.querySelectorAll('.faq-question');
  questions.forEach(q => {
    q.addEventListener('click', () => {
      const answer = q.nextElementSibling;
      answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
    });
  });