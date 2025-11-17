#!/usr/bin/env node
/**
 * Main Service Type Generator
 * Generates MDX files for all service types
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import { naicsParser } from './naics-parser'
import { mdxGenerator } from './mdx-generator'

const OUTPUT_DIR = join(__dirname, '..', 'types', 'generated')

/**
 * Generate all service type MDX files
 */
async function generateAllServices() {
  console.log('🚀 Starting service type generation...\n')

  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  // Get all service industries from NAICS
  const industries = naicsParser.getServiceIndustries()
  console.log(`📦 Found ${industries.length} service types to generate\n`)

  let generated = 0
  let failed = 0

  for (const industry of industries) {
    try {
      // Get classification
      const classification = naicsParser.getClassification(industry.code)
      if (!classification) {
        console.warn(`⚠️  No classification found for ${industry.title} (${industry.code})`)
        failed++
        continue
      }

      // Generate MDX content
      const mdxContent = mdxGenerator.generate({
        industry,
        classification,
        digital: calculateDigitalScore(industry),
        examples: true
      })

      // Generate filename
      const filename = mdxGenerator.generateFilename(industry.title)
      const filepath = join(OUTPUT_DIR, filename)

      // Write file
      writeFileSync(filepath, mdxContent, 'utf-8')

      console.log(`✅ Generated: ${filename}`)
      generated++
    } catch (error) {
      console.error(`❌ Failed to generate ${industry.title}:`, error)
      failed++
    }
  }

  console.log(`\n📊 Generation complete!`)
  console.log(`   ✅ Generated: ${generated}`)
  console.log(`   ❌ Failed: ${failed}`)
  console.log(`   📁 Output: ${OUTPUT_DIR}`)
}

/**
 * Calculate digital score based on service sector
 */
function calculateDigitalScore(industry: any): number {
  const sectorCode = industry.sector.code
  const title = industry.title.toLowerCase()

  // Computer/IT services = high digital score
  if (title.includes('computer') ||
      title.includes('software') ||
      title.includes('web') ||
      title.includes('data processing') ||
      title.includes('internet')) {
    return 1.0
  }

  // Information services = high digital
  if (sectorCode === '51') return 0.9

  // Professional services (consulting, etc.) = medium-high digital
  if (sectorCode === '54') return 0.7

  // Financial services = medium-high digital
  if (sectorCode === '52') return 0.8

  // Healthcare services = medium digital
  if (sectorCode === '62') return 0.5

  // Educational services = medium digital
  if (sectorCode === '61') return 0.6

  // Hospitality/Food services = low-medium digital
  if (sectorCode === '72') return 0.3

  // Personal services = low digital
  if (sectorCode === '81') return 0.3

  // Transportation = medium digital
  if (sectorCode === '48' || sectorCode === '49') return 0.5

  // Default medium score
  return 0.5
}

// Run generator if executed directly
if (require.main === module) {
  generateAllServices().catch(console.error)
}

export { generateAllServices }
