// Web-generated Photoshop XI Script using layer-based replacement
var desktop = Folder('~/Desktop');

// Hard-coded list of positions (must match your 11 inputs order)
var positions = [
  "GK", "LB", "LCB", "RCB", "RB",
  "RCM", "LCM", "CM", "LW", "ST", "RW"
];

// Filenames injected by the web UI
var imageFiles  = {{IMAGE_FILES}};   // e.g. ["player-one.png", …]
var teamFiles   = {{TEAM_FILES}};    // e.g. ["TEAM_ONE.png", …]
var nationFiles = {{NATION_FILES}};  // e.g. ["Flag_of_Country.png", …]

// Helper to extract the last hyphen-delimited token from a filename
function getLastName(file) {
    var base = file.name.replace(/\.[^\.]+$/, "");
    var parts = base.split("-");
    return parts.pop();
}

if (!app.documents.length) {
    alert("Open your template PSD first!");
    throw "No document open.";
}
var doc = app.activeDocument;

// --- 1) Replace Player Images & Text ---
for (var i = 0; i < positions.length; i++) {
    var posName   = positions[i],
        baseName  = posName + "_base",
        imgName   = imageFiles[i],
        inputFile = new File(desktop + "/PLAYER PF/" + imgName);

    if (!inputFile.exists) {
        alert("Missing player image: " + imgName);
        continue;
    }

    var lastName = getLastName(inputFile);
    var layer    = doc.layers.byName(posName);
    var b        = layer.bounds;
    var ol = b[0].as("px"), ot = b[1].as("px"),
        ow = b[2].as("px") - ol, oh = b[3].as("px") - ot;
    layer.remove();

    var base = doc.layers.byName(baseName);
    var nd   = app.open(inputFile);
    nd.selection.selectAll();
    nd.selection.copy();
    nd.close(SaveOptions.DONOTSAVECHANGES);

    doc.paste();
    var nl = doc.activeLayer;
    nl.name = posName;
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

    var txt = doc.layers.byName(posName + "_text");
    if (txt.kind == LayerKind.TEXT) {
        txt.textItem.contents = lastName;
    }
}

// --- 2) Replace Team Badges ---
for (var i = 0; i < positions.length; i++) {
    var posName   = positions[i],
        baseName  = posName + "_team_base",
        imgName   = teamFiles[i],
        inputFile = new File(desktop + "/TEAMS/" + imgName);

    if (!inputFile.exists) {
        alert("Missing team badge: " + imgName);
        continue;
    }

    var layerName = posName + "_team";
    var layer     = doc.layers.byName(layerName);
    var b         = layer.bounds;
    var ol = b[0].as("px"), ot = b[1].as("px"),
        ow = b[2].as("px") - ol, oh = b[3].as("px") - ot;
    layer.remove();

    var base = doc.layers.byName(baseName);
    var nd   = app.open(inputFile);
    nd.selection.selectAll();
    nd.selection.copy();
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

// --- 3) Replace National Flags ---
for (var i = 0; i < positions.length; i++) {
    var posName   = positions[i],
        baseName  = posName + "_nation_base",
        imgName   = nationFiles[i],
        inputFile = new File(desktop + "/NATIONS/" + imgName);

    if (!inputFile.exists) {
        alert("Missing national flag: " + imgName);
        continue;
    }

    var layerName = posName + "_nation";
    var layer     = doc.layers.byName(layerName);
    var b         = layer.bounds;
    var ol = b[0].as("px"), ot = b[1].as("px"),
        ow = b[2].as("px") - ol, oh = b[3].as("px") - ot;
    layer.remove();

    var base = doc.layers.byName(baseName);
    var nd   = app.open(inputFile);
    nd.selection.selectAll();
    nd.selection.copy();
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

alert("All 11 positions updated with players, teams & nations!");
