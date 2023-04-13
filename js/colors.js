export function getColorScals(data) {
  // Define the color scale for each quadrant
  var colorScale1 = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function (d) {
        return d['GazeEventDuration(mS)'] / 5;
      }),
    ])
    .range(['white', 'red']);

  var colorScale2 = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function (d) {
        return d['GazeEventDuration(mS)'] / 5;
      }),
    ])
    .range(['white', 'green']);

  var colorScale3 = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function (d) {
        return d['GazeEventDuration(mS)'] / 5;
      }),
    ])
    .range(['white', 'blue']);

  var colorScale4 = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function (d) {
        return d['GazeEventDuration(mS)'] / 5;
      }),
    ])
    .range(['white', 'purple']);

  return { colorScale1, colorScale2, colorScale3, colorScale4 };
}
