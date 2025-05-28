import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, BarChart, MessageCircle, Target, Share, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <BarChart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">FinFlow</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/auth">
                <Button variant="outline" className="bg-white text-slate-900 hover:bg-gray-100">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                FinFlow: Stop Drowning in Spreadsheets. Craft Leadership-Ready Financial Reports in{" "}
                <span className="text-blue-600">Minutes.</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Empower your finance team to instantly analyze data, visualize key metrics, and generate 
                insightful reports for leadership—without the usual manual grind.
              </p>
              <Link to="/auth">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg">
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="lg:pl-8">
              <div className="bg-white rounded-lg shadow-2xl p-6 border">
                <div className="h-80 bg-slate-50 rounded-lg p-4">
                  {/* Dashboard Mockup */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900">Revenue Analysis</h3>
                        <p className="text-sm text-slate-600">Financial Dashboard</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900">$1,614,045.61</p>
                        <p className="text-sm text-slate-500">vs. $1,598,639.30</p>
                      </div>
                    </div>
                    
                    {/* Chart placeholder */}
                    <div className="h-40 bg-gradient-to-r from-blue-100 to-slate-100 rounded-lg flex items-center justify-center relative">
                      <svg className="w-full h-full" viewBox="0 0 300 120">
                        <polyline
                          fill="none"
                          stroke="#2563eb"
                          strokeWidth="2"
                          points="10,80 50,60 90,70 130,40 170,45 210,35 250,50 290,30"
                        />
                        <polyline
                          fill="none"
                          stroke="#475569"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                          points="10,90 50,85 90,88 130,75 170,78 210,70 250,75 290,65"
                        />
                      </svg>
                      <div className="absolute bottom-2 right-2 bg-white rounded px-2 py-1 text-xs shadow">
                        <span className="text-blue-600">● Trend</span>
                        <span className="text-slate-600 ml-2">● Expected</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500">Growth</p>
                        <p className="font-semibold text-blue-600">+2.4%</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Variance</p>
                        <p className="font-semibold text-slate-900">1.0%</p>
                      </div>
                      <div>
                        <p className="text-slate-500">YTD</p>
                        <p className="font-semibold text-slate-900">$18.2M</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-slate-700 font-semibold">Clean Financial Dashboard</p>
                  <p className="text-slate-500 text-sm">Presentation-ready visualizations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: The Challenge */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            The Challenge You Understand
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3 text-slate-900">Data Wrestling</h3>
                <p className="text-slate-600">
                  Is your team spending more time wrestling with raw data and building charts than 
                  on strategic financial analysis?
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3 text-slate-900">Manual Grind</h3>
                <p className="text-slate-600">
                  Do you dread the tedious, time-consuming process of manually creating weekly or 
                  monthly reports for the leadership team?
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3 text-slate-900">Slow Insights</h3>
                <p className="text-slate-600">
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
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Introducing FinFlow - Your Financial Reporting Co-Pilot
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed">
            FinFlow is a powerful yet intuitive data analytics web app, customized for financial professionals. 
            We help middle managers, team leads, and senior managers like you transform complex financial data 
            into clear, concise, and compelling reports for leadership—in a fraction of the time.
          </p>
        </div>
      </section>

      {/* Section 3: Key Benefits & Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            How We Help You Shine
          </h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Accelerate Reporting Cycles</h3>
                    <p className="text-slate-600 mb-3">
                      Go from raw data to polished report in minutes, not hours or days.
                    </p>
                    <p className="text-sm text-blue-600 font-medium">
                      Feature: Upload your financial data (CSV, Excel), and let our smart system guide you.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BarChart className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Visualize with Impact</h3>
                    <p className="text-slate-600 mb-3">
                      Create presentation-ready charts and dashboards tailored for financial storytelling.
                    </p>
                    <p className="text-sm text-blue-600 font-medium">
                      Feature: Choose from finance-specific templates (P&L summaries, variance analyses, KPI dashboards) or build your own.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Uncover Instant Insights</h3>
                    <p className="text-slate-600 mb-3">
                      "Talk" to your data in plain English and get immediate answers to your financial questions.
                    </p>
                    <p className="text-sm text-blue-600 font-medium">
                      Feature: Ask "What's our YTD revenue growth?" or "Compare expenses for Q1 vs Q2" and see results instantly.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Focus on What Matters</h3>
                    <p className="text-slate-600 mb-3">
                      Quickly identify trends, anomalies, and key performance indicators crucial for leadership updates.
                    </p>
                    <p className="text-sm text-blue-600 font-medium">
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
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Share className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Communicate with Clarity</h3>
                  <p className="text-slate-600 mb-3">
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
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">
            Built for Financial Teams Like Yours
          </h2>
          <Card className="border-blue-200">
            <CardContent className="p-8">
              <p className="text-lg text-slate-600 mb-6 text-center">
                We understand the unique pressures and needs of financial reporting. FinFlow is designed to:
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="font-semibold text-slate-900">Support Common Formats</p>
                  <p className="text-sm text-slate-600">Work with your existing financial data formats</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="font-semibold text-slate-900">Speak Your Language</p>
                  <p className="text-sm text-slate-600">Financial terminology and KPI understanding built-in</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="font-semibold text-slate-900">Build Trust</p>
                  <p className="text-sm text-slate-600">Accurate, easy-to-understand visuals and insights</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Financial Reporting?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join financial professionals who are already saving hours every week with FinFlow.
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="bg-white text-slate-900 hover:bg-gray-100 px-8 py-3 text-lg">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart className="h-6 w-6 text-blue-500" />
              <span className="text-lg font-bold">FinFlow</span>
            </div>
            <p className="text-slate-400">© 2024 FinFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
