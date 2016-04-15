// jQuery-Menu functional test suite
describe("jQuery-Menu functional tests", function() {

  // DOM elements of the menu created with default options against which the tests will be run
  var defaultItems = {};
  // DOM elements of the menu created with custom options against which the tests will be run
  var customItems = {};

  var customOptions = { // Different that the default ones for testing purpose
    delay: 1000,
    visibleMenuItemClass: "test-visible-class"
  };

  // Menu fixture to inject into DOM
  var fixture = '\
        <ul class="menu">\
            <li class="menu-item">\
                <a href="#">Item1</a>\
                <ul class="sub-menu">\
                    <li class="menu-item"><a href="#">Item1.1</a></li>\
                    <li class="menu-item"><a href="#">Item1.2</a></li>\
                </ul>\
            </li>\
            <li class="menu-item">\
                <a href="#">Item2</a>\
                <ul class="sub-menu">\
                    <li class="menu-item"><a href="#">Item2.1</a></li>\
                    <li class="menu-item">\
                        <a href="#">Item2.2</a>\
                        <ul class="sub-menu">\
                            <li class="menu-item"><a href="#">Item2.2.1</a></li>\
                        </ul>\
                    </li>\
                </ul>\
            </li>\
        </ul>';

  // Clear the ambient for the next test
  beforeEach(function() {
    // Removes all the elements added by various tests
    $('body').empty();
    // Inject two identical menus into DOM
    $('body').append('<div id="fixture_default">' + fixture + '</div>');
    $('body').append('<div id="fixture_custom">' + fixture + '</div>');

    // Initialize the first one with default options
    $('.menu').first().menu();
    // Initialize the second one with custom options
    $('.menu').last().menu(customOptions);

    // DOM elements of the menu with default options

    // First menu item
    defaultItems.firstMenuItem = $(".menu").first().find("> .menu-item:first-child");
    // Submenu of the first menu item
    defaultItems.firstSubMenu = defaultItems.firstMenuItem.find("> .sub-menu");

    // Second menu item
    defaultItems.secondMenuItem = $(".menu").first().find("> .menu-item:nth-child(2)");
    // Submenu of the second menu item
    defaultItems.secondSubMenu = defaultItems.secondMenuItem.find("> .sub-menu");

    // Third item of the second submenu
    defaultItems.secondSubMenuItem = defaultItems.secondSubMenu.find("> .menu-item:nth-child(3)");
    // Second item of the second submenu
    defaultItems.anotherSecondSubMenuItem = defaultItems.secondSubMenu.find("> .menu-item:nth-child(2)");
    // Submenu of the third item of the second submenu
    defaultItems.secondSubMenu_subMenu = defaultItems.secondSubMenuItem.find("> .sub-menu");


    // DOM elements of the menu with custom options
    customItems.firstMenuItem = $(".menu").last().find("> .menu-item:first-child");
    customItems.firstSubMenu = customItems.firstMenuItem.find("> .sub-menu");

    customItems.secondMenuItem = $(".menu").last().find("> .menu-item:nth-child(2)");
    customItems.secondSubMenu = customItems.secondMenuItem.find("> .sub-menu");

    // Third item of the second submenu
    customItems.secondSubMenuItem = customItems.secondSubMenu.find("> .menu-item:nth-child(3)");
    // Second item of the second submenu
    customItems.anotherSecondSubMenuItem = customItems.secondSubMenu.find("> .menu-item:nth-child(2)");
    // Submenu of the third item of the second submenu
    customItems.secondSubMenu_subMenu = customItems.secondSubMenuItem.find("> .sub-menu");
  });

  // Tests that are not time-dependent (no timeouts)
  describe("Sync tests", function() {

    // The jQuery .menu() method must be defined
    it("Is defined", function() {
      expect(typeof $.fn.menu).toBe("function");
    });

    // If custom options are used, then they must overwrite the default ones without changing the
    // plugin defaults configuration object
    it("Doesn't overwrite plugin defaults configuration object", function() {
      var defaultsBefore = $.extend(true, {}, $.fn.menu.defaults);

      // Reinitializing the first menu with custom options
      $('.menu').first().menu(customOptions);

      var defaultsAfter = $.fn.menu.defaults;
      expect(defaultsBefore).toEqual(defaultsAfter);
    });

    // If the mouse enters the menu item the submenu must be visible
    it("Toggles on mouseenter", function() {
      defaultItems.firstMenuItem.mouseenter();
      expect(defaultItems.firstSubMenu).toBeVisible();

      customItems.firstMenuItem.mouseenter();
      expect(customItems.firstMenuItem).toBeVisible();
    });

    // If the mouse enters the menu item, then that item must have the "visibleMenuItemClass"
    it("Has visible menu class", function() {
      defaultItems.firstMenuItem.mouseenter();
      expect(defaultItems.firstMenuItem).toHaveClass($.fn.menu.defaults.visibleMenuItemClass);

      customItems.firstMenuItem.mouseenter();
      expect(customItems.firstMenuItem).toHaveClass(customOptions.visibleMenuItemClass);
    });

    // If the mouse leaves .menu-item, then the relative submenu must be visible
    it("Must be visible right after mouseleave", function() {
      defaultItems.firstMenuItem.mouseenter();
      defaultItems.firstMenuItem.mouseleave();
      expect(defaultItems.firstSubMenu).toBeVisible();

      customItems.firstMenuItem.mouseenter();
      customItems.firstMenuItem.mouseleave();
      expect(customItems.firstSubMenu).toBeVisible();
    });

    // If the mouse moves from one menu item to another inside the same container
    // the first menu item submenu must be hidden
    it("Hides submenu if mouse moves to another submenu element inside the same container", function() {
      defaultItems.secondMenuItem.mouseenter();
      defaultItems.secondSubMenuItem.mouseenter();
      defaultItems.secondSubMenuItem.mouseleave();
      defaultItems.anotherSecondSubMenuItem.mouseenter();
      expect(defaultItems.secondSubMenu_subMenu).not.toBeVisible();

      customItems.secondMenuItem.mouseenter();
      customItems.secondSubMenuItem.mouseenter();
      customItems.secondSubMenuItem.mouseleave();
      customItems.anotherSecondSubMenuItem.mouseenter();
      expect(customItems.secondSubMenu_subMenu).not.toBeVisible();
    });

    // If the mouse moves outside the menu item but is still inside the menu container the submenu must be closed
    it("Hides if mouse moves out from the menu element and is still inside the container", function() {

      // jQuery-Menu uses mouse position from the mouseleave event to check if the pointer is still inside
      // the container so we need to construct the mouseleave event with particular coordinates
      // (out of the elements but inside the container) to simulate this use case
      var event = new jQuery.Event("mouseleave");
      // To simulate the mouseleave inside the menu container we set coordinates of the second menu item
      // right-bottom corner + 1 pixel X & Y offsets
      event.clientX = defaultItems.firstMenuItem.offset().left - 1;
      event.clientY = defaultItems.firstMenuItem.offset().top + (defaultItems.firstMenuItem.height() / 2) + 1;
      defaultItems.firstMenuItem.mouseenter();
      defaultItems.firstMenuItem.trigger(event);
      defaultItems.firstMenuItem.parent().mouseenter();
      expect(defaultItems.firstSubMenu).not.toBeVisible();

      event = new jQuery.Event("mouseleave");
      event.clientX = customItems.firstMenuItem.offset().left - 1;
      event.clientY = customItems.firstMenuItem.offset().top + (customItems.firstMenuItem.height() / 2);
      customItems.firstMenuItem.mouseenter();
      customItems.firstMenuItem.trigger(event);
      customItems.firstMenuItem.parent().mouseenter();
      expect(customItems.firstSubMenu).not.toBeVisible();
    });

    // If the mouse moves from one menu item to another, which is not its parent nor child, all
    // first menu item submenus must be closed
    it("Hides other submenus on menu item change", function() {
      defaultItems.firstMenuItem.mouseenter();
      defaultItems.firstMenuItem.mouseleave();
      defaultItems.secondMenuItem.mouseenter();
      expect(defaultItems.firstSubMenu).not.toBeVisible();
      expect(defaultItems.secondSubMenu).toBeVisible();

      customItems.firstMenuItem.mouseenter();
      customItems.firstMenuItem.mouseleave();
      customItems.secondMenuItem.mouseenter();
      expect(customItems.firstSubMenu).not.toBeVisible();
      expect(customItems.secondSubMenu).toBeVisible();
    });

    // If there are 2 menu items with the same name, the ID must still be unique
    it("Generates unique item IDs if menu has items with the same name", function() {
      defaultItems.firstMenuItem.parent().append(defaultItems.firstMenuItem.clone());

      // Rebuild the menu considering the cloned item
      $('.menu').first().menu();

      var sameMenuItem = $(".menu").first().find(".menu-item").last();
      var id1 = $(defaultItems.firstMenuItem).data("menu-id");
      var id2 = $(sameMenuItem).data("menu-id");
      expect(id1).not.toBe(id2);

      customItems.firstMenuItem.parent().append(customItems.firstMenuItem.clone());
      $(".menu").last().menu(customOptions);
      sameMenuItem = $(".menu").last().find(".menu-item").last();
      id1 = $(customItems.firstMenuItem).data("menu-id");
      id2 = $(sameMenuItem).data("menu-id");

      expect(id1).not.toBe(id2);
    });

    it("Menu item IDs of one menu are reused in other menus", function() {
      // Changes class to custom-menu and reinitializes a menu
      $('.menu').first().removeClass("menu")
        .addClass("custom-menu")
        .menu();

      var menuIDs = [];
      var customMenuIDs = [];

      $(".menu").find(".menu-item").each(function() {
        menuIDs.push($(this).data("menu-id"));
      });

      $(".custom-menu").find(".menu-item").each(function() {
        customMenuIDs.push($(this).data("menu-id"));
      });

      var commonIds = menuIDs.filter(function(id) {
        var haveElementsInCommon = false;

        customMenuIDs.forEach(function(customId) {
          if (id === customId) {
            haveElementsInCommon = true;
          }
        });

        return haveElementsInCommon;
      }).length;

      expect(commonIds > 0).toBeTruthy();
    });
  });
});
