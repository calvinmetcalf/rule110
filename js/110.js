var rootWidth = 40;

var baseWidth = rootWidth * 14 * 2;;
var baseHeight = 1600;
var width;
var ctx,canvas;
var imageWidth;
var pattern = '10001001101111';

var lookup = {
  true:{
    true:{
      true:false,
      false:true
    },
    false:{
      true:true,
      false:false
    }
  },
  false:{
    true:{
      true:true,
      false:true
    },
    false:{
      true:true,
      false:false
    }
  }
};
var spaceshipA = {
  pattern: '0001110111',
  index: 1
}
var spaceshipC = {
  pattern: '1101001101',
  index:11
};
var spaceshipB = {
  pattern: '0011000',
  index: 6
}
var spaceshipD = {
  pattern: '0001101',
  index: 1
}
function setSpaceship(d, idx, pattern) {
  var i = -1;
  while (++i < pattern.length) {
    setValue(d, idx + i, pattern[i] === '1')
  }
}
function setTopRow(spaceShips) {
  var imageHeight = canvas.height/4;
  var row = getRow(0);
  var i = 0;
  var patternPlace = 0;
  var d = new Uint32Array(row.data.buffer);
  var iter = 0;
  while (i < imageWidth) {
    setValue(d, i, pattern[patternPlace] === '1')
    i++;
    patternPlace++;
    if (patternPlace === 14) {
      patternPlace = 0;
      iter++;
    }
    if (spaceShips[iter] && patternPlace === spaceShips[iter].index) {
      setSpaceship(d, i, spaceShips[iter].pattern)
      i += spaceShips[iter].pattern.length
    }
  }
  //setSpaceship(d, 1, spaceshipA);
  // setSpaceship(d, imageWidth - 100, spaceshipB);
  setRow(0, row);
  let prev = d;
  i = 0;
  while (i++ < imageHeight) {
    prev = setNextRow(prev, i)
  }
}
function setNextRow(prev, num) {
  var next = getRow(num);
  var nextBuff = new Uint32Array(next.data.buffer);
  var i = -1;
  var prevVal = getValue(prev, imageWidth - 1);
  var _cur = getValue(prev, 0);
  var cur = _cur;
  var nextVal;
  while (++i < imageWidth) {
    if (i === imageWidth) {
      nextVal = _cur;
    } else {
      nextVal = getValue(prev, i + 1);
    }
    let outVal = lookup[prevVal][cur][nextVal];
    setValue(nextBuff, i, outVal);
    prevVal = cur;
    cur = nextVal;
  }
  setRow(num, next);
  return nextBuff;
}
function start() {
  // var ships = {
  //   169: spaceshipA,
  //   11: spaceshipC,
  //   x: spaceshipD
  // };
  var ships = {
    1: spaceshipA,
    //7: spaceshipC,
   14: spaceshipB,
  4: spaceshipD
  };
  var extra = Object.keys(ships).reduce((acc, key)=>ships[key].pattern.length * 4 + acc, 0);
  canvas = document.createElement('canvas');
  width = baseWidth + extra
  canvas.height = baseHeight;
  canvas.width = width;
  imageWidth = width/4;
  // ships[imageWidth-24] = ships.x;
  life.appendChild(canvas);
  ctx = canvas.getContext('2d');
  setTopRow(ships);
}
start();
function setValue(data, col, active) {
  var val = 0;
  if (active) {
    val = 4294967295;
  }

  var offset = col*4;
  data[offset] = val;
  data[offset + width] = val;
  data[offset + width * 2] = val;
  data[offset + width * 3] = val;
  offset++;
  data[offset] = val;
  data[offset + width] = val;
  data[offset + width * 2] = val;
  data[offset + width * 3] = val;
  offset++;
  data[offset] = val;
  data[offset + width] = val;
  data[offset + width * 2] = val;
  data[offset + width * 3] = val;
  offset++;
  data[offset] = val;
  data[offset + width] = val;
  data[offset + width * 2] = val;
  data[offset + width * 3] = val;
}
function getValue(data, col) {
  return data[col * 4] !== 0;
}
function getRow(row) {
  return ctx.getImageData(0, row * 4, width, 4);
}
function setRow(row, data) {
  ctx.putImageData(data, 0, row * 4);
}
