#!/usr/bin/env node
/**
 * BL Motorcycles Supabase Connection Test
 * Tests the JavaScript client setup and verifies data access
 */

import EbayListingsAPI, { testConnection, createEnvFile } from './supabase-client-setup.js'

async function main() {
  console.log('🏍️  BL MOTORCYCLES - SUPABASE CONNECTION TEST')
  console.log('=' .repeat(50))
  
  try {
    // Test basic connection
    console.log('\n📡 Testing Supabase connection...')
    const connectionSuccess = await testConnection()
    
    if (!connectionSuccess) {
      console.log('\n❌ Connection failed. Check your credentials.')
      return
    }

    console.log('\n🔧 Advanced API Testing...')
    const api = new EbayListingsAPI()

    // Test search functionality
    console.log('\n🔍 Testing search functionality...')
    const searchResults = await api.searchListings('Rain Cover', { 
      limit: 3,
      minPrice: 15,
      maxPrice: 30
    })
    
    console.log(`Found ${searchResults.length} rain covers between £15-£30:`)
    searchResults.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.ItemNumber} - £${item.CurrentPrice}`)
    })

    // Test single item lookup
    console.log('\n📋 Testing single item lookup...')
    if (searchResults.length > 0) {
      const firstItem = await api.getListing(searchResults[0].ItemNumber)
      console.log(`✅ Retrieved: ${firstItem.Title}`)
      console.log(`   Price: £${firstItem.CurrentPrice}`)
      console.log(`   Condition: ${firstItem.Condition}`)
    }

    // Test statistics
    console.log('\n📊 Getting database statistics...')
    const stats = await api.getStatistics()
    console.log(`Total listings: ${stats.totalListings}`)
    console.log(`Average price: £${stats.averagePrice?.toFixed(2) || 'N/A'}`)
    console.log('Condition breakdown:', stats.conditionBreakdown)

    // Test pagination
    console.log('\n📄 Testing pagination...')
    const page2 = await api.getAllListings(2, 10)
    console.log(`Page 2 contains ${page2.data.length} items`)
    console.log(`Total pages: ${page2.pagination.totalPages}`)

    console.log('\n✅ ALL TESTS PASSED!')
    console.log('\n🚀 Ready for integration!')
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message)
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Check internet connection')
    console.log('2. Verify Supabase credentials')
    console.log('3. Ensure table exists with correct schema')
    
    // Show environment setup
    console.log('\n📄 Environment setup:')
    createEnvFile()
  }
}

// Run tests
main().catch(console.error)