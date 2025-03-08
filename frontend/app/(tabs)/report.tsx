import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  SafeAreaView, View
} from 'react-native';

// Mock data - you can replace this with your actual data in your React Native project
const reportData = {
  "patient_information": {
    "name": "MR. SAURABH SHARMA",
    "age": 41,
    "gender": "Male",
    "referring_doctor": "SELF"
  },
  "sample_information": {
    "sample_type": "Serum",
    "collected_date": "Jul 13, 2023, 11:47 a.m.",
    "medid": 17779,
    "sample_id": "AA7513020",
    "received_date": "Jul 13, 2023, 12:28 p.m.",
    "client_name": "1GOGOA038A",
    "reported_date": "Jul 13, 2023, 01:18 p.m."
  },
  "test_results": {
      "cholesterol_total": {
        "value": 251,
        "unit": "mg/dL",
        "reference_range": {
          "<200": "Desirable",
          "200-239": "Borderline risk",
          ">240": "High risk"
        },
        "method": "Cholesterol Oxidase, Esterase, peroxidase"
      },
      "cholesterol_hdl": {
        "value": 39,
        "unit": "mg/dL",
        "reference_range": {
          "<40": "Low",
          "40-60": "Optimal",
          ">60": "Desirable"
        },
        "method": "Enzymatic Colorimetric"
      },
      "cholesterol_ldl": {
        "value": 173.8,
        "unit": "mg/dL",
        "reference_range": {
          "<100": "Normal",
          "100-129": "Desirable",
          "130-159": "Borderline-High",
          "160-189": "High",
          ">190": "Very High"
        },
        "method": "Enzymatic Colorimetric"
      },
      "cholesterol_vldl": {
        "value": 38.2,
        "unit": "mg/dL",
        "reference_range": "7-40",
        "method": "Calculated"
      },
      "triglycerides": {
        "value": 191,
        "unit": "mg/dL",
        "reference_range": {
          "<150": "Normal",
          "150-199": "Borderline-High",
          "200-499": "High",
          ">500": "Very High"
        },
        "method": "Lipase / Glycerol Kinase"
      },
      "total_cholesterol_hdl_ratio": {
        "value": 6.44,
        "unit": "Ratio",
        "reference_range": "0-5.0",
        "method": "Calculated"
      },
      "ldl_hdl_ratio": {
        "value": 4.46,
        "unit": "Ratio",
        "reference_range": "0-3.5",
        "method": "Calculated"
      },
  },
  "summary": {
    "total_cholesterol": "High",
    "hdl_cholesterol": "Low",
    "ldl_cholesterol": "High",
    "triglycerides": "Borderline-High"
  },
  "recommendations": {
    "lifestyle_changes": "Dietary modifications (low saturated and trans fats, increased fiber), regular exercise, and weight management are recommended.",
    "medical_advice": "Consult a physician for further evaluation and management, which may include medication if lifestyle changes are insufficient."
  }
};

const reportData_1 = {
  patient_information: {
    name: "MR. S K SHARMA",
    age: 73,
    gender: "Male",
    ref_doctor: "SELF",
    client_name: "1GOGOA038A",
    sample_id: "241110950",
    age_gender: "73 years / Male",
    reported_date: "Jul 06, 2024, 01:52 p.m.",
  },
  sample_information: {
    "sample_type": "Serum",
    "collected_date": "Jul 13, 2023, 11:47 a.m.",
    "medid": 17779,
    "sample_id": "AA7513020",
    "received_date": "Jul 13, 2023, 12:28 p.m.",
    "client_name": "1GOGOA038A",
    "reported_date": "Jul 13, 2023, 01:18 p.m."
  },
  test_results: {
    lipid_profile: {
      cholesterol_total: {
        value: 167.85,
        unit: "mg/dL",
        reference_range: "125 - 200", // General range for adults; no specific age adjustment needed.
        method: "Not specified",
      },
      ft3_free: {
        value: 3.65,
        unit: "pg/mL",
        reference_range: "2.3 - 4.2", // Standard range; no age adjustment needed.
        method: "CLIA",
      },
      tt4_total: {
        value: 8.9,
        unit: "µg/dL",
        reference_range: "4.6 - 12.5", // Standard range; no age adjustment needed.
        method: "CLIA",
      },
      tt4_free: {
        value: 1.14,
        unit: "ng/dL",
        reference_range: "0.80 - 2.70", // Standard range; no age adjustment needed.
        method: "CLIA",
      },
      tsh: {
        value: 3.79,
        unit: "uIU/mL",
        reference_range: "0.50 - 8.90", // Adjusted for >55 years.
        method: "Not specified",
      },
    },
    glycated_hemoglobin: {
      hba1c: {
        value: 10.7,
        unit: "%",
        reference_range: "< 6.0", // Non-diabetic range; no age adjustment needed.
        method: "Not specified",
      },
      estimated_average_glucose: {
        value: 260.39,
        unit: "%",
        reference_range: "70 - 136", // Standard range; no age adjustment needed.
        method: "Not specified",
      },
    },
    hematology: {
      hemoglobin: {
        value: 10.3,
        unit: "g/dL",
        reference_range: "13.0 - 17.0", // Standard male range; no age adjustment needed.
        method: "Photometry",
      },
      red_Cell_Count: {
        value: 4.7,
        unit: "mil/µL",
        reference_range: "4.5 - 5.5", // Standard male range; no age adjustment needed.
        method: "Electronic Impedance",
      },
      pcv_hematocrit: {
        value: 33.3,
        unit: "%",
        reference_range: "40 - 50", // Standard male range; no age adjustment needed.
        method: "Calculated",
      },
      platelet_count: {
        value: 5.81,
        unit: "lahk/Cumm",
        reference_range: "1.5 - 4.0", // Standard range; no age adjustment needed.
        method: "Electronic Impedance",
      },
      ernebrtok_cv: {
        value: 19.7,
        unit: "%",
        reference_range: "11.5 - 14.5", // Standard range; no age adjustment needed.
        method: "Not specified",
      },
      wbc_count: {
        value: 9200,
        unit: "cells/Cumm",
        reference_range: "4000 - 11000", // Standard range; no age adjustment needed.
        method: "Not specified",
      },
      neutrophils_percentage: {
        value: 60,
        unit: "%",
        reference_range: "40 - 75", // Standard range; no age adjustment needed.
        method: "Not specified",
      },
      lymphocytes_percentage: {
        value: 30,
        unit: "%",
        reference_range: "20 - 50", // Standard range; no age adjustment needed.
        method: "Not specified",
      },
      eosinophils_percentage: {
        value: 0.05,
        unit: "%",
        reference_range: "0 - 5", // Standard range; no age adjustment needed.
        method: "Not specified",
      },
      monocytes_percentage: {
        value: 0.05,
        unit: "%",
        reference_range: "0 - 10", // Standard range; no age adjustment needed.
        method: "Not specified",
      },
      basophils_percentage: {
        value: 0,
        unit: "%",
        reference_range: "0 - 2", // Standard range; no age adjustment needed.
        method: "Not specified",
      },
      esr: {
        value: 25,
        unit: "mm/Hour",
        reference_range: "< 20", // Adjusted for elderly males (>50 years).
        method: "Westergren's",
      },
    },
    calcium_phosphorus: {
      calcium: {
        value: 9.48,
        unit: "mg/dL",
        reference_range: "8.6 - 10.3", // Standard range; no age adjustment needed.
        method: "NM-Bapta complex",
      },
      phosphorus: {
        value: 3.24,
        unit: "mg/dL",
        reference_range: "2.5 - 4.5", // Standard range; no age adjustment needed.
        method: "Phosphomolybdate - UV",
      },
    },
    glucose_fasting: {
      glucose_fbs: {
        value: 178.53,
        unit: "mg/dL",
        reference_range: "70 - 105", // Standard range; no age adjustment needed.
        method: "Hexokinase",
      },
    },
  },
  summary: {
    patient_age_gender: "73 years old male.",
    lipid_profile_summary:
      "Lipid profile mostly within normal ranges, except for triglycerides which are borderline-high.",
    liver_function_summary: "Liver function tests are within normal limits.",
    kidney_function_summary: "Kidney function tests are within normal limits.",
    iron_profile_summary: "Iron profile is within normal limits.",
    thyroid_profile_summary: "Thyroid function is within normal limits.",
    glycated_hemoglobin_summary:
      "Glycated Hemoglobin (HbA1c) is significantly elevated, indicating potential diabetes.",
    hematology_summary:
      "Hematology parameters are within normal limits, except for ESR which is slightly elevated but within reference range.",
    calcium_phosphorus_summary:
      "Calcium is slightly below the lower limit of the reference range.",
    glucose_fasting_summary:
      "Fasting glucose is elevated, further supporting the suspicion of diabetes.",
    report_general_health_status:
      "Based on the provided test results, the patient appears to be in generally good health, but with potential concerns for diabetes and slightly low calcium levels. Further investigation and clinical correlation are recommended.",
  },
  recommendations: {
    diabetes_investigation:
      "Further investigation for diabetes is strongly recommended due to significantly elevated HbA1c and borderline-high fasting glucose. Consider HbA1c re-check and oral glucose tolerance test.",
    thyroid_function_monitoring:
      "While currently within normal limits, regular monitoring of thyroid function is advisable, especially given the patient's age.",
    vitamin_d_and_calcium_supplementation_recommendation:
      "Given the slightly low calcium level, and assuming the patient is not experiencing symptoms of hypercalcemia, taking a Vitamin D and Calcium supplement may be beneficial. Consultation with a physician is recommended for appropriate dosage and duration.",
    lifestyle_recommendations:
      "Advice on lifestyle modifications to manage potential diabetes, including dietary modifications and regular exercise, should be considered.",
    routine_checkups_recommended:
      "Regular routine checkups and follow-up appointments are recommended to monitor the patient's health status over time, particularly considering the elevated HbA1c and the slightly low calcium level.",
  },
}

// Status Badge component
const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    if (!status) return styles.badgeDefault;

    switch (status.toLowerCase()) {
      case 'high':
      case 'high risk':
      case 'very high':
        return styles.badgeDanger;
      case 'low':
        return styles.badgeLowAlert;
      case 'borderline-high':
      case 'borderline risk':
        return styles.badgeWarning;
      case 'normal':
      case 'desirable':
      case 'optimal':
        return styles.badgeSuccess;
      default:
        return styles.badgeDefault;
    }
  };

  return (
    <View style={[styles.badge, getStatusColor(status)]}>
      <Text style={styles.badgeText}>{status || "N/A"}</Text>
    </View>
  );
};

// Section Header component
const SectionHeader = ({ title, icon, isOpen, onPress }) => {
  // In React Native, we'll use text for icons since we can't directly use Lucide icons
  // In your actual project, you'll want to import appropriate icons from a library like react-native-vector-icons
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'user': return '👤';
      case 'test-tube': return '🧪';
      case 'activity': return '📊';
      case 'info': return 'ℹ️';
      case 'award': return '🏆';
      case 'file-text': return '📄';
      default: return '📋';
    }
  };

  return (
    <TouchableOpacity
      style={styles.sectionHeader}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.sectionHeaderContent}>
        <Text style={styles.sectionIcon}>{getIcon(icon)}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Text style={styles.chevron}>{isOpen ? '▲' : '▼'}</Text>
    </TouchableOpacity>
  );
};

// Report Value component
const ReportValue = ({ label, value, unit, status, reference }) => {
  // Format the reference range for display
  const formatReference = (reference) => {
    if (typeof reference === 'string') return reference;

    return Object.entries(reference)
      .map(([range, desc]) => `${range}: ${desc}`)
      .join(', ');
  };

  return (
    <View style={styles.valueContainer}>
      <View style={styles.labelContainer}>
        <Text style={styles.valueLabel}>{label}</Text>
      </View>

      <View style={styles.valueDataContainer}>
        <View style={styles.valueAndUnit}>
          <Text style={styles.valueText}>{value}</Text>
          {unit && <Text style={styles.unitText}>{unit}</Text>}
        </View>

        <View style={styles.statusContainer}>
          <StatusBadge status={status} />
          {reference && (
            <Text style={styles.referenceText}>
              Ref: {formatReference(reference)}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

// Collapsible Section component
const CollapsibleSection = ({ title, icon, children }) => {
  const [isOpen, setIsOpen] = useState(title === 'Summary');

  return (
    <View style={styles.section}>
      <SectionHeader
        title={title}
        icon={icon}
        isOpen={isOpen}
        onPress={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <View style={styles.sectionContent}>
          {children}
        </View>
      )}
    </View>
  );
};

// Main Lipid Profile Component
const LipidProfileNative = () => {
  // Function to determine status for lipid profile values
  const getValueStatus = (value, referenceRange) => {
    if (typeof referenceRange === 'string') {
      const [min, max] = referenceRange.split('-').map(Number);
      if (value < min) return 'Low';
      if (value > max) return 'High';
      return 'Normal';
    }

    // Handle object reference ranges
    for (const range in referenceRange) {
      if (range.startsWith('<')) {
        const threshold = Number(range.substring(1));
        if (value < threshold) return referenceRange[range];
      } else if (range.startsWith('>')) {
        const threshold = Number(range.substring(1));
        if (value > threshold) return referenceRange[range];
      } else if (range.includes('-')) {
        const [min, max] = range.split('-').map(Number);
        if (value >= min && value <= max) return referenceRange[range];
      }
    }

    return 'Out of Range';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>📄</Text>
        <Text style={styles.headerTitle}>Report Summary</Text>
      </View>

      <View style={styles.reportDate}>
        <Text style={styles.reportDateText}>
          Report generated: {reportData.sample_information.reported_date}
        </Text>
      </View>

      <CollapsibleSection title="Patient Information" icon="user">
        <ReportValue
          label="Name"
          value={reportData.patient_information.name}
        />
        <ReportValue
          label="Age"
          value={reportData.patient_information.age}
          unit="years"
        />
        <ReportValue
          label="Gender"
          value={reportData.patient_information.gender}
        />
        <ReportValue
          label="Referring Doctor"
          value={reportData.patient_information.referring_doctor}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Sample Information" icon="test-tube">
        <ReportValue
          label="Sample Type"
          value={reportData.sample_information.sample_type}
        />
        <ReportValue
          label="Sample ID"
          value={reportData.sample_information.sample_id}
        />
        <ReportValue
          label="Medical ID"
          value={reportData.sample_information.medid}
        />
        <ReportValue
          label="Collected Date"
          value={reportData.sample_information.collected_date}
        />
        <ReportValue
          label="Received Date"
          value={reportData.sample_information.received_date}
        />
        <ReportValue
          label="Reported Date"
          value={reportData.sample_information.reported_date}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Report Details" icon="activity">
        {Object.entries(reportData.test_results).map(([key, data]: [string, any]) => {
          const formattedKey = key.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');

          const status = getValueStatus(data.value, data.reference_range);

          return (
            <ReportValue
              key={key}
              label={formattedKey}
              value={data.value}
              unit={data.unit}
              status={status}
              reference={data.reference_range}
            />
          );
        })}
      </CollapsibleSection>

      <CollapsibleSection title="Summary" icon="info">
        {Object.entries(reportData.summary).map(([key, status]) => {
          const formattedKey = key.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');

          return (
            <ReportValue
              key={key}
              label={formattedKey}
              value={status}
              status={status}
            />
          );
        })}
      </CollapsibleSection>

      <CollapsibleSection title="Recommendations" icon="award">
        <View style={styles.recommendationContainer}>
          <View style={styles.recommendationSection}>
            <Text style={styles.recommendationTitle}>Lifestyle Changes</Text>
            <Text style={styles.recommendationText}>
              {reportData.recommendations.lifestyle_changes}
            </Text>
          </View>

          <View style={styles.recommendationSection}>
            <Text style={styles.recommendationTitle}>Medical Advice</Text>
            <Text style={styles.recommendationText}>
              {reportData.recommendations.medical_advice}
            </Text>
          </View>
        </View>
      </CollapsibleSection>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>🖨️ Print Report</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>⬇️ Download PDF</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const HealthRecord = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  // Toggle collapsible sections
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Helper function to determine risk color
  const getRiskColor = (value, range) => {
    if (!range || value === undefined) return null;

    const [min, max] = range.split('-').map(Number);
    if (value < min || value > max) return 'red'; // Out of range
    return 'green'; // Within range
  };

  // Sample data
  const [result, setResult] = useState(reportData);

  return (
    <ScrollView style={styles.container}>
      {/* Patient Info Section */}
      {/*  */}

      {/* Test Results Section */}
      <View style={styles.section}>
        <TouchableOpacity onPress={() => toggleSection('test_results')}>
          <Text style={styles.sectionHeader}>Test Results</Text>
        </TouchableOpacity>
        {expandedSections['test_results'] && (
          <View style={styles.sectionContent}>
            {Object.entries(result.test_results).map(([sectionName, sectionData]) => (
              <View key={sectionName} style={styles.subSection}>
                <Text style={styles.subSectionHeader}>{sectionName.replace(/_/g, ' ').toUpperCase()}</Text>
                {Object.entries(sectionData).map(([testName, testDetails]) => {
                  const riskColor = getRiskColor(
                    testDetails.value,
                    testDetails.reference_range?.split('(')[0].trim()
                  );
                  return (
                    <View key={testName} style={{ ...styles.testItem, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                      {/* Test Name */}
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ alignSelf: 'flex-start', marginRight: 5 }}>
                          {testName.replace(/_/g, ' ')}
                        </Text>

                        {/* Info Icon with Tooltip */}
                        {testDetails.method && (
                          <TouchableOpacity
                            onPress={() => setIsTooltipVisible(!isTooltipVisible)}
                            style={styles.infoIcon}
                          >
                            <Text style={styles.infoIconText}>?</Text>
                          </TouchableOpacity>
                        )}
                      </View>

                      {/* Test Value and Reference Range */}
                      <Text style={{ color: riskColor, textAlign: 'right' }}>
                        {testDetails.value} {testDetails.unit} ({testDetails.reference_range})
                      </Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Summary Section */}
      <View style={styles.section}>
        <TouchableOpacity onPress={() => toggleSection('summary')}>
          <Text style={styles.sectionHeader}>Summary</Text>
        </TouchableOpacity>
        {expandedSections['summary'] && (
          <View style={styles.sectionContent}>
            {Object.entries(result.summary).map(([key, value]) => (
              <Text key={key} style={styles.summaryText}>
                {value}
              </Text>
            ))}
          </View>
        )}
      </View>

      {/* Recommendations Section */}
      <View style={styles.section}>
        <TouchableOpacity onPress={() => toggleSection('recommendations')}>
          <Text style={styles.sectionHeader}>Recommendations</Text>
        </TouchableOpacity>
        {expandedSections['recommendations'] && (
          <View style={styles.sectionContent}>
            {Object.entries(result.recommendations).map(([key, value]) => (
              <Text key={key} style={styles.recommendationText}>
                {value}
              </Text>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  section: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  sectionContent: {
    padding: 10,
  },
  subSection: {
    marginBottom: 10,
  },
  subSectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  // testItem: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   paddingVertical: 5,
  // },
  summaryText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  recommendationText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  testItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  infoIcon: {
    width: 14,
    height: 14,
    borderRadius: 10,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIconText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  tooltipContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  tooltipText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },

  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
  paragraph: {
    margin: 8,
    fontSize: 16,
    textAlign: "center",
  },
  h1: {
    margin: 28,
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
  },
  h2: {
    margin: 16,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  headerIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  reportDate: {
    marginBottom: 16,
  },
  reportDateText: {
    fontSize: 12,
    color: '#64748b',
  },
  section: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
  },
  chevron: {
    fontSize: 12,
    color: '#64748b',
  },
  sectionContent: {
    padding: 16,
  },
  valueContainer: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#fff',
  },
  labelContainer: {
    marginBottom: 8,
  },
  valueLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
  },
  valueDataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  valueAndUnit: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  valueText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  unitText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  badgeDefault: {
    backgroundColor: '#e2e8f0',
  },
  badgeSuccess: {
    backgroundColor: '#dcfce7',
  },
  badgeWarning: {
    backgroundColor: '#fef9c3',
  },
  badgeDanger: {
    backgroundColor: '#fee2e2',
  },
  badgeLowAlert: {
    backgroundColor: '#ffedd5',
  },
  referenceText: {
    fontSize: 10,
    color: '#64748b',
  },
  recommendationContainer: {
    gap: 12,
  },
  recommendationSection: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#4338ca',
  },
  recommendationText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'column',
    gap: 8,
    marginTop: 16,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#334155',
    fontWeight: '600',
  },
});


// export default HealthRecord;

export default LipidProfileNative;
