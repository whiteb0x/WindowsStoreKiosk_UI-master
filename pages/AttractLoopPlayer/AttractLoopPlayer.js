// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";
    WinJS.UI.Pages.define("/pages/AttractLoopPlayer/AttractLoopPlayer.html", {
        ready: function (element, options) {
            var wrapper = document.querySelector(".wrapper");

            var video = document.createElement("video");
            video.className = "videoPlayer";

            // a list of video files
            var playlist = [
	            {
	                "AttractLoopFile": "content/assets/attractloops/ArtistNoSlate.wmv"
	            },
	            {
	                "AttractLoopFile": "content/assets/attractloops/BestCoastREV1280X720HD_NoSlate.wmv"
	            },
	            {
	                "AttractLoopFile": "content/assets/attractloops/Bird30_US_R4_SXFT0600000H_1280x720_NoSlate.wmv"
	            },
	            {
	                "AttractLoopFile": "content/assets/attractloops/SigninWithaSmile1280x720_NoSlate.wmv"
	            },
	            {
	                "AttractLoopFile": "content/assets/attractloops/W8Shop_CAT02_0821_720p30_H264_8000k.mp4"
	            },
	            {
	                "AttractLoopFile": "content/assets/attractloops/W8Shop_Sizzle_0821_720p30_H264_8000k.mp4"
	            }
            ];

            video.addEventListener("click", function () {
                return WinJS.Navigation.navigate("/pages/Page/Page.html", { dataSource: "home.json" });
            });

            var whichOne = Math.floor((Math.random() * playlist.length));
            console.log("Random number: " + whichOne);
            console.log("playlist file: " + playlist[whichOne].AttractLoopFile);

            video.addEventListener("ended", function () {
                whichOne = Math.floor((Math.random() * playlist.length));
                console.log("Random number: " + whichOne);

                video.src = "ms-appx:///" + playlist[whichOne].AttractLoopFile;
                video.play();
            });

            video.src = "ms-appx:///" + playlist[whichOne].AttractLoopFile;
            video.play();

            wrapper.appendChild(video);
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        }
    });
})();
