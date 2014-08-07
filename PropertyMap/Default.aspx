﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="PropertyMap.Default" %>

<!DOCTYPE html>

<html>
<head runat="server">
    <title>Property Map</title>
    <meta charset="utf-8" />
    <!--Define the versions of IE that will be used to render the page. See Microsoft documentation for details. Optional.-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- Responsive -->
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <!-- End Responsive -->
    <!-- Mobile -->
    <link rel="apple-touch-icon" href="images/apple-touch-icon.png" />
    <!-- SEO -->
    <meta name="Keywords" content="Property Map,Canterbury Maps" />
    <meta name="Description" content="A fully configurable and responsive web mapping application that highlights areas of interest through data, map notes, and/or social content to a wide audience." />
    <!-- End SEO -->
    <!-- Facebook -->
    <meta property="og:title" content="Property Map" />
    <meta property="og:image" content="images/item.png" />
    <meta property="og:site_name" content="esri" />
    <!-- End Facebook -->
    <!-- Fav Icon -->
    <link href="~/favicon.ico" rel="shortcut icon" type="image/x-icon" />
    <!--Use protocol relative urls that way if the browser is viewing the page via HTTPS the js/css file will be requested using the HTTPS protocol-->
    <link rel="stylesheet" type="text/css" href="//js.arcgis.com/3.10/js/esri/css/esri.css" />
    <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Lato:300,400,700" />
    <!--Load any application specific styles-->
    <link rel="stylesheet" type="text/css" href="css/dijit.css" />
    <link rel="stylesheet" type="text/css" href="css/fontello.css" />
    <link rel="stylesheet" type="text/css" href="css/TableOfContents.css" />
    <link rel="stylesheet" type="text/css" href="css/TOCTree.css" />
    <link rel="stylesheet" type="text/css" href="css/HomeButton.css" />
    <link rel="stylesheet" type="text/css" href="css/LocateButton.css" />
    <link rel="stylesheet" type="text/css" href="css/SimpleSlider.css" />
    <link rel="stylesheet" type="text/css" href="css/popup.css" />
    <link rel="stylesheet" type="text/css" href="css/dialogs.css" />
    <link rel="stylesheet" type="text/css" href="css/geocoder.css" />
    <link rel="stylesheet" type="text/css" href="css/ShareDialog.css" />
    <link rel="stylesheet" type="text/css" href="css/PrintDialog.css" />
    <link rel="stylesheet" type="text/css" href="css/BasemapDialog.css" />
    <link rel="stylesheet" type="text/css" href="css/FlickrLayer.css" />
    <link rel="stylesheet" type="text/css" href="css/TwitterLayer.css" />
    <link rel="stylesheet" type="text/css" href="css/WebcamsLayer.css" />
    <link rel="stylesheet" type="text/css" href="css/InstagramLayer.css" />
    <link rel="stylesheet" type="text/css" href="css/main.css" />
    <!--[if IE 7]><link rel="stylesheet" type="text/css" href="css/fontello-ie7.css" /><![endif]-->
</head>
<body class="calcite app-loading">
    <form id="form1" runat="server">
          </form>
        <!--The ArcGIS API for JavaScript provides bidirectional support.  When viewing the application in an right to left (rtl) language like Hebrew and Arabic the map needs to remain in left-to-right (ltr) mode. Specify this by setting the dir attribute on the div to ltr. -->
        <div class="loading-indicator">
            <div class="loading-error">
                <div class="icon-emo-unhappy"></div>
                <div class="error-message-text" id="error_message"></div>
            </div>
        </div>
        <div id="bc_outer" class="border-container-outer">
            <div id="cp_outer_left" class="content-pane-left">
                <div id="drawer_menus"></div>
            </div>
            <div id="cp_outer_center" class="content-pane-center">
                <div id="geoData"></div>
                <div class="top-bar">
                    <div id="hamburger_button" class="hamburger-button toggle-grey">
                        <div class="icon-menu-1"></div>
                    </div>
                    <div id="title" class="app-title"></div>
                    <div class="top-menu-right">
                        <div id="HelpLink"></div>
                        <div id="ShareDialog"></div>
                        <div id="PrintDialog"></div>
                        <div id="BasemapDialog"></div>
                        <div class="locate-box">
                            <div id="geocoderSearch"></div>
                        </div>
                        <div id="mobileGeocoderIcon" class="mobile-geocoder-icon icon-right">
                            <div id="mobileGeocoderIconContainer" class="button-container toggle-grey icon-search-1"></div>
                        </div>
                        <div class="clear"></div>
                    </div>
                    <div class="clear"></div>
                </div>
                <div id="mobileSearch" class="mobile-locate-box-hidden">
                    <div class="mobile-search-container">
                        <div id="geocoderMobile"></div>
                        <div id="btnCloseGeocoder" class="close-geocoder-button">Cancel</div>
                        <div class="clear"></div>
                    </div>
                </div>
                <div id="mapButtons" class="map-buttons">
                    <div id="LocateButton"></div>
                    <div id="HomeButton"></div>
                </div>
                <div id="BasemapToggle"></div>
                <div id="mapDiv" dir="ltr">
                    <div id="swipeDiv"></div>
                    <div id="LogoDiv"></div>
                </div>
            </div>
        </div>

  

    <script type="text/javascript">
        var package_path = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
        var dojoConfig = {
            //The location.pathname.replace() logic below may look confusing but all its doing is
            // enabling us to load the api from a CDN and load local modules from the correct location.
            packages: [{
                name: "application",
                location: package_path + '/js'
            }, {
                name: "config",
                location: package_path + '/config'
            }, {
                name: "arcgis_templates",
                location: package_path + '/..'
            }]
        };
    </script>
    <script type="text/javascript" src="//js.arcgis.com/3.10/init.js"></script>
    <script type="text/javascript">
        require([
            "application/template",
            "application/main"
        ], function (
            Template,
            Main
        ) {
            // create the template. This will take care of all the logic required for template applications 
            var myTemplate = new Template();
            // create my main application. Start placing your logic in the main.js file.
            var myApp = new Main();
            // start template
            myTemplate.startup().then(function (config) {
                // The config object contains the following properties: helper services, (optionally) 
                // i18n, appid, webmap and any custom values defined by the application. 
                // In this example we have one called theme. 
                myApp.startup(config);
            }, function (error) {
                // something went wrong. Let's report it.
                myApp.reportError(error);
            });
        });
    </script>
    <script type="text/javascript">
        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-215788-4']);
        //_gaq.push(['_setDomainName', 'esri.com']);
        _gaq.push(['_trackPageview']);
        _gaq.push(['_trackPageLoadTime']);
        (function () {
            var ga = document.createElement('script');
            ga.type = 'text/javascript';
            ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(ga, s);
        })();
    </script>
    <!--[if lt IE 9]><script type="text/javascript" src="js/respond.min.js"></script><![endif]-->

</body>
</html>
