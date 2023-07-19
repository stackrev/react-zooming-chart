import React, { PureComponent } from "react";
import createTrend from "trendline";
import {
  Label,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import { consultData } from "../../data/consults";
const trendData = () => {
  console.log(consultData);
  const roughton_trend = createTrend(consultData, "id", "roughton");
  const pyle_trend = createTrend(consultData, "id", "pyle");
  const hunter_trend = createTrend(consultData, "id", "hunter");
  console.log("trend", roughton_trend);
  return consultData.map((item) => {
    return {
      ...item,
      date: new Date(item.date).getTime() / 1000,
      roughton_trend: roughton_trend.calcY(item.id),
      pyle_trend: pyle_trend.calcY(item.id),
      hunter_trend: hunter_trend.calcY(item.id),
    };
  });
};

const dateFormatter = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString();
};

const getAxisYDomain = (from, to, ref, offset) => {
  const refData = consultData.slice(from - 1, to);
  let [bottom, top] = [refData[0][ref], refData[0][ref]];
  refData.forEach((d) => {
    if (d[ref] > top) top = d[ref];
    if (d[ref] < bottom) bottom = d[ref];
  });

  return [(bottom | 0) - offset, (top | 0) + offset];
};

const ConsultChart = () => {
  const [isRoughton, setRoughton] = useState(true);
  const [isPyle, setPyle] = useState(true);
  const [isHunter, setHunter] = useState(true);
  const [isTrend, setTrend] = useState(true);

  const [left, setLeft] = useState("dataMin");
  const [right, setRight] = useState("dataMax");
  const [refAreaLeft, setRefAreaLeft] = useState("");
  const [refAreaRight, setRefAreaRight] = useState("");
  const [top, setTop] = useState("dataMax+1");
  const [bottom, setBottom] = useState("dataMin-1");
  const [animation, setAnimation] = useState(true);
  const [data, setData] = useState(trendData());

  const zoom = () => {
    if (refAreaLeft === refAreaRight || refAreaRight === "") {
      setRefAreaLeft("");
      setRefAreaRight("");
      return;
    }

    // xAxis domain
    if (refAreaLeft > refAreaRight) {
      const temp = refAreaLeft;
      setRefAreaLeft(refAreaRight);
      setRefAreaRight(temp);
    }
    // yAxis domain
    // const { bottom, top } = this.state;
    // const [bottom, top] = getAxisYDomain(
    //   refAreaLeft,
    //   refAreaRight,
    //   "roughton",
    //   1
    // );

    setData(data.slice());
    setLeft(refAreaLeft);
    setRight(refAreaRight);
    setRefAreaLeft("");
    setRefAreaRight("");
  };

  const zoomOut = () => {
    setData(data.slice());
    setLeft("dataMin");
    setRight("dataMax");
    setRefAreaLeft("");
    setRefAreaRight("");
  };

  return (
    <div
      className="highlight-bar-charts"
      style={{ userSelect: "none", width: "100%" }}
    >
      <button type="button" className="btn update" onClick={zoomOut}>
        Zoom Out
      </button>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          width={800}
          height={400}
          data={data}
          onMouseDown={(e) => {
            if (e) setRefAreaLeft(e.activeLabel);
          }}
          onMouseMove={(e) => refAreaLeft && setRefAreaRight(e.activeLabel)}
          // eslint-disable-next-line react/jsx-no-bind
          onMouseUp={zoom}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            allowDataOverflow
            dataKey="date"
            domain={[left, right]}
            type="number"
            tickFormatter={dateFormatter}
          />
          <YAxis
            allowDataOverflow
            domain={[0, top]}
            type="number"
            yAxisId="1"
          />
          <Tooltip />
          {isRoughton && (
            <Line
              yAxisId="1"
              type="natural"
              dataKey="roughton"
              stroke="#8884d8"
              animationDuration={300}
            />
          )}
          {isRoughton && isTrend && (
            <Line
              yAxisId="1"
              type="natural"
              dataKey="roughton_trend"
              stroke="#8884ff"
              animationDuration={300}
            />
          )}
          {isPyle && (
            <Line
              yAxisId="1"
              type="natural"
              dataKey="pyle"
              stroke="#c884d8"
              animationDuration={300}
            />
          )}
          {isPyle && isTrend && (
            <Line
              yAxisId="1"
              type="natural"
              dataKey="pyle_trend"
              stroke="#c884ff"
              animationDuration={300}
            />
          )}
          {isHunter && (
            <Line
              yAxisId="1"
              type="natural"
              dataKey="hunter"
              stroke="#4884d8"
              animationDuration={300}
            />
          )}
          {isHunter && isTrend && (
            <Line
              yAxisId="1"
              type="natural"
              dataKey="hunter_trend"
              stroke="#4884ff"
              animationDuration={300}
            />
          )}

          {refAreaLeft && refAreaRight ? (
            <ReferenceArea
              yAxisId="1"
              x1={refAreaLeft}
              x2={refAreaRight}
              strokeOpacity={0.3}
            />
          ) : null}
        </LineChart>
      </ResponsiveContainer>
      <div>
        <label>
          <input
            type="checkbox"
            checked={isRoughton}
            onChange={(e) => setRoughton(e.target.checked)}
          />
          Roughton
        </label>
        <label>
          <input
            type="checkbox"
            checked={isPyle}
            onChange={(e) => setPyle(e.target.checked)}
          />
          Pyle
        </label>
        <label>
          <input
            type="checkbox"
            checked={isHunter}
            onChange={(e) => setHunter(e.target.checked)}
          />
          Hunter
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={isTrend}
            onChange={(e) => setTrend(e.target.checked)}
          />
          TrendLines
        </label>
      </div>
      <div></div>
    </div>
  );
};

export default ConsultChart;
