const svgNS = "http://www.w3.org/2000/svg";

export function createSVGContainer(parent, width, height) {
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", width.toString());
  svg.setAttribute("height", height.toString());
  svg.setAttribute("viewBox",  `0 0 ${ width } ${ height }`);

  parent.appendChild(svg);
  return svg;
}

export function createLine(parent, x1, y1, x2, y2, color = "black") {
  const line = document.createElementNS(svgNS, "line");
  line.setAttribute("x1", x1.toString());
  line.setAttribute("y1", y1.toString());
  line.setAttribute("x2", x2.toString());
  line.setAttribute("y2", y2.toString());
  line.setAttribute("stroke", color);

  parent.appendChild(line);
  return line;
}

export function createCircle(parent, cx, cy, r, color = "black") {
  const circle = document.createElementNS(svgNS, "circle");
  circle.setAttribute("cx", cx.toString());
  circle.setAttribute("cy", cy.toString());
  circle.setAttribute("r", r.toString());
  circle.setAttribute("stroke", color);
  circle.setAttribute("fill", "white");

  parent.appendChild(circle);
  return circle;
}