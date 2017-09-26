// v3

!(function( $ ){

	$.fn.includeFeed = function(options) {
		return $(this).each(function(){ // maintains chainability

			// record the element that is to be populated.
			var fillElement = this;

			// combine default settings and user settings into one variable.
			var settings = $.extend(true, {}, $.fn.includeFeed.defaults, options);

			$(fillElement).html("");
			// make sure an array was passed.
			if ( "string" == typeof settings.baseSettings.rssURL )
			{
				settings.baseSettings.rssURL = [settings.baseSettings.rssURL];
			}
			for (var i = 0; i < settings.baseSettings.rssURL.length; ++i)
			{
				$.ajax({
					type: "GET",
					url: settings.baseSettings.rssURL,
					dataType: "xml",
					error: function(request, type, errorThrown) {
						// there was an error, so display it in the box. dont use console.log, problems with ie7/8.
						$(fillElement).html("<div>An error occurred. Please try again later. " + errorThrown + "</div>");
						return;

					},
					success: function(xml){
						// go through each item returned by the ajax call.
						var outputText = "";
						var repeatTag = settings.baseSettings.repeatTag;
						xml = $(xml);
							
						//only if job rss feed	
						if( settings.baseSettings.rssURL[0].indexOf('job/') > -1 ){
							xml.find('refinelist').remove();
						}
						xml.find(repeatTag).each(function(itemIndex){

							var xmlElement = $(this);
						
							// if we have reached the limit defined by the user, stop processing.
							if (itemIndex != 0 && settings.baseSettings.limit <= itemIndex) return;

							// new template
							var itemText = settings.templates.itemTemplate;
							itemText = itemText.replace(/{{item-index}}/g , itemIndex);
							itemText = replaceShortCodes("[[", "]]", itemText, xmlElement, settings.templates, settings.predicates, false);
							itemText = replaceShortCodes("{{", "}}", itemText, xmlElement, settings.templates, settings.predicates, settings.baseSettings.addNBSP);

							// add temp item to output text.
							outputText += itemText;
						});

						$(fillElement).append( outputText);

						// run the complete function that the user determined.
						settings.complete.call(fillElement);

					} // end of success function
				}); // end of ajax call
			}
		}); // end of return
	}; // end of includeFeed function.

	// replacing the shortcodes in a string.
	function replaceShortCodes(startCode, endCode, itemText, xmlElement, templateArray, predicateArray, addNBSP)
	{
		// for each shortcode. does not error handle bad templates, will throw jquery error.
		for ( var startPosition = itemText.indexOf(startCode); startPosition != -1; startPosition = itemText.indexOf(startCode) )
		{
			var endPosition = itemText.indexOf(endCode);
			var propertyName = itemText.substr(startPosition + startCode.length, endPosition - startPosition - endCode.length);
			// if its a template, assign template text as value. otherwise, assign xml text.
			var propertyValue = templateArray[propertyName] || xmlElement.find(propertyName).text();
			// if there is a predicate, process the value
			if (predicateArray[propertyName])
			{
				propertyValue = predicateArray[propertyName](propertyValue);
			}
			// add nbsp if required.
			if ( addNBSP )
			{
				propertyValue = propertyValue.slice(0, propertyValue.lastIndexOf(" ")) + propertyValue.slice(propertyValue.lastIndexOf(" ")).replace(" ", "&nbsp;");
			}
			itemText = itemText.replace(startCode + propertyName + endCode, propertyValue );
		}

		return itemText;
	}

	// Default settings
	$.fn.includeFeed.defaults = {
		baseSettings: {
			rssURL: "/job/rss.aspx",
			limit: 10,
			descriptionLimit: 200,
			addNBSP: true,
			repeatTag: "item"
		},
		templates: {
			itemTemplate: "<li class='rss-item' id='rss-item-{{item-index}}'><span class='rss-item-title'><a target='_blank' href='{{link}}'>{{title}}</a></span><span class='rss-item-pubDate'>[[pubDateTemplate]]</span><span class='rss-item-description'>{{description}}</span></li>",
			pubDateTemplate: "{{pubDate}}"
		},
		predicates: {
			// example predicate use
			pubDate: function(pubDate){
				var monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
				var dateObj = '';
				var myDay, myMonth, myYear, mnth;
				
				//var dateObj = new Date(Date.parse(pubDate));
				/*if ( !isNaN( dateObj.getTime() )){

					mnth = monthList[ dateObj.getUTCMonth() ];
					myDay = "<span class='rss-item-pubDate-date'>" + dateObj.getUTCDate() + "</span> ";
					myMonth = "<span class='rss-item-pubDate-month'>" + mnth + "</span> ";
					myYear = "<span class='rss-item-pubDate-full-year'>" + dateObj.getUTCFullYear() + "</span> ";	
				}*/

				dateObj = pubDate.trim().split('/');
				if( dateObj.length > 2 ){
					mnth = monthList[ parseInt(dateObj[1]) - 1 ];
					myDay = "<span class='rss-item-pubDate-date'>" + dateObj[0] + "</span> ";
					myMonth = "<span class='rss-item-pubDate-month'>" + mnth + "</span> ";
					myYear = "<span class='rss-item-pubDate-full-year'>" + dateObj[2].substr(0,4) + "</span> ";	
				}else{
					return pubDate.trim();
				}
			
				
				return myDay + myMonth + myYear;
			}
		},
		complete: function(){} // simpler than using typeof in the plugin.
	}

})( jQuery );
