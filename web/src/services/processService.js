// Process Service for saving and loading business processes

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class ProcessService {
  // Save a business process to the database
  async saveProcess(processData) {
    try {
      const response = await fetch(`${API_BASE_URL}/process-configs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: processData.name,
          description: processData.description,
          processType: 'BUSINESS_PROCESS',
          executionMode: 'SEQUENTIAL',
          nodes: processData.nodes,
          edges: processData.edges,
          metadata: {
            version: '1.0',
            createdBy: 'user',
            tags: processData.tags || [],
            category: processData.category || 'general'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to save process: ${response.statusText}`);
      }

      const savedProcess = await response.json();
      console.log('Process saved successfully:', savedProcess);
      return savedProcess;
    } catch (error) {
      console.error('Error saving process:', error);
      throw error;
    }
  }

  // Load all business processes from the database
  async loadAllProcesses() {
    try {
      const response = await fetch(`${API_BASE_URL}/process-configs?processType=BUSINESS_PROCESS`);
      
      if (!response.ok) {
        throw new Error(`Failed to load processes: ${response.statusText}`);
      }

      const processes = await response.json();
      console.log('Processes loaded:', processes);
      return processes;
    } catch (error) {
      console.error('Error loading processes:', error);
      throw error;
    }
  }

  // Load a specific business process by ID
  async loadProcessById(processId) {
    try {
      const response = await fetch(`${API_BASE_URL}/process-configs/${processId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load process: ${response.statusText}`);
      }

      const process = await response.json();
      console.log('Process loaded:', process);
      return process;
    } catch (error) {
      console.error('Error loading process:', error);
      throw error;
    }
  }

  // Update an existing business process
  async updateProcess(processId, processData) {
    try {
      const response = await fetch(`${API_BASE_URL}/process-configs/${processId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: processData.name,
          description: processData.description,
          processType: 'BUSINESS_PROCESS',
          executionMode: 'SEQUENTIAL',
          nodes: processData.nodes,
          edges: processData.edges,
          metadata: {
            version: processData.metadata?.version || '1.0',
            updatedBy: 'user',
            tags: processData.tags || [],
            category: processData.category || 'general'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to update process: ${response.statusText}`);
      }

      const updatedProcess = await response.json();
      console.log('Process updated successfully:', updatedProcess);
      return updatedProcess;
    } catch (error) {
      console.error('Error updating process:', error);
      throw error;
    }
  }

  // Delete a business process
  async deleteProcess(processId) {
    try {
      const response = await fetch(`${API_BASE_URL}/process-configs/${processId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Failed to delete process: ${response.statusText}`);
      }

      console.log('Process deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting process:', error);
      throw error;
    }
  }

  // Convert flow data to process format
  convertFlowToProcess(flowData, processName, processDescription) {
    return {
      name: processName,
      description: processDescription,
      nodes: flowData.nodes,
      edges: flowData.edges,
      tags: ['flow-builder', 'business-process'],
      category: 'automated'
    };
  }

  // Convert process data to flow format
  convertProcessToFlow(processData) {
    return {
      nodes: processData.nodes || [],
      edges: processData.edges || [],
      metadata: processData.metadata || {}
    };
  }
}

export default new ProcessService();


