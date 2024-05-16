// Importing the libraries

import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Lenis js

const lenisJs = () => {
  const lenis = new Lenis();

  lenis.on("scroll", (e) => {});

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 500);
  });

  gsap.ticker.lagSmoothing(0);
};
lenisJs();

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
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
  clutterAnimation(".page0-cont>h1");
  clutterAnimation(".page0-cont>h3");
  const tl = gsap.timeline();
  tl.from(".page0-cont>h1>span", {
    opacity: 0,
    scale: 0,
    y: 50,
    delay:1,
    stagger: {
      amount: 1,
    },
  });
  tl.from(".page0-cont>h3>span", {
    opacity: 0,
    scale: 0,
    y: 30,
    stagger: {
      amount: 1,
    },
    onComplete: () => {
      document.body.style.overflow = "initial";
      document.documentElement.style.overflow = "initial";
    },
  });

  tl.to(".page0-cont>h1>span", {
    opacity: 0,
    scale: 0,
    y: 50,
    stagger: {
      amount: -1,
    },
    scrollTrigger: {
      scroller: "body",
      trigger: ".page0",
      start: "top 0%",
      end: "top -50%",
      scrub: 1,
    },
  });
  tl.to(".page0-cont>h3>span", {
    opacity: 0,
    scale: 0,
    y: 30,
    stagger: {
      amount: -1,
    },
    scrollTrigger: {
      scroller: "body",
      trigger: ".page0",
      start: "top 0%",
      end: "top -50%",
      scrub: 1,
    },
  });

  // Page1 animations start
  clutterAnimation(".page1-heading>h1");

  tl.from(".page1-heading>h1>span", {
    opacity: 0,
    scale: 0,
    y: 30,
    stagger: {
      amount: 1,
    },
    scrollTrigger: {
      scroller: "body",
      trigger: ".page1",
      start: "top 50%",
      end: "top 0%",
      scrub: 1,
    },
  });

 

  tl.from(".interval-loader", {
    opacity: 0,
    scaleX: 0,
    scrollTrigger: {
      scroller: "body",
      trigger: ".page1",
      start: "top 40%",
      end: "top 20%",
      scrub: 1,
    },
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
    scrollTrigger: {
      scroller: "body",
      trigger: ".page1",
      start: "top 30%",
      end: "top 10%",
      scrub: 1,
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
    scrollTrigger: {
      scroller: "body",
      trigger: ".page1",
      start: "top 30%",
      end: "top 0%",
      scrub: 1,
    },
  });
  tl.from(".blue-bar", {
    transform: "scaleX(0)",
    scrollTrigger: {
      scroller: "body",
      trigger: ".page1",
      start: "top 30%",
      end: "top 0%",
      scrub: 1,
    },
  });
};
page0Animation();


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

  clutterAnimation(".page2-right-para1>h3");
  clutterAnimation(".page2-right-end>h3");
  gsap.from(".page2-right-para1>h3>span,.page2-right-end>h3>span", {
    opacity: 0,
    scale: 0,
    stagger: { amount: 1 },
    scrollTrigger: {
      scroller: "body",
      trigger: ".page2",
      start: "top 0%",
      end: "top -30%",
      scrub: 1,
    },
  });
  gsap.from(".page2-line", {
    scale: 0,
    scrollTrigger: {
      scroller: "body",
      trigger: ".page2",
      start: "top 0%",
      end: "top -30%",
      scrub: 1,
    },
  });
};
page2Animation();