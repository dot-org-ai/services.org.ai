# services.org.ai

**Comprehensive Service Ontology for the Semantic Web**

A structured, machine-readable ontology of service types built on Schema.org and enriched with NAICS, UNSPSC, Wikidata, and Wikipedia classifications.

## Overview

services.org.ai provides:

- **10,000+ Service Types** - Comprehensive coverage based on NAICS 2022 classification
- **Multi-System Classification** - NAICS, UNSPSC, Wikidata, and Wikipedia cross-references
- **Schema.org Compatible** - Extends standard Schema.org Service types
- **TypeScript-First** - Full TypeScript type definitions and runtime validation
- **Rich Metadata** - Detailed descriptions, properties, and examples for each type
- **Open Source** - CC BY-SA 4.0 licensed with full attribution

## Features

### Authoritative Classifications

- **NAICS 2022** - 6-digit North American Industry Classification System
- **UNSPSC** - United Nations Standard Products and Services Code
- **Wikidata** - Semantic knowledge graph references (Q-IDs)
- **Wikipedia** - Human-readable documentation and descriptions

### Service Coverage

Sample service categories include:

- **Professional Services** - Consulting, legal, accounting, architecture
- **Technical Services** - IT, engineering, computer programming, design
- **Healthcare Services** - Medical, dental, mental health, veterinary
- **Educational Services** - Schools, training, tutoring, online learning
- **Financial Services** - Banking, insurance, investment, accounting
- **Hospitality Services** - Hotels, restaurants, catering, entertainment
- **Transportation Services** - Shipping, passenger transport, logistics
- **Personal Services** - Hair salons, dry cleaning, repair services
- **Creative Services** - Design, marketing, advertising, media production

## Installation

```bash
npm install services.org.ai
```

Or with other package managers:

```bash
yarn add services.org.ai
pnpm add services.org.ai
bun add services.org.ai
```

## Usage

### TypeScript

```typescript
import { $ } from 'services.org.ai'

// Create a service instance
const programmingService = $.CustomComputerProgrammingServices.create({
  name: 'Web Application Development',
  description: 'Full-stack web application development services',
  provider: 'Acme Software Inc.',
  serviceType: 'Professional Service',
  areaServed: 'United States',
  hoursAvailable: {
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '17:00'
  }
})

// Access NAICS classification
console.log(programmingService.naics.sectorName) // "Professional, Scientific, and Technical Services"
console.log(programmingService.naics.code)       // "541511"

// Query services
const allProgrammingServices = $.CustomComputerProgrammingServices.find()
const localServices = $.CustomComputerProgrammingServices.find({
  areaServed: 'San Francisco'
})
```

### JavaScript

```javascript
const { $ } = require('services.org.ai')

const restaurant = $.FullServiceRestaurants.create({
  name: 'The French Laundry',
  provider: 'Thomas Keller Restaurant Group',
  serviceType: 'Food Service',
  areaServed: 'Yountville, CA'
})
```

### JSON-LD

All service types support JSON-LD serialization:

```typescript
const legalService = $.OfficesOfLawyers.create({
  name: 'Smith & Associates Law Firm',
  provider: 'Smith & Associates',
  serviceType: 'Legal Service',
  areaServed: 'California'
})

const jsonld = legalService.toJSONLD()
// {
//   "@context": "https://schema.org",
//   "@type": "Service",
//   "name": "Smith & Associates Law Firm",
//   "provider": { "@type": "Organization", "name": "Smith & Associates" },
//   "serviceType": "Legal Service"
// }
```

## Documentation

### Service Type Structure

Each service type includes:

```yaml
---
$id: https://services.org.ai/{service-name}
$context: https://schema.org.ai
$type: Service
name: Service Name
description: Human-readable description
naics:
  code: "XXXXXX"
  title: "Industry Title"
  sector: "XX"
  sectorName: "Sector Name"
  subsector: "XXX"
  industryGroup: "XXXX"
  industryGroupName: "Industry Group Name"
unspsc: "XXXXXXXX"
wikidata: https://www.wikidata.org/wiki/QXXXXX
wikipedia: https://en.wikipedia.org/wiki/Service_Name
digital: 0.0-1.0
serviceType: Service Category
---
```

### Properties

All services inherit from Schema.org Service:

| Property | Type | Description |
|----------|------|-------------|
| name | Text | Service name |
| description | Text | Service description |
| provider | Organization \| Person | Service provider |
| serviceType | Text | Type of service |
| areaServed | Place \| GeoShape | Geographic area served |
| category | Text \| Thing | Service category |
| hoursAvailable | OpeningHoursSpecification | Service hours |
| offers | Offer | Service offers/pricing |
| availableChannel | ServiceChannel | How to access service |

Extended properties:

| Property | Type | Description |
|----------|------|-------------|
| naics | NAICSClassification | NAICS hierarchy |
| unspsc | Text | UNSPSC code |
| wikidata | URL | Wikidata Q-ID |
| wikipedia | URL | Wikipedia article |
| digital | Number | Digital score (0-1) |
| deliveryMethod | Text | Delivery method (in-person, remote, hybrid) |

## Data Sources

This ontology integrates data from:

1. **NAICS 2022** - North American Industry Classification
   - US Census Bureau
   - License: Public Domain (US Government)
   - URL: https://www.census.gov/naics/

2. **UNSPSC** - UN Standard Products and Services Code
   - United Nations Development Programme
   - License: Free for use
   - URL: https://www.ungm.org/public/unspsc

3. **Wikidata** - Semantic knowledge base
   - Wikimedia Foundation
   - License: CC0 (Public Domain)
   - URL: https://www.wikidata.org

4. **Wikipedia** - Free encyclopedia
   - Wikimedia Foundation
   - License: CC BY-SA 3.0/4.0
   - URL: https://www.wikipedia.org

5. **Schema.org** - Structured data vocabulary
   - Schema.org Community
   - License: CC BY-SA 3.0
   - URL: https://schema.org

## Project Structure

```
services.org.ai/
├── types/           # Service type definitions (MDX)
│   ├── Service.mdx  # Base service type
│   └── generated/   # Generated service types
├── scripts/         # Generation and utility scripts
│   ├── wikidata-client.ts   # Wikidata SPARQL client
│   ├── naics-parser.ts      # NAICS parser
│   ├── mdx-generator.ts     # MDX generator
│   └── generate.ts          # Main generator
├── data/           # Source data files
└── docs/           # Additional documentation
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This ontology is licensed under **CC BY-SA 4.0** (Creative Commons Attribution-ShareAlike 4.0 International).

You are free to:
- Share — copy and redistribute the material
- Adapt — remix, transform, and build upon the material

Under the following terms:
- Attribution — Must give appropriate credit
- ShareAlike — Must distribute under same license

See [LICENSE](LICENSE) for full details.

## Attribution

When using this ontology, please include attribution to:

```
services.org.ai - https://services.org.ai
Based on NAICS, UNSPSC, Wikidata, and Wikipedia data
```

## Related Projects

- **[schema.org.ai](https://github.com/dot-org-ai/schema.org.ai)** - Core schema ontology
- **[products.org.ai](https://github.com/dot-org-ai/products.org.ai)** - Product types ontology
- **[industries.org.ai](https://github.com/dot-org-ai/industries.org.ai)** - Industry classifications
- **[occupations.org.ai](https://github.com/dot-org-ai/occupations.org.ai)** - Job and occupation types

## Support

- Documentation: https://services.org.ai/docs
- Issues: https://github.com/dot-org-ai/services.org.ai/issues
- Discussions: https://github.com/dot-org-ai/services.org.ai/discussions

## Acknowledgments

Special thanks to:
- US Census Bureau for NAICS classification
- United Nations for UNSPSC
- Wikimedia Foundation for Wikidata and Wikipedia
- Schema.org community
- All contributors to this project

---

Built with ❤️ by the .org.ai team
