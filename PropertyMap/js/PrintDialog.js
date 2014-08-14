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
    "dojo/text!application/dijit/templates/PrintDialog.html",
    "dojo/text!application/dijit/templates/PrintResult.html",
    "dojo/i18n!application/nls/PrintDialog",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-attr",
    "dojo/dom-construct",
    "esri/config",
    "esri/request",
    "esri/urlUtils",
    "dijit/Dialog",
    "dojo/number",
    "esri/tasks/PrintTask",
    "esri/tasks/PrintParameters",
    "esri/tasks/PrintTemplate",
    "esri/tasks/LegendLayer",
    "dijit/form/Form",
    "dijit/form/Select",
    "dijit/form/ValidationTextBox",
    "dijit/form/NumberTextBox",
    "dijit/form/Button",
    "dijit/form/CheckBox",
    "dijit/ProgressBar",
    "dijit/form/DropDownButton",
    "dijit/TooltipDialog",
    "dijit/form/RadioButton",
    "dojo/aspect"
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
        dijitTemplate, printResultTemplate, i18n,
        domClass, domStyle, domAttr, domConstruct,
        esriConfig,
        esriRequest,
        urlUtils,
        Dialog,
        number,
        PrintTask,
        PrintParameters,
        PrintTemplate,
        LegendLayer,
        Form,
        Select,
        ValidationTextBox,
        NumberTextBox,
        Button,
        CheckBox,
        ProgressBar,
        DropDownButton,
        TooltipDialog,
        RadioButton,
        aspect
) {
        var Widget = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
            declaredClass: "esri.dijit.PrintDialog",
            templateString: dijitTemplate,
            options: {
                theme: "PrintDialog",
                visible: true,
                dialog: null,
                useExtent: false,
                map: null,
                authorText: null,
                copyrightText: null,
                defaultFormat: null,
                defaultLayout: null,
                defaultTitle: null,
                title: window.document.title,
                summary: '',
                hashtags: '',
                isAsync: true,
                mapDefinition: null,
                layerInfos: null
            },
            count: 1,
            results: [],
            pdfIcon: "print-icon-pdf",
            imageIcon: "print-icon-image",
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
                this.set("useExtent", defaults.useExtent);
                this.set("defaultMapTitle", defaults.defaultTitle);
                this.set("isAsync", defaults.isAsync);
                this.set("mapDefinition", defaults.mapDefinition);
                this.set("layerInfos", defaults.layerInfos);

                // listeners
                this.watch("theme", this._updateThemeWatch);
                this.watch("visible", this._visible);
                this.watch("useExtent", this._useExtentChanged);
                // classes
                this.css = {
                    container: "button-container",
                    embed: "embed-page",
                    button: "toggle-grey",
                    buttonSelected: "toggle-grey-on",
                    icon: "icon-print",
                    mapSizeLabel: "map-size-label",
                    iconContainer: "icon-container",
                    embedMapSizeDropDown: "embed-map-size-dropdown",
                    printDialogContent: "dialog-content",
                    printDialogSubHeader: "print-dialog-subheader",
                    printDialogTextarea: "print-dialog-textarea",
                    printDialogDropDown: "print-dialog-dropdown",
                    printDialogExtent: "print-dialog-extent",
                    printDialogFormContainer: "print-form-container",
                    printDialogResultsContainer: "print-results-container",
                    printDialogButtonsActionBar: "print-buttons-actionbar",
                    printDialogIcon: "print-icon",
                    mapSizeContainer: "map-size-container",
                    embedMapSizeClear: "embed-map-size-clear",
                    iconClear: "icon-clear"
                };
            },
            // bind listener for button to action
            postCreate: function () {
                this.inherited(arguments);

                this.printTask = new PrintTask(this.printTaskURL, { 'async': this.isAsync });

                this.printTask.printGp.setUpdateDelay(2000);


                this.printparams = new PrintParameters();
                this.printparams.map = this.map;
                this.printparams.outSpatialReference = this.map.spatialReference;

                esriRequest({
                    url: this.printTaskURL,
                    content: {
                        f: "json"
                    },
                    handleAs: "json",
                    callbackParamName: 'callback',
                    load: lang.hitch(this, '_handlePrintInfo'),
                    error: lang.hitch(this, '_handleError')
                });
                aspect.after(this.printTask, '_getPrintDefinition', lang.hitch(this, 'printDefInspector'), false);

                // add proxy rule
                var printRuleURL = this.printTaskURL.replace("http://", "").replace("/GPServer/Export%20Web%20Map", "");
                urlUtils.addProxyRule({
                    urlPrefix: printRuleURL,
                    proxyUrl: esriConfig.defaults.io.proxyUrl
                });

                // Hook up toggle button
                this.own(on(this._buttonNode, a11yclick, lang.hitch(this, this.toggle)));
            },

            printDefInspector: function (printDef) {
                //console.log(printDef);
                //do what you want here then return the object.
                if (this.preserve.preserveScale === 'force') {
                    printDef.mapOptions.scale = this.preserve.forcedScale;
                }
                return printDef;
            },

            _handleError: function (err) {
                console.log('print widget load error: ', err);
            },

            _handlePrintInfo: function (data) {
                var Layout_Template = array.filter(data.parameters, function (param) {
                    return param.name === "Layout_Template";
                });

                if (Layout_Template.length === 0) {
                    console.log("print service parameters name for templates must be \"Layout_Template\"");
                    return;
                }

                var layoutItems = array.map(Layout_Template[0].choiceList, function (item) {
                    return {
                        label: item,
                        value: item
                    };
                });

                layoutItems.sort(function (a, b) {
                    return (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0);
                });

                this._layoutComboNode.innerHTML = '';
                for (var i = 0; i < layoutItems.length; i++) {
                    var option = domConstruct.create("option", {
                        value: layoutItems[i].value,
                        innerHTML: layoutItems[i].label
                    });

                    if (this.defaultLayout) {
                        if (layoutItems[i].value == this.defaultLayout){
                            option.setAttribute("selected",true);
                        }
                    }
                    domConstruct.place(option, this._layoutComboNode, "last");
                }

                var Format = array.filter(data.parameters, function (param) {
                    return param.name === "Format";
                });

                if (Format.length === 0) {
                    console.log("print service parameters name for format must be \"Format\"");
                    return;
                }

                var formatItems = array.map(Format[0].choiceList, function (item) {
                    return {
                        label: item,
                        value: item
                    };
                });

                formatItems.sort(function (a, b) {
                    return (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0);
                });

                this._formatComboNode.innerHTML = '';
                for (var i = 0; i < formatItems.length; i++) {
                    var option = domConstruct.create("option", {
                        value: formatItems[i].value,
                        innerHTML: formatItems[i].label
                    });

                    if (this.defaultFormat) {
                        if (formatItems[i].value == this.defaultFormat) {
                            option.setAttribute('selected', true);
                        }
                    }

                    domConstruct.place(option, this._formatComboNode, "last");
                }
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
                this.emit("open", {});
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
            _setExtentChecked: function () {
                domAttr.set(this._extentInput, 'checked', this.get("useExtent"));
            },
            _useExtentUpdate: function () {
                var value = domAttr.get(this._extentInput, 'checked');
                this.set("useExtent", value);
            },
            _useExtentChanged: function () {
                //this._updateUrl();
                //this._shareLink();  
            },
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
                        title: i18n.widgets.PrintDialog.title,
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
            },
            print: function () {
                if (this.printSettingsFormDijit.isValid()) {
                    var form = this.printSettingsFormDijit.get('value');
                    lang.mixin(form, this.layoutMetadataDijit.get('value'));
                    this.preserve = this.preserveFormDijit.get('value');
                    lang.mixin(form, this.preserve);
                    this.layoutForm = this.layoutFormDijit.get('value');
                    var mapQualityForm = this.mapQualityFormDijit.get('value');
                    var mapOnlyForm = this.mapOnlyFormDijit.get('value');
                    lang.mixin(mapOnlyForm, mapQualityForm);

                    var template = new PrintTemplate();

                    var frmt = dom.byId('format').value;
                    var lyout = dom.byId('layout').value;
                    template.format = frmt;
                    template.layout = lyout;

                    template.preserveScale = (form.preserveScale === 'true' || form.preserveScale === 'force');
                    template.label = form.title;
                    template.exportOptions = mapOnlyForm;

                    // Populate the legend options
                    var layers = this.map.getLayersVisibleAtScale(this.map.getScale());
                    var legendLayers = [], useLayerInfos = true;
                    var tiledLayers = [];

                    if (this.layerInfos != null) {
                        array.forEach(this.layerInfos, function (info) {
                            var legendItem = new LegendLayer();
                            legendItem.layerId = info.layer.id;

                            if (info.layer.visibleLayers)
                                legendItem.subLayerIds = info.layer.visibleLayers;

                            legendLayers.push(legendItem);
                        });

                        // Check for serach results layer - add to the map
                        var hlay = this.map.getLayer("Highlighted Features");
                        if (hlay) {
                            var hlItem = new LegendLayer();
                            hlItem.layerId = "Highlighted Features";
                            legendLayers.push(hlItem);
                        }
                    }

                    array.forEach(layers, function (layer) {
                        //console.log("Print Layer: " + layer.id);

                        if (!useLayerInfos) {
                            var legendItem = new LegendLayer();
                            legendItem.layerId = layer.id;
                            if (layer.visibleLayers)
                                legendItem.subLayerIds = layer.visibleLayers;
                            legendLayers.push(legendItem);
                        }

                        if (layer.tileInfo) {
                            var tInfo = {
                                'id': layer.id,
                                'url': layer.url//,
                                //'title': layer.title
                            };
                            tiledLayers.push(tInfo);
                        }

                    });

                    template.layoutOptions = {
                        authorText: form.author,
                        //copyrightText: form.copyright,
                        legendLayers: (this.layoutForm.legend.length > 0 && this.layoutForm.legend[0]) ? legendLayers : [],
                        titleText: form.title
                        //scalebarUnit: this.layoutForm.scalebarUnit
                    };

                    this.printparams.template = template;
                    this.printparams.extraParameters = {
                        'tiledLayers': tiledLayers
                    };

                    var fileHandel = this.printTask.execute(this.printparams);

                    var result = new printResultDijit({
                        count: this.count.toString(),
                        icon: (frmt === "PDF") ? this.pdfIcon : this.imageIcon,
                        docName: form.title,
                        title: frmt + ', ' + lyout,
                        fileHandle: fileHandel
                    }).placeAt(this.printResultsNode, 'last');
                    result.startup();
                    domStyle.set(this.clearActionBarNode, 'display', 'block');
                    this.count++;
                } else {
                    this.printSettingsFormDijit.validate();
                }
            },
            clearResults: function () {
                domConstruct.empty(this.printResultsNode);
                domStyle.set(this.clearActionBarNode, 'display', 'none');
                this.count = 1;
            },
            updateAuthor: function (user) {
                user = user || '';
                if (user) {
                    this.authorTB.set('value', user);
                }
            },
            getCurrentMapScale: function () {
                this.forceScaleNTB.set('value', this.map.getScale());
            }
        });
        if (has("extend-esri")) {
            lang.setObject("dijit.PrintDialog", Widget, esriNS);
        }

        // Print result dijit
        var printResultDijit = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            widgetsInTemplate: true,
            templateString: printResultTemplate,
            url: null,
            constructor: function (options, srcRefNode) {
                // widget node
                this.domNode = srcRefNode;
                this._i18n = i18n;

                //css
                this.css = {
                    icon: "print-icon"
                };
            },
            postCreate: function () {
                this.inherited(arguments);
                this.fileHandle.then(lang.hitch(this, '_onPrintComplete'), lang.hitch(this, '_onPrintError'));
            },
            _onPrintComplete: function (data) {
                if (data.url) {
                    this.url = data.url;
                    var d = new Date();

                    this.nameNode.innerHTML = "<span class=\"bold\">" + this.docName + "</span>&nbsp<span class=\"printDatestamp\">" + d.toLocaleString() + "</span>";
                    domClass.add(this.resultNode, "printResultHover");
                } else {
                    this._onPrintError(this._i18n.widgets.PrintDialog.printError);
                }
            },
            _onPrintError: function (err) {
                console.log(err);
                this.nameNode.innerHTML = '<span class="bold">' + this._i18n.widgets.PrintDialog.printError + '</span>';
                domClass.add(this.resultNode, "printResultError");
            },
            _openPrint: function () {
                if (this.url !== null) {
                    window.open(this.url);
                }
            }
        });

        return Widget;
    });