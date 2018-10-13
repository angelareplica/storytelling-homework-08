import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }
var height = 400 - margin.top - margin.bottom
var width = 780 - margin.left - margin.right

var svg = d3
  .select('#chart-4')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let radius = 175

let radiusScale = d3
  .scaleLinear()
  .domain([0, 90])
  .range([10, radius])

let months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec'
]

var angleScale = d3
  .scaleBand()
  .domain(months)
  .range([0, Math.PI * 2])

var line = d3
  .radialArea()
  .innerRadius(d => radiusScale(d.low_temp))
  .outerRadius(d => radiusScale(d.high_temp))
  .angle(d => angleScale(d.month_name))
// .curve(d3.curveBasis)

d3.csv(require('./data/ny-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  datapoints.push(datapoints[0])

  var holder = svg
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  holder
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'lightblue')
    .attr('opacity', 0.7)
    .attr('stroke', 'none')

  let bands = [20, 30, 40, 50, 60, 70, 80, 90]

  holder
    .selectAll('.scale-band')
    .data(bands)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(d))
    .attr('fill', 'none')
    .attr('stroke', 'darkgrey')
    .attr('cx', 0)
    .attr('cy', 0)
    .lower()

  holder
    .selectAll('text')
    .data(datapoints)
    .enter()
    .append('text')
    .text('NYC')
    .attr('x', 0)
    .attr('y', 0)
    .attr('font-size', 25)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('font-weight', '600')

  let bandLabels = [30, 50, 70, 90]

  holder
    .selectAll('.scale-text')
    .data(bandLabels)
    .enter()
    .append('text')
    .text(d => d + '°')
    .attr('text-anchor', 'middle')
    .attr('font-size', 10)
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('dy', -3)
}
