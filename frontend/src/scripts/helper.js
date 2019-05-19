var deep_copy = function (obj){
  if(typeof obj != 'object'){
    return obj;
  }
  if (obj.length == undefined) {
    var newobj = {};
    for ( var attr in obj) {
      newobj[attr] = deep_copy(obj[attr]);
    }
    return newobj;
  }
  else {
    var newobj = [];
    for ( var i = 0;i < obj.length;i++) {
      newobj[i] = deep_copy(obj[i]);
    }
    return newobj;
  }
};

export { deep_copy }