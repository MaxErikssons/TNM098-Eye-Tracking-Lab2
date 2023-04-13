import { convertDataTypes, getMaxValues } from './dataCalculations.js';
import { getColorScals } from './colors.js';
// Load the eye-tracking data from a CSV file
d3.dsv(';', 'eye_tracking_data.csv').then(function (data) {
  // Convert the data to the appropriate data types
  data = convertDataTypes(data);

  // set the dimensions and margins of the graph
  var margin = { top: 60, right: 30, bottom: 30, left: 60 },
    width = 800 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;

  //Get max x and y values.
  const { maxX, maxY } = getMaxValues(data);

  // Create a scatter plot
  var scatter = d3
    .select('#scatter')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var x = d3.scaleLinear().domain([0, maxX]).range([0, width]);

  var y = d3.scaleLinear().domain([0, maxY]).range([height, 0]);

  //Get colorscales depending on quadrant.
  const { colorScale1, colorScale2, colorScale3, colorScale4 } =
    getColorScals(data);

  // Iterate over the data and render one point at a time with a delay
  var i = 0;
  d3.interval(
    function () {
      if (i >= data.length) {
        // Stop the animation when all points have been rendered
        return true;
      }
      var d = data[i];
      // Render the circle with a transition
      scatter
        .append('circle')
        .attr('cx', function () {
          return x(d['GazePointX(px)']);
        })
        .attr('cy', function () {
          return y(d['GazePointY(px)']);
        })
        .attr('r', 5)
        .style('fill', function () {
          // Different color depending on which quadrant the point is located in.
          if (
            d['GazePointX(px)'] < maxX / 2 &&
            d['GazePointY(px)'] < maxY / 2
          ) {
            return colorScale1(d['GazeEventDuration(mS)']);
          } else if (
            d['GazePointX(px)'] >= maxX / 2 &&
            d['GazePointY(px)'] < maxY / 2
          ) {
            return colorScale2(d['GazeEventDuration(mS)']);
          } else if (
            d['GazePointX(px)'] < maxX / 2 &&
            d['GazePointY(px)'] >= maxY / 2
          ) {
            return colorScale3(d['GazeEventDuration(mS)']);
          } else {
            return colorScale4(d['GazeEventDuration(mS)']);
          }
        })
        .transition()
        .duration(d['GazeEventDuration(mS)'] / 2) // Set the transition duration
        .attr('r', 20) // Increase the radius of the circle to 20 pixels
        .transition()
        .duration(d['GazeEventDuration(mS)'] / 2)
        .attr('r', 5); // Decrease the radius back to 5 pixels

      i++;
    },
    i === 0
      ? data[i].RecordingTimestamp
      : data[i].RecordingTimestamp - data[i - 1].RecordingTimestamp
  ); // Set the interval delay

  // Add the X Axis
  scatter
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x));

  // Add X Axis label
  scatter
    .append('text')
    .attr('text-anchor', 'end')
    .attr('x', width)
    .attr('y', height + margin.top)
    .text('X');

  // Add the Y Axis
  scatter.append('g').call(d3.axisLeft(y));

  // Add Y Axis label
  scatter
    .append('text')
    .attr('text-anchor', 'end')
    .attr('y', -margin.left + 20)
    .text('Y');

  // Add midpoint lines
  scatter
    .append('g')
    .attr('class', 'midpoint')
    .append('line')
    .attr('x1', width / 2)
    .attr('y1', 0)
    .attr('x2', width / 2)
    .attr('y2', height)
    .style('stroke', 'black')
    .style('stroke-width', '2px');

  scatter
    .append('g')
    .attr('class', 'midpoint')
    .append('line')
    .attr('x1', 0)
    .attr('y1', height / 2)
    .attr('x2', width)
    .attr('y2', height / 2)
    .style('stroke', 'black')
    .style('stroke-width', '2px');
});
