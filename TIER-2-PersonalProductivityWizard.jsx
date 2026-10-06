import React, { useState } from 'react';
import { ChevronRight, AlertCircle } from 'lucide-react';

/**
 * PersonalProductivityWizard Component
 * Step-by-step guided creation for Personal Productivity tasks
 * Handles: Name → What to Capture → Source Location → Organization → Schedule
 */

const PersonalProductivityWizard = ({ step, formData, onNext, onSkip }) => {
  const [stepData, setStepData] = useState({
    taskName: formData.taskName || '',
    captureType: 'ideas', // ideas, notes, goals, writing
    sourceLocation: '',
    organizationMethod: 'date', // date, topic, priority
    outputFormat: 'summary', // summary, report, email
    frequency: formData.schedule?.frequency || 'weekly',
    time: formData.schedule?.time || '09:00',
  });

  const [errors, setErrors] = useState({});

  const captureOptions = [
    { value: 'ideas', label: '💡 Ideas', desc: 'Random thoughts & concepts' },
    { value: 'notes', label: '📓 Notes', desc: 'Meeting notes & learnings' },
    { value: 'goals', label: '🎯 Goals', desc: 'Projects & milestones' },
    { value: 'writing', label: '📝 Writing', desc: 'Drafts & blog posts' },
  ];

  const organizationOptions = [
    { value: 'date', label: '📅 By Date', desc: 'Chronological order' },
    { value: 'topic', label: '🏷️ By Topic', desc: 'Group by subject' },
    { value: 'priority', label: '⭐ By Priority', desc: 'Important first' },
  ];

  const outputOptions = [
    { value: 'summary', label: '📝 Summary', desc: 'Daily/Weekly digest' },
    { value: 'report', label: '📊 Report', desc: 'Detailed analysis' },
    { value: 'email', label: '📧 Email', desc: 'Send as email' },
  ];

  const validateStep = () => {
    const newErrors = {};
    if (step === 0 && !stepData.taskName.trim()) {
      newErrors.taskName = 'Task name is required';
    }
    if (step === 1 && !stepData.sourceLocation.trim()) {
      newErrors.sourceLocation = 'Source location is required';
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
            <strong>Name your automation:</strong> What are you organizing?
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            What should we call this?
          </label>
          <input
            type="text"
            placeholder="e.g., Weekly Review, Daily Ideas"
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

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            💡 Good names for personal tasks:
          </p>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>"Weekly Review" - Summarize the week</li>
            <li>"Daily Ideas" - Capture and organize thoughts</li>
            <li>"Blog Post Scheduler" - Prepare content</li>
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

  // Step 1: What to Capture
  if (step === 1) {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>What are you capturing?</strong> Choose what to track.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            What type of content?
          </label>
          <div className="grid grid-cols-2 gap-3">
            {captureOptions.map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  setStepData({ ...stepData, captureType: option.value })
                }
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  stepData.captureType === option.value
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

  // Step 2: Source Location
  if (step === 2) {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Where are they now?</strong> Tell us where to find the files.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Where do you keep these?
          </label>
          <input
            type="text"
            placeholder="e.g., /Ideas/ or /Notes/"
            value={stepData.sourceLocation}
            onChange={(e) => {
              setStepData({ ...stepData, sourceLocation: e.target.value });
              if (errors.sourceLocation) setErrors({ ...errors, sourceLocation: null });
            }}
            className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors ${
              errors.sourceLocation
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 focus:border-blue-600'
            }`}
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Common locations:
          </p>
          <div className="space-y-2">
            {['/Ideas/', '/Notes/', '/Drafts/', '/Goals/'].map((location) => (
              <button
                key={location}
                onClick={() =>
                  setStepData({ ...stepData, sourceLocation: location })
                }
                className="w-full text-left px-3 py-2 rounded bg-white border border-gray-300 text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                {location}
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

  // Step 3: Organization Method
  if (step === 3) {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>How to organize?</strong> Choose your organization method.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            How should we organize them?
          </label>
          <div className="grid grid-cols-1 gap-3">
            {organizationOptions.map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  setStepData({ ...stepData, organizationMethod: option.value })
                }
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  stepData.organizationMethod === option.value
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
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            What should we do with them?
          </label>
          <div className="grid grid-cols-1 gap-3">
            {outputOptions.map((option) => (
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

  // Step 4: Schedule
  if (step === 4) {
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

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            💡 Popular times:
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>🕐 Morning (9 AM) - Start your day with a digest</li>
            <li>🕐 Evening (5 PM) - Weekly review before weekend</li>
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

  return null;
};

export default PersonalProductivityWizard;
