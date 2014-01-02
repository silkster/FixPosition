/**
 * jQuery Plugin to set an element as fixed in place after the screen is scrolled to a certain vertical point.
 *
 * Create 12/18/2013, by dsilk
 *
 * Dependencies: utils object and components common.js
 *               utils object extended with pubsub mechanism from pubsub.js
 **/

if (jQuery) (function ($) {

    var name = 'fixPosition';

    // the main plugin
    function Plugin (element, options) {
        this.element = element.jquery ? element : $(element);

        // need unique instance tag for custom pub/sub event names
        this.uniqueId = utils.getUniqueId(8);

        this.init(options);
    }

    // initializes the plugin for an element
    Plugin.prototype.init = function (options) {
        var defaults = {
            scrollContainer: $(window),
            targetContainer: this.element,
            framingContainer: this.element.parent(),
            fixedClass: 'fixed',
            fixedPositionTop: 100,
            position: {
                margin: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                fixed: {
                    top: 100,
                    left: 0
                }
            },
            events: {
                on: 'fixposition.on.' + this.uniqueId,
                off: 'fixposition.off.' + this.uniqueId,
                init: 'fixposition.init.' + this.uniqueId
            }
        };
        this.settings = $.extend(true, defaults, options);

        this.setPosition();
        this.registerEvents();

        this.resize = null;
        this.frameOffsetLeft = this.element.offset().left - this.settings.framingContainer.offset().left;

        utils.publish(this.settings.events.init, []);
    };

    // sets the fixed position values for the element
    Plugin.prototype.setPosition = function () {
        var fixedTop, fixedLeft,
            offset = this.element.offset(),
            position = this.settings.position;

        fixedTop = position.fixed.top + position.margin.top - position.margin.bottom;
        fixedLeft = offset.left + position.margin.left - position.margin.right;

        this.fixedPosition = { top: fixedTop, left: fixedLeft };

        this.threshhold = {
            top: offset.top + (-1 * this.fixedPosition.top),
            left: this.fixedPosition.left
        };
    };

    // gets the new left offset after the screen is resized
    Plugin.prototype.getLeftOffset = function () {
        var position = this.settings.position,
            marginOffset = position.margin.left - position.margin.right;

        return this.settings.framingContainer.offset().left + this.frameOffsetLeft + marginOffset;
    };

    // check if the page is scrolled past the bottom scrolling threshhold
    Plugin.prototype.isPastBottomThreshhold = function () {
        var framingContainer = this.settings.framingContainer,
            bottomThreshhold = framingContainer.offset().top + framingContainer.height(),
            scrollTop = $(window).scrollTop(),
            elementBottomOffset = this.element.height() + this.settings.position.fixed.top;

        return (scrollTop + elementBottomOffset) > bottomThreshhold;
    };

    // set the window scroll and resize events on the scrollContainer
    Plugin.prototype.registerEvents = function () {
        var plugin = this,
            settings = plugin.settings;

        settings.scrollContainer
            .on('scroll', function () {
                var $container = $(this),
                    yPos = $container.scrollTop(),
                    settings = plugin.settings,
                    fixedClass = settings.fixedClass;

                if ((yPos < plugin.threshhold.top && settings.targetContainer.hasClass(fixedClass)) || plugin.isPastBottomThreshhold()) {
                    // the page is scrolled outside of the scrolling threshhold
                    settings.targetContainer
                        .removeClass(fixedClass)
                        .css('left', 'auto');;
                    utils.publish(settings.events.off, []);
                } else if (yPos >= plugin.threshhold.top && !settings.targetContainer.hasClass(fixedClass)) {
                    // the page is scrolled within the scrolling threshhold
                    settings.targetContainer
                        .addClass(fixedClass)
                        .css({
                            top: plugin.fixedPosition.top + 'px',
                            left: plugin.fixedPosition.left + 'px'
                        });

                    utils.publish(settings.events.on, []);
                }
            })
            .on('resize', function () {
                if (plugin.resize) {
                    clearTimeout(plugin.resize);
                }
                plugin.resize = setTimeout(function () {
                    plugin.fixedPosition.left = plugin.getLeftOffset();
                    if (plugin.settings.targetContainer.hasClass(settings.fixedClass)) {
                        plugin.settings.targetContainer
                            .css({
                                left: plugin.fixedPosition.left + 'px'
                            });
                    }
                }, 25);

                // publish the resize event
                utils.publish(plugin.settings.events.resize, []);
            });

        if (typeof this.settings.onScroll == 'function') {
            settings.scrollContainer.on('scroll', this.settings.onScroll);
        }
    };

    // set the jQuery.fn method for the plugin
    $.fn[name] = function (options) {
        return this.each(function () {
            var self = $(this);
            self.data(name, new Plugin(self, options))
        });
    }

}(jQuery));
