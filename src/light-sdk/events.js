module.exports = {
  /**
   * @event
   */
  READER_INITIALIZED: "ReaderInitialized",
  /**
   * This gets triggered on every page turnover. It includes spine information and such.
   * @event
   */
  PAGINATION_CHANGED: "PaginationChanged",
  /**
   * @event
   */
  SETTINGS_APPLIED: "SettingsApplied",
  /**
   * @event
   */
  FXL_VIEW_RESIZED: "FXLViewResized",
  /**
   * @event
   */
  READER_VIEW_CREATED: "ReaderViewCreated",
  /**
   * @event
   */
  READER_VIEW_DESTROYED: "ReaderViewDestroyed",
  /**
   * @event
   */
  CONTENT_DOCUMENT_LOAD_START: "ContentDocumentLoadStart",
  /**
   * @event
   */
  CONTENT_DOCUMENT_LOADED: "ContentDocumentLoaded",
  /**
   * @event
   */
  MEDIA_OVERLAY_STATUS_CHANGED: "MediaOverlayStatusChanged",
  /**
   * @event
   */
  MEDIA_OVERLAY_TTS_SPEAK: "MediaOverlayTTSSpeak",
  /**
   * @event
   */
  MEDIA_OVERLAY_TTS_STOP: "MediaOverlayTTSStop"
}