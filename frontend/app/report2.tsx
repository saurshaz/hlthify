import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Download, Share2 } from 'lucide-react-native';
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
  VictoryPie,
  VictoryBar,
} from 'victory-native';
import { Icon } from '../components/Icon';

// Mock data for demonstration
const lipidData = {
  patientName: "John Doe",
  age: 45,
  date: "2025-01-20",
  totalCholesterol: 180,
  hdl: 50,
  ldl: 110,
  triglycerides: 150,
  trends: [
    { month: "Jan", cholesterol: 190 },
    { month: "Feb", cholesterol: 185 },
    { month: "Mar", cholesterol: 182 },
    { month: "Apr", cholesterol: 180 },
  ],
  distribution: [
    { x: "HDL", y: 25 },
    { x: "LDL", y: 55 },
    { x: "VLDL", y: 20 },
  ],
  recommendations: [
    "Maintain a balanced diet rich in fiber",
    "Exercise regularly, at least 30 minutes daily",
    "Limit saturated fats intake",
    "Consider increasing omega-3 rich foods",
  ],
};

export default function ReportScreen() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState('overview');

  const chartWidth = Platform.OS === 'web' ? Math.min(600, width - 40) : width - 40;

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Cholesterol</Text>
          <Text style={styles.statValue}>{lipidData.totalCholesterol}</Text>
          <Text style={styles.statUnit}>mg/dL</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>HDL</Text>
          <Text style={styles.statValue}>{lipidData.hdl}</Text>
          <Text style={styles.statUnit}>mg/dL</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>LDL</Text>
          <Text style={styles.statValue}>{lipidData.ldl}</Text>
          <Text style={styles.statUnit}>mg/dL</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Triglycerides</Text>
          <Text style={styles.statValue}>{lipidData.triglycerides}</Text>
          <Text style={styles.statUnit}>mg/dL</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Cholesterol Distribution</Text>
        <VictoryPie
          data={lipidData.distribution}
          width={chartWidth}
          height={250}
          colorScale={["#4ade80", "#fb923c", "#60a5fa"]}
          innerRadius={50}
          labelRadius={({ innerRadius }) => (innerRadius + 80) as number}
          style={{ labels: { fill: "#1f2937", fontSize: 14 } }}
        />
      </View>
    </View>
  );

  const renderTrendsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Cholesterol Trends</Text>
        <VictoryChart
          theme={VictoryTheme.material}
          width={chartWidth}
          height={300}
        >
          <VictoryLine
            style={{
              data: { stroke: "#6366f1" },
              parent: { border: "1px solid #ccc" }
            }}
            data={lipidData.trends}
            x="month"
            y="cholesterol"
          />
          <VictoryAxis
            style={{
              tickLabels: { fontSize: 12, padding: 5 }
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              tickLabels: { fontSize: 12, padding: 5 }
            }}
          />
        </VictoryChart>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Monthly Comparison</Text>
        <VictoryChart
          theme={VictoryTheme.material}
          width={chartWidth}
          height={300}
          domainPadding={20}
        >
          <VictoryBar
            data={lipidData.trends}
            x="month"
            y="cholesterol"
            style={{
              data: { fill: "#6366f1" }
            }}
          />
          <VictoryAxis
            style={{
              tickLabels: { fontSize: 12, padding: 5 }
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              tickLabels: { fontSize: 12, padding: 5 }
            }}
          />
        </VictoryChart>
      </View>
    </View>
  );

  const renderRecommendationsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.recommendationsContainer}>
        <Text style={styles.recommendationsTitle}>Recommendations</Text>
        {lipidData.recommendations.map((recommendation, index) => (
          <View key={index} style={styles.recommendationItem}>
            <View style={styles.recommendationBullet} />
            <Text style={styles.recommendationText}>{recommendation}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Icon icon={ArrowLeft} size={24} color="#1f2937" />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Lipid Profile Report</Text>
            <Text style={styles.subtitle}>{lipidData.patientName} • {lipidData.date}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon icon={Download} size={20} color="#6366f1" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon icon={Share2} size={20} color="#6366f1" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'trends' && styles.activeTab]}
          onPress={() => setActiveTab('trends')}
        >
          <Text style={[styles.tabText, activeTab === 'trends' && styles.activeTabText]}>
            Trends
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'recommendations' && styles.activeTab]}
          onPress={() => setActiveTab('recommendations')}
        >
          <Text style={[styles.tabText, activeTab === 'recommendations' && styles.activeTabText]}>
            Recommendations
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'trends' && renderTrendsTab()}
        {activeTab === 'recommendations' && renderRecommendationsTab()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  iconButton: {
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  tabs: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#6366f1',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#6366f1',
  },
  content: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  tabContent: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: Platform.OS === 'web' ? 150 : '45%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  statUnit: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  recommendationsContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendationBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366f1',
    marginRight: 12,
  },
  recommendationText: {
    flex: 1,
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
  },
});