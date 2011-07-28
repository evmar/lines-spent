var data = [];
var baseline = 0;
var min = 0, max = 0;
for (var i = 0; i < kData.changes.length; ++i) {
  var commit = kData.changes[i];

  if (commit.add > 1000)
    continue;
  if (commit.del > 1000)
    continue;

  commit.baseline = baseline;
  data.push(commit);
  if (baseline - commit.del < min)
    min = baseline - commit.del;
  if (baseline + commit.add > max)
    max = baseline + commit.add;

  baseline += commit.add - commit.del;
}

var bargirth = 8;
var margin = 0;
var labelheight = 10;
var labelmargin = 2;
var w = 300;
var h = data.length * (bargirth + 4) + (margin * 2);

max = Math.max(max, -min);
var x = d3.scale.linear()
  .domain([-max, max])
  .range([margin, w - margin]);
var y = d3.scale.linear()
  .domain([0, data.length])
  .range([margin + labelheight + labelmargin, h - margin - labelheight - labelmargin]);

var vis = d3.select('#vis')
  .append('svg:svg')
    .attr('width', w)
    .attr('height', h)
;

var ticks = vis.selectAll('text.tick')
    .data(x.ticks(5))
;
ticks.enter().append('svg:text')
    .attr('class', 'tick')
    .attr('x', x)
    .attr('y', y(0) - labelmargin)
    .attr('text-anchor', 'middle')
    .text(String)
;
ticks.enter().append('svg:text')
    .attr('class', 'tick')
    .attr('x', x)
    .attr('y', y(data.length) + labelmargin)
    .attr('dy', '0.8em')
    .attr('text-anchor', 'middle')
    .text(String)
;

ticks = vis.selectAll('line.tick')
    .data(x.ticks(5));
ticks.enter().append('svg:line')
  .attr('x1', x)
  .attr('x2', x)
  .attr('y1', y(0))
  .attr('y2', y(data.length))
  .style('stroke', function(d) { return d == 0 ? 'black' : 'lightgray'; })
;


var commitbox = vis.append('svg:g');

var commits = commitbox.selectAll('.commit')
    .data(data)
  .enter().append('svg:g')
    .attr('transform', function(d, i) { return 'translate(0,' + y(i) + ')'; })
;

commits.append('svg:rect')
  .attr('class', 'positive')
  .attr('height', bargirth)
  .attr('x', function(d) { return x(d.baseline); })
  .attr('y', 0)
  .attr('width', function(d) { return Math.abs(x(d.baseline + d.add) - x(d.baseline)); })
;

commits.append('svg:rect')
  .attr('class', 'negative')
  .attr('height', bargirth)
  .attr('x', function(d) { return x(d.baseline - d.del); })
  .attr('y', 0)
  .attr('width', function(d) { return Math.abs(x(d.baseline - d.del) - x(d.baseline)); })
;

commits.append('svg:title')
  .text(function(d) { return d.text; })
;
