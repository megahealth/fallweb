import React, { useEffect } from 'react';
import * as echarts from 'echarts';

const useECharts = (chartRef, config) => {
  let chartInstance = null;

  function renderChart() {
    const renderedInstance = echarts.getInstanceByDom(chartRef.current);
    if (renderedInstance) {
      chartInstance = renderedInstance;
    } else {
      chartInstance = echarts.init(chartRef.current);
    }
    chartInstance.setOption(config);
  }

  useEffect(() => {
    setTimeout(() => {
      renderChart();
    });
  }, [config]);

  // 单独处理 return ？
  useEffect(() => {
    return () => {
      chartInstance && chartInstance.dispose();
    };
  }, []);

  return;
};

export default useECharts;
