(function () {
    "use strict";

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var ds;
    var hostElement;

    WinJS.UI.Pages.define("/pages/Page/Page.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            hostElement = document.querySelector(".homepage");
            var pageTiles = new CustomControls.PageTiles(hostElement, { dataSource: options.dataSource });
            ds = options.dataSource;

            // if subpage add back button
            if (WinJS.Navigation.canGoBack === true && options.dataSource !== "home.json") {
                // var backBtn = document.querySelector(".win-backbtn");

                $(".win-backbutton").removeAttr('disabled')
                    .off('click')
                    .on('click', function (event) {
                        Kiosk.ALNavigation.back();
                    });
                //                }
/*

                var backBtn = document.querySelector(".win-backbutton");

                if (backBtn !== undefined) {
                    backBtn.removeAttribute("disabled");
                    backBtn.addEventListener("click", function (event) {
                        WinJS.Navigation.back();
                    }, false);
                }
                */
            }
        },
        initializeLayout: function (listView) {
        },
        updateLayout: function (element, viewState, lastViewState) {
            hostElement = document.querySelector(".homepage");

            var foo = viewState;
            var bar = appViewState;

            if ((viewState === appViewState.snapped) && (viewState !== lastViewState)) {

                WinJS.Navigation.navigate("/pages/PageSnapped/PageSnapped.html", { dataSource: ds });

                var pageRows = new CustomControls.PageRows(hostElement, { dataSource: ds });
                var handler = function (e) {
                    hostElement.removeEventListener("contentanimating", handler, false);
                    e.preventDefault();
                }
                hostElement.addEventListener("contentanimating", handler, false);
                //                this.ready(hostElement, viewState);
//                pageRows.ready(hostElement, viewState);
                
               /* $('body').attr('class', 'snapped');
                $('*[style*=":"]').each(function (idx, el) {
                    $(el).data(
                        'csscache',
                        $(el).attr('style')
                    ).attr('style', '').addClass('css-cached');
                });
                $('.container > .column').attr('style', '');*/
            }
            else if ((viewState === appViewState.fullScreenLandscape) && (lastViewState !== viewState)) {
                    /*
                    $('.css-cached').each(function (idx, el) {
                         $(el).attr('style', $(el).data('csscache'));
                         $(el).data('csscache', '').removeClass('css-cached');
                     });
                     */
                    //                new CustomControls.PageTiles(hostElement, { dataSource: ds });
                var handler = function (e) {
                    hostElement.removeEventListener("contentanimating", handler, false);
                    e.preventDefault();
                }
                hostElement.addEventListener("contentanimating", handler, false);
                //               this.ready(hostElement, viewState);

            }
        }
    });
})();