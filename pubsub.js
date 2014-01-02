/*  

    jQuery pub/sub plugin by Peter Higgins (dante@dojotoolkit.org)

    Loosely based on Dojo publish/subscribe API, limited in scope. Rewritten blindly.

    Original is (c) Dojo Foundation 2004-2010. Released under either AFL or new BSD, see:
    http://dojofoundation.org/license for more information.

*/
if (typeof utils === 'undefined') { utils = {}; }

(function($, utilities){

    // the pubsub object with methods that affect cache
    function PubSub () {

        // the topic/subscription hash
        var cache = {};

        /**
          * summary: Publish some data on a named topic.
          *  topic: String The channel to publish on
          *   args: Array The data to publish. Each array item is converted into an ordered arguments on the subscribed functions. 
          *
          *  example:
          *      Publish stuff on '/some/topic'. Anything subscribed will be called
          *      with a function signature like: function(a,b,c){ ... }
          *
          *  |       utilities.publish("/some/topic", ["a","b","c"]);
          **/
        this.publish = function(topic, args){
            if (cache[topic]) {
                $.each(cache[topic], function(){
                    if (!$.isArray(args)) {
                        args = [args];
                    }
                    this.apply($, args || []);
                });
            }
        };

        /**
          * summary: Register a callback on a named topic.
          *     topic: String The channel to subscribe to
          *  callback: Function The handler event. Anytime something is $.publish'ed on a 
          *                     subscribed channel, the callback will be called with the
          *                     published array as ordered arguments.
          *
          *   returns: Array A handle which can be used to unsubscribe this particular subscription.
          *  
          * example:
          *  |   utilities.subscribe("/some/topic", someFunction);
          *
          **/
        this.subscribe = function(topic, callback){
            if(!cache[topic]){
                cache[topic] = [];
            }
            cache[topic].push(callback);
            return [topic, callback]; // Array
        };

        /**
          * summary: Disconnect a subscribed function for a topic.
          *    handle: Array The return value from a $.subscribe call.
          *
          * example:
          *  |   var handle = $.subscribe("/something", function(){});
          *  |   utilities.unsubscribe(handle);
          **/
         this.unsubscribe = function (handle){
            var t = handle[0];
            if (cache[t]) {
                $.each(cache[t], function(idx){
                    if(this == handle[1]){
                        cache[t].splice(idx, 1);
                    }
                });
            }
        };
    }

    var pubsub = new PubSub();

    // extend utilities object with pubsub
    $.extend(true, utilities, pubsub);

})(jQuery, utils);
