// File: src/app/navigation/linking.js
/**
 * Configuration du deep linking pour les redirections externes et notifications push
 */
export const linking = {
  prefixes: ['inhome://', 'https://inhome.ma'],
  config: {
    screens: {
      ClientStack: {
        screens: {
          MapHome: 'home',
          JobTracking: 'tracking/:jobId',
          Chat: 'chat/:bookingId',
        },
      },
      WorkerStack: {
        screens: {
          WorkerHome: 'worker',
          WorkerRequestDetail: 'worker/request/:requestId',
          ActiveJob: 'worker/job/:jobId',
        },
      },
    },
  },
};

export default linking;
