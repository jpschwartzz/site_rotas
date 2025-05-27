/**
 * Multigrafo - Graph data structure implementation for bus routes
 * This implements the functionality of the provided Python code in JavaScript
 */

class Multigrafo {
  constructor() {
    // Map where key is the city and value is an array of routes
    this.grafo = new Map();
  }

  /**
   * Add a city to the graph
   * @param {string} cidade - Name of the city
   */
  adicionarCidade(cidade) {
    if (!this.grafo.has(cidade)) {
      this.grafo.set(cidade, []);
      return true;
    }
    return false; // City already exists
  }

  /**
   * Add a route between cities
   * @param {string} origem - Origin city
   * @param {string} destino - Destination city
   * @param {string} companhia - Bus company
   * @param {string} horario - Time of departure
   * @param {number} preco - Price of the ticket
   */
  adicionarRota(origem, destino, companhia, horario, preco) {
    // Check if cities exist
    if (!this.grafo.has(origem) || !this.grafo.has(destino)) {
      return false;
    }

    // Create route object
    const rota = {
      destino,
      companhia,
      horario,
      preco
    };

    // Add route to origin city
    this.grafo.get(origem).push(rota);
    return true;
  }

  /**
   * Get all routes from a specific city
   * @param {string} cidade - City name
   * @returns {Array} - Array of routes
   */
  obterRotas(cidade) {
    if (!this.grafo.has(cidade)) {
      return [];
    }
    return this.grafo.get(cidade);
  }

  /**
   * Get all cities in the graph
   * @returns {Array} - Array of city names
   */
  obterCidades() {
    return Array.from(this.grafo.keys());
  }

  /**
   * Get all unique companies in the graph
   * @returns {Array} - Array of company names
   */
  obterCompanhias() {
    const companhias = new Set();
    
    for (const rotas of this.grafo.values()) {
      for (const rota of rotas) {
        companhias.add(rota.companhia);
      }
    }
    
    return Array.from(companhias);
  }

  /**
   * Get routes filtered by origin, destination and/or company
   * @param {string} origem - Origin city (or 'all' for any)
   * @param {string} destino - Destination city (or 'all' for any)
   * @param {string} companhia - Company name (or 'all' for any)
   * @returns {Array} - Array of filtered routes with origin included
   */
  filtrarRotas(origem = 'all', destino = 'all', companhia = 'all') {
    let resultado = [];
    
    // Determine which cities to process
    const cidadesOrigem = origem === 'all' ? this.obterCidades() : [origem];
    
    // Process each origin city
    for (const cidade of cidadesOrigem) {
      const rotas = this.grafo.get(cidade);
      
      // Filter routes based on destination and company
      for (const rota of rotas) {
        if (
          (destino === 'all' || rota.destino === destino) &&
          (companhia === 'all' || rota.companhia === companhia)
        ) {
          // Include origin in result
          resultado.push({
            origem: cidade,
            ...rota
          });
        }
      }
    }
    
    return resultado;
  }

  /**
   * Count the number of routes from a city
   * @param {string} cidade - City name
   * @returns {number} - Number of routes
   */
  contarRotas(cidade) {
    if (!this.grafo.has(cidade)) {
      return 0;
    }
    return this.grafo.get(cidade).length;
  }

  /**
   * Initialize the graph with sample data
   */
  inicializarExemplo() {
    // Add cities
    this.adicionarCidade("Colatina");
    this.adicionarCidade("Vitória");
    this.adicionarCidade("Linhares");
    
    // Add routes
    this.adicionarRota("Colatina", "Vitória", "Viação Águia Branca", "08:00", 35.00);
    this.adicionarRota("Colatina", "Vitória", "Viação União", "09:30", 30.00);
    this.adicionarRota("Colatina", "Vitória", "Viação Águia Branca", "15:00", 38.00);
    this.adicionarRota("Colatina", "Linhares", "Viação São Geraldo", "10:00", 25.00);
    
    // Add more routes for better demonstration
    this.adicionarRota("Vitória", "Colatina", "Viação Águia Branca", "07:00", 35.00);
    this.adicionarRota("Vitória", "Linhares", "Viação União", "11:30", 28.00);
    this.adicionarRota("Linhares", "Vitória", "Viação São Geraldo", "06:30", 28.00);
    this.adicionarRota("Linhares", "Colatina", "Viação Águia Branca", "14:15", 25.00);
  }
}

// Export the class
export default Multigrafo;