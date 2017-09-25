// v2.3
(function( $ ){

	$.fn.rssInclude = function(options) {
	
		var fillDiv = this;
	
		var outputText = "";
		
		var outputTextBottom = "";
		
		jQuery.ajax({
			type: "GET",
			url: options.baseParams.rssURL,
			dataType: options.baseParams["contentType"], 
			error: function(request, type, errorThrown) {
				console.log("An error occurred: " + errorThrown);
				return;
				
			}, 
			success: function(xml){
				
				var i = 0;
			
				jQuery(xml).find("item").each(function(){
					
					if (options.baseParams.limit !=0 && options.baseParams.limit == i) return;
					
					outputText += "<" + options.baseParams["itemTag"] + " class='rss-item'>";
					
					outputText += "<span class='rss-item-title'>";
					
					var tempText = jQuery(this).children("title").text();
			
					outputText += "<a href='" + jQuery(this).find("link").text() + "'>" + tempText + "</a>";
					

					outputText += "</span>";
					
					for (var key in options.elements)
					{
						if (null != options.elements[key])
						{
							tempText = jQuery(this).find(key).text();
							
							
							
							outputText += "<span class='rss-item-" + key + "'>" + tempText + "</span>";
						}
					}
					
					outputText += "</" + options.baseParams["itemTag"] + ">";
					
					i++;			
					
				});
			
				outputText += outputTextBottom;
				
				fillDiv.html(outputText);
				
				fillDiv.animate(options.animation, options.animationParams);
			}
		});
		return;

	};
})( jQuery );