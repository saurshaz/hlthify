import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FileText, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Mock data for demonstration
const reports = [
  { id: 1, title: 'Monthly Report', date: '2025-01-15', uri: 'mock-uri-1' },
  { id: 2, title: 'Quarterly Analysis', date: '2025-01-10', uri: 'mock-uri-2' },
  { id: 3, title: 'Annual Review', date: '2025-01-05', uri: 'mock-uri-3' },
];

export default function HistoryScreen() {
  const router = useRouter();

  const openReport = (uri: string) => {
    router.push({
      pathname: '/report',
      params: { uri }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Document History</Text>
      <ScrollView style={styles.scrollView}>
        {reports.map((report) => (
          <TouchableOpacity
            key={report.id}
            style={styles.reportCard}
            onPress={() => openReport(report.uri)}
          >
            <View style={styles.reportInfo}>
              <FileText size={24} color="#6366f1" />
              <View style={styles.reportDetails}>
                <Text style={styles.reportTitle}>{report.title}</Text>
                <Text style={styles.reportDate}>{report.date}</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9ca3af" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  reportCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reportInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reportDetails: {
    gap: 4,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  reportDate: {
    fontSize: 14,
    color: '#6b7280',
  },
});