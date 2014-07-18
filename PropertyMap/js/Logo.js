define([
    // For emitting events
    "dojo/Evented",

    // needed to create a class
    "dojo/_base/declare",
    "dojo/_base/lang",

    // widget class
    "dijit/_WidgetBase",

    // accessibility click
    "dijit/a11yclick",

    // templated widget
    "dijit/_TemplatedMixin",

    // handle events
    "dojo/on",

    // load template
    "dojo/text!application/dijit/templates/Logo.html",

    // localization
    "dojo/i18n!application/nls/Logo",

    // dom manipulation
    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/dom-attr",

    // wait for dom to be ready
    "dojo/domReady!"
],
function (
    // make sure these are arranged in the same order as above
    Evented,
    declare, lang,
    _WidgetBase, a11yclick, _TemplatedMixin,
    on,
    dijitTemplate,
    i18n,
    domStyle, domClass, domAttr
) {
    return declare("application.Logo", [_WidgetBase, _TemplatedMixin, Evented], {
        // my html template string
        templateString: dijitTemplate,

        // default options
        options: {
            map: null,
            visible: true,
            url: null
        },

        /* ---------------- */
        /* Lifecycle methods */
        /* ---------------- */
        constructor: function (options, srcRefNode) {
            // css classes
            this.css = {
                logo: "logo-widget"
            };
            // language
            this._i18n = i18n;
            // mix in settings and defaults
            var defaults = lang.mixin({}, this.options, options);
            // create the DOM for this widget
            this.domNode = srcRefNode;
            // set properties
            this.set("map", defaults.map);
            this.set("visible", defaults.visible);
            this.set("container", defaults.container);
            this.set("url", defaults.url);

            // watch for changes
            this.watch("visible", this._visible);
        },
        // _TemplatedMixin implements buildRendering() for you. Use this to override
        // buildRendering: function() {},
        // called after buildRendering() is finished
        postCreate: function () {
            // own this accessible click event button
            // Custom press, release, and click synthetic events which trigger on a left mouse click, touch, or space/enter keyup.
            this.own(on(this.buttonNode, a11yclick, lang.hitch(this, this._openURL)));
        },
        // start widget. called by user
        startup: function () {
            // set visibility
            this._visible();
            // map not defined
            if (!this.get("map")) {
                console.log("map required");
                this.destroy();
                return;
            }
            if (!this.get("container")) {
                this.set("container", this.map.container);
            }
            // when map is loaded
            if (this.map.loaded) {
                this._init();
            } else {
                on.once(this.map, "load", lang.hitch(this, function () {
                    this._init();
                }));
            }
        },
        // connections/subscriptions will be cleaned up during the destroy() lifecycle phase
        destroy: function () {
            // call the superclass method of the same name.
            this.inherited(arguments);
        },
        /* ---------------- */
        /* Public Functions */
        /* ---------------- */
        show: function () {
            this.set("visible", true);
        },
        hide: function () {
            this.set("visible", false);
        },
        /* ---------------- */
        /* Private Functions */
        /* ---------------- */
        _init: function () {
            this.set("loaded", true);

            // emit event
            this.emit("load", {});
        },
        _visible: function () {
            if (this.get("visible")) {
                domStyle.set(this.domNode, "display", "block");
            } else {
                domStyle.set(this.domNode, "display", "none");
            }
        },
        _openURL: function () {
            if (this.url)
            {
                window.open(this.url, "_blank");
            }
        }
    });
});