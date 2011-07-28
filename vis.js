var data = [];
var baseline = 0;
var min = 0, max = 0;
for (var i = 0; i < kData.length; ++i) {
  var commit = kData[i][0], msg = kData[i][1],
      plus = kData[i][2], minus = kData[i][3];

  if (plus == minus)
    continue;

  data.push({text: msg, y: baseline, plus: plus, minus: minus});
  if (baseline - minus < min)
    min = baseline - minus;
  if (baseline + plus > max)
    max = baseline + plus;

  baseline += plus - minus;
}

var barwidth = 8;
var margin = 10;
var labelwidth = 20;
var labelmargin = 2;
var w = data.length * (barwidth + 4) + (margin * 2);
var h = 150;

var x = d3.scale.linear()
  .domain([0, data.length])
  .range([margin + labelwidth + labelmargin, w - margin - labelwidth - labelmargin]);
var y = d3.scale.linear()
  .domain([min, max])
  .range([h - margin, margin]);

var vis = d3.select('#chart')
  .append('svg:svg')
    .attr('width', w)
    .attr('height', h)
;

var commitbox = vis.append('svg:g');

var commits = commitbox.selectAll('.commit')
    .data(data)
  .enter().append('svg:g')
    .attr('transform', function(d, i) { return 'translate(' + x(i) + ',0)'; })
;

commits.append('svg:rect')
  .attr('class', 'positive')
  .attr('width', barwidth)
  .attr('x', 0)
  .attr('y', function(d) { return y(d.y + d.plus); })
  .attr('height', function(d) { return Math.abs(y(d.y + d.plus) - y(d.y)); })
;

commits.append('svg:rect')
  .attr('class', 'negative')
  .attr('width', barwidth)
  .attr('x', 0)
  .attr('y', function(d) { return y(d.y); })
  .attr('height', function(d) { return Math.abs(y(d.y - d.minus) - y(d.y)); })
;

commits.append('svg:title')
  .text(function(d) { return d.text; })
;

vis.append('svg:line')
  .attr('x1', x(0))
  .attr('x2', x(data.length))
  .attr('y1', y(0))
  .attr('y2', y(0))
  .style('stroke', 'black');

var ticks = vis.selectAll('text.tick')
    .data(y.ticks(5))
;
ticks.enter().append('svg:text')
    .attr('class', 'tick')
    .attr('x', x(0) - labelmargin)
    .attr('y', y)
    .attr('dy', 3)
    .attr('text-anchor', 'end')
    .text(d3.format('+'))
;
ticks.enter().append('svg:text')
    .attr('class', 'tick')
    .attr('x', x(data.length) + labelmargin)
    .attr('y', y)
    .text(d3.format('+'))
;
