// Web-generated Photoshop XI Script: players, teams & nations
var desktop = Folder('~/Desktop');

// Fixed list of positions
var positions = [
  "GK","LB","LCB","RCB","RB",
  "RCM","LCM","CM","LW","ST","RW"
];

// Dynamically injected filename arrays (align with positions)
var imageFiles  = {{IMAGE_FILES}};   // e.g. ["ryan-gravenberch.png", …]
var teamFiles   = {{TEAM_FILES}};    // e.g. ["SL_BENFICA.png", …]
var nationFiles = {{NATION_FILES}};  // e.g. ["flag_of_england_flat-round-256x256.png", …]

// Helper: extract last token after hyphens
function getLastName(file) {
  var nameOnly = file.name.replace(/\.[^\.]+$/, "");
  var parts   = nameOnly.split("-");
  return parts.length>1 ? parts.pop() : nameOnly;
}

if (!app.documents.length) {
  alert("Open your template PSD first!");
  throw "No document open.";
}
var doc = app.activeDocument;

function replaceLayer(pos, suffix, files, folderName, baseSuffix) {
  var baseName = pos + baseSuffix;
  var layerName = pos + suffix;
  var imgName = files.shift();
  var file = new File(desktop + '/' + folderName + '/' + imgName);
  if (!file.exists) {
    alert("Missing " + suffix + ": " + imgName);
    return;
  }
  var last = getLastName(file);

  // Find & remove old layer
  var target = doc.layers.byName(layerName);
  var bounds = target.bounds;
  var origLeft = bounds[0].as('px'), origTop = bounds[1].as('px');
  var origW = bounds[2].as('px') - origLeft;
  var origH = bounds[3].as('px') - origTop;
  target.remove();

  // Find base layer
  var base = doc.layers.byName(baseName);

  // Open & copy new image
  var newDoc = app.open(file);
  newDoc.selection.selectAll(); newDoc.selection.copy();
  newDoc.close(SaveOptions.DONOTSAVECHANGES);

  // Paste, name, clip, resize, reposition
  doc.paste();
  var nl = doc.activeLayer;
  nl.name = layerName;
  nl.move(base, ElementPlacement.PLACEBEFORE);

  var nb = nl.bounds;
  var nw = nb[2].as('px') - nb[0].as('px');
  var nh = nb[3].as('px') - nb[1].as('px');
  nl.resize(Math.min(origW/nw, origH/nh)*100, Math.min(origW/nw, origH/nh)*100, AnchorPosition.TOPLEFT);
  var rb = nl.bounds;
  nl.translate(origLeft - rb[0].as('px'), origTop - rb[1].as('px'));
  nl.grouped = true;

  // Update text layer for players & nations
  if (suffix !== '_team') {
    var txt = doc.layers.byName(layerName + '_text');
    if (txt.kind == LayerKind.TEXT) txt.textItem.contents = last;
  }
}

// Process all three
var pf = imageFiles.slice();
var tf = teamFiles.slice();
var nf = nationFiles.slice();
for (var i=0; i<positions.length; i++) {
  replaceLayer(positions[i], '',   pf, 'PLAYER PF', '_base');
  replaceLayer(positions[i], '_team', tf, 'TEAMS', '_team_base');
  replaceLayer(positions[i], '_nation', nf, 'NATIONS', '_nation_base');
}

alert("All layers updated: players, teams & nations!");
