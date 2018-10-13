import * as d3 from 'd3'

var margin = { top: 30, left: 90, right: 90, bottom: 30 }
var height = 400 - margin.top - margin.bottom
var width = 780 - margin.left - margin.right

var svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`)

var pie = d3
  .pie()
  .value(function(d) {
    return d.minutes
  })
  .sort(null)

var radius = 90

var arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius)

var xPositionScale = d3
  .scalePoint()
  .range([0, width])
  .padding(0)

var colorScale = d3.scaleOrdinal().range(['#FE8A7E', '#FFC1B3', '#FFC85F'])

d3.csv(require('./data/time-breakdown-all.csv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

function ready(datapoints) {
  var nested = d3
    .nest()
    .key(d => d.project)
    .entries(datapoints)

  console.log('datapoints looks like', datapoints)
  console.log('nested looks like', nested)

  var names = datapoints.map(d => d.project)

  xPositionScale.domain(names)

  svg
    .selectAll('.pie-multiple')
    .data(nested)
    .enter()
    .append('g')
    .attr('class', 'pie-multiple')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .attr('transform', function(d) {
      return `translate(${xPositionScale(d.key)}, 200)`
    })
    .each(function(d) {
      let svg = d3.select(this)
      console.log('d looks like', d)
      svg
        .selectAll('path')
        .data(pie(d.values))
        .enter()
        .append('path')
        .attr('d', d => arc(d))
        .attr('fill', d => colorScale(d.data.task))
      // .attr('x', function(d) {
      //   return xPositionScale(d.key)
      // })

      svg
        .selectAll('text')
        .data(pie(d.values))
        .enter()
        .append('text')
        .text(function(d) {
          // console.log(d)
          return d.data.project
        })
        .attr('x', 0)
        .attr('y', radius + 40)
        .attr('text-anchor', 'middle')
    })
}
