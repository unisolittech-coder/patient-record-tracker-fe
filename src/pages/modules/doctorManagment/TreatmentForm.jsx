import React, { useState } from 'react';
import { toast } from 'react-toastify';

export default function TreatmentForm({ 
    patient, 
    onSubmit,        // This will be submitPrescription
    onAssign, 
    departments = [],
    loading = false 
}) {
    const [formData, setFormData] = useState({
        prescription: '',
        tests: [],
        familyHistory: ''
    });

    const [selectedTest, setSelectedTest] = useState('');
    const [showAssign, setShowAssign] = useState(false);
    const [assignData, setAssignData] = useState({
        department: '',
        doctor: ''
    });

    // Available lab tests
    const defaultTests = [
        'Complete Blood Count (CBC)',
        'Blood Sugar - Fasting',
        'Blood Sugar - Post Meal',
        'Lipid Profile',
        'Liver Function Test (LFT)',
        'Kidney Function Test (KFT)',
        'Thyroid Profile (T3, T4, TSH)',
        'Vitamin D',
        'Vitamin B12',
        'Urine Routine',
        'Stool Test',
        'ECG',
        'X-Ray',
        'MRI',
        'CT Scan',
        'Blood Culture',
        'Dengue Test',
        'Malaria Test',
        'Typhoid Test',
        'HIV Test',
        'Hepatitis B & C'
    ];

    const testOptions = defaultTests;

    // Add lab test
    const addLabTest = () => {
        if (selectedTest && !formData.tests.includes(selectedTest)) {
            setFormData(prev => ({
                ...prev,
                tests: [...prev.tests, selectedTest]
            }));
            setSelectedTest('');
        } else if (selectedTest) {
            toast.error('Test already added');
        }
    };

    // Remove lab test
    const removeLabTest = (test) => {
        setFormData(prev => ({
            ...prev,
            tests: prev.tests.filter(t => t !== test)
        }));
    };

    // ✅ Handle form submission - Uses submitPrescription
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate
        if (!formData.prescription.trim()) {
            toast.error('Please enter prescription details');
            return;
        }

        if (!patient) {
            toast.error('Please select a patient first');
            return;
        }

        // ✅ Prepare data for API
        const submitData = {
            patientId: patient.patientId || patient.id,
            prescription: formData.prescription.trim(),
            tests: formData.tests,
            familyHistory: formData.familyHistory.trim() || 'No significant family history recorded'
        };

        console.log('Submitting prescription:', submitData); // Debug log
        
        // ✅ Call submitPrescription from hook
        const result =  onSubmit(submitData);
        
        if (result) {
            toast.success('Prescription saved successfully!');
            // Optionally clear form
            setFormData({
                prescription: '',
                tests: [],
                familyHistory: ''
            });
            setSelectedTest('');
        }
    };

    // Handle assign/refer
    const handleAssign = () => {
        if (!assignData.department) {
            toast.error('Please select a department');
            return;
        }
        onAssign(assignData.department, assignData.doctor);
        setShowAssign(false);
        toast.success(`Patient assigned to ${assignData.department} department`);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
                <i className="pi pi-pencil mr-2 text-blue-500"></i>
                Prescription & Treatment
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Patient Info Summary */}
                {patient && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-3">
                            <i className="pi pi-user text-blue-500"></i>
                            <div>
                                <p className="font-medium text-gray-800 dark:text-white">
                                    {patient.patientName || patient.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    ID: {patient.patientId || patient.id} • Age: {patient.age} • {patient.gender}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Prescription - Text Area */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        💊 Prescription <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={formData.prescription}
                        onChange={(e) => setFormData(prev => ({ ...prev, prescription: e.target.value }))}
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter prescription details...
Example: Paracetamol 500mg - 1 tablet twice daily after meals for 5 days"
                        required
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        Include medicine name, dosage, frequency, duration, and special instructions
                    </p>
                </div>

                {/* Lab Tests Section */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            🧪 Lab Tests (Optional)
                        </label>
                        <span className="text-xs text-gray-400">
                            {formData.tests.length} selected
                        </span>
                    </div>

                    <div className="flex gap-3">
                        <select
                            value={selectedTest}
                            onChange={(e) => setSelectedTest(e.target.value)}
                            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="">Select a test...</option>
                            {testOptions.map((test) => (
                                <option key={test} value={test}>{test}</option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={addLabTest}
                            disabled={!selectedTest}
                            className="px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <i className="pi pi-plus"></i>
                        </button>
                    </div>

                    {/* Selected Tests */}
                    {formData.tests.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {formData.tests.map((test) => (
                                <span 
                                    key={test} 
                                    className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-3 py-1 rounded-full text-sm"
                                >
                                    <i className="pi pi-check-circle"></i>
                                    {test}
                                    <button
                                        type="button"
                                        onClick={() => removeLabTest(test)}
                                        className="text-purple-500 hover:text-purple-700 dark:hover:text-purple-300"
                                    >
                                        <i className="pi pi-times-circle text-xs"></i>
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Family History */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        📋 Family History (Optional)
                    </label>
                    <textarea
                        value={formData.familyHistory}
                        onChange={(e) => setFormData(prev => ({ ...prev, familyHistory: e.target.value }))}
                        rows="2"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter family history...
Example: Father has a history of hypertension. Mother has no significant medical history."
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {/* ✅ Save Prescription Button - Uses submitPrescription */}
                    <button
                        type="submit"
                        disabled={loading || !patient}
                        className="flex-1 min-w-[150px] px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <i className="pi pi-spin pi-spinner"></i>
                                Saving...
                            </>
                        ) : (
                            <>
                                <i className="pi pi-save"></i>
                                Save Prescription
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowAssign(!showAssign)}
                        className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition font-medium flex items-center gap-2"
                    >
                        <i className="pi pi-share-alt"></i>
                        Refer / Assign
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setFormData({
                                prescription: '',
                                tests: [],
                                familyHistory: ''
                            });
                            setSelectedTest('');
                            toast.success('Form cleared');
                        }}
                        className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium flex items-center gap-2"
                    >
                        <i className="pi pi-refresh"></i>
                        Reset
                    </button>
                </div>

                {/* Assign Section - Expandable */}
                {showAssign && (
                    <div className="mt-4 p-4 border border-orange-200 dark:border-orange-800 rounded-xl bg-orange-50 dark:bg-orange-900/20">
                        <h4 className="font-medium text-gray-800 dark:text-white mb-3">
                            <i className="pi pi-share-alt mr-2 text-orange-500"></i>
                            Assign Patient to Department
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <select
                                value={assignData.department}
                                onChange={(e) => setAssignData(prev => ({ ...prev, department: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="">Select Department...</option>
                                {departments.length > 0 ? (
                                    departments.map((dept) => (
                                        <option key={dept.id || dept} value={dept.id || dept}>
                                            {dept.name || dept}
                                        </option>
                                    ))
                                ) : (
                                    <>
                                        <option value="Cardiology">Cardiology</option>
                                        <option value="Neurology">Neurology</option>
                                        <option value="Orthopedics">Orthopedics</option>
                                        <option value="Urology">Urology</option>
                                        <option value="Dermatology">Dermatology</option>
                                        <option value="Ophthalmology">Ophthalmology</option>
                                        <option value="ENT">ENT</option>
                                        <option value="Gynecology">Gynecology</option>
                                        <option value="Pediatrics">Pediatrics</option>
                                        <option value="Psychiatry">Psychiatry</option>
                                    </>
                                )}
                            </select>

                            <select
                                value={assignData.doctor}
                                onChange={(e) => setAssignData(prev => ({ ...prev, doctor: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="">Select Doctor...</option>
                                <option value="Dr. Sharma">Dr. Sharma</option>
                                <option value="Dr. Patel">Dr. Patel</option>
                                <option value="Dr. Kumar">Dr. Kumar</option>
                                <option value="Dr. Singh">Dr. Singh</option>
                            </select>
                        </div>
                        <div className="flex gap-3 mt-3">
                            <button
                                type="button"
                                onClick={handleAssign}
                                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                            >
                                Assign Now
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAssign(false)}
                                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}