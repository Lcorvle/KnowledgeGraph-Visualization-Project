import * as d3 from 'd3';


var BuildCubicBezierCurve = function (points) {
  let path = d3.path();
  path.moveTo(points[0].x, points[0].y);

  for (let i = 0; i < points.length - 1; i++){
    let halfX = (points[i].x + points[i + 1].x) / 2;
    path.bezierCurveTo(halfX, points[i].y, halfX, points[i + 1].y, points[i + 1].x, points[i + 1].y)
  }
  return path;
};

var BuildBezierCurve = function (points) {
  function buildPathFromPoints(points) {
    let res = "";
    for (let i = 0;i < points.length;i++) {
      if (i === 0) {
        res += "M";
      }
      else {
        res += "L";
      }
      res += points[i].x + "," + points[i].y;
    }
    return res;
  }
  if (points.length === 2) {
    return buildPathFromPoints(points);
  }
  let res = [];
  for (let i = 0;i < 101;i++) {
    let per = i / 100;
    let temp_points = [];
    for (let j = 0;j < points.length;j++) {
      temp_points[j] = [points[j].x, points[j].y];
    }
    let length = temp_points.length;
    while (length > 1) {
      length--;
      for (let j = 0;j < length;j++) {
        temp_points[j][0] = per * temp_points[j][0] + (1 - per) * temp_points[j + 1][0];
        temp_points[j][1] = per * temp_points[j][1] + (1 - per) * temp_points[j + 1][1];
      }
    }
    res[i] = {
      x: temp_points[0][0],
      y: temp_points[0][1]
    };
  }
  return buildPathFromPoints(res);
};

var BuildQuadraticCurve = function (points) {
  //points.sort(PointComparer);

  let path = d3.path();
  path.moveTo(points[0].x, points[0].y);

  let up = false;
  let down = false;
  for (let i = 0; i < points.length - 1; i++){
    /*if (points[i].y === points[i + 1].y){
      path.lineTo(points[i + 1].x, points[i + 1].y);
    }
    else /*if (points[i].x < points[i + 1].x)*/ //{
    //if (points[i].y < points[i + 1].y){
    //path.quadraticCurveTo(points[i + 1].x, points[i].y, points[i + 1].x, points[i + 1].y);
    //}
    /*else {
      path.quadraticCurveTo(points[i].x, points[i + 1].y, points[i + 1].x, points[i + 1].y);
    }*/
    //}*/
    if (points[i].y === points[i + 1].y){
      if (i + 2 < points.length && points[i + 1].y === points[i + 2].y){
        path.lineTo(points[i + 2].x, points[i + 2].y);
        i++;
      }
      else {
        path.lineTo(points[i + 1].x, points[i + 1].y);
      }
    }
    else if (i === 0 && points[i].y > points[i + 1].y){
      up = true;
      path.quadraticCurveTo(points[i + 1].x, points[i].y, points[i + 1].x, points[i + 1].y);
    }
    else if (i === 0 && points[i].y < points[i + 1].y){
      down = true;
      path.quadraticCurveTo(points[i + 1].x, points[i].y, points[i + 1].x, points[i + 1].y);
    }
    /*else if (up){
      path.quadraticCurveTo(points[i + 1].x, points[i].y, points[i + 1].x, points[i + 1].y);
    }
    else if(down){
      path.quadraticCurveTo(points[i + 1].x, points[i].y, points[i + 1].x, points[i + 1].y);
    }*/
    else{
      path.quadraticCurveTo(points[i + 1].x, points[i].y, points[i + 1].x, points[i + 1].y);
    }
  }

  return path;
};

export { BuildCubicBezierCurve, BuildQuadraticCurve, BuildBezierCurve }