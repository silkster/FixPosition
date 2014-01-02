/*  

    jQuery pub/sub plugin by Peter Higgins (dante@dojotoolkit.org)

    Loosely based on Dojo publish/subscribe API, limited in scope. Rewritten blindly.

    Original is (c) Dojo Foundation 2004-2010. Released under either AFL or new BSD, see:
    http://dojofoundation.org/license for more information.

*/
if (typeof utils === 'undefined') { utils = {}; }

(function($, utilities){

        var common = {
            getUniqueId: function (idLength) {
                var id = "",
                    chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_|";

                for( var i=0; i < idLength; i++ ){
                    id += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                return id;
            }
        };

        $.extend(true, utilities, common);

})(jQuery, utils);
