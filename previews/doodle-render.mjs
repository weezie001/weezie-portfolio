// <stdin>
import React2 from "react";
import { renderToStaticMarkup } from "react-dom/server";

// src/components/Doodles.jsx
var RED = "#DE3B2C";
var BLUE = "#2f6bff";
var GREEN = "#6DA23A";
var INK = "#17150F";
var EYE = "#F5EFDD";
var S = { className: "h-full w-full", viewBox: "0 0 40 40", xmlns: "http://www.w3.org/2000/svg" };
var DOODLES = {
  crown: () => /* @__PURE__ */ React.createElement("svg", { ...S }, /* @__PURE__ */ React.createElement("path", { d: "M7 27 L10 12 L15 22 L20 9 L25 22 L30 12 L33 27", fill: "none", stroke: RED, strokeWidth: "3.2", strokeLinejoin: "round", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("path", { d: "M8 31 H32", stroke: RED, strokeWidth: "3.2", strokeLinecap: "round" })),
  eye: () => /* @__PURE__ */ React.createElement("svg", { ...S }, /* @__PURE__ */ React.createElement("path", { d: "M5 20 Q20 9 35 20 Q20 31 5 20 Z", fill: "none", stroke: INK, strokeWidth: "2.6", strokeLinejoin: "round" }), /* @__PURE__ */ React.createElement("circle", { cx: "20", cy: "20", r: "4.4", fill: INK }), /* @__PURE__ */ React.createElement("path", { d: "M20 5 v3.5 M11 8 l1.6 2.8 M29 8 l-1.6 2.8", stroke: INK, strokeWidth: "2.2", strokeLinecap: "round" })),
  star: () => /* @__PURE__ */ React.createElement("svg", { ...S }, /* @__PURE__ */ React.createElement("g", { stroke: GREEN, strokeWidth: "3", strokeLinecap: "round" }, /* @__PURE__ */ React.createElement("line", { x1: "20", y1: "6", x2: "20", y2: "34" }), /* @__PURE__ */ React.createElement("line", { x1: "8", y1: "13", x2: "32", y2: "27" }), /* @__PURE__ */ React.createElement("line", { x1: "32", y1: "13", x2: "8", y2: "27" }))),
  x: () => /* @__PURE__ */ React.createElement("svg", { ...S }, /* @__PURE__ */ React.createElement("g", { stroke: INK, strokeWidth: "3.4", strokeLinecap: "round" }, /* @__PURE__ */ React.createElement("line", { x1: "11", y1: "11", x2: "29", y2: "29" }), /* @__PURE__ */ React.createElement("line", { x1: "29", y1: "11", x2: "11", y2: "29" }))),
  dots: () => /* @__PURE__ */ React.createElement("svg", { ...S }, /* @__PURE__ */ React.createElement("g", { fill: INK }, /* @__PURE__ */ React.createElement("circle", { cx: "20", cy: "10", r: "2.6" }), /* @__PURE__ */ React.createElement("circle", { cx: "20", cy: "20", r: "2.6" }), /* @__PURE__ */ React.createElement("circle", { cx: "20", cy: "30", r: "2.6" }))),
  ring: () => /* @__PURE__ */ React.createElement("svg", { ...S }, /* @__PURE__ */ React.createElement("circle", { cx: "20", cy: "20", r: "12", fill: "none", stroke: BLUE, strokeWidth: "3.4" })),
  ringRed: () => /* @__PURE__ */ React.createElement("svg", { ...S }, /* @__PURE__ */ React.createElement("circle", { cx: "20", cy: "20", r: "11.5", fill: "none", stroke: RED, strokeWidth: "4.6" })),
  arc: () => /* @__PURE__ */ React.createElement("svg", { ...S }, /* @__PURE__ */ React.createElement("path", { d: "M8 14 Q20 35 32 14", fill: "none", stroke: GREEN, strokeWidth: "3.6", strokeLinecap: "round" })),
  faceBlue: () => /* @__PURE__ */ React.createElement("svg", { ...S }, /* @__PURE__ */ React.createElement("rect", { x: "7", y: "7", width: "26", height: "26", rx: "7", fill: BLUE }), /* @__PURE__ */ React.createElement("rect", { x: "14.5", y: "15", width: "3", height: "8", rx: "1.5", fill: EYE }), /* @__PURE__ */ React.createElement("rect", { x: "22.5", y: "15", width: "3", height: "8", rx: "1.5", fill: EYE })),
  faceGreen: () => /* @__PURE__ */ React.createElement("svg", { ...S }, /* @__PURE__ */ React.createElement("rect", { x: "7", y: "7", width: "26", height: "26", rx: "7", fill: GREEN }), /* @__PURE__ */ React.createElement("rect", { x: "14.5", y: "15", width: "3", height: "8", rx: "1.5", fill: EYE }), /* @__PURE__ */ React.createElement("rect", { x: "22.5", y: "15", width: "3", height: "8", rx: "1.5", fill: EYE })),
  faceRed: () => /* @__PURE__ */ React.createElement("svg", { ...S }, /* @__PURE__ */ React.createElement("rect", { x: "7", y: "7", width: "26", height: "26", rx: "7", fill: RED }), /* @__PURE__ */ React.createElement("rect", { x: "14.5", y: "15", width: "3", height: "8", rx: "1.5", fill: EYE }), /* @__PURE__ */ React.createElement("rect", { x: "22.5", y: "15", width: "3", height: "8", rx: "1.5", fill: EYE })),
  wave: () => /* @__PURE__ */ React.createElement("svg", { ...S }, /* @__PURE__ */ React.createElement("path", { d: "M5 22 q3.75 -8 7.5 0 t7.5 0 t7.5 0 t7.5 0", fill: "none", stroke: INK, strokeWidth: "3", strokeLinecap: "round" })),
  bee: () => /* @__PURE__ */ React.createElement("svg", { ...S }, /* @__PURE__ */ React.createElement("path", { d: "M14 7 Q31 9 22 20 Q32 22 22 33 Q17 34 14 33", fill: "none", stroke: BLUE, strokeWidth: "3.2", strokeLinejoin: "round", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("line", { x1: "14", y1: "7", x2: "14", y2: "33", stroke: BLUE, strokeWidth: "3.2", strokeLinecap: "round" }))
};
var DOODLE_NAMES = Object.keys(DOODLES);
function Doodle({ name, className = "", style }) {
  const render = DOODLES[name];
  if (!render) return null;
  return /* @__PURE__ */ React.createElement("span", { className, style, "aria-hidden": "true" }, render());
}

// <stdin>
var mark = (name) => renderToStaticMarkup(React2.createElement(Doodle, { name }));
export {
  mark
};
