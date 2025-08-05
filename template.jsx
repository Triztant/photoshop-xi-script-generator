// Web-generated Photoshop XI Script using layer-based replacement
var desktop = Folder('~/Desktop');

// Your 11 positions
var positions = ["GK","LB","LCB","RCB","RB","RCM","LCM","CM","LW","ST","RW"];

// Injected by the web UI
var imageFiles  = {{IMAGE_FILES}};
var teamFiles   = {{TEAM_FILES}};
var nationFiles = {{NATION_FILES}};

// Recursive finder for any ArtLayer or LayerSet by name
function findLayerByNameRecursive(parent, name) {
  // 1) Check artLayers
  for (var i = 0; i < parent.artLayers.length; i++) {
    if (parent.artLayers[i].name === name) {
      return parent.artLayers[i];
    }
  }
  // 2) Check layerSets
  for (var j = 0; j < parent.layerSets.length; j++) {
    var grp = parent.layerSets[j];
    if (grp.name === name) return grp;
    var found = findLayerByNameRecursive(grp, name);
    if (found) return found;
  }
  return null;
}

// Find the base layer anywhere, then grab the artLayer immediately above it
function findClippedLayerAbove(baseName) {
  var result = null;
  function recurse(container) {
    // artLayers in this container
    var al = container.artLayers;
    for (var i = 0; i < al.length; i++) {
      if (al[i].name === baseName && i > 0) {
        result = al[i - 1];
        return true;
      }
    }
    // dive into groups
    for (var j = 0; j < container.layerSets.length; j++) {
      if (recurse(container.layerSets[j])) return true;
    }
    return false;
  }
  recurse(app.activeDocument);
  return result;
}

// Helper to get last hyphen token
function getLastName(file) {
  var base = file.name.replace(/\.[^\.]+$/, "");
  var parts = base.split("-");
  return parts.length > 1 ? parts.pop() : base;
}

if (!app.documents.length) {
  alert("Open your template PSD first!");
  throw "No document open.";
}
var doc = app.activeDocument;

// --- 1) Players ---
for (var p = 0; p < positions.length; p++) {
  var posName   = positions[p],
      baseName  = posName + "_base",
      imgName   = imageFiles[p],
      file      = new File(desktop + "/PLAYER PF/" + imgName);

  if (!file.exists) {
    alert("Missing player image: " + imgName);
    continue;
  }
  var lastName = getLastName(file);

  // Find the old layer (flat or clipped)
  var oldLayer = findLayerByNameRecursive(doc, posName)
              || findClippedLayerAbove(baseName);
  if (!oldLayer) {
    alert('Could not find player layer "' + posName + '"');
    continue;
  }
  // record old bounds
  var b  = oldLayer.bounds,
      ol = b[0].as("px"), ot = b[1].as("px"),
      ow = b[2].as("px") - ol, oh = b[3].as("px") - ot;
  oldLayer.remove();

  // Find the base
  var base = findLayerByNameRecursive(doc, baseName);
  if (!base) {
    alert('Could not find base "' + baseName + '"');
    continue;
  }

  // Paste new image
  var nd = app.open(file);
  nd.selection.selectAll(); nd.selection.copy();
  nd.close(SaveOptions.DONOTSAVECHANGES);
  doc.paste();
  var nl = doc.activeLayer;
  nl.name = posName;
  nl.move(base, ElementPlacement.PLACEBEFORE);

  // Resize & reposition
  var nb = nl.bounds;
  var scale = Math.min(
    ow / (nb[2].as("px") - nb[0].as("px")),
    oh / (nb[3].as("px") - nb[1].as("px"))
  ) * 100;
  nl.resize(scale, scale, AnchorPosition.TOPLEFT);
  var rb = nl.bounds;
  nl.translate(ol - rb[0].as("px"), ot - rb[1].as("px"));
  nl.grouped = true;

  // Update text
  var txt = findLayerByNameRecursive(doc, posName + "_text");
  if (txt && txt.kind == LayerKind.TEXT) {
    txt.textItem.contents = lastName;
  }
}

// --- 2) Teams ---
for (var p = 0; p < positions.length; p++) {
  var posName   = positions[p],
      layerName = posName + "_team",
      baseName  = posName + "_team_base",
      imgName   = teamFiles[p],
      file      = new File(desktop + "/TEAMS/" + imgName);

  if (!file.exists) {
    alert("Missing team badge: " + imgName);
    continue;
  }

  var oldLayer = findLayerByNameRecursive(doc, layerName)
              || findClippedLayerAbove(baseName);
  if (!oldLayer) {
    alert('Could not find team layer "' + layerName + '"');
    continue;
  }
  var b  = oldLayer.bounds,
      ol = b[0].as("px"), ot = b[1].as("px"),
      ow = b[2].as("px") - ol, oh = b[3].as("px") - ot;
  oldLayer.remove();

  var base = findLayerByNameRecursive(doc, baseName);
  if (!base) {
    alert('Could not find team base "' + baseName + '"');
    continue;
  }

  var nd = app.open(file);
  nd.selection.selectAll(); nd.selection.copy();
  nd.close(SaveOptions.DONOTSAVECHANGES);
  doc.paste();
  var nl = doc.activeLayer;
  nl.name = layerName;
  nl.move(base, ElementPlacement.PLACEBEFORE);

  var nb = nl.bounds;
  var scale = Math.min(
    ow / (nb[2].as("px") - nb[0].as("px")),
    oh / (nb[3].as("px") - nb[1].as("px"))
  ) * 100;
  nl.resize(scale, scale, AnchorPosition.TOPLEFT);
  var rb = nl.bounds;
  nl.translate(ol - rb[0].as("px"), ot - rb[1].as("px"));
  nl.grouped = true;
}

// --- 3) Nations ---
for (var p = 0; p < positions.length; p++) {
  var posName   = positions[p],
      layerName = posName + "_nation",
      baseName  = posName + "_nation_base",
      imgName   = nationFiles[p],
      file      = new File(desktop + "/NATIONS/" + imgName);

  if (!file.exists) {
    alert("Missing flag: " + imgName);
    continue;
  }

  var oldLayer = findLayerByNameRecursive(doc, layerName)
              || findClippedLayerAbove(baseName);
  if (!oldLayer) {
    alert('Could not find nation layer "' + layerName + '"');
    continue;
  }
  var b  = oldLayer.bounds,
      ol = b[0].as("px"), ot = b[1].as("px"),
      ow = b[2].as("px") - ol, oh = b[3].as("px") - ot;
  oldLayer.remove();

  var base = findLayerByNameRecursive(doc, baseName);
  if (!base) {
    alert('Could not find nation base "' + baseName + '"');
    continue;
  }

  var nd = app.open(file);
  nd.selection.selectAll(); nd.selection.copy();
  nd.close(SaveOptions.DONOTSAVECHANGES);
  doc.paste();
  var nl = doc.activeLayer;
  nl.name = layerName;
  nl.move(base, ElementPlacement.PLACEBEFORE);

  var nb = nl.bounds;
  var scale = Math.min(
    ow / (nb[2].as("px") - nb[0].as("px")),
    oh / (nb[3].as("px") - nb[1].as("px"))
  ) * 100;
  nl.resize(scale, scale, AnchorPosition.TOPLEFT);
  var rb = nl.bounds;
  nl.translate(ol - rb[0].as("px"), ot - rb[1].as("px"));
  nl.grouped = true;
}

alert("All 11 positions, teams & nations have been updated!");
