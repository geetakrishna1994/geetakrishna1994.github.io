$(function () { // Same as document.addEventListener("DOMContentLoaded"...

  // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
  $("#navbarToggle").blur(function (event) {
    let screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });

  // In Firefox and Safari, the click event doesn't retain the focus
  // on the clicked button. Therefore, the blur event will not fire on
  // user clicking somewhere else in the page and the blur event handler
  // which is set up above will not be called.
  // Refer to issue #28 in the repo.
  // Solution: force focus on the element that the click event fired on
  $("#navbarToggle").click(function (event) {
    $(event.target).focus();
  });
});




(function (global) {
  let dc = {};
  let homeHtml = "snippets/home-snippet.html";
  let allCategoriesUrl = 
  "https://davids-restaurant.herokuapp.com/categories.json";
  let categoriesTitleHtml = "snippets/categories-title-snippet.html";
  let categoryHtml = "snippets/category-snippet.html";
  let menuItemsUrl = "https://davids-restaurant.herokuapp.com/menu_items.json?category=";
  let menuItemsTitleHtml = "snippets/menu-items-title.html";
  let menuItemsHtml = "snippets/menu-items.html";

  let insertHtml = function (selector, html) {
    let targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };

  let showLoading = function(selector) {
    let html = '<div class="text-center">';
    html += '<img src="images/ajax-loader.gif></div>';
    insertHtml(selector, html);
  }

  let insertProperty = 
  function (string, propName, propValue) {
    let propToReplace = 
    "{{" + propName + "}}";
    string = string
    .replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  };

  document.addEventListener("DOMContentLoaded", function (event) {
    showLoading('#main-content');
    $ajaxUtils.sendGetRequest(
      homeHtml, 
      function (responseText) {
        document.querySelector("#main-content")
        .innerHTML = responseText;
      },
      false);
  });

  dc.loadMenuCategories = function () {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      allCategoriesUrl,
       buildAndShowCategoriesHTML);
  };

  function buildAndShowCategoriesHTML (categories) {
    $ajaxUtils.sendGetRequest(
      categoriesTitleHtml,
       function (categoriesTitleHtml) {
        $ajaxUtils.sendGetRequest(
          categoryHtml,
          function (categoryHtml) {
            let categoriesViewHtml = 
            buildCategoriesViewHtml(categories,
              categoriesTitleHtml,
              categoryHtml);
            insertHtml("#main-content", categoriesViewHtml);
          },
          false);
      },
      false);
  };

  function buildCategoriesViewHtml(categories,
    categoriesTitleHtml, 
    categoryHtml) {
    let finalHtml = 
    categoriesTitleHtml;
    finalHtml += "<section class='row'>";

    for (let i = 0; i < categories.length; i++) {
      let html =
       categoryHtml;
      let name = 
      "" + categories[i].name;
      let short_name =
       categories[i].short_name;
      html = 
      insertProperty(html, "name", name);
      html = 
      insertProperty(html, 
        "short_name", 
        short_name);
      finalHtml += html;
    }
    finalHtml += "</section>";
    return finalHtml;
  };


  dc.loadMenuItems = function (categoryShort) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      menuItemsUrl + categoryShort,
      buildAndShowMenuItemsHTML
    );
  };

  function BuildAndShowMenuItemsHtml (categoryMenuItems) {
    $ajaxUtils.sendGetRequest(
      menuItemsTitleHtml,
      function(menuItemsTitleHtml) {
        $ajaxUtils.sendGetRequest(
          menuItemsHtml, 
          function (menuItemsHtml) {
            let menuItemsViewHtml = 
              buildMenuItemsViewHtml(categoryMenuItems,
                                      menuItemsTitleHtml,
                                      menuItemsHtml);
              insertHtml("#main-content", menuItemsViewHtml);
          },
          false);
      },
      false);
  };

  function builfMenuItemsViewHtml(categoryMenuItems,
                                  menuItemsTitleHtml,
                                  menuItemsHtml){
    
    menuItemsTitleHtml = insertProperty(menuItemsTitleHtml, "name", categoryMenuItems.category.name);

    menuItemsTitleHtml = insertProperty(menuItemsTitleHtml, "special_instrunctions", categoryMenuItems.category.special_instructions);

    let finalHtml = menuItemsTitleHtml;
    finalHtml += '<section class="row">';

    let menuItems = categoryMenuItems.menu_items;
    let catShortName = categoryMenuItems.category.short_name;
    for(let i=0; i<menuItems.length; i++) {
      let html = menuItemsHtml;
      html = insertProperty(html, "short_name", menuItems[i].short_name);
      html = insertProperty(html, "catShortName", catShortName);
      html = insertProperty(html, "price_small", menuItems[i].price_small);
      html = insertProperty(html, "price_small", menuItems[i].price_small);
      html = insertProperty(html, "price_small", menuItems[i].price_small);
      html = insertProperty(html, "price_small", menuItems[i].price_small);
    }
  };

  global.$dc = dc;
})(window);