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
  },
});

const heatGlobe = new THREE.Mesh(heatGlobeGeometry, heatGlobeMaterial);
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
camera.position.x = 2;
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
controls.enableDamping = true;
controls.enableZoom = false;

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
  heatGlobe.rotation.y = time * 0.0002;

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

const loaderAnimation = () => {
  clutterAnimation(".loader-cont>h1");
  clutterAnimation(".loader-cont>h3");
  const tl = gsap.timeline();
  tl.from(".loader-cont>h1>span", {
    opacity: 0,
    scale: 0,
    y: 50,
    stagger: {
      amount: 1.8,
    },
  });
  tl.from(".loader-cont>h3>span", {
    opacity: 0,
    scale: 0,
    y: 30,
    stagger: {
      amount: 1.8,
    },
  });

  tl.to(
    ".loader-cont>h1>span",
    {
      opacity: 0,
      scale: 0,
      y: 50,
      stagger: {
        amount: -1.8,
      },
    },
    "same"
  );
  tl.to(
    ".loader-cont>h3>span",
    {
      opacity: 0,
      scale: 0,
      y: 30,
      stagger: {
        amount: -1.8,
      },
    },
    "same"
  );

  const video = document.querySelector("video");
  video.playbackRate = 1.4;

  tl.to(".loader", {
    delay: 1,
    opacity: 0,
  });

  // Page1 animations start
  clutterAnimation(".page1-heading>h1");

  tl.from(
    ".page1-heading>h1>span",
    {
      opacity: 0,
      scale: 0,
      y: 30,
      stagger: {
        amount: 1,
      },
    },
    "a"
  );

  tl.from(
    heatGlobe.position,
    {
      x: -2,
      duration: 2,
    },
    "a"
  );

  tl.from(
    heatGlobeGroup.rotation,
    {
      y: -Math.PI,
      duration: 2,
    },
    "a"
  );

  tl.from(
    heatGlobe.scale,
    {
      x: 0,
      y: 0,
      z: 0,
      duration: 2,
    },
    "a"
  );

  tl.from(".interval-loader", {
    opacity: 0,
    scaleX: 0,
  });

  clutterAnimation(".y2024>h3");
  clutterAnimation(".y2030>h3");
  clutterAnimation(".y2040>h3");
  clutterAnimation(".y2050>h3");
  clutterAnimation(".y2060>h3");
  clutterAnimation(".y2070>h3");
  clutterAnimation(".y2080>h3");
  clutterAnimation(".y2090>h3");
  clutterAnimation(".y2100>h3");

  tl.from(".years h3 span", {
    opacity: 0,
    scaleX: 0,
    y: 40,
    stagger: {
      amount: 1.2,
    },
  });

  clutterAnimation(".heat");
  clutterAnimation(".co2");

  tl.from(".switch>h1>span,.switch>h1:nth-child(2)", {
    opacity: 0,
    y: 30,
    stagger: {
      amount: 0.5,
    },
  });
  tl.from(".blue-bar", {
    transform: "scaleX(0)",
  });
};
loaderAnimation();

const page2Animation = () => {
  clutterAnimation(".page2-left>h1");
  const tl = gsap.timeline();
  tl.from(".page2-left>h1>span", {
    opacity: 0,
    scale: 0,
    y: 50,
    stagger: {
      amount: 1,
    },
    scrollTrigger: {
      scroller: "body",
      trigger: ".page2",
      start: "top 70%",
      end: "top 40%",
      scrub: 1,
      // markers: true,
    },
  });

  clutterAnimation(".heat2");
  clutterAnimation(".co22");

  tl.from(".switch2>h1>span,.switch2>h1:nth-child(2)", {
    opacity: 0,
    y: 30,
    stagger: {
      amount: 0.5,
    },
    scrollTrigger: {
      scroller: "body",
      trigger: ".page2",
      start: "top 50%",
      end: "top 30%",
      scrub: 1,
      // markers: true,
    },
  });
  tl.from(".blue-bar2", {
    transform: "scaleX(0)",
    scrollTrigger: {
      scroller: "body",
      trigger: ".page2",
      start: "top 30%",
      end: "top 0%",
      scrub: 1,
      // markers: true,
    },
  });

  tl.to(".webgl", {
    transform: "translate(-15%,10%)",
    scrollTrigger: {
      scroller: "body",
      trigger: ".page2",
      start: "top 100%",
      end: "top 0%",
      scrub: 1,
    },
  });
};
page2Animation();

let flag = "heat";
let globalIndex = 0;
const switchHeatAndCO2 = () => {
  const heat = document.querySelector(".heat");
  heat.addEventListener("click", () => {
    heatGlobeMaterial.uniforms.uTextures.value =
      loadedHeatTextures[globalIndex];

    gsap.to(".blue-bar", {
      left: 0,
      width: "30%",
    });
    flag = "heat";
  });
  const co2 = document.querySelector(".co2");
  co2.addEventListener("click", () => {
    heatGlobeMaterial.uniforms.uTextures.value = loadedCO2Textures[globalIndex];

    gsap.to(".blue-bar", {
      left: "77%",
      width: "25%",
    });
    flag = "co2";
  });

  const heat2 = document.querySelector(".heat2");
  heat2.addEventListener("click", () => {
    heatGlobeMaterial.uniforms.uTextures.value =
      loadedHeatTextures[globalIndex];

    gsap.to(".blue-bar2", {
      left: 0,
      width: "30%",
    });
    flag = "heat";
  });
  const co22 = document.querySelector(".co22");
  co22.addEventListener("click", () => {
    heatGlobeMaterial.uniforms.uTextures.value = loadedCO2Textures[globalIndex];

    gsap.to(".blue-bar2", {
      left: "77%",
      width: "25%",
    });
    flag = "co2";
  });
};
switchHeatAndCO2();

const yearsAnimation = () => {
  const allYears = document.querySelectorAll(".years > div");
  allYears.forEach((year, index) => {
    year.addEventListener("click", () => {
      gsap.to(".main-circle", {
        left: 12.1 * index + "%",
      });
      if (flag === "heat") {
        heatGlobeMaterial.uniforms.uTextures.value = loadedHeatTextures[index];
      }
      if (flag === "co2") {
        heatGlobeMaterial.uniforms.uTextures.value = loadedCO2Textures[index];
      }
      globalIndex = index;
    });
  });
};
yearsAnimation();
