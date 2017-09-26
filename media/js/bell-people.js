$(document).ready(function() {

    //Main slider
    $('#mainSlider').jqFancyTransitions({ width: 1000, height: 300, strips: 20, direction: 'fountain', position: 'top' });

    //scrolling jobs 
    $("#latestJobs").rssInclude({
        baseParams: { contentType: "xml", rssURL: "/job/rss.aspx", itemTag: "li", limit: 5, title: 0 },
        elements: { description: 0 },
        animation: { opacity: 1 },
        animationParams: {
            duration: 300,
            easing: "swing",
            complete: function() {
                $(this).find("span.rss-item-title a").each(function() {
                    $(this).attr("href", $(this).attr("href").split("www.bellpeople.com.au")[1]);
                });
                if ($(this).children().length > 1) {
                    $(this).jcarousel({
                        auto: 5,
                        scroll: 1,
                        wrap: "circular"
                    });
                }
            }
        }
    });

    //News
    $("#latestNews").rssInclude({
        baseParams: { 
            contentType: "xml", 
            rssURL: "/newsrss.aspx", 
            itemTag: "li", 
            limit: 6, 
            title: 0 
        },
        elements: { description: 1 },
        animation: { opacity: 1 },
        animationParams: {
            duration: 300,
            easing: "swing",
            complete: function() {
               
                $(this).children().each(function() {
                    //console.log($(this).children("span.rss-item-description").html());
                    var newContent = "<a class='bellButtons2' href='" + $(this).find("span.rss-item-title a").attr("href").split(".com.au")[1] + "'>Read more</a>";
                    $(this).append(newContent);
                    if( $(this).find('.rss-item-title a').text().length>55 ){
                        $(this).find('.rss-item-title a').text( $(this).find('.rss-item-title a').text().substr(0,55) + '...' );
                    }
                    $(this).find('.rss-item-description').text( $(this).find('.rss-item-description').text().substr(0,110) + "..." );
                });

                if ($(this).children().length > 1) {
                    /*$(this).cycle({ 
                        fx: 'fade', 
                        pause: 1, 
                        random: 1, 
                        speed: 2000 
                    });*/
                    $(this).jcarousel({
                        auto: 5,
                        scroll: 1,
                        wrap: "circular"
                    });
                }
            }
        }
    });

});
