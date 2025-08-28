import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentID = searchParams.get('paymentID');
    const status = searchParams.get('status');
    
    // Debug: Log callback parameters
    console.log('bKash Callback received:', {
      paymentID,
      status,
      fullURL: request.url,
      allParams: Object.fromEntries(searchParams.entries())
    });
    
    if (status === 'success' && paymentID) {
      // Execute payment
      const executeResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/bkash/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentID: paymentID
        })
      });
      
      const executeData = await executeResponse.json();
      
      // Debug: Log execute response
      console.log('Execute API Response:', executeData);
      
      if (executeData.success) {
        console.log('Payment execution successful, redirecting to success');
        return redirect('/success');
      } else {
        // Log the error but still redirect to success if payment was processed
        console.error('Execute API failed but payment may have been processed:', executeData);
        
        // Check if transaction exists and is completed
        const { prisma } = await import('@/lib/prisma');
        const transaction = await prisma.transaction.findFirst({
          where: { bkashPaymentId: paymentID }
        });
        
        if (transaction && transaction.status === 'COMPLETED') {
          return redirect('/success');
        } else {
          return redirect('/?payment=failed');
        }
      }
    } else {
      // Payment failed or cancelled
      const { prisma } = await import('@/lib/prisma');
      
      if (paymentID) {
        // Update transaction status
        await prisma.transaction.updateMany({
          where: { bkashPaymentId: paymentID },
          data: { 
            status: status === 'cancel' ? 'CANCELLED' : 'FAILED',
            statusMessage: status === 'cancel' ? 'Payment cancelled by user' : 'Payment failed'
          }
        });
      }
      
      return redirect(`/?payment=${status === 'cancel' ? 'cancelled' : 'failed'}`);
    }
  } catch (error) {
    // Check if this is a Next.js redirect (which is expected)
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error; // Re-throw redirect errors
    }
    
    console.error('Error in bKash callback:', error);
    return redirect('/?payment=error');
  }
}

export async function POST() {
  // Handle POST callback if needed
  return NextResponse.json({ success: true });
}