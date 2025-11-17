/**
 * NAICS (North American Industry Classification System) Parser
 * Parses NAICS 2022 classification data
 */

export interface NAICSIndustry {
  code: string
  title: string
  description?: string
  sector: NAICSSector
}

export interface NAICSSector {
  code: string
  name: string
  description?: string
}

export interface NAICSClassification {
  code: string
  title: string
  sector: string
  sectorName: string
  subsector?: string
  industryGroup?: string
  industryGroupName?: string
}

// Sample NAICS 2022 data - In production, this would be loaded from Census Bureau data
const NAICS_DATA: Record<string, NAICSIndustry> = {
  '541511': {
    code: '541511',
    title: 'Custom Computer Programming Services',
    description: 'Writing, modifying, testing, and supporting software to meet the needs of a particular customer',
    sector: {
      code: '54',
      name: 'Professional, Scientific, and Technical Services',
      description: 'Industries comprising establishments that specialize in performing professional, scientific, and technical activities for others'
    }
  },
  '541512': {
    code: '541512',
    title: 'Computer Systems Design Services',
    description: 'Planning and designing computer systems that integrate computer hardware, software, and communication technologies',
    sector: {
      code: '54',
      name: 'Professional, Scientific, and Technical Services',
      description: 'Industries comprising establishments that specialize in performing professional, scientific, and technical activities for others'
    }
  },
  '541513': {
    code: '541513',
    title: 'Computer Facilities Management Services',
    description: 'Providing on-site management and operation of clients computer systems and/or data processing facilities',
    sector: {
      code: '54',
      name: 'Professional, Scientific, and Technical Services',
      description: 'Industries comprising establishments that specialize in performing professional, scientific, and technical activities for others'
    }
  },
  '722511': {
    code: '722511',
    title: 'Full-Service Restaurants',
    description: 'Providing food services to patrons who order and are served while seated and pay after eating',
    sector: {
      code: '72',
      name: 'Accommodation and Food Services',
      description: 'Industries providing customers with lodging and/or preparing meals, snacks, and beverages for immediate consumption'
    }
  },
  '722513': {
    code: '722513',
    title: 'Limited-Service Restaurants',
    description: 'Providing food services where patrons generally order or select items and pay before eating',
    sector: {
      code: '72',
      name: 'Accommodation and Food Services',
      description: 'Industries providing customers with lodging and/or preparing meals, snacks, and beverages for immediate consumption'
    }
  },
  '541110': {
    code: '541110',
    title: 'Offices of Lawyers',
    description: 'Legal advice and representation in civil and criminal legal matters',
    sector: {
      code: '54',
      name: 'Professional, Scientific, and Technical Services',
      description: 'Industries comprising establishments that specialize in performing professional, scientific, and technical activities for others'
    }
  },
  '541211': {
    code: '541211',
    title: 'Offices of Certified Public Accountants',
    description: 'Providing accounting, auditing, and bookkeeping services',
    sector: {
      code: '54',
      name: 'Professional, Scientific, and Technical Services',
      description: 'Industries comprising establishments that specialize in performing professional, scientific, and technical activities for others'
    }
  },
  '621111': {
    code: '621111',
    title: 'Offices of Physicians (except Mental Health Specialists)',
    description: 'Providing medical care services by licensed physicians',
    sector: {
      code: '62',
      name: 'Health Care and Social Assistance',
      description: 'Industries providing health care and social assistance for individuals'
    }
  },
  '621210': {
    code: '621210',
    title: 'Offices of Dentists',
    description: 'Providing dental care services by licensed dentists',
    sector: {
      code: '62',
      name: 'Health Care and Social Assistance',
      description: 'Industries providing health care and social assistance for individuals'
    }
  },
  '611110': {
    code: '611110',
    title: 'Elementary and Secondary Schools',
    description: 'Providing academic courses and associated course work that comprise a basic preparatory education',
    sector: {
      code: '61',
      name: 'Educational Services',
      description: 'Industries providing instruction and training in a wide variety of subjects'
    }
  }
}

export class NAICSParser {
  private data: Record<string, NAICSIndustry>

  constructor(data?: Record<string, NAICSIndustry>) {
    this.data = data || NAICS_DATA
  }

  /**
   * Get industry by code
   */
  getIndustry(code: string): NAICSIndustry | null {
    return this.data[code] || null
  }

  /**
   * Get classification structure for a NAICS code
   */
  getClassification(code: string): NAICSClassification | null {
    const industry = this.getIndustry(code)
    if (!industry) return null

    const sector = code.substring(0, 2)
    const subsector = code.length >= 3 ? code.substring(0, 3) : undefined
    const industryGroup = code.length >= 4 ? code.substring(0, 4) : undefined

    return {
      code: industry.code,
      title: industry.title,
      sector,
      sectorName: industry.sector.name,
      subsector,
      industryGroup,
      industryGroupName: this.getIndustryGroupName(industryGroup)
    }
  }

  /**
   * Get industry group name (simplified for demo)
   */
  private getIndustryGroupName(industryGroup?: string): string | undefined {
    if (!industryGroup) return undefined

    const industryGroupNames: Record<string, string> = {
      '5415': 'Computer Systems Design and Related Services',
      '7225': 'Restaurants and Other Eating Places',
      '5411': 'Legal Services',
      '5412': 'Accounting, Tax Preparation, Bookkeeping, and Payroll Services',
      '6211': 'Offices of Physicians',
      '6212': 'Offices of Dentists',
      '6111': 'Elementary and Secondary Schools'
    }

    return industryGroupNames[industryGroup]
  }

  /**
   * Get all industries in a sector
   */
  getIndustriesBySector(sectorCode: string): NAICSIndustry[] {
    return Object.values(this.data).filter(
      industry => industry.sector.code === sectorCode
    )
  }

  /**
   * Get all service-providing industries
   */
  getServiceIndustries(): NAICSIndustry[] {
    // Service-providing industries: sectors 42, 44-45, 48-49, 51-92
    const serviceSectors = ['42', '44', '45', '48', '49', '51', '52', '53', '54', '55', '56', '61', '62', '71', '72', '81', '92']

    return Object.values(this.data).filter(
      industry => serviceSectors.includes(industry.sector.code)
    )
  }

  /**
   * Get all sectors
   */
  getAllSectors(): NAICSSector[] {
    const sectors = new Map<string, NAICSSector>()

    Object.values(this.data).forEach(industry => {
      const sector = industry.sector
      if (!sectors.has(sector.code)) {
        sectors.set(sector.code, sector)
      }
    })

    return Array.from(sectors.values())
  }

  /**
   * Get all industries
   */
  getAllIndustries(): NAICSIndustry[] {
    return Object.values(this.data)
  }

  /**
   * Search industries by keyword
   */
  searchIndustries(keyword: string): NAICSIndustry[] {
    const lowerKeyword = keyword.toLowerCase()

    return Object.values(this.data).filter(industry =>
      industry.title.toLowerCase().includes(lowerKeyword) ||
      (industry.description && industry.description.toLowerCase().includes(lowerKeyword))
    )
  }

  /**
   * Load NAICS data from external source
   */
  async loadFromFile(filePath: string): Promise<void> {
    // In production, load from Census Bureau CSV/Excel files
    console.log(`Would load NAICS data from: ${filePath}`)
  }

  /**
   * Load NAICS data from Census Bureau API
   */
  async loadFromAPI(): Promise<void> {
    // In production, fetch from Census Bureau API
    console.log('Would fetch NAICS data from Census Bureau API')
  }
}

// Export singleton instance
export const naicsParser = new NAICSParser()
