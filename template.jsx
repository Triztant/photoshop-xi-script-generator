// Web-generated Photoshop XI Script using layer-based replacement
var desktop = Folder('~/Desktop');

// Positions in order
var positions = ["GK", "LB", "LCB", "RCB", "RB", "LM", "CM", "CM", "RM", "ST", "ST"];

// Injected filename arrays
var imageFiles  = {{IMAGE_FILES}};   // player PNGs
var teamFiles   = {{TEAM_FILES}};    // team PNGs
var nationFiles = {{NATION_FILES}};  // flag PNGs

// Helper to extract a name token
function getLastName(file) {
    var name = file.name.replace(/\.[^\.]+$/, "");
    var parts = name.split("-");
    return parts.pop();
}

if (!app.documents.length) {
    alert("Open your template PSD first!");
    throw "No document open.";
}
var doc = app.activeDocument;

// PLAYER loop (exactly your original logic)
for (var i = 0; i < positions.length; i++) {
    var posName   = positions[i];
    var baseName  = posName + "_base";
    var imgName   = imageFiles[i];
    var inputFile = new File(desktop + "/PLAYER PF/" + imgName);
    if (!inputFile.exists) { alert("Missing player: " + imgName); continue; }
    var lastName = getLastName(inputFile);

    var layer = doc.layers.byName(posName);
    var b = layer.bounds;
    var ol = b[0].as("px"), ot = b[1].as("px");
    var ow = b[2].as("px") - ol, oh = b[3].as("px") - ot;
    layer.remove();

    var base = doc.layers.byName(baseName);
    var nd = app.open(inputFile);
    nd.selection.selectAll(); nd.selection.copy();
    nd.close(SaveOptions.DONOTSAVECHANGES);

    doc.paste();
    var nl = doc.activeLayer;
    nl.name = posName;
    nl.move(base, ElementPlacement.PLACEBEFORE);

    var nb = nl.bounds;
    var scale = Math.min(ow / (nb[2].as("px") - nb[0].as("px")),
                         oh / (nb[3].as("px") - nb[1].as("px"))) * 100;
    nl.resize(scale, scale, AnchorPosition.TOPLEFT);
    var rb = nl.bounds;
    nl.translate(ol - rb[0].as("px"), ot - rb[1].as("px"));
    nl.grouped = true;

    var tl = doc.layers.byName(posName + "_text");
    if (tl.kind == LayerKind.TEXT) tl.textItem.contents = lastName;
}

// TEAM loop (same but no text)
for (var i = 0; i < positions.length; i++) {
    var posName   = positions[i];
    var baseName  = posName + "_team_base";
    var imgName   = teamFiles[i];
    var inputFile = new File(desktop + "/TEAMS/" + imgName);
    if (!inputFile.exists) { alert("Missing team: " + imgName); continue; }

    var layerName = posName + "_team";
    var layer     = doc.layers.byName(layerName);
    var b = layer.bounds;
    var ol = b[0].as("px"), ot = b[1].as("px");
    var ow = b[2].as("px") - ol, oh = b[3].as("px") - ot;
    layer.remove();

    var base = doc.layers.byName(baseName);
    var nd = app.open(inputFile);
    nd.selection.selectAll(); nd.selection.copy();
    nd.close(SaveOptions.DONOTSAVECHANGES);

    doc.paste();
    var nl = doc.activeLayer;
    nl.name = layerName;
    nl.move(base, ElementPlacement.PLACEBEFORE);

    var nb = nl.bounds;
    var scale = Math.min(ow / (nb[2].as("px") - nb[0].as("px")),
                         oh / (nb[3].as("px") - nb[1].as("px"))) * 100;
    nl.resize(scale, scale, AnchorPosition.TOPLEFT);
    var rb = nl.bounds;
    nl.translate(ol - rb[0].as("px"), ot - rb[1].as("px"));
    nl.grouped = true;
}

// NATION loop
for (var i = 0; i < positions.length; i++) {
    var posName   = positions[i];
    var baseName  = posName + "_nation_base";
    var imgName   = nationFiles[i];
    var inputFile = new File(desktop + "/NATIONS/" + imgName);
    if (!inputFile.exists) { alert("Missing flag: " + imgName); continue; }

    var layerName = posName + "_nation";
    var layer     = doc.layers.byName(layerName);
    var b = layer.bounds;
    var ol = b[0].as("px"), ot = b[1].as("px");
    var ow = b[2].as("px") - ol, oh = b[3].as("px") - ot;
    layer.remove();

    var base = doc.layers.byName(baseName);
    var nd = app.open(inputFile);
    nd.selection.selectAll(); nd.selection.copy();
    nd.close(SaveOptions.DONOTSAVECHANGES);

    doc.paste();
    var nl = doc.activeLayer;
    nl.name = layerName;
    nl.move(base, ElementPlacement.PLACEBEFORE);

    var nb = nl.bounds;
    var scale = Math.min(ow / (nb[2].as("px") - nb[0].as("px")),
                         oh / (nb[3].as("px") - nb[1].as("px"))) * 100;
    nl.resize(scale, scale, AnchorPosition.TOPLEFT);
    var rb = nl.bounds;
    nl.translate(ol - rb[0].as("px"), ot - rb[1].as("px"));
    nl.grouped = true;
}

alert("All 11 positions updated with players, teams & nations!");
