import { convertDataTypes, getMaxValues } from './dataCalculations.js';
// Load the eye-tracking data from a CSV file
d3.dsv(';', 'eye_tracking_data.csv').then(function (data) {
  // Convert the data to the appropriate data types
  data = convertDataTypes(data);

  var lineData = [
    { index: 0, timeRed: 0, timeGreen: 0, timeBlue: 0, timePurple: 0 },
  ];

  //Get max x and y values.
  const { maxX, maxY } = getMaxValues(data);
  var timeRed = 0;
  var timeGreen = 0;
  var timeBlue = 0;
  var timePurple = 0;

  //Iterate over all datapoints and update time for each quadrant (the colors represent different quadrants).
  for (var i = 1; i < data.length; i++) {
    if (
      data[i]['GazePointX(px)'] < maxX / 2 &&
      data[i]['GazePointY(px)'] < maxY / 2
    ) {
      timeRed += data[i]['GazeEventDuration(mS)'];
    } else if (
      data[i]['GazePointX(px)'] >= maxX / 2 &&
      data[i]['GazePointY(px)'] < maxY / 2
    ) {
      timeGreen += data[i]['GazeEventDuration(mS)'];
    } else if (
      data[i]['GazePointX(px)'] < maxX / 2 &&
      data[i]['GazePointY(px)'] >= maxY / 2
    ) {
      timeBlue += data[i]['GazeEventDuration(mS)'];
    } else {
      timePurple += data[i]['GazeEventDuration(mS)'];
    }

    lineData.push({
      index: data[i].RecordingTimestamp / 1000,
      timeRed: timeRed / 1000,
      timeGreen: timeGreen / 1000,
      timeBlue: timeBlue / 1000,
      timePurple: timePurple / 1000,
    });
  }

  // set the dimensions and margins
  var margin = { top: 60, right: 30, bottom: 30, left: 60 },
    width = 800 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;

  var lineChart = d3
    .select('#lineChart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // Create scales for x and y axes
  var xScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(lineData, function (d) {
        return Math.max(d.index);
      }),
    ])
    .range([0, width]);

  var yScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(lineData, function (d) {
        return Math.max(d.timeRed, d.timeGreen, d.timeBlue, d.timePurple);
      }),
    ])
    .range([height, 0]);

  // Create line generators
  var lineRed = d3
    .line()
    .x(function (d) {
      return xScale(d.index);
    })
    .y(function (d) {
      return yScale(d.timeRed);
    });

  var lineGreen = d3
    .line()
    .x(function (d) {
      return xScale(d.index);
    })
    .y(function (d) {
      return yScale(d.timeGreen);
    });

  var lineBlue = d3
    .line()
    .x(function (d) {
      return xScale(d.index);
    })
    .y(function (d) {
      return yScale(d.timeBlue);
    });

  var linePurple = d3
    .line()
    .x(function (d) {
      return xScale(d.index);
    })
    .y(function (d) {
      return yScale(d.timePurple);
    });

  // Append path elements with line data bound to them
  lineChart
    .append('path')
    .datum(lineData)
    .attr('fill', 'none')
    .attr('stroke', 'red')
    .attr('stroke-width', 2)
    .attr('d', lineRed);

  lineChart
    .append('path')
    .datum(lineData)
    .attr('fill', 'none')
    .attr('stroke', 'green')
    .attr('stroke-width', 2)
    .attr('d', lineGreen);

  lineChart
    .append('path')
    .datum(lineData)
    .attr('fill', 'none')
    .attr('stroke', 'blue')
    .attr('stroke-width', 2)
    .attr('d', lineBlue);

  lineChart
    .append('path')
    .datum(lineData)
    .attr('fill', 'none')
    .attr('stroke', 'purple')
    .attr('stroke-width', 2)
    .attr('d', linePurple);

  // Create x-axis
  var xAxis = d3.axisBottom(xScale);
  lineChart
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

  // Create y-axis
  var yAxis = d3.axisLeft(yScale);
  lineChart.append('g').attr('class', 'y-axis').call(yAxis);
});
