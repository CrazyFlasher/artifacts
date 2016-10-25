var fileURI = FLfile.platformPathToURI("@@@1");
var fileName = "@@@2";
var exportBGs = "@@@3";
var taskId = "@@@4";

var doc;

if (taskId == "ingameUI")
{
    var destFileURI = FLfile.platformPathToURI("@@@5");
    var source = fl.openDocument(fileURI + fileName);
    source.library.addItemToDocument({x:0, y:0}, "$common_ui");
    source.clipCut();

    var dest = fl.openDocument(destFileURI);
    dest.clipPaste();
    dest.clipCut();
    dest.save();
    fl.closeDocument(source, false);
    fl.closeDocument(dest);
}else
if (taskId == "level")
{
    doc = fl.openDocument(fileURI + fileName);

    if (exportBGs == "true")
    {
        changeLayersType("normal");
        doc.publish();
    }else
    {
        changeLayersType("guide");
        doc.publish();
    }
}else
if (taskId == "specific_minigame")
{
    doc = fl.openDocument(fileURI + fileName);
    doc.publish();
}else
if (taskId == "all_minigames")
{
    var files = FLfile.listFolder(fileURI + "/*.fla", "files");
    for (file in files) {
        var curFile = files[file];

        fl.openDocument(fileURI + "/" + curFile);
        fl.getDocumentDOM().publish();
        //fl.closeDocument(fl.getDocumentDOM());
    }
}else
if (taskId == "lobby")
{
    doc = fl.openDocument(fileURI + fileName);
    doc.publish();
}

// fl.closeDocument(doc, false);
fl.outputPanel.save(fileURI + "/tempfile");
// fl.quit(false);

function changeLayersType(type) {

    for (var i = 0; i < doc.library.items.length; i++) {
        var item = doc.library.items[i];
        if (item.itemType== "movie clip")
        {
            fl.trace("item " + item.linkageClassName + " " + item.itemType);
            for (var j = 0; j < item.timeline.layers.length; j++) {
                if (item.timeline.layers[j].name == "bg") {
                    item.timeline.layers[j].locked = false;
                    item.timeline.layers[j].layerType = type;
                    //(JSFL bug)
                    item.linkageBaseClass = "flash.display.MovieClip";
                }
            }
        }
    }
}

function setOutputName(outputName) {
    var profileXML = doc.exportPublishProfileString('Default');
    profileXML = profileXML.replace("<html>1</html>", "<html>0</html>");
    profileXML = profileXML.replace("<defaultNames>1</defaultNames>", "<defaultNames>0</defaultNames>");
    profileXML = profileXML.replace("<flashDefaultName>1</flashDefaultName>", "<flashDefaultName>0</flashDefaultName>");

    var findString = "<flashFileName>";
    var startIndex = profileXML.indexOf(findString) + findString.length;
    findString = "</flashFileName>";

    var endIndex = profileXML.indexOf(findString);
    var curName = profileXML.substring(startIndex, endIndex);
    var pubPath = outputName;

    profileXML = profileXML.replace(curName, pubPath);

    doc.importPublishProfileString(profileXML);
}