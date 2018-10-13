import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }

var height = 450 - margin.top - margin.bottom

var width = 1080 - margin.left - margin.right

var svg = d3
  .select('#chart-5')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let radius = 80

let radiusScale = d3
  .scaleLinear()
  .domain([0, 90])
  .range([30, radius])

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

var xPositionScale = d3
  .scalePoint()
  .range([0, width])
  .padding(0.35)

var line = d3
  .radialArea()
  .innerRadius(d => radiusScale(d.low_temp))
  .outerRadius(d => radiusScale(d.high_temp))
  .angle(d => angleScale(d.month_name))

d3.csv(require('./data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  // datapoints.push(datapoints[0])

  var nested = d3
    .nest()
    .key(d => d.city)
    .entries(datapoints)

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
      // fix the breaks between Dec/Jan in the shapes
      d.values.push(d.values[0])

      let holder = d3.select(this)

      let bands = [20, 40, 60, 80, 100]

      let bandLabels = [20, 60, 100]

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

      holder
        .append('path')
        .datum(d.values)
        .attr('d', line)
        .attr('fill', '#BF466F')
        .attr('opacity', 0.3)
        .attr('stroke', 'none')

      holder
        .selectAll('text')
        .data(d.values)
        .enter()
        .append('text')
        .text(function(d) {
          console.log(d)
          return d.city
        })
        .attr('x', 0)
        .attr('y', 0)
        .attr('text-anchor', 'middle')
    })
  // .attr('font-size', 13)

  svg
    .append('text')
    .text('Average Monthly Temperatures')
    .attr('font-weight', '600')
    .attr('text-anchor', 'middle')
    .attr('font-size', 30)
    .attr('y', height / 10)
    .attr('x', width / 2)

  svg
    .append('text')
    .text('in cities around the world')
    .attr('text-anchor', 'middle')
    .attr('font-size', 20)
    .attr('y', height / 6)
    .attr('x', width / 2)
}
