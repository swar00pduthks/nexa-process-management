const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'nexaBusinessProcessManagement',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App',
        './ProcessOrchestrator': './src/components/ProcessOrchestrator',
        './ProcessRunsDashboard': './src/components/ProcessRunsDashboard',
        './ProcessJourneyViewer': './src/components/ProcessJourneyViewer',
        './FlowBuilder': './src/components/FlowBuilder',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        'reactflow': { singleton: true },
        'react-router-dom': { singleton: true },
      },
    }),
  ],
};
