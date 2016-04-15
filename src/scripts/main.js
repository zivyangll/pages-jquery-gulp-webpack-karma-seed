$(document).ready(function() {
  var ClassA = require('./class/testA');
  var objA = new ClassA('yanglonglong');
  console.log(objA.getA());
  $('h3').html('hdf');
});
