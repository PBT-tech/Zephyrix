import React, { useState } from 'react';
import { ChevronRight, AlertCircle } from 'lucide-react';

/**
 * FileSystemsWizard Component
 * Step-by-step guided creation for File & System Automation tasks
 * Handles: Name → Folder → Action → Schedule → Review
 */

const FileSystemsWizard = ({ step, formData, onNext, onSkip }) => {
  const [stepData, setStepData] = useState({
    taskName: formData.taskName || '',
    targetFolder: '',
    action: 'backup', // backup, cleanup, convert, organize
    retentionDays: 30,
    frequency: formData.schedule?.frequency || 'daily',
    time: formData.schedule?.time || '23:00',
  });

  const [errors, setErrors] = useState({});

  const folderSuggestions = ['/Downloads/', '/Documents/', '/Desktop/', '/Projects/'];
  const actionOptions = [
    { value: 'backup', label: '🔄 Backup', desc: 'Create a copy' },
    { value: 'cleanup', label: '🗑️ Clean up', desc: 'Delete old files' },
    { value: 'convert', label: '🔄 Convert', desc: 'Change format' },
    { value: 'organize', label: '📂 Organize', desc: 'Sort files' },
  ];

  const validateStep = () => {
    const newErrors = {};
    if (step === 0 && !stepData.taskName.trim()) {
      newErrors.taskName = 'Task name is required';
    }
    if (step === 1 && !stepData.targetFolder.trim()) {
      newErrors.targetFolder = 'Folder is required';
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
            <strong>Name your automation:</strong> Keep it clear and action-oriented.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            What should we call this?
          </label>
          <input
            type="text"
            placeholder="e.g., Daily Backup, Weekly Cleanup"
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

  // Step 1: Target Folder
  if (step === 1) {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Which folder?</strong> Choose the folder to manage.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Which folder do you want to manage?
          </label>
          <input
            type="text"
            placeholder="e.g., /Downloads/"
            value={stepData.targetFolder}
            onChange={(e) => {
              setStepData({ ...stepData, targetFolder: e.target.value });
              if (errors.targetFolder) setErrors({ ...errors, targetFolder: null });
            }}
            className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors ${
              errors.targetFolder
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 focus:border-blue-600'
            }`}
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Common folders:
          </p>
          <div className="flex flex-wrap gap-2">
            {folderSuggestions.map((folder) => (
              <button
                key={folder}
                onClick={() => setStepData({ ...stepData, targetFolder: folder })}
                className="px-3 py-1 rounded bg-white border border-gray-300 text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                {folder}
              </button>
            ))}
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

  // Step 2: Action
  if (step === 2) {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>What should we do?</strong> Choose the action.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            What should we do with these files?
          </label>
          <div className="grid grid-cols-2 gap-3">
            {actionOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStepData({ ...stepData, action: option.value })}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  stepData.action === option.value
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

        {stepData.action === 'cleanup' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Delete files older than (days):
            </label>
            <select
              value={stepData.retentionDays}
              onChange={(e) =>
                setStepData({ ...stepData, retentionDays: parseInt(e.target.value) })
              }
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:outline-none"
            >
              <option value={7}>7 days</option>
              <option value={30}>30 days</option>
              <option value={60}>60 days</option>
              <option value={90}>90 days</option>
            </select>
          </div>
        )}

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
            <strong>When should this run?</strong> Set frequency and time.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            How often?
          </label>
          <select
            value={stepData.frequency}
            onChange={(e) =>
              setStepData({ ...stepData, frequency: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:outline-none"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

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

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-900">
            💡 Tip: Off-peak hours recommended (late evening or early morning).
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

  return null;
};

export default FileSystemsWizard;
