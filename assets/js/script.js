
function domobj(){
  var self        =this;
  self.products   = [];

  self.getproducts = function(url){
    var deferred = new $.Deferred();

    $.getJSON(url, function(response){
        for(i=0; i<response.sales.length ; i++){
          self.products.push( new productobj(response.sales[i], i)  );
        }
        deferred.resolve();
    });

    return deferred.promise();
  }

  self.updateproducthtml = function(){
    var deferred = new $.Deferred();

    $.get('product-template.html', function(response){
      for( i=0; i< self.products.length ; i++){
        self.products[i].updatehtml(response);
      }
      deferred.resolve();
    });

    return deferred.promise();
  }

  self.updatedom = function(){
    var i=0
    var deferred = new $.Deferred();
    thishtml="<div class='row-fluid'>";

    for( i=0; i< self.products.length ; i++){
      thishtml += self.products[i].htmlview;
    }
    thishtml += "</div>"
    deferred.resolve();
    $("#content").append(thishtml)
    return deferred.promise();
  }

}

function productobj(product, i){
  var self          = this;
  self.photo        = product.photos.medium_half
  self.title        = product.name
  self.tagline      = product.tagline
  self.url          = product.url
  self.htmlview     = ""
  self.index        = i
  self.custom_class = "col"+ ((i % 3) +1)

  self.updatehtml= function(template){
    self.htmlview = template.replace('{image}', self.photo).replace('{title}', self.title).replace('{tagline}', self.tagline).replace('{url}', self.url).replace('{custom_class}', self.custom_class);
  };
}

var starter = new $.Deferred();
var page=new domobj();

var Promise1 = starter.then(function(){
  console.log("promise1");
  return page.getproducts('data.json');
})

var Promise2 = Promise1.then(function(){
  console.log("promise2");
  return page.updateproducthtml();
})

var Promise3 = Promise2.then(function(){
  console.log("promise3");
  page.updatedom();
})

var Promise4 = Promise3.then(function(){
  console.log("promise4");
  $('button.close').on('click', function(){
    var product = $(this).parent();
    $(product).remove();
  })
})

starter.resolve();
