#!/usr/bin/env node
/**
 * Generate Services (Flat Structure with Breadcrumbs)
 * All files in root directory with TitleCase names and breadcrumb navigation
 */

const fs = require('fs')
const path = require('path')

const BASE_DIR = path.join(__dirname, '..')

// Sample service data
const SAMPLE_SERVICES = [
  {
    name: 'Custom Computer Programming Services',
    titleCase: 'CustomComputerProgrammingServices',
    description: 'Writing, modifying, testing, and supporting software to meet the needs of a particular customer',
    category: { name: 'ProfessionalServices', display: 'Professional Services' },
    subcategory: { name: 'ComputerServices', display: 'Computer Services' },
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
    titleCase: 'FullServiceRestaurants',
    description: 'Providing food services to patrons who order and are served while seated and pay after eating',
    category: { name: 'HospitalityServices', display: 'Hospitality Services' },
    subcategory: { name: 'Restaurants', display: 'Restaurants' },
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
    titleCase: 'OfficesOfLawyers',
    description: 'Legal advice and representation in civil and criminal legal matters and other legal services',
    category: { name: 'ProfessionalServices', display: 'Professional Services' },
    subcategory: { name: 'LegalServices', display: 'Legal Services' },
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
    titleCase: 'OfficesOfPhysicians',
    description: 'Medical care services provided by licensed physicians in private practice',
    category: { name: 'HealthcareServices', display: 'Healthcare Services' },
    subcategory: { name: 'Physicians', display: 'Physicians' },
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
    titleCase: 'ElementaryAndSecondarySchools',
    description: 'Providing academic courses and associated course work that comprise a basic preparatory education',
    category: { name: 'EducationalServices', display: 'Educational Services' },
    subcategory: { name: 'Schools', display: 'Schools' },
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
  const camelName = service.titleCase.charAt(0).toLowerCase() + service.titleCase.slice(1)

  return `---
title: ${service.name}
description: ${service.description}
---

import { Breadcrumb, BreadcrumbItem } from 'fumadocs-ui/components/breadcrumb'
import { Tabs, Tab } from 'fumadocs-ui/components/tabs'
import { Callout } from 'fumadocs-ui/components/callout'

<Breadcrumb>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/${service.category.name}">${service.category.display}</BreadcrumbItem>
  <BreadcrumbItem href="/${service.subcategory.name}">${service.subcategory.display}</BreadcrumbItem>
  <BreadcrumbItem>${service.name}</BreadcrumbItem>
</Breadcrumb>

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
    const ${camelName} = $.${service.titleCase}.create({
      name: 'Example ${service.name}',
      description: '${service.description}',
      provider: 'Example Company',
      serviceType: '${service.serviceType}',
      areaServed: 'United States'
    })

    // With additional properties
    const detailed${service.titleCase} = $.${service.titleCase}.create({
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
    const allServices = $.${service.titleCase}.find()
    \`\`\`
  </Tab>
  <Tab value="JavaScript">
    \`\`\`javascript
    const { $ } = require('services.org.ai')

    const ${camelName} = $.${service.titleCase}.create({
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
 * Generate category MDX page
 */
function generateCategoryMDX(category, services) {
  const subcategories = {}
  services.forEach(s => {
    if (!subcategories[s.subcategory.name]) {
      subcategories[s.subcategory.name] = {
        display: s.subcategory.display,
        services: []
      }
    }
    subcategories[s.subcategory.name].services.push(s)
  })

  return `---
title: ${category.display}
description: Service types in the ${category.display} category
---

import { Breadcrumb, BreadcrumbItem } from 'fumadocs-ui/components/breadcrumb'

<Breadcrumb>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem>${category.display}</BreadcrumbItem>
</Breadcrumb>

# ${category.display}

Browse service types in this category:

${Object.entries(subcategories).map(([key, sub]) => `
## ${sub.display}

${sub.services.map(s => `- [${s.name}](/${s.titleCase})`).join('\n')}
`).join('\n')}

## Overview

This category includes services classified under NAICS sector: **${services[0].naics.sectorName}**

Total service types: ${services.length}
`
}

/**
 * Generate subcategory MDX page
 */
function generateSubcategoryMDX(category, subcategory, services) {
  return `---
title: ${subcategory.display}
description: Service types in ${subcategory.display}
---

import { Breadcrumb, BreadcrumbItem } from 'fumadocs-ui/components/breadcrumb'

<Breadcrumb>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/${category.name}">${category.display}</BreadcrumbItem>
  <BreadcrumbItem>${subcategory.display}</BreadcrumbItem>
</Breadcrumb>

# ${subcategory.display}

Service types in this subcategory:

${services.map(s => `- [${s.name}](/${s.titleCase})`).join('\n')}

## Classification

- **Category**: ${category.display}
- **Subcategory**: ${subcategory.display}
- **NAICS Industry Group**: ${services[0].naics.industryGroupName}

Total services: ${services.length}
`
}

/**
 * Main generation function
 */
function generateServices() {
  console.log('🚀 Generating services with FLAT structure and breadcrumbs...\n')

  let generated = 0

  // Group by category and subcategory
  const categoryMap = new Map()
  const subcategoryMap = new Map()

  for (const service of SAMPLE_SERVICES) {
    // Track categories
    if (!categoryMap.has(service.category.name)) {
      categoryMap.set(service.category.name, {
        display: service.category.display,
        services: []
      })
    }
    categoryMap.get(service.category.name).services.push(service)

    // Track subcategories
    const subKey = `${service.category.name}:${service.subcategory.name}`
    if (!subcategoryMap.has(subKey)) {
      subcategoryMap.set(subKey, {
        category: service.category,
        subcategory: service.subcategory,
        services: []
      })
    }
    subcategoryMap.get(subKey).services.push(service)
  }

  // Generate service files (flat in root)
  for (const service of SAMPLE_SERVICES) {
    try {
      const mdxContent = generateServiceMDX(service)
      const filename = `${service.titleCase}.mdx`
      const filepath = path.join(BASE_DIR, filename)

      fs.writeFileSync(filepath, mdxContent, 'utf-8')

      console.log(`✅ Generated: ${filename}`)
      console.log(`   → URL: /${service.titleCase}`)
      console.log(`   → GitHub: /${service.titleCase}.mdx (flat!)`)
      generated++
    } catch (error) {
      console.error(`❌ Failed to generate ${service.name}:`, error.message)
    }
  }

  // Generate category files (flat in root)
  for (const [categoryKey, categoryData] of categoryMap.entries()) {
    try {
      const mdxContent = generateCategoryMDX(
        { name: categoryKey, display: categoryData.display },
        categoryData.services
      )
      const filename = `${categoryKey}.mdx`
      const filepath = path.join(BASE_DIR, filename)

      fs.writeFileSync(filepath, mdxContent, 'utf-8')

      console.log(`✅ Generated: ${filename} (category)`)
      console.log(`   → URL: /${categoryKey}`)
    } catch (error) {
      console.error(`❌ Failed to generate category ${categoryKey}:`, error.message)
    }
  }

  // Generate subcategory files (flat in root)
  for (const [subKey, subData] of subcategoryMap.entries()) {
    try {
      const mdxContent = generateSubcategoryMDX(
        subData.category,
        subData.subcategory,
        subData.services
      )
      const filename = `${subData.subcategory.name}.mdx`
      const filepath = path.join(BASE_DIR, filename)

      fs.writeFileSync(filepath, mdxContent, 'utf-8')

      console.log(`✅ Generated: ${filename} (subcategory)`)
      console.log(`   → URL: /${subData.subcategory.name}`)
    } catch (error) {
      console.error(`❌ Failed to generate subcategory:`, error.message)
    }
  }

  console.log(`\n📊 Generation complete!`)
  console.log(`   ✅ Generated: ${generated} service types`)
  console.log(`   ✅ Generated: ${categoryMap.size} category pages`)
  console.log(`   ✅ Generated: ${subcategoryMap.size} subcategory pages`)
  console.log(`   📁 Structure: FLAT - all files in root`)
  console.log(`   🔗 URLs: /CustomComputerProgrammingServices (flat!)`)
  console.log(`   🥖 Breadcrumbs: Clickable navigation on every page`)
  console.log(`   💾 GitHub: Direct links work - /CustomComputerProgrammingServices.mdx`)
}

// Run generator
if (require.main === module) {
  generateServices()
}

module.exports = { generateServices }
