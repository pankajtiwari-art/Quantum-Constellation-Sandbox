# 🌌 Quantum Constellation: Advanced Physics Engine

[![Live Demo](https://img.shields.io/badge/Live_Demo-Explore_Now-cyan?style=for-the-badge&logo=vercel)](https://pankajtiwari-art.github.io/Quantum-Constellation-Sandbox/)

**Quantum Constellation** ek high-performance, interactive physics simulation hai jise **Vanilla JavaScript** aur **HTML5 Canvas** ka upyog karke banaya gaya hai. Ye project kinematics, angular momentum, aur 3D parallax effects ko ek 2D environment mein visually explore karne ke liye design kiya gaya hai.

👉 **[Experience the Simulation Here!](https://pankajtiwari-art.github.io/Quantum-Constellation-Sandbox/)**

---

## 🚀 Overview: The Engineering Behind the Art

Ye engine sirf ek simple animation nahi hai, balki ek "thinking system" hai jahan har particle physics ke rules aur user input par react karta hai.

### 1. 🌀 Interactive Force Fields (Modes)
Engine mein teen alag interaction modes hain jo mouse ya touch ke hisaab se particles ke behaviour ko badalte hain:
* **Repel Mode (The Shield):** Particles ko pointer se door dhakelta hai.
* **Attract Mode (Gravity):** Particles ko pointer ki taraf kheencha jata hai.
* **Vortex Mode (Angular Momentum):** Tangent Vectors `(-dy, dx)` ka upyog karke pointer ke chaaron taraf ek swirling orbit (chakkar) banata hai.

### 2. ⚡ Kinetic Energy & Collision Sparks
Har particle apna **Internal Energy Level** track karta hai:
* Jab koi particle screen ki boundary se takrata hai ya high-velocity interaction karta hai, toh uski energy spike hoti hai.
* Ye energy visually ek **White Spark** effect mein badal jati hai.
* Dheere-dheere energy dissipate (thandi) ho jati hai aur particle apne normal color mein wapas aa jata hai.

### 3. 👓 3D Parallax & Depth Illusion
2D plane mein depth dikhane ke liye isme **Z-Axis Simulation** lagaya gaya hai:
* **Size-Velocity Scaling:** Bade particles ko "paas" mana jata hai aur wo tez move karte hain.
* **Density Mapping:** Bade particles ka wajan (density) zyada hota hai, jo unke reaction force ko affect karta.

### 4. ⚙️ Performance Optimization (Smooth 60 FPS)
Saikdon particles ke beech connections calculate karna kaafi heavy hota hai. Isse smooth rakhne ke liye humne use kiya hai:
* **Spatial Pruning:** Expensive calculations se pehle "Bounding Box" check taaki door waale particles ko ignore kiya ja sake.
* **Lightweight Rendering:** Shadow overheads ko hatakar RGBA alpha-blending ka use kiya gaya hai.

---

## 🛠️ Interface Controls

| Feature | Description |
| :--- | :--- |
| **Particle Count** | Field mein particles ki sankhya adjust karein (50 to 1000). |
| **Connection Radius** | Particles ke beech banne waali "Energy Lines" ki length control karein. |
| **Theme Color** | Puri simulation ka color live change karein. |
| **Interaction Mode** | Repel, Attract, aur Vortex physics ke beech switch karein. |

---

## 🧪 Physics Tests to Try

1. **The Galaxy Effect:** **Vortex Mode** select karein, particles ko `600` par set karein, aur screen ke center mein hold karein.
2. **The Supernova:** **Repel Mode** mein tezi se swipe karein taaki white energy sparks ki ek trail ban sake.
3. **Deep Space:** **Connection Radius** ko `0` par set karein aur **Theme Color** ko white karein taaki 3D Parallax effect ko depth mein dekh sakein.

---

## 📥 Local Setup

Is project ke liye kisi build tool ki zaroorat nahi hai.

1. Repository ko clone karein:
   ```bash
   git clone [https://github.com/PankajTiwari-art/Quantum-Constellation-Sandbox.git](https://github.com/PankajTiwari-art/Quantum-Constellation-Sandbox.git)
