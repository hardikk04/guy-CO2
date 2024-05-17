import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

gsap.registerPlugin(ScrollTrigger, Draggable);

/**
 * Scene
 */
const scene = new THREE.Scene();
const heatGlobeGroup = new THREE.Group();
scene.add(heatGlobeGroup);

// Canvas
const canvas = document.querySelector(".webgl");

/**
 * Loader
 */
const textureLoader = new THREE.TextureLoader();
const heatmap = textureLoader.load("textures/HeatMap.png");
heatmap.colorSpace = THREE.SRGBColorSpace;

// Heat textures
const heatTextures = [
  "textures/Heat/2024.png",
  "textures/Heat/2030.png",
  "textures/Heat/2040.png",
  "textures/Heat/2050.png",
  "textures/Heat/2060.png",
  "textures/Heat/2070.png",
  "textures/Heat/2080.png",
  "textures/Heat/2090.png",
  "textures/Heat/2100.png",
];

const loadedHeatTextures = heatTextures.map((texture) => {
  const t = textureLoader.load(texture);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
});

// CO2 textures
const CO2Textures = [
  "textures/CO2/2024.png",
  "textures/CO2/2030.png",
  "textures/CO2/2040.png",
  "textures/CO2/2050.png",
  "textures/CO2/2060.png",
  "textures/CO2/2070.png",
  "textures/CO2/2080.png",
  "textures/CO2/2090.png",
  "textures/CO2/2100.png",
];

const loadedCO2Textures = CO2Textures.map((texture) => {
  const t = textureLoader.load(texture);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
});

/**
 * heatGlobe
 */
const heatGlobeGeometry = new THREE.SphereGeometry(2.2);
const heatGlobeMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {
    uTextures: new THREE.Uniform(loadedHeatTextures[0]),
    uPrevTextures: new THREE.Uniform(loadedHeatTextures[0]),
    uAlpha: new THREE.Uniform(1),
  },
});

const heatGlobe = new THREE.Mesh(heatGlobeGeometry, heatGlobeMaterial);
heatGlobe.scale.set(0.9, 0.9, 0.9);
heatGlobeGroup.add(heatGlobe);

/**
 * Sizes
 */
const sizes = {};
sizes.width = window.innerWidth;
sizes.height = window.innerHeight;

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 5;
// camera.position.x = -2;
scene.add(camera);

/**
 * Resize
 */
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  renderer.setSize(sizes.width, sizes.height);
});

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
renderer.setSize(sizes.width, sizes.height);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableZoom = false;
controls.enablePan = false;
controls.enableDamping = true;
controls.minPolarAngle = 0.4 * Math.PI;
controls.maxPolarAngle = 0.4 * Math.PI;

/**
 * Clock
 */
let time = Date.now();

/**
 * Tick
 */
const tick = () => {
  // Time
  const currentTime = Date.now();
  const deltaTime = currentTime - time;
  time = currentTime;

  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(tick);
};
tick();

const clutterAnimation = (element) => {
  const htmlTag = document.querySelector(element);
  let clutter = "";

  // Wraps each letter in a span with a class for animation
  htmlTag.textContent.split("").forEach((word) => {
    clutter += `<span class="inline-block">${word}</span>`;
  });

  // Replaces the element's content with the animated spans
  htmlTag.innerHTML = clutter;
};

const page0Animation = () => {
  const tl = gsap.timeline();

  tl.from(heatGlobe.position, {
    y: -5,
    x: -4,
    scrollTrigger: {
      scroller: "body",
      trigger: ".page1",
      start: "top 70%",
      end: "top 20%",
      scrub: 1,
    },
  });

  tl.from(heatGlobeGroup.rotation, {
    y: -Math.PI,
    scrollTrigger: {
      scroller: "body",
      trigger: ".page1",
      start: "top 70%",
      end: "top 0%",
      scrub: 1,
    },
  });

  tl.from(heatGlobe.scale, {
    x: 0,
    y: 0,
    z: 0,
    scrollTrigger: {
      scroller: "body",
      trigger: ".page1",
      start: "top 70%",
      end: "top 20%",
      scrub: 1,
    },
    onComplete: () => {
      controls.autoRotate = true;
    },
  });
};
page0Animation();

let flag = "heat";
let globalIndex = 0;
let prevIndex = 0;
const switchHeatAndCO2 = () => {
  const heat = document.querySelector(".heat");
  heat.addEventListener("click", () => {
    gsap.from(heatGlobeMaterial.uniforms.uAlpha, {
      value: 0,
      duration: 1,
    });
    heatGlobeMaterial.uniforms.uPrevTextures.value =
      loadedCO2Textures[prevIndex];
    heatGlobeMaterial.uniforms.uTextures.value =
      loadedHeatTextures[globalIndex];

    gsap.to(".blue-bar,.blue-bar2", {
      left: 0,
      width: "30%",
    });
    flag = "heat";
  });
  const co2 = document.querySelector(".co2");
  co2.addEventListener("click", () => {
    gsap.from(heatGlobeMaterial.uniforms.uAlpha, {
      value: 0,
      duration: 1,
    });
    heatGlobeMaterial.uniforms.uPrevTextures.value =
      loadedHeatTextures[prevIndex];
    heatGlobeMaterial.uniforms.uTextures.value = loadedCO2Textures[globalIndex];

    gsap.to(".blue-bar,.blue-bar2", {
      left: "77%",
      width: "25%",
    });

    flag = "co2";
  });

  const heat2 = document.querySelector(".heat2");
  heat2.addEventListener("click", () => {
    gsap.from(heatGlobeMaterial.uniforms.uAlpha, {
      value: 0,
      duration: 1,
    });
    heatGlobeMaterial.uniforms.uPrevTextures.value =
      loadedCO2Textures[canvasIndex];
    heatGlobeMaterial.uniforms.uTextures.value =
      loadedHeatTextures[canvasIndex];

    gsap.to(".blue-bar2,.blue-bar", {
      left: 0,
      width: "30%",
    });
    flag = "heat";
  });
  const co22 = document.querySelector(".co22");
  co22.addEventListener("click", () => {
    gsap.from(heatGlobeMaterial.uniforms.uAlpha, {
      value: 0,
      duration: 1,
    });
    heatGlobeMaterial.uniforms.uPrevTextures.value =
      loadedHeatTextures[canvasIndex];
    heatGlobeMaterial.uniforms.uTextures.value = loadedCO2Textures[canvasIndex];

    gsap.to(".blue-bar2,.blue-bar", {
      left: "77%",
      width: "25%",
    });
    flag = "co2";
  });
};
switchHeatAndCO2();

const pointerBlinkWithCicrcle = () => {
  const tl = gsap.timeline();

  tl.to(".main-circle", {
    scale: 0.3,
    ease: "linear",
    duration: 0.5,
  });

  tl.to(
    ".main-circle",
    {
      scale: 1,
      ease: "linear",
      duration: 0.5,
    },
    "same"
  );
  tl.from(
    ".inner-circle",
    {
      scale: 3,
      opacity: 1,
      ease: "linear",
      duration: 0.5,
    },
    "same"
  );
  tl.to(".main-circle", {
    scale: 0.3,
    ease: "linear",
    duration: 0.5,
  });
  tl.to(".main-circle", {
    scale: 1,
    ease: "linear",
    duration: 0.5,
  });
  tl.from(
    ".inner-circle",
    {
      scale: 3,
      opacity: 1,
      ease: "linear",
      duration: 0.5,
    },
    "same"
  );
  tl.to(".main-circle", {
    scale: 0.3,
    ease: "linear",
    duration: 0.5,
  });
  tl.to(".main-circle", {
    scale: 1,
    ease: "linear",
    duration: 0.5,
  });
  tl.from(
    ".inner-circle",
    {
      scale: 3,
      opacity: 1,
      ease: "linear",
      duration: 0.5,
    },
    "same"
  );
  tl.to(".inner-circle", {
    opacity: 0,
  });
};
const pointerBlinkWithoutCicrcle = () => {
  const tl = gsap.timeline();

  tl.to(".main-circle", {
    scale: 0.3,
    ease: "linear",
    duration: 0.5,
  });

  tl.to(
    ".main-circle",
    {
      scale: 1,
      ease: "linear",
      duration: 0.5,
    },
    "same"
  );

  tl.to(".main-circle", {
    scale: 0.3,
    ease: "linear",
    duration: 0.5,
  });
  tl.to(".main-circle", {
    scale: 1,
    ease: "linear",
    duration: 0.5,
  });

  tl.to(".main-circle", {
    scale: 0.3,
    ease: "linear",
    duration: 0.5,
  });
  tl.to(".main-circle", {
    scale: 1,
    ease: "linear",
    duration: 0.5,
  });

  tl.to(".inner-circle", {
    opacity: 0,
  });
};

const yearsAnimation = () => {
  const allYears = document.querySelectorAll(".years > div");
  allYears.forEach((year, index) => {
    year.addEventListener("click", () => {
      prevIndex = globalIndex;
      gsap.to(".main-circle", {
        left: 12.1 * index + "%",
        onComplete: () => {
          if (index === 0 || index === 8) {
            pointerBlinkWithoutCicrcle();
          } else {
            pointerBlinkWithCicrcle();
          }
        },
      });
      if (flag === "heat") {
        gsap.from(heatGlobeMaterial.uniforms.uAlpha, {
          value: 0,
          duration: 1.5,
        });
        heatGlobeMaterial.uniforms.uPrevTextures.value =
          loadedHeatTextures[prevIndex];
        heatGlobeMaterial.uniforms.uTextures.value = loadedHeatTextures[index];
      }
      if (flag === "co2") {
        gsap.from(heatGlobeMaterial.uniforms.uAlpha, {
          value: 0,
          duration: 1.5,
        });
        heatGlobeMaterial.uniforms.uPrevTextures.value =
          loadedCO2Textures[prevIndex];
        heatGlobeMaterial.uniforms.uTextures.value = loadedCO2Textures[index];
      }
      globalIndex = index;
    });
  });
};
yearsAnimation();

let canvasIndex = 0;
const canvasAnimation = () => {
  const canvas = document.querySelector(".page2 canvas");
  const context = canvas.getContext("2d");

  const page2Right = document
    .querySelector(".page2-right")
    .getBoundingClientRect();

  canvas.width = page2Right.width + 350;
  canvas.height = page2Right.height + 100;

  window.addEventListener("resize", function () {
    canvas.width = page2Right.width + 350;
    canvas.height = page2Right.height + 100;
    render();
  });

  let renderImg = ``;
  for (let i = 0; i < 320; i++) {
    renderImg += `temp/frame${i}.png
    `;
  }

  function files(index) {
    var data = renderImg;
    return data.split("\n")[index];
  }

  const frameCount = 320;

  const images = [];
  const imageSeq = {
    frame: 1,
  };

  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = files(i);
    images.push(img);
  }

  gsap.to(imageSeq, {
    frame: frameCount - 1,
    snap: "frame",
    ease: `none`,
    scrollTrigger: {
      scrub: 0.15,
      trigger: `.page2 canvas`,
      //   set start end according to preference
      start: `top top`,
      end: `top -250%`,
      scroller: `body`,
    },
    onUpdate: render,
  });

  images[1].onload = render;

  clutterAnimation(".page2-right-point1>h3");
  clutterAnimation(".page2-right-point2>h3");

  function render() {
    scaleImage(images[imageSeq.frame], context);
    if (imageSeq.frame === 20) {
      const tl = gsap.timeline();
      tl.to(".page2-line-point1", {
        scale: 0,
      });
      tl.to(".page2-right-point1>h3>span", {
        opacity: 0,
        stagger: {
          amount: 0.5,
        },
      });
    }
    if (imageSeq.frame === 40) {
      const tl = gsap.timeline();
      tl.to(".page2-line-point1", {
        scale: 1,
      });
      tl.to(".page2-right-point1>h3>span", {
        opacity: 1,
        scale: 1,
        stagger: {
          amount: 0.5,
        },
      });
    }

    if (imageSeq.frame === 195) {
      const tl = gsap.timeline();
      tl.to(".page2-line-point2", {
        scale: 0,
      });
      tl.to(".page2-right-point2>h3>span", {
        opacity: 0,
        stagger: {
          amount: 0.5,
        },
      });
    }

    if (imageSeq.frame === 214) {
      const tl = gsap.timeline();
      tl.to(".page2-line-point2", {
        scale: 1,
      });
      tl.to(".page2-right-point2>h3>span", {
        opacity: 1,
        scale: 1,
        stagger: {
          amount: 0.5,
        },
      });
    }

    if (flag === "heat") {
      if (imageSeq.frame < 36) {
        canvasIndex = 0;
        heatGlobeMaterial.uniforms.uTextures.value = loadedHeatTextures[0];
      } else if (imageSeq.frame < 72) {
        canvasIndex = 1;
        heatGlobeMaterial.uniforms.uTextures.value = loadedHeatTextures[1];
      } else if (imageSeq.frame < 108) {
        canvasIndex = 2;
        heatGlobeMaterial.uniforms.uTextures.value = loadedHeatTextures[2];
      } else if (imageSeq.frame < 144) {
        canvasIndex = 3;
        heatGlobeMaterial.uniforms.uTextures.value = loadedHeatTextures[3];
      } else if (imageSeq.frame < 180) {
        canvasIndex = 4;
        heatGlobeMaterial.uniforms.uTextures.value = loadedHeatTextures[4];
      } else if (imageSeq.frame < 216) {
        canvasIndex = 5;
        heatGlobeMaterial.uniforms.uTextures.value = loadedHeatTextures[5];
      } else if (imageSeq.frame < 252) {
        canvasIndex = 6;
        heatGlobeMaterial.uniforms.uTextures.value = loadedHeatTextures[6];
      } else if (imageSeq.frame < 288) {
        canvasIndex = 7;
        heatGlobeMaterial.uniforms.uTextures.value = loadedHeatTextures[7];
      } else {
        canvasIndex = 8;
        heatGlobeMaterial.uniforms.uTextures.value = loadedHeatTextures[8];
      }
    } else {
      if (imageSeq.frame < 36) {
        canvasIndex = 0;
        heatGlobeMaterial.uniforms.uTextures.value = loadedCO2Textures[0];
      } else if (imageSeq.frame < 72) {
        canvasIndex = 1;
        heatGlobeMaterial.uniforms.uTextures.value = loadedCO2Textures[1];
      } else if (imageSeq.frame < 108) {
        canvasIndex = 2;
        heatGlobeMaterial.uniforms.uTextures.value = loadedCO2Textures[2];
      } else if (imageSeq.frame < 144) {
        canvasIndex = 3;
        heatGlobeMaterial.uniforms.uTextures.value = loadedCO2Textures[3];
      } else if (imageSeq.frame < 180) {
        canvasIndex = 4;
        heatGlobeMaterial.uniforms.uTextures.value = loadedCO2Textures[4];
      } else if (imageSeq.frame < 216) {
        canvasIndex = 5;
        heatGlobeMaterial.uniforms.uTextures.value = loadedCO2Textures[5];
      } else if (imageSeq.frame < 252) {
        canvasIndex = 6;
        heatGlobeMaterial.uniforms.uTextures.value = loadedCO2Textures[6];
      } else if (imageSeq.frame < 288) {
        canvasIndex = 7;
        heatGlobeMaterial.uniforms.uTextures.value = loadedCO2Textures[7];
      } else {
        canvasIndex = 8;
        heatGlobeMaterial.uniforms.uTextures.value = loadedCO2Textures[8];
      }
    }
  }

  function scaleImage(img, ctx) {
    var canvas = ctx.canvas;
    var hRatio = canvas.width / img.width;
    var vRatio = canvas.height / img.height;
    var ratio = Math.max(hRatio, vRatio);
    var centerShift_x = (canvas.width - img.width * ratio) / 2;
    var centerShift_y = (canvas.height - img.height * ratio) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShift_x,
      centerShift_y,
      img.width * ratio,
      img.height * ratio
    );
  }
  ScrollTrigger.create({
    trigger: ".page2",
    pin: true,
    // markers:true,
    scroller: `body`,
    //   set start end according to preference
    start: `top top`,
    end: `top -250%`,
  });
};

canvasAnimation();
