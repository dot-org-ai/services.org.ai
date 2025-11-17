#!/usr/bin/env node
/**
 * Generate Sample Services
 * Creates sample service type MDX files
 */

const fs = require('fs')
const path = require('path')

const OUTPUT_DIR = path.join(__dirname, '..', 'types', 'generated')

// Sample service data with NAICS classification
const SAMPLE_SERVICES = [
  {
    name: 'Custom Computer Programming Services',
    description: 'Writing, modifying, testing, and supporting software to meet the needs of a particular customer',
    naics: {
      code: '541511',
      title: 'Custom Computer Programming Services',
      sector: '54',
      sectorName: 'Professional, Scientific, and Technical Services',
      subsector: '541',
      industryGroup: '5415',
      industryGroupName: 'Computer Systems Design and Related Services'
    },
    unspsc: '80111700',
    wikidata: 'Q21198342',
    wikipedia: 'https://en.wikipedia.org/wiki/Custom_software',
    digital: 1.0,
    serviceType: 'Professional Service'
  },
  {
    name: 'Full-Service Restaurants',
    description: 'Providing food services to patrons who order and are served while seated and pay after eating',
    naics: {
      code: '722511',
      title: 'Full-Service Restaurants',
      sector: '72',
      sectorName: 'Accommodation and Food Services',
      subsector: '722',
      industryGroup: '7225',
      industryGroupName: 'Restaurants and Other Eating Places'
    },
    unspsc: '90101501',
    wikidata: 'Q11707',
    wikipedia: 'https://en.wikipedia.org/wiki/Restaurant',
    digital: 0.3,
    serviceType: 'Hospitality Service'
  },
  {
    name: 'Offices of Lawyers',
    description: 'Legal advice and representation in civil and criminal legal matters and other legal services',
    naics: {
      code: '541110',
      title: 'Offices of Lawyers',
      sector: '54',
      sectorName: 'Professional, Scientific, and Technical Services',
      subsector: '541',
      industryGroup: '5411',
      industryGroupName: 'Legal Services'
    },
    unspsc: '80121500',
    wikidata: 'Q40348',
    wikipedia: 'https://en.wikipedia.org/wiki/Lawyer',
    digital: 0.6,
    serviceType: 'Professional Service'
  },
  {
    name: 'Offices of Physicians',
    description: 'Medical care services provided by licensed physicians in private practice',
    naics: {
      code: '621111',
      title: 'Offices of Physicians (except Mental Health Specialists)',
      sector: '62',
      sectorName: 'Health Care and Social Assistance',
      subsector: '621',
      industryGroup: '6211',
      industryGroupName: 'Offices of Physicians'
    },
    unspsc: '85121600',
    wikidata: 'Q39631',
    wikipedia: 'https://en.wikipedia.org/wiki/Physician',
    digital: 0.5,
    serviceType: 'Healthcare Service'
  },
  {
    name: 'Elementary and Secondary Schools',
    description: 'Providing academic courses and associated course work that comprise a basic preparatory education',
    naics: {
      code: '611110',
      title: 'Elementary and Secondary Schools',
      sector: '61',
      sectorName: 'Educational Services',
      subsector: '611',
      industryGroup: '6111',
      industryGroupName: 'Elementary and Secondary Schools'
    },
    unspsc: '86101500',
    wikidata: 'Q3914',
    wikipedia: 'https://en.wikipedia.org/wiki/School',
    digital: 0.6,
    serviceType: 'Educational Service'
  }
]

/**
 * Generate MDX for a service
 */
function generateServiceMDX(service) {
  const kebabName = service.name.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')
  const pascalName = service.name.replace(/\s+/g, '').replace(/[()]/g, '')
  const camelName = pascalName.charAt(0).toLowerCase() + pascalName.slice(1)

  return `---
$id: https://services.org.ai/${kebabName}
$context: https://schema.org.ai
$type: Service
name: ${service.name}
description: ${service.description}
naics:
  code: "${service.naics.code}"
  title: "${service.naics.title}"
  sector: "${service.naics.sector}"
  sectorName: "${service.naics.sectorName}"
  subsector: "${service.naics.subsector}"
  industryGroup: "${service.naics.industryGroup}"
  industryGroupName: "${service.naics.industryGroupName}"
unspsc: "${service.unspsc}"
wikidata: https://www.wikidata.org/wiki/${service.wikidata}
wikipedia: ${service.wikipedia}
digital: ${service.digital}
category: Service
serviceType: ${service.serviceType}
---

[Thing](https://schema.org.ai/Thing) > [Service](../Service.mdx) > ${service.naics.sectorName}

# ${service.name}

${service.description}

## Properties

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
| availableChannel | ServiceChannel | How to access the service | Service |

## Classification

- **NAICS**: ${service.naics.code} (${service.naics.sectorName} > ${service.naics.industryGroupName} > ${service.naics.title})
- **UNSPSC**: ${service.unspsc}
- **Wikidata**: [${service.wikidata}](https://www.wikidata.org/wiki/${service.wikidata})
- **Wikipedia**: [${service.name}](${service.wikipedia})

## Examples

\`\`\`typescript
import { $ } from 'services.org.ai'

// Create a basic service
const ${camelName} = $.${pascalName}.create({
  name: 'Example ${service.name}',
  description: '${service.description}',
  provider: 'Example Company',
  serviceType: '${service.serviceType}',
  areaServed: 'United States'
})

// With additional properties
const detailed${pascalName} = $.${pascalName}.create({
  name: 'Premium ${service.name}',
  description: 'Premium service with enhanced features',
  provider: {
    name: 'Premium Service Provider',
    type: 'Organization'
  },
  serviceType: '${service.serviceType}',
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
const allServices = $.${pascalName}.find()
\`\`\`

## Resources

- [Schema.org Service](https://schema.org/Service)
- [NAICS ${service.naics.code}](https://www.census.gov/naics/?input=${service.naics.code})
- [Wikidata: ${service.name} (${service.wikidata})](https://www.wikidata.org/wiki/${service.wikidata})
- [Wikipedia: ${service.name}](${service.wikipedia})
`
}

/**
 * Main generation function
 */
function generateSamples() {
  console.log('🚀 Generating sample service types...\n')

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  let generated = 0

  for (const service of SAMPLE_SERVICES) {
    try {
      const mdxContent = generateServiceMDX(service)
      const filename = `${service.name.replace(/\s+/g, '').replace(/[()]/g, '')}.mdx`
      const filepath = path.join(OUTPUT_DIR, filename)

      fs.writeFileSync(filepath, mdxContent, 'utf-8')

      console.log(`✅ Generated: ${filename}`)
      generated++
    } catch (error) {
      console.error(`❌ Failed to generate ${service.name}:`, error.message)
    }
  }

  console.log(`\n📊 Generation complete!`)
  console.log(`   ✅ Generated: ${generated} service types`)
  console.log(`   📁 Output: ${OUTPUT_DIR}`)
}

// Run generator
if (require.main === module) {
  generateSamples()
}

module.exports = { generateSamples }
