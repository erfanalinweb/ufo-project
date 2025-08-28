import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getApplicationFee } from '@/config/app';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const requiredFields = [
      'name', 'fatherName', 'motherName', 'nid', 'dob', 'phoneNumber',
      'village', 'unionName', 'upazila', 'district', 'familyMembers',
      'incomeSource', 'monthlyIncome', 'landAmount', 'houseType',
      'toiletType', 'drinkingWaterSource', 'childrenCount',
      'maleChildrenCount', 'femaleChildrenCount', 'donationItems'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }
    const result = await prisma.$transaction(async (tx) => {
      const newFormData = await tx.formData.create({
        data: {
          name: formData.name,
          fatherName: formData.fatherName,
          motherName: formData.motherName,
          nid: formData.nid,
          dob: formData.dob,
          phoneNumber: formData.phoneNumber,
          village: formData.village,
          unionName: formData.unionName,
          upazila: formData.upazila,
          district: formData.district,
          familyMembers: parseInt(formData.familyMembers),
          incomeSource: formData.incomeSource,
          monthlyIncome: formData.monthlyIncome,
          landAmount: formData.landAmount,
          houseType: formData.houseType,
          toiletType: formData.toiletType,
          drinkingWaterSource: formData.drinkingWaterSource,
          childrenCount: formData.childrenCount,
          maleChildrenCount: formData.maleChildrenCount,
          femaleChildrenCount: formData.femaleChildrenCount,
          donationItems: formData.donationItems
        }
      });
      
      const transaction = await tx.transaction.create({
        data: {
          formId: newFormData.id,
          amount: getApplicationFee(),
          currency: 'BDT',
          status: 'PENDING'
        }
      });
      
      return { formData: newFormData, transaction };
    });
    const paymentResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/bkash/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transactionId: result.transaction.id,
        amount: Number(getApplicationFee())
      })
    });
    
    const paymentData = await paymentResponse.json();
    
    if (!paymentData.success) {
      await prisma.transaction.update({
        where: { id: result.transaction.id },
        data: { status: 'FAILED', statusMessage: paymentData.message }
      });
      
      throw new Error(paymentData.message || 'Failed to initiate payment');
    }
    
    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully, redirecting to payment',
      formId: result.formData.id,
      transactionId: result.transaction.id,
      paymentID: paymentData.paymentID,
      bkashURL: paymentData.bkashURL
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Form submission failed' },
      { status: 500 }
    );
  }
}