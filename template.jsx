// Web-generated Photoshop XI Script using layer-based replacement
var desktop = Folder('~/Desktop');

// List of layer names (positions)
var positions = ["GK", "LB", "LCB", "RCB", "RB", "RCM", "LCM", "CM", "LW", "ST", "RW"];

var imageFiles = {{IMAGE_FILES}}; // Placeholder for array of filenames

// Get last name from image file name ("nathan-ake.png" → "ake")
function getLastName(file) {
    var nameOnly = file.name.replace(/\.[^\.]+$/, ""); // Remove extension
    var parts = nameOnly.split("-");
    return parts.length > 1 ? parts[parts.length - 1] : nameOnly;
}

if (app.documents.length == 0) {
    alert("Open your template PSD first!");
    throw "No document open.";
}
var doc = app.activeDocument;

for (var p = 0; p < positions.length; p++) {
    var posName = positions[p];
    var baseName = posName + "_base"; // Ensure your base layers are named like "GK_base", "LB_base", etc.

    var imageName = imageFiles[p];
    var inputFile = new File(desktop + '/PLAYER PF/' + imageName);

    if (!inputFile.exists) {
        alert("Could not find '" + imageName + "' in 'PLAYER PF' on your Desktop.");
        continue;
    }

    var lastName = getLastName(inputFile);

    // Find the layer with this position name
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

    // Save bounds for resizing/moving
    var bounds = targetLayer.bounds;
    var origLeft = bounds[0].as('px');
    var origTop = bounds[1].as('px');
    var origRight = bounds[2].as('px');
    var origBottom = bounds[3].as('px');
    var origWidth = origRight - origLeft;
    var origHeight = origBottom - origTop;

    // Delete the old image layer
    targetLayer.remove();

    // Find base (clipping) layer by name
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

    // Open and copy the new image
    var newImgDoc = app.open(inputFile);
    newImgDoc.selection.selectAll();
    newImgDoc.selection.copy();
    newImgDoc.close(SaveOptions.DONOTSAVECHANGES);

    // Paste new image
    doc.paste();
    var newLayer = doc.activeLayer;
    newLayer.name = posName;

    // Move above the base layer
    newLayer.move(baseLayer, ElementPlacement.PLACEBEFORE);

    // Resize and move to match original bounds
    var newBounds = newLayer.bounds;
    var newLeft = newBounds[0].as('px');
    var newTop = newBounds[1].as('px');
    var newRight = newBounds[2].as('px');
    var newBottom = newBounds[3].as('px');
    var newWidth = newRight - newLeft;
    var newHeight = newBottom - newTop;

    // Proportional scaling to fit within original bounds
    var scaleRatio = Math.min(origWidth / newWidth, origHeight / newHeight) * 100;
    newLayer.resize(scaleRatio, scaleRatio, AnchorPosition.TOPLEFT);

    // After resizing, get bounds again for correct position
    var resizedBounds = newLayer.bounds;
    var resizedLeft = resizedBounds[0].as('px');
    var resizedTop = resizedBounds[1].as('px');

    newLayer.translate(origLeft - resizedLeft, origTop - resizedTop);

    // Re-apply clipping mask to the base layer
    newLayer.grouped = true;

    // --- UPDATE THE TEXT LAYER ---
    var textName = posName + "_text"; // Text layer
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

alert("All 11 positions have been swapped and clipped to their named base layers!");
