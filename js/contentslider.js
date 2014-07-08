(function($){	
	var setContentDimensions = function(){					
		cS.config.setSliderHolderDimensions('resize');
	}	
	window.addEventListener("orientationchange", setContentDimensions);
	window.addEventListener("resize", setContentDimensions);
	
	$('head').append('<style type="text/css">.content-slider-holder{position:relative;left:0;clear:both;overflow:hidden;}\n.content-slider-wrapper{overflow:hidden;}\n.content-slides{position:relative;float:left;overflow:hidden;}</style>');

	window.contentSlider = cS = {
		config:{
			getDeviceDimensions:function(){
				$(document.body).append('<div id="tmpdiv"></div>');
				var tmp = $("#tmpdiv").css({
					position:'fixed',
					width:'100%',
					height:'100%',
				});
				var w = tmp.width();
				var h = tmp.height();
				tmp.remove();																
				return {width:w,height:h};
			},			
			dimensions:function(){				
				var settings =  contentSlider.config.settings;				
				var viewport = contentSlider.config.getDeviceDimensions();				
				var w,y;		
						
				w = settings.staticWidth?settings.width.split('px')[0]:Math.round((viewport.width*(settings.width.split('%')[0]))/100);
				h = settings.staticHeight?settings.height.split('px')[0]:Math.round((viewport.height*(settings.height.split('%')[0]))/100);				
				return{width:w,height:h};
			},
			setSliderHolderDimensions:function(){
				if(arguments[0] == 'resize' && cS.config.settings.transition == 'auto') {
					clearInterval(cS.config.settings.slideIntervalID);
				}		
				
				var dimensions = contentSlider.config.dimensions();				
				
				if((contentSlider.config.settings.staticWidth || (!contentSlider.config.settings.staticWidth && contentSlider.config.settings.width != '100%')) && !document.querySelector('.content-slider-wrapper')){
					$('<div class="content-slider-wrapper"></div>').insertBefore('.content-slider-holder');
					$('.content-slider-wrapper').css({width:dimensions.width+'px',overflow:'hidden'});	
					$('.content-slider-holder').detach().appendTo('.content-slider-wrapper');					
				} else if(!!document.querySelector('.content-slider-wrapper')) {
					$('.content-slider-wrapper').css({width:dimensions.width+'px'});
				}
							
				$('.content-slider-wrapper').css({width:dimensions.width+'px'});
				$('.content-slider-wrapper').css({width:dimensions.width+'px',overflow:'hidden'});				
				
				$('.content-slider-holder').css({
					width:(($('.content-slider-holder').children('.content-slides').length * dimensions.width)+1)+'px',
					height:dimensions.height+'px',	
				}).children('.content-slides').css({
					width:dimensions.width+'px',
					height:dimensions.height+'px',
				});		
				
				if(arguments[0] == 'resize' && cS.config.settings.transition == 'auto') {					
					cS.config.settings.slideIntervalID = setInterval(cS.events.nextSlide,cS.config.settings.transitionInterval);					
				}	
			},
			settings:{							
				transition:'auto',
				transitionInterval:3000,
				transitionSpeed:300,
				slideIntervalID:null,				
			},
			setSlider:function(options){				
				$.extend(contentSlider.config.settings ,options);
				var settings =  contentSlider.config.settings;
				contentSlider.config.settings.staticWidth = !!settings.width.match(/px/i);
				contentSlider.config.settings.staticHeight = !!settings.height.match(/px/i);
				contentSlider.config.setSliderHolderDimensions();			
				var transitionSpeed = (settings.transitionSpeed>300)?(settings.transitionSpeed/1000):'0.3';	
				$('head').append('<style type="text/css">.transition{transition:'+transitionSpeed+'s}</style>');
				slideList = cS.slides.slideList = $('.content-slider-holder').children('.content-slides');				
				if (slideList.filter('.slide-default').length > 0) {
					$.each(slideList, function(k, v){						
						if (v.className.match(/slide-default/i)) {
							cS.slides.currentSlide = k;
							if (k > 0) {
								$('.content-slider-holder').removeClass('transition');								
								
								$('.content-slider-holder').css({
									transition:0,
									left: (-1 * k * $('.content-slides').width()) + 'px',
								})
								setTimeout(function(){ $('.content-slider-holder').addClass('transition'); },300);						
							}
						}												
					});
				} else {
					cS.slides.currentSlide = 0;	
				}			
				if(settings.transition == 'auto'){					
					cS.config.settings.slideIntervalID = setInterval(cS.events.nextSlide,settings.transitionInterval);
				}				
				$('.content-slider-holder').removeClass('transition');				
				setTimeout(function(){ $('.content-slider-holder').addClass('transition'); },300);
			},			
		},
		events:{
			nextSlide:function(){				
				var nxtSlide = ++cS.slides.currentSlide;
				var csLeft;			
				if(nxtSlide >= cS.slides.slideList.length){					
					var firstSlide = $('.content-slider-holder').children('.content-slides').first();
					$(firstSlide[0]).clone().appendTo('.content-slider-holder');					
					
					$('.content-slider-holder').css({
						width:($('.content-slider-holder').width()+$('.content-slides').width())+'px',
					});
					csLeft= (-1 *((nxtSlide) * $('.content-slides').width()))+'px';
					setTimeout(function(){
						$('.content-slider-holder').css({
							left:csLeft,
						});	
					},300);
					
					
					setTimeout(function(){
						$('.content-slider-holder').removeClass('transition');							
						cS.slides.currentSlide = 0;
						csLeft = 0;
						$('.content-slider-holder').css({
							left:csLeft,
						});
						$('.content-slider-holder').css({
							width:($('.content-slider-holder').width() - $('.content-slides').width())+'px',
						});						
						$('.content-slider-holder').children('.content-slides').last().remove();
						$('.content-slider-holder').addClass('transition');						
					},500);			
					
				} else {
					csLeft= (-1 *(nxtSlide * $('.content-slides').width()))+'px';				
					cS.slides.currentSlide = nxtSlide;
					$('.content-slider-holder').css({
						left:csLeft,
					});	
				}				
			},
			prevSlide:function(){
				if(cS.config.settings.transition == 'auto'){
					clearInterval(cS.config.settings.slideIntervalID);
				}
				var prevSlide = --cS.slides.currentSlide;
				var csLeft;				
				if(prevSlide < 0){
					var lastSlideClone = $('.content-slider-holder').children('.content-slides').last().clone();					
					$('.content-slider-holder').prepend(lastSlideClone);					
	
					$('.content-slider-holder').css({
						width:($('.content-slider-holder').width()+$('.content-slides').width())+'px',
					});
					$('.content-slider-holder').removeClass('transition');
					$('.content-slider-holder').css({
							left:(-1 * $('.content-slides').width()) + 'px',
					});	
					setTimeout(function(){
						$('.content-slider-holder').addClass('transition');
					},300);
					csLeft = 0;									
					setTimeout(function(){
						$('.content-slider-holder').css({
							left:csLeft,
						});	
					},500);					
					
					setTimeout(function(){
						$('.content-slider-holder').removeClass('transition');							
						cS.slides.currentSlide = cS.slides.slideList.length-1;
						csLeft = (-1 * ($('.content-slides').width() * cS.slides.currentSlide))+'px';
						$('.content-slider-holder').css({
							left:csLeft,
						});
						$('.content-slider-holder').css({
							width:($('.content-slider-holder').width() - $('.content-slides').width())+'px',
						});						
						$('.content-slider-holder').children('.content-slides').first().remove();
						$('.content-slider-holder').addClass('transition');						
					},700);					
					
				}else{	
					csLeft= (-1 *($('.content-slides').width()*(cS.slides.currentSlide)))+'px';
					cS.slides.currentSlide = prevSlide;
					$('.content-slider-holder').css({
						left:csLeft,
					});
				}
				
				if(cS.config.settings.transition == 'auto'){
					cS.config.settings.slideIntervalID = setInterval(cS.events.nextSlide,cS.config.settings.transitionInterval);
				}
			},
		},
		slides:{
			currentSlide:null,			
			slideList:[],
		}			
	};		
})(jQuery)
/*
* Joey Resuento - Content Slider
* ontouch events - not yet supported
*/
