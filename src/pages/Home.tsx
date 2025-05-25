
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, BarChart, MessageCircle, Target, Share, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dataviz-background to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart className="h-8 w-8 text-dataviz-teal" />
              <span className="text-xl font-bold text-dataviz-blue">DataViz Pro</span>
            </div>
            <Link to="/analytics">
              <Button variant="outline">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-dataviz-blue leading-tight mb-6">
                Stop Drowning in Spreadsheets. Craft Leadership-Ready Financial Reports in{" "}
                <span className="text-dataviz-teal">Minutes.</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Empower your finance team to instantly analyze data, visualize key metrics, and generate 
                insightful reports for leadership—without the usual manual grind.
              </p>
              <Link to="/analytics">
                <Button size="lg" className="bg-dataviz-teal hover:bg-dataviz-teal/90 text-white px-8 py-3 text-lg">
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="lg:pl-8">
              <div className="bg-white rounded-lg shadow-2xl p-6 border">
                <div className="h-64 bg-gradient-to-br from-dataviz-teal/10 to-dataviz-blue/10 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart className="h-16 w-16 text-dataviz-teal mx-auto mb-4" />
                    <p className="text-dataviz-blue font-semibold">Clean Financial Dashboard</p>
                    <p className="text-gray-600 text-sm">Presentation-ready visualizations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: The Challenge */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-dataviz-blue text-center mb-12">
            The Challenge You Understand
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3 text-dataviz-blue">Data Wrestling</h3>
                <p className="text-gray-600">
                  Is your team spending more time wrestling with raw data and building charts than 
                  on strategic financial analysis?
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3 text-dataviz-blue">Manual Grind</h3>
                <p className="text-gray-600">
                  Do you dread the tedious, time-consuming process of manually creating weekly or 
                  monthly reports for the leadership team?
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3 text-dataviz-blue">Slow Insights</h3>
                <p className="text-gray-600">
                  Are you looking for a faster way to uncover actionable insights from your 
                  financial data and communicate them clearly?
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 2: Introducing the Product */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-dataviz-blue mb-6">
            Introducing DataViz Pro - Your Financial Reporting Co-Pilot
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            DataViz Pro is a powerful yet intuitive data analytics web app, customized for financial professionals. 
            We help middle managers, team leads, and senior managers like you transform complex financial data 
            into clear, concise, and compelling reports for leadership—in a fraction of the time.
          </p>
        </div>
      </section>

      {/* Section 3: Key Benefits & Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-dataviz-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-dataviz-blue text-center mb-12">
            How We Help You Shine
          </h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-dataviz-teal/10 rounded-lg">
                    <Zap className="h-6 w-6 text-dataviz-teal" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-dataviz-blue mb-2">Accelerate Reporting Cycles</h3>
                    <p className="text-gray-600 mb-3">
                      Go from raw data to polished report in minutes, not hours or days.
                    </p>
                    <p className="text-sm text-dataviz-teal font-medium">
                      Feature: Upload your financial data (CSV, Excel), and let our smart system guide you.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-dataviz-teal/10 rounded-lg">
                    <BarChart className="h-6 w-6 text-dataviz-teal" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-dataviz-blue mb-2">Visualize with Impact</h3>
                    <p className="text-gray-600 mb-3">
                      Create presentation-ready charts and dashboards tailored for financial storytelling.
                    </p>
                    <p className="text-sm text-dataviz-teal font-medium">
                      Feature: Choose from finance-specific templates (P&L summaries, variance analyses, KPI dashboards) or build your own.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-dataviz-teal/10 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-dataviz-teal" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-dataviz-blue mb-2">Uncover Instant Insights</h3>
                    <p className="text-gray-600 mb-3">
                      "Talk" to your data in plain English and get immediate answers to your financial questions.
                    </p>
                    <p className="text-sm text-dataviz-teal font-medium">
                      Feature: Ask "What's our YTD revenue growth?" or "Compare expenses for Q1 vs Q2" and see results instantly.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-dataviz-teal/10 rounded-lg">
                    <Target className="h-6 w-6 text-dataviz-teal" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-dataviz-blue mb-2">Focus on What Matters</h3>
                    <p className="text-gray-600 mb-3">
                      Quickly identify trends, anomalies, and key performance indicators crucial for leadership updates.
                    </p>
                    <p className="text-sm text-dataviz-teal font-medium">
                      Feature: Automated insight suggestions highlight critical data points for your narrative.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-dataviz-teal/10 rounded-lg">
                  <Share className="h-6 w-6 text-dataviz-teal" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-dataviz-blue mb-2">Communicate with Clarity</h3>
                  <p className="text-gray-600 mb-3">
                    Export your findings in formats perfect for presentations and leadership reviews.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 4: Built for Financial Teams */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-dataviz-blue text-center mb-8">
            Built for Financial Teams Like Yours
          </h2>
          <Card className="border-dataviz-teal/30">
            <CardContent className="p-8">
              <p className="text-lg text-gray-600 mb-6 text-center">
                We understand the unique pressures and needs of financial reporting. DataViz Pro is designed to:
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-dataviz-teal/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="h-6 w-6 text-dataviz-teal" />
                  </div>
                  <p className="font-semibold text-dataviz-blue">Support Common Formats</p>
                  <p className="text-sm text-gray-600">Work with your existing financial data formats</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-dataviz-teal/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="h-6 w-6 text-dataviz-teal" />
                  </div>
                  <p className="font-semibold text-dataviz-blue">Speak Your Language</p>
                  <p className="text-sm text-gray-600">Financial terminology and KPI understanding built-in</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-dataviz-teal/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="h-6 w-6 text-dataviz-teal" />
                  </div>
                  <p className="font-semibold text-dataviz-blue">Build Trust</p>
                  <p className="text-sm text-gray-600">Accurate, easy-to-understand visuals and insights</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dataviz-blue text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Financial Reporting?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join financial professionals who are already saving hours every week with DataViz Pro.
          </p>
          <Link to="/analytics">
            <Button size="lg" variant="secondary" className="bg-white text-dataviz-blue hover:bg-gray-100 px-8 py-3 text-lg">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart className="h-6 w-6 text-dataviz-teal" />
              <span className="text-lg font-bold">DataViz Pro</span>
            </div>
            <p className="text-gray-400">© 2024 DataViz Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
