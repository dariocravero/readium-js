if (navigator) {
  //This is default implementation of reading system object that will be available for the publication's javascript to analyze at runtime
  //To extend/modify/replace this object reading system should subscribe ReadiumSDK.Events.READER_INITIALIZED and apply changes in reaction to this event
  navigator.epubReadingSystem = {
    name: "",
    version: "0.0.0",
    layoutStyle: "paginated",

    hasFeature: function(feature, version) {

      // for now all features must be version 1.0 so fail fast if the user has asked for something else
      if (version && version !== "1.0") {
        return false;
      }

      if (feature === "dom-manipulation") {
        // Scripts may make structural changes to the document???s DOM (applies to spine-level scripting only).
        return true;
      }
      if (feature === "layout-changes") {
        // Scripts may modify attributes and CSS styles that affect content layout (applies to spine-level scripting only).
        return true;
      }
      if (feature === "touch-events") {
        // The device supports touch events and the Reading System passes touch events to the content.
        return false;
      }
      if (feature === "mouse-events") {
        // The device supports mouse events and the Reading System passes mouse events to the content.
        return true;
      }
      if (feature === "keyboard-events") {
        // The device supports keyboard events and the Reading System passes keyboard events to the content.
        return true;
      }

      if (feature === "spine-scripting") {
        //Spine-level scripting is supported.
        return true;
      }

      return false;
    }
  };
}
