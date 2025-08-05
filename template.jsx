// Web-generated Photoshop XI Script using layer-based replacement
var desktop = Folder('~/Desktop');

// 11 positions in the exact same order as your form
var positions = [
  "GK","LB","LCB","RCB","RB",
  "RCM","LCM","CM","LW","ST","RW"
];

// These get replaced by script.js
var imageFiles  = {{IMAGE_FILES}};   // ["player-one.png", …]
var teamFiles   = {{TEAM_FILES}};    // ["TEAM_ONE.png", …]
var nationFiles = {{NATION_FILES}};  // ["Flag_of_England_…png", …]

// Helper: get the layer *just above* a named base layer
function findClippedLayer(baseName) {
  var layers = doc.layers;
  for (var i = 0; i < layers.length; i++) {
    if (layers[i].name === baseName && i > 0) {
      return layers[i - 1];      // the layer directly above
    }
  }
  return null;
}

// Helper: fallback flat lookup
function findLayerByName(name) {
  try {
    return doc.layers.byName(name);
  } catch (e) {
    return null;
  }
}

// Helper: pull last hyphen token for text layers
function getLastName(file) {
  var base = file.name.replace(/\.[^\.]+$/, "");
  return base.split("-").pop();
}

if (!app.documents.length) {
  alert("Open your template PSD first!");
  throw "No document open.";
}
var doc = app.activeDocument;

// Generic replacement loop (players, then teams, then nations)
function replaceLoop(suffix, files, folder, baseSuffix, updateText) {
  for (var i = 0; i < positions.length; i++) {
    var posName    = positions[i],
        layerName  = posName + suffix,
        baseName   = posName + baseSuffix,
        imgName    = files[i],
        inputFile  = new File(desktop + "/" + folder + "/" + imgName);

    if (!inputFile.exists) {
      alert("Missing file: " + imgName);
      continue;
    }

    // 1) find & remove old layer
    var layer = findLayerByName(layerName)
              || findClippedLayer(baseName);
    if (!layer) {
      alert("Could not find layer: " + layerName + " or its clipped smart object.");
      continue;
    }
    var b  = layer.bounds,
        ol = b[0].as("px"),
        ot = b[1].as("px"),
        ow = b[2].as("px") - ol,
        oh = b[3].as("px") - ot;
    layer.remove();

    // 2) find the base that we’ll clip into
    var base = findLayerByName(baseName);
    if (!base) {
      alert("Could not find base layer: " + baseName);
      continue;
    }

    // 3) open, copy & close the new image
    var nd = app.open(inputFile);
    nd.selection.selectAll();
    nd.selection.copy();
    nd.close(SaveOptions.DONOTSAVECHANGES);

    // 4) paste it back
    doc.paste();
    var nl = doc.activeLayer;
    nl.name = layerName;
    nl.move(base, ElementPlacement.PLACEBEFORE);

    // 5) resize proportionally
    var nb    = nl.bounds,
        scale = Math.min(
          ow / (nb[2].as("px") - nb[0].as("px")),
          oh / (nb[3].as("px") - nb[1].as("px"))
        ) * 100;
    nl.resize(scale, scale, AnchorPosition.TOPLEFT);

    // 6) reposition precisely
    var rb = nl.bounds;
    nl.translate(ol - rb[0].as("px"), ot - rb[1].as("px"));

    // 7) clip to the base
    nl.grouped = true;

    // 8) if it’s a player, also update the text layer
    if (updateText) {
      var txt = findLayerByName(posName + "_text");
      if (txt && txt.kind === LayerKind.TEXT) {
        txt.textItem.contents = getLastName(inputFile);
      }
    }
  }
}

// Run each of the three loops
replaceLoop("",        imageFiles,  "PLAYER PF",   "_base",        true);   // players + text
replaceLoop("_team",   teamFiles,   "TEAMS",       "_team_base",   false);  // team badges
replaceLoop("_nation", nationFiles, "NATIONS",     "_nation_base", false);  // national flags

alert("All positions updated with players, teams & nations!");
