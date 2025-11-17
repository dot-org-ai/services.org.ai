/**
 * MDX Generator for Services
 * Generates MDX type definitions for services
 */

import type { NAICSIndustry, NAICSClassification } from './naics-parser'
import type { WikidataService } from './wikidata-client'

export interface ServiceMDXOptions {
  industry: NAICSIndustry
  classification: NAICSClassification
  wikidata?: WikidataService
  digital?: number
  examples?: boolean
}

export class ServiceMDXGenerator {
  /**
   * Generate MDX content for a service type
   */
  generate(options: ServiceMDXOptions): string {
    const { industry, classification, wikidata, digital = 0.7, examples = true } = options

    // Generate frontmatter
    const frontmatter = this.generateFrontmatter(industry, classification, wikidata, digital)

    // Generate breadcrumb
    const breadcrumb = this.generateBreadcrumb(classification)

    // Generate title and description
    const title = `# ${industry.title}`
    const description = industry.description || wikidata?.description || `${industry.title} service.`

    // Generate properties section
    const properties = this.generatePropertiesSection()

    // Generate classification section
    const classificationSection = this.generateClassificationSection(classification, wikidata)

    // Generate examples section
    const examplesSection = examples ? this.generateExamplesSection(industry) : ''

    // Generate resources section
    const resources = this.generateResourcesSection(wikidata, classification)

    // Combine all sections
    return `${frontmatter}

${breadcrumb}

${title}

${description}

${properties}

${classificationSection}

${examplesSection}

${resources}
`.trim()
  }

  /**
   * Generate YAML frontmatter
   */
  private generateFrontmatter(
    industry: NAICSIndustry,
    classification: NAICSClassification,
    wikidata?: WikidataService,
    digital: number = 0.7
  ): string {
    const lines = [
      '---',
      `$id: https://services.org.ai/${this.toKebabCase(industry.title)}`,
      '$context: https://schema.org.ai',
      '$type: Service',
      `name: ${industry.title}`,
      `description: ${industry.description || 'Service type'}`,
    ]

    // Add NAICS classification
    lines.push('naics:')
    lines.push(`  code: "${classification.code}"`)
    lines.push(`  title: "${classification.title}"`)
    lines.push(`  sector: "${classification.sector}"`)
    lines.push(`  sectorName: "${classification.sectorName}"`)
    if (classification.subsector) {
      lines.push(`  subsector: "${classification.subsector}"`)
    }
    if (classification.industryGroup) {
      lines.push(`  industryGroup: "${classification.industryGroup}"`)
    }
    if (classification.industryGroupName) {
      lines.push(`  industryGroupName: "${classification.industryGroupName}"`)
    }

    // Add Wikidata if available
    if (wikidata) {
      lines.push(`wikidata: https://www.wikidata.org/wiki/${wikidata.qid}`)
      if (wikidata.wikipedia) {
        lines.push(`wikipedia: ${wikidata.wikipedia}`)
      }
    }

    lines.push(`digital: ${digital}`)
    lines.push('category: Service')
    lines.push(`serviceType: ${this.getServiceType(classification)}`)
    lines.push('---')

    return lines.join('\n')
  }

  /**
   * Determine service type from sector
   */
  private getServiceType(classification: NAICSClassification): string {
    const sectorTypes: Record<string, string> = {
      '54': 'Professional Service',
      '62': 'Healthcare Service',
      '61': 'Educational Service',
      '52': 'Financial Service',
      '72': 'Hospitality Service',
      '81': 'Personal Service',
      '51': 'Information Service',
      '48': 'Transportation Service',
      '49': 'Transportation Service',
      '56': 'Support Service'
    }

    return sectorTypes[classification.sector] || 'Professional Service'
  }

  /**
   * Generate breadcrumb navigation
   */
  private generateBreadcrumb(classification: NAICSClassification): string {
    return `[Thing](https://schema.org.ai/Thing) > [Service](Service.mdx) > ${classification.sectorName}`
  }

  /**
   * Generate properties section
   */
  private generatePropertiesSection(): string {
    return `## Properties

| Property | Type | Description | Inherited From |
|----------|------|-------------|----------------|
| name | Text | The name of the service | Thing |
| description | Text | A description of the service | Thing |
| provider | Organization \\| Person | The service provider | Service |
| serviceType | Text | The type of service | Service |
| areaServed | Place \\| GeoShape | Geographic area served | Service |
| category | Text \\| Thing | Category of the service | Service |
| hoursAvailable | OpeningHoursSpecification | Service hours | Service |
| offers | Offer | Service offer details | Service |
| availableChannel | ServiceChannel | How to access the service | Service |`
  }

  /**
   * Generate classification section
   */
  private generateClassificationSection(
    classification: NAICSClassification,
    wikidata?: WikidataService
  ): string {
    const lines = ['## Classification', '']

    let naicsPath = `${classification.sectorName}`
    if (classification.industryGroupName) {
      naicsPath += ` > ${classification.industryGroupName}`
    }
    naicsPath += ` > ${classification.title}`

    lines.push(`- **NAICS**: ${classification.code} (${naicsPath})`)

    if (wikidata) {
      lines.push(`- **Wikidata**: [${wikidata.qid}](https://www.wikidata.org/wiki/${wikidata.qid})`)
      if (wikidata.wikipedia) {
        const title = wikidata.wikipedia.split('/').pop()
        lines.push(`- **Wikipedia**: [${title}](${wikidata.wikipedia})`)
      }
    }

    return lines.join('\n')
  }

  /**
   * Generate examples section
   */
  private generateExamplesSection(industry: NAICSIndustry): string {
    const varName = this.toCamelCase(industry.title)
    const typeName = this.toPascalCase(industry.title)

    return `## Examples

\`\`\`typescript
import { $ } from '@org.ai/services'

// Create a basic service
const ${varName} = $.${typeName}.create({
  name: 'Example ${industry.title}',
  description: '${industry.description || 'Service description'}',
  provider: 'Example Company',
  serviceType: '${this.getServiceType({ sector: industry.sector.code } as NAICSClassification)}',
  areaServed: 'United States'
})

// With additional properties
const detailed${typeName} = $.${typeName}.create({
  name: 'Premium ${industry.title}',
  description: 'Premium service with enhanced features',
  provider: {
    name: 'Premium Service Provider',
    type: 'Organization'
  },
  serviceType: '${this.getServiceType({ sector: industry.sector.code } as NAICSClassification)}',
  areaServed: {
    name: 'San Francisco Bay Area',
    type: 'Place'
  },
  hoursAvailable: {
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '17:00'
  }
})

// Query services
const allServices = $.${typeName}.find()
\`\`\``
  }

  /**
   * Generate resources section
   */
  private generateResourcesSection(wikidata?: WikidataService, classification?: NAICSClassification): string {
    const lines = ['## Resources', '']
    lines.push('- [Schema.org Service](https://schema.org/Service)')

    if (classification) {
      lines.push(`- [NAICS ${classification.code}](https://www.census.gov/naics/?input=${classification.code})`)
    }

    if (wikidata) {
      lines.push(`- [Wikidata: ${wikidata.label} (${wikidata.qid})](https://www.wikidata.org/wiki/${wikidata.qid})`)
      if (wikidata.wikipedia) {
        const title = wikidata.wikipedia.split('/').pop()
        lines.push(`- [Wikipedia: ${title}](${wikidata.wikipedia})`)
      }
    }

    return lines.join('\n')
  }

  /**
   * Convert string to kebab-case
   */
  private toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_()]+/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '')
      .toLowerCase()
  }

  /**
   * Convert string to camelCase
   */
  private toCamelCase(str: string): string {
    return str
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
      .replace(/^[A-Z]/, (chr) => chr.toLowerCase())
  }

  /**
   * Convert string to PascalCase
   */
  private toPascalCase(str: string): string {
    return str
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
      .replace(/^[a-z]/, (chr) => chr.toUpperCase())
  }

  /**
   * Generate filename from service name
   */
  generateFilename(serviceName: string): string {
    return `${this.toPascalCase(serviceName)}.mdx`
  }
}

// Export singleton instance
export const mdxGenerator = new ServiceMDXGenerator()
