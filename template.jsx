// Web-generated Photoshop XI Script using layer-based replacement
var desktop = Folder('~/Desktop');

// Positions in order (must match web UI)
var positions = ["GK", "LB", "LCB", "RCB", "RB", "RCM", "LCM", "CM", "LW", "ST", "RW"];

// Injected filename arrays
var imageFiles  = {{IMAGE_FILES}};   // e.g. ["player-one.png", …]
var teamFiles   = {{TEAM_FILES}};    // e.g. ["TEAM_ONE.png", …]
var nationFiles = {{NATION_FILES}};  // e.g. ["Flag_of_Country_…png", …]

// Helper to extract last name token
function getLastName(file) {
    var nameOnly = file.name.replace(/\.[^\.]+$/, "");
    var parts = nameOnly.split("-");
    return parts.pop();
}

if (!app.documents.length) {
    alert("Open your template PSD first!");
    throw "No document open.";
}
var doc = app.activeDocument;

// --- PLAYER IMAGE LOOP ---
for (var i = 0; i < positions.length; i++) {
    var posName   = positions[i];
    var baseName  = posName + "_base";
    var imgName   = imageFiles[i];
    var inputFile = new File(desktop + "/PLAYER PF/" + imgName);

    if (!inputFile.exists) {
        alert("Missing player image: " + imgName);
        continue;
    }
    var lastName = getLastName(inputFile);

    // Remove existing layer
    var layer = doc.layers.byName(posName);
    var b = layer.bounds;
    var ol = b[0].as("px"), ot = b[1].as("px");
    var ow = b[2].as("px") - ol, oh = b[3].as("px") - ot;
    layer.remove();

    // Open, copy & paste new image
    var baseLayer = doc.layers.byName(baseName);
    var newDoc = app.open(inputFile);
    newDoc.selection.selectAll(); newDoc.selection.copy();
    newDoc.close(SaveOptions.DONOTSAVECHANGES);

    doc.paste();
    var newLayer = doc.activeLayer;
    newLayer.name = posName;
    newLayer.move(baseLayer, ElementPlacement.PLACEBEFORE);

    // Resize & reposition
    var nb = newLayer.bounds;
    var scale = Math.min(ow / (nb[2].as("px") - nb[0].as("px")),
                         oh / (nb[3].as("px") - nb[1].as("px"))) * 100;
    newLayer.resize(scale, scale, AnchorPosition.TOPLEFT);
    var rb = newLayer.bounds;
    newLayer.translate(ol - rb[0].as("px"), ot - rb[1].as("px"));

    newLayer.grouped = true;

    // Update text layer
    var textLayer = doc.layers.byName(posName + "_text");
    if (textLayer.kind == LayerKind.TEXT) {
        textLayer.textItem.contents = lastName;
    }
}

// --- TEAM BADGE LOOP ---
for (var i = 0; i < positions.length; i++) {
    var posName   = positions[i];
    var baseName  = posName + "_team_base";
    var imgName   = teamFiles[i];
    var inputFile = new File(desktop + "/TEAMS/" + imgName);

    if (!inputFile.exists) {
        alert("Missing team badge: " + imgName);
        continue;
    }

    var layerName = posName + "_team";
    var layer     = doc.layers.byName(layerName);
    var b         = layer.bounds;
    var ol = b[0].as("px"), ot = b[1].as("px");
    var ow = b[2].as("px") - ol, oh = b[3].as("px") - ot;
    layer.remove();

    var baseLayer = doc.layers.byName(baseName);
    var newDoc = app.open(inputFile);
    newDoc.selection.selectAll(); newDoc.selection.copy();
    newDoc.close(SaveOptions.DONOTSAVECHANGES);

    doc.paste();
    var newLayer = doc.activeLayer;
    newLayer.name = layerName;
    newLayer.move(baseLayer, ElementPlacement.PLACEBEFORE);

    var nb = newLayer.bounds;
    var scale = Math.min(ow / (nb[2].as("px") - nb[0].as("px")),
                         oh / (nb[3].as("px") - nb[1].as("px"))) * 100;
    newLayer.resize(scale, scale, AnchorPosition.TOPLEFT);
    var rb = newLayer.bounds;
    newLayer.translate(ol - rb[0].as("px"), ot - rb[1].as("px"));

    newLayer.grouped = true;
}

// --- NATION FLAG LOOP ---
for (var i = 0; i < positions.length; i++) {
    var posName   = positions[i];
    var baseName  = posName + "_nation_base";
    var imgName   = nationFiles[i];
    var inputFile = new File(desktop + "/NATIONS/" + imgName);

    if (!inputFile.exists) {
        alert("Missing flag: " + imgName);
        continue;
    }

    var layerName = posName + "_nation";
    var layer     = doc.layers.byName(layerName);
    var b         = layer.bounds;
    var ol = b[0].as("px"), ot = b[1].as("px");
    var ow = b[2].as("px") - ol, oh = b[3].as("px") - ot;
    layer.remove();

    var baseLayer = doc.layers.byName(baseName);
    var newDoc = app.open(inputFile);
    newDoc.selection.selectAll(); newDoc.selection.copy();
    newDoc.close(SaveOptions.DONOTSAVECHANGES);

    doc.paste();
    var newLayer = doc.activeLayer;
    newLayer.name = layerName;
    newLayer.move(baseLayer, ElementPlacement.PLACEBEFORE);

    var nb = newLayer.bounds;
    var scale = Math.min(ow / (nb[2].as("px") - nb[0].as("px")),
                         oh / (nb[3].as("px") - nb[1].as("px"))) * 100;
    newLayer.resize(scale, scale, AnchorPosition.TOPLEFT);
    var rb = newLayer.bounds;
    newLayer.translate(ol - rb[0].as("px"), ot - rb[1].as("px"));

    newLayer.grouped = true;
}

alert("All 11 positions updated with players, teams & nations!");
