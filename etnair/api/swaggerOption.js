const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ETNAir API',
      version: '1.0.0',
      description: 'API de gestion de location de logements (Utilisateurs & Annonces)',
      contact: {
        name: 'Support API',
        email: 'dev@etnair.io'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur Local'
      }
    ],
  },
  apis: ['./server.js', './routes/*.js'],
};

module.exports = swaggerOptions;
