import React, { useState } from 'react';
import { ChevronRight, BookOpen, FileStack, Lightbulb } from 'lucide-react';

/**
 * TaskTypeSelector Component
 * First step in Tier 2 guided task creation
 * Shows 3 task type options with descriptions and examples
 */

const TaskTypeSelector = ({ onSelectType, onSkip }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [showDetails, setShowDetails] = useState(null);

  const taskTypes = [
    {
      id: 'data-reports',
      icon: <FileStack className="w-8 h-8" />,
      title: '📊 Data & Report Automation',
      description: 'Read data files, analyze, generate reports/summaries',
      examples: [
        'Weekly sales report',
        'Monthly expense summary',
        'Customer metrics dashboard',
      ],
      color: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-300',
      hoverColor: 'hover:shadow-blue-200',
    },
    {
      id: 'file-systems',
      icon: <FileStack className="w-8 h-8" />,
      title: '🗂️ File & System Automation',
      description: 'Organize, backup, clean up, sync files automatically',
      examples: [
        'Daily file backup',
        'Weekly cleanup & archive',
        'Auto file conversion',
      ],
      color: 'from-green-50 to-green-100',
      borderColor: 'border-green-300',
      hoverColor: 'hover:shadow-green-200',
    },
    {
      id: 'personal-productivity',
      icon: <Lightbulb className="w-8 h-8" />,
      title: '💡 Personal Productivity',
      description: 'Capture ideas, organize thoughts, generate insights',
      examples: [
        'Daily idea capture & organize',
        'Weekly review & summary',
        'Blog post scheduler',
      ],
      color: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-300',
      hoverColor: 'hover:shadow-purple-200',
    },
  ];

  const handleSelect = (typeId) => {
    setSelectedType(typeId);
    setTimeout(() => {
      onSelectType(typeId);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            📋 Choose Task Type
          </h1>
          <p className="text-lg text-gray-600">
            Which type of task do you want to automate?
          </p>
        </div>

        {/* Task Type Cards */}
        <div className="grid gap-6 mb-8">
          {taskTypes.map((type) => (
            <div
              key={type.id}
              onClick={() => handleSelect(type.id)}
              className={`relative overflow-hidden rounded-lg border-2 cursor-pointer transition-all transform duration-300 ${
                selectedType === type.id
                  ? `${type.borderColor} ${type.color} shadow-lg scale-105`
                  : `border-gray-200 bg-white ${type.hoverColor} hover:border-gray-300`
              }`}
            >
              {/* Card Content */}
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Icon & Title */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-2xl">{type.icon}</div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {type.title}
                      </h2>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 mb-4 ml-11">
                      {type.description}
                    </p>

                    {/* Examples */}
                    <div className="ml-11">
                      <p className="text-sm font-semibold text-gray-600 mb-2">
                        Examples:
                      </p>
                      <ul className="space-y-1">
                        {type.examples.map((example, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-600 flex items-center"
                          >
                            <span className="mr-2">•</span>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDetails(
                          showDetails === type.id ? null : type.id
                        );
                      }}
                      className="px-3 py-1 rounded text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                      Learn
                    </button>
                    {selectedType === type.id && (
                      <div className="flex items-center gap-2 px-3 py-1 rounded text-sm font-medium bg-green-500 text-white">
                        ✓ Selected
                      </div>
                    )}
                  </div>
                </div>

                {/* Details Section (Expandable) */}
                {showDetails === type.id && (
                  <div className="mt-4 pt-4 border-t border-gray-300 ml-11">
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>
                        <strong>What you'll configure:</strong>
                      </p>
                      {type.id === 'data-reports' && (
                        <ul className="list-disc list-inside space-y-1">
                          <li>Input data source (folder/files)</li>
                          <li>Output format (PDF, CSV, Markdown, Email)</li>
                          <li>Schedule frequency & time</li>
                          <li>Success criteria for validation</li>
                        </ul>
                      )}
                      {type.id === 'file-systems' && (
                        <ul className="list-disc list-inside space-y-1">
                          <li>Target folder to manage</li>
                          <li>Action (backup, cleanup, convert, organize)</li>
                          <li>Retention rules (30/60/90 days)</li>
                          <li>Schedule frequency & time</li>
                        </ul>
                      )}
                      {type.id === 'personal-productivity' && (
                        <ul className="list-disc list-inside space-y-1">
                          <li>What you're capturing (ideas, notes, goals)</li>
                          <li>Organization method (by date, topic, priority)</li>
                          <li>Output format (summary, report, email)</li>
                          <li>Schedule frequency & time</li>
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Selection Indicator */}
              {selectedType === type.id && (
                <div className="absolute top-0 right-0 w-1 h-full bg-green-500" />
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onSkip()}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Skip & Create Custom
          </button>
          <button
            onClick={() => selectedType && handleSelect(selectedType)}
            disabled={!selectedType}
            className={`px-8 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
              selectedType
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Footer Help */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700">
            <strong>💡 Tip:</strong> The guided wizard will ask you specific
            questions tailored to your task type. You can always customize
            further in advanced settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskTypeSelector;
