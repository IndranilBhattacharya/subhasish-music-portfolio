const useNumberFormat = (value: number): string => {
  const f = Math.floor;
  const valueOnBScale = value / 100_00_00_000;
  if (f(valueOnBScale) >= 1) {
    return `${valueOnBScale.toFixed(1)}B`;
  }
  const valueOnMScale = value / 10_00_000;
  if (f(valueOnMScale) >= 1) {
    return `${valueOnMScale.toFixed(1)}M`;
  }
  const valueOnKScale = value / 1000;
  if (f(valueOnKScale) >= 1) {
    return `${valueOnKScale.toFixed(1)}K`;
  }
  return `${value}`;
};

export default useNumberFormat;
