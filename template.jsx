// Web-generated Photoshop XI Script using layer-based replacement
var desktop = Folder('~/Desktop');

// Hard-coded list of positions (must match your 11 inputs order)
var positions = [
  "GK", "LB", "LCB", "RCB", "RB",
  "RCM", "LCM", "CM", "LW", "ST", "RW"
];

// Web UI will replace these placeholders with real arrays:
var imageFiles  = {{IMAGE_FILES}};   // ["player-one.png",  …]
var teamFiles   = {{TEAM_FILES}};    // ["TEAM_ONE.png",    …]
var nationFiles = {{NATION_FILES}};  // ["Flag_of_England_Flat_Round-256x256.png", …]

// Helper to pull the last hyphenated token from filename → text
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

// 1) Replace player images & text
for (var i = 0; i < positions.length; i++) {
    var posName   = positions[i],
        baseName  = posName + "_base",
        imgName   = imageFiles[i],
        inputFile = new File(desktop + "/PLAYER PF/" + imgName);

    if (!inputFile.exists) {
        alert("Missing player image: " + imgName);
        continue;
    }

    var lastName = getLastName(inputFile),
        layer    = doc.layers.byName(posName),
        b        = layer.bounds,
        ol = b[0].as("px"), ot = b[1].as("px"),
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

    // update text
    var txt = doc.layers.byName(posName + "_text");
    if (txt && txt.kind == LayerKind.TEXT) {
        txt.textItem.contents = lastName;
    }
}

// 2) Replace team badges
for (var i = 0; i < positions.length; i++) {
    var posName   = positions[i],
        baseName  = posName + "_team_base",
        imgName   = teamFiles[i],
        inputFile = new File(desktop + "/TEAMS/" + imgName);

    if (!inputFile.exists) {
        alert("Missing team badge: " + imgName);
        continue;
    }

    var layerName = posName + "_team",
        layer     = doc.layers.byName(layerName),
        b         = layer.bounds,
        ol = b[0].as("px"), ot = b[1].as("px"),
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

// 3) Replace national flags
for (var i = 0; i < positions.length; i++) {
    var posName   = positions[i],
        baseName  = posName + "_nation_base",
        imgName   = nationFiles[i],
        inputFile = new File(desktop + "/NATIONS/" + imgName);

    if (!inputFile.exists) {
        alert("Missing national flag: " + imgName);
        continue;
    }

    var layerName = posName + "_nation",
        layer     = doc.layers.byName(layerName),
        b         = layer.bounds,
        ol = b[0].as("px"), ot = b[1].as("px"),
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
