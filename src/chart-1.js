import * as d3 from 'd3'

var margin = { top: 10, left: 100, right: 10, bottom: 10 }
var height = 400 - margin.top - margin.bottom
var width = 780 - margin.left - margin.right

// At the very least you'll need scales, and
// you'll need to read in the file. And you'll need
// and svg, too, probably.

var svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var pie = d3.pie().value(function(d) {
  return d.minutes // make the slices proportional to the minutes column
})

var radius = 175

var arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius)
  
var labelArc = d3 
  .arc()
  .innerRadius(radius + 10)
  .outerRadius(radius + 10)

var colorScale = d3.scaleOrdinal().range(['#FE8A7E', '#FFC1B3', '#FFC85F'])

d3.csv(require('./data/time-breakdown.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))


function ready(datapoints) {

  var container = svg.append('g').attr('transform', 'translate(200,200)')

  container
    .selectAll('path')
    .data(pie(datapoints)) 
    .enter()
    .append('path')
    .attr('d', d => arc(d))
    .attr('fill', d => colorScale(d.data.task)) // color based on the task category

  container
    .selectAll('text')
    .data(pie(datapoints))
    .enter()
    .append('text')
    .text(function(d) { return d.data.task})
    .attr('transform', function(d) {
      return 'translate(' + labelArc.centroid(d) + ')'
    })
    .attr("text-anchor", function(d) {
    	if(d.startAngle > Math.PI) {
    	  return "end"
    	} else {
    	  return "start"
    	}
    })
}
