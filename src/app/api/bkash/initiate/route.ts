import { NextRequest, NextResponse } from 'next/server';
import { getApplicationFee } from '@/config/app';

const BKASH_CONFIG = {
  app_key: process.env.BKASH_APP_KEY || '',
  app_secret: process.env.BKASH_APP_SECRET || '',
  username: process.env.BKASH_USERNAME || '',
  password: process.env.BKASH_PASSWORD || '',
  base_url: process.env.BKASH_BASE_URL || 'https://tokenized.sandbox.bka.sh/v1.2.0-beta'
};
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
async function createBkashPayment(token: string, amount: number, transactionId: number) {
  const paymentPayload = {
    mode: '0011',
    payerReference: transactionId.toString(),
    callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '')}/api/bkash/callback`,
    amount: amount.toFixed(2),
    currency: 'BDT',
    intent: 'sale',
    merchantInvoiceNumber: `UFO-${transactionId}-${Date.now()}`
  };
  
  
  const response = await fetch(`${BKASH_CONFIG.base_url}/tokenized/checkout/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'authorization': token,
      'x-app-key': BKASH_CONFIG.app_key
    },
    body: JSON.stringify(paymentPayload)
  });

  const data = await response.json();
  
  if (data.statusCode === '0000') {
    return {
      paymentID: data.paymentID,
      bkashURL: data.bkashURL,
      merchantInvoiceNumber: `UFO-${transactionId}-${Date.now()}`
    };
  } else {
    throw new Error(data.statusMessage || 'Failed to create bKash payment');
  }
}

export async function POST(request: NextRequest) {
  try {
    const { transactionId, amount = getApplicationFee() } = await request.json();
    
    if (!transactionId) {
      return NextResponse.json(
        { success: false, message: 'Transaction ID is required' },
        { status: 400 }
      );
    }
    
    const token = await getBkashToken();
    
    const paymentData = await createBkashPayment(token, amount, transactionId);
    const { prisma } = await import('@/lib/prisma');
    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        bkashPaymentId: paymentData.paymentID,
        merchantInvoiceNumber: paymentData.merchantInvoiceNumber,
        status: 'PROCESSING'
      }
    });
    
    return NextResponse.json({
      success: true,
      paymentID: paymentData.paymentID,
      bkashURL: paymentData.bkashURL
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}