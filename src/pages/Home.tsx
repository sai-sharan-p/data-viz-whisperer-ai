
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, BarChart, MessageCircle, Target, Share, Clock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <header className="border-b border-gray-700 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">D</span>
              </div>
              <span className="text-xl font-bold text-white">datagpt</span>
            </div>
            <div className="flex items-center gap-6">
              <nav className="hidden md:flex items-center gap-6">
                <span className="text-gray-300 hover:text-white cursor-pointer">Product</span>
                <span className="text-gray-300 hover:text-white cursor-pointer">Solutions</span>
                <span className="text-gray-300 hover:text-white cursor-pointer">Resources</span>
                <span className="text-gray-300 hover:text-white cursor-pointer">Company</span>
              </nav>
              <div className="flex items-center gap-3">
                <span className="text-gray-300 hover:text-white cursor-pointer">Sign in</span>
                <Link to="/analytics">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
                    Schedule a demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-6">
                <span className="text-purple-400 text-lg font-semibold">DataGPT</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                Stop Drowning in Spreadsheets. Craft Leadership-Ready Financial Reports in{" "}
                <span className="text-purple-400">Minutes.</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Empower your finance team to instantly analyze data, visualize key metrics, and generate 
                insightful reports for leadership—without the usual manual grind.
              </p>
              <Link to="/analytics">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-full">
                  Schedule a Demo
                </Button>
              </Link>
            </div>
            <div className="lg:pl-8">
              <div className="relative">
                <img 
                  src="/lovable-uploads/888d42ea-c360-4ee9-b16d-c73c83c18eb2.png" 
                  alt="DataGPT Analytics Dashboard" 
                  className="w-full rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: The Challenge */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            The Challenge You Understand
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3 text-white">Data Wrestling</h3>
                <p className="text-gray-300">
                  Is your team spending more time wrestling with raw data and building charts than 
                  on strategic financial analysis?
                </p>
              </CardContent>
            </Card>
            <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3 text-white">Manual Grind</h3>
                <p className="text-gray-300">
                  Do you dread the tedious, time-consuming process of manually creating weekly or 
                  monthly reports for the leadership team?
                </p>
              </CardContent>
            </Card>
            <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3 text-white">Slow Insights</h3>
                <p className="text-gray-300">
                  Are you looking for a faster way to uncover actionable insights from your 
                  financial data and communicate them clearly?
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 2: Product Introduction */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                DataGPT is <span className="text-purple-400">not</span> Another SQL Wrapper
              </h2>
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                DataGPT's AI Analysts doesn't just translate text into a simple SQL query. It develops a plan, executes that plan by 
                making meaningful comparisons and deep dives into the data, and curates the results— transforming a question into 
                meaningful, actionable analysis.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                The result: Trusted analysis that goes deeper into the most important insights in your data.
              </p>
            </div>
            <div>
              <img 
                src="/lovable-uploads/701ddce3-81dc-43ef-86c7-0ba61ac0d924.png" 
                alt="DataGPT vs SQL Wrappers Comparison" 
                className="w-full rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Key Benefits & Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            BI is outdated and text-to-SQL AI is underwhelming.
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto">
            DataGPT was created with a relentless focus on enabling all users to go beyond dashboards 
            and find the more meaningful insights in the data. No more reporting backlogs, dashboard 
            paralysis, or vanity metrics.
          </p>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="text-left">
              <h3 className="text-3xl font-bold mb-6">Q&A at Your Fingertips</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                Know what you're looking for? Simply ask DataGPT in natural 
                language and receive analyst-grade answers in seconds.
              </p>
            </div>
            <div>
              <img 
                src="/lovable-uploads/6517e1cd-4f6d-4f34-b8a0-7191037d67ad.png" 
                alt="Q&A Interface" 
                className="w-full rounded-lg shadow-2xl"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/lovable-uploads/1928e334-0778-4cfa-bf38-3c3039708dde.png" 
                alt="Proactive Insights Dashboard" 
                className="w-full rounded-lg shadow-2xl"
              />
            </div>
            <div className="text-left">
              <h3 className="text-3xl font-bold mb-6">Proactive Insights</h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Let your data speak to you. Set up custom Daily Summaries and 
                Email Notifications that proactively analyze your data and highlight 
                critical anomalies, trends, and key drivers.
              </p>
              <h3 className="text-3xl font-bold mb-6">Freely explore your data</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                The Data Navigator empowers every team member to explore data 
                with ease. View key metrics, drill down into details, and uncover the 
                "why" behind changes, all with complete accuracy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Financial Reporting?</h2>
          <p className="text-xl mb-8 text-gray-300">
            Join financial professionals who are already saving hours every week with DataGPT.
          </p>
          <Link to="/analytics">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-full">
              Schedule a Demo
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-xs">D</span>
              </div>
              <span className="text-lg font-bold">datagpt</span>
            </div>
            <p className="text-gray-400">© 2024 DataGPT. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
