import * as d3 from 'd3'

var margin = { top: 0, left: 0, right: 0, bottom: 0 }
var height = 600 - margin.top - margin.bottom
var width = 600 - margin.left - margin.right

var svg = d3
  .select('#chart-7')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let parseTime = d3.timeParse('%H:%M')

let radius = 300

let radiusScale = d3
  .scaleLinear()
  .domain([0, 90000])
  .range([0, radius])

let angleScale = d3.scaleBand().range([0, Math.PI * 2])

// let colorScale = d3
//   .scaleLinear()
//   .domain([0, 90000])
//   .range(['blue', 'red'])

let colorScaleBelow = d3.scaleSequential(d3.interpolateCool).domain([0, 90000])

let colorScaleAbove = d3.scaleSequential(d3.interpolateOrRd).domain([0, 90000])

var line = d3
  .radialArea()
  .innerRadius(radiusScale(40000))
  .outerRadius(d => radiusScale(d.total))
  .angle(d => angleScale(d.time))
  .curve(d3.curveBasis)

d3.csv(require('./data/time-binned.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  datapoints.push(datapoints[0])

  var times = datapoints.map(d => d.time)
  angleScale.domain(times)

  var holder = svg
    .append('g')
    .attr('transform', `translate( ${width / 2},${height / 2})`)

  holder
    .append('mask')
    .attr('id', 'births')
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'white')
  // .attr('opacity', 0.5)

  var times2 = [
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00'
  ]

  // adding the color bands

  let bands = d3.range(0, 80000, 1000)

  holder
    .selectAll('.scale-band')
    .data(bands)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(d))
    .attr('fill', function(d) {
      if (d <= 40000) {
        return colorScaleBelow(d)
      } else {
        return colorScaleAbove(d)
      }
    })
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('mask', 'url(#births)')
    .lower()

  // adding the outer ring of times
  holder
    .selectAll('.time-text')
    .data(times2)
    .enter()
    .append('text')
    .text(function(d) {
      if (d === '00:00') {
        return 'Midnight'
      } else {
        return d.replace(':00', '')
      }
    })
    // .text(d => d.replace(':00', ''))
    .attr('text-anchor', 'middle')
    .attr('x', 0)
    .attr('y', -radiusScale(60000))
    .attr('transform', d => {
      return `rotate(${(angleScale(d) / Math.PI) * 180})`
    })
    .attr('fill', 'silver')
    .lower()

  // adding the outer points/dots
  holder
    .selectAll('.time-points')
    .data(times2)
    .enter()
    .append('circle')
    .attr('r', 4)
    .attr('cx', 0)
    .attr('cy', -radiusScale(65000))
    .attr('transform', d => {
      return `rotate(${(angleScale(d) / Math.PI) * 180})`
    })
    .attr('fill', 'silver')
    .attr('stroke', 'white')
    .attr('stroke-width', 3)
    .lower()

  // adding the outer ring

  holder
    .append('circle')
    .attr('fill', 'none')
    .attr('stroke', 'silver')
    .attr('stroke-width', 2)
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', radiusScale(65000))
    .lower()

  // adding center text
  holder
    .append('text')
    .attr('x', 0)
    .attr('y', 0)
    .text('EVERYONE!')
    .attr('text-anchor', 'middle')
    .attr('font-weight', 600)
    .attr('font-size', 25)
  holder
    .append('text')
    .attr('x', 0)
    .attr('y', 22)
    .text('is born at 8 am')
    .attr('text-anchor', 'middle')
    .attr('font-weight', 600)
    .attr('font-size', 15)
  holder
    .append('text')
    .attr('x', 0)
    .attr('y', 45)
    .text('(read Macbeth for details)')
    .attr('text-anchor', 'middle')
    .attr('font-size', 10)
}
