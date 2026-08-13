import { useState, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import BreadCrumb from "../../../components/common/BreadCrumb";
import PagePath from "../../../components/common/PagePath";
import Button from "../../../components/common/Button";
import { TextInput, SelectInput, DateInput } from "../../../components/common/FormFields";
import {
  LAB_TEST_CATEGORIES,
  SEX_OPTIONS,
  AGE_UNIT_OPTIONS,
} from "./labTestReferenceData";

const StatusBadge = ({ status }) => {
  const styles = {
    Normal: "bg-green-100 text-green-700 border-green-200",
    "Below Normal": "bg-yellow-100 text-yellow-700 border-yellow-200",
    "Above Normal": "bg-orange-100 text-orange-700 border-orange-200",
    "Critical Low": "bg-red-100 text-red-700 border-red-200",
    "Critical High": "bg-red-100 text-red-700 border-red-200",
    "Not Evaluated": "bg-gray-100 text-gray-600 border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
        styles[status] || styles["Not Evaluated"]
      }`}
    >
      {status}
    </span>
  );
};

const parseRange = (rangeStr) => {
  if (!rangeStr || rangeStr === "—") return null;

  const cleanStr = rangeStr.replace(/,/g, "");
  const tokens = cleanStr.match(/[≤≥<>]?\d+\.?\d*/g) || [];

  let min = null;
  let max = null;
  let lowCritical = null;
  let highCritical = null;

  for (const token of tokens) {
    const num = parseFloat(token.replace(/[≤≥<>]/g, ""));
    if (isNaN(num)) continue;

    if (token.startsWith("≤")) {
      highCritical = num;
    } else if (token.startsWith("≥")) {
      lowCritical = num;
    } else if (token.startsWith("<")) {
      highCritical = num;
    } else if (token.startsWith(">")) {
      lowCritical = num;
    } else {
      if (min === null) min = num;
      else if (max === null) max = num;
    }
  }

  if (lowCritical !== null || highCritical !== null) {
    return { min: null, max: null, lowCritical, highCritical };
  }

  if (min !== null && max !== null) {
    return { min, max, lowCritical: null, highCritical: null };
  }

  return null;
};

const getPlasmaGlucoseCritical = (age, ageUnit) => {
  const ageInDays = ageUnit === "years" ? age * 365 : ageUnit === "months" ? age * 30 : age;
  if (ageInDays < 2) return "≤35 or ≥200";
  if (ageInDays < 30) return "≤40 or ≥200";
  if (ageInDays < 365) return "≤40 or ≥300";
  if (ageInDays < 6205) return "≤55 or ≥300";
  return "≤55 or ≥450";
};

const getPotassiumCritical = (age, ageUnit) => {
  const ageInDays = ageUnit === "years" ? age * 365 : ageUnit === "months" ? age * 30 : age;
  if (ageInDays < 7) return "<2.5 or >6.0 mmol/L";
  return "<3.0 or >6.0 mmol/L";
};

const getBilirubinCritical = (age, ageUnit) => {
  const ageInHours = ageUnit === "years" ? age * 365 * 24 : ageUnit === "months" ? age * 30 * 24 : age * 24;
  if (ageInHours < 24) return "≥8 mg/dL";
  if (ageInHours < 48) return "≥13 mg/dL";
  if (ageInHours < 84) return "≥17 mg/dL";
  return "≥15 mg/dL";
};

const getPhosphateCritical = (age, ageUnit) => {
  const ageInYears = ageUnit === "years" ? age : ageUnit === "months" ? age / 12 : age / 365;
  if (ageInYears < 3) return "≤2.5 mg/dL";
  if (ageInYears < 12) return "≤2.0 mg/dL";
  return "≤1.5 mg/dL";
};

const calculateStatus = (patientValue, normalValue, criticalValue, age, ageUnit, sex, testId) => {
  if (!patientValue && patientValue !== 0) return "Not Evaluated";

  const numValue = parseFloat(patientValue);
  if (isNaN(numValue)) return "Not Evaluated";

  let effectiveCritical = criticalValue;

  if (testId === "plasma_glucose_f" || testId === "plasma_glucose_pm" || testId === "plasma_glucose_r") {
    effectiveCritical = getPlasmaGlucoseCritical(age, ageUnit);
  } else if (testId === "s_potassium") {
    effectiveCritical = getPotassiumCritical(age, ageUnit);
  } else if (testId === "s_total_bilirubin") {
    effectiveCritical = getBilirubinCritical(age, ageUnit);
  } else if (testId === "po4") {
    effectiveCritical = getPhosphateCritical(age, ageUnit);
  }

  const normalParsed = parseRange(normalValue);
  const criticalParsed = effectiveCritical ? parseRange(effectiveCritical) : null;

  if (criticalParsed) {
    if (criticalParsed.lowCritical !== null && numValue < criticalParsed.lowCritical) {
      return "Critical Low";
    }
    if (criticalParsed.highCritical !== null && numValue > criticalParsed.highCritical) {
      return "Critical High";
    }
  }

  if (normalParsed) {
    if (normalParsed.min !== null && normalParsed.max !== null) {
      if (numValue < normalParsed.min) return "Below Normal";
      if (numValue > normalParsed.max) return "Above Normal";
      return "Normal";
    }
  }

  return "Not Evaluated";
};

const getEffectiveNormalValue = (test, sex) => {
  if (test.sexDependent) {
    return sex === "female" ? test.normalFemale : test.normalMale;
  }
  return test.normalValue;
};

const getEffectiveCriticalValue = (test, age, ageUnit) => {
  if (test.ageDependent && test.ageRules) {
    const ageInDays = ageUnit === "years" ? age * 365 : ageUnit === "months" ? age * 30 : age;

    for (const rule of test.ageRules) {
      if (ageInDays <= rule.maxAgeDays) {
        return rule.critical;
      }
    }
  }
  return test.criticalValue;
};

const TestResultRow = ({ test, patientValue, onChange, age, ageUnit, sex, status }) => {
  const normalValue = getEffectiveNormalValue(test, sex);
  const criticalValue = getEffectiveCriticalValue(test, age, ageUnit);

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="px-4 py-3 text-sm font-medium text-gray-800">{test.name}</td>
      <td className="px-4 py-3">
        <input
          type="text"
          value={patientValue || ""}
          onChange={(e) => onChange(test.id, e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors text-sm"
          placeholder="Enter value"
        />
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{test.unit}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{normalValue}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{criticalValue || "—"}</td>
      <td className="px-4 py-3">
        <StatusBadge status={status} />
      </td>
    </tr>
  );
};

const TestCategory = ({ category, testValues, onTestChange, age, ageUnit, sex }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      <div
        className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-bold text-gray-800">{category.name}</h3>
        <i className={`pi ${isExpanded ? "pi-chevron-up" : "pi-chevron-down"} text-gray-500`}></i>
      </div>

      {isExpanded && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Test</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Patient Value</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Unit</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Normal Value</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Critical Value</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {category.tests.map((test) => {
                const status = calculateStatus(
                  testValues[test.id],
                  getEffectiveNormalValue(test, sex),
                  getEffectiveCriticalValue(test, age, ageUnit),
                  age,
                  ageUnit,
                  sex,
                  test.id
                );

                return (
                  <TestResultRow
                    key={test.id}
                    test={test}
                    patientValue={testValues[test.id]}
                    onChange={onTestChange}
                    age={age}
                    ageUnit={ageUnit}
                    sex={sex}
                    status={status}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const ReportPreview = ({ patientInfo, testCategories, testValues, age, ageUnit, sex, onClose, onPrint, onSave }) => {
  const allTests = useMemo(() => {
    const tests = [];
    testCategories.forEach((category) => {
      category.tests.forEach((test) => {
        const normalValue = getEffectiveNormalValue(test, sex);
        const criticalValue = getEffectiveCriticalValue(test, age, ageUnit);
        const status = calculateStatus(
          testValues[test.id],
          normalValue,
          criticalValue,
          age,
          ageUnit,
          sex,
          test.id
        );

        tests.push({
          ...test,
          normalValue,
          criticalValue,
          patientValue: testValues[test.id] || "",
          status,
        });
      });
    });
    return tests;
  }, [testCategories, testValues, age, ageUnit, sex]);

  const groupedTests = useMemo(() => {
    const groups = {};
    allTests.forEach((test) => {
      const category = testCategories.find((c) => c.tests.some((t) => t.id === test.id));
      if (category) {
        if (!groups[category.id]) groups[category.id] = { name: category.name, tests: [] };
        groups[category.id].tests.push(test);
      }
    });
    return groups;
  }, [allTests, testCategories]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Report Preview</h2>
          <div className="flex items-center gap-3">
            {onSave && <Button label="Save" icon="pi pi-save" variant="success" onClick={onSave} />}
            <Button label="Print" icon="pi pi-print" variant="primary" onClick={onPrint} />
            <Button label="Close" icon="pi pi-times" variant="secondary" onClick={onClose} />
          </div>
        </div>

        <div className="p-6" id="report-preview-content">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Laboratory Test Report</h1>
            <p className="text-sm text-gray-500 mt-1">Manual Entry Form</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Patient Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Patient Name</p>
                <p className="text-sm text-gray-800 mt-1">{patientInfo.patientName || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Patient ID</p>
                <p className="text-sm text-gray-800 mt-1">{patientInfo.patientId || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Age</p>
                <p className="text-sm text-gray-800 mt-1">
                  {patientInfo.age ? `${patientInfo.age} ${patientInfo.ageUnit}` : "-"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Sex</p>
                <p className="text-sm text-gray-800 mt-1">{patientInfo.sex ? (patientInfo.sex === "male" ? "Male" : "Female") : "-"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">OPD/Indoor No.</p>
                <p className="text-sm text-gray-800 mt-1">{patientInfo.opdIndoorNo || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Ward</p>
                <p className="text-sm text-gray-800 mt-1">{patientInfo.ward || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Date</p>
                <p className="text-sm text-gray-800 mt-1">{patientInfo.date || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Diagnosis</p>
                <p className="text-sm text-gray-800 mt-1">{patientInfo.diagnosis || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Operator Name</p>
                <p className="text-sm text-gray-800 mt-1">{patientInfo.operatorName || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Counter No.</p>
                <p className="text-sm text-gray-800 mt-1">{patientInfo.counterNo || "-"}</p>
              </div>
            </div>
          </div>

          {Object.values(groupedTests).map((group) => (
            <div key={group.name} className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">{group.name}</h3>
              <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Test</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Patient&apos;s Value</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Normal Value</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Critical Value</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.tests.map((test) => (
                      <tr key={test.id} className="border-b border-gray-100">
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{test.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-800">{test.patientValue || "-"}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{test.normalValue}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{test.criticalValue || "—"}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={test.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Other Tests Advised</h4>
                <div className="border border-dashed border-gray-300 rounded-lg p-4 min-h-[60px] text-sm text-gray-500">
                  {patientInfo.otherTestsAdvised || "None"}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Operator Signature</h4>
                  <div className="border border-dashed border-gray-300 rounded-lg p-4 min-h-[60px] flex items-center justify-center">
                    {patientInfo.operatorName && (
                      <span className="text-sm text-gray-600 italic">{patientInfo.operatorName}</span>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Date</h4>
                  <div className="border border-dashed border-gray-300 rounded-lg p-4 min-h-[60px] flex items-center justify-center">
                    <span className="text-sm text-gray-600">{patientInfo.date || new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ManualLabEntryForm() {
  const [testValues, setTestValues] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      patientName: "",
      patientId: "",
      age: "",
      ageUnit: "years",
      sex: "male",
      opdIndoorNo: "",
      ward: "",
      date: new Date().toISOString().split("T")[0],
      diagnosis: "",
      operatorName: "",
      counterNo: "",
      otherTestsAdvised: "",
    },
    validationSchema: Yup.object({
      patientName: Yup.string().required("Patient name is required"),
      patientId: Yup.string().required("Patient ID is required"),
      age: Yup.number().typeError("Age must be a number").required("Age is required").min(0, "Age cannot be negative"),
      ageUnit: Yup.string().required("Age unit is required"),
      sex: Yup.string().required("Sex is required"),
      date: Yup.string().required("Date is required"),
    }),
    onSubmit: () => {
      handleSave();
    },
  });

  const handleTestChange = (testId, value) => {
    setTestValues((prev) => ({ ...prev, [testId]: value }));
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        patientInfo: formik.values,
        testResults: testValues,
        submittedAt: new Date().toISOString(),
      };

      console.log("Submitting payload:", payload);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Report saved successfully!");
      setShowPreview(false);
    } catch (error) {
      console.error("Error saving report:", error);
      alert("Failed to save report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbPaths = [
    { label: "Lab Operator Management" },
    { label: "Manual Lab Entry" },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <BreadCrumb paths={breadcrumbPaths} />

      <PagePath
        title="Manual Laboratory Result Entry"
        showSearchBar={false}
      />

      <form onSubmit={formik.handleSubmit} className="mt-4 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i className="pi pi-user text-blue-600"></i>
            Patient Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TextInput
              id="patientName"
              name="patientName"
              label="Patient Name"
              required
              value={formik.values.patientName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.patientName && formik.errors.patientName}
              placeholder="Enter patient name"
            />

            <TextInput
              id="patientId"
              name="patientId"
              label="Patient ID"
              required
              value={formik.values.patientId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.patientId && formik.errors.patientId}
              placeholder="Enter patient ID"
            />

            <div className="flex gap-2">
              <div className="flex-1">
                <TextInput
                  id="age"
                  name="age"
                  label="Age"
                  required
                  type="number"
                  value={formik.values.age}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.age && formik.errors.age}
                  placeholder="Age"
                />
              </div>
              <div className="w-32">
                <SelectInput
                  id="ageUnit"
                  name="ageUnit"
                  label="Age Unit"
                  required
                  options={AGE_UNIT_OPTIONS}
                  value={AGE_UNIT_OPTIONS.find((opt) => opt.value === formik.values.ageUnit)}
                  onChange={(option) => formik.setFieldValue("ageUnit", option?.value || "years")}
                  onBlur={() => formik.setFieldTouched("ageUnit", true)}
                  error={formik.touched.ageUnit && formik.errors.ageUnit}
                />
              </div>
            </div>

            <SelectInput
              id="sex"
              name="sex"
              label="Sex"
              required
              options={SEX_OPTIONS}
              value={SEX_OPTIONS.find((opt) => opt.value === formik.values.sex)}
              onChange={(option) => formik.setFieldValue("sex", option?.value || "male")}
              onBlur={() => formik.setFieldTouched("sex", true)}
              error={formik.touched.sex && formik.errors.sex}
            />

            <TextInput
              id="opdIndoorNo"
              name="opdIndoorNo"
              label="OPD/Indoor No."
              value={formik.values.opdIndoorNo}
              onChange={formik.handleChange}
              placeholder="Enter OPD/Indoor number"
            />

            <TextInput
              id="ward"
              name="ward"
              label="Ward"
              value={formik.values.ward}
              onChange={formik.handleChange}
              placeholder="Enter ward"
            />

            <DateInput
              id="date"
              name="date"
              label="Date"
              required
              value={formik.values.date}
              onChange={(date) => formik.setFieldValue("date", date)}
              onBlur={formik.handleBlur}
              error={formik.touched.date && formik.errors.date}
            />

            <TextInput
              id="diagnosis"
              name="diagnosis"
              label="Diagnosis"
              value={formik.values.diagnosis}
              onChange={formik.handleChange}
              placeholder="Enter diagnosis"
            />

            <TextInput
              id="operatorName"
              name="operatorName"
              label="Operator Name"
              value={formik.values.operatorName}
              onChange={formik.handleChange}
              placeholder="Enter operator name"
            />

            <TextInput
              id="counterNo"
              name="counterNo"
              label="Counter No."
              value={formik.values.counterNo}
              onChange={formik.handleChange}
              placeholder="Enter counter number"
            />
          </div>
        </div>

        {LAB_TEST_CATEGORIES.map((category) => (
          <TestCategory
            key={category.id}
            category={category}
            testValues={testValues}
            onTestChange={handleTestChange}
            age={formik.values.age}
            ageUnit={formik.values.ageUnit}
            sex={formik.values.sex}
          />
        ))}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i className="pi pi-file-edit text-blue-600"></i>
            Additional Information
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <TextInput
              id="otherTestsAdvised"
              name="otherTestsAdvised"
              label="Other Tests Advised"
              value={formik.values.otherTestsAdvised}
              onChange={formik.handleChange}
              placeholder="Enter any other tests advised"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 sticky bottom-4">
          <Button
            type="button"
            label="Reset Form"
            icon="pi pi-refresh"
            variant="secondary"
            onClick={() => {
              formik.resetForm();
              setTestValues({});
            }}
          />
          <Button
            type="button"
            label="Preview Report"
            icon="pi pi-eye"
            variant="secondary"
            onClick={handlePreview}
          />
          <Button
            type="submit"
            label="Save Report"
            icon="pi pi-save"
            variant="primary"
            loading={isSubmitting}
          />
        </div>
      </form>

      {showPreview && (
        <ReportPreview
          patientInfo={formik.values}
          testCategories={LAB_TEST_CATEGORIES}
          testValues={testValues}
          age={formik.values.age}
          ageUnit={formik.values.ageUnit}
          sex={formik.values.sex}
          onClose={() => setShowPreview(false)}
          onPrint={handlePrint}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
