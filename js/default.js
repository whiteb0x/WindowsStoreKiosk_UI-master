// For an introduction to the Navigation template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232506
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;

    app.addEventListener("activated", function (args) {
        WinJS.Application.onsettings = function (e) {
            e.detail.applicationcommands = { "defaults": { title: "Kiosk Settings", href: "/pages/KioskSettings/KioskSettings.html" } };
            WinJS.UI.SettingsFlyout.populateSettings(e);
        };

        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // Load the settings, if they are set.  Otherwise fill them in elsewise.
                var appSettings = Windows.Storage.ApplicationData.current.roamingSettings.values;
                if (appSettings["name"] === undefined) {
                    var kioskName = "NameNotSet";
                }
                else {
                    var kioskName = appSettings["name"];
                }

                if (appSettings["id"] === undefined) {
                    appSettings["id"] = GUID();
                }

                if (appSettings["Version"] === undefined) {
                    appSettings["Version"] = "1.0.0.0";
                }

                if (appSettings["Revision"] === undefined) {
                    appSettings["Revision"] = "1";
                }

                // Ping the monitoring service to determine if there are content updates
                WinJS.xhr({
                    url:
                        "http://jettest.cloudapp.net/api/CheckVersion?KioskName=" + kioskName
                        + "&KioskId=" + appSettings["id"]
                        + "&SoftwareVersion=" + appSettings["Version"]
                        + "&ContentVersion=" + appSettings["Revision"]
                }).done(
                    function complete(result) {
                        var responseObject = JSON.parse(result.response);

                        switch (responseObject["ContentCheckResult"]) {
                            case 0:
                                // OK
                                break;

                            case 1:
                                // ERROR
                                break;

                            case 2:
                                // UPDATE AVAILABLE
                                break;
                        }
                    },
                    function error(request) {
                        console.log("Network error.  Continuing anyway.");
                    },
                    function progress(request) {

                    });

            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

            if (app.sessionState.history) {
                nav.history = app.sessionState.history;
            }
            args.setPromise(WinJS.UI.processAll().then(function () {
                if (nav.location) {
                    nav.history.current.initialPlaceholder = true;
                    return nav.navigate(nav.location, nav.state);
                } else {
                    return nav.navigate(Application.navigator.home);
                }
            }));
        }
    });

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        app.sessionState.history = nav.history;
    };

    app.start();
})();

// A class for creating standard GUIDs in Javascript
function GUID() {
    var S4 = function () {
        return Math.floor(
            Math.random() * 0x10000
         ).toString(16);

    };

    return (
        S4() + S4() + "-" +
        S4() + "-" +
        S4() + "-" +
        S4() + "-" +
        S4() + S4() + S4()
    );
}