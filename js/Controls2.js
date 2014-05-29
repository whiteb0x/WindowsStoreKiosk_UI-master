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
        PageRows: WinJS.Class.define( 
            function PageRows(element, options) {
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

                    var rows = document.createElement("div");
                    rows.className = "rows";

                    content.appendChild(rows);
                    main.appendChild(content);
                    this._element.appendChild(main);

                    var topHeaderLeftMargin = 0; // This is the width of -ms-grid-row: 1 in the header area.

                    var PageContentList;

//                    var ContentManifest = Kiosk.Utility.JSONFileLoader("ms-appx:///content/" + dataSource);
                    // var PageContent = Kiosk.Utility.JSONFileLoader("ms-appx:///content/" + dataSource);

                    var url2 = new Windows.Foundation.Uri("ms-appx:///content/" + dataSource);
                    Windows.Storage.StorageFile.getFileFromApplicationUriAsync(url2).then(function (file) {
                        Windows.Storage.FileIO.readTextAsync(file).then(function (text) {
                            var maincontentrows = document.querySelector(".main .content .rows");

                            var PageContent = JSON.parse(text);
                            PageContentList = new WinJS.Binding.List(PageContent["Groups"]);

                            var increment = 1;

                            if (PageContent["BackgroundImage"] !== undefined)
//                                rows.style.backgroundImage = "url(ms-appx:///content/assets/" + PageContent["BackgroundImage"] + ")";
                            if (PageContent["BackgroundColor"] !== undefined) {
                                  rows.style.backgroundColor = PageContent["BackgroundColor"];
                            }
                            if (PageContent["SnapBgClass"] !== undefined) {
                                $(rows).addClass("SnapBgClass");
                            }

                            // console.dir(rows);

                            // Add the rows to the page
                            PageContentList.forEach(function (item) {
                                delete item.height;
                                delete item.width;
                                if (item.height !== undefined) maincontentrows.style.msGridRows += " " + parseInt(parseInt(item.height) + parseInt(item.leftmargin)) + "px";

 //                                var therow = document.createElement("div");
 //                               therow.className = "row" + increment;
  //                              if (item.leftmargin !== undefined) therow.style.marginLeft = item.leftmargin + "px";
 //                               if (item.height !== undefined) therow.style.height = item.height + "px";

                                // set the row title
                                var rowTitle = document.createElement("div");
                                rowTitle.className = "rowTitle";
                                rowTitle.textContent = item.Title;
                                //console.log(item.ContentItems.Title);

                                // add the info region where the content will live
                                var inforow = document.createElement("div");
                                inforow.className = "info" + increment;

                                // add the tiles to the info region
                                if (item.ContentItems !== undefined) {
                                    item.ContentItems.forEach(function (contentItem) {
                                        var thisthing = null;


                                        var pLayout = contentItem.TileLayout;

                                        if (contentItem.SnapTileLayout != null) {
                                            pLayout = contentItem.SnapTileLayout;
                                        }

                                        if ((thisthing == null) && (Kiosk.Layouts[pLayout] == null)) {
                                            thisthing = Kiosk.Layouts.ByTemplate(contentItem, pLayout);
                                        }
                                        else {
                                            thisthing = Kiosk.Layouts[pLayout](contentItem);
                                        }
                                        if (contentItem.LinkTo !== undefined) {
                                            thisthing.addEventListener("click", function () {
                                                return Kiosk.ALNavigation.navigate("/pages/PageSnapped/PageSnapped.html", { dataSource: contentItem.LinkTo });
                                            }, false);
                                        }
                                        inforow.appendChild(thisthing);
                                    });
                                    // console.log("maincontentrows: " + maincontentrows.style.msGridRows);
                                }

                                if (!item.SnapHide) {
                                    rows.appendChild(rowTitle);
                                    rows.appendChild(inforow);
                                }

//                              therow.appendChild(inforow);

                                increment++;
                            });
                         
                            $('*[style*=":"]',rows).each(function (idx, el) {
                                $(el).data(
                                    'csscache',
                                    $(el).attr('style')
                                ).attr('style', '').addClass('css-cached');
                            });

                            // double check that our elements have heights
                            $('.rows *').each(function (idx, el) {
                                $(el).height($(el + '*')[0].scrollHeight);
                            });
                           
                            var rowTitles = document.querySelectorAll(".row .rowTitle");

                            //StickyHeader.initialize(content, rowTitles, topHeaderLeftMargin);
                            // console.dir(document.body);/
//                            var foo = $('body').html();
//                            console.log($("body").html());
//                            console.log(document.querySelector(".rows").innerHTML);
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
