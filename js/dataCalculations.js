// Convert the data to the appropriate data types
export function convertDataTypes(data) {
  data.forEach((d) => {
    d.RecordingTimestamp = +d.RecordingTimestamp;
    d.FixationIndex = +d.FixationIndex;
    d['GazeEventDuration(mS)'] = +d['GazeEventDuration(mS)'];
    d.GazePointIndex = +d.GazePointIndex;
    d['GazePointX(px)'] = +d['GazePointX(px)'];
    d['GazePointY(px)'] = +d['GazePointY(px)'];
  });
  return data;
}

export function getMaxValues(data) {
  var maxX = d3.max(data, function (d) {
    return d['GazePointX(px)'];
  });
  var maxY = d3.max(data, function (d) {
    return d['GazePointY(px)'];
  });

  return { maxX, maxY };
}
