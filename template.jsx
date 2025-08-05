// Web-generated Photoshop XI Script using layer-based replacement
var desktop = Folder('~/Desktop');

// Positions injected from the page in the exact same order
var positions = {{POSITIONS}};  // e.g. ["GK","LB","LCB",…]

// Injected filename arrays
var imageFiles  = {{IMAGE_FILES}};   // player PNGs
var teamFiles   = {{TEAM_FILES}};    // team PNGs
var nationFiles = {{NATION_FILES}};  // flag PNGs

// Recursive lookup: searches document and all groups for a layer by name
function findLayerByName(parent, name) {
    // Search all artLayers
    for (var i = 0; i < parent.artLayers.length; i++) {
        if (parent.artLayers[i].name === name) {
            return parent.artLayers[i];
        }
    }
    // Search groups and recurse
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

// Helper to strip extension and get the last hyphen‐delimited token
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

// Generalized replacement loop
function replaceLoop(suffix, files, folderName, baseSuffix, updateText) {
    for (var i = 0; i < positions.length; i++) {
        var posName   = positions[i],
            layerName = posName + suffix,
            baseName  = posName + baseSuffix,
            imgName   = files[i],
            file      = new File(desktop + "/" + folderName + "/" + imgName);

        if (!file.exists) {
            alert("Missing file: " + imgName);
            continue;
        }

        // Find and remove the existing layer
        var layer = findLayerByName(doc, layerName);
        if (!layer) {
            alert("Could not find layer '" + layerName + "'");
            continue;
        }
        var b = layer.bounds;
        var ol = b[0].as("px"), ot = b[1].as("px");
        var ow = b[2].as("px") - ol, oh = b[3].as("px") - ot;
        layer.remove();

        // Find the clipping base
        var baseLayer = findLayerByName(doc, baseName);
        if (!baseLayer) {
            alert("Could not find base layer '" + baseName + "'");
            continue;
        }

        // Open & copy new image
        var newDoc = app.open(file);
        newDoc.selection.selectAll();
        newDoc.selection.copy();
        newDoc.close(SaveOptions.DONOTSAVECHANGES);

        // Paste and position
        doc.paste();
        var nl = doc.activeLayer;
        nl.name = layerName;
        nl.move(baseLayer, ElementPlacement.PLACEBEFORE);

        // Resize proportionally
        var nb = nl.bounds;
        var scale = Math.min(
            ow / (nb[2].as("px") - nb[0].as("px")),
            oh / (nb[3].as("px") - nb[1].as("px"))
        ) * 100;
        nl.resize(scale, scale, AnchorPosition.TOPLEFT);

        // Reposition
        var rb = nl.bounds;
        nl.translate(ol - rb[0].as("px"), ot - rb[1].as("px"));

        // Clip to base
        nl.grouped = true;

        // Update text if needed
        if (updateText) {
            var textLayer = findLayerByName(doc, layerName + "_text");
            if (textLayer && textLayer.kind == LayerKind.TEXT) {
                textLayer.textItem.contents = getLastName(file);
            }
        }
    }
}

// 1) Players (with name text)
replaceLoop("", imageFiles, "PLAYER PF", "_base", true);

// 2) Team badges
replaceLoop("_team", teamFiles, "TEAMS", "_team_base", false);

// 3) National flags
replaceLoop("_nation", nationFiles, "NATIONS", "_nation_base", false);

alert("All 11 positions updated with players, teams & nations!");
