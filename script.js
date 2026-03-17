const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

// Canvas ko full screen set karna
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// --- Global Configurations ---
let particlesArray = [];
let maxParticles = 300;
let connectionDistance = 100;
let interactionMode = 'repel'; // 'repel' ya 'attract'

let themeColorHex = '#00ffff';
let themeColorRgb = '0, 255, 255'; // Hex ko RGB me todna zaroori hai opacity ke liye

// Hex color ko RGB me convert karne ka chhota sa function
function hexToRgb(hex) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
}

// --- Input Tracking (Mouse & Touch) ---
// Mobile aur PC dono ke coordinates track karne ke liye
let pointer = {
    x: null,
    y: null,
    radius: 150, // Kitne area me force kaam karega
    active: false
};

// PC Mouse Events
window.addEventListener('mousemove', (e) => {
    pointer.x = e.x;
    pointer.y = e.y;
    pointer.active = true;
});
window.addEventListener('mouseout', () => pointer.active = false);

// Mobile Touch Events
window.addEventListener('touchstart', (e) => {
    pointer.x = e.touches[0].clientX;
    pointer.y = e.touches[0].clientY;
    pointer.active = true;
});
window.addEventListener('touchmove', (e) => {
    pointer.x = e.touches[0].clientX;
    pointer.y = e.touches[0].clientY;
});
window.addEventListener('touchend', () => pointer.active = false);

// Handle Window Resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init(); // Screen resize par particles reset karein
});

// --- Particle Class (Physics Engine Core) ---
// --- Particle Class (Physics Engine Core) ---
class Particle {
        constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
        
        // 3D Depth / Parallax Math
        // Jo particle bada hai (size zyada hai), wo tez chalega. 
        // Jo chhota hai, wo dheere chalega (jaise background me ho).
        let speedMultiplier = this.size * 0.5; 
        this.vx = ((Math.random() * 2) - 1) * speedMultiplier;
        this.vy = ((Math.random() * 2) - 1) * speedMultiplier;
        
        // Particle ki energy track karne ke liye (Sparks ke liye)
        this.energy = 0; 
    }

        draw() {
        ctx.beginPath();
        let currentSize = this.size + (this.energy / 100);
        ctx.arc(this.x, this.y, currentSize, 0, Math.PI * 2);
        
        if (this.energy > 10) {
            // OPTIMIZED: Slow shadowBlur hata diya. Ab white glowing color fill use hoga.
            ctx.fillStyle = `rgba(255, 255, 255, ${this.energy / 255})`;
        } else {
            ctx.fillStyle = `rgb(${themeColorRgb})`;
        }
        
        ctx.fill(); // Render complete
    }

    update() {
        // Kinematics
        this.x += this.vx;
        this.y += this.vy;

        // Energy dheere-dheere kam hoti hai (Cooling down)
        if (this.energy > 0) this.energy -= 4; 
        else this.energy = 0;

        // Wall Collision (Deewar se takrane par Spark nikalna)
        if (this.x < 0 || this.x > canvas.width) {
            this.vx *= -1;
            this.energy = 255; // Full energy on crash
        }
        if (this.y < 0 || this.y > canvas.height) {
            this.vy *= -1;
            this.energy = 255; // Full energy on crash
        }

        // Pointer Interaction Physics
        if (pointer.active) {
            let dx = pointer.x - this.x;
            let dy = pointer.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < pointer.radius) {
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let force = (pointer.radius - distance) / pointer.radius;
                
                let directionX = forceDirectionX * force * this.density;
                let directionY = forceDirectionY * force * this.density;

                if (interactionMode === 'repel') {
                    this.x -= directionX;
                    this.y -= directionY;
                    // Agar mouse bahut tezi se paas aaya, toh spark generate hoga
                    if (force > 0.8) this.energy = 255; 
                } 
                else if (interactionMode === 'attract') {
                    this.x += directionX * 0.5;
                    this.y += directionY * 0.5;
                    // Agar center ke bahut paas aaye (Black hole center), toh spark
                    if (distance < 20) this.energy = 255; 
                } 
                else if (interactionMode === 'vortex') {
                    // VORTEX MATHS: Tangent Vector (-dy, dx) banakar circular motion dena
                    let tangentX = -dy / distance;
                    let tangentY = dx / distance;

                    // Thoda sa center ki taraf kheenchna (direction) + gol ghumana (tangent)
                    this.x += (tangentX * force * this.density * 1.5) + (directionX * force * 0.1);
                    this.y += (tangentY * force * this.density * 1.5) + (directionY * force * 0.1);
                    
                    // Vortex me tezi se ghoomne par friction/energy heat up hoti hai
                    if (force > 0.5) this.energy = Math.min(this.energy + 10, 255);
                }
            }
        }
    }
}

// --- Initialization ---
function init() {
    particlesArray = [];
    for (let i = 0; i < maxParticles; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        particlesArray.push(new Particle(x, y));
    }
}

// --- Network Connections (Optimized) ---
function connectParticles() {
    let opacity = 1;
    // O(n^2) loop optimization
    for (let a = 0; a < particlesArray.length; a++) {
        // b = a + 1 karne se double calculations bach jati hain!
        for (let b = a + 1; b < particlesArray.length; b++) { 
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            
            // SMART CHECK: Pehle sasta 'Math.abs' check karo
            // Agar particles ek square (bounding box) ke bahar hain, toh doori naapne ki zaroorat hi nahi!
            if (Math.abs(dx) < connectionDistance && Math.abs(dy) < connectionDistance) {
                
                // Agar paas hain, tabhi mehenga 'Math.sqrt' chalao
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    opacity = 1 - (distance / connectionDistance);
                    ctx.strokeStyle = `rgba(${themeColorRgb}, ${opacity})`;
                    ctx.lineWidth = 1;
                    
                    // Line draw karo
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }
}

// --- Animation Loop ---
let lastTime = 0;
const fpsElement = document.getElementById('fps-counter');

function animate(timeStamp) {
    // FPS Calculation
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    fpsElement.innerText = Math.round(1000 / deltaTime);

    ctx.fillStyle = 'rgba(5, 5, 5, 0.2)'; // 0.2 opacity purane frames ko fade karegi
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update and Draw particles
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    
    connectParticles(); // Draw lines
    
    requestAnimationFrame(animate); // Loop
}

// --- UI Event Listeners ---
document.getElementById('particle-count').addEventListener('input', (e) => {
    maxParticles = e.target.value;
    document.getElementById('count-val').innerText = maxParticles;
    init(); // Recreate array with new count
});

document.getElementById('particle-color').addEventListener('input', (e) => {
    themeColorHex = e.target.value;
    themeColorRgb = hexToRgb(themeColorHex); // Update RGB format
});

document.getElementById('connection-radius').addEventListener('input', (e) => {
    connectionDistance = e.target.value;
    document.getElementById('radius-val').innerText = connectionDistance;
});

const modeBtn = document.getElementById('btn-mode');
modeBtn.addEventListener('click', () => {
    if (interactionMode === 'repel') {
        interactionMode = 'attract';
        modeBtn.innerText = 'Mode: Attract (Gravity)';
        modeBtn.style.background = 'rgba(0, 255, 0, 0.2)'; // Green tint
    } else if (interactionMode === 'attract') {
        interactionMode = 'vortex';
        modeBtn.innerText = 'Mode: Vortex (Orbit)';
        modeBtn.style.background = 'rgba(255, 0, 255, 0.2)'; // Purple tint
    } else {
        interactionMode = 'repel';
        modeBtn.innerText = 'Mode: Repel (Shield)';
        modeBtn.style.background = 'transparent';
    }
});

// Start Engine
init();
animate(0);
