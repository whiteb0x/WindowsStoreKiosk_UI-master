/// <reference path="//Microsoft.WinJS.1.0/js/base.js" />
/// <reference path="//Microsoft.WinJS.1.0/js/ui.js" />
(function () {
    "use strict";

    // Custom timeline control
    var ZoomableView = WinJS.Class.define(function () {
        // Constructor
        // this._timeline = timeline;
    }, {
        // Public methods
        getPanAxis: function () {
            // return this._timeline._getPanAxis();
        },

        configureForZoom: function (isZoomedOut, isCurrentView, triggerZoom, prefetchedPages) {
            // this._timeline._configureForZoom(isZoomedOut, isCurrentView, triggerZoom, prefetchedPages);
        },

        setCurrentItem: function (x, y) {
            // this._timeline._setCurrentItem(x, y);
        },

        getCurrentItem: function () {
            // return this._timeline._getCurrentItem();
        },

        beginZoom: function () {
            // this._timeline._beginZoom();
        },

        positionItem: function (/*@override*/item, position) {
            // return this._timeline._positionItem(item, position);
        },

        endZoom: function (isCurrentView) {
            // this._timeline._endZoom(isCurrentView);
        },

        handlePointer: function (pointerId) {
            // this._timeline._handlePointer(pointerId);
        }
    });

    WinJS.Namespace.define("CustomControls", {
        PageTiles: WinJS.Class.define( 
            function PageTiles(element, options) {
                this._dataSource = "";

                this._element = element;

                // console.log("zoomableView: " + this.zoomableView);

                WinJS.UI.setOptions(this, options);
            },
            // instance vars
            {
                _element: null,
                zoomableView: {
                    get: function () {
                        if (!this._zoomableView)
                            this._zoomableView = new ZoomableView(this);

                        return this._zoomableView;
                    }
                },
                // Set the datasource with the value specified in the options
                // when this gets set, load the content.
                dataSource: {
                    get: function () {
                        return this._dataSource;
                    },
                    set: function (value) {
                        this._dataSource = value;
                        this.loadContent(this._dataSource);
                    }
                },
                loadContent: function (dataSource) {
                    var main = document.querySelector(".main");

                    var content = document.createElement("div");
                    content.className = "content";

                    var columns = document.createElement("div");
                    columns.className = "columns";

                    content.appendChild(columns);
                    main.appendChild(content);
                    this._element.appendChild(main);

                    var topHeaderLeftMargin = 120; // This is the width of -ms-grid-column: 1 in the header area.

                    var PageContentList;

//                    var ContentManifest = Kiosk.Utility.JSONFileLoader("ms-appx:///content/" + dataSource);
                    // var PageContent = Kiosk.Utility.JSONFileLoader("ms-appx:///content/" + dataSource);

                    var url2 = new Windows.Foundation.Uri("ms-appx:///content/" + dataSource);
                    Windows.Storage.StorageFile.getFileFromApplicationUriAsync(url2).then(function (file) {
                        Windows.Storage.FileIO.readTextAsync(file).then(function (text) {
                            var maincontentcolumns = document.querySelector(".main .content .columns");

                            var PageContent = JSON.parse(text);
                            PageContentList = new WinJS.Binding.List(PageContent["Groups"]);

                            var increment = 1;

                            if (PageContent["BackgroundImage"] !== undefined)
                                columns.style.backgroundImage = "url(ms-appx:///content/assets/" + PageContent["BackgroundImage"] + ")";
                            if (PageContent["BackgroundColor"] !== undefined) {
                                columns.style.backgroundColor = PageContent["BackgroundColor"];
                            }
                            // console.dir(columns);

                            // Add the columns to the page
                            PageContentList.forEach(function (item) {
                                if (item.width !== undefined) maincontentcolumns.style.msGridColumns += " " + parseInt(parseInt(item.width) + parseInt(item.leftmargin)) + "px";

                                var thecolumn = document.createElement("div");
                                thecolumn.className = "column col" + increment;
                                if (item.leftmargin !== undefined) thecolumn.style.marginLeft = item.leftmargin + "px";
                                if (item.width !== undefined) thecolumn.style.width = item.width + "px";

                                // set the column title
                                var columnTitle = document.createElement("div");
                                columnTitle.className = "columnTitle";
                                columnTitle.textContent = item.Title;
                                // console.log(item.Title);

                                // add the info region where the content will live
                                var infocolumn = document.createElement("div");
                                infocolumn.className = "info";
                                if (item.width !== undefined) infocolumn.style.msGridColumns = "(1px)[" + item.width + "]";

                                // add the tiles to the info region
                                if (item.ContentItems !== undefined) {
                                    item.ContentItems.forEach(function (contentItem) {
                                        var thisthing;

                                        if (Kiosk.Layouts[contentItem.TileLayout] == null) {
                                            thisthing = Kiosk.Layouts.ByTemplate(contentItem);
                                        }
                                        else {
                                            thisthing = Kiosk.Layouts[contentItem.TileLayout](contentItem);
                                        }

                                        if (contentItem.LinkTo !== undefined) {
                                            thisthing.addEventListener("click", function () {

                                                return Kiosk.ALNavigation.navigate("/pages/Page/Page.html", { dataSource: contentItem.LinkTo });
                                            }, false);
                                        }
                                        infocolumn.appendChild(thisthing);

                                    });
                                    // console.log("maincontentcolumns: " + maincontentcolumns.style.msGridColumns);
                                }

                                thecolumn.appendChild(columnTitle);
                                thecolumn.appendChild(infocolumn);
                                columns.appendChild(thecolumn);

                                increment++;
                            });

                            var columnTitles = document.querySelectorAll(".column .columnTitle");
                            StickyHeader.initialize(content, columnTitles, topHeaderLeftMargin);
                            // console.dir(document.body);
                            console.log(document.querySelector(".columns").innerHTML);
                        });
                    });

                }
            },
            // static vars
            {

            }
        )
    });
})();
