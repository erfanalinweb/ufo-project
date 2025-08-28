"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';

interface Application {
  id: number;
  name: string;
  father_name: string;
  mother_name: string;
  nid: string;
  dob: string;
  phone_number: string;
  village: string;
  union_name: string;
  upazila: string;
  district: string;
  family_members: number;
  income_source: string;
  monthly_income: string;
  land_amount: string;
  house_type: string;
  toilet_type: string;
  drinking_water_source: string;
  children_count: string;
  male_children_count: string;
  female_children_count: string;
  donation_items: string;
  payment_status: string;
  bkash_trxid?: string;
  bkash_number?: string;
  amount: number;
  form_created_at: string;
  payment_created_at?: string;
}

const AdminPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const checkAuthentication = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    setIsAuthenticated(true);
    fetchApplications();
  };

  useEffect(() => {
    checkAuthentication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/applications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
        return;
      }
      
      const data = await response.json();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedApplication(null);
  };

  const exportToExcel = (application: Application) => {
    const data = [
      ['Field', 'Value'],
      ['আবেদনকারীর নাম', application.name],
      ['পিতার নাম', application.father_name],
      ['মাতার নাম', application.mother_name],
      ['জাতীয় পরিচয়পত্র', application.nid],
      ['জন্ম তারিখ', application.dob],
      ['ফোন নম্বর', application.phone_number],
      ['গ্রাম', application.village],
      ['ইউনিয়ন', application.union_name],
      ['উপজেলা', application.upazila],
      ['জেলা', application.district],
      ['পরিবারের সদস্য সংখ্যা', application.family_members.toString()],
      ['আয়ের উৎস', application.income_source],
      ['মাসিক আয়', application.monthly_income],
      ['জমির পরিমাণ', application.land_amount],
      ['বাড়ির ধরন', application.house_type],
      ['টয়লেটের ধরন', application.toilet_type],
      ['পানীয় জলের উৎস', Array.isArray(application.drinking_water_source) ? application.drinking_water_source.join(', ') : application.drinking_water_source],
      ['সন্তানের সংখ্যা', application.children_count],
      ['পুত্র সন্তানের সংখ্যা', application.male_children_count],
      ['কন্যা সন্তানের সংখ্যা', application.female_children_count],
      ['অনুদানের বিবরণ', application.donation_items],
      ['আবেদনের তারিখ', new Date(application.form_created_at).toLocaleDateString('bn-BD')]
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Application Details');
    
    // Auto-size columns
    const colWidths = data.map(row => Math.max(...row.map(cell => cell.toString().length)));
    ws['!cols'] = colWidths.map(width => ({ width: width + 2 }));
    
    XLSX.writeFile(wb, `application_${application.name}_${application.id}.xlsx`);
  };

  const exportAllToExcel = () => {
    const data = [
      ['ID', 'নাম', 'পিতার নাম', 'মাতার নাম', 'NID', 'জন্ম তারিখ', 'ফোন', 'গ্রাম', 'ইউনিয়ন', 'উপজেলা', 'জেলা', 'পরিবারের সদস্য', 'আয়ের উৎস', 'মাসিক আয়', 'জমির পরিমাণ', 'বাড়ির ধরন', 'টয়লেটের ধরন', 'পানীয় জলের উৎস', 'সন্তানের সংখ্যা', 'পুত্র সন্তান', 'কন্যা সন্তান', 'অনুদান', 'আবেদনের তারিখ']
    ];
    
    filteredApplications.forEach(app => {
      data.push([
        app.id.toString(),
        app.name,
        app.father_name,
        app.mother_name,
        app.nid,
        app.dob,
        app.phone_number,
        app.village,
        app.union_name,
        app.upazila,
        app.district,
        app.family_members.toString(),
        app.income_source,
        app.monthly_income,
        app.land_amount,
        app.house_type,
        app.toilet_type,
        Array.isArray(app.drinking_water_source) ? app.drinking_water_source.join(', ') : app.drinking_water_source,
        app.children_count,
        app.male_children_count,
        app.female_children_count,
        app.donation_items,
        new Date(app.form_created_at).toLocaleDateString('bn-BD')
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'All Applications');
    
    XLSX.writeFile(wb, `all_applications_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.payment_status === filter;
  });

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'সম্পন্ন';
      case 'pending': return 'অপেক্ষমান';
      case 'failed': return 'ব্যর্থ';
      default: return status;
    }
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">অ্যাডমিন ড্যাশবোর্ড</h1>
            <div className="flex space-x-4">
              <Link 
                href="/"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                হোম পেজ
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                লগআউট
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">মোট আবেদন</h3>
            <p className="text-3xl font-bold text-indigo-600">{applications.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">সম্পন্ন</h3>
            <p className="text-3xl font-bold text-green-600">
              {applications.filter(app => app.payment_status === 'completed').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">অপেক্ষমান</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {applications.filter(app => app.payment_status === 'pending').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">ব্যর্থ</h3>
            <p className="text-3xl font-bold text-red-600">
              {applications.filter(app => app.payment_status === 'failed').length}
            </p>
          </div>
        </div>

        {/* Filter Buttons and Export */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              {(['all', 'pending', 'completed', 'failed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === status
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {status === 'all' ? 'সব' : getStatusText(status)}
                </button>
              ))}
            </div>
            <button
              onClick={exportAllToExcel}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>সব এক্সপোর্ট করুন</span>
            </button>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    আবেদনকারী
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    যোগাযোগ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ঠিকানা
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    অনুদান
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    পেমেন্ট
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    স্ট্যাটাস
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    তারিখ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    বিস্তারিত
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{app.name}</div>
                        <div className="text-sm text-gray-500">NID: {app.nid}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{app.phone_number}</div>
                      {app.bkash_number && (
                        <div className="text-sm text-gray-500">bKash: {app.bkash_number}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{app.village}</div>
                      <div className="text-sm text-gray-500">{app.district}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {app.donation_items}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">৳{app.amount}</div>
                      {app.bkash_trxid && (
                        <div className="text-sm text-gray-500">TrxID: {app.bkash_trxid}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(app.payment_status)}>
                        {getStatusText(app.payment_status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{new Date(app.form_created_at).toLocaleDateString('bn-BD')}</div>
                      {app.payment_created_at && (
                        <div className="text-xs">
                          পেমেন্ট: {new Date(app.payment_created_at).toLocaleDateString('bn-BD')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(app)}
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 hover:bg-indigo-200 px-3 py-1 rounded-md transition-colors"
                      >
                        দেখুন
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">কোন আবেদন পাওয়া যায়নি।</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal for viewing details */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  আবেদনের বিস্তারিত তথ্য
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => exportToExcel(selectedApplication)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors text-sm flex items-center space-x-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>এক্সপোর্ট</span>
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="sr-only">Close</span>
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">আবেদনকারীর নাম</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedApplication.name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">পিতার নাম</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedApplication.father_name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">মাতার নাম</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedApplication.mother_name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">জাতীয় পরিচয়পত্র</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedApplication.nid}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">জন্ম তারিখ</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedApplication.dob}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ফোন নম্বর</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedApplication.phone_number}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">গ্রাম</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedApplication.village}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ইউনিয়ন</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedApplication.union_name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">উপজেলা</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedApplication.upazila}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">জেলা</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedApplication.district}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">পরিবারের সদস্য সংখ্যা</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedApplication.family_members}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">আয়ের উৎস</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedApplication.income_source}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">মাসিক আয়</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedApplication.monthly_income}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">জমির পরিমাণ</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedApplication.land_amount}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">বাড়ির ধরন</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedApplication.house_type}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">টয়লেটের ধরন</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedApplication.toilet_type}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">পানীয় জলের উৎস</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {Array.isArray(selectedApplication.drinking_water_source) 
                        ? selectedApplication.drinking_water_source.join(', ') 
                        : selectedApplication.drinking_water_source}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">সন্তানের সংখ্যা</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedApplication.children_count}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">পুত্র সন্তানের সংখ্যা</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedApplication.male_children_count}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">কন্যা সন্তানের সংখ্যা</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedApplication.female_children_count}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">অনুদানের বিবরণ</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedApplication.donation_items}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">আবেদনের তারিখ</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {new Date(selectedApplication.form_created_at).toLocaleDateString('bn-BD')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={handleCloseModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;