import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }
var height = 400 - margin.top - margin.bottom
var width = 780 - margin.left - margin.right

var svg = d3
  .select('#chart-3')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let radius = 200

  let radiusScale = d3
    .scaleLinear()
    .domain([0, 90])
    .range([0, radius])

let months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]
  
var angleScale = d3
  .scaleBand()
  .domain(months)
  .range([0, Math.PI * 2])

var colorScale = d3
  .scaleLinear()
  .domain([0, 90])
  .range(['lightblue', 'pink'])

var arc = d3
  .arc()
  .innerRadius(d => radiusScale(0))
  .outerRadius(d => radiusScale(+d.high_temp))
  .startAngle(d => angleScale(d.month_name))
  .endAngle(d => angleScale(d.month_name) + angleScale.bandwidth())


d3.csv(require('./data/ny-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {

  // datapoints.push(datapoints[0])

  var holder = svg
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  holder
    .selectAll('.temp-bar')
    .data(datapoints)
    .enter()
    .append('path')
    .attr('d', d => arc(d))
    .attr('fill', d => colorScale(+d.high_temp))
  
  console.log(datapoints)

  holder
    .append('circle')
    .attr('r', 3)
    .attr('cx', 0)
    .attr('cy', 0)

  holder
    .append('text')
    .text('NYC high temperatures, by month')
    .attr("font-weight", "600")
    .attr('text-anchor', 'middle')
    .attr('font-size', 30)
    .attr('y', -150)


}
