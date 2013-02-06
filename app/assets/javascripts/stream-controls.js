$(document).ready(function() {
	
	// Top bar controls and drop downs
	// 
	$('.hs_topBar .hs_controls a').click(function(e) {
		
		var $control = $(this),
			$dropdown = $('.hs_topBar .hs_dropdown');
		
		$dropdown.children().hide();
		
		if ($control.attr('dropdown').length) {
			$dropdown.children('.' + $control.attr('dropdown')).show();
		}
		
		if($dropdown.is(':visible') && $control.hasClass('active')) {
			$dropdown.hide();
		} else {
			$dropdown.show();
			if($control.attr('dropdown') == '_search') {
				$dropdown.find('.' + $control.attr('dropdown') + ' input[type="text"]').first().focus();
			}
			if($control.attr('dropdown') == '_writeMessage') {
				$dropdown.find('.' + $control.attr('dropdown') + ' textarea').first().focus();
			}
		}
		
		$control.siblings('.active').removeClass('active');
		$control.toggleClass('active');
		
		e.preventDefault();
	});
	
	// Message controls dropdown
	// 

	$('.hs_stream').delegate('.hs_message .hs_controls a.hs_expand', 'click', function(e) {
		$(this).parent().find('.hs_moreOptionsMenu').toggle();
		e.preventDefault();
	});
	$('.hs_stream').delegate('.hs_message .hs_controls .hs_moreOptionsMenu', 'mouseleave', function(e) {
		$(this).hide();
	});
	
	// Tooltips
	// 
	$('.hs_topBar .hs_controls a').hs_tipTip({defaultPosition: 'left', zindex: 101, position: 'fixed', where: 'topbar'});
	$('.hs_tooltip, .hs_message .hs_controls a.hs_icon').hs_tipTip();
	
	// Attach to future messages
	$('.hs_stream').bind(
		"DOMNodeInserted",
		function(e) {
			$( e.target ).find('.hs_tooltip, .hs_message .hs_controls a.hs_icon').hs_tipTip();
		}
	);

	$('a.twitter-user-thumb, a.twitter-user-name').click(function(){
		// user info popup
		hsp.showUser( $(this).attr('rel') );
		event.preventDefault();
	});

	// "Search"
	var search = function() {
		var str = $('#search_text').val();
		if(str != '' && str != undefined && str != null) {
			var url = window.location.href;    
			if (url.indexOf('?') > -1){
			   url += '&search_tweets=' + str
			}else{
			   url += '?search_tweets=' + str
			}
			window.location.href = url;
		}
	}
	$('.hs_topBar a.search').click(function(e) {
		search();
	});
	$('#search_text').keypress(function(e) {
	    if(e.keyCode == 13) { // enter button
			search();
	    }
	});
});

/*
 * TipTip
 * Copyright 2010 Drew Wilson
 * www.drewwilson.com
 * code.drewwilson.com/entry/hs_tiptip-jquery-plugin
 *
 * Version 1.3   -   Updated: Mar. 23, 2010
 *
 * This TipTip jQuery plug-in is dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

(function($){
	$.fn.hs_tipTip = function(options) {
		var defaults = {
			defaultPosition: "top",
			position: 'absolute',
			zindex: 50,
			content: false // HTML or String to fill TipTIp with
		};
		var fixed = {
			activation: "hover",
			keepAlive: false,
			maxWidth: "250px",
			edgeOffset: 3,
			delay: 0,
			fadeIn: 0,
			fadeOut: 0,
			attribute: "title",
		  	enter: function(){},
		  	exit: function(){}
		};
		var opts = $.extend(defaults, options, fixed);
		
	 	// Setup tip tip elements and render them to the DOM
	 	if($("#hs_tiptip_holder").length <= 0){
	 		var hs_tiptip_holder = $('<div id="hs_tiptip_holder" style="max-width:'+ opts.maxWidth +';"></div>');
			var hs_tiptip_content = $('<div id="hs_tiptip_content"></div>');
			var hs_tiptip_arrow = $('<div id="hs_tiptip_arrow"></div>');
			$("body").append(hs_tiptip_holder.html(hs_tiptip_content).prepend(hs_tiptip_arrow.html('<div id="hs_tiptip_arrow_inner"></div>')));
		} else {
			var hs_tiptip_holder = $("#hs_tiptip_holder");
			var hs_tiptip_content = $("#hs_tiptip_content");
			var hs_tiptip_arrow = $("#hs_tiptip_arrow");
		}
		
		return this.each(function(){
			var org_elem = $(this);
			var org_title;
			if(opts.content){
				org_title = opts.content;
			} else {
				org_title = org_elem.attr(opts.attribute);
			}
			if(org_title != "" && org_title != undefined){
				if(!opts.content){
					org_elem.removeAttr(opts.attribute); //remove original Attribute
				}
				var timeout = false;

				if(opts.activation == "hover"){
					org_elem.hover(function(){
						active_hs_tiptip();
					}, function(){
						if(!opts.keepAlive){
							deactive_hs_tiptip();
						}
					});
					if(opts.keepAlive){
						hs_tiptip_holder.hover(function(){}, function(){
							deactive_hs_tiptip();
						});
					}
				} else if(opts.activation == "focus"){
					org_elem.focus(function(){
						active_hs_tiptip();
					}).blur(function(){
						deactive_hs_tiptip();
					});
				} else if(opts.activation == "click"){
					org_elem.click(function(){
						active_hs_tiptip();
						return false;
					}).hover(function(){},function(){
						if(!opts.keepAlive){
							deactive_hs_tiptip();
						}
					});
					if(opts.keepAlive){
						hs_tiptip_holder.hover(function(){}, function(){
							deactive_hs_tiptip();
						});
					}
				}

				function active_hs_tiptip(){
					opts.enter.call(this);
					hs_tiptip_content.html(org_title);
					hs_tiptip_holder.hide().removeAttr("class").css("margin","0");
					hs_tiptip_arrow.removeAttr("style");

					var top = parseInt(org_elem.offset()['top']);
					var left = parseInt(org_elem.offset()['left']);
					var org_width = parseInt(org_elem.outerWidth());
					var org_height = parseInt(org_elem.outerHeight());
					var tip_w = hs_tiptip_holder.outerWidth();
					var tip_h = hs_tiptip_holder.outerHeight();
					var w_compare = Math.round((org_width - tip_w) / 2);
					var h_compare = Math.round((org_height - tip_h) / 2);
					var marg_left = Math.round(left + w_compare);
					var marg_top = Math.round(top + org_height + opts.edgeOffset);
					var t_class = "";
					var arrow_top = "";
					var arrow_left = Math.round(tip_w - 12) / 2;

                    if(opts.defaultPosition == "bottom"){
                    	t_class = "_bottom";
                   	} else if(opts.defaultPosition == "top"){ 
                   		t_class = "_top";
                   	} else if(opts.defaultPosition == "left"){
                   		t_class = "_left";
                   	} else if(opts.defaultPosition == "right"){
                   		t_class = "_right";
                   	}

					var right_compare = (w_compare + left) < parseInt($(window).scrollLeft());
					var left_compare = (left + tip_w / 2 + org_width / 2) > parseInt($(window).width());

					if((right_compare && w_compare < 0) || (t_class == "_right" && !left_compare) || (t_class == "_left" && left < (tip_w + opts.edgeOffset + 5))){
						t_class = "_right";
						arrow_top = Math.round(tip_h - 13) / 2;
						arrow_left = -12;
						marg_left = Math.round(left + org_width + opts.edgeOffset);
						marg_top = Math.round(top + h_compare);
					} else if((left_compare && w_compare < 0) || (t_class == "_left" && !right_compare)){
						t_class = "_left";
						arrow_top = Math.round(tip_h - 13) / 2;
						arrow_left =  Math.round(tip_w);
						marg_left = Math.round(left - (tip_w + opts.edgeOffset + 5));
						marg_top = Math.round(top + h_compare);
					}

					var top_compare = (top + org_height + opts.edgeOffset + tip_h + 8) > parseInt($(window).height() + $(window).scrollTop());
					var topbar_h = 0;
					if(opts.where != 'topbar') {
						topbar_h = parseInt($('.hs_topBar .hs_content').height());
						if(isNaN(topbar_h)) topbar_h = 0;
					}
					var bottom_compare = ((top + org_height) - (opts.edgeOffset + tip_h + 8 + topbar_h)) < 0;
					// fixes:
					if(!top_compare && !right_compare && bottom_compare && left_compare) {
						bottom_compare = false;
					}
					if(opts.defaultPosition == "left" && !top_compare && !right_compare && bottom_compare && !left_compare) {
						bottom_compare = false;
					}

					if(top_compare || (t_class == "_bottom" && top_compare) || (t_class == "_top" && !bottom_compare)){
						if(t_class == "_top" || t_class == "_bottom"){
							t_class = "_top";
						} else {
							t_class = t_class+"_top";
						}
						arrow_top = tip_h;
						marg_top = Math.round(top - (tip_h + 5 + opts.edgeOffset));
					} else if(bottom_compare | (t_class == "_top" && bottom_compare) || (t_class == "_bottom" && !top_compare)){
						if(t_class == "_top" || t_class == "_bottom"){
							t_class = "_bottom";
						} else {
							t_class = t_class+"_bottom";
						}
						arrow_top = -12;						
						marg_top = Math.round(top + org_height + opts.edgeOffset);
					}

					if(t_class == "_right_top" || t_class == "_left_top"){
						marg_top = marg_top + 5;
					} else if(t_class == "_right_bottom" || t_class == "_left_bottom"){		
						marg_top = marg_top - 5;
					}
					if(t_class == "_left_top" || t_class == "_left_bottom"){	
						marg_left = marg_left + 5;
					}
					hs_tiptip_arrow.css({"margin-left": arrow_left+"px", "margin-top": arrow_top+"px"});
					hs_tiptip_holder.css({"margin-left": marg_left+"px", "margin-top": marg_top+"px"}).attr("class","tip"+t_class);
					
					if(opts.zindex != undefined) {
						hs_tiptip_holder.css("z-index", opts.zindex);
					} else {
						hs_tiptip_holder.css("z-index", '');
					}
					if(opts.position == 'fixed') {
						hs_tiptip_holder.css("position", 'fixed');
						hs_tiptip_holder.css({"margin-left": (marg_left - parseInt($(window).scrollLeft()))+"px", "margin-top": (marg_top - top)+"px"});
					} else {
						hs_tiptip_holder.css("position", 'absolute');
					}
					
					if (timeout){ clearTimeout(timeout); }
					timeout = setTimeout(function(){ hs_tiptip_holder.stop(true,true).fadeIn(opts.fadeIn); }, opts.delay);	
				}

				function deactive_hs_tiptip(){
					opts.exit.call(this);
					if (timeout){ clearTimeout(timeout); }
					hs_tiptip_holder.fadeOut(opts.fadeOut);
				}
			}				
		});
	}
})(jQuery);