
import { ProcessedData } from "./fileProcessing";
import { VisualizationData } from "./dataAnalysis";

// Interface for the request that will be sent to the LLM API
export interface LLMChatRequest {
  message: string;
  datasetSummary: {
    headers: string[];
    rowCount: number;
    numericColumns: string[];
    categoricalColumns: string[];
    sample: Record<string, any>[];
  };
  chatHistory: {
    role: 'user' | 'assistant';
    content: string;
  }[];
}

// Interface for the response expected from the LLM API
export interface LLMChatResponse {
  message: string;
  visualization?: VisualizationData;
}

export const chatWithLLM = async (
  userMessage: string,
  processedData: ProcessedData,
  chatHistory: { role: 'user' | 'assistant'; content: string }[]
): Promise<LLMChatResponse> => {
  try {
    // Currently we have a mock implementation
    // When deploying, replace with actual API call
    
    //Sample API call structure:
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.AIzaSyAX5kPEq1MUC-u7GfYy1b3tdAACeghfEfM}`
    },
    body: JSON.stringify({
    message: userMessage,
    datasetSummary: {
    headers: processedData.headers,
    rowCount: processedData.summary.rowCount,
    numericColumns: processedData.summary.numericColumns,
    categoricalColumns: processedData.summary.categoricalColumns,
    sample: processedData.data.slice(0, 5) // Send sample data
    },
    chatHistory: chatHistory
    } as LLMChatRequest)
    });
    
    if (!response.ok) {
    throw new Error(`LLM API error: ${response.status}`);
    }
    return await response.json() as LLMChatResponse;
    
    console.log("LLM would process:", userMessage, "with data summary:", processedData.summary);
    
    // Currently return a mock response
    // This will be replaced with the actual LLM API call when deployed
    return generateMockResponse(userMessage, processedData, chatHistory);
  } catch (error) {
    console.error("Error calling LLM API:", error);
    return {
      message: "Sorry, I had trouble processing your request. Please try again."
    };
  }
};

// This function simulates LLM responses - replace it with real API calls when deploying
const generateMockResponse = (
  query: string, 
  data: ProcessedData,
  chatHistory: { role: 'user' | 'assistant'; content: string }[]
): LLMChatResponse => {
  const lowerQuery = query.toLowerCase();
  const { headers, summary, data: dataRows } = data;
  
  // Check if asking for a specific variable
  const mentionedVariables = headers.filter(header => 
    lowerQuery.includes(header.toLowerCase())
  );
  
  // Sample basic responses
  if (lowerQuery.includes('how many') && lowerQuery.includes('row')) {
    return {
      message: `Your dataset has ${summary.rowCount} rows of data.`
    };
  }
  
  if (lowerQuery.includes('columns') || lowerQuery.includes('variables')) {
    return {
      message: `Your dataset has ${headers.length} columns: ${headers.join(', ')}.`
    };
  }
  
  if ((lowerQuery.includes('show') || lowerQuery.includes('create') || lowerQuery.includes('visualize') || lowerQuery.includes('plot')) && 
      mentionedVariables.length > 0) {
    const variable = mentionedVariables[0];
    
    // Generate a visualization based on variable type and query terms
    let visualization: VisualizationData | undefined;
    
    // Use actual data instead of random values
    if (summary.numericColumns.includes(variable)) {
      // Extract actual values for the variable
      const values = dataRows.map(row => Number(row[variable])).filter(val => !isNaN(val));
      
      if (lowerQuery.includes('histogram') || lowerQuery.includes('distribution')) {
        // Create bins for histogram
        const min = Math.min(...values);
        const max = Math.max(...values);
        const range = max - min;
        const binCount = 10;
        const binSize = range / binCount;
        
        const bins = Array(binCount).fill(0).map((_, i) => ({
          binStart: min + i * binSize,
          binCenter: min + (i + 0.5) * binSize,
          binEnd: min + (i + 1) * binSize,
          count: 0
        }));
        
        // Count values in each bin
        values.forEach(val => {
          const binIndex = Math.min(binCount - 1, Math.floor((val - min) / binSize));
          if (binIndex >= 0) bins[binIndex].count++;
        });
        
        visualization = {
          type: 'histogram',
          title: `Distribution of ${variable}`,
          description: `Histogram showing the distribution of values for ${variable}`,
          xAxis: variable,
          yAxis: 'Frequency',
          data: bins
        };
      } else if (lowerQuery.includes('line') || lowerQuery.includes('trend')) {
        // Group data by some attribute (e.g., first 12 values)
        const periods = Math.min(12, values.length);
        const pointsPerPeriod = Math.floor(values.length / periods);
        
        const lineData = Array(periods).fill(0).map((_, i) => {
          const periodValues = values.slice(i * pointsPerPeriod, (i + 1) * pointsPerPeriod);
          const average = periodValues.reduce((sum, val) => sum + val, 0) / periodValues.length;
          
          return {
            timePeriod: `Period ${i+1}`,
            average: average
          };
        });
        
        visualization = {
          type: 'line',
          title: `Trend of ${variable}`,
          description: `Line chart showing the trend of ${variable}`,
          xAxis: 'Time Period',
          yAxis: variable,
          data: lineData
        };
      } else if (lowerQuery.includes('bar')) {
        // Create categories for numerical data (e.g., ranges)
        const min = Math.min(...values);
        const max = Math.max(...values);
        const range = max - min;
        const categoryCount = 5;
        const categorySize = range / categoryCount;
        
        const categories = Array(categoryCount).fill(0).map((_, i) => {
          const start = min + i * categorySize;
          const end = min + (i + 1) * categorySize;
          const categoryValues = values.filter(val => val >= start && val < end);
          
          return {
            category: `${start.toFixed(1)}-${end.toFixed(1)}`,
            value: categoryValues.length
          };
        });
        
        visualization = {
          type: 'bar',
          title: `${variable} by Range`,
          description: `Bar chart showing distribution of ${variable} by range`,
          xAxis: 'Range',
          yAxis: 'Count',
          data: categories
        };
      } else {
        // Default to scatter plot for numeric variables if not specified
        // For scatter, we need two variables - use another numeric column if available
        const secondVar = summary.numericColumns.find(col => col !== variable) || variable;
        
        const scatterData = dataRows.slice(0, 30).map((row, i) => ({
          id: i,
          x: Number(row[variable]) || 0,
          y: Number(row[secondVar]) || 0
        }));
        
        visualization = {
          type: 'scatter',
          title: `${variable} vs ${secondVar}`,
          description: `Scatter plot showing relationship between ${variable} and ${secondVar}`,
          xAxis: variable,
          yAxis: secondVar,
          data: scatterData
        };
      }
    } else if (summary.categoricalColumns.includes(variable)) {
      // Extract categories and their counts for categorical variable
      const categories = new Map<string, number>();
      
      dataRows.forEach(row => {
        const value = String(row[variable] || '');
        if (value) {
          categories.set(value, (categories.get(value) || 0) + 1);
        }
      });
      
      // Convert to array and sort by count (descending)
      const categoriesArray = Array.from(categories.entries())
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8); // Limit to top 8 categories for visualization clarity
      
      if (lowerQuery.includes('pie') || lowerQuery.includes('proportion')) {
        visualization = {
          type: 'pie',
          title: `Distribution of ${variable}`,
          description: `Pie chart showing the distribution of categories for ${variable}`,
          data: categoriesArray
        };
      } else {
        // Default to bar chart for categorical variables
        visualization = {
          type: 'bar',
          title: `Distribution of ${variable}`,
          description: `Bar chart showing the distribution of categories for ${variable}`,
          xAxis: variable,
          yAxis: 'Count',
          data: categoriesArray.map(item => ({
            category: item.category,
            value: item.count
          }))
        };
      }
    }
    
    return {
      message: `Here's a visualization for the ${variable} variable:`,
      visualization
    };
  }
  
  if (lowerQuery.includes('average') || lowerQuery.includes('mean')) {
    // Try to find a numerical variable mentioned
    const numVar = mentionedVariables.find(variable => summary.numericColumns.includes(variable));
    
    if (numVar) {
      const values = dataRows.map(row => Number(row[numVar])).filter(val => !isNaN(val));
      const average = values.reduce((sum, val) => sum + val, 0) / values.length;
      
      return {
        message: `The average ${numVar} is ${average.toFixed(2)}.`
      };
    }
  }
  
  if (lowerQuery.includes('count') || lowerQuery.includes('how many')) {
    // Check if a category variable is mentioned
    const catVar = mentionedVariables.find(variable => summary.categoricalColumns.includes(variable));
    const categoryValue = lowerQuery.split(' ').find(word => {
      // This is a simple check - in a real LLM this would be more sophisticated
      const row = dataRows.find(r => String(r[catVar || '']) === word);
      return !!row;
    });
    
    if (catVar && categoryValue) {
      const count = dataRows.filter(row => String(row[catVar]) === categoryValue).length;
      return {
        message: `There are ${count} records where ${catVar} is "${categoryValue}".`
      };
    } else if (catVar) {
      // Count per category
      const categories = new Map<string, number>();
      
      dataRows.forEach(row => {
        const value = String(row[catVar] || '');
        if (value) {
          categories.set(value, (categories.get(value) || 0) + 1);
        }
      });
      
      const categoriesText = Array.from(categories.entries())
        .map(([category, count]) => `- ${category}: ${count}`)
        .join('\n');
      
      return {
        message: `Here's the count for each ${catVar} category:\n\n${categoriesText}`
      };
    }
  }
  
  if (lowerQuery.includes('insight') || lowerQuery.includes('tell me about')) {
    let content = "Based on my analysis of your data:";
    
    if (mentionedVariables.length > 0) {
      const variable = mentionedVariables[0];
      content = `Based on my analysis of ${variable}:`;
      
      if (summary.numericColumns.includes(variable)) {
        const values = dataRows.map(row => Number(row[variable])).filter(val => !isNaN(val));
        const average = values.reduce((sum, val) => sum + val, 0) / values.length;
        const max = Math.max(...values);
        const min = Math.min(...values);
        
        content += "\n\n1. The average value is " + average.toFixed(2) + ".";
        content += "\n\n2. The highest value is " + max.toFixed(2) + ".";
        content += "\n\n3. The lowest value is " + min.toFixed(2) + ".";
      } else if (summary.categoricalColumns.includes(variable)) {
        const categories = new Map<string, number>();
        dataRows.forEach(row => {
          const value = String(row[variable] || '');
          if (value) {
            categories.set(value, (categories.get(value) || 0) + 1);
          }
        });
        
        const sortedCategories = Array.from(categories.entries())
          .sort((a, b) => b[1] - a[1]);
        
        if (sortedCategories.length > 0) {
          content += "\n\n1. The most common category is '" + sortedCategories[0][0] + 
            "', representing " + ((sortedCategories[0][1] / dataRows.length) * 100).toFixed(1) + "% of the data.";
        }
        
        if (sortedCategories.length > 1) {
          content += "\n\n2. The second most common is '" + sortedCategories[1][0] + 
            "', with " + ((sortedCategories[1][1] / dataRows.length) * 100).toFixed(1) + "% of records.";
        }
        
        content += "\n\n3. There are " + sortedCategories.length + " unique categories in total.";
      }
    } else {
      // General insights
      content += "\n\n1. Your dataset contains " + dataRows.length + " records and " + headers.length + " variables.";
      content += "\n\n2. There are " + summary.numericColumns.length + " numerical and " + 
        summary.categoricalColumns.length + " categorical variables.";
      
      // Find the categorical variable with the most unique values
      if (summary.categoricalColumns.length > 0) {
        const categoryCounts = summary.categoricalColumns.map(catVar => {
          const uniqueValues = new Set(dataRows.map(row => String(row[catVar])));
          return { variable: catVar, count: uniqueValues.size };
        });
        
        const mostDiverse = categoryCounts.sort((a, b) => b.count - a.count)[0];
        content += "\n\n3. The variable with the most diversity is '" + mostDiverse.variable + 
          "' with " + mostDiverse.count + " unique values.";
      }
    }
    
    return {
      message: content
    };
  }
  
  // Default response
  return {
    message: "I'm here to help you analyze your data. You can ask me to show visualizations, calculate statistics, or provide insights about specific variables."
  };
};
