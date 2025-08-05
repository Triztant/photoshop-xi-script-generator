// Web-generated Photoshop XI Script using layer-based replacement
var desktop = Folder('~/Desktop');

// Positions injected from the page in the exact same order
var positions = {{POSITIONS}};  // e.g. ["GK","LB","LCB",…]

// Injected filename arrays
var imageFiles  = {{IMAGE_FILES}};   // player PNGs
var teamFiles   = {{TEAM_FILES}};    // team PNGs
var nationFiles = {{NATION_FILES}};  // flag PNGs

// Helper: recursive search for any ArtLayer or LayerSet by name
function findLayerByName(parent, name) {
    // Search direct ArtLayers
    for (var i = 0; i < parent.artLayers.length; i++) {
        if (parent.artLayers[i].name === name) {
            return parent.artLayers[i];
        }
    }
    // Search LayerSets (groups) and recurse
    for (var j = 0; j < parent.layerSets.length; j++) {
        var group = parent.layerSets[j];
        if (group.name === name) {
            return group;
        }
        var found = findLayerByName(group, name);
        if (found) {
            return found;
        }
    }
    return null;
}

// Helper: extract last name token from hyphenated filename
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

// Generic replacement routine
function replaceLoop(suffix, files, folderName, baseSuffix, updateText) {
    for (var i = 0; i < positions.length; i++) {
        var posName    = positions[i],
            layerName  = posName + suffix,
            baseName   = posName + baseSuffix,
            imgName    = files[i],
            inputFile  = new File(desktop + "/" + folderName + "/" + imgName);

        if (!inputFile.exists) {
            alert("Missing file: " + imgName);
            continue;
        }

        // Locate and remove existing layer
        var layer = findLayerByName(doc, layerName);
        if (!layer) {
            alert("Could not find layer '" + layerName + "'");
            continue;
        }

        var b = layer.bounds;
        var ol = b[0].as("px"), ot = b[1].as("px"),
            ow = b[2].as("px") - ol, oh = b[3].as("px") - ot;
        layer.remove();

        // Locate base layer
        var baseLayer = findLayerByName(doc, baseName);
        if (!baseLayer) {
            alert("Could not find base layer '" + baseName + "'");
            continue;
        }

        // Open, copy & paste new image
        var newDoc = app.open(inputFile);
        newDoc.selection.selectAll();
        newDoc.selection.copy();
        newDoc.close(SaveOptions.DONOTSAVECHANGES);

        doc.paste();
        var newLayer = doc.activeLayer;
        newLayer.name = layerName;
        newLayer.move(baseLayer, ElementPlacement.PLACEBEFORE);

        // Resize & reposition
        var nb = newLayer.bounds;
        var scale = Math.min(
            ow / (nb[2].as("px") - nb[0].as("px")),
            oh / (nb[3].as("px") - nb[1].as("px"))
        ) * 100;
        newLayer.resize(scale, scale, AnchorPosition.TOPLEFT);

        var rb = newLayer.bounds;
        newLayer.translate(ol - rb[0].as("px"), ot - rb[1].as("px"));

        // Clip to base
        newLayer.grouped = true;

        // Optionally update text layers (players and nations)
        if (updateText) {
            var textLayer = findLayerByName(doc, layerName + "_text");
            if (textLayer && textLayer.kind === LayerKind.TEXT) {
                textLayer.textItem.contents = getLastName(inputFile);
            }
        }
    }
}

// 1) Players (with text update)
replaceLoop(
    "",             // no suffix
    imageFiles,
    "PLAYER PF",
    "_base",
    true            // update text layer
);

// 2) Teams (no text update)
replaceLoop(
    "_team",
    teamFiles,
    "TEAMS",
    "_team_base",
    false
);

// 3) Nations (no text update)
replaceLoop(
    "_nation",
    nationFiles,
    "NATIONS",
    "_nation_base",
    false
);

alert("All 11 positions updated with players, teams & nations!");
