"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import ModernDatePicker from '../components/ModernDatePicker';
import { getApplicationFeeText } from '../config/app';
interface FormData {
  name: string;
  fatherName: string;
  motherName: string;
  nid: string;
  dob: string;
  phoneNumber: string;
  village: string;
  unionName: string;
  upazila: string;
  district: string;
  familyMembers: string;
  incomeSource: string;
  monthlyIncome: string;
  landAmount: string;
  houseType: string;
  toiletType: string;
  drinkingWaterSource: string[];
  childrenCount: string;
  maleChildrenCount: string;
  femaleChildrenCount: string;
  donationItems: string;
}

const HomePage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    fatherName: '',
    motherName: '',
    nid: '',
    dob: '',
    phoneNumber: '',
    village: '',
    unionName: '',
    upazila: '',
    district: '',
    familyMembers: '',
    incomeSource: '',
    monthlyIncome: '',
    landAmount: '',
    houseType: '',
    toiletType: '',
    drinkingWaterSource: [],
    childrenCount: '0',
    maleChildrenCount: '0',
    femaleChildrenCount: '0',
    donationItems: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const validateField = (name: string, value: string | string[]) => {
    let error = '';
    if (typeof value === 'string' && value.trim() === '') {
      error = 'এই ফিল্ডটি পূরণ করা আবশ্যক।';
    } else if (Array.isArray(value) && value.length === 0) {
      error = 'অন্তত একটি বিকল্প নির্বাচন করা আবশ্যক।';
    }
    setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    validateField(name, value);
  };
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const newSources = checked
      ? [...formData.drinkingWaterSource, value]
      : formData.drinkingWaterSource.filter((source) => source !== value);

    setFormData((prevData) => ({
      ...prevData,
      drinkingWaterSource: newSources,
    }));
    validateField('drinkingWaterSource', newSources);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentStatus = urlParams.get('payment');
      
      if (paymentStatus === 'failed') {
        setPaymentMessage('পেমেন্ট ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
      } else if (paymentStatus === 'cancelled') {
        setPaymentMessage('পেমেন্ট বাতিল হয়েছে। পুনরায় চেষ্টা করুন।');
      } else if (paymentStatus === 'error') {
        setPaymentMessage('পেমেন্ট প্রক্রিয়ায় ত্রুটি হয়েছে।');
      }
      
      if (paymentStatus) {
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    (Object.keys(formData) as (keyof FormData)[]).forEach(key => {
        const value = formData[key];
        if (typeof value === 'string' && value.trim() === '') {
            newErrors[key] = 'এই ফিল্ডটি পূরণ করা আবশ্যক।';
        } else if (Array.isArray(value) && value.length === 0) {
            newErrors[key] = 'অন্তত একটি বিকল্প নির্বাচন করা আবশ্যক।';
        }
    });

    setErrors(newErrors);

    // Check if there are any validation errors and show Bengali message
    const errorCount = Object.values(newErrors).filter(err => err).length;
    if (errorCount > 0) {
        setSubmitError(`ফর্মটি জমা দেওয়ার আগে ${errorCount}টি ক্ষেত্র পূরণ করুন। লাল রঙে চিহ্নিত ক্ষেত্রগুলো সঠিকভাবে পূরণ করুন।`);
        // Scroll to first error field
        const firstErrorField = Object.keys(newErrors).find(key => newErrors[key]);
        if (firstErrorField) {
            const element = document.getElementById(firstErrorField);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.focus();
            }
        }
        return;
    }

    if (Object.values(newErrors).every(err => !err)) {
        setIsSubmitting(true);
        setSubmitError(null); // Clear previous errors
        
        try {
            const response = await fetch('/api/form/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            const result = await response.json();
            
            if (result.success) {
                window.location.href = result.bkashURL;
            } else {
                // Handle different types of errors with Bengali messages
                if (result.message?.includes('already exists') || result.message?.includes('duplicate')) {
                    setSubmitError('এই এনআইডি নম্বর দিয়ে ইতিমধ্যে আবেদন করা হয়েছে। প্রতিটি এনআইডি দিয়ে শুধুমাত্র একবার আবেদন করা যাবে।');
                } else if (result.message?.includes('validation') || result.message?.includes('required')) {
                    setSubmitError('ফর্মের তথ্যে সমস্যা রয়েছে। সব ক্ষেত্র সঠিকভাবে পূরণ করুন এবং আবার চেষ্টা করুন।');
                } else if (result.message?.includes('database') || result.message?.includes('connection')) {
                    setSubmitError('ডেটাবেস সংযোগে সমস্যা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।');
                } else if (result.message?.includes('payment') || result.message?.includes('bkash')) {
                    setSubmitError('পেমেন্ট সিস্টেমে সমস্যা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।');
                } else {
                    setSubmitError('ফর্ম জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
                }
            }
        } catch (error) {
            console.error('Form submission error:', error);
            if (error instanceof TypeError && error.message.includes('fetch')) {
                setSubmitError('ইন্টারনেট সংযোগে সমস্যা হয়েছে। আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন এবং আবার চেষ্টা করুন।');
            } else {
                setSubmitError('ফর্ম জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
            }
        } finally {
            setIsSubmitting(false);
        }
    }
  };
  const incomeSourceOptions = ['কৃষি', 'দিনমজুর', 'মৎস্য', 'গৃহিনী', 'ব্যবসা', 'বেসরকারি চাকরি', 'সরকারি চাকরি', 'অন্যান্য', 'বেকার'];
  const monthlyIncomeOptions = [
    '৫০০-১০০০ টাকা',
    '১০০০-১৫০০ টাকা',
    '১৫০০-২০০০ টাকা',
    '২০০০-২৫০০ টাকা',
    '২৫০০-৩০০০ টাকা',
    '৩০০০-৩৫০০ টাকা',
    '৩৫০০-৪০০০ টাকা',
    '৪০০০-৫০০০ টাকা',
    '৫০০০-৬৫০০ টাকা',
    '৬৫০০-৮০০০ টাকা',
    '৮০০০-১০০০০ টাকা',
    '১০০০০-১৫০০০ টাকা',
    '১৫০০০-২০০০০ টাকা',
    '২০০০০-২৫০০০ টাকা',
    '২৫০০০-৩০০০০ টাকা',
    '৩০০০০-৪০০০০ টাকা',
    '৪০০০০ টাকার উপড়ে',
  ];
  const houseTypeOptions = ['টিনের', 'ইটের', 'কাচা', 'মাটির', 'অন্যান্য'];
  const toiletTypeOptions = ['শৌচাগার নেই', 'কাচা', 'আধুনিক'];
  const waterSourceOptions = ['টিউবওয়েল (Tube well)', 'কূপ (Well)', 'নদী (River)', 'অন্যান্য (Other)'];
  const toBengaliNumber = (num: number) => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(digit => bengaliDigits[parseInt(digit)]).join('');
  };
  const childCountOptions = Array.from({ length: 16 }, (_, i) => toBengaliNumber(i));
  const donationItemsOptions = ['টয়লেট', 'টিউবওয়েল'];



  const inputStyle = (hasError: boolean, isFocused: boolean = false) => 
    `w-full px-4 py-4 mt-2 rounded-xl border-2 bg-white transition-all duration-300 ${
      hasError 
        ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200' 
        : isFocused
        ? 'border-indigo-500 bg-indigo-50 shadow-lg transform scale-[1.02]'
        : 'border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:bg-indigo-50'
    } focus:outline-none focus:ring-4 focus:ring-opacity-20 ${
      isFocused ? 'focus:ring-indigo-200' : 'focus:ring-indigo-100'
    }`;
  
  const labelStyle = 'block text-sm font-semibold text-gray-700 mb-1 transition-colors duration-200';
  const containerStyle = 'bg-gradient-to-br from-white to-gray-50 shadow-2xl rounded-3xl p-8 md:p-12 my-8 mx-auto max-w-5xl border border-gray-100 backdrop-blur-sm';
  const errorStyle = 'text-red-500 text-sm mt-2 flex items-center space-x-1';
  const fieldGroupStyle = 'space-y-6';

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased text-gray-800 flex flex-col">
      <style>
        {`
        @import url('https://rsms.me/inter/inter.css');
        html { font-family: 'Inter', sans-serif; }
        @supports (font-variation-settings: normal) {
          html { font-family: 'Inter var', sans-serif; }
        }
        `}
      </style>
      <header className="bg-gradient-to-r from-blue-800 to-indigo-800 text-white p-6 md:p-8 shadow-lg">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <a href="#" className="flex items-center space-x-4 md:space-x-6" title="Go to homepage">
            <Image 
              src="https://i.ibb.co/XrSYyycN/ngo-logo.png" 
              alt="United Forum Organisation Logo"
              width={120}
              height={120}
              className="h-20 md:h-24 object-contain transition-transform duration-300 transform hover:scale-110"
              onError={(e) => { 
                const target = e.target as HTMLImageElement;
                target.onerror = null; 
                target.src = "https://placehold.co/120x120/E0E0E0/333333?text=Logo";
              }}
            />
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">United Forum Organisation</h1>
            </div>
          </a>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        <div className={`${containerStyle}`} style={{borderTop: '8px solid #2563eb'}}>
          <div className="text-center mb-12 mt-8">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 tracking-tight py-2 leading-tight">
              নিরাপদ শৌচাগার কর্মসূচি
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              আপনার সঠিক তথ্য দিয়ে নিচের ফর্মটি পূরণ করুন। প্রতিটি তথ্য আমাদের জন্য গুরুত্বপূর্ণ।
            </p>
          </div>


          <form onSubmit={handleSubmit}>
            <div className={fieldGroupStyle}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <label htmlFor="name" className={labelStyle}>
                      নাম (Name) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={(e) => {
                        setFocusedField(null);
                        validateField(e.target.name, e.target.value);
                      }}
                      className={inputStyle(!!errors.name, focusedField === 'name')}
                      placeholder="আপনার পূর্ণ নাম লিখুন"
                    />
                    {errors.name && (
                      <div className={errorStyle}>
                        <span className="text-red-500">!</span>
                        <span>{errors.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="relative group">
                    <label htmlFor="fatherName" className={labelStyle}>
                      পিতার নাম (Father&apos;s Name) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fatherName"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('fatherName')}
                      onBlur={(e) => {
                        setFocusedField(null);
                        validateField(e.target.name, e.target.value);
                      }}
                      className={inputStyle(!!errors.fatherName, focusedField === 'fatherName')}
                      placeholder="পিতার পূর্ণ নাম লিখুন"
                    />
                    {errors.fatherName && (
                      <div className={errorStyle}>
                        <span className="text-red-500">!</span>
                        <span>{errors.fatherName}</span>
                      </div>
                    )}
                  </div>

                  <div className="relative group">
                    <label htmlFor="motherName" className={labelStyle}>
                      মাতার নাম (Mother&apos;s Name) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="motherName"
                      name="motherName"
                      value={formData.motherName}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('motherName')}
                      onBlur={(e) => {
                        setFocusedField(null);
                        validateField(e.target.name, e.target.value);
                      }}
                      className={inputStyle(!!errors.motherName, focusedField === 'motherName')}
                      placeholder="মাতার পূর্ণ নাম লিখুন"
                    />
                    {errors.motherName && (
                      <div className={errorStyle}>
                        <span className="text-red-500">!</span>
                        <span>{errors.motherName}</span>
                      </div>
                    )}
                  </div>

                  <div className="relative group">
                    <label htmlFor="nid" className={labelStyle}>
                      এনআইডি নাম্বার (NID Number) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="nid"
                      name="nid"
                      value={formData.nid}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('nid')}
                      onBlur={(e) => {
                        setFocusedField(null);
                        validateField(e.target.name, e.target.value);
                      }}
                      className={inputStyle(!!errors.nid, focusedField === 'nid')}
                      placeholder="১০ বা ১৭ সংখ্যার এনআইডি নম্বর"
                    />
                    {errors.nid && (
                      <div className={errorStyle}>
                        <span className="text-red-500">!</span>
                        <span>{errors.nid}</span>
                      </div>
                    )}
                  </div>

                  <div className="relative group">
                    <label htmlFor="dob" className={labelStyle}>
                      জন্ম তারিখ (Date of Birth) <span className="text-red-500">*</span>
                    </label>
                    <ModernDatePicker
                      id="dob"
                      name="dob"
                      value={formData.dob}
                      onChange={(date) => {
                        setFormData(prev => ({ ...prev, dob: date }));
                        validateField('dob', date);
                      }}
                      onBlur={() => validateField('dob', formData.dob)}
                      className={inputStyle(!!errors.dob, focusedField === 'dob')}
                      placeholder="জন্ম তারিখ নির্বাচন করুন"
                      hasError={!!errors.dob}
                    />
                    {errors.dob && (
                      <div className={errorStyle}>
                        <span className="text-red-500">!</span>
                        <span>{errors.dob}</span>
                      </div>
                    )}
                  </div>

                  <div className="relative group">
                    <label htmlFor="phoneNumber" className={labelStyle}>
                      ফোন নাম্বার (Phone Number) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('phoneNumber')}
                      onBlur={(e) => {
                        setFocusedField(null);
                        validateField(e.target.name, e.target.value);
                      }}
                      className={inputStyle(!!errors.phoneNumber, focusedField === 'phoneNumber')}
                      placeholder="০১৭xxxxxxxx"
                    />
                    {errors.phoneNumber && (
                      <div className={errorStyle}>
                        <span className="text-red-500">!</span>
                        <span>{errors.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                      
                      {/* Address Information Fields */}
                  <div className="relative group">
                <label htmlFor="village" className={labelStyle}>গ্রামের নাম (Village Name) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="village"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  onBlur={(e) => validateField(e.target.name, e.target.value)}
                  className={inputStyle(!!errors.village)}
                />
                {errors.village && <div className={errorStyle}>{errors.village}</div>}
              </div>

              {/* 8. ইউনিয়নের নাম (Union Name) */}
              <div className="w-full">
                <label htmlFor="unionName" className={labelStyle}>ইউনিয়নের নাম (Union Name) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="unionName"
                  name="unionName"
                  value={formData.unionName}
                  onChange={handleChange}
                  onBlur={(e) => validateField(e.target.name, e.target.value)}
                  className={inputStyle(!!errors.unionName)}
                />
                {errors.unionName && <div className={errorStyle}>{errors.unionName}</div>}
              </div>

              {/* 9. উপজেলার নাম (Upazila Name) */}
              <div className="w-full">
                <label htmlFor="upazila" className={labelStyle}>উপজেলার নাম (Upazila Name) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="upazila"
                  name="upazila"
                  value={formData.upazila}
                  onChange={handleChange}
                  onBlur={(e) => validateField(e.target.name, e.target.value)}
                  className={inputStyle(!!errors.upazila)}
                />
                {errors.upazila && <div className={errorStyle}>{errors.upazila}</div>}
              </div>

              {/* 10. জেলার নাম (District Name) */}
              <div className="w-full">
                <label htmlFor="district" className={labelStyle}>জেলার নাম (District Name) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  onBlur={(e) => validateField(e.target.name, e.target.value)}
                  className={inputStyle(!!errors.district)}
                />
                {errors.district && <div className={errorStyle}>{errors.district}</div>}
              </div>

              {/* 11. পরিবারের সদস্য সংখ্যা (Number of Family Members) */}
              <div className="w-full">
                <label htmlFor="familyMembers" className={labelStyle}>পরিবারের সদস্য সংখ্যা (Number of Family Members) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  id="familyMembers"
                  name="familyMembers"
                  value={formData.familyMembers}
                  onChange={handleChange}
                  onBlur={(e) => validateField(e.target.name, e.target.value)}
                  className={inputStyle(!!errors.familyMembers)}
                />
                {errors.familyMembers && <div className={errorStyle}>{errors.familyMembers}</div>}
              </div>

              {/* 12. আয়ের উৎস (Source of Income) */}
              <div className="w-full">
                <label htmlFor="incomeSource" className={labelStyle}>আয়ের উৎস (Source of Income) <span className="text-red-500">*</span></label>
                <select
                  id="incomeSource"
                  name="incomeSource"
                  value={formData.incomeSource}
                  onChange={handleChange}
                  onBlur={(e) => validateField(e.target.name, e.target.value)}
                  className={inputStyle(!!errors.incomeSource)}
                >
                  <option value="">নির্বাচন করুন (Select)</option>
                  {incomeSourceOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.incomeSource && <div className={errorStyle}>{errors.incomeSource}</div>}
              </div>

              {/* 13. মাসিক আয় (Monthly Income) */}
              <div className="w-full">
                <label htmlFor="monthlyIncome" className={labelStyle}>মাসিক আয় (Monthly Income) <span className="text-red-500">*</span></label>
                <select
                  id="monthlyIncome"
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={handleChange}
                  onBlur={(e) => validateField(e.target.name, e.target.value)}
                  className={inputStyle(!!errors.monthlyIncome)}
                >
                  <option value="">নির্বাচন করুন (Select)</option>
                  {monthlyIncomeOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.monthlyIncome && <div className={errorStyle}>{errors.monthlyIncome}</div>}
              </div>
              
              {/* 14. জমির পরিমান (শতাংশ) (Land Amount in Decimals) */}
              <div className="w-full">
                <label htmlFor="landAmount" className={labelStyle}>জমির পরিমান (শতাংশ) (Land Amount in Decimals) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  id="landAmount"
                  name="landAmount"
                  value={formData.landAmount}
                  onChange={handleChange}
                  onBlur={(e) => validateField(e.target.name, e.target.value)}
                  className={inputStyle(!!errors.landAmount)}
                />
                {errors.landAmount && <div className={errorStyle}>{errors.landAmount}</div>}
              </div>

              {/* 15. বাড়ীর ধরন (Type of House) */}
              <div className="w-full">
                <label htmlFor="houseType" className={labelStyle}>বাড়ীর ধরন (Type of House) <span className="text-red-500">*</span></label>
                <select
                  id="houseType"
                  name="houseType"
                  value={formData.houseType}
                  onChange={handleChange}
                  onBlur={(e) => validateField(e.target.name, e.target.value)}
                  className={inputStyle(!!errors.houseType)}
                >
                  <option value="">নির্বাচন করুন (Select)</option>
                  {houseTypeOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.houseType && <div className={errorStyle}>{errors.houseType}</div>}
              </div>

              {/* 16. শৌচাগারের ধরন (Type of Toilet) */}
              <div className="w-full">
                <label htmlFor="toiletType" className={labelStyle}>শৌচাগারের ধরন (Type of Toilet) <span className="text-red-500">*</span></label>
                <select
                  id="toiletType"
                  name="toiletType"
                  value={formData.toiletType}
                  onChange={handleChange}
                  onBlur={(e) => validateField(e.target.name, e.target.value)}
                  className={inputStyle(!!errors.toiletType)}
                >
                  <option value="">নির্বাচন করুন (Select)</option>
                  {toiletTypeOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.toiletType && <div className={errorStyle}>{errors.toiletType}</div>}
              </div>
            </div>

            {/* 17. খাবার পানি সংগ্রহের উৎস (Source of Drinking Water) - Checkbox Field */}
            <div className="mt-6 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">খাবার পানি সংগ্রহের উৎস (Source of Drinking Water) <span className="text-red-500">*</span></label>
              <div className={`mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${errors.drinkingWaterSource ? 'border border-red-500 rounded-lg p-2' : ''}`}>
                {waterSourceOptions.map((option) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="drinkingWaterSource"
                      value={option}
                      checked={formData.drinkingWaterSource.includes(option)}
                      onChange={handleCheckboxChange}
                      className="form-checkbox h-4 w-4 text-indigo-600 rounded"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              {errors.drinkingWaterSource && <div className={errorStyle}>{errors.drinkingWaterSource}</div>}
            </div>

            {/* Remaining Dropdown Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* 18. সন্তান সংখ্যা (Number of Children) */}
              <div className="w-full">
                <label htmlFor="childrenCount" className={labelStyle}>সন্তান সংখ্যা (Number of Children) <span className="text-red-500">*</span></label>
                <select
                  id="childrenCount"
                  name="childrenCount"
                  value={formData.childrenCount}
                  onChange={handleChange}
                  onBlur={(e) => validateField(e.target.name, e.target.value)}
                  className={inputStyle(!!errors.childrenCount)}
                >
                  {childCountOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.childrenCount && <div className={errorStyle}>{errors.childrenCount}</div>}
              </div>

              {/* 19. ছেলে সন্তান সংখ্যা (Number of Male Children) */}
              <div className="w-full">
                <label htmlFor="maleChildrenCount" className={labelStyle}>ছেলে সন্তান সংখ্যা (Number of Male Children) <span className="text-red-500">*</span></label>
                <select
                  id="maleChildrenCount"
                  name="maleChildrenCount"
                  value={formData.maleChildrenCount}
                  onChange={handleChange}
                  onBlur={(e) => validateField(e.target.name, e.target.value)}
                  className={inputStyle(!!errors.maleChildrenCount)}
                >
                  {childCountOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.maleChildrenCount && <div className={errorStyle}>{errors.maleChildrenCount}</div>}
              </div>
              
              {/* 20. মেয়ে সন্তান সংখ্যা (Number of Female Children) */}
              <div className="w-full">
                <label htmlFor="femaleChildrenCount" className={labelStyle}>মেয়ে সন্তান সংখ্যা (Number of Female Children) <span className="text-red-500">*</span></label>
                <select
                  id="femaleChildrenCount"
                  name="femaleChildrenCount"
                  value={formData.femaleChildrenCount}
                  onChange={handleChange}
                  onBlur={(e) => validateField(e.target.name, e.target.value)}
                  className={inputStyle(!!errors.femaleChildrenCount)}
                >
                  {childCountOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.femaleChildrenCount && <div className={errorStyle}>{errors.femaleChildrenCount}</div>}
              </div>

              {/* 21. অনুদানসামগ্রী যা লাগবে (Donation Items Needed) */}
              <div className="w-full">
                <label htmlFor="donationItems" className={labelStyle}>অনুদানসামগ্রী যা লাগবে (Donation Items Needed) <span className="text-red-500">*</span></label>
                <select
                  id="donationItems"
                  name="donationItems"
                  value={formData.donationItems}
                  onChange={handleChange}
                  onBlur={(e) => validateField(e.target.name, e.target.value)}
                  className={inputStyle(!!errors.donationItems)}
                >
                  <option value="">নির্বাচন করুন (Select)</option>
                  {donationItemsOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.donationItems && <div className={errorStyle}>{errors.donationItems}</div>}
              </div>
                  
            </div>

            {/* 22. আবেদন ফি জমা দিন (Submit Button) */}
            <div className="mt-12 w-full flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-12 py-4 font-semibold rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-300 ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 transform hover:scale-105'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    প্রক্রিয়াকরণ...
                  </div>
                ) : (
                  `আবেদন ফি জমা দিন (${getApplicationFeeText()})`
                )}
              </button>
            </div>
          </div>
          </form>

          {success && (
            <div className="mt-6 p-4 text-center text-lg font-semibold text-green-700 bg-green-100 rounded-lg">
              ফর্মটি সফলভাবে জমা হয়েছে! (Form submitted successfully!)
            </div>
          )}

          {paymentMessage && (
            <div className="mt-6 p-4 text-center text-lg font-semibold text-red-700 bg-red-100 rounded-lg">
              {paymentMessage}
              <button 
                onClick={() => setPaymentMessage(null)}
                className="ml-4 text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          )}

          {submitError && (
            <div className="mt-6 p-4 text-center text-lg font-semibold text-red-700 bg-red-100 rounded-lg border-l-4 border-red-500">
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{submitError}</span>
                <button 
                  onClick={() => setSubmitError(null)}
                  className="ml-4 text-red-500 hover:text-red-700 font-bold"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-12 border-t border-gray-700">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Organization Section */}
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              <a href="#" title="Go to homepage" className="transition-transform duration-300 hover:scale-105">
                <Image
                  src="https://i.ibb.co/XrSYyycN/ngo-logo.png"
                  alt="United Forum Organisation Logo"
                  width={80}
                  height={80}
                  className="h-16 w-16 object-contain"
                  onError={(e) => { 
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; 
                    target.src = "https://placehold.co/80x80/E0E0E0/333333?text=Logo";
                  }}
                />
              </a>
              <div className="text-center md:text-left">
                <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                  United Forum Organisation
                </h3>
              </div>
            </div>
            
            {/* Main Office Section */}
            <div className="text-center">
              <h4 className="font-semibold text-lg mb-4 text-white border-b border-gray-600 pb-2 inline-block">
                Main Office
              </h4>
              <div className="space-y-2">
                <p className="text-sm text-gray-300 leading-relaxed">
                  Amborkhana, Sylhet Sadar
                </p>
                <p className="text-sm text-gray-300">
                  Sylhet, Bangladesh
                </p>
              </div>
            </div>
            
            {/* Contact Section */}
            <div className="text-center md:text-left">
              <h4 className="font-semibold text-lg mb-4 text-white border-b border-gray-600 pb-2 inline-block">
                Contact
              </h4>
              <div className="space-y-2">
                <a 
                  href="mailto:ufo.org.bd@gmail.com" 
                  className="text-sm text-gray-300 hover:text-blue-400 transition-colors duration-300 inline-flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  <span>ufo.org.bd@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
          
          {/* Copyright Section */}
          <div className="border-t border-gray-700 mt-10 pt-6">
            <div className="text-center">
              <p className="text-xs text-gray-400 leading-relaxed">
                &copy; {new Date().getFullYear()} United Forum Organisation. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;