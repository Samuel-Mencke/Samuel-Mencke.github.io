// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    }
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Language Switcher
const languageButtons = document.querySelectorAll('.language-switch button');
languageButtons.forEach(button => {
    button.addEventListener('click', () => {
        languageButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

// Age Calculator
function calculateAge() {
    const birthDate = new Date('2010-01-01'); // Hier dein Geburtsdatum eintragen
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

// Update age in the about section
document.addEventListener('DOMContentLoaded', () => {
    const ageElement = document.querySelector('.age');
    if (ageElement) {
        ageElement.textContent = calculateAge();
    }
    
    // Fetch GitHub stats
    fetchGitHubStats();
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for fade-in animation
document.querySelectorAll('.project-card, .skill-category, .about-highlights .highlight').forEach(el => {
    el.classList.add('fade-in-element');
    observer.observe(el);
});

// Animated stats counter
const stats = document.querySelectorAll('.stat-number');
const animateStats = () => {
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50;
        const updateCount = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.ceil(current) + (stat.textContent.includes('+') ? '+' : '');
                requestAnimationFrame(updateCount);
            } else {
                stat.textContent = target + (stat.textContent.includes('+') ? '+' : '');
            }
        };
        updateCount();
    });
};

// Trigger stats animation when stats section is in view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// GitHub Stats Integration
async function fetchGitHubStats() {
    const username = 'Samuel-Mencke';
    const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-Website'
    };

    try {
        // Fetch basic user data
        const userResponse = await fetch(`https://api.github.com/users/${username}`, { headers });
        if (!userResponse.ok) {
            throw new Error(`Failed to fetch user data: ${userResponse.status}`);
        }
        const userData = await userResponse.json();
        
        // Update basic stats
        document.getElementById('githubRepos').textContent = userData.public_repos;
        document.getElementById('githubStars').textContent = userData.followers;
        
        // Fetch repositories for language stats and recent projects
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, { headers });
        if (!reposResponse.ok) {
            throw new Error(`Failed to fetch repositories: ${reposResponse.status}`);
        }
        const reposData = await reposResponse.json();
        
        // Calculate language statistics
        const languages = {};
        let totalBytes = 0;
        
        for (const repo of reposData) {
            if (repo.language) {
                languages[repo.language] = (languages[repo.language] || 0) + 1;
                totalBytes += 1;
            }
        }
        
        // Sort languages by usage
        const sortedLanguages = Object.entries(languages)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);
        
        // Update language stats
        const languageStats = document.getElementById('languageStats');
        if (languageStats) {
            languageStats.innerHTML = sortedLanguages
                .map(([language, count]) => {
                    const percentage = ((count / totalBytes) * 100).toFixed(1);
                    return `
                        <div class="language-bar">
                            <div class="language-info">
                                <span class="language-name">${language}</span>
                                <span class="language-percentage">${percentage}%</span>
                            </div>
                            <div class="language-progress">
                                <div class="language-progress-bar" style="width: ${percentage}%"></div>
                            </div>
                        </div>
                    `;
                })
                .join('');
        }
        
        // Update recent projects
        const recentProjects = document.getElementById('recentProjects');
        if (recentProjects) {
            recentProjects.innerHTML = reposData
                .slice(0, 5)
                .map(repo => `
                    <div class="recent-project">
                        <div class="recent-project-name">
                            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a>
                        </div>
                        <div class="recent-project-description">${repo.description || 'Keine Beschreibung verfügbar'}</div>
                        <div class="recent-project-meta">
                            <span><i class="fas fa-code-branch"></i> ${repo.language || 'N/A'}</span>
                            <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                            <span><i class="fas fa-code"></i> ${repo.size} KB</span>
                        </div>
                    </div>
                `)
                .join('');
        }
        
        // Fetch contribution data
        const contributionResponse = await fetch(`https://api.github.com/users/${username}/events`, { headers });
        if (!contributionResponse.ok) {
            throw new Error(`Failed to fetch contribution data: ${contributionResponse.status}`);
        }
        const contributionData = await contributionResponse.json();
        
        // Calculate commits and contributions
        const commits = contributionData.filter(event => event.type === 'PushEvent').length;
        const contributions = contributionData.length;
        
        const commitsElement = document.getElementById('githubCommits');
        const contributionsElement = document.getElementById('githubContributions');
        
        if (commitsElement) commitsElement.textContent = commits;
        if (contributionsElement) contributionsElement.textContent = contributions;
        
        // Animate numbers
        animateNumbers();
    } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        // Fallback values if API fails
        const elements = {
            'githubRepos': '0',
            'githubStars': '0',
            'githubCommits': '0',
            'githubContributions': '0'
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    }
}

function animateNumbers() {
    const elements = document.querySelectorAll('.stat-number');
    elements.forEach(element => {
        const finalValue = parseInt(element.textContent);
        let currentValue = 0;
        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = finalValue / steps;
        const stepDuration = duration / steps;
        
        const counter = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                element.textContent = finalValue;
                clearInterval(counter);
            } else {
                element.textContent = Math.floor(currentValue);
            }
        }, stepDuration);
    });
}

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };
        
        try {
            // Hier würde normalerweise der API-Endpunkt für das Kontaktformular stehen
            console.log('Form submitted:', data);
            
            // Erfolgsmeldung anzeigen
            showNotification('Nachricht erfolgreich gesendet!', 'success');
            contactForm.reset();
        } catch (error) {
            console.error('Error submitting form:', error);
            showNotification('Fehler beim Senden der Nachricht.', 'error');
        }
    });
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Project card hover effects
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    const overlay = card.querySelector('.project-overlay');
    
    card.addEventListener('mouseenter', () => {
        overlay.style.opacity = '1';
        card.style.transform = 'translateY(-15px)';
    });
    
    card.addEventListener('mouseleave', () => {
        overlay.style.opacity = '0';
        card.style.transform = 'translateY(0)';
    });
});

// Skill tags animation
const skillTags = document.querySelectorAll('.skill-tags span');
skillTags.forEach(tag => {
    tag.addEventListener('mouseover', function() {
        this.style.transform = 'scale(1.1) translateY(-3px)';
        this.style.boxShadow = '0 5px 15px rgba(37, 99, 235, 0.3)';
    });
    
    tag.addEventListener('mouseout', function() {
        this.style.transform = 'scale(1) translateY(0)';
        this.style.boxShadow = 'none';
    });
});

// Highlight active section in navigation
function highlightNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const scroll = window.scrollY;
        
        if (scroll >= sectionTop - 200 && scroll < sectionTop + sectionHeight - 200) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                const sectionId = section.id;
                if (link.getAttribute('href') === '#' + sectionId) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// Navbar shrink and Home FAB logic
const homeFab = document.querySelector('.home-fab');
let lastScrollY = window.scrollY;
let ticking = false;

function updateNavbar() {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 50) {
        navbar.classList.add('shrink');
        homeFab.classList.add('visible');
    } else {
        navbar.classList.remove('shrink');
        homeFab.classList.remove('visible');
    }
    
    lastScrollY = currentScroll;
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateNavbar);
        ticking = true;
    }
});

// Initial check
updateNavbar();

// Smooth scroll for home fab
homeFab.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Parallax effect for hero section
const hero = document.querySelector('.hero');
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
});

// Initialize tooltips
document.querySelectorAll('[data-tooltip]').forEach(element => {
    element.addEventListener('mouseenter', (e) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = e.target.dataset.tooltip;
        document.body.appendChild(tooltip);
        
        const rect = e.target.getBoundingClientRect();
        tooltip.style.top = `${rect.bottom + 5}px`;
        tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
    });
    
    element.addEventListener('mouseleave', () => {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    });
}); 