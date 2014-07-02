define({
    //Default configuration settings for the applciation. This is where you"ll define things like a bing maps key,
    //default web map, default app color theme and more. These values can be overwritten by template configuration settings
    //and url parameters.
    "appid": "",
    "webmap": "3f4eca18d2424bc897e2058293f05deb",
    "oauthappid": null,
    //Enter the url to the proxy if needed by the applcation. See the "Using the proxy page" help topic for details
    // //developers.arcgis.com/en/javascript/jshelp/ags_proxy.html
    "proxyurl": "proxy.ashx",
    //Example of a template specific property. If your template had several color schemes
    //you could define the default here and setup configuration settings to allow users to choose a different
    //color theme.
    "title": "",
    "summary": "",
    "defaultPanel": "details",
    "enableSummaryInfo": true,
    "enableLegendPanel": true,
    "enableAboutPanel": true,
    "enableLayersPanel": true,
    "enableDetailsPanel": true,
    "enableHomeButton": true,
    "enableLocateButton": true,
    "enableBasemapToggle": false,
    "enableBasemapGallery": true,
    "enableShareDialog": true,
    "enablePrintDialog": true,
    "enableBookmarks": true,
    "enableOverviewMap": true,
    "openOverviewMap": false,
    "enableModifiedDate": true,
    "enableMoreInfo": true,
    "enableParameterSearch": true,
    "enableESRIGeocoder": true,
    "enableSuggestionSearch": true,

    "defaultBasemap": "topo",
    "nextBasemap": "hybrid",
    "notesLayer": null, //{
    //    "id": "mapNotes_7330"
    //},
    "swipeLayer": null, //{
    //    "id": "Weather_Warnings_Watches_Advisories_Statements_2563"
    //},
    "swipeType": "vertical",
    "swipeInvertPlacement": true,
    "hideNotesLayerPopups": true,
    "enableInstagram": false,
    "instagramVisible": false,
    "enableFlickr": false,
    "flickrVisible": false,
    "flickrSearch": "",
    "enableTwitter": false,
    "twitterVisible": false,
    "twitterSearch": "",
    "enableWebcams": false,
    "webcamsVisible": false,
    "bitlyLogin": "esri",
    "bitlyKey": "R_65fd9891cd882e2a96b99d4bda1be00e",
    "twitterUrl": location.protocol + "//tmappsevents.esri.com/website/twitter-oauth-proxy-php/index.php",
    "twitterSigninUrl": location.protocol + "//tmappsevents.esri.com/website/twitter-oauth-proxy-php/sign_in.php",
    "flickr_key": "404ebea7d5bc27aa5251d1207620e99b",
    "webcams_key": "65939add1ebe8bc9cc4180763f5df2ca",
    "instagram_key": "288c36a1a42c49de9a2480a05d054619",
    /*
    "bannedUsersService": location.protocol + "//services.arcgis.com/QJfoC7c7Z2icolha/ArcGIS/rest/services/fai/FeatureServer/2",
    "bannedWordsService": location.protocol + "//tmservices1.esri.com/ArcGIS/rest/services/SharedTools/Filter/MapServer/1",
    "flagMailServer": location.protocol + "//tmappsevents.esri.com/Website/pim_fai/fai.php",
    */
    //Enter the url to your organizations bing maps key if you want to use bing basemaps
    "bingmapskey": "",
    //Defaults to arcgis.com. Set this value to your portal or organization host name.
    "sharinghost": location.protocol + "//" + "www.arcgis.com",
    //When true the template will query arcgis.com for default settings for helper services, units etc. If you 
    //want to use custom settings for units or any of the helper services set queryForOrg to false then enter
    //default values for any items you need using the helper services and units properties. 
    "queryForOrg": false,
    // This template is localized. Keep true.
    "localize": true,
    // custom URL parameters for this template
    "urlItems": [
        "extent",
        "SEARCH"
    ],
    "units": null,
    "helperServices": {
        "geometry": {
            "url": "http://gis.ecan.govt.nz/arcgis/rest/services/Utilities/Geometry/GeometryServer"
        },
        "printTask": {
            "url": "http://gis.ecan.govt.nz/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
            "defaultAuthor": "Canterbury Maps",
            "defaultCopyright": "Copyright",
            "defaultTitle": "Canterbury Maps",
            "defaultFormat": "PDF",
            "defaultLayout": "A4 Landscape"
        },
        "elevationSync": {
            "url": null
        },
        "geocode": [{
            "url": null
        }],
        "suggestion": {
            "url": "http://canterburymaps.govt.nz/ViewerWebServices/Search.ashx"
        }
    },
    "searchSettings": {
        "ADD": {
            "url": "http://gis.ecan.govt.nz/arcgis/rest/services/Public/Region_Base_Labels/MapServer/3",
            "expression": "address LIKE '{0}%'",
            "fields": "*",
            "titlefield": {
                "field": "addtress",
                "label": "Address: "
            },
            "infoTemplate": {
                "description": null,
                "fieldInfos": [
                    {
                        "fieldName": "address",
                        "isEditable": false,
                        "label": "Address",
                        "stringFieldOption": "textbox",
                        "tooltip": "",
                        "visible": false
                    },
                    {
                        "fieldName": "locality",
                        "isEditable": false,
                        "label": "Locality",
                        "stringFieldOption": "textbox",
                        "tooltip": "",
                        "visible": true
                    },
                    {
                        "fieldName": "territorial_authority",
                        "isEditable": false,
                        "label": "Territorial Authority",
                        "stringFieldOption": "textbox",
                        "tooltip": "",
                        "visible": true
                    },
                    {
                        "fieldName": "PAR_ID",
                        "isEditable": false,
                        "label": "PAR ID",
                        "stringFieldOption": "textbox",
                        "tooltip": "",
                        "visible": true
                    }
                ],
                "mediaInfos": [

                ],
                "showAttachments": true,
                "title": "Street Address: {address}"
            }
        },
        "VAL": {
            "url": "http://gis.ecan.govt.nz/arcgis/rest/services/Public/Region_Base/MapServer/6",
            "expression": "Valuation_No = '{0}'",
            "fields": "*",
            "titlefield": {
                "field": "Appellation",
                "label": "Legal Description: "
            },
            "infoTemplate": {
                "description": null,
                "fieldInfos": [
                    {
                        "fieldName": "Appellation",
                        "isEditable": false,
                        "label": "Appellation",
                        "stringFieldOption": "textbox",
                        "tooltip": "",
                        "visible": false
                    },
                    {
                        "fieldName": "Valuation_No",
                        "isEditable": false,
                        "label": "Valuation No",
                        "stringFieldOption": "textbox",
                        "tooltip": "",
                        "visible": true
                    },
                    {
                        "fieldName": "Titles",
                        "isEditable": false,
                        "label": "Titles",
                        "stringFieldOption": "textbox",
                        "tooltip": "",
                        "visible": true
                    },
                    {
                        "fieldName": "Link",
                        "isEditable": false,
                        "label": "Rating Info",
                        "stringFieldOption": "textbox",
                        "tooltip": "",
                        "visible": true
                    },
                    {
                        "fieldName": "Land_District",
                        "isEditable": false,
                        "label": "Land District",
                        "stringFieldOption": "textbox",
                        "tooltip": "",
                        "visible": true
                    },
                    {
                        "fieldName": "Territorial_Authority",
                        "isEditable": false,
                        "label": "Territorial Authority",
                        "stringFieldOption": "textbox",
                        "tooltip": "",
                        "visible": true
                    },
                    {
                        "fieldName": "Survey_Area",
                        "format": { "places": 0, "digitSeparator": true },
                        "isEditable": false,
                        "label": "Survey Area (sq m)",
                        "stringFieldOption": "textbox",
                        "tooltip": "",
                        "visible": true
                    },
                    {
                        "fieldName": "Affected_Surveys",
                        "isEditable": false,
                        "label": "Affected Surveys",
                        "stringFieldOption": "textbox",
                        "tooltip": "",
                        "visible": true
                    },
                    {
                        "fieldName": "Calc_Area",
                        "format": { "places": 0, "digitSeparator": true },
                        "isEditable": false,
                        "label": "Calculated Area (sq m)",
                        "stringFieldOption": "textbox",
                        "tooltip": "",
                        "visible": true
                    },
                    {
                        "fieldName": "Parcel_Intent",
                        "isEditable": false,
                        "label": "Parcel Intent",
                        "stringFieldOption": "textbox",
                        "tooltip": "",
                        "visible": true
                    },
                    {
                        "fieldName": "Topology_Type",
                        "isEditable": false,
                        "label": "Topology Type",
                        "stringFieldOption": "textbox",
                        "tooltip": "",
                        "visible": true
                    },
                    {
                        "fieldName": "Statutory_Actions",
                        "isEditable": false,
                        "label": "Statutory Actions",
                        "stringFieldOption": "textbox",
                        "tooltip": "",
                        "visible": true
                    },
                    {
                        "fieldName": "PAR_ID",
                        "isEditable": false,
                        "label": "PAR ID",
                        "stringFieldOption": "textbox",
                        "tooltip": "",
                        "visible": true
                    }
                ],
                "mediaInfos": [

                ],
                "showAttachments": true,
                "title": "Legal Description: {Appellation}"
            }
        },
        "PAR": {
            "url": "http://gis.ecan.govt.nz/arcgis/rest/services/Public/Region_Base/MapServer/6",
            "expression": "PAR_ID = {0}",
            "fields": "*",
            "titlefield": {
                "field": "Appellation",
                "label": "Legal Description: "
            },
            "infoTemplate": {
                "description": null,
                "fieldInfos": [
                    {
                        "fieldName": "Appellation",
                        "isEditable": false,
                        "label": "Appellation",
                        "stringFieldOption": "textbox",
                        "tooltip": "",
                        "visible": false
                    },
                    {
                        "fieldName": "Valuation_No",
                        "isEditable": false,
                        "label": "Valuation No",
                        "stringFieldOption": "textbox",
                        "tooltip": "",
                        "visible": true
                    },
                    {
                        "fieldName": "Titles",
                        "isEditable": false,
                        "label": "Titles",
                        "stringFieldOption": "textbox",
                        "tooltip": "",
                        "visible": true
                    },
                    {
                        "fieldName": "Link",
                        "isEditable": false,
                        "label": "Rating Info",
                        "stringFieldOption": "textbox",
                        "tooltip": "",
                        "visible": true
                    },
                    {
                        "fieldName": "Land_District",
                        "isEditable": false,
                        "label": "Land District",
                        "stringFieldOption": "textbox",
                        "tooltip": "",
                        "visible": true
                    },
                    {
                        "fieldName": "Territorial_Authority",
                        "isEditable": false,
                        "label": "Territorial Authority",
                        "stringFieldOption": "textbox",
                        "tooltip": "",
                        "visible": true
                    },
                    {
                        "fieldName": "Survey_Area",
                        "format": { "places": 0, "digitSeparator": true },
                        "isEditable": false,
                        "label": "Survey Area (sq m)",
                        "stringFieldOption": "textbox",
                        "tooltip": "",
                        "visible": true
                    },
                    {
                        "fieldName": "Affected_Surveys",
                        "isEditable": false,
                        "label": "Affected Surveys",
                        "stringFieldOption": "textbox",
                        "tooltip": "",
                        "visible": true
                    },
                    {
                        "fieldName": "Calc_Area",
                        "format": { "places": 0, "digitSeparator": true },
                        "isEditable": false,
                        "label": "Calculated Area (sq m)",
                        "stringFieldOption": "textbox",
                        "tooltip": "",
                        "visible": true
                    },
                    {
                        "fieldName": "Parcel_Intent",
                        "isEditable": false,
                        "label": "Parcel Intent",
                        "stringFieldOption": "textbox",
                        "tooltip": "",
                        "visible": true
                    },
                    {
                        "fieldName": "Topology_Type",
                        "isEditable": false,
                        "label": "Topology Type",
                        "stringFieldOption": "textbox",
                        "tooltip": "",
                        "visible": true
                    },
                    {
                        "fieldName": "Statutory_Actions",
                        "isEditable": false,
                        "label": "Statutory Actions",
                        "stringFieldOption": "textbox",
                        "tooltip": "",
                        "visible": true
                    },
                    {
                        "fieldName": "PAR_ID",
                        "isEditable": false,
                        "label": "PAR ID",
                        "stringFieldOption": "textbox",
                        "tooltip": "",
                        "visible": true
                    }
                ],
                "mediaInfos": [

                ],
                "showAttachments": true,
                "title": "Legal Description: {Appellation}"
            }
        }
    },
    "baseMapSettings": {
        "2193": [
            {
                "title": "Topo",
                "thumbnail": "http://ecan.maps.arcgis.com/sharing/rest/content/items/b4db0fde3ed446e280b4c195e4a53a1f/info/thumbnail/ago_downloaded.png",
                "layers": [
                    { "url": "http://gis.ecan.govt.nz/ArcGIS/rest/services/Topoimagery/MapServer" }
                ]
            },
            {
                "title": "Street",
                "thumbnail": "http://ecan.maps.arcgis.com/sharing/rest/content/items/303e7ea5f39642728cd78daf8dd19279/info/thumbnail/ago_downloaded.png",
                "layers": [
                    { "url": "http://gis.ecan.govt.nz/ArcGIS/rest/services/SimpleBasemap/MapServer" }
                ]
            },
            {
                "title": "Imagery",
                "thumbnail": "http://ecan.maps.arcgis.com/sharing/rest/content/items/012fb63cb6554686bb596d5ced78782d/info/thumbnail/ago_downloaded.png",
                "layers": [
                    { "url": "http://gis.ecan.govt.nz/ArcGIS/rest/services/Imagery/MapServer" }
                ]
            }
        ]
    }
});