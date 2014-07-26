define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/connect",
    "esri/arcgis/utils",
    "dojo/dom-construct",
    "dojo/dom",
    "dojo/mouse",
    "dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dijit/TitlePane",  "dijit/Tooltip",
    "dojo/on",
    "dojo/dom-style",
    "dojo/dom-attr",
    "dojo/dom-class",
    "application/TableOfContents",
    "application/ShareDialog",
    "application/PrintDialog",
    "application/BasemapDialog",
    "application/Drawer",
    "application/DrawerMenu",
    "application/Logo",
    "application/TOCTree",
    "application/SuggestionSearch",
    "esri/dijit/HomeButton",
    "esri/dijit/LocateButton",
    "esri/dijit/BasemapToggle",
    "esri/dijit/Geocoder",
    "esri/dijit/Popup",
    "esri/dijit/PopupTemplate",
    "esri/dijit/Legend",
    "application/About",
    "application/SocialLayers",
    "esri/dijit/OverviewMap",
    "dijit/registry",
    "dojo/_base/array",
    "esri/lang",
    "esri/domUtils",
    "esri/graphicsUtils",
    "esri/tasks/query",
    "esri/layers/FeatureLayer",
    "esri/geometry/Extent", "esri/geometry/Point",
    "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol",
    "esri/renderers/SimpleRenderer",
    "esri/Color"
],
function (
    declare,
    lang,
    connect,
    arcgisUtils,
    domConstruct,
    dom,
    mouse,
    BorderContainer, ContentPane, TitlePane, Tooltip,
    on,
    domStyle,
    domAttr,
    domClass,
    TableOfContents, ShareDialog, PrintDialog, BasemapDialog,
    Drawer, DrawerMenu,
    Logo,
    TOCTree,
    SuggestionSearch,
    HomeButton, LocateButton, BasemapToggle,
    Geocoder,
    Popup,
    PopupTemplate,
    Legend,
    About,
    SocialLayers,
    OverviewMap,
    registry,
    array,
    esriLang,
    domUtils,
    graphicsUtils,
    Query,
    FeatureLayer,
    Extent, Point,
    SimpleMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol,
    SimpleRenderer,
    Color
) {
    return declare("", [About, SocialLayers], {
        config: {},
        constructor: function () {
            // css classes
            this.css = {
                mobileSearchDisplay: "mobile-locate-box-display",
                toggleBlue: 'toggle-grey',
                toggleBlueOn: 'toggle-grey-on',
                panelPadding: "panel-padding",
                panelContainer: "panel-container",
                panelHeader: "panel-header",
                panelSection: "panel-section",
                panelSummary: "panel-summary",
                panelDescription: "panel-description",
                panelModified: "panel-modified-date",
                panelMoreInfo: "panel-more-info",
                pointerEvents: "pointer-events",
                iconRight: "icon-right",
                iconList: "icon-list",
                iconLayers: "icon-layers",
                iconAbout: "icon-info-circled-1",
                iconText: "icon-text",
                iconDetails: "icon-home-1",
                locateButtonTheme: "LocateButtonCalcite",
                homebuttonTheme: "HomeButtonCalcite",
                desktopGeocoderTheme: "geocoder-desktop",
                mobileGeocoderTheme: "geocoder-mobile",
                appLoading: "app-loading",
                appError: "app-error",
                disabled: "disabled"
            };
            // pointer event support
            if (this._pointerEventsSupport()) {
                domClass.add(document.documentElement, this.css.pointerEvents);
            }
            // mobile size switch domClass
            this._showDrawerSize = 850;
        },
        startup: function (config) {
            // config will contain application and user defined info for the template such as i18n strings, the web map id
            // and application id
            // any url parameters and any application specific configuration information.
            if (config) {
                //config will contain application and user defined info for the template such as i18n strings, the web map id
                // and application id
                // any url parameters and any application specific configuration information.
                this.config = config;
                // drawer
                this._drawer = new Drawer({
                    direction: this.config.i18n.direction,
                    showDrawerSize: this._showDrawerSize,
                    borderContainer: 'bc_outer',
                    contentPaneCenter: 'cp_outer_center',
                    contentPaneSide: 'cp_outer_left',
                    toggleButton: 'hamburger_button'
                });
                // drawer resize event
                on(this._drawer, 'resize', lang.hitch(this, function () {
                    // check mobile button status
                    this._checkMobileGeocoderVisibility();
                }));
                // startup drawer
                this._drawer.startup();
                //supply either the webmap id or, if available, the item info 
                var itemInfo = this.config.itemInfo || this.config.webmap;
                this._createWebMap(itemInfo);
            } else {
                var error = new Error("Main:: Config is not defined");
                this.reportError(error);
            }
        },
        reportError: function (error) {
            // remove spinner
            this._hideLoadingIndicator();
            // add app error
            domClass.add(document.body, this.css.appError);
            // set message
            var node = dom.byId('error_message');
            if (node) {
                if (this.config && this.config.i18n) {
                    node.innerHTML = this.config.i18n.map.error + ": " + error.message;
                } else {
                    node.innerHTML = "Unable to create map: " + error.message;
                }
            }
        },
        // if pointer events are supported
        _pointerEventsSupport: function () {
            var element = document.createElement('x');
            element.style.cssText = 'pointer-events:auto';
            return element.style.pointerEvents === 'auto';
        },
        _initLogo: function () {
            if (this.config.showOrgLogo) {
                var logoNode = dom.byId('LogoDiv');
                if (logoNode) {
                    this._logo = new Logo({
                        map: this.map,
                        url: this.config.orgLogoLinkUrl
                    }, logoNode);
                    this._logo.startup();
                }
            }
        },
        _initLegend: function () {
            var legendNode = dom.byId('LegendDiv');
            if (legendNode) {
                this._mapLegend = new Legend({
                    map: this.map,
                    layerInfos: this.layerInfos
                }, legendNode);
                this._mapLegend.startup();
            }
        },
        _initTOC: function () {
            // layers
            var tocNode = dom.byId('TableOfContents'), socialTocNode, tocLayers, socialTocLayers, toc, socialToc;
            if (tocNode) {
                // Check if the standard layers panel is loaded or the TOC tree control - only one should be located
                if (this.config.enableLayersPanel) {
                    tocLayers = this.layers;
                    toc = new TableOfContents({
                        map: this.map,
                        layers: tocLayers
                    }, tocNode);
                    toc.startup();
                } else if (this.config.enableTOCTreePanel) {
                    // Build the tocLayers List
                    tocLayers = [];

                    array.forEach(this.layers, function (layer) {
                        var layerInfo = {
                            layer: layer.layerObject,
                            title: layer.title
                        };
                        tocLayers.push(layerInfo);
                    });

                    // toc Tree related class to TableOfContents container
                    domClass.add(tocNode, "agsjsTOCContainer");

                    // Add the toc
                    toc = new TOCTree({
                        map: this.map,
                        layerInfos: tocLayers
                    }, tocNode);
                    toc.startup();
                }
            }
            // if we have social layers
            if (this.socialLayers && this.socialLayers.length) {
                // add social specific html
                var content = '';
                content += '<div class="' + this.css.panelHeader + '">' + this.config.i18n.social.mediaLayers + '</div>';
                content += '<div class="' + this.css.panelContainer + '">';
                content += '<div class="' + this.css.panelDescription + '">' + this.config.i18n.social.mediaLayersDescription + '</div>';
                content += '<div id="MediaTableOfContents"></div>';
                content += '</div>';
                // get node to insert
                var node = dom.byId('social_media_layers');
                if (node) {
                    node.innerHTML = content;
                }
                // get toc node for social layers
                socialTocNode = dom.byId('MediaTableOfContents');
                // if node exists
                if (socialTocNode) {
                    socialTocLayers = this.socialLayers;
                    socialToc = new TableOfContents({
                        map: this.map,
                        layers: socialTocLayers
                    }, socialTocNode);
                    socialToc.startup();
                }
            }
        },
        _initDetailsPanel: function () {
            var detNode = dom.byId('DetailsDiv')
            if (detNode) {
                var bc = new BorderContainer({
                    style: "width: 100%; height: 100%;"
                });

                var heading = new ContentPane({
                    region: "top",
                    style: "height: 30px",
                    content: "<div style=\"display:block; width: 100%;\"><div id=\"pager\" style=\"display:none\" ><a href='javascript:void(0);' id =\"recordprevious\" class=\"nav\" style=\"text-decoration: none;\" title=\"Previous Record\">\<</a>&nbsp;<a href=\"javascript:void(0);\" id=\"recordnext\" class=\"nav\" style=\"text-decoration: none;\" title=\"Next Record\">\></a></div><div id=\"featureCount\" class=\"featureCount\" >Click to select feature(s)</div></div>"
                });
                bc.addChild(heading);

                this._PopupPanel = new ContentPane({
                    id: "DetailsPanel",
                    region: "center",
                    content: "",
                    style: "width: 100%;"
                });
                bc.addChild(this._PopupPanel);

                var footer = new ContentPane({
                    region: "bottom",
                    style: "height: 30px",
                    content: "<div style=\"display:block; width: 100%;\"><a href='javascript:void(0);' id =\"zoomToRecord\" class=\"nav\" style=\"text-decoration: none;\" title=\"Zoom To Current\">\Zoom To Current</a></div><div id=\"featureTags\" class=\"idFeatureTags\"></div>"
                });
                bc.addChild(footer);

                bc.placeAt(detNode);
                bc.startup();

                //setup event handlers for the buttons
                on(dom.byId("recordprevious"), "click", lang.hitch(this, function () { this._selectPrevious(); }));
                on(dom.byId("recordnext"), "click", lang.hitch(this, function () { this._selectNext(); }));
                on(dom.byId("zoomToRecord"), "click", lang.hitch(this, function () { this._zoomCurrent(); }));
            }
        },
        _selectPrevious: function () {
            // Check to marke sure the info template/graphics layer is set
            array.forEach(this.map.infoWindow.features, lang.hitch(this, function (f) {
                if (!f._graphicsLayer && !f.infoTemplate) {
                    // Assume it is the search layer
                    f.setInfoTemplate(this._searchLayer.infoTemplate)
                }
            }));
            this.map.infoWindow.selectPrevious();
        },
        _selectNext: function () {
            // Check to marke sure the info template/graphics layer is set
            array.forEach(this.map.infoWindow.features, lang.hitch(this, function (f) {
                if (!f._graphicsLayer && !f.infoTemplate) {
                    // Assume it is the search layer
                    f.setInfoTemplate(this._searchLayer.infoTemplate)
                }
            }));
            this.map.infoWindow.selectNext();
        },
        _zoomCurrent: function () {
            // Zoom to tyhe currently selected feature in the details panel
            var feature = this.map.infoWindow.getSelectedFeature();
            if (feature) {
                this._zoomToFeatures([feature]);
            }
        },
        _updateRecordButtonState: function () {
            var recordCount = this.map.infoWindow.count;
            var currentIndex = this.map.infoWindow.selectedIndex;

            if (currentIndex == 0 && !domClass.contains(dom.byId("recordprevious"), "disabled")) {

            } else if (currentIndex != 0 && domClass.contains(dom.byId("recordprevious"), "disabled")) {
                domClass.remove(dom.byId("recordprevious"), "disabled");
            }

            if (currentIndex + 1 == recordCount && !domClass.contains(dom.byId("recordnext"), "disabled")) {
                domClass.add(dom.byId("recordnext"), "disabled");
            } else if (currentIndex + 1 != recordCount && domClass.contains(dom.byId("recordnext"), "disabled")) {
                domClass.remove(dom.byId("recordnext"), "disabled");
            }

            // Update the position numbers
            dom.byId("featureCount").innerHTML = lang.replace("{0} of {1} feature(s) selected", [currentIndex + 1, recordCount]); //popup.features.length + " feature(s) selected";
        },
        _init: function () {
            // menu panels
            this.drawerMenus = [];
            var content, menuObj;
            // map panel enabled
            if (this.config.enableAboutPanel) {
                content = '';
                content += '<div class="' + this.css.panelContainer + '">';
                // if summary enabled
                if (this.config.enableSummaryInfo) {
                    content += '<div class="' + this.css.panelHeader + '">' + this.config.title + '</div>';
                    content += '<div class="' + this.css.panelSummary + '" id="summary"></div>';
                    if (this.config.enableModifiedDate) {
                        content += '<div class="' + this.css.panelModified + '" id="date_modified"></div>';
                    }
                    if (this.config.enableMoreInfo) {
                        content += '<div class="' + this.css.panelMoreInfo + '" id="more_info_link"></div>';
                    }
                }
                // show notes layer and has one of required things for getting notes layer
                if (this.config.notesLayer && this.config.notesLayer.id) {
                    content += '<div id="map_notes_section">';
                    content += '<div class="' + this.css.panelHeader + '"><span id="map_notes_title">' + this.config.i18n.general.featured + '</span></div>';
                    content += '<div class="' + this.css.panelSection + '" id="map_notes"></div>';
                    content += '</div>';
                }
                // show bookmarks and has bookmarks
                if (this.config.enableBookmarks && this.bookmarks && this.bookmarks.length) {
                    content += '<div class="' + this.css.panelHeader + '">' + this.config.i18n.mapNotes.bookmarks + '</div>';
                    content += '<div class="' + this.css.panelSection + '" id="map_bookmarks"></div>';
                }
                content += '</div>';
                // menu info
                menuObj = {
                    title: this.config.i18n.general.about,
                    label: '<div class="' + this.css.iconAbout + '"></div><div class="' + this.css.iconText + '">' + this.config.i18n.general.about + '</div>',
                    content: content
                };
                // map menu
                if (this.config.defaultPanel === 'about') {
                    this.drawerMenus.splice(0, 0, menuObj);
                }
                else {
                    this.drawerMenus.push(menuObj);
                }
            }
            if (this.config.enableLegendPanel) {
                content = '';
                content += '<div class="' + this.css.panelHeader + '">' + this.config.i18n.general.legend + '</div>';
                content += '<div class="' + this.css.panelContainer + '">';
                content += '<div class="' + this.css.panelPadding + '">';
                content += '<div id="twitter_legend_auth"></div>';
                content += '<div id="LegendDiv"></div>';
                content += '</div>';
                content += '</div>';
                // menu info
                menuObj = {
                    title: this.config.i18n.general.legend,
                    label: '<div class="' + this.css.iconList + '"></div><div class="' + this.css.iconText + '">' + this.config.i18n.general.legend + '</div>',
                    content: content
                };
                // legend menu
                if (this.config.defaultPanel === 'legend') {
                    this.drawerMenus.splice(0, 0, menuObj);
                }
                else {
                    this.drawerMenus.push(menuObj);
                }
            }
            // Layers Panel
            if (this.config.enableLayersPanel || this.config.enableTOCTreePanel) {
                content = '';
                content += '<div class="' + this.css.panelHeader + '">' + this.config.i18n.general.layers + '</div>';
                content += '<div class="' + this.css.panelContainer + '">';
                content += '<div id="TableOfContents"></div>';
                content += '</div>';
                content += '<div id="social_media_layers"></div>';
                // menu info
                menuObj = {
                    title: this.config.i18n.general.layers,
                    label: '<div class="' + this.css.iconLayers + '"></div><div class="' + this.css.iconText + '">' + this.config.i18n.general.layers + '</div>',
                    content: content
                };
                // layers menu
                if (this.config.defaultPanel === 'layers') {
                    this.drawerMenus.splice(0, 0, menuObj);
                }
                else {
                    this.drawerMenus.push(menuObj);
                }
            }
            // Details Panel
            if (this.config.enableDetailsPanel) {
                content = '';
                content += '<div class="' + this.css.panelHeader + '">Details</div>';
                content += '<div class="' + this.css.panelContainer + '" >';
                content += '<div class="' + this.css.panelPadding + '" >';
                content += '<div id="DetailsDiv" style="height: 400px;"></div>';
                content += '</div>';
                content += '</div>';
                // menu info
                menuObj = {
                    title: "Property Details",
                    label: '<div class="' + this.css.iconDetails + '"></div><div class="' + this.css.iconText + '">Details</div>',
                    content: content
                };
                // details menu
                if (this.config.defaultPanel === 'details') {
                    this.drawerMenus.splice(0, 0, menuObj);
                }
                else {
                    this.drawerMenus.push(menuObj);
                }

                //// Update the map to put the popup in the details tab rather than on the map
                this.map.infoWindow.set("popupWindow", false);
                var popup = this.map.infoWindow;

                connect.connect(popup, "onSelectionChange", lang.hitch(this, function (event) {
                    this._displayPopupContent(popup.getSelectedFeature());
                }));

                ////when the selection is cleared remove the popup content from the side panel. 
                connect.connect(popup, "onClearFeatures", function () {
                    //dom.byId replaces dojo.byId
                    dom.byId("featureCount").innerHTML = "Click to select feature(s)";

                    //registry.byId replaces dijit.byId
                    registry.byId("DetailsPanel").set("content", "");
                    domUtils.hide(dom.byId("pager"));
                });

                ////When features are associated with the  map's info window update the sidebar with the new content. 
                connect.connect(popup, "onSetFeatures", lang.hitch(this, function (event) {
                    this._displayPopupContent(popup.getSelectedFeature());

                    //enable navigation if more than one feature is selected 
                    popup.features.length > 1 ? domUtils.show(dom.byId("pager")) : domUtils.hide(dom.byId("pager"));

                    ////construct feature tags
                    //var html = "";
                    //array.forEach(popup.features, function (feature) {
                    //    html += "<a href=\"javascript:void(0);\" class=\"featureTag\">" + feature.getLayer().name + "</>&nbsp;";
                    //});

                    //dom.byId("featureTags").innerHTML = html;
                }));

                ////Connect an extant change handler to the map to deal with showing/hiding the tooltip dialog for zoom to extent  
                connect.connect(this.map, "onExtentChange", lang.hitch(this, function (event) {
                    this._checkFeatureExtents(event.extent);
                }));
            }
            // menus
            this._drawerMenu = new DrawerMenu({
                menus: this.drawerMenus
            }, dom.byId("drawer_menus"));
            this._drawerMenu.startup();
            // locate button
            if (this.config.enableLocateButton) {
                this._LB = new LocateButton({
                    map: this.map,
                    theme: this.css.locateButtonTheme
                }, 'LocateButton');
                this._LB.startup();
            }
            // home button
            if (this.config.enableHomeButton) {
                this._HB = new HomeButton({
                    map: this.map,
                    theme: this.css.homebuttonTheme
                }, 'HomeButton');
                this._HB.startup();
                // clear locate on home button
                on(this._HB, 'home', lang.hitch(this, function () {
                    if (this._LB) {
                        this._LB.clear();
                    }
                }));
            }
            // basemap toggle
            if (this.config.enableBasemapToggle) {
                var BT = new BasemapToggle({
                    map: this.map,
                    basemap: this.config.nextBasemap,
                    defaultBasemap: this.config.defaultBasemap
                }, 'BasemapToggle');
                BT.startup();
                /* Start temporary until after JSAPI 4.0 is released */
                var layers = this.map.getLayersVisibleAtScale(this.map.getScale());
                on.once(this.map, 'basemap-change', lang.hitch(this, function () {
                    for (var i = 0; i < layers.length; i++) {
                        if (layers[i]._basemapGalleryLayerType) {
                            var layer = this.map.getLayer(layers[i].id);
                            this.map.removeLayer(layer);
                        }
                    }
                }));
                /* END temporary until after JSAPI 4.0 is released */
            }
            // basemap gallery
            if (this.config.enableBasemapGallery) {
                this._BasemapDialog = new BasemapDialog({
                    theme: this.css.iconRight,
                    map: this.map,
                    title: this.config.title,
                    summary: this.item.snippet,
                    hashtags: 'esriPIM',
                    basemapSettings: this.config.baseMapSettings
                }, 'BasemapDialog');
                this._BasemapDialog.startup();
            }
            // share dialog
            if (this.config.enableShareDialog) {
                this._ShareDialog = new ShareDialog({
                    theme: this.css.iconRight,
                    bitlyLogin: this.config.bitlyLogin,
                    bitlyKey: this.config.bitlyKey,
                    map: this.map,
                    image: this.config.sharinghost + '/sharing/rest/content/items/' + this.item.id + '/info/' + this.item.thumbnail,
                    title: this.config.title,
                    summary: this.item.snippet,
                    hashtags: 'esriPIM'
                }, 'ShareDialog');
                this._ShareDialog.startup();
            }
            // print dialog
            if (this.config.enablePrintDialog) {
                var itemInfo = this.config.itemInfo || this.config.webmap;

                this._PrintDialog = new PrintDialog({
                    theme: this.css.iconRight,
                    map: this.map,
                    title: this.config.title,
                    summary: this.item.snippet,
                    hashtags: 'esriPIM',

                    printTaskURL: this.config.helperServices.printTask.url,
                    isAsync: this.config.helperServices.printTask.isAsync,
                    defaultAuthor: this.config.helperServices.printTask.defaultAuthor,
                    defaultCopyright: this.config.helperServices.printTask.defaultCopyright,
                    defaultTitle: this.config.helperServices.printTask.defaultTitle,
                    defaultFormat: this.config.helperServices.printTask.defaultFormat,
                    defaultLayout: this.config.helperServices.printTask.defaultLayout,
                    mapDefinition: itemInfo
                }, 'PrintDialog');
                this._PrintDialog.startup();
            }
            // i18n overview placement
            var overviewPlacement = 'left';
            if (this.config.i18n.direction === 'rtl') {
                overviewPlacement = 'right';
            }
            // Overview Map
            if (this.config.enableOverviewMap) {
                this._overviewMap = new OverviewMap({
                    attachTo: "bottom-" + overviewPlacement,
                    height: 150,
                    width: 150,
                    visible: this.config.openOverviewMap,
                    map: this.map
                });
                this._overviewMap.startup();
            }

            if (this.config.enableESRIGeocoder) {
                // geocoders
                this._createGeocoders();
            }
            if (this.config.enableSuggestionSearch) {
                // Suggestion Search
                this._createSuggestionSearch();
            }
            // startup social
            this.initSocial();
            // startup map panel
            this.initAboutPanel();
            // startup legend
            this._initLegend();
            // startup toc
            this._initTOC();
            // startup popup panel
            this._initDetailsPanel();
            // set social dialogs
            this.configureSocial();
            // startup the logo
            this._initLogo();
            // on body click containing underlay class
            on(document.body, '.dijitDialogUnderlay:click', function () {
                // get all dialogs
                var filtered = array.filter(registry.toArray(), function (w) {
                    return w && w.declaredClass == "dijit.Dialog";
                });
                // hide all dialogs
                array.forEach(filtered, function (w) {
                    w.hide();
                });
            });

            // Look for search parameter
            if (this.config.enableParameterSearch && this.config.SEARCH) {
                //Split the search parameter into parts
                var s = this.config.SEARCH.split("|");

                // Get the search seting with the given value
                var srch = this.config.searchSettings[s[0]];
                if (srch) {
                    // Check if an extent has been suppplied as a URL param - if so this gets priority over the feature extent 
                    if (this.config.extent) {
                        this.useURLExtent = true;
                    }

                    this._initiateLayerQuery(srch, s[1]);
                }
            }

            // hide loading div
            this._hideLoadingIndicator();
            // swipe layer
            if (this.config.swipeLayer && this.config.swipeLayer.id) {
                // get swipe tool
                require(["esri/dijit/LayerSwipe"], lang.hitch(this, function (LayerSwipe) {
                    // get layer
                    var layer = this.map.getLayer(this.config.swipeLayer.id);
                    if (layer) {
                        // create swipe
                        var layerSwipe = new LayerSwipe({
                            type: this.config.swipeType,
                            invertPlacement: this.config.swipeInvertPlacement,
                            map: this.map,
                            layers: [layer]
                        }, "swipeDiv");
                        layerSwipe.startup();
                    }
                }));
            }
            // drawer size check
            this._drawer.resize();
        },
        _checkMobileGeocoderVisibility: function () {
            if (this._mobileGeocoderIconNode && this._mobileSearchNode) {
                // check if mobile icon needs to be selected
                if (domClass.contains(this._mobileGeocoderIconNode, this.css.toggleBlueOn)) {
                    domClass.add(this._mobileSearchNode, this.css.mobileSearchDisplay);
                }
            }
        },
        _showMobileGeocoder: function () {
            if (this._mobileSearchNode && this._mobileGeocoderIconContainerNode) {
                domClass.add(this._mobileSearchNode, this.css.mobileSearchDisplay);
                domClass.replace(this._mobileGeocoderIconContainerNode, this.css.toggleBlueOn, this.css.toggleBlue);
            }
        },
        _hideMobileGeocoder: function () {
            if (this._mobileSearchNode && this._mobileGeocoderIconContainerNode) {
                domClass.remove(this._mobileSearchNode, this.css.mobileSearchDisplay);
                domStyle.set(this._mobileSearchNode, "display", "none");
                domClass.replace(this._mobileGeocoderIconContainerNode, this.css.toggleBlue, this.css.toggleBlueOn);
            }
        },
        _setTitle: function (title) {
            // set config title
            this.config.title = title;
            // window title
            window.document.title = title;
        },
        _setTitleBar: function () {
            // map title node
            var node = dom.byId('title');
            if (node) {
                // set title
                node.innerHTML = this.config.title;
                // title attribute
                domAttr.set(node, "title", this.config.title);
            }
        },
        _createGeocoderOptions: function () {
            var hasEsri = false, esriIdx, geocoders = lang.clone(this.config.helperServices.geocode);
            // default options
            var options = {
                map: this.map,
                autoNavigate: true,
                autoComplete: true,
                arcgisGeocoder: {
                    placeholder: this.config.i18n.general.find
                },
                geocoders: null
            };
            //only use geocoders with a url defined
            geocoders = array.filter(geocoders, function (geocoder) {
                if (geocoder.url) {
                    return true;
                }
                else {
                    return false;
                }
            });
            // at least 1 geocoder defined
            if (geocoders.length) {
                // each geocoder
                array.forEach(geocoders, lang.hitch(this, function (geocoder) {
                    // if esri geocoder
                    if (geocoder.url && geocoder.url.indexOf(".arcgis.com/arcgis/rest/services/World/GeocodeServer") > -1) {
                        hasEsri = true;
                        geocoder.name = "Esri World Geocoder";
                        geocoder.outFields = "Match_addr, stAddr, City";
                        geocoder.singleLineFieldName = "Single Line";
                        geocoder.esri = true;
                        geocoder.placefinding = true;
                        geocoder.placeholder = this.config.i18n.general.find;
                    }
                }));
                //only use geocoders with a singleLineFieldName that allow placefinding unless its custom
                geocoders = array.filter(geocoders, function (geocoder) {
                    if (geocoder.name && geocoder.name === "Custom") {
                        return (esriLang.isDefined(geocoder.singleLineFieldName));
                    } else {
                        return (esriLang.isDefined(geocoder.singleLineFieldName) && esriLang.isDefined(geocoder.placefinding) && geocoder.placefinding);
                    }
                });
                // if we have an esri geocoder
                if (hasEsri) {
                    for (var i = 0; i < geocoders.length; i++) {
                        if (esriLang.isDefined(geocoders[i].esri) && geocoders[i].esri === true) {
                            esriIdx = i;
                            break;
                        }
                    }
                }
                // set autoComplete
                options.autoComplete = hasEsri;
                // set esri options
                if (hasEsri) {
                    options.minCharacters = 0;
                    options.maxLocations = 5;
                    options.searchDelay = 100;
                }
                //If the World geocoder is primary enable auto complete 
                if (hasEsri && esriIdx === 0) {
                    options.arcgisGeocoder = geocoders.splice(0, 1)[0]; //geocoders[0];
                    if (geocoders.length > 0) {
                        options.geocoders = geocoders;
                    }
                } else {
                    options.arcgisGeocoder = false;
                    options.geocoders = geocoders;
                }
            }
            return options;
        },
        // create geocoder widgets
        _createGeocoders: function () {
            // get options
            var createdOptions = this._createGeocoderOptions();
            // desktop geocoder options
            var desktopOptions = lang.mixin({}, createdOptions, {
                theme: this.css.desktopGeocoderTheme
            });
            // mobile geocoder options
            var mobileOptions = lang.mixin({}, createdOptions, {
                theme: this.css.mobileGeocoderTheme
            });
            // desktop size geocoder
            this._geocoder = new Geocoder(desktopOptions, dom.byId("geocoderSearch"));
            this._geocoder.startup();
            // geocoder results
            on(this._geocoder, 'find-results', lang.hitch(this, function (response) {
                if (!response.results || !response.results.results || !response.results.results.length) {
                    alert(this.config.i18n.general.noSearchResult);
                }
            }));
            // mobile sized geocoder
            this._mobileGeocoder = new Geocoder(mobileOptions, dom.byId("geocoderMobile"));
            this._mobileGeocoder.startup();
            // geocoder results
            on(this._mobileGeocoder, 'find-results', lang.hitch(this, function (response) {
                if (!response.results || !response.results.results || !response.results.results.length) {
                    alert(this.config.i18n.general.noSearchResult);
                }
                this._hideMobileGeocoder();
            }));
            // keep geocoder values in sync
            this._geocoder.watch("value", lang.hitch(this, function () {
                var value = arguments[2];
                this._mobileGeocoder.set("value", value);
            }));
            // keep geocoder values in sync
            this._mobileGeocoder.watch("value", lang.hitch(this, function () {
                var value = arguments[2];
                this._geocoder.set("value", value);
            }));
            // geocoder nodes
            this._mobileGeocoderIconNode = dom.byId("mobileGeocoderIcon");
            this._mobileSearchNode = dom.byId("mobileSearch");
            this._mobileGeocoderIconContainerNode = dom.byId("mobileGeocoderIconContainer");
            // mobile geocoder toggle 
            if (this._mobileGeocoderIconNode) {
                on(this._mobileGeocoderIconNode, "click", lang.hitch(this, function () {
                    if (domStyle.get(this._mobileSearchNode, "display") === "none") {
                        this._showMobileGeocoder();
                    } else {
                        this._hideMobileGeocoder();
                    }
                }));
            }
            var closeMobileGeocoderNode = dom.byId("btnCloseGeocoder");
            if (closeMobileGeocoderNode) {
                // cancel mobile geocoder
                on(closeMobileGeocoderNode, "click", lang.hitch(this, function () {
                    this._hideMobileGeocoder();
                }));
            }
        },
        _createSuggestionSearchOptions: function () {
            // default options
            var options = {
                map: this.map,
                autoNavigate: true,
                autoComplete: true,
                arcgisGeocoder: {
                    placeholder: this.config.i18n.general.find
                },
                serviceURL: this.config.helperServices.suggestion.url,
                classFilter: this.config.helperServices.suggestion.filter,
                geocoders: null
            };
            return options;
        },
        _createSuggestionSearch: function () {
            // get options
            var createdOptions = this._createSuggestionSearchOptions();
            // desktop geocoder options
            var desktopOptions = lang.mixin({}, createdOptions, {
                theme: this.css.desktopGeocoderTheme
            });
            // mobile geocoder options
            var mobileOptions = lang.mixin({}, createdOptions, {
                theme: this.css.mobileGeocoderTheme
            });
            // desktop size geocoder
            this._geocoder = new SuggestionSearch(desktopOptions, dom.byId("geocoderSearch"));
            this._geocoder.startup();
            // geocoder results
            on(this._geocoder, 'find-results', lang.hitch(this, function (response) {
                if (!response.results || !response.results.suggestion) {
                    alert(this.config.i18n.general.noSearchResult);
                } else {
                    // Get the search seting with the given value
                    var srch = this.config.searchSettings[response.results.suggestion.searchclass];
                    if (srch) {
                        // Initiate a search agains the configured layer
                        this._initiateLayerQuery(srch, response.results.suggestion.searchkey);
                    } else {
                        // Zoom to the location specified and initiate a click event for the popups
                        var pt;

                        switch (this.map.spatialReference.wkid) {
                            case 4326:
                            case 102100:
                                // use the lat/long values for the zoom to point
                                pt = new Point(response.results.suggestion.longitude, response.results.suggestion.latitude);
                                break;

                            default:
                                // Use the suggestion x and y values for the zoom to point

                                // Check for x and y values 
                                if (response.results.suggestion.x != 0 && response.results.suggestion.y != 0) {
                                    pt = new Point(response.results.suggestion.x, response.results.suggestion.y, this.map.spatialReference);
                                }
                                break;
                        }

                        // Centre the map on the given point 
                        if (pt) {
                            this.map.centerAt(pt);

                            var screenPt = this.map.toScreen(pt);
                            var event = document.createEvent('MouseEvents');
                            event.initMouseEvent('click', true, true, document.defaultView, 0,
                                0, 0, 0, 0, false, false, false, false, 0, null);
                            event.mapPoint = pt;
                            event.screenPoint = screenPt;

                            this.map.emit('click', event);
                        }
                    }
                }
            }));
            // mobile sized geocoder
            this._mobileGeocoder = new SuggestionSearch(mobileOptions, dom.byId("geocoderMobile"));
            this._mobileGeocoder.startup();
            // geocoder results
            on(this._mobileGeocoder, 'find-results', lang.hitch(this, function (response) {
                if (!response.results || !response.results.results || !response.results.results.length) {
                    alert(this.config.i18n.general.noSearchResult);
                }
                this._hideMobileGeocoder();
            }));
            // keep geocoder values in sync
            this._geocoder.watch("value", lang.hitch(this, function () {
                var value = arguments[2];
                this._mobileGeocoder.set("value", value);
            }));
            // keep geocoder values in sync
            this._mobileGeocoder.watch("value", lang.hitch(this, function () {
                var value = arguments[2];
                this._geocoder.set("value", value);
            }));
            // geocoder nodes
            this._mobileGeocoderIconNode = dom.byId("mobileGeocoderIcon");
            this._mobileSearchNode = dom.byId("mobileSearch");
            this._mobileGeocoderIconContainerNode = dom.byId("mobileGeocoderIconContainer");
            // mobile geocoder toggle 
            if (this._mobileGeocoderIconNode) {
                on(this._mobileGeocoderIconNode, "click", lang.hitch(this, function () {
                    if (domStyle.get(this._mobileSearchNode, "display") === "none") {
                        this._showMobileGeocoder();
                    } else {
                        this._hideMobileGeocoder();
                    }
                }));
            }
            var closeMobileGeocoderNode = dom.byId("btnCloseGeocoder");
            if (closeMobileGeocoderNode) {
                // cancel mobile geocoder
                on(closeMobileGeocoderNode, "click", lang.hitch(this, function () {
                    this._hideMobileGeocoder();
                }));
            }
        },

        // hide map loading spinner
        _hideLoadingIndicator: function () {
            // add loaded class
            domClass.remove(document.body, this.css.appLoading);
        },
        //create a map based on the input web map id
        _createWebMap: function (itemInfo) {
            // popup dijit
            var customPopup = new Popup({}, domConstruct.create("div"));
            // add popup theme
            domClass.add(customPopup.domNode, "calcite");
            // set extent from URL Param
            if (this.config.extent) {
                var e = this.config.extent.split(',');
                if (e.length === 4) {
                    itemInfo.item.extent = [
                        [
                            parseFloat(e[0]),
                            parseFloat(e[1])
                        ],
                        [
                            parseFloat(e[2]),
                            parseFloat(e[3])
                        ]
                    ];
                }
            }
            //can be defined for the popup like modifying the highlight symbol, margin etc.
            arcgisUtils.createMap(itemInfo, "mapDiv", {
                mapOptions: {
                    infoWindow: customPopup,
                    showAttribution: this.config.showAttribution,
                    logo: this.config.showESRILogo
                    //Optionally define additional map config here for example you can
                    //turn the slider off, display info windows, disable wraparound 180, slider position and more.
                },
                bingMapsKey: this.config.bingmapskey
            }).then(lang.hitch(this, function (response) {
                //Once the map is created we get access to the response which provides important info
                //such as the map, operational layers, popup info and more. This object will also contain
                //any custom options you defined for the template. In this example that is the 'theme' property.
                //Here' we'll use it to update the application to match the specified color theme.
                this.map = response.map;
                this.layers = response.itemInfo.itemData.operationalLayers;
                this.item = response.itemInfo.item;
                this.bookmarks = response.itemInfo.itemData.bookmarks;
                this.layerInfos = arcgisUtils.getLegendLayers(response);
                // window title and config title
                this._setTitle(this.config.title || response.itemInfo.item.title);
                // title bar title
                this._setTitleBar();
                // map loaded
                if (this.map.loaded) {
                    this._init();
                } else {
                    on.once(this.map, 'load', lang.hitch(this, function () {
                        this._init();
                    }));
                }
            }), this.reportError);
        },
        // Display the popup details in the sidebar 
        _displayPopupContent: function (feature) {
            if (feature) {
                var content = feature.getContent();
                registry.byId("DetailsPanel").set("content", content);
            }

            // Update the records button state
            this._updateRecordButtonState();

            // Open the side bar if not open
            var currentlyOpen = domClass.contains(document.body, this._drawer.css.drawerOpen);
            if (!currentlyOpen) {
                this._drawer.toggle();
            }

            // Force the details view to be selected 
            this._drawerMenu.select(0);
        },
        // Check if current ID features fall within the current extent
        _checkFeatureExtents: function (extent) {
            var inExtent = true;

            // Get the map and current selection features
            var feature = this.map.infoWindow.getSelectedFeature();
            if (feature) {
                if (extent == null) {
                    // Get the map extent 
                    extent = this.map.extent;
                }

                if (feature.geometry.type == "point") {
                    inExtent = extent.contains(feature.geometry);
                } else {
                    inExtent = extent.contains(feature.geometry.getExtent());
                }
            }
            // Update the tooltip
            this._toggleInExtentTooltip(!inExtent);
        },
        _toggleInExtentTooltip: function (showTooltip) {
            var node = dom.byId("zoomToRecord")
            Tooltip.hide(node);
            if (showTooltip) {
                Tooltip.show("This feature extends beyond the visible extent of the map", node);
                on.once(node, mouse.leave, function () {
                    Tooltip.hide(node);
                });
            }
        },
        // Zoom to show the extent of the given features
        _zoomToFeatures: function (features) {
            var ext;
            if (features.length == 1) {
                var shape = features[0].geometry;

                if (shape.type == "point") {
                    var offset = 100;
                    ext = new Extent(shape.x - offset, shape.y - offset, shape.x + offset, shape.y + offset, shape.spatialReference);
                } else {
                    ext = shape.getExtent();
                }

                this.map.setExtent(ext.expand(1.2), true);
            } else if (features.length > 1) {
                ext = graphicsUtils.graphicsExtent(features);
                this.map.setExtent(ext.expand(1.2), true);
            }
            // else do nothing
        },

        // Initiate a query on a layer
        _initiateLayerQuery: function (layerInfo, expressionvalue, spatialvalue) {

            // Construct the query
            this._searchQuery = new Query();
            var outFields = layerInfo.fields.split(",");
            this._searchQuery.outFields = outFields;

            // Set the where clause
            if (expressionvalue) {
                this._searchQuery.where = lang.replace(layerInfo.expression, [expressionvalue]);
            }

            // Set the spatial filter
            if (spatialvalue) {
                this._searchQuery.geometry = spatialvalue;
            }

            // CHeck if a search layer has been created and if it
            if (this._searchLayer && this._searchLayer.url && this._searchLayer.url == layerInfo.url) {
                // Update the deinition expression
                this._searchLayer.setDefinitionExpression(this._searchQuery.where);

                // Execute the new search
                var deferred = this._searchLayer.selectFeatures(this._searchQuery, FeatureLayer.SELECTION_NEW);
                this.map.infoWindow.setFeatures([deferred]);

            } else {
                if (this._searchLayer) {
                    // Remove from the map existing search results layer
                    this.map.removeLayer(this._searchLayer);
                }

                // Create a new search results layer
                this._searchLayer = new FeatureLayer(layerInfo.url, {
                    "id": "Highlighted Features",
                    "mode": FeatureLayer.MODE_ONDEMAND,
                    "infoTemplate": new PopupTemplate(layerInfo.infoTemplate),
                    "outFields": outFields
                });
                this._searchLayer.name = "Search Results";

                if (expressionvalue) {
                    this._searchLayer.setDefinitionExpression(this._searchQuery.where);
                }

                // Attach to select evet to fire zoom to selection
                this._searchLayer.on("selection-complete", lang.hitch(this, function (evt) {
                    // Get the extent of the features
                    var layer = evt.target, ext;
                    var features = layer.getSelectedFeatures();

                    if (!this.useURLExtent) {
                        this._zoomToFeatures(features);
                    } else {
                        this.useURLExtent = false;
                    }
                }));

                // Attach to load event to initiate the search
                this._searchLayer.on("load", lang.hitch(this, function (evt) {
                    var layer = evt.layer;

                    // Set the layer alpha
                    layer.opacity = 0.5;

                    var symbol;

                    // Set the renderer
                    switch (layer.geometryType) {
                        case "esriGeometryPoint":
                            symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 14,
                                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 2),
                                        new Color([255, 255, 255, 0.9]));
                            break;

                        case "esriGeometryPolyline":
                            symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 2);
                            break;

                        case "esriGeometryPolygon":
                            symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 2),
                                        new Color([255, 255, 255, 0.9]));
                            break;
                    }
                    this._searchLayer.setRenderer(new SimpleRenderer(symbol));

                    // Call the query function
                    var deferred = layer.selectFeatures(this._searchQuery, FeatureLayer.SELECTION_NEW);
                    this.map.infoWindow.setFeatures([deferred]);
                }));

                if (this._searchLayer.loaded) {
                    this._searchLayer.emit("load", {
                        "layer": this._searchLayer
                    });
                }
                this.map.addLayer(this._searchLayer);
            }
        }
    });
});