/* globals Shared */

(function() {

  Shared.SharedC = Trillo.inherits(Trillo.Controller, function(viewSpec) {
    Trillo.Controller.call(this, viewSpec);
  });

  var SharedC = Shared.SharedC.prototype;
  var Controller = Trillo.Controller.prototype;

  SharedC.handleAction = function(actionName, selectedObj, $e, targetController) {
    if (actionName === "addToCart") {
      this.addToCart(selectedObj);
      return true;
    }
    return Controller.handleAction.call(this, actionName, selectedObj, $e, targetController);
  };

  SharedC.addToCart = function(product) {
    var self = this;
    var cartId = "cart_" + Trillo.appContext.user.userId;
    var url = "/api/cart/" + cartId + "?attachments=true";
    $.ajax({
      url : url
    }).done(function(data) {
      ecommerce._cart = data;
      self.addProduct(product);
    }).fail(function() {

    });
  }

  SharedC.addProduct = function(product) {
    var cart = ecommerce._cart;
    var items = cart.cart_items;
    var found = false;
    if (items) {
      for (var i = 0; i < items.length; i++) {
        if (items[i].product_id === product.id) {
          found = true;
          items[i].quantity += 1;
          break;
        }
      }
    }
    if (!found) {
      if (!items) {
        items = cart.cart_items = [];
      }
      items.push({
        product_id : product.id,
        quantity : 1
      })
      if (this.parentController().newItemAdded) {
        this.parentController().newItemAdded();
      }
    }
    var options = {
      url : "/api/cart/" + "cart_" + Trillo.appContext.user.userId,
      type : "put",
      data : Trillo.stringify(cart),
      contentType : "application/json",
      datatype : "application/json"
    };

    $.ajax(options).done(function(data) {
    }).fail(function() {

    });
  }

})();