
import {
  PDFDocument,
  degrees,
  rgb,
  StandardFonts,
  PDFFont,
  PDFPage,
} from "pdf-lib";
// import fontkit from "@pdf-lib/fontkit";

// ------------------- Data ------------------
// horizontal 'y'
const columns = [
  { name: "Everett", min: 110, max: 163 },
  { name: "Bellingham", min: 163, max: 225 },
  { name: "P.T", min: 225, max: 273 },
  { name: "Tacoma", min: 273, max: 323 },
  { name: "Olympia", min: 323, max: 375 },
  { name: "Tukwila", min: 375, max: 425 },
  { name: "Albany", min: 425, max: 473 },
  { name: "Bremerton", min: 473, max: 535 },
  { name: "Portland", min: 535, max: 585 },
  { name: "Vancouver", min: 585, max: 639 },
  { name: "Burlington", min: 639, max: 686 },
];

// vertial 'x'
const rows = [
  { name: "M6", min: 100, max: 139 },
  { name: "M9", min: 139, max: 178 },
  { name: "DA", min: 178, max: 217 },
  { name: "EA", min: 217, max: 255 },
  { name: "E", min: 255, max: 294 },
  { name: "M60", min: 294, max: 332 },
  { name: "M90", min: 332, max: 371 },
  { name: "M122", min: 371, max: 410 },
  { name: "misc_1", min: 410, max: 448 },
  { name: "misc_2", min: 448, max: 486 },
  { name: "test", min: 501, max: 521 },
  { name: "revalve", min: 521, max: 541 },
  { name: "toggles", min: 541, max: 555 },
];

const fillsByRack = [
  {
    location: "Tukwila",
    lot: "P0404402",
    test: 8,
    toggles: 2,
    sizes: [
      { name: "M6", count: 1 },
      { name: "DA", count: 3 },
      { name: "EA", count: 37 },
    ],
  },
  {
    location: "Albany",
    sizes: [
      {name: "EA", count: 33},
      {name: "DA", count: 18},
      {name: "M6", count: 3},
    ],
    toggles: 1,
    lot: "P0425401"
  },
  {
    location: "Tukwila",
    sizes: [
      {name: "EA", count: 29},
    ],
    lot: "P0424402"
  },
  {
    location: "Tukwila",
    sizes: [
      {name: "DA", count: 30},
    ],
    lot: "P0424402"
  },
  {
    location: "Tukwila",
    sizes: [
      {name: "EA", count: 40},
    ],
    lot: "P0424402"
  },
  {
    location: "Burlington",
    sizes: [
      {name: "EA", count: 7},
      {name: "DA", count: 2},
      {name: "M6", count: 2},
    ],
    lot: "P0424401"
  }
];

// ------------Main Functions --------------
/** @type {PDFDocument} */
let pdfDoc ;
/** @type {PDFFont} */
let font ;
/** @type {PDFPage} */
let page ;

/** 
 * Create BHC Form Main Function
 * @param {string} url - file path of BHC pdf 
 * */
export async function createBHCPDF(url){
  
 pdfDoc = await PDFDocument.load(
  await getPdfArrayBuffer(url),
);
 font = await pdfDoc.embedFont(StandardFonts.Courier);
 page = pdfDoc.getPages()[0];
drawBHCFills("P0424401")
drawBHCFills("P0424402")
drawBHCFills("P0425401")
const pdfBytes = await pdfDoc.saveAsBase64({ dataUri: true });
  return pdfBytes
}

// ------------ Functions ---------------

function drawBHCFills(lot) {
  const lotTextSize = 9;
  const rotated = true;

  const racks = fillsByRack.filter((r) => r.lot == lot);
  const fills = combineObjects(racks);
  console.log("fills: ", fills)
  fills.forEach((fill) => {
    const sizes = []
    fill.sizes.forEach((size) => {
      sizes.push(size.name)
      drawText(fill.location, size.name, size.count);
    });
    const box = arrowHelper(fill.location, sizes)
    drawCurly(box)
    drawText(fill.location, box.arrowBox, lot , lotTextSize, rotated)
    if(fill.test) drawText(fill.location, "test", fill.test)
    if(fill.toggles) drawText(fill.location, "toggles", fill.toggles)
  });
}

function combineObjects(objects) {
  const combinedObject = {};

  objects.forEach((obj) => {
    if (!combinedObject[obj.location]) {
      combinedObject[obj.location] = {
        location: obj.location,
        sizes: [],
      };
    }
    
    if(obj.test) {
      if (!combinedObject[obj.location].test){
        combinedObject[obj.location].test = obj.test
      } else {
        combinedObject[obj.location].test += obj.test
      }
    }

    if(obj.toggles) {
      if (!combinedObject[obj.location].toggles){
        combinedObject[obj.location].toggles = obj.toggles
      } else {
        combinedObject[obj.location].toggles += obj.toggles
      }
    }

    obj.sizes.forEach((size) => {
      const existingSize = combinedObject[obj.location].sizes.find(
        (s) => s.name === size.name,
      );
      if (existingSize) {
        existingSize.count += size.count;
      } else {
        combinedObject[obj.location].sizes.push({
          name: size.name,
          count: size.count,
        });
      }
    });
  });

  // Convert combinedObject from an object to an array of values
  return Object.values(combinedObject);
}

async function getPdfArrayBuffer(url) {
  const rawRequest = await fetch(url);
  const rawBytes = await rawRequest.blob();
  const arrayBuffer = await rawBytes.arrayBuffer();
  return arrayBuffer;
}

function drawCurly(box) {
  const boundingBox = box;
  const padding = 5;
  const rounding = 7;
  const arrowWidth = 5;
  const svgPath = `
M${boundingBox.left + padding},${boundingBox.top + padding} 
H${boundingBox.right - padding - rounding} 
c 0 0 ${rounding} 0 ${rounding} ${rounding}
V${boundingBox.arrowPosition - arrowWidth} 
l-${arrowWidth},${arrowWidth} 
l${arrowWidth},${arrowWidth} 
V${boundingBox.bottom - padding - rounding} 
c 0 0, 0 ${rounding}, -${rounding} ${rounding}
H${boundingBox.left + padding}`;

  page.drawSvgPath(svgPath, {
    x: 0,
    y: 0,
    borderColor: rgb(0.5, 0.5, 0.5),
    borderWidth: 2,
    borderOpacity: 0.75,
    rotate: degrees(90),
  });
}

function drawText(siteName, sizeName, text, fontSize = 13, angled = false) {
  let angle = 90;
  text = text.toString();
  let fontHeight = font.heightAtSize(fontSize);
  let fontWidth = font.widthOfTextAtSize(text, fontSize);
  const siteObj = site(siteName);
  const sizeObj = size(sizeName);

  if(angled){
    angle = 60;
    const newTextCenter = fontWidth / Math.sqrt(2)
    fontWidth = newTextCenter + 9;
    fontHeight = newTextCenter * -1 + 12
  }
  const centerWidth = siteObj.min + siteObj.diff / 2;
  const centerHeight = sizeObj.min + sizeObj.diff / 2;
  page.drawText(text, {
    x: centerHeight + fontHeight / 2,
    y: centerWidth - fontWidth / 2,
    size: fontSize,
    rotate: degrees(angle),
  });
}

/**
 * Create Helper for notch placement
 * @param {string[]} sizes
 * @param {string} location
 */
function arrowHelper(location, sizes) {
  // Get locations of size boxes that are in use
  const sizeLocations = [];
  sizes.forEach((sizeName) => {
    sizeLocations.push(size(sizeName));
  });
  let arrowBox = "";
  let sizeIds = sizeLocations.map((s) => s.id);
  // Get a location that is not used between min and max of used
  const missing = findMissing(sizeIds);
  sizeLocations.sort((a, b) => a.id - b.id)

  if (missing.length) arrowBox = size(rows[missing[0]].name);
  // if not find next box up (lower index)
  else if (Math.min(...sizeIds) !== 0) {
    const nextBoxUp = size(rows[Math.min(...sizeIds) - 1].name);
    arrowBox = nextBoxUp;
    sizeLocations.unshift(nextBoxUp);
  }
  // if not find next box down
  else {
    const nextBoxDown = size(rows[Math.max(...sizeIds) + 1].name);
    arrowBox = nextBoxDown;
    sizeLocations.push(nextBoxDown);
  }

  return {
    top: sizeLocations[0].min,
    right: site(location).max,
    bottom: sizeLocations.at(-1).max,
    left: site(location).min,
    arrowPosition: arrowBox.min + arrowBox.diff / 2,
    arrowBox: arrowBox.name
  };
}

/**
 * This is for the Y location
 * @param {string} name - name of BHC Location
 */
function site(name) {
  const foundSite = columns.find((column) => column.name === name);
  foundSite.id = columns.indexOf(foundSite);
  foundSite.diff = foundSite.max - foundSite.min;
  return foundSite;
}

/**
 * @param {number[]} num
 */
function findMissing(num) {
  const min = Math.min(...num);
  const max = Math.max(...num);

  const missing = [];
  for (let i = min; i <= max; i++) {
    if (!num.includes(i)) missing.push(i);
  }
  return missing;
}

/**
 * This is for the X location
 * @param {string} name - name of cylinder size
 */
function size(name) {
  const foundSize = rows.find((row) => row.name == name);
  foundSize.id = rows.indexOf(foundSize);
  foundSize.diff = foundSize.max - foundSize.min;
  return foundSize;
}
