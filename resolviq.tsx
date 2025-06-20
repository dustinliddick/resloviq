import React, { useState } from 'react';
import { Plus, FileText, Copy, Trash2, RotateCcw } from 'lucide-react';

const TroubleshootingTool = () => {
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState({
    command: '',
    output: '',
    analysis: ''
  });
  const [issueInfo, setIssueInfo] = useState({
    title: '',
    server: '',
    symptoms: '',
    priority: 'Medium'
  });
  const [resolution, setResolution] = useState({
    rootCause: '',
    solution: '',
    fixCommands: '',
    verification: '',
    prevention: ''
  });
  const [showReport, setShowReport] = useState(false);

  const addStep = () => {
    if (currentStep.command.trim() || currentStep.output.trim()) {
      const newStep = {
        id: steps.length + 1,
        ...currentStep,
        timestamp: new Date().toLocaleString()
      };
      setSteps([...steps, newStep]);
      setCurrentStep({ command: '', output: '', analysis: '' });
    }
  };

  const removeStep = (stepId) => {
    setSteps(steps.filter(step => step.id !== stepId));
  };

  const generateReport = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const timeString = new Date().toLocaleTimeString('en-US', { hour12: false });
    
    let report = `# Troubleshooting Report - ${issueInfo.title || 'Server Issue'}\n\n`;
    report += `**Date:** ${timestamp} ${timeString}\n`;
    report += `**Server/Environment:** ${issueInfo.server}\n`;
    report += `**Initial Symptoms:** ${issueInfo.symptoms}\n`;
    report += `**Priority:** ${issueInfo.priority}\n\n`;
    
    report += `## Investigation Steps\n\n`;
    
    steps.forEach((step, index) => {
      report += `### Step ${step.id}: Investigation\n\n`;
      
      if (step.command) {
        report += `**Command/Action:**\n\`\`\`bash\n${step.command}\n\`\`\`\n\n`;
      }
      
      if (step.output) {
        report += `**Output/Result:**\n\`\`\`\n${step.output}\n\`\`\`\n\n`;
      }
      
      if (step.analysis) {
        report += `**Analysis:** ${step.analysis}\n\n`;
      }
      
      report += `---\n\n`;
    });
    
    if (resolution.rootCause || resolution.solution) {
      report += `## Resolution Summary\n\n`;
      
      if (resolution.rootCause) {
        report += `**Root Cause:** ${resolution.rootCause}\n\n`;
      }
      
      if (resolution.solution) {
        report += `**Solution Applied:** ${resolution.solution}\n\n`;
      }
      
      if (resolution.fixCommands) {
        report += `**Resolution Commands:**\n\`\`\`bash\n${resolution.fixCommands}\n\`\`\`\n\n`;
      }
      
      if (resolution.verification) {
        report += `**Verification Steps:**\n${resolution.verification}\n\n`;
      }
      
      if (resolution.prevention) {
        report += `**Prevention/Future Monitoring:** ${resolution.prevention}\n\n`;
      }
      
      report += `**Time to Resolution:** ${steps.length} investigation steps\n`;
      report += `**Total Investigation Time:** ${timestamp} ${timeString}\n\n`;
    }
    
    return report;
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Report copied to clipboard! Ready to paste into Obsidian.');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const resetAll = () => {
    setSteps([]);
    setCurrentStep({ command: '', output: '', analysis: '' });
    setResolution({ rootCause: '', solution: '', fixCommands: '', verification: '', prevention: '' });
    setShowReport(false);
  };

  if (showReport) {
    const report = generateReport();
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Generated Technical Report</h2>
          <div className="space-x-2">
            <button
              onClick={() => copyToClipboard(report)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <Copy size={16} />
              Copy for Obsidian
            </button>
            <button
              onClick={() => setShowReport(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Back to Editor
            </button>
            <button
              onClick={resetAll}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Start New Issue
            </button>
          </div>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <pre className="whitespace-pre-wrap text-sm font-mono overflow-x-auto">
            {report}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Server Troubleshooting Capture</h1>
      
      {/* Issue Information */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-3">Issue Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Issue Title/Description"
            value={issueInfo.title}
            onChange={(e) => setIssueInfo({...issueInfo, title: e.target.value})}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Server/Environment"
            value={issueInfo.server}
            onChange={(e) => setIssueInfo({...issueInfo, server: e.target.value})}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Initial Symptoms"
            value={issueInfo.symptoms}
            onChange={(e) => setIssueInfo({...issueInfo, symptoms: e.target.value})}
            className="p-2 border rounded"
          />
          <select
            value={issueInfo.priority}
            onChange={(e) => setIssueInfo({...issueInfo, priority: e.target.value})}
            className="p-2 border rounded"
          >
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Current Step Input */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-3">Step {steps.length + 1}: Current Investigation</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Command/Action:</label>
            <textarea
              value={currentStep.command}
              onChange={(e) => setCurrentStep({...currentStep, command: e.target.value})}
              placeholder="Paste your command here (e.g., systemctl status nginx)"
              className="w-full p-3 border rounded-lg font-mono text-sm h-24 resize-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Output/Result:</label>
            <textarea
              value={currentStep.output}
              onChange={(e) => setCurrentStep({...currentStep, output: e.target.value})}
              placeholder="Paste command output, error messages, or describe what you observed"
              className="w-full p-3 border rounded-lg font-mono text-sm h-32 resize-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Analysis/Notes (optional):</label>
            <textarea
              value={currentStep.analysis}
              onChange={(e) => setCurrentStep({...currentStep, analysis: e.target.value})}
              placeholder="What does this tell us? Why is this the next logical step?"
              className="w-full p-3 border rounded-lg text-sm h-20 resize-none"
            />
          </div>
        </div>
        
        <button
          onClick={addStep}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 flex items-center gap-2"
        >
          <Plus size={16} />
          Next Step
        </button>
      </div>

      {/* Steps Summary */}
      {steps.length > 0 && (
        <div className="bg-white border rounded-lg mb-6">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Investigation Steps ({steps.length})</h2>
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {steps.map((step) => (
              <div key={step.id} className="p-4 border-b last:border-b-0 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-600">Step {step.id}</div>
                    {step.command && (
                      <div className="mt-1">
                        <span className="text-xs text-gray-500">Command:</span>
                        <code className="block bg-gray-100 p-1 rounded text-xs mt-1 truncate">
                          {step.command.length > 100 ? step.command.substring(0, 100) + '...' : step.command}
                        </code>
                      </div>
                    )}
                    {step.output && (
                      <div className="mt-1">
                        <span className="text-xs text-gray-500">Output:</span>
                        <div className="bg-gray-100 p-1 rounded text-xs mt-1 truncate">
                          {step.output.length > 100 ? step.output.substring(0, 100) + '...' : step.output}
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeStep(step.id)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resolution Section */}
      {steps.length > 0 && (
        <div className="bg-green-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-3">Resolution Summary</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Root Cause:</label>
              <textarea
                value={resolution.rootCause}
                onChange={(e) => setResolution({...resolution, rootCause: e.target.value})}
                placeholder="What was the underlying cause of the issue?"
                className="w-full p-3 border rounded-lg text-sm h-20 resize-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Solution Applied:</label>
              <textarea
                value={resolution.solution}
                onChange={(e) => setResolution({...resolution, solution: e.target.value})}
                placeholder="How was the issue resolved?"
                className="w-full p-3 border rounded-lg text-sm h-20 resize-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Resolution Commands:</label>
              <textarea
                value={resolution.fixCommands}
                onChange={(e) => setResolution({...resolution, fixCommands: e.target.value})}
                placeholder="Commands used to fix the issue"
                className="w-full p-3 border rounded-lg font-mono text-sm h-24 resize-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Verification Steps:</label>
              <textarea
                value={resolution.verification}
                onChange={(e) => setResolution({...resolution, verification: e.target.value})}
                placeholder="How did you verify the fix worked?"
                className="w-full p-3 border rounded-lg text-sm h-20 resize-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Prevention/Future Monitoring:</label>
              <textarea
                value={resolution.prevention}
                onChange={(e) => setResolution({...resolution, prevention: e.target.value})}
                placeholder="What can be done to prevent this issue in the future?"
                className="w-full p-3 border rounded-lg text-sm h-20 resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Generate Report Button */}
      {steps.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowReport(true)}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-lg"
          >
            <FileText size={20} />
            Generate Technical Report
          </button>
        </div>
      )}
    </div>
  );
};

export default TroubleshootingTool;
