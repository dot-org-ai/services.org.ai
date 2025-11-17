/**
 * Wikidata SPARQL Client for Services
 * Queries Wikidata for service information
 */

const WIKIDATA_ENDPOINT = 'https://query.wikidata.org/sparql'
const USER_AGENT = 'services.org.ai/1.0 (https://services.org.ai)'

export interface WikidataService {
  qid: string
  label: string
  description?: string
  industry?: string
  industryQID?: string
  provider?: string
  providerQID?: string
  inception?: string
  image?: string
  wikipedia?: string
  naicsCode?: string
  unspscCode?: string
}

export class WikidataClient {
  private endpoint: string

  constructor(endpoint: string = WIKIDATA_ENDPOINT) {
    this.endpoint = endpoint
  }

  /**
   * Execute a SPARQL query against Wikidata
   */
  async query(sparql: string): Promise<any> {
    const url = new URL(this.endpoint)
    url.searchParams.set('query', sparql)
    url.searchParams.set('format', 'json')

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'application/sparql-results+json'
      }
    })

    if (!response.ok) {
      throw new Error(`Wikidata query failed: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get services by industry
   */
  async getServicesByIndustry(industryQID: string, limit: number = 100): Promise<WikidataService[]> {
    const sparql = `
      SELECT ?service ?serviceLabel ?serviceDescription
             ?industry ?industryLabel
             ?provider ?providerLabel
             ?inception ?image ?wikipedia
      WHERE {
        ?service wdt:P31/wdt:P279* wd:Q7406919.
        ?service wdt:P452 wd:${industryQID}.

        OPTIONAL { ?service wdt:P452 ?industry. }
        OPTIONAL { ?service wdt:P176 ?provider. }
        OPTIONAL { ?service wdt:P571 ?inception. }
        OPTIONAL { ?service wdt:P18 ?image. }

        OPTIONAL {
          ?wikipedia schema:about ?service .
          ?wikipedia schema:inLanguage "en" .
          FILTER (SUBSTR(str(?wikipedia), 1, 25) = "https://en.wikipedia.org/")
        }

        SERVICE wikibase:label {
          bd:serviceParam wikibase:language "en".
          ?service rdfs:label ?serviceLabel .
          ?service schema:description ?serviceDescription .
        }
      }
      LIMIT ${limit}
    `

    const results = await this.query(sparql)
    return this.parseServiceResults(results)
  }

  /**
   * Get all services (general query)
   */
  async getAllServices(limit: number = 1000, offset: number = 0): Promise<WikidataService[]> {
    const sparql = `
      SELECT ?service ?serviceLabel ?serviceDescription
             ?industry ?industryLabel
             ?provider ?providerLabel
             ?inception ?image ?wikipedia
      WHERE {
        ?service wdt:P31/wdt:P279* wd:Q7406919.

        OPTIONAL { ?service wdt:P452 ?industry. }
        OPTIONAL { ?service wdt:P176 ?provider. }
        OPTIONAL { ?service wdt:P571 ?inception. }
        OPTIONAL { ?service wdt:P18 ?image. }

        OPTIONAL {
          ?wikipedia schema:about ?service .
          ?wikipedia schema:inLanguage "en" .
          FILTER (SUBSTR(str(?wikipedia), 1, 25) = "https://en.wikipedia.org/")
        }

        SERVICE wikibase:label {
          bd:serviceParam wikibase:language "en".
          ?service rdfs:label ?serviceLabel .
          ?service schema:description ?serviceDescription .
        }
      }
      LIMIT ${limit}
      OFFSET ${offset}
    `

    const results = await this.query(sparql)
    return this.parseServiceResults(results)
  }

  /**
   * Get service details by QID
   */
  async getServiceByQID(qid: string): Promise<WikidataService | null> {
    const sparql = `
      SELECT ?service ?serviceLabel ?serviceDescription
             ?industry ?industryLabel
             ?provider ?providerLabel
             ?inception ?image ?wikipedia
      WHERE {
        BIND(wd:${qid} AS ?service)

        OPTIONAL { ?service wdt:P452 ?industry. }
        OPTIONAL { ?service wdt:P176 ?provider. }
        OPTIONAL { ?service wdt:P571 ?inception. }
        OPTIONAL { ?service wdt:P18 ?image. }

        OPTIONAL {
          ?wikipedia schema:about ?service .
          ?wikipedia schema:inLanguage "en" .
          FILTER (SUBSTR(str(?wikipedia), 1, 25) = "https://en.wikipedia.org/")
        }

        SERVICE wikibase:label {
          bd:serviceParam wikibase:language "en".
          ?service rdfs:label ?serviceLabel .
          ?service schema:description ?serviceDescription .
        }
      }
      LIMIT 1
    `

    const results = await this.query(sparql)
    const services = this.parseServiceResults(results)
    return services.length > 0 ? services[0] : null
  }

  /**
   * Search for services by name
   */
  async searchServices(searchTerm: string, limit: number = 50): Promise<WikidataService[]> {
    const sparql = `
      SELECT ?service ?serviceLabel ?serviceDescription
             ?industry ?industryLabel
             ?provider ?providerLabel
             ?inception ?image ?wikipedia
      WHERE {
        ?service wdt:P31/wdt:P279* wd:Q7406919.
        ?service rdfs:label ?serviceLabel .

        FILTER(CONTAINS(LCASE(?serviceLabel), "${searchTerm.toLowerCase()}"))
        FILTER(LANG(?serviceLabel) = "en")

        OPTIONAL { ?service wdt:P452 ?industry. }
        OPTIONAL { ?service wdt:P176 ?provider. }
        OPTIONAL { ?service wdt:P571 ?inception. }
        OPTIONAL { ?service wdt:P18 ?image. }

        OPTIONAL {
          ?wikipedia schema:about ?service .
          ?wikipedia schema:inLanguage "en" .
          FILTER (SUBSTR(str(?wikipedia), 1, 25) = "https://en.wikipedia.org/")
        }

        SERVICE wikibase:label {
          bd:serviceParam wikibase:language "en".
          ?service schema:description ?serviceDescription .
        }
      }
      LIMIT ${limit}
    `

    const results = await this.query(sparql)
    return this.parseServiceResults(results)
  }

  /**
   * Parse SPARQL results into WikidataService objects
   */
  private parseServiceResults(results: any): WikidataService[] {
    if (!results.results || !results.results.bindings) {
      return []
    }

    return results.results.bindings.map((binding: any) => {
      const service: WikidataService = {
        qid: this.extractQID(binding.service?.value),
        label: binding.serviceLabel?.value || '',
        description: binding.serviceDescription?.value,
        industry: binding.industryLabel?.value,
        industryQID: binding.industry ? this.extractQID(binding.industry.value) : undefined,
        provider: binding.providerLabel?.value,
        providerQID: binding.provider ? this.extractQID(binding.provider.value) : undefined,
        inception: binding.inception?.value,
        image: binding.image?.value,
        wikipedia: binding.wikipedia?.value
      }

      return service
    })
  }

  /**
   * Extract QID from Wikidata entity URI
   */
  private extractQID(uri: string): string {
    const match = uri.match(/Q\d+$/)
    return match ? match[0] : ''
  }
}

// Export singleton instance
export const wikidataClient = new WikidataClient()
