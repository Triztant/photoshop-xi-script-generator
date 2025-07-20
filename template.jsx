// Injected player name list as an array
ç
// This placeholder will be replaced by the web app with a JSON array of names
// Hide a layer by name
function hideLayer(layerName) {
    try {
        var layer = app.activeDocument.layers.getByName(layerName);
        layer.visible = false;
    } catch (e) {
        // ignore if layer not found
    }
}
function findLayerByName(layerSet, name) {
    for (var i = 0; i < layerSet.layers.length; i++) {
        var layer = layerSet.layers[i];
        if (layer.name === name) {
            return layer;
        } else if (layer.typename === "LayerSet") {
            var found = findLayerByName(layer, name);
            if (found) return found;
        }
    }
    return null;
}

function replaceSmartObjectContents(layerName, imagePath) {
    var doc = app.activeDocument;

    // Update text layer in the main document
    var textLayer = findLayerByName(doc, layerName + "_text");
    if (textLayer) {
        if (textLayer.textItem) {
            textLayer.allLocked = false;
            var parts = imagePath.toString().split("/");
            var filenameWithExt = parts[parts.length - 1];
            var fileName = filenameWithExt.toString().split(".")[0];
            var lastName = fileName.split("_").slice(-1)[0];
            textLayer.textItem.contents = lastName;
            textLayer.textItem.font = "RamaGothicM-Bold";
            textLayer.textItem.size = 31.3;
            textLayer.textItem.fauxBold = false;
            textLayer.textItem.fauxItalic = false;
            textLayer.textItem.useAutoLeading = true;
            $.writeln("✅ Updated text for layer: " + textLayer.name + " → " + lastName);
        } else {
            $.writeln("⚠️ Layer found but has no textItem: " + textLayer.name);
        }
    } else {
        $.writeln("❌ Text layer not found: " + layerName + "_text");
    }

    app.activeDocument = doc;

    // Determine if replacing a team badge or a player
    var isTeam = layerName.indexOf("team_") === 0;
    var layersFolder = Folder($.fileName).parent + "/PLAYER_SMARTLAYERS/";
    var smartObjectPath = layersFolder + layerName + ".psb";
    var smartDocFile = new File(smartObjectPath);
    if (!smartDocFile.exists) {
        alert("Smart object PSD not found: " + smartObjectPath);
        return;
    }

    try {
        app.open(smartDocFile);
        var smartDoc = app.activeDocument;


        // Choose the correct input folder
        var imageFolder = Folder($.fileName).parent + "/" + (isTeam ? "Badges" : "output2") + "/";
        var imageFile = new File(imageFolder + imagePath + ".png");
        if (imageFile.exists) {
            var faceDoc = app.open(imageFile);
            faceDoc.selection.selectAll();
            faceDoc.selection.copy();
            faceDoc.close(SaveOptions.DONOTSAVECHANGES);

            app.activeDocument = smartDoc;
            smartDoc.paste();

            var pastedLayer = smartDoc.activeLayer;
            pastedLayer.move(smartDoc.layers[smartDoc.layers.length - 1], ElementPlacement.PLACEAFTER);

            if (!isTeam) {
                // Center and align player images
                pastedLayer.translate(
                    (smartDoc.width.as("px") / 2) - ((pastedLayer.bounds[0].as("px") + pastedLayer.bounds[2].as("px")) / 2),
                    smartDoc.height.as("px") - pastedLayer.bounds[3].as("px")
                );
            } else {
                // Scale and center badges proportionally
                var bounds = pastedLayer.bounds;
                var layerW = bounds[2].as("px") - bounds[0].as("px");
                var layerH = bounds[3].as("px") - bounds[1].as("px");
                var scaleX = (smartDoc.width.as("px") / layerW) * 100;
                var scaleY = (smartDoc.height.as("px") / layerH) * 100;
                var scale = Math.min(scaleX, scaleY);
                pastedLayer.resize(scale, scale, AnchorPosition.MIDDLECENTER);
                // Recalculate bounds after resizing
                bounds = pastedLayer.bounds;
                // Center the badge layer
                pastedLayer.translate(
                    (smartDoc.width.as("px") / 2) - ((bounds[0].as("px") + bounds[2].as("px")) / 2),
                    (smartDoc.height.as("px") / 2) - ((bounds[1].as("px") + bounds[3].as("px")) / 2)
                );
            }

            // Remove all previous layers, keeping only the newly pasted layer
            app.activeDocument = smartDoc;
            for (var i = smartDoc.layers.length - 2; i >= 0; i--) {
                smartDoc.activeLayer = smartDoc.layers[i];
                smartDoc.activeLayer.remove();
            }

            smartDoc.close(SaveOptions.SAVECHANGES);
            $.writeln("✅ Processed: " + smartDoc.name);
            // Delete the source image file to prevent accumulation
            try {
                var fileToDelete = new File(imageFolder + imagePath + ".png");
                if (fileToDelete.exists) {
                    fileToDelete.remove();
                    $.writeln("✅ Deleted old image: " + fileToDelete.fsName);
                }
            } catch (delErr) {
                $.writeln("⚠️ Failed to delete old image: " + delErr.message);
            }
        } else {
            $.writeln("❌ Image file not found: " + imagePath);
        }
    } catch (e) {
        $.writeln("⚠️ Error processing " + layerName + ": " + e.message);
    } finally {
        app.activeDocument = doc;
    }
}


{{REPLACEMENTS}}
