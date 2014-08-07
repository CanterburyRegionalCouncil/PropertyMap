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
    "dojo/text!application/dijit/templates/HelpButton.html",
    "dojo/i18n!application/nls/HelpButton",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-attr",
    "dojo/dom-construct"
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
        domClass, domStyle, domAttr, domConstruct
) {

        var Widget = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
            declaredClass: "esri.dijit.HelpButton",
            templateString: dijitTemplate,
            options: {
                theme: "HelpButton",
                visible: true,
                dialog: null,
                map: null,
                title: window.document.title,
                summary: '',
                hashtags: '',
                helpLinkUrl: ''
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
                this.set("image", defaults.image);
                this.set("title", defaults.title);
                this.set("summary", defaults.summary);
                this.set("hashtags", defaults.hashtags);
                this.set("helpLinkUrl", defaults.helpLinkUrl);

                // listeners
                this.watch("theme", this._updateThemeWatch);
                this.watch("visible", this._visible);
                // classes
                this.css = {
                    container: "button-container",
                    embed: "embed-page",
                    button: "toggle-grey",
                    buttonSelected: "toggle-grey-on",
                    icon: "icon-star",
                    iconContainer: "icon-container",
                    iconClear: "icon-clear"
                };
            },
            // bind listener for button to action
            postCreate: function () {
                this.inherited(arguments);
                this.own(on(this._buttonNode, a11yclick, lang.hitch(this, this.click)));
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
            // click
            /* ---------------- */
            /* Public Functions */
            /* ---------------- */
            show: function () {
                this.set("visible", true);
            },
            hide: function () {
                this.set("visible", false);
            },
            click: function () {
                window.open(this.helpLinkUrl, "_blank");
                this.emit("click", {});
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
                // set visible
                this._visible();
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
            lang.setObject("dijit.HelpButton", Widget, esriNS);
        }
        return Widget;
    });