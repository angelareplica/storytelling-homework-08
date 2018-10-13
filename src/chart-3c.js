import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }
var height = 400 - margin.top - margin.bottom
var width = 1080 - margin.left - margin.right

var svg = d3
  .select('#chart-3c')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let radius = 90

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
  'Sept',
  'Oct',
  'Nov',
  'Dec'
]

var angleScale = d3
  .scaleBand()
  .domain(months)
  .range([0, Math.PI * 2])

var colorScale = d3.scaleLinear().range(['lightblue', 'pink'])

var xPositionScale = d3
  .scalePoint()
  .range([0, width])
  .padding(0.25)

var arc = d3
  .arc()
  .innerRadius(d => radiusScale(+d.low_temp))
  .outerRadius(d => radiusScale(+d.high_temp))
  .startAngle(d => angleScale(d.month_name))
  .endAngle(d => angleScale(d.month_name) + angleScale.bandwidth())

d3.csv(require('./data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  var nested = d3
    .nest()
    .key(d => d.city)
    .entries(datapoints)

  var highTemps = datapoints.map(function(d) {
    return +d.high_temp
  })

  var maxTemp = d3.max(highTemps)
  var minTemp = d3.min(highTemps)

  colorScale.domain([minTemp, maxTemp])

  console.log('datapoints looks like', datapoints)
  console.log('nested looks like', nested)

  var cities = datapoints.map(d => d.city)

  xPositionScale.domain(cities)

  svg
    .selectAll('.radial-bar-multiple')
    .data(nested)
    .enter()
    .append('g')
    .attr('class', 'radial-bar-multiple')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .attr('transform', function(d) {
      return `translate(${xPositionScale(d.key)}, 200)`
    })
    .each(function(d) {
      let svg = d3.select(this)
      // console.log('d looks like', d)

      svg
        .selectAll('path')
        .data(d.values)
        .enter()
        .append('path')
        .attr('d', d => arc(d))
        .attr('fill', d => colorScale(d.high_temp))
      // .attr('x', function(d) {
      //   return xPositionScale(d.key)
      // })

      svg
        .selectAll('text')
        .data(d.values)
        .enter()
        .append('text')
        .text(function(d) {
          console.log(d)
          return d.city
        })
        .attr('x', 0)
        .attr('y', radius + 40)
        .attr('text-anchor', 'middle')

      svg
        .append('circle')
        .attr('r', 2)
        .attr('cx', 0)
        .attr('cy', 0)
    })
}
