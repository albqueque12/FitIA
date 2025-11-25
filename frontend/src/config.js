// Configuração da URL da API
// Em produção, a API está na mesma origem (Render serve frontend e backend juntos)
// Em desenvolvimento, usa proxy do Vite (vite.config.js)

export const API_BASE_URL = import.meta.env.PROD 
  ? '/api'  // Produção: mesma origem
  : '/api'  // Desenvolvimento: proxy do Vite

export default {
  API_BASE_URL
}
