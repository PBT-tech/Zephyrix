import React, { useState } from 'react';
import TaskTypeSelector from './TIER-2-TaskTypeSelector';
import GuidedWizard from './TIER-2-GuidedWizard';

/**
 * CreateTaskWithWizard Component
 *
 * Wraps Tier 2 guided task creation into your existing CreateTaskForm
 *
 * Usage in CreateTaskForm:
 *
 * const [showWizard, setShowWizard] = useState(false);
 *
 * if (showWizard) {
 *   return (
 *     <CreateTaskWithWizard
 *       onTaskCreate={(formData) => {
 *         // formData has all fields from wizard
 *         // Call your existing createTask() function
 *         createTask(formData);
 *       }}
 *       onCancel={() => setShowWizard(false)}
 *     />
 *   );
 * }
 *
 * return (
 *   <div>
 *     <button onClick={() => setShowWizard(true)}>
 *       ✨ Create with Guided Wizard
 *     </button>
 *     {/* Your original form here */}
 *   </div>
 * );
 */

const CreateTaskWithWizard = ({ onTaskCreate, onCancel }) => {
  const [selectedType, setSelectedType] = useState(null);

  const handleWizardComplete = (formData) => {
    // formData contains:
    // {
    //   type: 'data-reports' | 'file-systems' | 'personal-productivity',
    //   taskName: string,
    //   inputFolder?: string,
    //   targetFolder?: string,
    //   sourceLocation?: string,
    //   outputFormat?: string,
    //   action?: string,
    //   organizationMethod?: string,
    //   frequency: 'daily' | 'weekly' | 'monthly',
    //   day?: string (for weekly),
    //   time: string (HH:MM format),
    //   successCriteria?: string,
    //   retentionDays?: number,
    // }

    console.log('Wizard complete with data:', formData);
    onTaskCreate(formData);
  };

  // Step 1: Show task type selector
  if (!selectedType) {
    return (
      <TaskTypeSelector
        onSelectType={(type) => setSelectedType(type)}
        onSkip={() => onCancel()}
      />
    );
  }

  // Step 2: Show guided wizard for selected type
  return (
    <GuidedWizard
      taskType={selectedType}
      onComplete={handleWizardComplete}
      onCancel={() => {
        setSelectedType(null);
        onCancel();
      }}
      onSkip={() => {
        // Fall back to original form
        setSelectedType(null);
        onCancel();
      }}
    />
  );
};

export default CreateTaskWithWizard;
