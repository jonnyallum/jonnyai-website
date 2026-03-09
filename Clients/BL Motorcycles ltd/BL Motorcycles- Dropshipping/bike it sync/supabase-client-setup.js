// BL Motorcycles Supabase Client Setup
// Complete integration for eBay listings management

import { createClient } from '@supabase/supabase-js'

// BL Motorcycles Supabase Configuration
const supabaseUrl = 'https://kenaardqwnpeqtwukdnb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlbmFhcmRxd25wZXF0d3VrZG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMzkwMzcsImV4cCI6MjA2MjcxNTAzN30.eOfY8zr3E5hljBDyUuP5d1VIyvuusf9SHSAU5P88UyU'

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// eBay Listings API Functions
export class EbayListingsAPI {
  constructor() {
    this.supabase = supabase
    this.tableName = 'ebay_listings'
  }

  // Get all listings with pagination
  async getAllListings(page = 1, limit = 50) {
    try {
      const from = (page - 1) * limit
      const to = from + limit - 1

      const { data, error, count } = await this.supabase
        .from(this.tableName)
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        data,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      }
    } catch (error) {
      console.error('Error fetching listings:', error)
      throw error
    }
  }

  // Search listings by title or custom label
  async searchListings(query, filters = {}) {
    try {
      let queryBuilder = this.supabase
        .from(this.tableName)
        .select('*')

      // Text search
      if (query) {
        queryBuilder = queryBuilder.or(`Title.ilike.%${query}%,CustomLabel.ilike.%${query}%`)
      }

      // Price range filter
      if (filters.minPrice) {
        queryBuilder = queryBuilder.gte('CurrentPrice', filters.minPrice)
      }
      if (filters.maxPrice) {
        queryBuilder = queryBuilder.lte('CurrentPrice', filters.maxPrice)
      }

      // Condition filter
      if (filters.condition) {
        queryBuilder = queryBuilder.eq('Condition', filters.condition)
      }

      // Currency filter
      if (filters.currency) {
        queryBuilder = queryBuilder.eq('Currency', filters.currency)
      }

      const { data, error } = await queryBuilder
        .order('CurrentPrice', { ascending: filters.sortByPrice === 'asc' })
        .limit(filters.limit || 100)

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error searching listings:', error)
      throw error
    }
  }

  // Get single listing by ItemNumber
  async getListing(itemNumber) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('ItemNumber', itemNumber)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching listing:', error)
      throw error
    }
  }

  // Update listing
  async updateListing(itemNumber, updates) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .update(updates)
        .eq('ItemNumber', itemNumber)
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error updating listing:', error)
      throw error
    }
  }

  // Add new listing
  async addListing(listing) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .insert([listing])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error adding listing:', error)
      throw error
    }
  }

  // Delete listing
  async deleteListing(itemNumber) {
    try {
      const { error } = await this.supabase
        .from(this.tableName)
        .delete()
        .eq('ItemNumber', itemNumber)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting listing:', error)
      throw error
    }
  }

  // Get statistics
  async getStatistics() {
    try {
      const { data: totalCount } = await this.supabase
        .from(this.tableName)
        .select('*', { count: 'exact', head: true })

      const { data: avgPrice } = await this.supabase
        .rpc('get_average_price')

      const { data: conditions } = await this.supabase
        .from(this.tableName)
        .select('Condition')
        .not('Condition', 'is', null)

      const conditionCounts = conditions.reduce((acc, item) => {
        acc[item.Condition] = (acc[item.Condition] || 0) + 1
        return acc
      }, {})

      return {
        totalListings: totalCount.count,
        averagePrice: avgPrice || 0,
        conditionBreakdown: conditionCounts
      }
    } catch (error) {
      console.error('Error fetching statistics:', error)
      throw error
    }
  }

  // Bulk update prices (e.g., apply discount)
  async bulkUpdatePrices(multiplier = 1.0, filter = {}) {
    try {
      let queryBuilder = this.supabase
        .from(this.tableName)
        .update({ 
          CurrentPrice: this.supabase.raw(`"CurrentPrice" * ${multiplier}`)
        })

      if (filter.condition) {
        queryBuilder = queryBuilder.eq('Condition', filter.condition)
      }

      if (filter.minPrice) {
        queryBuilder = queryBuilder.gte('CurrentPrice', filter.minPrice)
      }

      if (filter.maxPrice) {
        queryBuilder = queryBuilder.lte('CurrentPrice', filter.maxPrice)
      }

      const { data, error } = await queryBuilder.select()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error bulk updating prices:', error)
      throw error
    }
  }
}

// Example usage and testing
export async function testConnection() {
  console.log('Testing BL Motorcycles Supabase connection...')
  
  try {
    const api = new EbayListingsAPI()
    
    // Test basic connection
    const { data, pagination } = await api.getAllListings(1, 5)
    console.log('✅ Connection successful!')
    console.log(`📊 Found ${pagination.total} total listings`)
    console.log('📝 Sample listings:')
    
    data.forEach((listing, index) => {
      console.log(`  ${index + 1}. ${listing.ItemNumber} - ${listing.Title.substring(0, 50)}... - £${listing.CurrentPrice}`)
    })

    // Test search
    const searchResults = await api.searchListings('Bike It', { limit: 3 })
    console.log(`🔍 Search for "Bike It" found ${searchResults.length} results`)

    // Test statistics
    const stats = await api.getStatistics()
    console.log('📈 Statistics:', stats)

    return true
  } catch (error) {
    console.error('❌ Connection failed:', error)
    return false
  }
}

// Environment setup helper
export function createEnvFile() {
  const envContent = `# BL Motorcycles Supabase Configuration
SUPABASE_URL=https://kenaardqwnpeqtwukdnb.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlbmFhcmRxd25wZXF0d3VrZG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMzkwMzcsImV4cCI6MjA2MjcxNTAzN30.eOfY8zr3E5hljBDyUuP5d1VIyvuusf9SHSAU5P88UyU
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlbmFhcmRxd25wZXF0d3VrZG5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzEzOTAzNywiZXhwIjoyMDYyNzE1MDM3fQ.oZvqA-Z1Gvrajgamp-QDSl74MyLpYsN2QPER--7Pekw

# Project Configuration
PROJECT_ID=kenaardqwnpeqtwukdnb
PROJECT_NAME=BL Motorcycles
REGION=eu-west-2
`

  console.log('📄 Create .env file with this content:')
  console.log(envContent)
  return envContent
}

// Export the configured client for direct use
export { supabase }
export default EbayListingsAPI