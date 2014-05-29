(function () {
    "use strict";
    var appView = Windows.UI.ViewManagement.ApplicationView;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var ds;
    var hostElement;

    WinJS.UI.Pages.define("/pages/PageSnapped/PageSnapped.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            hostElement = document.querySelector(".homepage");
            var pageTiles = new CustomControls.PageRows(hostElement, { dataSource: options.dataSource });
            ds = options.dataSource;

            var backCon = document.createElement('div');
            $('.main.snapped .rows').prepend($(backCon).append($('.win-backbutton')));
            $(backCon).addClass('backbutton-container');

            // if subpage add back button
            if (WinJS.Navigation.canGoBack === true && options.dataSource !== "home.json") {
                // var backBtn = document.querySelector(".win-backbtn");
                //                var backBtn = document.querySelector(".win-backbutton");

                //                if (backBtn !== undefined) {
                //                    backBtn.removeAttribute("disabled");
                $(".win-backbutton").removeAttr('disabled')
                    .off('click')
                    .on('click', function (event) {
                        Kiosk.ALNavigation.back();
                    });
                    $('.main.snapped').addClass('back-enabled');
                //                    .prependTo('.main.snapped .rows');
                //                }
            } else {
                $('.main.snapped').removeClass('back-enabled');
            }

            this.initializeLayout(element);

        },
        initializeLayout: function (listView, viewState) {

        },
        updateLayout: function (element, viewState, lastViewState) {
            hostElement = document.querySelector(".homepage");

            var foo = viewState;
            var bar = appViewState;

            if ((viewState === appViewState.snapped) && (viewState !== lastViewState)) {

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
               Kiosk.ALNavigation.navigate("/pages/Page/Page.html", { dataSource: ds });

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