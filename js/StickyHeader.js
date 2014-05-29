(function () {
    WinJS.Namespace.define("StickyHeader", (function () {
        var _scrollingContainer, _topHeaderMarginLeft, titles;

        var onscroll = function () {
            var scroll = parseInt(_scrollingContainer.scrollLeft);
            var offset = 0;

            for (var i = 0; i < titles.length; i++) {
                var containerMarginLeft = parseInt(titles[i].parentElement.currentStyle.marginLeft),
                    containerWidth = titles[i].parentElement.clientWidth,
                    titleWidth = titles[i].clientWidth,
                    initalHeaderOffsetMarginLeft = parseInt(titles[0].parentElement.currentStyle.marginLeft) - _topHeaderMarginLeft;

                if (i == 0)
                    offset = -_topHeaderMarginLeft;
                if (i == 1)
                    offset = titles[i - 1].parentElement.clientWidth + initalHeaderOffsetMarginLeft;
                if (i > 1)
                    offset += titles[i - 1].parentElement.clientWidth;

                offset += containerMarginLeft;

                if (scroll > offset) {
                    titles[i].style.position = "absolute";
                    titles[i].style.marginLeft = "-" + (offset) + "px";
                } else {
                    titles[i].style.position = "relative";
                    titles[i].style.marginLeft = "0px";
                }

                // Opacity change will start when the text container goes beyond its column.
                var opacityStartPosition = offset + (containerWidth - titleWidth);
                if (scroll > opacityStartPosition)
                    // This will go from 1 to 0 over the length of the text container.
                    titles[i].style.opacity = (titleWidth - (scroll - opacityStartPosition)) / titleWidth;
                else
                    titles[i].style.opacity = 1;
            }
        };

        return {
            initialize: function (scrollingContainer, columnTitles, topHeaderMarginLeft) {
                titles = columnTitles;
                _scrollingContainer = scrollingContainer;
                _topHeaderMarginLeft = parseInt(topHeaderMarginLeft);

                _scrollingContainer.addEventListener("scroll", onscroll, false);
            }
        };
    })());
})();