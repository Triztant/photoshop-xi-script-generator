// Web-generated Photoshop XI Script using layer-based replacement
var desktop = Folder('~/Desktop');

// List of layer names (positions)
var positions = ["GK", "LB", "LCB", "RCB", "RB", "RCM", "LCM", "CM", "LW", "ST", "RW"];

// Dynamically injected lists of filenames
var imageFiles  = {{IMAGE_FILES}};   // e.g. ["declan-rice.png", …]
var teamFiles   = {{TEAM_FILES}};    // e.g. ["Liverpool FC.png", …]
var nationFiles = {{NATION_FILES}};  // e.g. ["United Kingdom.png", …]

// Helper: get last name token from hyphenated filename
function getLastName(file) {
    var nameOnly = file.name.replace(/\.[^\.]+$/, "");
    var parts = nameOnly.split("-");
    return parts.length > 1 ? parts.pop() : nameOnly;
}

if (app.documents.length == 0) {
    alert("Open your template PSD first!");
    throw "No document open.";
}
var doc = app.activeDocument;

// --- 1) Players (always run) ---
for (var p = 0; p < positions.length; p++) {
    var posName   = positions[p];
    var baseName  = posName + "_base";
    var imageName = imageFiles[p];
    var inputFile = new File(desktop + '/PLAYER PF/' + imageName);

    if (!inputFile.exists) {
        alert("Could not find '" + imageName + "' in 'PLAYER PF' on your Desktop.");
        continue;
    }

    var lastName = getLastName(inputFile);

    // Find and record the old player layer
    var targetLayer = null;
    for (var i = 0; i < doc.layers.length; i++) {
        if (doc.layers[i].name == posName) {
            targetLayer = doc.layers[i];
            break;
        }
    }
    if (!targetLayer) {
        alert('Could not find layer named "' + posName + '"');
        continue;
    }

    // Save original bounds
    var bounds     = targetLayer.bounds;
    var origLeft   = bounds[0].as('px');
    var origTop    = bounds[1].as('px');
    var origRight  = bounds[2].as('px');
    var origBottom = bounds[3].as('px');
    var origWidth  = origRight - origLeft;
    var origHeight = origBottom - origTop;

    // Remove old layer
    targetLayer.remove();

    // Find base layer
    var baseLayer = null;
    for (var j = 0; j < doc.layers.length; j++) {
        if (doc.layers[j].name == baseName) {
            baseLayer = doc.layers[j];
            break;
        }
    }
    if (!baseLayer) {
        alert('Could not find base layer named "' + baseName + '"');
        continue;
    }

    // Open, copy & close new image
    var newImgDoc = app.open(inputFile);
    newImgDoc.selection.selectAll();
    newImgDoc.selection.copy();
    newImgDoc.close(SaveOptions.DONOTSAVECHANGES);

    // Paste & position
    doc.paste();
    var newLayer = doc.activeLayer;
    newLayer.name = posName;
    newLayer.move(baseLayer, ElementPlacement.PLACEBEFORE);

    // Resize proportionally
    var newBounds  = newLayer.bounds;
    var newWidth   = newBounds[2].as('px') - newBounds[0].as('px');
    var newHeight  = newBounds[3].as('px') - newBounds[1].as('px');
    var scaleRatio = Math.min(origWidth / newWidth, origHeight / newHeight) * 100;
    newLayer.resize(scaleRatio, scaleRatio, AnchorPosition.TOPLEFT);

    // Reposition
    var resizedBounds = newLayer.bounds;
    var resizedLeft   = resizedBounds[0].as('px');
    var resizedTop    = resizedBounds[1].as('px');
    newLayer.translate(origLeft - resizedLeft, origTop - resizedTop);

    // Apply clipping mask
    newLayer.grouped = true;

    // Update text layer
    var textName  = posName + "_text";
    var textLayer = null;
    for (var t = 0; t < doc.layers.length; t++) {
        if (doc.layers[t].name == textName) {
            textLayer = doc.layers[t];
            break;
        }
    }
    if (textLayer && textLayer.kind == LayerKind.TEXT) {
        textLayer.textItem.contents = lastName;
    }
}

// --- 2) Teams (only if enabled) ---
if (teamFiles.length > 0) {
    for (var p = 0; p < positions.length; p++) {
        var posName   = positions[p];
        var baseName  = posName + "_team_base";
        var imageName = teamFiles[p];
        var inputFile = new File(desktop + '/TEAMS/' + imageName);

        if (!inputFile.exists) {
            alert("Could not find '" + imageName + "' in 'TEAMS' on your Desktop.");
            continue;
        }

        var layerName   = posName + "_team";
        var targetLayer = null;
        for (var i = 0; i < doc.layers.length; i++) {
            if (doc.layers[i].name == layerName) {
                targetLayer = doc.layers[i];
                break;
            }
        }
        if (!targetLayer) {
            alert('Could not find layer named "' + layerName + '"');
            continue;
        }

        var bounds     = targetLayer.bounds;
        var origLeft   = bounds[0].as('px');
        var origTop    = bounds[1].as('px');
        var origRight  = bounds[2].as('px');
        var origBottom = bounds[3].as('px');
        var origWidth  = origRight - origLeft;
        var origHeight = origBottom - origTop;

        targetLayer.remove();

        var baseLayer = null;
        for (var j = 0; j < doc.layers.length; j++) {
            if (doc.layers[j].name == baseName) {
                baseLayer = doc.layers[j];
                break;
            }
        }
        if (!baseLayer) {
            alert('Could not find base layer named "' + baseName + '"');
            continue;
        }

        var newDoc = app.open(inputFile);
        newDoc.selection.selectAll();
        newDoc.selection.copy();
        newDoc.close(SaveOptions.DONOTSAVECHANGES);

        doc.paste();
        var newLayer = doc.activeLayer;
        newLayer.name = layerName;
        newLayer.move(baseLayer, ElementPlacement.PLACEBEFORE);

        var nb         = newLayer.bounds;
        var badgeWidth = nb[2].as('px') - nb[0].as('px');
        var badgeHeight= nb[3].as('px') - nb[1].as('px');
        var scaleBadge = Math.min(origWidth / badgeWidth, origHeight / badgeHeight) * 100;
        newLayer.resize(scaleBadge, scaleBadge, AnchorPosition.TOPLEFT);

        var rbLeft = newLayer.bounds[0].as('px'),
            rbTop  = newLayer.bounds[1].as('px');
        newLayer.translate(origLeft - rbLeft, origTop - rbTop);

        newLayer.grouped = true;
    }
}

// --- 3) Nations (only if enabled) ---
if (nationFiles.length > 0) {
    for (var p = 0; p < positions.length; p++) {
        var posName   = positions[p];
        var baseName  = posName + "_nation_base";
        var imageName = nationFiles[p];
        var inputFile = new File(desktop + '/NATIONS/' + imageName);

        if (!inputFile.exists) {
            alert("Could not find '" + imageName + "' in 'NATIONS' on your Desktop.");
            continue;
        }

        var layerName   = posName + "_nation";
        var targetLayer = null;
        for (var i = 0; i < doc.layers.length; i++) {
            if (doc.layers[i].name == layerName) {
                targetLayer = doc.layers[i];
                break;
            }
        }
        if (!targetLayer) {
            alert('Could not find layer named "' + layerName + '"');
            continue;
        }

        var bounds     = targetLayer.bounds;
        var origLeft   = bounds[0].as('px');
        var origTop    = bounds[1].as('px');
        var origRight  = bounds[2].as('px');
        var origBottom = bounds[3].as('px');
        var origWidth  = origRight - origLeft;
        var origHeight = origBottom - origTop;

        targetLayer.remove();

        var baseLayer = null;
        for (var j = 0; j < doc.layers.length; j++) {
            if (doc.layers[j].name == baseName) {
                baseLayer = doc.layers[j];
                break;
            }
        }
        if (!baseLayer) {
            alert('Could not find base layer named "' + baseName + '"');
            continue;
        }

        var newDoc = app.open(inputFile);
        newDoc.selection.selectAll();
        newDoc.selection.copy();
        newDoc.close(SaveOptions.DONOTSAVECHANGES);

        doc.paste();
        var newLayer = doc.activeLayer;
        newLayer.name = layerName;
        newLayer.move(baseLayer, ElementPlacement.PLACEBEFORE);

        var nb       = newLayer.bounds;
        var flagWidth= nb[2].as('px') - nb[0].as('px');
        var flagHeight= nb[3].as('px') - nb[1].as('px');
        var scaleFlag= Math.min(origWidth / flagWidth, origHeight / flagHeight) * 100;
        newLayer.resize(scaleFlag, scaleFlag, AnchorPosition.TOPLEFT);

        var rbLeft = newLayer.bounds[0].as('px'),
            rbTop  = newLayer.bounds[1].as('px');
        newLayer.translate(origLeft - rbLeft, origTop - rbTop);

        newLayer.grouped = true;
    }
}

alert("All 11 positions updated!");
