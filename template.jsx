// Web-generated Photoshop XI Script using layer-based replacement
var desktop = Folder('~/Desktop');

// 11 positions (must match your form order exactly)
var positions = ["GK","LB","LCB","RCB","RB","RCM","LCM","CM","LW","ST","RW"];

// These get replaced by script.js:
var imageFiles  = {{IMAGE_FILES}};
var teamFiles   = {{TEAM_FILES}};
var nationFiles = {{NATION_FILES}};

// === Helper: recursively find a layer or group by name anywhere in doc ===
function findLayerByName(parent, name) {
    // Search all ArtLayers in this parent
    for (var i = 0; i < parent.artLayers.length; i++) {
        if (parent.artLayers[i].name === name) {
            return parent.artLayers[i];
        }
    }
    // Then search all LayerSets (groups), recursing inside
    for (var j = 0; j < parent.layerSets.length; j++) {
        var grp = parent.layerSets[j];
        if (grp.name === name) {
            return grp;
        }
        var found = findLayerByName(grp, name);
        if (found) {
            return found;
        }
    }
    return null;
}

// Helper: grab last hyphen token for text layers
function getLastName(file) {
    var base = file.name.replace(/\.[^\.]+$/, "");
    return base.split("-").pop();
}

if (!app.documents.length) {
    alert("Open your template PSD first!");
    throw "No document open.";
}
var doc = app.activeDocument;

// === Generic replacement routine ===
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

        // 1) find & remove existing layer
        var layer = findLayerByName(doc, layerName);
        if (!layer) {
            alert("Could not find layer: " + layerName);
            continue;
        }
        var b  = layer.bounds,
            ol = b[0].as("px"),
            ot = b[1].as("px"),
            ow = b[2].as("px") - ol,
            oh = b[3].as("px") - ot;
        layer.remove();

        // 2) find its clipping base
        var base = findLayerByName(doc, baseName);
        if (!base) {
            alert("Could not find base layer: " + baseName);
            continue;
        }

        // 3) open & copy new image
        var nd = app.open(inputFile);
        nd.selection.selectAll();
        nd.selection.copy();
        nd.close(SaveOptions.DONOTSAVECHANGES);

        // 4) paste, rename, move into place
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

        // 6) translate back to original coordinates
        var rb = nl.bounds;
        nl.translate(ol - rb[0].as("px"), ot - rb[1].as("px"));

        // 7) set as clipping mask
        nl.grouped = true;

        // 8) optionally update text layer (players only)
        if (updateText) {
            var txt = findLayerByName(doc, layerName + "_text");
            if (txt && txt.kind == LayerKind.TEXT) {
                txt.textItem.contents = getLastName(inputFile);
            }
        }
    }
}

// Run the three loops:
replaceLoop("",        imageFiles,  "PLAYER PF",   "_base",        true);   // players + text
replaceLoop("_team",   teamFiles,   "TEAMS",       "_team_base",   false);  // badges
replaceLoop("_nation", nationFiles, "NATIONS",     "_nation_base", false);  // flags

alert("All 11 positions updated with players, teams & nations!");
