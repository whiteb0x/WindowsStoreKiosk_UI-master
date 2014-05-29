(function() {"use strict";

	WinJS.Namespace.define("Kiosk.ALNavigation", {
		navCache : [{
			dataSource : 'home.json'
		}],
		navigate : function(page, options) {
			var pSource = options.dataSource;
			if (pSource != Kiosk.ALNavigation.navCache[Kiosk.ALNavigation.navCache.length - 1]) {
				Kiosk.ALNavigation.navCache.push(options);
			}
			return WinJS.Navigation.navigate(page, options);
		},
		getCurretPage : function() {
			if ($('.main.snapped').length > 0) {
				return '/pages/PageSnapped/PageSnapped.html';
				//                return Windows.UI.ViewManagement.ApplicationViewState.snapped;
			}
			return '/pages/Page/Page.html';

			return Windows.UI.ViewManagement.ApplicationViewState.fullScreenLandscape;
		},
		back : function() {
			Kiosk.ALNavigation.navCache.pop();
			var pOption = Kiosk.ALNavigation.navCache[Kiosk.ALNavigation.navCache.length - 1];
			if (pOption) {
				return WinJS.Navigation.navigate(Kiosk.ALNavigation.getCurretPage(), pOption);
			}
		}
	});
	$('body').on('click', '.boxedvideoplayer', function() {
		var pVideo = $(this)[0];
		if (pVideo.paused) {
			$('video').not(pVideo).each(function(idx, el) {
				el.pause();
			});

			pVideo.play();
		} else {
			pVideo.pause();
		}
	});
	$('body').on('click', '.actionbutton', function() {
		var pAction = $(this).data('action');
		if (!pAction)
			return;
		switch (pAction.actiontype) {
			case 'videobutton':
				var pPlayer = $(pAction.videotarget);
				if (pPlayer.length > 0) {
					pPlayer.attr('autoplay', 'true').attr('src', 'ms-appx:///content/' + pAction.videofile);
					//                     pPlayer[0].play();
				}
				//                $(pAction.videotarget).attr('src', pAction.videofile)[0].play();
				break;
		}
	});

	var WKTemplater = {};
	WKTemplater.trace = function(msg) {
		if (window['console'] != null) {
			console.log(msg);
		}
	};
	WKTemplater._templateCache = {};
	WKTemplater.fromViewId = function(templateName, object) {
		return MSApp.execUnsafeLocalFunction(function() {
			return $(WKTemplater.templateById(templateName, object))[0];
		});
	}
	WKTemplater.templateById = function(templateName, object) {
		var pHtml = $('#' + templateName).html();
		return WKTemplater.template(pHtml, object);
	}
	WKTemplater.apply = function(templateName, object) {
		/*
		 var retVal;
		 var url = new Windows.Foundation.Uri("ms-appx:///content/views/" + templateName + '.html');
		 var foo = Windows.Storage.StorageFile.getFileFromApplicationUriAsync(url)
		 .then(function (file) {
		 return Windows.Storage.FileIO.readTextAsync(file);
		 })
		 .then(function (text) {
		 return MSApp.execUnsafeLocalFunction(function () {
		 var ret = document.createElement('div');
		 ret.innerHTML = WKTemplater.template(text, object);
		 retVal = ret;
		 return ret;
		 });
		 });
		 return foo;
		 //        console.log(foo);

		 return new WinJS.Promise(function (comp, err, prog) {
		 var url = new Windows.Foundation.Uri("ms-appx:///content/views/" + templateName + '.html');
		 Windows.Storage.StorageFile.getFileFromApplicationUriAsync(url).done(function (file) {
		 Windows.Storage.FileIO.readTextAsync(file).done(function (text) {
		 return MSApp.execUnsafeLocalFunction(function () {
		 var ret = document.createElement('div');
		 ret.innerHTML = WKTemplater.template(text, object);
		 retVal = ret;
		 return ret;
		 });
		 });
		 })
		 });
		 */
	};
	WKTemplater.template = function(str, data) {
		var err = "";
		try {
			var fn = WKTemplater._templateCache[str];
			if (!fn) {
				var strFunc = "var p=[],print=function(){p.push.apply(p,arguments);};" + "with(obj){p.push('" + str.replace(/[\n]/g, "").replace(/[\r\t\n]/g, " ").replace(/'(?=[^@]*@>)/g, "\t").split("'").join("\\'").split("\t").join("'").replace(/<@=(.+?)@>/g, "',$1,'").split("<@").join("');").split("@>").join("p.push('") + "');};p= p.join(''); return p;";
				fn = new Function("obj", strFunc);
				WKTemplater._templateCache[str] = fn;
			}
			return fn(data);
		} catch (e) {
			WKTemplater.trace({
				err : e,
				str : str,
				dat : data,
				fn : strFunc
			});
		}
		return '';
		return err;
	};

	WinJS.Namespace.define("Kiosk.Utility", {
		// returns the object specified in the file filename
		JSONFileLoader : function(/*string*/filename) {
			// console.log("JSONFileLoader");
			var url = new Windows.Foundation.Uri("ms-appx:///" + filename);
			Windows.Storage.StorageFile.getFileFromApplicationUriAsync(url).then(function(file) {
				Windows.Storage.FileIO.readTextAsync(file).then(function(text) {
					// success!
					return JSON.parse(text);
				}, function(error) {
					console.log("Error: " + error);
				}, function(progress) {
					// empty for now
				});
			});
		}
	});

	WinJS.Namespace.define("Kiosk.Layouts", {
		ByTemplate : function(item, override) {
			var pViewName = (override != null) ? override : item.TileLayout;
			return WKTemplater.fromViewId(pViewName, item);
		}
	});
})(); 