import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

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
  const [result, setResult] = useState({
    patient_info: {
      name: "MR. S K SHARMA",
      age: 73,
      gender: "Male",
      ref_doctor: "SELF",
      client_name: "1GOGOA038A",
      sample_id: "241110950",
      age_gender: "73 years / Male",
      reported_date: "Jul 06, 2024, 01:52 p.m.",
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
  });

  return (
    <ScrollView style={styles.container}>
      {/* Patient Info Section */}
      <View style={styles.section}>
        <TouchableOpacity onPress={() => toggleSection('patient_info')}>
          <Text style={styles.sectionHeader}>Patient Information</Text>
        </TouchableOpacity>
        {expandedSections['patient_info'] && (
          <View style={styles.sectionContent}>
            <Text>Name: {result.patient_info.name}</Text>
            <Text>Age/Gender: {result.patient_info.age_gender}</Text>
            <Text>Ref. Doctor: {result.patient_info.ref_doctor}</Text>
            <Text>Reported Date: {result.patient_info.reported_date}</Text>
          </View>
        )}
      </View>

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
});

export default HealthRecord;
