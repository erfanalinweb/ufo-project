import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const BKASH_CONFIG = {
  app_key: process.env.BKASH_APP_KEY || '',
  app_secret: process.env.BKASH_APP_SECRET || '',
  username: process.env.BKASH_USERNAME || '',
  password: process.env.BKASH_PASSWORD || '',
  base_url: process.env.BKASH_BASE_URL || 'https://tokenized.sandbox.bka.sh/v1.2.0-beta'
};

// Get bKash token
async function getBkashToken() {
  const response = await fetch(`${BKASH_CONFIG.base_url}/tokenized/checkout/token/grant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'username': BKASH_CONFIG.username,
      'password': BKASH_CONFIG.password
    },
    body: JSON.stringify({
      app_key: BKASH_CONFIG.app_key,
      app_secret: BKASH_CONFIG.app_secret
    })
  });

  const data = await response.json();
  
  if (data.statusCode === '0000') {
    return data.id_token;
  } else {
    throw new Error(data.statusMessage || 'Failed to get bKash token');
  }
}

export async function POST(request: NextRequest) {
  try {
    const { paymentID } = await request.json();
    
    if (!paymentID) {
      return NextResponse.json(
        { success: false, message: 'Payment ID is required' },
        { status: 400 }
      );
    }
    
    // Get bKash token
    const token = await getBkashToken();
    
    // Execute bKash payment
    const response = await fetch(`${BKASH_CONFIG.base_url}/tokenized/checkout/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'authorization': token,
        'x-app-key': BKASH_CONFIG.app_key
      },
      body: JSON.stringify({
        paymentID
      })
    });

    const data = await response.json();
    
    if (data.statusCode === '0000') {
      // Find transaction by bKash payment ID
      const transaction = await prisma.transaction.findFirst({
        where: { bkashPaymentId: paymentID }
      });
      
      if (!transaction) {
        throw new Error('Transaction not found');
      }
      
      // Update transaction with payment details
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          bkashTrxId: data.trxID,
          bkashNumber: data.customerMsisdn,
          status: 'COMPLETED',
          statusMessage: data.statusMessage,
          completedAt: new Date()
        }
      });
      
      return NextResponse.json({
        success: true,
        trxID: data.trxID,
        customerMsisdn: data.customerMsisdn,
        amount: data.amount,
        transactionStatus: data.transactionStatus
      });
    } else {
      // Update transaction as failed
      const transaction = await prisma.transaction.findFirst({
        where: { bkashPaymentId: paymentID }
      });
      
      if (transaction) {
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            status: 'FAILED',
            statusMessage: data.statusMessage || 'Payment execution failed'
          }
        });
      }
      
      throw new Error(data.statusMessage || 'Payment execution failed');
    }
  } catch (error) {
    console.error('Error executing bKash payment:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Payment execution failed' },
      { status: 500 }
    );
  }
}