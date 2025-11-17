#!/usr/bin/env node
/**
 * Generate Sample Services (Fumadocs Structure)
 * Creates sample service type MDX files organized by category
 */

const fs = require('fs')
const path = require('path')

const BASE_DIR = path.join(__dirname, '..')

// Sample service data with fumadocs structure
const SAMPLE_SERVICES = [
  {
    name: 'Custom Computer Programming Services',
    description: 'Writing, modifying, testing, and supporting software to meet the needs of a particular customer',
    category: 'Professional-Services',
    subcategory: 'Computer-Services',
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
    category: 'Hospitality-Services',
    subcategory: 'Restaurants',
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
    category: 'Professional-Services',
    subcategory: 'Legal-Services',
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
    category: 'Healthcare-Services',
    subcategory: 'Physicians',
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
    category: 'Educational-Services',
    subcategory: 'Schools',
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
title: ${service.name}
description: ${service.description}
---

import { Tabs, Tab } from 'fumadocs-ui/components/tabs'
import { Callout } from 'fumadocs-ui/components/callout'

# ${service.name}

${service.description}

## Classification

<Tabs items={['NAICS', 'UNSPSC', 'Wikidata']}>
  <Tab value="NAICS">
    - **Code**: ${service.naics.code}
    - **Title**: ${service.naics.title}
    - **Sector**: ${service.naics.sector} - ${service.naics.sectorName}
    - **Subsector**: ${service.naics.subsector}
    - **Industry Group**: ${service.naics.industryGroup} - ${service.naics.industryGroupName}
  </Tab>
  <Tab value="UNSPSC">
    **Code**: ${service.unspsc}
  </Tab>
  <Tab value="Wikidata">
    - **QID**: [${service.wikidata}](https://www.wikidata.org/wiki/${service.wikidata})
    - **Wikipedia**: [${service.name}](${service.wikipedia})
  </Tab>
</Tabs>

## Properties

| Property | Type | Description | Required |
|----------|------|-------------|----------|
| name | string | Service name | Yes |
| description | string | Service description | No |
| provider | string \\| Organization \\| Person | Service provider | No |
| serviceType | string | Type of service | No |
| areaServed | string \\| Place | Geographic area | No |
| category | string | Service category | No |
| hoursAvailable | OpeningHoursSpecification | Service hours | No |
| offers | Offer | Service pricing | No |
| availableChannel | ServiceChannel | Access channels | No |

## Usage

<Tabs items={['TypeScript', 'JavaScript', 'JSON-LD']}>
  <Tab value="TypeScript">
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
  </Tab>
  <Tab value="JavaScript">
    \`\`\`javascript
    const { $ } = require('services.org.ai')

    const ${camelName} = $.${pascalName}.create({
      name: 'Example ${service.name}',
      provider: 'Example Company'
    })
    \`\`\`
  </Tab>
  <Tab value="JSON-LD">
    \`\`\`json
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Example ${service.name}",
      "description": "${service.description}",
      "provider": {
        "@type": "Organization",
        "name": "Example Company"
      },
      "serviceType": "${service.serviceType}"
    }
    \`\`\`
  </Tab>
</Tabs>

## Digital Score

<Callout type="info">
  **Digital Score**: ${service.digital} / 1.0

  This service has a ${service.digital >= 0.7 ? 'high' : service.digital >= 0.4 ? 'medium' : 'low'} digital delivery score, indicating ${
    service.digital >= 0.7 ? 'primarily digital/remote delivery' :
    service.digital >= 0.4 ? 'hybrid delivery with digital components' :
    'primarily in-person service delivery'
  }.
</Callout>

## Resources

- [Schema.org Service](https://schema.org/Service)
- [NAICS ${service.naics.code}](https://www.census.gov/naics/?input=${service.naics.code})
- [Wikidata: ${service.name} (${service.wikidata})](https://www.wikidata.org/wiki/${service.wikidata})
- [Wikipedia: ${service.name}](${service.wikipedia})
- [UNSPSC Code ${service.unspsc}](https://www.ungm.org/public/unspsc)
`
}

/**
 * Generate category index page
 */
function generateCategoryIndex(categoryName, services) {
  const displayName = categoryName.replace(/-/g, ' ')

  return `---
title: ${displayName}
description: Service types in the ${displayName} category
---

# ${displayName}

Browse service types in this category:

${services.map(s => `- [${s.name}](./${s.subcategory}/${s.name.replace(/\s+/g, '-').replace(/[()]/g, '')})`).join('\n')}

## Overview

This category includes services classified under NAICS sector: **${services[0].naics.sectorName}**

Total service types: ${services.length}
`
}

/**
 * Generate subcategory index page
 */
function generateSubcategoryIndex(categoryName, subcategoryName, services) {
  const categoryDisplay = categoryName.replace(/-/g, ' ')
  const subcategoryDisplay = subcategoryName.replace(/-/g, ' ')

  return `---
title: ${subcategoryDisplay}
description: Service types in ${subcategoryDisplay}
---

# ${subcategoryDisplay}

Service types in this subcategory:

${services.map(s => `- [${s.name}](./${s.name.replace(/\s+/g, '-').replace(/[()]/g, '')})`).join('\n')}

## Classification

- **Category**: ${categoryDisplay}
- **Subcategory**: ${subcategoryDisplay}
- **NAICS Industry Group**: ${services[0].naics.industryGroupName}
`
}

/**
 * Main generation function
 */
function generateSamples() {
  console.log('🚀 Generating sample services with fumadocs structure...\n')

  let generated = 0

  // Group services by category and subcategory
  const categoryMap = new Map()

  for (const service of SAMPLE_SERVICES) {
    const categoryKey = service.category
    if (!categoryMap.has(categoryKey)) {
      categoryMap.set(categoryKey, new Map())
    }

    const subcategoryMap = categoryMap.get(categoryKey)
    const subcategoryKey = service.subcategory
    if (!subcategoryMap.has(subcategoryKey)) {
      subcategoryMap.set(subcategoryKey, [])
    }

    subcategoryMap.get(subcategoryKey).push(service)
  }

  // Generate files for each service
  for (const service of SAMPLE_SERVICES) {
    try {
      const categoryDir = `(${service.category})`
      const subcategoryDir = `(${service.subcategory})`
      const dirPath = path.join(BASE_DIR, categoryDir, subcategoryDir)

      // Ensure directory exists
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
      }

      // Generate service MDX
      const mdxContent = generateServiceMDX(service)
      const filename = `${service.name.replace(/\s+/g, '-').replace(/[()]/g, '')}.mdx`
      const filepath = path.join(dirPath, filename)

      fs.writeFileSync(filepath, mdxContent, 'utf-8')

      console.log(`✅ Generated: ${categoryDir}/${subcategoryDir}/${filename}`)
      generated++
    } catch (error) {
      console.error(`❌ Failed to generate ${service.name}:`, error.message)
    }
  }

  // Generate category index pages
  for (const [category, subcategoryMap] of categoryMap.entries()) {
    const categoryDir = path.join(BASE_DIR, `(${category})`)
    const allServices = Array.from(subcategoryMap.values()).flat()
    const indexContent = generateCategoryIndex(category, allServices)
    const indexPath = path.join(categoryDir, 'index.mdx')

    fs.writeFileSync(indexPath, indexContent, 'utf-8')
    console.log(`✅ Generated: (${category})/index.mdx`)

    // Generate subcategory index pages
    for (const [subcategory, services] of subcategoryMap.entries()) {
      const subcategoryDir = path.join(categoryDir, `(${subcategory})`)
      const subIndexContent = generateSubcategoryIndex(category, subcategory, services)
      const subIndexPath = path.join(subcategoryDir, 'index.mdx')

      fs.writeFileSync(subIndexPath, subIndexContent, 'utf-8')
      console.log(`✅ Generated: (${category})/(${subcategory})/index.mdx`)
    }
  }

  console.log(`\n📊 Generation complete!`)
  console.log(`   ✅ Generated: ${generated} service types`)
  console.log(`   ✅ Generated: ${categoryMap.size} category indexes`)
  console.log(`   ✅ Generated: ${Array.from(categoryMap.values()).reduce((sum, m) => sum + m.size, 0)} subcategory indexes`)
  console.log(`   📁 Structure: fumadocs (Category)/(Subcategory)/Service.mdx`)
}

// Run generator
if (require.main === module) {
  generateSamples()
}

module.exports = { generateSamples }
