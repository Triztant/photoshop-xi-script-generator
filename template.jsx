// Web-generated Photoshop XI Script using layer-based replacement
var desktop = Folder('~/Desktop');

// List of layer names (positions)
var positions = ["GK", "LB", "LCB", "RCB", "RB", "RCM", "LCM", "CM", "LW", "ST", "RW"];

// Dynamically injected filename arrays (must match positions order)
var imageFiles  = {{IMAGE_FILES}};   // player images
var teamFiles   = {{TEAM_FILES}};    // team badges
var nationFiles = {{NATION_FILES}};  // national flags

// Get last name from file name ("nathan-ake.png" → "ake")
function getLastName(file) {
    var nameOnly = file.name.replace(/\.[^\.]+$/, "");
    var parts = nameOnly.split("-");
    return parts.length > 1 ? parts.pop() : nameOnly;
}

if (!app.documents.length) {
    alert("Open your template PSD first!");
    throw "No document open.";
}
var doc = app.activeDocument;

// --- PLAYER IMAGES LOOP ---
for (var p = 0; p < positions.length; p++) {
    var posName   = positions[p];
    var baseName  = posName + "_base";
    var imageName = imageFiles[p];
    var inputFile = new File(desktop + '/PLAYER PF/' + imageName);

    if (!inputFile.exists) {
        alert("Missing player image: " + imageName);
        continue;
    }
    var lastName = getLastName(inputFile);

    // Find & remove old player layer
    var targetLayer = doc.layers.byName(posName);
    var bounds      = targetLayer.bounds;
    var origLeft    = bounds[0].as('px'),
        origTop     = bounds[1].as('px'),
        origWidth   = bounds[2].as('px') - origLeft,
        origHeight  = bounds[3].as('px') - origTop;
    targetLayer.remove();

    // Find base layer
    var baseLayer = doc.layers.byName(baseName);

    // Open, copy & paste new image
    var newDoc = app.open(inputFile);
    newDoc.selection.selectAll(); newDoc.selection.copy();
    newDoc.close(SaveOptions.DONOTSAVECHANGES);
    doc.paste();
    var newLayer = doc.activeLayer;
    newLayer.name = posName;
    newLayer.move(baseLayer, ElementPlacement.PLACEBEFORE);

    // Resize & reposition
    var nb = newLayer.bounds;
    var scale = Math.min(origWidth / (nb[2].as('px')-nb[0].as('px')),
                         origHeight / (nb[3].as('px')-nb[1].as('px'))) * 100;
    newLayer.resize(scale, scale, AnchorPosition.TOPLEFT);
    var rb = newLayer.bounds;
    newLayer.translate(origLeft - rb[0].as('px'), origTop - rb[1].as('px'));

    newLayer.grouped = true;

    // Update text layer
    var textLayer = doc.layers.byName(posName + "_text");
    if (textLayer.kind == LayerKind.TEXT) {
        textLayer.textItem.contents = lastName;
    }
}

// --- TEAM BADGES LOOP ---
for (var p = 0; p < positions.length; p++) {
    var posName   = positions[p];
    var baseName  = posName + "_team_base";
    var imageName = teamFiles[p];
    var inputFile = new File(desktop + '/TEAMS/' + imageName);

    if (!inputFile.exists) {
        alert("Missing team badge: " + imageName);
        continue;
    }
    var layerName = posName + "_team";
    var layer     = doc.layers.byName(layerName);
    var bounds    = layer.bounds;
    var origLeft  = bounds[0].as('px'),
        origTop   = bounds[1].as('px'),
        origWidth = bounds[2].as('px') - origLeft,
        origHeight= bounds[3].as('px') - origTop;
    layer.remove();
    var baseLayer = doc.layers.byName(baseName);

    var badgeDoc = app.open(inputFile);
    badgeDoc.selection.selectAll(); badgeDoc.selection.copy();
    badgeDoc.close(SaveOptions.DONOTSAVECHANGES);
    doc.paste();
    var newLayer = doc.activeLayer;
    newLayer.name = layerName;
    newLayer.move(baseLayer, ElementPlacement.PLACEBEFORE);

    var nb = newLayer.bounds;
    var scale = Math.min(origWidth / (nb[2].as('px')-nb[0].as('px')),
                         origHeight / (nb[3].as('px')-nb[1].as('px'))) * 100;
    newLayer.resize(scale, scale, AnchorPosition.TOPLEFT);
    var rb = newLayer.bounds;
    newLayer.translate(origLeft - rb[0].as('px'), origTop - rb[1].as('px'));

    newLayer.grouped = true;
}

// --- NATION FLAGS LOOP ---
for (var p = 0; p < positions.length; p++) {
    var posName   = positions[p];
    var baseName  = posName + "_nation_base";
    var imageName = nationFiles[p];
    var inputFile = new File(desktop + '/NATIONS/' + imageName);

    if (!inputFile.exists) {
        alert("Missing flag: " + imageName);
        continue;
    }
    var layerName = posName + "_nation";
    var layer     = doc.layers.byName(layerName);
    var bounds    = layer.bounds;
    var origLeft  = bounds[0].as('px'),
        origTop   = bounds[1].as('px'),
        origWidth = bounds[2].as('px') - origLeft,
        origHeight= bounds[3].as('px') - origTop;
    layer.remove();
    var baseLayer = doc.layers.byName(baseName);

    var flagDoc = app.open(inputFile);
    flagDoc.selection.selectAll(); flagDoc.selection.copy();
    flagDoc.close(SaveOptions.DONOTSAVECHANGES);
    doc.paste();
    var newLayer = doc.activeLayer;
    newLayer.name = layerName;
    newLayer.move(baseLayer, ElementPlacement.PLACEBEFORE);

    var nb = newLayer.bounds;
    var scale = Math.min(origWidth / (nb[2].as('px')-nb[0].as('px')),
                         origHeight / (nb[3].as('px')-nb[1].as('px'))) * 100;
    newLayer.resize(scale, scale, AnchorPosition.TOPLEFT);
    var rb = newLayer.bounds;
    newLayer.translate(origLeft - rb[0].as('px'), origTop - rb[1].as('px'));

    newLayer.grouped = true;
}

alert("All 11 positions have been updated with players, teams & nations!");
