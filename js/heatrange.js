import { convertDataTypes, getMaxValues } from './dataCalculations.js';
import { getColorScals } from './colors.js';

// Load the eye-tracking data from a CSV file
d3.dsv(';', 'eye_tracking_data.csv').then(function (data) {
  // Convert the data to the appropriate data types
  data = convertDataTypes(data);

  // set the dimensions and margins
  var margin = { top: 60, right: 30, bottom: 30, left: 60 },
    width = 900 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

  //Get max x and y values.
  const { maxX, maxY } = getMaxValues(data);

  //Get colorscales depending on quadrant.
  const { colorScale1, colorScale2, colorScale3, colorScale4 } =
    getColorScals(data);

  //Create the heatrange
  var heatrange = d3
    .select('#heatRange')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // Define the size and spacing of the squares
  var squareSize = 30;
  // Define the number of squares per row
  var squaresPerRow = Math.floor(width / squareSize);

  // Create a data table.
  var tableData = [
    { color: 'Red', value: 0 },
    { color: 'Blue', value: 0 },
    { color: 'Green', value: 0 },
    { color: 'Purple', value: 0 },
  ];
  var table = d3.select('table');

  // Create a header row with the column headings
  var header = table.append('thead').append('tr');
  header
    .selectAll('th')
    .data(['color', 'Value'])
    .enter()
    .append('th')
    .text(function (d) {
      return d;
    });

  // Create a row for each data point and populate with the values
  var rows = table
    .append('tbody')
    .selectAll('tr')
    .data(tableData)
    .enter()
    .append('tr');
  rows
    .selectAll('td')
    .data(function (d) {
      return [d.color, d.value];
    })
    .enter()
    .append('td')
    .text(function (d) {
      return d;
    });

  // Iterate over the FixationIndices and create a square for each with a delay
  var i = 0;
  var squares = heatrange
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', function (d, i) {
      // Calculate the x position of the square based on the FixationIndex
      var column = i % squaresPerRow;
      return column * squareSize;
    })
    .attr('y', function (d, i) {
      // Calculate the y position of the square based on the FixationIndex
      var row = Math.floor(i / squaresPerRow);
      return row * squareSize;
    })
    .attr('width', squareSize)
    .attr('height', squareSize);

  d3.interval(
    function () {
      if (i >= data.length) {
        // Stop the animation when all squares have been rendered
        return true;
      }

      squares
        .filter(function (d, j) {
          return j === i;
        }) // Select the square that corresponds to the current index
        .attr('fill', function (d) {
          if (
            d['GazePointX(px)'] < maxX / 2 &&
            d['GazePointY(px)'] < maxY / 2
          ) {
            tableData[0].value += 1;
            return colorScale1(d['GazeEventDuration(mS)']);
          } else if (
            d['GazePointX(px)'] >= maxX / 2 &&
            d['GazePointY(px)'] < maxY / 2
          ) {
            tableData[1].value += 1;
            return colorScale2(d['GazeEventDuration(mS)']);
          } else if (
            d['GazePointX(px)'] < maxX / 2 &&
            d['GazePointY(px)'] >= maxY / 2
          ) {
            tableData[2].value += 1;
            return colorScale3(d['GazeEventDuration(mS)']);
          } else {
            tableData[3].value += 1;
            return colorScale4(d['GazeEventDuration(mS)']);
          }
        })
        .transition()
        .duration(data[i]['GazeEventDuration(mS)'] / 2) // Set the transition duration
        .style('opacity', 1); // Fade in the square with an opacity transition

      // Update the table values
      rows
        .selectAll('td')
        .data(function (d) {
          return [d.color, d.value];
        })
        .text(function (d) {
          return d;
        });
      i++;
    },
    i === 0
      ? data[i].RecordingTimestamp
      : data[i].RecordingTimestamp - data[i - 1].RecordingTimestamp
  );
});
