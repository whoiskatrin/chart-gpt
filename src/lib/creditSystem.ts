import { supabase } from './supabase'

export interface CreditTransaction {
  id: string
  user_id: string
  type: 'purchase' | 'usage' | 'refund'
  amount: number
  description: string
  stripe_payment_id?: string
  created_at: string
}

export class CreditSystemService {
  static async getUserCredits(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user credits:', error)
      return 0
    }

    return data.credits || 0
  }

  static async updateUserCredits(userId: string, newCredits: number): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .update({ credits: newCredits, updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (error) {
      console.error('Error updating user credits:', error)
      return false
    }

    return true
  }

  static async addCredits(
    userId: string, 
    amount: number, 
    description: string,
    stripePaymentId?: string
  ): Promise<{ success: boolean; newBalance?: number; error?: string }> {
    try {
      // Start transaction
      const currentCredits = await this.getUserCredits(userId)
      const newCredits = currentCredits + amount

      // Update user credits
      const updateSuccess = await this.updateUserCredits(userId, newCredits)
      if (!updateSuccess) {
        return { success: false, error: 'Failed to update credits' }
      }

      // Record transaction
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert([
          {
            user_id: userId,
            type: 'purchase',
            amount,
            description,
            stripe_payment_id: stripePaymentId,
          }
        ])

      if (transactionError) {
        console.error('Error recording transaction:', transactionError)
        // Don't fail the whole operation for transaction recording issues
      }

      return { success: true, newBalance: newCredits }
    } catch (error) {
      console.error('Error adding credits:', error)
      return { success: false, error: 'Failed to add credits' }
    }
  }

  static async deductCredits(
    userId: string, 
    amount: number, 
    description: string
  ): Promise<{ success: boolean; newBalance?: number; error?: string }> {
    try {
      const currentCredits = await this.getUserCredits(userId)
      
      if (currentCredits < amount) {
        return { success: false, error: 'Insufficient credits' }
      }

      const newCredits = currentCredits - amount

      // Update user credits
      const updateSuccess = await this.updateUserCredits(userId, newCredits)
      if (!updateSuccess) {
        return { success: false, error: 'Failed to deduct credits' }
      }

      // Record transaction
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert([
          {
            user_id: userId,
            type: 'usage',
            amount: -amount, // Negative for usage
            description,
          }
        ])

      if (transactionError) {
        console.error('Error recording transaction:', transactionError)
      }

      return { success: true, newBalance: newCredits }
    } catch (error) {
      console.error('Error deducting credits:', error)
      return { success: false, error: 'Failed to deduct credits' }
    }
  }

  static async getCreditHistory(
    userId: string,
    limit: number = 50
  ): Promise<CreditTransaction[]> {
    const { data, error } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching credit history:', error)
      return []
    }

    return data || []
  }

  static async getTotalSpent(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('credit_transactions')
      .select('amount')
      .eq('user_id', userId)
      .eq('type', 'usage')

    if (error) {
      console.error('Error fetching total spent:', error)
      return 0
    }

    return data.reduce((total, transaction) => total + Math.abs(transaction.amount), 0)
  }

  static async getTotalPurchased(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('credit_transactions')
      .select('amount')
      .eq('user_id', userId)
      .eq('type', 'purchase')

    if (error) {
      console.error('Error fetching total purchased:', error)
      return 0
    }

    return data.reduce((total, transaction) => total + transaction.amount, 0)
  }

  static async validateCreditDeduction(
    userId: string,
    amount: number
  ): Promise<{ canDeduct: boolean; currentCredits: number }> {
    const currentCredits = await this.getUserCredits(userId)
    return {
      canDeduct: currentCredits >= amount,
      currentCredits
    }
  }

  // Pricing packages
  static getCreditPackages() {
    return [
      {
        id: 'starter',
        name: 'Starter',
        credits: 50,
        price: 9.99,
        pricePerCredit: 0.20,
        stripePriceId: process.env.STRIPE_STARTER_PRICE_ID || 'price_starter',
        popular: false
      },
      {
        id: 'pro',
        name: 'Pro',
        credits: 150,
        price: 24.99,
        pricePerCredit: 0.17,
        stripePriceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro',
        popular: true,
        savings: 'Save 15%'
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        credits: 500,
        price: 79.99,
        pricePerCredit: 0.16,
        stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise',
        popular: false,
        savings: 'Save 20%'
      }
    ]
  }

  static getPackageById(packageId: string) {
    return this.getCreditPackages().find(pkg => pkg.id === packageId)
  }
}