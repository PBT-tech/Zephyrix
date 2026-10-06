import React, { useState } from 'react';
import { ChevronRight, AlertCircle } from 'lucide-react';

/**
 * DataReportsWizard Component
 * Step-by-step guided creation for Data & Report Automation tasks
 * Handles: Name → Data Source → Output Format → Schedule → Success Criteria
 */

const DataReportsWizard = ({ step, formData, onNext, onSkip }) => {
  const [stepData, setStepData] = useState({
    taskName: formData.taskName || '',
    inputFolder: '',
    outputFormat: 'markdown',
    outputPath: '',
    frequency: formData.schedule?.frequency || 'weekly',
    day: formData.schedule?.day || 'monday',
    time: formData.schedule?.time || '09:00',
    successCriteria: formData.successCriteria || '',
  });

  const [errors, setErrors] = useState({});
  const [suggestions, setSuggestions] = useState({});

  // Sample suggestions
  const folderSuggestions = ['/sales/', '/data/', '/crm/', '/reports/'];
  const formatOptions = [
    { value: 'markdown', label: '📄 Markdown', desc: 'Most common' },
    { value: 'csv', label: '📊 CSV', desc: 'For spreadsheets' },
    { value: 'pdf', label: '📈 PDF', desc: 'For sharing' },
    { value: 'email', label: '📧 Email', desc: 'Send directly' },
  ];

  const scheduleFrequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  const daysOfWeek = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  // Validation
  const validateStep = () => {
    const newErrors = {};

    if (step === 0 && !stepData.taskName.trim()) {
      newErrors.taskName = 'Task name is required';
    }
    if (step === 1 && !stepData.inputFolder.trim()) {
      newErrors.inputFolder = 'Input folder is required';
    }
    if (step === 3 && stepData.frequency === 'weekly' && !stepData.day) {
      newErrors.day = 'Day is required for weekly tasks';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      onNext(stepData);
    }
  };

  // Step 0: Task Name
  if (step === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Start simple:</strong> Give your automation a clear,
            descriptive name.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            What should we call this?
          </label>
          <input
            type="text"
            placeholder="e.g., Weekly Sales Report"
            value={stepData.taskName}
            onChange={(e) => {
              setStepData({ ...stepData, taskName: e.target.value });
              if (errors.taskName) setErrors({ ...errors, taskName: null });
            }}
            className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors ${
              errors.taskName
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 focus:border-blue-600'
            }`}
          />
          {errors.taskName && (
            <p className="text-sm text-red-600 mt-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {errors.taskName}
            </p>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold text-gray-700">
            💡 What makes a good name?
          </p>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Short and descriptive</li>
            <li>Includes frequency (Weekly, Daily, Monthly)</li>
            <li>Clear output type (Report, Summary, Dashboard)</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onSkip}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Skip & Customize
          </button>
          <button
            onClick={handleNext}
            disabled={!stepData.taskName.trim()}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-gray-300 flex items-center justify-center gap-2 transition-all"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Step 1: Data Source
  if (step === 1) {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Where's your data?</strong> Tell us which folder or files
            to read from.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Which folder/files should I read?
          </label>
          <input
            type="text"
            placeholder="e.g., /sales/data/ or leave empty for advanced"
            value={stepData.inputFolder}
            onChange={(e) => {
              setStepData({ ...stepData, inputFolder: e.target.value });
              if (errors.inputFolder) setErrors({ ...errors, inputFolder: null });
            }}
            className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors ${
              errors.inputFolder
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 focus:border-blue-600'
            }`}
          />
          {errors.inputFolder && (
            <p className="text-sm text-red-600 mt-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {errors.inputFolder}
            </p>
          )}
        </div>

        {/* Suggestions */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Common folders in your account:
          </p>
          <div className="flex flex-wrap gap-2">
            {folderSuggestions.map((folder) => (
              <button
                key={folder}
                onClick={() => setStepData({ ...stepData, inputFolder: folder })}
                className="px-3 py-1 rounded bg-white border border-gray-300 text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                {folder}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-900">
            ℹ️ Leave empty if you want to configure in advanced settings later.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onSkip}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Skip & Customize
          </button>
          <button
            onClick={handleNext}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 flex items-center justify-center gap-2 transition-all"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Output Format
  if (step === 2) {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>How should we deliver results?</strong> Choose the output
            format that works best for you.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            What format should the output be?
          </label>
          <div className="grid grid-cols-2 gap-3">
            {formatOptions.map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  setStepData({ ...stepData, outputFormat: option.value })
                }
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  stepData.outputFormat === option.value
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <p className="font-semibold text-gray-900">{option.label}</p>
                <p className="text-sm text-gray-600">{option.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Where should files be saved?
          </label>
          <input
            type="text"
            placeholder="e.g., /reports/"
            value={stepData.outputPath}
            onChange={(e) =>
              setStepData({ ...stepData, outputPath: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onSkip}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Skip & Customize
          </button>
          <button
            onClick={handleNext}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 flex items-center justify-center gap-2 transition-all"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Schedule
  if (step === 3) {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>When should this run?</strong> Choose frequency and time.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            How often should this run?
          </label>
          <div className="grid grid-cols-3 gap-3">
            {scheduleFrequencies.map((freq) => (
              <button
                key={freq.value}
                onClick={() =>
                  setStepData({ ...stepData, frequency: freq.value })
                }
                className={`p-3 rounded-lg border-2 font-medium transition-all ${
                  stepData.frequency === freq.value
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                {freq.label}
              </button>
            ))}
          </div>
        </div>

        {stepData.frequency === 'weekly' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Which day?
            </label>
            <div className="grid grid-cols-4 gap-2">
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  onClick={() => setStepData({ ...stepData, day })}
                  className={`p-2 rounded-lg border-2 text-sm font-medium transition-all capitalize ${
                    stepData.day === day
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            What time?
          </label>
          <input
            type="time"
            value={stepData.time}
            onChange={(e) =>
              setStepData({ ...stepData, time: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            💡 Timing Suggestions
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>🕐 Morning (6-9 AM) - Good for reports you'll review</li>
            <li>🕐 Midday (12-2 PM) - Good for syncs</li>
            <li>🕐 Evening (5-8 PM) - Good for cleanup tasks</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onSkip}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Skip & Customize
          </button>
          <button
            onClick={handleNext}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 flex items-center justify-center gap-2 transition-all"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Step 4: Success Criteria
  if (step === 4) {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>How will you know it worked?</strong> Define what success
            looks like.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Success Criteria (optional)
          </label>
          <textarea
            placeholder="e.g., 'Report generated with 50+ rows' or 'File saved without errors'"
            value={stepData.successCriteria}
            onChange={(e) =>
              setStepData({ ...stepData, successCriteria: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:outline-none h-32 resize-none"
          />
          <p className="text-sm text-gray-600 mt-2">
            Be specific so we can validate properly.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <p className="text-sm font-semibold text-gray-700">
            📋 Example Criteria:
          </p>
          <div className="space-y-2">
            <button
              onClick={() =>
                setStepData({
                  ...stepData,
                  successCriteria: 'Report generated with data',
                })
              }
              className="w-full text-left px-3 py-2 rounded bg-white border border-gray-300 text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              Report generated with data
            </button>
            <button
              onClick={() =>
                setStepData({
                  ...stepData,
                  successCriteria: 'File saved without errors',
                })
              }
              className="w-full text-left px-3 py-2 rounded bg-white border border-gray-300 text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              File saved without errors
            </button>
            <button
              onClick={() =>
                setStepData({
                  ...stepData,
                  successCriteria: 'Email sent to team',
                })
              }
              className="w-full text-left px-3 py-2 rounded bg-white border border-gray-300 text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              Email sent to team
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onSkip}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Skip & Customize
          </button>
          <button
            onClick={handleNext}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 flex items-center justify-center gap-2 transition-all"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default DataReportsWizard;
