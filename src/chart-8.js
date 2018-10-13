import * as d3 from 'd3'

let margin = { top: 20, left: 0, right: 0, bottom: 0 }
let height = 450 - margin.top - margin.bottom
let width = 450 - margin.left - margin.right

let svg = d3
  .select('#chart-8')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let radius = 200

let radiusScale = d3
  .scaleLinear()
  .domain([0, 1])
  .range([0, radius])

let categories = [
  'Minutes Played',
  'Points',
  'Field Goals',
  '3 Pointers',
  'Free Throws',
  'Rebounds',
  'Assists',
  'Steals',
  'Blocks'
]
var maxMinutes = 60
var maxPoints = 30
var maxField = 10
var maxP = 5
var maxFreeThrows = 10
var maxRebounds = 15
var maxAssists = 10
var maxSteals = 5
var maxBlocks = 5

let angleScale = d3
  .scaleBand()
  .domain(categories)
  .range([0, Math.PI * 2])

var line = d3
  .radialLine()
  .radius(d => radiusScale(d.value))
  .angle(d => angleScale(d.name))

d3.csv(require('./data/nba.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  let player = datapoints[0]

  console.log(datapoints)

  var holder = svg
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  // turning each column into multiple datapoints
  let customDatapoints = [
    { name: 'Minutes Played', value: player.MP / maxMinutes },
    { name: 'Points', value: player.PTS / maxPoints },
    { name: 'Field Goals', value: player.FG / maxField },
    { name: '3 Pointers', value: player['3P'] / maxP },
    { name: 'Free Throws', value: player.FT / maxFreeThrows },
    { name: 'Rebounds', value: player.TRB / maxRebounds },
    { name: 'Assists', value: player.AST / maxAssists },
    { name: 'Steals', value: player.STL / maxSteals },
    { name: 'Blocks', value: player.BLK / maxBlocks }
  ]
  console.log(customDatapoints)

  // adding the colored bands

  let bands = [0.2, 0.4, 0.6, 0.8, 1]

  holder
    .selectAll('.colored-bands')
    .data(bands)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(d))
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('fill', (d, i) => {
      if (i % 2 === 0) {
        return '#c94435'
      } else {
        return '#FFB81C'
      }
      // console.log('Looking at circle number', i)
    })
    .attr('mask', 'url(#lebron)')
    .lower()

  // adding in white/grey bands underneath
  holder
    .selectAll('.background-bands')
    .data(bands)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(d))
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('fill', (d, i) => {
      if (i % 2 === 0) {
        return '#e8e7e5'
      } else {
        return '#f6f6f6'
      }
    })
    .lower()

  // adding the text on the outside
  holder
    .selectAll('.angle-text')
    .data(customDatapoints)
    .enter()
    .append('text')
    .text(d => d.name)
    .attr('text-anchor', 'middle')
    .attr('x', 0)
    .attr('y', -radiusScale(1.03))
    .attr('transform', d => {
      console.log(d)
      return `rotate(${(angleScale(d.name) / Math.PI) * 180})`
    })
    .attr('font-weight', '500')

  // adding the area/mask
  holder
    .append('mask')
    .attr('id', 'lebron')
    .append('path')
    .datum(customDatapoints)
    .attr('d', line)
    .attr('fill', 'white')

  // adding the center black dot
  holder
    .append('circle')
    .attr('r', 4)
    .attr('stroke', 'black')
    .attr('cx', 0)
    .attr('cy', 0)

  // adding the numbers for each category
  // console.log(customDatapoints)
  // holder
  //   .selectAll('.category-numbers')
  //   .data(customDatapoints)
  //   .enter()
  //   .append('text')
  //   .text(d => d.value)

  holder
    .append('text')
    .text('Not finished with this yet but will update soon!')
    .attr('x', 0)
    .attr('y', 0)
    .attr('text-anchor', 'middle')
}
