(function () {
  'use strict';

  // This function gets included
  function cube(x) {
    // rewrite this as `square( x ) * x`
    // and see what happens!
    return x * x * x;
  }

  console.log(cube(5));

}());