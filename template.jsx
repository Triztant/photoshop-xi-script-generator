// Web-generated Photoshop XI Script using layer-based replacement
var desktop = Folder('~/Desktop');
var positions = ["GK","LB","LCB","RCB","RB","RCM","LCM","CM","LW","ST","RW"];
var imageFiles  = {{IMAGE_FILES}};
var teamFiles   = {{TEAM_FILES}};
var nationFiles = {{NATION_FILES}};

// Recursive find (in case layers live in groups)
function findLayerByName(parent, name) {
    for (var i = 0; i < parent.artLayers.length; i++) {
        if (parent.artLayers[i].name === name) return parent.artLayers[i];
    }
    for (var j = 0; j < parent.layerSets.length; j++) {
        var grp = parent.layerSets[j];
        if (grp.name === name) return grp;
        var found = findLayerByName(grp, name);
        if (found) return found;
    }
    return null;
}

function getLastName(file) {
    var base = file.name.replace(/\.[^\.]+$/, "");
    return base.split("-").pop();
}

if (!app.documents.length) {
    alert("Open your template PSD first!");
    throw "No document open.";
}
var doc = app.activeDocument;

function replaceLoop(suffix, files, folderName, baseSuffix, updateText) {
  for (var i = 0; i < positions.length; i++) {
    var posName   = positions[i],
        layerName = posName + suffix,
        baseName  = posName + baseSuffix,
        imgName   = files[i],
        inputFile = new File(desktop + "/" + folderName + "/" + imgName);

    if (!inputFile.exists) {
      alert("Missing file: " + imgName);
      continue;
    }

    // 1) locate the old layer & record its bounds
    var oldLayer = findLayerByName(doc, layerName);
    if (!oldLayer) {
      alert("Could not find layer: " + layerName);
      continue;
    }
    var ob = oldLayer.bounds,
        ol = ob[0].as("px"), ot = ob[1].as("px"),
        ow = ob[2].as("px") - ol, oh = ob[3].as("px") - ot;

    // 2) locate the base we’ll clip into
    var baseLayer = findLayerByName(doc, baseName);
    if (!baseLayer) {
      alert("Could not find base layer: " + baseName);
      continue;
    }

    // 3) open & copy the new image
    var nd = app.open(inputFile);
    nd.selection.selectAll(); nd.selection.copy();
    nd.close(SaveOptions.DONOTSAVECHANGES);

    // 4) paste it, rename, move just above the base
    doc.paste();
    var newLayer = doc.activeLayer;
    newLayer.name = layerName;
    newLayer.move(baseLayer, ElementPlacement.PLACEBEFORE);

    // 5) resize to the old bounds
    var nb = newLayer.bounds;
    var scale = Math.min(
      ow / (nb[2].as("px") - nb[0].as("px")),
      oh / (nb[3].as("px") - nb[1].as("px"))
    ) * 100;
    newLayer.resize(scale, scale, AnchorPosition.TOPLEFT);

    // 6) reposition to old x/y
    var rb = newLayer.bounds;
    newLayer.translate(ol - rb[0].as("px"), ot - rb[1].as("px"));

    // 7) clip to the base
    newLayer.grouped = true;

    // 8) *then* remove the old placeholder
    oldLayer.remove();

    // 9) update text if needed
    if (updateText) {
      var txt = findLayerByName(doc, layerName + "_text");
      if (txt && txt.kind == LayerKind.TEXT) {
        txt.textItem.contents = getLastName(inputFile);
      }
    }
  }
}

// Run for players (+ text), then teams, then nations
replaceLoop("",        imageFiles,  "PLAYER PF",   "_base",        true);
replaceLoop("_team",   teamFiles,   "TEAMS",       "_team_base",   false);
replaceLoop("_nation", nationFiles, "NATIONS",     "_nation_base", false);

alert("All 11 positions updated with players, teams & nations!");
