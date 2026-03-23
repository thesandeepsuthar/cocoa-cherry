"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ReactECharts from "echarts-for-react";

// Loading Skeleton for Charts
function ChartSkeleton({ height = "300px" }) {
  return (
    <div 
      className="bg-noir-light rounded-xl border border-cream/10 animate-pulse flex items-center justify-center"
      style={{ height }}
    >
      <div className="text-cream/40">Loading chart...</div>
    </div>
  );
}

// Empty State for Charts
function EmptyChart({ title, height = "300px" }) {
  return (
    <div 
      className="bg-noir-light rounded-xl border border-cream/10 flex flex-col items-center justify-center"
      style={{ height }}
    >
      <span className="material-symbols-outlined text-4xl text-cream/40 mb-2">
        analytics
      </span>
      <h3 className="text-lg font-bold text-cream mb-1">{title}</h3>
      <p className="text-sm text-cream/60">No data available yet</p>
    </div>
  );
}

// Orders Chart Component
function OrdersChart({ data, loading }) {
  if (loading) return <ChartSkeleton />;
  if (!data || data.length === 0) return <EmptyChart title="Orders & Revenue Trend" />;

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: 'Orders & Revenue Trend',
      textStyle: {
        color: '#F5F1E8',
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#2A2A2A',
      borderColor: '#D4A574',
      textStyle: {
        color: '#F5F1E8'
      }
    },
    legend: {
      data: ['Orders', 'Revenue'],
      textStyle: {
        color: '#F5F1E8'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map(item => item._id),
      axisLine: {
        lineStyle: {
          color: '#D4A574'
        }
      },
      axisLabel: {
        color: '#F5F1E8'
      }
    },
    yAxis: [
      {
        type: 'value',
        name: 'Orders',
        position: 'left',
        axisLine: {
          lineStyle: {
            color: '#D4A574'
          }
        },
        axisLabel: {
          color: '#F5F1E8'
        }
      },
      {
        type: 'value',
        name: 'Revenue (₹)',
        position: 'right',
        axisLine: {
          lineStyle: {
            color: '#D4A574'
          }
        },
        axisLabel: {
          color: '#F5F1E8',
          formatter: '₹{value}'
        }
      }
    ],
    series: [
      {
        name: 'Orders',
        type: 'line',
        yAxisIndex: 0,
        data: data.map(item => item.count),
        smooth: true,
        lineStyle: {
          color: '#D4A574'
        },
        itemStyle: {
          color: '#D4A574'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(212, 165, 116, 0.3)'
            }, {
              offset: 1, color: 'rgba(212, 165, 116, 0.1)'
            }]
          }
        }
      },
      {
        name: 'Revenue',
        type: 'line',
        yAxisIndex: 1,
        data: data.map(item => item.revenue || 0),
        smooth: true,
        lineStyle: {
          color: '#8B4513'
        },
        itemStyle: {
          color: '#8B4513'
        }
      }
    ]
  };

  return (
    <div className="bg-noir-light rounded-xl p-4 border border-cream/10">
      <ReactECharts option={option} style={{ height: '300px' }} />
    </div>
  );
}

// Order Status Pie Chart
function OrderStatusChart({ data, loading }) {
  if (loading) return <ChartSkeleton />;
  if (!data || data.length === 0) return <EmptyChart title="Order Status Distribution" />;

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: 'Order Status Distribution',
      textStyle: {
        color: '#F5F1E8',
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: '#2A2A2A',
      borderColor: '#D4A574',
      textStyle: {
        color: '#F5F1E8'
      }
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        color: '#F5F1E8'
      }
    },
    series: [
      {
        name: 'Order Status',
        type: 'pie',
        radius: '50%',
        data: data.map(item => ({
          value: item.count,
          name: item._id || 'Unknown'
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        itemStyle: {
          borderRadius: 5,
          borderColor: '#2A2A2A',
          borderWidth: 2
        }
      }
    ]
  };

  return (
    <div className="bg-noir-light rounded-xl p-4 border border-cream/10">
      <ReactECharts option={option} style={{ height: '300px' }} />
    </div>
  );
}

// Simple Bar Chart for various metrics
function SimpleBarChart({ data, title, loading, dataKey = 'count', labelKey = '_id' }) {
  if (loading) return <ChartSkeleton />;
  if (!data || data.length === 0) return <EmptyChart title={title} />;

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: title,
      textStyle: {
        color: '#F5F1E8',
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#2A2A2A',
      borderColor: '#D4A574',
      textStyle: {
        color: '#F5F1E8'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item[labelKey]),
      axisLine: {
        lineStyle: {
          color: '#D4A574'
        }
      },
      axisLabel: {
        color: '#F5F1E8'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#D4A574'
        }
      },
      axisLabel: {
        color: '#F5F1E8'
      }
    },
    series: [
      {
        data: data.map(item => item[dataKey]),
        type: 'bar',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: '#D4A574'
            }, {
              offset: 1, color: '#8B4513'
            }]
          },
          borderRadius: [4, 4, 0, 0]
        }
      }
    ]
  };

  return (
    <div className="bg-noir-light rounded-xl p-4 border border-cream/10">
      <ReactECharts option={option} style={{ height: '300px' }} />
    </div>
  );
}

// Main Analytics Component
export default function Analytics({ adminKey, showToast }) {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/analytics?period=${period}`);
      const data = await res.json();
      
      if (data.success) {
        setAnalyticsData(data.data);
      } else {
        showToast(data.error || "Failed to load analytics", "error");
        console.error("Analytics error:", data.details);
      }
    } catch (error) {
      console.error("Analytics fetch error:", error);
      showToast("Failed to load analytics", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2
            className="text-2xl sm:text-3xl font-bold text-cream mb-1"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Analytics
          </h2>
          <p className="text-sm text-cream-muted">
            Insights and trends for your business
          </p>
        </div>
        
        {/* Period Selector */}
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 rounded-lg bg-noir-light border border-cream/20 text-cream text-sm focus:border-rose focus:ring-2 focus:ring-rose/20"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          
          <button
            onClick={fetchAnalytics}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cream/20 text-cream text-sm hover:bg-cream/5 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">refresh</span>
            Refresh
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders & Revenue Chart */}
        <OrdersChart 
          data={analyticsData?.orders || []} 
          loading={loading} 
        />
        
        {/* Order Status Chart */}
        <OrderStatusChart 
          data={analyticsData?.orderStatus || []} 
          loading={loading} 
        />
        
        {/* Rating Distribution Chart */}
        <SimpleBarChart
          data={analyticsData?.ratingDistribution || []}
          title="Rating Distribution"
          loading={loading}
          dataKey="count"
          labelKey="_id"
        />
        
        {/* User Registrations Chart */}
        <SimpleBarChart
          data={analyticsData?.userRegistrations || []}
          title="User Registrations"
          loading={loading}
          dataKey="count"
          labelKey="_id"
        />
      </div>

      {/* Top Products Chart - Full Width */}
      {analyticsData?.topProducts && analyticsData.topProducts.length > 0 && (
        <SimpleBarChart
          data={analyticsData.topProducts}
          title="Top Products by Orders"
          loading={loading}
          dataKey="totalOrdered"
          labelKey="name"
        />
      )}

      {/* Summary Stats */}
      {analyticsData && (
        <div className="bg-noir-light rounded-xl p-6 border border-cream/10">
          <h3 className="text-lg font-bold text-cream mb-4">Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-rose">
                {analyticsData.orders?.reduce((sum, item) => sum + item.count, 0) || 0}
              </div>
              <div className="text-sm text-cream-muted">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-rose">
                ₹{analyticsData.orders?.reduce((sum, item) => sum + (item.revenue || 0), 0) || 0}
              </div>
              <div className="text-sm text-cream-muted">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-rose">
                {analyticsData.userRegistrations?.reduce((sum, item) => sum + item.count, 0) || 0}
              </div>
              <div className="text-sm text-cream-muted">New Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-rose">
                {analyticsData.reviews?.reduce((sum, item) => sum + item.count, 0) || 0}
              </div>
              <div className="text-sm text-cream-muted">New Reviews</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}