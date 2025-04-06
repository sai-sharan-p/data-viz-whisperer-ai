
import { DataRow, ProcessedData } from './fileProcessing';

export interface DataSummary {
  variable: string;
  type: 'numeric' | 'categorical' | 'date';
  stats: {
    [key: string]: any;
  };
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  importance: number; // 1-10 scale
}

export interface VisualizationData {
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'heatmap' | 'box' | 'histogram';
  title: string;
  description: string;
  xAxis?: string;
  yAxis?: string;
  data: any[];
}

export const analyzeDataset = (
  processedData: ProcessedData, 
  targetVariable: string
): {
  summaries: DataSummary[];
  insights: Insight[];
  visualizations: VisualizationData[];
} => {
  const { data, summary } = processedData;
  
  const summaries: DataSummary[] = [];
  const insights: Insight[] = [];
  const visualizations: VisualizationData[] = [];
  
  // Determine target variable type
  const targetType = 
    summary.numericColumns.includes(targetVariable) ? 'numeric' :
    summary.dateColumns.includes(targetVariable) ? 'date' : 'categorical';
  
  // Create summary for the target variable
  summaries.push(createVariableSummary(data, targetVariable, targetType));
  
  // Create summaries for other variables and their relationship with target
  processedData.headers
    .filter(header => header !== targetVariable)
    .forEach(variable => {
      const varType = 
        summary.numericColumns.includes(variable) ? 'numeric' :
        summary.dateColumns.includes(variable) ? 'date' : 'categorical';
      
      summaries.push(createVariableSummary(data, variable, varType));
      
      // Analyze relationship with target variable
      const relationship = analyzeRelationship(data, variable, varType, targetVariable, targetType);
      
      if (relationship.insight) {
        insights.push(relationship.insight);
      }
      
      if (relationship.visualization) {
        visualizations.push(relationship.visualization);
      }
    });
  
  // Generate additional insights based on the data and summaries
  const additionalInsights = generateAdditionalInsights(data, summaries, targetVariable);
  insights.push(...additionalInsights);
  
  // Generate additional visualizations
  const additionalVisualizations = generateAdditionalVisualizations(data, targetVariable, targetType);
  visualizations.push(...additionalVisualizations);
  
  // Sort insights by importance
  insights.sort((a, b) => b.importance - a.importance);
  
  return {
    summaries,
    insights: insights.slice(0, 5), // Return top 5 insights
    visualizations: visualizations.slice(0, 5) // Return top 5 visualizations
  };
};

const createVariableSummary = (
  data: DataRow[], 
  variable: string, 
  type: 'numeric' | 'categorical' | 'date'
): DataSummary => {
  if (type === 'numeric') {
    return createNumericSummary(data, variable);
  } else if (type === 'date') {
    return createDateSummary(data, variable);
  } else {
    return createCategoricalSummary(data, variable);
  }
};

const createNumericSummary = (data: DataRow[], variable: string): DataSummary => {
  const values = data
    .map(row => row[variable])
    .filter(value => value !== null && value !== undefined)
    .map(value => typeof value === 'string' ? parseFloat(value) : value) as number[];
  
  values.sort((a, b) => a - b);
  
  const count = values.length;
  const sum = values.reduce((a, b) => a + b, 0);
  const mean = sum / count;
  const min = values[0];
  const max = values[values.length - 1];
  
  // Calculate quartiles
  const q1 = values[Math.floor(count * 0.25)];
  const median = values[Math.floor(count * 0.5)];
  const q3 = values[Math.floor(count * 0.75)];
  
  // Calculate standard deviation
  const squareDiffs = values.map(value => Math.pow(value - mean, 2));
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / count;
  const stdDev = Math.sqrt(avgSquareDiff);
  
  return {
    variable,
    type: 'numeric',
    stats: {
      count,
      mean,
      median,
      min,
      max,
      q1,
      q3,
      stdDev,
      range: max - min,
      iqr: q3 - q1
    }
  };
};

const createCategoricalSummary = (data: DataRow[], variable: string): DataSummary => {
  const frequencies: { [key: string]: number } = {};
  let count = 0;
  
  data.forEach(row => {
    const value = row[variable];
    if (value !== null && value !== undefined && value !== '') {
      const strValue = String(value);
      frequencies[strValue] = (frequencies[strValue] || 0) + 1;
      count++;
    }
  });
  
  const categories = Object.keys(frequencies);
  const sortedCategories = categories.sort((a, b) => frequencies[b] - frequencies[a]);
  
  const topCategories = sortedCategories.slice(0, 10).map(category => ({
    category,
    count: frequencies[category],
    percentage: (frequencies[category] / count) * 100
  }));
  
  return {
    variable,
    type: 'categorical',
    stats: {
      count,
      uniqueCount: categories.length,
      topCategories,
      mode: sortedCategories[0],
      modeFrequency: frequencies[sortedCategories[0]],
      modePercentage: (frequencies[sortedCategories[0]] / count) * 100
    }
  };
};

const createDateSummary = (data: DataRow[], variable: string): DataSummary => {
  // Convert all values to Date objects
  const dates = data
    .map(row => row[variable])
    .filter(value => value !== null && value !== undefined)
    .map(value => new Date(String(value)))
    .filter(date => !isNaN(date.getTime())); // Filter out invalid dates
  
  // Sort dates chronologically
  dates.sort((a, b) => a.getTime() - b.getTime());
  
  const count = dates.length;
  const min = dates[0];
  const max = dates[dates.length - 1];
  const range = max.getTime() - min.getTime();
  const rangeDays = Math.floor(range / (1000 * 60 * 60 * 24));
  
  // Group by year
  const yearCount: { [key: string]: number } = {};
  dates.forEach(date => {
    const year = date.getFullYear().toString();
    yearCount[year] = (yearCount[year] || 0) + 1;
  });
  
  // Group by month (across all years)
  const monthCount: { [key: string]: number } = {};
  dates.forEach(date => {
    const month = date.toLocaleString('default', { month: 'long' });
    monthCount[month] = (monthCount[month] || 0) + 1;
  });
  
  return {
    variable,
    type: 'date',
    stats: {
      count,
      min,
      max,
      rangeDays,
      yearDistribution: yearCount,
      monthDistribution: monthCount
    }
  };
};

const analyzeRelationship = (
  data: DataRow[],
  variable: string,
  varType: 'numeric' | 'categorical' | 'date',
  targetVariable: string,
  targetType: 'numeric' | 'categorical' | 'date'
): { insight?: Insight; visualization?: VisualizationData } => {
  // Both numeric variables - calculate correlation
  if (varType === 'numeric' && targetType === 'numeric') {
    return analyzeNumericToNumeric(data, variable, targetVariable);
  }
  
  // Numeric target and categorical variable - calculate average by category
  if (varType === 'categorical' && targetType === 'numeric') {
    return analyzeCategoricalToNumeric(data, variable, targetVariable);
  }
  
  // Categorical target and numeric variable - calculate distribution by target category
  if (varType === 'numeric' && targetType === 'categorical') {
    return analyzeNumericToCategorical(data, variable, targetVariable);
  }
  
  // Both variables are categorical - calculate contingency table
  if (varType === 'categorical' && targetType === 'categorical') {
    return analyzeCategoricalToCategorical(data, variable, targetVariable);
  }
  
  // Date variable and numeric target - analyze trend over time
  if (varType === 'date' && targetType === 'numeric') {
    return analyzeDateToNumeric(data, variable, targetVariable);
  }
  
  // Return empty object if relationship cannot be analyzed
  return {};
};

const analyzeNumericToNumeric = (
  data: DataRow[],
  variable: string,
  targetVariable: string
): { insight?: Insight; visualization?: VisualizationData } => {
  // Calculate correlation coefficient
  const validRows = data.filter(row => 
    row[variable] !== null && row[variable] !== undefined &&
    row[targetVariable] !== null && row[targetVariable] !== undefined
  );
  
  const xValues = validRows.map(row => 
    typeof row[variable] === 'string' ? parseFloat(row[variable] as string) : row[variable]
  ) as number[];
  
  const yValues = validRows.map(row => 
    typeof row[targetVariable] === 'string' ? parseFloat(row[targetVariable] as string) : row[targetVariable]
  ) as number[];
  
  // Calculate correlation coefficient
  const n = xValues.length;
  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumY = yValues.reduce((a, b) => a + b, 0);
  const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
  const sumX2 = xValues.reduce((sum, x) => sum + x * x, 0);
  const sumY2 = yValues.reduce((sum, y) => sum + y * y, 0);
  
  const correlation = (n * sumXY - sumX * sumY) / 
    (Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)));
  
  const correlationStrength = 
    Math.abs(correlation) > 0.7 ? 'strong' :
    Math.abs(correlation) > 0.3 ? 'moderate' : 'weak';
  
  const correlationDirection = correlation > 0 ? 'positive' : 'negative';
  
  // Create scattered plot visualization data
  const scatterData = validRows.map((row, index) => ({
    id: index,
    x: row[variable],
    y: row[targetVariable]
  }));
  
  // Create binned data for a smoother visualization
  const bins = 20;
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const binSize = (xMax - xMin) / bins;
  
  const binnedData = Array(bins).fill(0).map((_, i) => {
    const binStart = xMin + i * binSize;
    const binEnd = binStart + binSize;
    const binValues = yValues.filter((_, j) => xValues[j] >= binStart && xValues[j] < binEnd);
    
    return {
      x: binStart + binSize / 2,
      y: binValues.length > 0 ? binValues.reduce((a, b) => a + b, 0) / binValues.length : 0,
      count: binValues.length
    };
  }).filter(bin => bin.count > 0);
  
  return {
    insight: {
      id: `correlation-${variable}-${targetVariable}`,
      title: `Relationship between ${variable} and ${targetVariable}`,
      description: `There is a ${correlationStrength} ${correlationDirection} correlation (${correlation.toFixed(2)}) between ${variable} and ${targetVariable}.`,
      importance: Math.abs(correlation) * 10
    },
    visualization: {
      type: 'scatter',
      title: `${variable} vs ${targetVariable}`,
      description: `Scatter plot showing the relationship between ${variable} and ${targetVariable}`,
      xAxis: variable,
      yAxis: targetVariable,
      data: scatterData
    }
  };
};

const analyzeCategoricalToNumeric = (
  data: DataRow[],
  categorical: string,
  numeric: string
): { insight?: Insight; visualization?: VisualizationData } => {
  // Group by categorical variable and calculate average of numeric variable
  const categories: { [key: string]: number[] } = {};
  
  data.forEach(row => {
    const catValue = row[categorical];
    const numValue = row[numeric];
    
    if (catValue !== null && catValue !== undefined && numValue !== null && numValue !== undefined) {
      const numericValue = typeof numValue === 'string' ? parseFloat(numValue) : numValue as number;
      
      if (!isNaN(numericValue)) {
        const category = String(catValue);
        if (!categories[category]) {
          categories[category] = [];
        }
        categories[category].push(numericValue);
      }
    }
  });
  
  // Calculate statistics for each category
  const categoryStats = Object.keys(categories).map(category => {
    const values = categories[category];
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return {
      category,
      count: values.length,
      average: avg
    };
  });
  
  // Sort by average value and get top categories
  categoryStats.sort((a, b) => b.average - a.average);
  
  // Take top 10 categories by count
  const topCategories = categoryStats
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .sort((a, b) => b.average - a.average);
  
  // Check for significant differences between categories
  const overallAvg = data
    .map(row => row[numeric])
    .filter(val => val !== null && val !== undefined)
    .map(val => typeof val === 'string' ? parseFloat(val as string) : val as number)
    .reduce((a, b) => a + b, 0) / data.length;
  
  // Find categories with significant deviation from average
  const significantCategories = topCategories.filter(cat => 
    Math.abs(cat.average - overallAvg) / overallAvg > 0.2 && cat.count > 5
  );
  
  // Create visualization data
  const vizData = topCategories.map(cat => ({
    category: cat.category,
    value: cat.average,
    count: cat.count
  }));
  
  let insight: Insight | undefined = undefined;
  
  if (significantCategories.length > 0) {
    const topCategory = significantCategories[0];
    const percentDiff = ((topCategory.average - overallAvg) / overallAvg) * 100;
    
    insight = {
      id: `cat-num-${categorical}-${numeric}`,
      title: `Impact of ${categorical} on ${numeric}`,
      description: `${topCategory.category} has a ${percentDiff > 0 ? 'higher' : 'lower'} ${numeric} by ${Math.abs(percentDiff).toFixed(1)}% compared to average.`,
      importance: 7 + Math.min(3, significantCategories.length)
    };
  }
  
  return {
    insight,
    visualization: {
      type: 'bar',
      title: `Average ${numeric} by ${categorical}`,
      description: `Bar chart showing how ${numeric} varies across different categories of ${categorical}`,
      xAxis: categorical,
      yAxis: numeric,
      data: vizData
    }
  };
};

const analyzeNumericToCategorical = (
  data: DataRow[],
  numeric: string,
  categorical: string
): { insight?: Insight; visualization?: VisualizationData } => {
  // Group data by categorical target
  const categories: { [key: string]: number[] } = {};
  
  data.forEach(row => {
    const catValue = row[categorical];
    const numValue = row[numeric];
    
    if (catValue !== null && catValue !== undefined && numValue !== null && numValue !== undefined) {
      const numericValue = typeof numValue === 'string' ? parseFloat(numValue) : numValue as number;
      
      if (!isNaN(numericValue)) {
        const category = String(catValue);
        if (!categories[category]) {
          categories[category] = [];
        }
        categories[category].push(numericValue);
      }
    }
  });
  
  // Calculate statistics for each category
  const categoryStats = Object.keys(categories).map(category => {
    const values = categories[category].sort((a, b) => a - b);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const median = values[Math.floor(values.length / 2)];
    
    return {
      category,
      count: values.length,
      average: avg,
      median,
      min: values[0],
      max: values[values.length - 1]
    };
  });
  
  // Sort by count
  categoryStats.sort((a, b) => b.count - a.count);
  
  // Take top categories (maximum 6 for readability)
  const topCategories = categoryStats.slice(0, 6);
  
  // Check if there's a clear pattern between numeric variable and categories
  const minAvg = Math.min(...topCategories.map(c => c.average));
  const maxAvg = Math.max(...topCategories.map(c => c.average));
  const avgRange = maxAvg - minAvg;
  
  const hasSignificantDifference = avgRange / maxAvg > 0.2;
  
  // Create box plot data
  const boxPlotData = topCategories.map(cat => {
    const values = categories[cat.category];
    values.sort((a, b) => a - b);
    
    const q1 = values[Math.floor(values.length * 0.25)];
    const q3 = values[Math.floor(values.length * 0.75)];
    
    return {
      category: cat.category,
      min: cat.min,
      q1,
      median: cat.median,
      q3,
      max: cat.max,
      count: cat.count
    };
  });
  
  let insight: Insight | undefined = undefined;
  
  if (hasSignificantDifference) {
    const highestCat = topCategories.reduce((prev, current) => 
      prev.average > current.average ? prev : current
    );
    
    const lowestCat = topCategories.reduce((prev, current) => 
      prev.average < current.average ? prev : current
    );
    
    insight = {
      id: `num-cat-${numeric}-${categorical}`,
      title: `${numeric} varies significantly across ${categorical} categories`,
      description: `${highestCat.category} has an average ${numeric} of ${highestCat.average.toFixed(2)}, while ${lowestCat.category} has ${lowestCat.average.toFixed(2)}.`,
      importance: 8
    };
  }
  
  return {
    insight,
    visualization: {
      type: 'box',
      title: `Distribution of ${numeric} by ${categorical}`,
      description: `Box plot showing how ${numeric} is distributed across different categories of ${categorical}`,
      xAxis: categorical,
      yAxis: numeric,
      data: boxPlotData
    }
  };
};

const analyzeCategoricalToCategorical = (
  data: DataRow[],
  categorical1: string,
  categorical2: string
): { insight?: Insight; visualization?: VisualizationData } => {
  // Create contingency table
  const contingencyTable: { [key: string]: { [key: string]: number } } = {};
  const cat1Values = new Set<string>();
  const cat2Values = new Set<string>();
  
  // Count occurrences
  data.forEach(row => {
    const val1 = row[categorical1];
    const val2 = row[categorical2];
    
    if (val1 !== null && val1 !== undefined && val2 !== null && val2 !== undefined) {
      const category1 = String(val1);
      const category2 = String(val2);
      
      cat1Values.add(category1);
      cat2Values.add(category2);
      
      if (!contingencyTable[category1]) {
        contingencyTable[category1] = {};
      }
      
      contingencyTable[category1][category2] = (contingencyTable[category1][category2] || 0) + 1;
    }
  });
  
  // Convert to array format for visualization
  const heatmapData: { category1: string; category2: string; count: number }[] = [];
  
  const cat1Array = Array.from(cat1Values);
  const cat2Array = Array.from(cat2Values);
  
  // Limit to top 10 categories if there are too many
  const topCat1 = cat1Array.length > 10 ? 
    Object.keys(contingencyTable)
      .map(cat => ({
        category: cat,
        total: Object.values(contingencyTable[cat]).reduce((a, b) => a + b, 0)
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)
      .map(item => item.category) : 
    cat1Array;
  
  const cat2Counts: { [key: string]: number } = {};
  cat2Array.forEach(cat2 => {
    cat2Counts[cat2] = 0;
    topCat1.forEach(cat1 => {
      if (contingencyTable[cat1] && contingencyTable[cat1][cat2]) {
        cat2Counts[cat2] += contingencyTable[cat1][cat2];
      }
    });
  });
  
  const topCat2 = cat2Array.length > 10 ?
    Object.keys(cat2Counts)
      .sort((a, b) => cat2Counts[b] - cat2Counts[a])
      .slice(0, 10) :
    cat2Array;
  
  // Create heatmap data
  topCat1.forEach(cat1 => {
    topCat2.forEach(cat2 => {
      const count = contingencyTable[cat1] && contingencyTable[cat1][cat2] ? 
        contingencyTable[cat1][cat2] : 0;
      
      heatmapData.push({
        category1: cat1,
        category2: cat2,
        count
      });
    });
  });
  
  // Find interesting patterns
  let maxCombo = { cat1: '', cat2: '', count: 0, percentage: 0 };
  
  topCat1.forEach(cat1 => {
    const cat1Total = topCat2.reduce((total, cat2) => {
      return total + (contingencyTable[cat1] && contingencyTable[cat1][cat2] ? 
        contingencyTable[cat1][cat2] : 0);
    }, 0);
    
    topCat2.forEach(cat2 => {
      const count = contingencyTable[cat1] && contingencyTable[cat1][cat2] ? 
        contingencyTable[cat1][cat2] : 0;
      
      if (count > 0) {
        const percentage = (count / cat1Total) * 100;
        
        if (percentage > maxCombo.percentage) {
          maxCombo = { cat1, cat2, count, percentage };
        }
      }
    });
  });
  
  let insight: Insight | undefined = undefined;
  
  if (maxCombo.percentage > 70) {
    insight = {
      id: `cat-cat-${categorical1}-${categorical2}`,
      title: `Strong association between ${categorical1} and ${categorical2}`,
      description: `${maxCombo.percentage.toFixed(1)}% of ${maxCombo.cat1} are associated with ${maxCombo.cat2}.`,
      importance: Math.min(Math.round(maxCombo.percentage / 10), 10)
    };
  }
  
  return {
    insight,
    visualization: {
      type: 'heatmap',
      title: `Relationship between ${categorical1} and ${categorical2}`,
      description: `Heatmap showing the frequency of combinations between ${categorical1} and ${categorical2}`,
      xAxis: categorical1,
      yAxis: categorical2,
      data: heatmapData
    }
  };
};

const analyzeDateToNumeric = (
  data: DataRow[],
  dateVar: string,
  numericVar: string
): { insight?: Insight; visualization?: VisualizationData } => {
  // Group data by date periods
  const dateValues = data
    .filter(row => row[dateVar] !== null && row[dateVar] !== undefined && 
                  row[numericVar] !== null && row[numericVar] !== undefined)
    .map(row => ({
      date: new Date(String(row[dateVar])),
      value: typeof row[numericVar] === 'string' ? 
        parseFloat(row[numericVar] as string) : row[numericVar] as number
    }))
    .filter(item => !isNaN(item.date.getTime()) && !isNaN(item.value));
  
  // Sort by date
  dateValues.sort((a, b) => a.date.getTime() - b.date.getTime());
  
  if (dateValues.length === 0) {
    return {};
  }
  
  // Determine appropriate time grouping based on date range
  const minDate = dateValues[0].date;
  const maxDate = dateValues[dateValues.length - 1].date;
  const timeRange = maxDate.getTime() - minDate.getTime();
  const dayRange = timeRange / (1000 * 60 * 60 * 24);
  
  let grouping: 'day' | 'week' | 'month' | 'quarter' | 'year';
  
  if (dayRange <= 31) {
    grouping = 'day';
  } else if (dayRange <= 120) {
    grouping = 'week';
  } else if (dayRange <= 365) {
    grouping = 'month';
  } else if (dayRange <= 365 * 2) {
    grouping = 'quarter';
  } else {
    grouping = 'year';
  }
  
  // Group data by selected time period
  const groupedData: { [key: string]: number[] } = {};
  
  dateValues.forEach(item => {
    let groupKey: string;
    
    if (grouping === 'day') {
      groupKey = item.date.toISOString().slice(0, 10); // YYYY-MM-DD
    } else if (grouping === 'week') {
      // Get the Monday of the current week
      const day = item.date.getDay();
      const diff = item.date.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(item.date);
      monday.setDate(diff);
      groupKey = monday.toISOString().slice(0, 10);
    } else if (grouping === 'month') {
      groupKey = `${item.date.getFullYear()}-${String(item.date.getMonth() + 1).padStart(2, '0')}`;
    } else if (grouping === 'quarter') {
      const quarter = Math.floor(item.date.getMonth() / 3) + 1;
      groupKey = `${item.date.getFullYear()}-Q${quarter}`;
    } else {
      groupKey = item.date.getFullYear().toString();
    }
    
    if (!groupedData[groupKey]) {
      groupedData[groupKey] = [];
    }
    
    groupedData[groupKey].push(item.value);
  });
  
  // Calculate averages for each time period
  const timeSeriesData = Object.keys(groupedData).map(key => {
    const values = groupedData[key];
    return {
      timePeriod: key,
      average: values.reduce((a, b) => a + b, 0) / values.length,
      count: values.length
    };
  });
  
  // Sort chronologically
  timeSeriesData.sort((a, b) => {
    if (a.timePeriod < b.timePeriod) return -1;
    if (a.timePeriod > b.timePeriod) return 1;
    return 0;
  });
  
  // Analyze trend
  const trendType = analyzeTrend(timeSeriesData.map(d => d.average));
  
  let insight: Insight | undefined = undefined;
  
  if (trendType !== 'no trend') {
    const firstValue = timeSeriesData[0].average;
    const lastValue = timeSeriesData[timeSeriesData.length - 1].average;
    const percentChange = ((lastValue - firstValue) / firstValue) * 100;
    
    insight = {
      id: `time-trend-${dateVar}-${numericVar}`,
      title: `${trendType === 'increasing' ? 'Upward' : 'Downward'} trend in ${numericVar} over time`,
      description: `${numericVar} has ${trendType === 'increasing' ? 'increased' : 'decreased'} by ${Math.abs(percentChange).toFixed(1)}% from ${timeSeriesData[0].timePeriod} to ${timeSeriesData[timeSeriesData.length - 1].timePeriod}.`,
      importance: Math.min(Math.abs(Math.round(percentChange / 10)), 10)
    };
  }
  
  return {
    insight,
    visualization: {
      type: 'line',
      title: `${numericVar} over Time`,
      description: `Line chart showing how ${numericVar} changes over time`,
      xAxis: dateVar,
      yAxis: numericVar,
      data: timeSeriesData
    }
  };
};

const analyzeTrend = (values: number[]): 'increasing' | 'decreasing' | 'no trend' => {
  if (values.length < 3) {
    return 'no trend';
  }
  
  // Simple linear regression
  const n = values.length;
  const indices = Array.from(Array(n).keys());
  
  const sumX = indices.reduce((a, b) => a + b, 0);
  const sumY = values.reduce((a, b) => a + b, 0);
  const sumXY = indices.reduce((sum, x, i) => sum + x * values[i], 0);
  const sumX2 = indices.reduce((sum, x) => sum + x * x, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  
  // Check if slope is significant relative to the average value
  const avgY = sumY / n;
  const relativeSlope = (slope * n) / avgY;
  
  if (Math.abs(relativeSlope) < 0.1) {
    return 'no trend';
  }
  
  return slope > 0 ? 'increasing' : 'decreasing';
};

const generateAdditionalInsights = (
  data: DataRow[],
  summaries: DataSummary[],
  targetVariable: string
): Insight[] => {
  const insights: Insight[] = [];
  
  // Find the target variable summary
  const targetSummary = summaries.find(summary => summary.variable === targetVariable);
  
  if (!targetSummary) {
    return insights;
  }
  
  // Generate insights based on target variable type
  if (targetSummary.type === 'numeric') {
    const { mean, median, stdDev } = targetSummary.stats;
    
    // Check for skewness
    const skewness = (mean - median) / stdDev;
    
    if (Math.abs(skewness) > 0.5) {
      insights.push({
        id: 'skewed-distribution',
        title: `${targetVariable} has a ${skewness > 0 ? 'right' : 'left'}-skewed distribution`,
        description: `The distribution of ${targetVariable} is ${skewness > 0 ? 'right' : 'left'}-skewed, with mean=${mean.toFixed(2)} and median=${median.toFixed(2)}.`,
        importance: Math.min(Math.abs(skewness) * 10, 8)
      });
    }
  }
  
  // If target is categorical, check for class imbalance
  if (targetSummary.type === 'categorical') {
    const { topCategories } = targetSummary.stats;
    
    if (topCategories && topCategories.length > 1) {
      const topCategory = topCategories[0];
      const totalCount = topCategories.reduce((sum, cat) => sum + cat.count, 0);
      const topPercentage = (topCategory.count / totalCount) * 100;
      
      if (topPercentage > 75) {
        insights.push({
          id: 'class-imbalance',
          title: `Significant class imbalance in ${targetVariable}`,
          description: `${topCategory.category} represents ${topPercentage.toFixed(1)}% of all ${targetVariable} values.`,
          importance: Math.min(topPercentage / 10, 9)
        });
      }
    }
  }
  
  return insights;
};

const generateAdditionalVisualizations = (
  data: DataRow[],
  targetVariable: string,
  targetType: 'numeric' | 'categorical' | 'date'
): VisualizationData[] => {
  const visualizations: VisualizationData[] = [];
  
  // Add a visualization specific to the target variable type
  if (targetType === 'numeric') {
    // Add histogram for numeric target
    const values = data
      .map(row => row[targetVariable])
      .filter(value => value !== null && value !== undefined)
      .map(value => typeof value === 'string' ? parseFloat(value as string) : value as number);
    
    // Create bins for histogram
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    const binCount = Math.min(Math.ceil(Math.sqrt(values.length)), 20);
    const binWidth = range / binCount;
    
    const bins = Array(binCount).fill(0).map((_, i) => {
      const binStart = min + i * binWidth;
      const binEnd = binStart + binWidth;
      
      return {
        binStart,
        binCenter: binStart + binWidth / 2,
        binEnd,
        count: 0
      };
    });
    
    // Count values in each bin
    values.forEach(value => {
      const binIndex = Math.min(Math.floor((value - min) / binWidth), binCount - 1);
      bins[binIndex].count++;
    });
    
    visualizations.push({
      type: 'histogram',
      title: `Distribution of ${targetVariable}`,
      description: `Histogram showing the distribution of ${targetVariable} values`,
      xAxis: targetVariable,
      yAxis: 'Frequency',
      data: bins
    });
  } else if (targetType === 'categorical') {
    // Add pie chart for categorical target
    const categories: { [key: string]: number } = {};
    
    data.forEach(row => {
      const value = row[targetVariable];
      if (value !== null && value !== undefined) {
        const category = String(value);
        categories[category] = (categories[category] || 0) + 1;
      }
    });
    
    const categoryData = Object.keys(categories)
      .map(category => ({
        category,
        count: categories[category]
      }))
      .sort((a, b) => b.count - a.count);
    
    // If too many categories, group smaller ones into "Other"
    const pieData = categoryData.length > 8 ? 
      [...categoryData.slice(0, 7), {
        category: 'Other',
        count: categoryData.slice(7).reduce((sum, cat) => sum + cat.count, 0)
      }] : 
      categoryData;
    
    visualizations.push({
      type: 'pie',
      title: `Distribution of ${targetVariable}`,
      description: `Pie chart showing the distribution of ${targetVariable} categories`,
      data: pieData
    });
  }
  
  return visualizations;
};
