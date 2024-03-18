import { LineChart } from "./Charts";
import "./MultiKPISeriesChart.css";

function getRandomHSLColor() {
  const hue = Math.floor(Math.random() * 360); // Random hue value between 0 and 359
  const saturation = Math.floor(Math.random() * 21) + 40; // Random saturation value between 40 and 60
  const lightness = Math.floor(Math.random() * 21) + 40; // Random lightness value between 40 and 60
  return `hsl(${hue},${saturation}%,${lightness}%)`;
}

const MultiKPISeriesChart = ({ dataSets, models }) => {
  const maxDataPoints = Math.max(...dataSets.map(dataSet => dataSet.length));

  const paddedDataSets = dataSets.map(dataSet => {
    const paddingLength = maxDataPoints - dataSet.length;
    const paddedData = [...dataSet, ...Array(paddingLength).fill(0)];
    return paddedData;
  });

  return (
    <div className="multi-kpi-chart-container">
      {paddedDataSets.map((dataSet, index) => (
        <div className="chart-item" key={index}>
          <LineChart
            data={dataSet}
            label={models[index]}
            backgroundColor={dataSets[index].backgroundColor}
            borderColor={getRandomHSLColor()}
            labels={dataSets[index].labels}
          />
          <h2>{models[index]}</h2>
        </div>
      ))}
    </div>
  );
};

export default MultiKPISeriesChart;
