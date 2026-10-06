import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import DataReportsWizard from './TIER-2-DataReportsWizard';
import FileSystemsWizard from './TIER-2-FileSystemsWizard';
import PersonalProductivityWizard from './TIER-2-PersonalProductivityWizard';

/**
 * GuidedWizard Component
 * Main orchestrator for the 3-type guided task creation flow
 * Routes to the appropriate wizard based on task type
 */

const GuidedWizard = ({
  taskType,
  onComplete,
  onCancel,
  onSkip,
}) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    taskName: '',
    inputs: [],
    outputs: [],
    schedule: {
      frequency: 'weekly',
      day: 'monday',
      time: '09:00',
    },
    successCriteria: '',
  });

  // Wizard config for each task type
  const wizardConfigs = {
    'data-reports': {
      component: DataReportsWizard,
      title: 'Data & Report Automation',
      steps: [
        'Task Name',
        'Data Source',
        'Output Format',
        'Schedule',
        'Success Criteria',
        'Review',
      ],
    },
    'file-systems': {
      component: FileSystemsWizard,
      title: 'File & System Automation',
      steps: ['Task Name', 'Target Folder', 'Action', 'Schedule', 'Review'],
    },
    'personal-productivity': {
      component: PersonalProductivityWizard,
      title: 'Personal Productivity',
      steps: [
        'Task Name',
        'What to Capture',
        'Source Location',
        'Organization',
        'Schedule',
        'Review',
      ],
    },
  };

  const config = wizardConfigs[taskType];
  const WizardComponent = config.component;

  const handleNext = (data) => {
    // Merge new data with existing form data
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);

    // Move to next step
    if (step < config.steps.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    onComplete({
      type: taskType,
      ...formData,
    });
  };

  const progressPercentage = ((step + 1) / config.steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 font-medium">
                Step {step + 1} of {config.steps.length}
              </p>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">
                {config.steps[step]}
              </h1>
              <p className="text-sm text-gray-500 mt-1">{config.title}</p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              ✕ Cancel
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {step === config.steps.length - 1 ? (
          // Review Step
          <ReviewStep formData={formData} config={config} />
        ) : (
          // Wizard Steps
          <WizardComponent
            step={step}
            formData={formData}
            onNext={handleNext}
            onSkip={onSkip}
          />
        )}
      </div>

      {/* Footer Actions */}
      <div className="bg-white border-t border-gray-200 sticky bottom-0">
        <div className="max-w-4xl mx-auto px-6 py-4 flex gap-4 justify-between">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
              step === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {step === config.steps.length - 1 ? (
            <button
              onClick={handleComplete}
              className="px-8 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 flex items-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" /> Create Task
            </button>
          ) : (
            <button
              onClick={() => {
                /* Handled by WizardComponent onNext */
              }}
              className="px-8 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 flex items-center gap-2 transition-all"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * ReviewStep Component
 * Final review before task creation
 * Displays all accumulated data from previous steps
 */
const ReviewStep = ({ formData, config }) => {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Ready to create?</strong> Review your settings below and
          click Create Task.
        </p>
      </div>

      <div className="space-y-4">
        {/* Task Name */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Task Name</p>
          <p className="text-lg text-gray-900">{formData.taskName || '(Not specified)'}</p>
        </div>

        {/* Task Type */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Task Type</p>
          <p className="text-gray-900">
            {formData.taskType === 'data-reports' && '📊 Data & Report Automation'}
            {formData.taskType === 'file-systems' && '🗂️ File & System Automation'}
            {formData.taskType === 'personal-productivity' && '💡 Personal Productivity'}
          </p>
        </div>

        {/* Input/Source Info */}
        {formData.inputFolder && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Input Source</p>
            <p className="text-gray-900 font-mono text-sm">{formData.inputFolder}</p>
          </div>
        )}

        {formData.targetFolder && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Target Folder</p>
            <p className="text-gray-900 font-mono text-sm">{formData.targetFolder}</p>
          </div>
        )}

        {/* Output/Action Info */}
        {formData.outputFormat && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Output Format</p>
            <p className="text-gray-900 capitalize">{formData.outputFormat}</p>
          </div>
        )}

        {formData.action && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Action</p>
            <p className="text-gray-900 capitalize">{formData.action}</p>
          </div>
        )}

        {/* Schedule */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Schedule</p>
          <p className="text-gray-900">
            {formData.frequency?.charAt(0).toUpperCase() + formData.frequency?.slice(1) || 'Weekly'}
            {formData.frequency === 'weekly' && formData.day && (
              <> • {formData.day.charAt(0).toUpperCase() + formData.day.slice(1)}</>
            )}
            {formData.time && (
              <> • {formData.time}</>
            )}
          </p>
        </div>

        {/* Success Criteria */}
        {formData.successCriteria && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Success Criteria</p>
            <p className="text-gray-900">{formData.successCriteria}</p>
          </div>
        )}

        {/* Validation Note */}
        {formData.successCriteria && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-yellow-900 mb-2">
              ⚠️ Validation Note
            </p>
            <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
              <li>We'll validate that your criteria are met on each run</li>
              <li>You'll get alerts if the criteria fail</li>
            </ul>
          </div>
        )}
      </div>

      {/* Final Confirmation */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-900">
          <strong>✓ All settings configured.</strong> Click Create Task to save
          and activate.
        </p>
      </div>
    </div>
  );
};

export default GuidedWizard;
