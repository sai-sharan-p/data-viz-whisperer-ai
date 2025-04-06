
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VisualizationData } from "@/utils/dataAnalysis";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, ScatterChart, Scatter, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  Cell, Sector, Rectangle } from "recharts";
import { useState } from "react";

interface DataVisualizationsProps {
  visualizations: VisualizationData[];
  isLoading?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

const DataVisualizations = ({ visualizations, isLoading = false }: DataVisualizationsProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

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
      
      <Tabs defaultValue="grid" className="flex-1">
        <TabsList className="mb-4">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="focus">Focus View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid" className="h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {visualizations.map((viz, index) => (
              <Card key={index} className="overflow-hidden">
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
          {payload.category}
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

  switch (visualization.type) {
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height={heightAuto ? "100%" : 240}>
          <BarChart data={visualization.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="category" 
              tick={{ fontSize: 12 }} 
              interval={0}
              tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" name={visualization.yAxis} />
          </BarChart>
        </ResponsiveContainer>
      );
    
    case 'line':
      return (
        <ResponsiveContainer width="100%" height={heightAuto ? "100%" : 240}>
          <LineChart data={visualization.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timePeriod" 
              tick={{ fontSize: 12 }} 
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="average" 
              stroke="#8884d8" 
              name={visualization.yAxis}
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      );
    
    case 'pie':
      return (
        <ResponsiveContainer width="100%" height={heightAuto ? "100%" : 240}>
          <PieChart>
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
            >
              {visualization.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    
    case 'scatter':
      return (
        <ResponsiveContainer width="100%" height={heightAuto ? "100%" : 240}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="x" 
              type="number" 
              name={visualization.xAxis} 
              tick={{ fontSize: 12 }} 
            />
            <YAxis 
              dataKey="y" 
              type="number" 
              name={visualization.yAxis} 
              tick={{ fontSize: 12 }} 
            />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter 
              name={`${visualization.xAxis} vs ${visualization.yAxis}`} 
              data={visualization.data} 
              fill="#8884d8" 
            />
          </ScatterChart>
        </ResponsiveContainer>
      );
    
    case 'histogram':
      return (
        <ResponsiveContainer width="100%" height={heightAuto ? "100%" : 240}>
          <BarChart data={visualization.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="binCenter" 
              tick={{ fontSize: 12 }} 
              tickFormatter={(value) => value.toFixed(1)}
              name={visualization.xAxis}
            />
            <YAxis tick={{ fontSize: 12 }} name="Frequency" />
            <Tooltip 
              formatter={(value, name, props) => [value, 'Frequency']}
              labelFormatter={(label) => `${visualization.xAxis}: ${Number(label).toFixed(2)}`}
            />
            <Bar dataKey="count" fill="#8884d8" name="Frequency">
              <Cell fill="#8884d8" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    
    case 'box':
      return (
        <ResponsiveContainer width="100%" height={heightAuto ? "100%" : 240}>
          <BarChart
            data={visualization.data}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={['dataMin', 'dataMax']} />
            <YAxis 
              dataKey="category" 
              type="category" 
              tick={{ fontSize: 12 }} 
              width={100}
            />
            <Tooltip 
              formatter={(value, name, props) => [value, name === 'median' ? 'Median' : name]}
              labelFormatter={(label) => `Category: ${label}`}
            />
            <Legend />
            <Bar 
              dataKey="median" 
              fill="#8884d8" 
              name="Median" 
              isAnimationActive={false}
            />
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
              name="Q1" 
              fill="#8884d8" 
              fillOpacity={0.2}
              stroke="#8884d8"
              isAnimationActive={false}
            />
            <Bar 
              dataKey="q3" 
              name="Q3" 
              fill="#8884d8" 
              fillOpacity={0.2}
              stroke="#8884d8"
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      );
    
    case 'heatmap':
      // Create a grid structure for the heatmap
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
      
      // Find max value for color scaling
      const maxValue = Math.max(...visualization.data.map(item => item.count));
      
      return (
        <ResponsiveContainer width="100%" height={heightAuto ? "100%" : 240}>
          <BarChart
            data={gridData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
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
            />
            <Tooltip 
              formatter={(value, name, props) => [value, name]}
              labelFormatter={(label) => `${visualization.xAxis}: ${label}`}
            />
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
        </ResponsiveContainer>
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
