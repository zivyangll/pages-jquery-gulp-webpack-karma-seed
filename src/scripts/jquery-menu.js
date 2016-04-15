/**
 * @param {Object} $ The jQuery library
 */
(function($) {

    /**
     * Defines a jQuery object method called menu to initialize any menu on that selector.
     *
     * @param {Object} options (Optional)
     * @return {Array|Object}
     */
    $.fn.menu = function(options) {

        /**
         * Extends default options with those provided.
         *
         * @type {Object}
         * @private
         */
        var _opts = $.extend({}, $.fn.menu.defaults, options);

        /**
         * A container of menu items closing delays
         * The key is the menu item ID and the value is an object as follows:
         * {
         *  menuItemID: {
         *    element: menuItem,
         *    callback: function
         *  },
         *  menuItem2ID: {
         *    ...
         *  }
         * }
         *
         * @type {Object}
         * @private
         */
        var _timer = {};

        /**
         * Keeps track of the last menu item ID. Each menu item ID is an incremental number.
         *
         * @type {number}
         * @see _setMenuItemID
         * @private
         */
        var _lastMenuItemID = 0;

        /**
         * Assigns a unique menu item ID via the "data-menu-id" attribute
         *
         * @param {Object} menuItem
         * @private
         */
        var _setMenuItemID = function(menuItem) {
            $(menuItem).data('menu-id', ++_lastMenuItemID);
        };

        /**
         * Gets the identifier of the menu item
         *
         * @param {Object} menuItem
         * @return {number}
         * @private
         */
        var _getMenuItemID = function(menuItem) {
            return $(menuItem).data('menu-id');
        };

        /**
         * Finds the submenu of an menu item
         *
         * @param {Object} menuItem
         * @return {Object} submenu of the menuItem
         * @private
         */
        var _getSubMenu = function(menuItem) {
            return $(menuItem).find('.' + _opts.subMenuClass).first();
        };

        /**
         * Removes the visible menu item CSS class to menuItem and hides its submenu
         *
         * @param {Object} menuItem
         * @private
         */
        var _hideMenuItem = function(menuItem) {
            $(menuItem).removeClass(_opts.visibleMenuItemClass);
            _getSubMenu(menuItem).hide();
        };

        /**
         * Adds the visible menu item CSS class to menuItem and shows its submenu
         *
         * @param {Object} menuItem
         * @private
         */
        var _showMenuItem = function(menuItem) {
            $(menuItem).addClass(_opts.visibleMenuItemClass);
            _getSubMenu(menuItem).show();
        };

        return this.each(function() {
            var menu = this;

            $(menu).find('.' + _opts.menuItemClass)
                // Assigns unique IDs to all the menu items
                .each(function(index, menuItem) {
                    _setMenuItemID(menuItem);
                })
                .on('mouseenter', function(event) {
                    var menuItem = this;

                    // Prevents an immediate closing of the menu when the mouse goes out from the menu
                    if (_timer[_getMenuItemID(menuItem)] &&
                            _timer[_getMenuItemID(menuItem)].callback > 0) {
                        clearTimeout(_timer[_getMenuItemID(menuItem)].callback);
                    }

                    // Hides all the submenus that are not parents or children of the current pointed item
                    $.each(_timer, function(menuItemID, obj) {
                        if (menuItemID !== _getMenuItemID(menuItem) &&
                                $(obj.element).find(menuItem).length === 0 &&
                                $(menuItem).find(obj.element).length === 0) {
                            _hideMenuItem(obj.element);
                        }
                    });

                    // Shows the submenu
                    _showMenuItem(menuItem);
                }).on('mouseleave', function(event) {
                    var menuItem = this;

                    // If the mouse points the menu container
                    if ($(menu).is(document.elementFromPoint(event.clientX, event.clientY))) {
                        // Hides the submenu
                        _hideMenuItem(menuItem);
                    }
                    else {
                        // The mouse is outside the menu container
                        _timer[_getMenuItemID(menuItem)] = {
                            element: menuItem,
                            callback: setTimeout(function() {
                                // Hides the submenu
                                _hideMenuItem(menuItem);
                            }, _opts.delay)
                        };
                    }
                });
        });
    };

    /**
     * Plugin defaults - added as a property on our plugin function.
     *
     * @type {Object}
     */
    $.fn.menu.defaults = {

        /**
         * Delay (in milliseconds) of menu item closing
         *
         * @type {number}
         */
        delay: 300,

        /**
         * Class name of the submenu.
         *
         * @type {string}
         */
        subMenuClass: 'sub-menu',

        /**
         * Class name of the menu item.
         *
         * @type {string}
         */
        menuItemClass: 'menu-item',

        /**
         * Class name of the visible menu item.
         *
         * @type {string}
         */
        visibleMenuItemClass: 'is-menu-item-visible'
    };
}(jQuery));
