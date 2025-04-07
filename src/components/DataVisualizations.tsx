
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VisualizationData } from "@/utils/dataAnalysis";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, ScatterChart, Scatter, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  Cell, Sector, Rectangle, ComposedChart, Area } from "recharts";
import { useState } from "react";
import { ChartContainer, ChartTooltipContent, ChartTooltip, ChartLegendContent } from "@/components/ui/chart";

interface DataVisualizationsProps {
  visualizations: VisualizationData[];
  isLoading?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

const chartConfig = {
  value: { 
    label: 'Value',
    theme: { light: '#0088FE', dark: '#0088FE' } 
  },
  count: { 
    label: 'Count',
    theme: { light: '#00C49F', dark: '#00C49F' } 
  },
  average: { 
    label: 'Average',
    theme: { light: '#8884d8', dark: '#8884d8' } 
  },
  median: { 
    label: 'Median',
    theme: { light: '#FFBB28', dark: '#FFBB28' } 
  },
  min: { 
    label: 'Minimum',
    theme: { light: '#FF8042', dark: '#FF8042' } 
  },
  max: { 
    label: 'Maximum',
    theme: { light: '#8dd1e1', dark: '#8dd1e1' } 
  },
  q1: { 
    label: 'Q1',
    theme: { light: '#a4de6c', dark: '#a4de6c' } 
  },
  q3: { 
    label: 'Q3',
    theme: { light: '#ffc658', dark: '#ffc658' } 
  },
  frequency: { 
    label: 'Frequency',
    theme: { light: '#8884d8', dark: '#8884d8' } 
  },
};

const DataVisualizations = ({ visualizations, isLoading = false }: DataVisualizationsProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<string>("grid");

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 h-full animate-pulse">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="h-64">
            <CardHeader className="pb-2">
              <div className="h-5 w-40 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-44 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (visualizations.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">No visualizations available yet. Select a target variable to analyze.</p>
      </div>
    );
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % visualizations.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + visualizations.length) % visualizations.length);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Visualizations</h2>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrev}
            className="p-1 rounded-full hover:bg-muted"
            aria-label="Previous visualization"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm">
            {activeIndex + 1} of {visualizations.length}
          </span>
          <button 
            onClick={handleNext}
            className="p-1 rounded-full hover:bg-muted"
            aria-label="Next visualization"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="mb-4">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="focus">Focus View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid" className="h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {visualizations.map((viz, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => {
                setActiveIndex(index);
                setActiveTab("focus");
              }}>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium">{viz.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-2 h-64">
                  <VisualizationComponent visualization={viz} />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="focus" className="h-full">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{visualizations[activeIndex].title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {visualizations[activeIndex].description}
              </p>
            </CardHeader>
            <CardContent className="h-[calc(100%-6rem)]">
              <VisualizationComponent 
                visualization={visualizations[activeIndex]} 
                heightAuto
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface VisualizationComponentProps {
  visualization: VisualizationData;
  heightAuto?: boolean;
}

const VisualizationComponent = ({ visualization, heightAuto = false }: VisualizationComponentProps) => {
  const [activePieIndex, setActivePieIndex] = useState(0);
  
  const onPieEnter = (_: any, index: number) => {
    setActivePieIndex(index);
  };
  
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value } = props;
  
    return (
      <g>
        <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill={fill}>
          {payload.category || ''}
        </text>
        <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill="#999">
          {`${(percent * 100).toFixed(2)}%`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    );
  };

  const getExtendedChartConfig = () => {
    const extendedConfig = { ...chartConfig };
    
    if (visualization.yAxis) {
      extendedConfig[visualization.yAxis.toLowerCase()] = {
        label: visualization.yAxis,
        theme: { light: '#0088FE', dark: '#0088FE' }
      };
    }
    
    if (visualization.xAxis) {
      extendedConfig[visualization.xAxis.toLowerCase()] = {
        label: visualization.xAxis,
        theme: { light: '#00C49F', dark: '#00C49F' }
      };
    }
    
    return extendedConfig;
  };

  switch (visualization.type) {
    case 'bar':
      return (
        <ChartContainer 
          className="w-full h-full" 
          config={getExtendedChartConfig()}
        >
          <BarChart data={visualization.data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="category" 
              label={{ value: visualization.xAxis, position: "insideBottom", offset: -10 }}
              tick={{ fontSize: 12 }} 
              interval={0}
              tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              label={{ value: visualization.yAxis, angle: -90, position: "insideLeft" }}
            />
            <ChartTooltip content={<ChartTooltipContent 
              formatter={(value) => [Number(value).toLocaleString(), visualization.yAxis || 'Value']} 
            />} />
            <Legend content={<ChartLegendContent nameKey={visualization.yAxis || 'value'} />} />
            <Bar dataKey="value" name={visualization.yAxis || 'Value'} />
          </BarChart>
        </ChartContainer>
      );
    
    case 'line':
      return (
        <ChartContainer 
          className="w-full h-full" 
          config={getExtendedChartConfig()}
        >
          <LineChart data={visualization.data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timePeriod" 
              tick={{ fontSize: 12 }} 
              interval="preserveStartEnd"
              label={{ value: visualization.xAxis, position: "insideBottom", offset: -10 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              label={{ value: visualization.yAxis, angle: -90, position: "insideLeft" }}
            />
            <ChartTooltip content={<ChartTooltipContent
              formatter={(value) => [Number(value).toLocaleString(), visualization.yAxis || 'Value']} 
            />} />
            <Legend content={<ChartLegendContent nameKey="average" />} />
            <Line 
              type="monotone" 
              dataKey="average" 
              name={visualization.yAxis || 'Value'}
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ChartContainer>
      );
    
    case 'pie':
      return (
        <ChartContainer 
          className="w-full h-full" 
          config={getExtendedChartConfig()}
        >
          <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Pie
              activeIndex={activePieIndex}
              activeShape={renderActiveShape}
              data={visualization.data}
              cx="50%"
              cy="50%"
              innerRadius={heightAuto ? 70 : 40}
              outerRadius={heightAuto ? 90 : 60}
              dataKey="count"
              nameKey="category"
              onMouseEnter={onPieEnter}
              label={({ name, percent }) => `${name || ''}: ${(percent * 100).toFixed(0)}%`}
            >
              {visualization.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent 
              formatter={(value) => [Number(value).toLocaleString(), 'Count']} 
              labelKey="category"
            />} />
            <Legend 
              formatter={(value, entry) => {
                if (entry && entry.payload) {
                  return entry.payload.category || value;
                }
                return value;
              }} 
              content={<ChartLegendContent nameKey="category" />} 
            />
          </PieChart>
        </ChartContainer>
      );
    
    case 'scatter':
      return (
        <ChartContainer 
          className="w-full h-full" 
          config={chartConfig}
        >
          <ScatterChart margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="x" 
              type="number" 
              name={visualization.xAxis} 
              label={{ value: visualization.xAxis, position: "insideBottom", offset: -10 }}
              tick={{ fontSize: 12 }} 
              domain={['auto', 'auto']}
            />
            <YAxis 
              dataKey="y" 
              type="number" 
              name={visualization.yAxis} 
              label={{ value: visualization.yAxis, angle: -90, position: "insideLeft" }}
              tick={{ fontSize: 12 }} 
              domain={['auto', 'auto']}
            />
            <ChartTooltip 
              cursor={{ strokeDasharray: '3 3' }} 
              content={<ChartTooltipContent />}
            />
            <Legend content={<ChartLegendContent />} />
            <Scatter 
              name={`${visualization.xAxis} vs ${visualization.yAxis}`} 
              data={visualization.data} 
              fill="#8884d8" 
            />
          </ScatterChart>
        </ChartContainer>
      );
    
    case 'histogram':
      return (
        <ChartContainer 
          className="w-full h-full" 
          config={chartConfig}
        >
          <BarChart data={visualization.data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="binCenter" 
              tick={{ fontSize: 12 }} 
              tickFormatter={(value) => value.toFixed(1)}
              label={{ value: visualization.xAxis, position: "insideBottom", offset: -10 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              label={{ value: "Frequency", angle: -90, position: "insideLeft" }}
            />
            <ChartTooltip 
              formatter={(value, name, props) => [value, 'Frequency']}
              labelFormatter={(label) => `${visualization.xAxis}: ${Number(label).toFixed(2)}`}
              content={<ChartTooltipContent />}
            />
            <Legend content={<ChartLegendContent />} />
            <Bar dataKey="count" name="Frequency">
              <Cell fill="#8884d8" />
            </Bar>
          </BarChart>
        </ChartContainer>
      );
    
    case 'box':
      return (
        <ChartContainer 
          className="w-full h-full" 
          config={chartConfig}
        >
          <ComposedChart
            data={visualization.data}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 70, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              domain={['dataMin', 'dataMax']} 
              label={{ value: visualization.yAxis, position: "insideBottom", offset: -10 }}
            />
            <YAxis 
              dataKey="category" 
              type="category" 
              tick={{ fontSize: 12 }} 
              width={70}
              label={{ value: "Category", angle: -90, position: "insideLeft", offset: -60 }}
            />
            <ChartTooltip 
              formatter={(value, name, props) => [value, name === 'median' ? 'Median' : name]}
              labelFormatter={(label) => `Category: ${label}`}
              content={<ChartTooltipContent />}
            />
            <Legend content={<ChartLegendContent />} />
            <Bar 
              dataKey="min" 
              name="Min" 
              fill="transparent" 
              stroke="#8884d8" 
              strokeWidth={1}
              isAnimationActive={false}
            />
            <Bar 
              dataKey="max" 
              name="Max" 
              fill="transparent" 
              stroke="#8884d8" 
              strokeWidth={1}
              isAnimationActive={false}
            />
            <Bar 
              dataKey="q1" 
              stackId="a"
              name="Q1"
              fill="#8884d8" 
              fillOpacity={0.2}
              stroke="#8884d8"
              isAnimationActive={false}
            />
            <Bar 
              dataKey="q3" 
              stackId="a"
              name="Q3"
              fill="#8884d8" 
              fillOpacity={0.2}
              stroke="#8884d8"
              isAnimationActive={false}
            />
            <Line 
              dataKey="median" 
              name="Median"
              stroke="#FF8042"
              strokeWidth={2}
              dot={{ fill: '#FF8042', r: 6 }}
            />
          </ComposedChart>
        </ChartContainer>
      );
    
    case 'heatmap':
      const uniqueCategories1 = [...new Set(visualization.data.map(item => item.category1))];
      const uniqueCategories2 = [...new Set(visualization.data.map(item => item.category2))];
      
      const gridData = uniqueCategories1.map(cat1 => {
        const row: any = { name: cat1 };
        
        uniqueCategories2.forEach(cat2 => {
          const dataPoint = visualization.data.find(
            item => item.category1 === cat1 && item.category2 === cat2
          );
          row[cat2] = dataPoint ? dataPoint.count : 0;
        });
        
        return row;
      });
      
      const maxValue = Math.max(...visualization.data.map(item => item.count));
      
      return (
        <ChartContainer 
          className="w-full h-full" 
          config={chartConfig}
        >
          <BarChart
            data={gridData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 70, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="category" 
              dataKey="name" 
              hide 
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              tick={{ fontSize: 10 }} 
              width={70}
              tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
              label={{ value: visualization.xAxis, angle: -90, position: "insideLeft", offset: -60 }}
            />
            <ChartTooltip 
              formatter={(value, name, props) => [value, name]}
              labelFormatter={(label) => `${visualization.xAxis}: ${label}`}
              content={<ChartTooltipContent />}
            />
            <Legend content={<ChartLegendContent />} />
            {uniqueCategories2.map((category, index) => (
              <Bar 
                key={category}
                dataKey={category}
                stackId="a"
                name={category}
                fill={`rgb(${Math.floor(255 - (255 * (index / uniqueCategories2.length)))}, ${Math.floor(100 + (155 * (index / uniqueCategories2.length)))}, 255)`}
              >
                {gridData.map((entry, cellIndex) => (
                  <Cell 
                    key={`cell-${cellIndex}`} 
                    fill={`rgba(136, 132, 216, ${entry[category] / maxValue})`} 
                  />
                ))}
              </Bar>
            ))}
          </BarChart>
        </ChartContainer>
      );
    
    case 'area':
      return (
        <ChartContainer 
          className="w-full h-full" 
          config={chartConfig}
        >
          <ComposedChart data={visualization.data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="category" 
              tick={{ fontSize: 12 }} 
              label={{ value: visualization.xAxis, position: "insideBottom", offset: -10 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              label={{ value: visualization.yAxis, angle: -90, position: "insideLeft" }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend content={<ChartLegendContent />} />
            <Area type="monotone" dataKey="value" fill="#8884d8" stroke="#8884d8" name={visualization.yAxis} />
            <Line type="monotone" dataKey="value" stroke="#ff7300" name={`${visualization.yAxis} Trend`} />
          </ComposedChart>
        </ChartContainer>
      );
    
    default:
      return (
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">Unsupported visualization type: {visualization.type}</p>
        </div>
      );
  }
};

export default DataVisualizations;
