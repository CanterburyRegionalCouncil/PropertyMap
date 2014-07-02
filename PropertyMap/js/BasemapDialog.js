define([
    "dojo/Evented",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/has",
    "esri/kernel",
    "dijit/_WidgetBase",
    "dijit/a11yclick",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/on",
    "dojo/parser",
    "dojo/dom",
     // load template
    "dojo/text!application/dijit/templates/BasemapDialog.html",
    "dojo/i18n!application/nls/BasemapDialog",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-attr",
    "dojo/dom-construct",
    "esri/config",
    "dijit/Dialog",
    "dojo/aspect",
    "esri/dijit/BasemapGallery",
    "esri/dijit/Basemap",
    "esri/dijit/BasemapLayer"
],
    function (
        Evented,
        declare,
        lang,
        array,
        has, esriNS,
        _WidgetBase, a11yclick, _TemplatedMixin, _WidgetsInTemplateMixin,
        on,
        parser,
        dom,
        dijitTemplate, i18n,
        domClass, domStyle, domAttr, domConstruct,
        esriConfig,
        Dialog,
        aspect,
        BasemapGallery, Basemap, BasemapLayer
) {
        var Widget = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
            declaredClass: "esri.dijit.BasemapDialog",
            templateString: dijitTemplate,
            options: {
                theme: "BasemapDialog",
                visible: true,
                dialog: null,
                map: null,
                title: window.document.title,
                summary: '',
                hashtags: '',
                basemapSettings: {}
            },
            // lifecycle: 1
            constructor: function (options, srcRefNode) {
                // mix in settings and defaults
                var defaults = lang.mixin({}, this.options, options);
                // widget node
                this.domNode = srcRefNode;
                this._i18n = i18n;
                // properties
                this.set("theme", defaults.theme);
                this.set("visible", defaults.visible);
                this.set("dialog", defaults.dialog);
                this.set("image", defaults.image);
                this.set("title", defaults.title);
                this.set("summary", defaults.summary);
                this.set("hashtags", defaults.hashtags);
                this.set("basemapSettings", defaults.basemapSettings);

                // listeners
                this.watch("theme", this._updateThemeWatch);
                this.watch("visible", this._visible);
                // classes
                this.css = {
                    container: "button-container",
                    embed: "embed-page",
                    button: "toggle-grey",
                    buttonSelected: "toggle-grey-on",
                    icon: "icon-map",
                    iconContainer: "icon-container",
                    basemapDialogContent: "dialog-content",
                    basemapDialogSubHeader: "print-dialog-subheader",
                    iconClear: "icon-clear"
                };
            },
            // bind listener for button to action
            postCreate: function () {
                this.inherited(arguments);

                // Check for a supplied basemap settings object
                var basemapConfigSettings = this.basemapSettings[this.map.spatialReference.wkid];
                var useAGSBasemaps = basemapConfigSettings == null;
                this.basemaps = [];

                if (!useAGSBasemaps) {
                    array.forEach(basemapConfigSettings, lang.hitch(this, function (basemapSetting) {
                        // Create the basemap layer(s)
                        var layers = [];
                        array.forEach(basemapSetting.layers, lang.hitch(this, function (layerSetting) {
                            var basemaplayer = new BasemapLayer({ url: layerSetting.url });
                            //var basemaplayer = new BasemapLayer({ url: basemapSetting.layers[0].url });
                            layers.push(basemaplayer);
                        }));

                        // Create a basemap
                        var basemap = new Basemap({
                            layers: layers,
                            title: basemapSetting.title,
                            thumbnailUrl: basemapSetting.thumbnail
                        });
                        this.basemaps.push(basemap);
                    }));
                }

                // Create the basemapgallery dijit
                var BG = new BasemapGallery({
                    showArcGISBasemaps: useAGSBasemaps,
                    map: this.map,
                    basemaps: this.basemaps,
                    basemapIds: this.map.basemapLayerIds
                }, 'basemapGallery');
                BG.startup();

                BG.on("error", function (msg) {
                    console.log("basemap gallery error:  ", msg);
                });

                this.own(on(this._buttonNode, a11yclick, lang.hitch(this, this.toggle)));
            },

            // start widget. called by user
            startup: function () {
                this._init();
            },
            // connections/subscriptions will be cleaned up during the destroy() lifecycle phase
            destroy: function () {
                this._removeEvents();
                this.inherited(arguments);
            },
            /* ---------------- */
            /* Public Events */
            /* ---------------- */
            // load
            // open
            // close
            // toggle
            /* ---------------- */
            /* Public Functions */
            /* ---------------- */
            show: function () {
                this.set("visible", true);
            },
            hide: function () {
                this.set("visible", false);
            },
            open: function () {
                domClass.add(this._buttonNode, this.css.buttonSelected);
                this.get("dialog").show();
                //if (this.get("useExtent")) {
                //    this._updateUrl();
                //}
                this.emit("open", {});
                //this._shareLink();
            },
            close: function () {
                this.get("dialog").hide();
                this.emit("close", {});
            },
            toggle: function () {
                var open = this.get("dialog").get("open");
                if (open) {
                    this.close();
                } else {
                    this.open();
                }
                this.emit("toggle", {});
            },
            /* ---------------- */
            /* Private Functions */
            /* ---------------- */
            _removeEvents: function () {
                if (this._events && this._events.length) {
                    for (var i = 0; i < this._events.length; i++) {
                        this._events[i].remove();
                    }
                }
                this._events = [];
            },
            _init: function () {
                // setup events
                this._removeEvents();
                // dialog
                if (!this.get("dialog")) {
                    var dialog = new Dialog({
                        title: i18n.widgets.BasemapDialog.title,
                        draggable: false
                    }, this._dialogNode);
                    this.set("dialog", dialog);
                }
                // dialog hide
                var dialogHide = on(this.get("dialog"), 'hide', lang.hitch(this, function () {
                    domClass.remove(this._buttonNode, this.css.buttonSelected);
                }));
                this._events.push(dialogHide);
                // set visible
                this._visible();
                // rotate
                var rotate = on(window, "orientationchange", lang.hitch(this, function () {
                    var open = this.get("dialog").get("open");
                    if (open) {
                        dialog.hide();
                        dialog.show();
                    }
                }));
                this._events.push(rotate);
                // loaded
                this.set("loaded", true);
                this.emit("load", {});
            },
            _updateThemeWatch: function () {
                var oldVal = arguments[1];
                var newVal = arguments[2];
                if (this.get("loaded")) {
                    domClass.remove(this.domNode, oldVal);
                    domClass.add(this.domNode, newVal);
                }
            },
            _visible: function () {
                if (this.get("visible")) {
                    domStyle.set(this.domNode, 'display', 'block');
                } else {
                    domStyle.set(this.domNode, 'display', 'none');
                }
            }
        });
        if (has("extend-esri")) {
            lang.setObject("dijit.BasemapDialog", Widget, esriNS);
        }
        return Widget;
    });