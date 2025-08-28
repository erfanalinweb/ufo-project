import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentID = searchParams.get('paymentID');
    const status = searchParams.get('status');
    
    
    if (status === 'success' && paymentID) {
      const executeResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/bkash/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentID: paymentID
        })
      });
      
      const executeData = await executeResponse.json();
      
      
      if (executeData.success) {
        return redirect('/success');
      } else {
        
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
    
    return redirect('/?payment=error');
  }
}

export async function POST() {
  // Handle POST callback if needed
  return NextResponse.json({ success: true });
}