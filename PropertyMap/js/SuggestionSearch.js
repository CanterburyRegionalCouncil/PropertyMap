define([
    "dojo/Evented",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/has",
    "esri/kernel",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/on",
    // load template    
    "dojo/text!application/dijit/templates/SuggestionSearch.html",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/event",
    "dojo/_base/array",
    "dojo/json",
    "dojo/store/JsonRest",
    "dijit/form/ComboBox",
],
function (
    Evented,
    declare,
    lang,
    has, esriNS,
    _WidgetBase, _TemplatedMixin,
    on,
    dijitTemplate,
    domClass, domStyle, domConstruct,
    event,
    array,
    JSON,
    JsonRest,
    ComboBox
) {
    var Widget = declare([_WidgetBase, _TemplatedMixin, Evented], {
        declaredClass: "esri.dijit.SuggestionSearch",
        templateString: dijitTemplate
    })



});