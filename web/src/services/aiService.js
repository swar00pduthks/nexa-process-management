// AI Service Integration
// This file handles connections to various AI providers for the chatbot

class AIService {
  constructor() {
    this.provider = process.env.REACT_APP_AI_PROVIDER || 'mock'; // mock, openai, anthropic, azure
    this.apiKey = process.env.REACT_APP_AI_API_KEY;
    this.baseUrl = process.env.REACT_APP_AI_BASE_URL;
  }

  async generateResponse(message, context = {}) {
    try {
      switch (this.provider) {
        case 'openai':
          return await this.callOpenAI(message, context);
        case 'anthropic':
          return await this.callAnthropic(message, context);
        case 'azure':
          return await this.callAzureOpenAI(message, context);
        case 'mock':
        default:
          return await this.generateMockResponse(message, context);
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      return this.getFallbackResponse(message, context);
    }
  }

  async callOpenAI(message, context) {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: this.buildSystemPrompt(context)
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async callAnthropic(message, context) {
    if (!this.apiKey) {
      throw new Error('Anthropic API key not configured');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: `${this.buildSystemPrompt(context)}\n\nUser: ${message}`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  async callAzureOpenAI(message, context) {
    if (!this.apiKey || !this.baseUrl) {
      throw new Error('Azure OpenAI configuration missing');
    }

    const response = await fetch(`${this.baseUrl}/openai/deployments/gpt-4/chat/completions?api-version=2024-02-15-preview`, {
      method: 'POST',
      headers: {
        'api-key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: this.buildSystemPrompt(context)
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Azure OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  buildSystemPrompt(context) {
    const { nodes = [], edges = [], flowType = 'business-process' } = context;
    
    return `You are an AI assistant specialized in helping users build business process flows and event correlation rules. 

Current Context:
- Flow Type: ${flowType}
- Number of Entities: ${nodes.filter(n => n.type === 'entityNode').length}
- Number of Connections: ${edges.length}
- Current Entities: ${nodes.filter(n => n.type === 'entityNode').map(n => n.data?.entityType || 'unknown').join(', ')}

Your role is to:
1. Help users understand how to build business process flows
2. Provide guidance on adding entities, conditions, and actions
3. Explain best practices for event correlation
4. Answer questions about the flow builder interface
5. Suggest improvements to their current flow

Keep responses helpful, concise, and focused on business process automation. Use bullet points and clear examples when appropriate.`;
  }

  async generateMockResponse(message, context) {
    // Enhanced mock responses that are context-aware
    const lowerMessage = message.toLowerCase();
    const { nodes = [], edges = [] } = context;
    
    // Context-aware responses
    if (nodes.length === 0) {
      if (lowerMessage.includes('start') || lowerMessage.includes('begin')) {
        return "Great! Let's start building your business process flow. First, drag some entities from the left panel onto the canvas. These will be your data sources (like customers, orders, or inventory).";
      }
    }
    
    if (nodes.length > 0 && edges.length === 0) {
      if (lowerMessage.includes('connect') || lowerMessage.includes('link')) {
        return "Perfect! Now you need to connect your entities. Try dragging from one node's output handle to another node's input handle. You can also add Join nodes to specify how entities should be related.";
      }
    }
    
    // General help responses
    if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
      return "I'm here to help you build business process flows! Here's what you can do:\n\n" +
             "• **Drag Entities**: Start by dragging entities from the left panel\n" +
             "• **Add Conditions**: Use condition nodes to specify business rules\n" +
             "• **Connect Nodes**: Link nodes to create flow logic\n" +
             "• **Configure Actions**: Define what happens when conditions are met\n\n" +
             "What specific aspect would you like help with?";
    }
    
    if (lowerMessage.includes('entity') || lowerMessage.includes('data')) {
      return "Entities are your data sources. Each entity represents a table or dataset:\n\n" +
             "• **Customer Entity**: Contains customer information\n" +
             "• **Sales Entity**: Contains order and transaction data\n" +
             "• **Inventory Entity**: Contains product and stock information\n" +
             "• **System Entity**: Contains system metrics and logs\n\n" +
             "Drag these onto the canvas to start building your flow!";
    }
    
    if (lowerMessage.includes('condition') || lowerMessage.includes('rule')) {
      return "Conditions define when actions should be triggered. You can create conditions like:\n\n" +
             "• `customer.status = 'active'`\n" +
             "• `order.amount > 1000`\n" +
             "• `inventory.quantity < threshold`\n" +
             "• `system.error_rate > 5%`\n\n" +
             "These conditions determine when your business process should execute.";
    }
    
    if (lowerMessage.includes('action') || lowerMessage.includes('trigger')) {
      return "Actions are what happen when conditions are met. Common actions include:\n\n" +
             "• **Send Notifications**: Alert managers or users\n" +
             "• **Trigger Calculations**: Perform business logic\n" +
             "• **Create Alerts**: Generate system alerts\n" +
             "• **Update Data**: Modify records or status\n" +
             "• **Start Workflows**: Initiate other processes\n\n" +
             "What type of action do you want to configure?";
    }
    
    if (lowerMessage.includes('example') || lowerMessage.includes('sample')) {
      return "Here's a common business process example:\n\n" +
             "**High-Value Order Alert Process:**\n" +
             "1. Customer places order (Customer Entity)\n" +
             "2. Order amount > $1000 (Condition)\n" +
             "3. Send notification to manager (Action)\n\n" +
             "Try clicking the 'Test Flow' button to see this example in action!";
    }
    
    if (lowerMessage.includes('save') || lowerMessage.includes('export')) {
      return "You can save your flow in several ways:\n\n" +
             "• **Save Process**: Stores the flow in the system\n" +
             "• **Export JSON**: Download the configuration\n" +
             "• **Copy Configuration**: Copy to clipboard\n\n" +
             "The JSON panel on the right shows your current flow configuration.";
    }
    
    // Default response
    return "I understand you're working on a business process flow. I can help you with:\n\n" +
           "• Adding and configuring entities\n" +
           "• Creating business rules and conditions\n" +
           "• Setting up actions and triggers\n" +
           "• Connecting nodes to build flow logic\n" +
           "• Best practices for process automation\n\n" +
           "What specific aspect would you like help with?";
  }

  getFallbackResponse(message, context) {
    return "I'm having trouble connecting to my AI service right now. Here are some things you can try:\n\n" +
           "• Check your internet connection\n" +
           "• Try refreshing the page\n" +
           "• Use the visual flow builder to create your process\n" +
           "• Contact support if the issue persists\n\n" +
           "You can still build your flow using the drag-and-drop interface!";
  }
}

// Create singleton instance
const aiService = new AIService();

export default aiService;


