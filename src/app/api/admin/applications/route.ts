import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';
import { getApplicationFee } from '@/config/app';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!isAuthenticated(authHeader)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    const applications = await prisma.formData.findMany({
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    const transformedApplications = applications.map(app => {
      const latestTransaction = app.transactions[0];
      
      return {
        id: app.id,
        name: app.name,
        father_name: app.fatherName,
        mother_name: app.motherName,
        nid: app.nid,
        dob: app.dob,
        phone_number: app.phoneNumber,
        village: app.village,
        union_name: app.unionName,
        upazila: app.upazila,
        district: app.district,
        family_members: app.familyMembers,
        income_source: app.incomeSource,
        monthly_income: app.monthlyIncome,
        land_amount: app.landAmount,
        house_type: app.houseType,
        toilet_type: app.toiletType,
        drinking_water_source: app.drinkingWaterSource,
        children_count: app.childrenCount,
        male_children_count: app.maleChildrenCount,
        female_children_count: app.femaleChildrenCount,
        donation_items: app.donationItems,
        payment_status: latestTransaction?.status.toLowerCase() || 'pending',
        bkash_trxid: latestTransaction?.bkashTrxId || null,
        bkash_number: latestTransaction?.bkashNumber || null,
        amount: latestTransaction?.amount || getApplicationFee(),
        form_created_at: app.createdAt.toISOString(),
        payment_created_at: latestTransaction?.completedAt?.toISOString() || null
      };
    });
    
    return NextResponse.json({
      success: true,
      applications: transformedApplications
    });
    
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}