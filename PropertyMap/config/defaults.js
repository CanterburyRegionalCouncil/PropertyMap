define({
    //Default configuration settings for the applciation. This is where you"ll define things like a bing maps key,
    //default web map, default app color theme and more. These values can be overwritten by template configuration settings
    //and url parameters.
    "appid": "",
    "webmap": "7abe00dd99b74b669abb5bd592d7794e",
    "oauthappid": null,
    //Enter the url to the proxy if needed by the applcation. See the "Using the proxy page" help topic for details
    // //developers.arcgis.com/en/javascript/jshelp/ags_proxy.html
    "proxyurl": "proxy.ashx",
    //Example of a template specific property. If your template had several color schemes
    //you could define the default here and setup configuration settings to allow users to choose a different
    //color theme.
    "showESRILogo": false,
    // Show an organisation logo on the map.  When using thsi, set the esri logo to false as they will occupy the same location.  When true, if the orLogoLinkURL is populated, this will add a click event that opens the specified url on the orgLogoLinkURL setting which clicking the logo. 
    "showOrgLogo": true,
    "showAttribution": false,
    "title": "",
    "summary": "",
    "defaultPanel": "details",
    "enableSummaryInfo": true,
    "enableLegendPanel": true,
    "enableAboutPanel": true,
    "enableLayersPanel": false,
    "enableTOCTreePanel": true,
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
    "enableESRIGeocoder": false,
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
    //Link to information page for web map. If blank uses sharing host locations
    "moreinfopath": "../../Map/?webmap=",
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
    "orgLogoLinkUrl": "http://canterburymaps.govt.nz",
    "helpLinkUrl": "../../PropertyMap/Help",
    "helperServices": {
        "geometry": {
            "url": "http://gis.ecan.govt.nz/arcgis/rest/services/Utilities/Geometry/GeometryServer"
        },
        "printTask": {
            "url": "http://gis.ecan.govt.nz/arcgis/rest/services/Printing/MapPrinting/GPServer/Export%20Web%20Map",
            "isAsync": true,
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
            "url": "http://canterburymaps.govt.nz/ViewerWebServices/Search.ashx",
            "filter": "PAR,VAL,RDI,OSM,NAM"
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
        "RDI": {
            "url": "http://gis.ecan.govt.nz/arcgis/rest/services/Public/Region_Base/MapServer/5",
            "expression": "OBJECTID  = {0}",
            "fields": "*",
            "titlefield": {
                "field": "name",
                "label": "Road : "
            },
            "infoTemplate": {
                "fieldInfos": [
                  {
                      "fieldName": "SHAPE",
                      "label": "SHAPE",
                      "isEditable": false,
                      "visible": false
                  },
                  {
                      "fieldName": "name",
                      "label": "Road or Street Name",
                      "isEditable": false,
                      "visible": false,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "territorial_authority",
                      "label": "Territorial Authority",
                      "isEditable": false,
                      "visible": true,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "other_names",
                      "label": "Other Names",
                      "isEditable": false,
                      "visible": false,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "OBJECTID",
                      "label": "OBJECTID",
                      "isEditable": false,
                      "visible": false,
                      "format": {
                          "places": 0,
                          "digitSeparator": true
                      }
                  }
                ],
                "mediaInfos": [

                ],
                "showAttachments": true,
                "title": "Road or Street Name: {name}",
                "description": null
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
                "fieldInfos": [
                  {
                      "fieldName": "SHAPE",
                      "label": "SHAPE",
                      "isEditable": false,
                      "visible": false
                  },
                  {
                      "fieldName": "Appellation",
                      "label": "Appellation",
                      "isEditable": false,
                      "visible": true,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "Titles",
                      "label": "Titles",
                      "isEditable": false,
                      "visible": false,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "Land_District",
                      "label": "Land_District",
                      "isEditable": false,
                      "visible": false,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "Valuation_No",
                      "label": "Valuation Number",
                      "isEditable": false,
                      "visible": true,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "TA_Property_ID",
                      "label": "TA_Property_ID",
                      "isEditable": false,
                      "visible": false,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "Roll_No",
                      "label": "Roll_No",
                      "isEditable": false,
                      "visible": false,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "Assessment",
                      "label": "Assessment",
                      "isEditable": false,
                      "visible": false,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "Suffix",
                      "label": "Suffix",
                      "isEditable": false,
                      "visible": false,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "Valuation_Legal_Descriptions",
                      "label": "Valuation Legal Descriptions",
                      "isEditable": false,
                      "visible": false,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "TA_Code",
                      "label": "TA_Code",
                      "isEditable": false,
                      "visible": false,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "Territorial_Authority",
                      "label": "Territorial Authority",
                      "isEditable": false,
                      "visible": true,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "Affected_Surveys",
                      "label": "Affected_Surveys",
                      "isEditable": false,
                      "visible": false,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "Parcel_Intent",
                      "label": "Parcel_Intent",
                      "isEditable": false,
                      "visible": false,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "Topology_Type",
                      "label": "Topology_Type",
                      "isEditable": false,
                      "visible": false,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "Statutory_Actions",
                      "label": "Statutory_Actions",
                      "isEditable": false,
                      "visible": false,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "Survey_Area",
                      "label": "Survey_Area",
                      "isEditable": false,
                      "visible": false,
                      "format": {
                          "places": 2,
                          "digitSeparator": true
                      }
                  },
                  {
                      "fieldName": "Calc_Area",
                      "label": "Calc_Area",
                      "isEditable": false,
                      "visible": false,
                      "format": {
                          "places": 2,
                          "digitSeparator": true
                      }
                  },
                  {
                      "fieldName": "Link",
                      "label": "Link",
                      "isEditable": false,
                      "visible": true,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "PAR_ID",
                      "label": "PAR_ID",
                      "isEditable": false,
                      "visible": false,
                      "format": {
                          "places": 0,
                          "digitSeparator": true
                      }
                  },
                  {
                      "fieldName": "OBJECTID",
                      "label": "OBJECTID",
                      "isEditable": false,
                      "visible": false,
                      "format": {
                          "places": 0,
                          "digitSeparator": true
                      }
                  }
                ],
                "mediaInfos": [

                ],
                "showAttachments": true,
                "title": "Land Parcel Title: {Titles}",
                "description": null
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
                "fieldInfos": [
                  {
                      "fieldName": "SHAPE",
                      "label": "SHAPE",
                      "isEditable": false,
                      "visible": false
                  },
                  {
                      "fieldName": "Appellation",
                      "label": "Appellation",
                      "isEditable": false,
                      "visible": true,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "Titles",
                      "label": "Titles",
                      "isEditable": false,
                      "visible": false,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "Land_District",
                      "label": "Land_District",
                      "isEditable": false,
                      "visible": false,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "Valuation_No",
                      "label": "Valuation Number",
                      "isEditable": false,
                      "visible": true,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "TA_Property_ID",
                      "label": "TA_Property_ID",
                      "isEditable": false,
                      "visible": false,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "Roll_No",
                      "label": "Roll_No",
                      "isEditable": false,
                      "visible": false,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "Assessment",
                      "label": "Assessment",
                      "isEditable": false,
                      "visible": false,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "Suffix",
                      "label": "Suffix",
                      "isEditable": false,
                      "visible": false,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "Valuation_Legal_Descriptions",
                      "label": "Valuation Legal Descriptions",
                      "isEditable": false,
                      "visible": false,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "TA_Code",
                      "label": "TA_Code",
                      "isEditable": false,
                      "visible": false,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "Territorial_Authority",
                      "label": "Territorial Authority",
                      "isEditable": false,
                      "visible": true,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "Affected_Surveys",
                      "label": "Affected_Surveys",
                      "isEditable": false,
                      "visible": false,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "Parcel_Intent",
                      "label": "Parcel_Intent",
                      "isEditable": false,
                      "visible": false,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "Topology_Type",
                      "label": "Topology_Type",
                      "isEditable": false,
                      "visible": false,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "Statutory_Actions",
                      "label": "Statutory_Actions",
                      "isEditable": false,
                      "visible": false,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "Survey_Area",
                      "label": "Survey_Area",
                      "isEditable": false,
                      "visible": false,
                      "format": {
                          "places": 2,
                          "digitSeparator": true
                      }
                  },
                  {
                      "fieldName": "Calc_Area",
                      "label": "Calc_Area",
                      "isEditable": false,
                      "visible": false,
                      "format": {
                          "places": 2,
                          "digitSeparator": true
                      }
                  },
                  {
                      "fieldName": "Link",
                      "label": "Link",
                      "isEditable": false,
                      "visible": true,
                      "stringFieldOption": "textbox"
                  },
                  {
                      "fieldName": "PAR_ID",
                      "label": "PAR_ID",
                      "isEditable": false,
                      "visible": false,
                      "format": {
                          "places": 0,
                          "digitSeparator": true
                      }
                  },
                  {
                      "fieldName": "OBJECTID",
                      "label": "OBJECTID",
                      "isEditable": false,
                      "visible": false,
                      "format": {
                          "places": 0,
                          "digitSeparator": true
                      }
                  }
                ],
                "mediaInfos": [

                ],
                "showAttachments": true,
                "title": "Land Parcel Title: {Titles}",
                "description": null
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