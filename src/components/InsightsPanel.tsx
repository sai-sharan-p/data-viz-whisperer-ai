
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Insight } from "@/utils/dataAnalysis";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BadgeInfo, Sparkles, TrendingUp, ChevronRight, Lightbulb } from "lucide-react";

interface InsightsPanelProps {
  insights: Insight[];
  isLoading?: boolean;
}

const InsightsPanel = ({ insights, isLoading = false }: InsightsPanelProps) => {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Top Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-4 w-24 bg-muted rounded mb-2" />
                  <div className="h-3 w-full bg-muted rounded mb-1" />
                  <div className="h-3 w-3/4 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (insights.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Top Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-[calc(100%-4rem)] items-center justify-center text-center p-4">
          <div>
            <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No insights available yet. Select a target variable to analyze.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Top Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <InsightCard key={insight.id} insight={insight} rank={index + 1} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

interface InsightCardProps {
  insight: Insight;
  rank: number;
}

const InsightCard = ({ insight, rank }: InsightCardProps) => {
  const getInsightIcon = () => {
    // Use different icons based on the insight title/content
    if (insight.title.toLowerCase().includes('correlation') || 
        insight.title.toLowerCase().includes('relationship')) {
      return <TrendingUp className="h-4 w-4" />;
    }
    
    return <BadgeInfo className="h-4 w-4" />;
  };
  
  const importanceColor = 
    insight.importance > 7 ? 'text-orange-500 bg-orange-50' :
    insight.importance > 5 ? 'text-blue-500 bg-blue-50' :
    'text-green-500 bg-green-50';

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${importanceColor}`}>
                {rank}
              </div>
              <h3 className="font-medium text-sm">{insight.title}</h3>
            </div>
            <div className={`text-xs ${importanceColor} px-2 py-0.5 rounded-full`}>
              {insight.importance > 7 ? 'High' : insight.importance > 5 ? 'Medium' : 'Low'} impact
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {insight.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightsPanel;
