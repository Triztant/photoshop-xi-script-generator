// Web-generated Photoshop XI Script using layer-based replacement
var desktop = Folder('~/Desktop');

// List of layer names (positions)
var positions = ["GK", "LB", "LCB", "RCB", "RB", "RCM", "LCM", "CM", "LW", "ST", "RW"];

// Dynamically injected list of image filenames (must match positions order)
var imageFiles = {{IMAGE_FILES}}; // e.g. ["ryan_gravenberch.png", "lionel_messi.png", …]

// Get last name from image file name ("nathan-ake.png" → "ake")
function getLastName(file) {
    var nameOnly = file.name.replace(/\.[^\.]+$/, "");
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
    var baseName = posName + "_base";

    var imageName = imageFiles[p];
    var inputFile = new File(desktop + '/PLAYER PF/' + imageName);

    if (!inputFile.exists) {
        alert("Could not find '" + imageName + "' in 'PLAYER PF' on your Desktop.");
        continue;
    }

    var lastName = getLastName(inputFile);

    // Find the target layer
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
    var bounds = targetLayer.bounds;
    var origLeft = bounds[0].as('px');
    var origTop = bounds[1].as('px');
    var origRight = bounds[2].as('px');
    var origBottom = bounds[3].as('px');
    var origWidth = origRight - origLeft;
    var origHeight = origBottom - origTop;

    // Remove the old image layer
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

    // Open and copy new image
    var newImgDoc = app.open(inputFile);
    newImgDoc.selection.selectAll();
    newImgDoc.selection.copy();
    newImgDoc.close(SaveOptions.DONOTSAVECHANGES);

    // Paste and name
    doc.paste();
    var newLayer = doc.activeLayer;
    newLayer.name = posName;
    newLayer.move(baseLayer, ElementPlacement.PLACEBEFORE);

    // Resize proportionally
    var newBounds = newLayer.bounds;
    var newWidth = newBounds[2].as('px') - newBounds[0].as('px');
    var newHeight = newBounds[3].as('px') - newBounds[1].as('px');
    var scaleRatio = Math.min(origWidth / newWidth, origHeight / newHeight) * 100;
    newLayer.resize(scaleRatio, scaleRatio, AnchorPosition.TOPLEFT);

    // Reposition
    var resizedBounds = newLayer.bounds;
    var resizedLeft = resizedBounds[0].as('px');
    var resizedTop = resizedBounds[1].as('px');
    newLayer.translate(origLeft - resizedLeft, origTop - resizedTop);

    // Apply clipping mask
    newLayer.grouped = true;

    // Update text layer
    var textName = posName + "_text";
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

alert("All 11 positions have been updated!");
