document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-links");
    const navbar = document.getElementById("navbar");
    
    // Toggle mobile menu
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });
    
    // Close mobile menu when a link is clicked
    document.querySelectorAll(".nav-links a").forEach(n => n.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    }));
    
    // Navbar scroll effect
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Particle Background
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedY = Math.random() * -0.5 - 0.2;
            this.speedX = (Math.random() - 0.5) * 0.4;
            // Mix of purple and cyan
            this.color = Math.random() > 0.5 ? 'rgba(124, 58, 237, 0.4)' : 'rgba(6, 182, 212, 0.4)';
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            if (this.y < 0) {
                this.y = canvas.height;
                this.x = Math.random() * canvas.width;
            }
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        const numberOfParticles = (canvas.height * canvas.width) / 15000;
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });

    // Custom Cursor Logic
    const cursor = document.getElementById('custom-cursor');
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Add hovering effect to interactive elements
        const interactives = document.querySelectorAll('a, button, input, textarea');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
        });
    } else {
        cursor.style.display = 'none';
    }

    // Three.js 3D Element Logic
    const heroCanvasContainer = document.getElementById('hero-3d-canvas');
    if (heroCanvasContainer && typeof THREE !== 'undefined') {
        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, heroCanvasContainer.clientWidth / heroCanvasContainer.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(heroCanvasContainer.clientWidth, heroCanvasContainer.clientHeight);
        heroCanvasContainer.appendChild(renderer.domElement);

        // Create glowing wireframe Tech Gem (Icosahedron)
        const geometry = new THREE.IcosahedronGeometry(1.8, 1);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x7c3aed, // Purple
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });
        const mainShape = new THREE.Mesh(geometry, material);
        scene.add(mainShape);

        // Add a secondary inner geometry for cyan glow
        const innerGeo = new THREE.IcosahedronGeometry(1.4, 0);
        const innerMat = new THREE.MeshBasicMaterial({ 
            color: 0x06b6d4, // Cyan
            wireframe: true,
            transparent: true,
            opacity: 0.4
        });
        const innerShape = new THREE.Mesh(innerGeo, innerMat);
        scene.add(innerShape);

        camera.position.z = 6;

        // Mouse interaction & Dragging
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;
        
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        document.addEventListener('mousedown', () => { isDragging = true; });
        document.addEventListener('mouseup', () => { isDragging = false; });

        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - windowHalfX);
            mouseY = (e.clientY - windowHalfY);
            
            if (isDragging) {
                const deltaMove = {
                    x: e.clientX - previousMousePosition.x,
                    y: e.clientY - previousMousePosition.y
                };
                
                mainShape.rotation.y += deltaMove.x * 0.01;
                mainShape.rotation.x += deltaMove.y * 0.01;
                innerShape.rotation.y += deltaMove.x * 0.01;
                innerShape.rotation.x += deltaMove.y * 0.01;
            }
            
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        // Animation Loop
        function animate3D() {
            requestAnimationFrame(animate3D);

            if (!isDragging) {
                // Auto rotation
                mainShape.rotation.x += 0.005;
                mainShape.rotation.y += 0.01;
                innerShape.rotation.x += 0.005;
                innerShape.rotation.y += 0.01;

                // Subtle follow mouse
                targetX = mouseX * 0.001;
                targetY = mouseY * 0.001;

                mainShape.rotation.y += 0.05 * (targetX - mainShape.rotation.y);
                mainShape.rotation.x += 0.05 * (targetY - mainShape.rotation.x);
                
                innerShape.rotation.y += 0.05 * (targetX - innerShape.rotation.y);
                innerShape.rotation.x += 0.05 * (targetY - innerShape.rotation.x);
            }

            renderer.render(scene, camera);
        }

        animate3D();

        // Handle Resize
        window.addEventListener('resize', () => {
            if (heroCanvasContainer) {
                camera.aspect = heroCanvasContainer.clientWidth / heroCanvasContainer.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(heroCanvasContainer.clientWidth, heroCanvasContainer.clientHeight);
            }
        });
    }
});
