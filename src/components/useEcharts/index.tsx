import { useEffect } from 'react';
import * as echarts from 'echarts';

const useECharts = (chartRef, config, loading) => {
  let chartInstance = null;

  const renderChart = () => {
    const renderedInstance = echarts.getInstanceByDom(chartRef.current);
    if (renderedInstance) {
      chartInstance = renderedInstance;
    } else {
      chartInstance = echarts.init(chartRef.current);
    }
    if (loading) {
      chartInstance.showLoading();
    } else {
      chartInstance.hideLoading();
    }
    chartInstance.setOption(config);
  };

  useEffect(() => {
    renderChart();
  }, [config]);

  // 单独处理 return ？
  useEffect(() => {
    return () => {
      chartInstance && chartInstance.dispose();
    };
  }, []);
};

export default useECharts;
