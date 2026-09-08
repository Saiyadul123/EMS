import {
  AboutEidgahData,
  CommitteeMember,
  NoticeItem,
  EidPrayerInfo,
  DevelopmentProject,
  CommunityEvent,
  MeetingItem,
  DocumentItem,
  WalletAccount,
  IncomeRecord,
  ExpenseRecord,
  DonationRecord,
  GalleryItem,
  SystemSettings,
  PublicFinancialReport
} from '../types';

export const INITIAL_SETTINGS: SystemSettings = {
  eidgahNameBn: 'ঐতিহাসিক কেন্দ্রীয় শাহী ঈদগাহ ময়দান',
  eidgahNameEn: 'Historic Central Shahi Eidgah',
  taglineBn: 'ঐক্য, ভ্রাতৃত্ব ও তাকওয়ার মিলনমেলা — প্রতিষ্ঠা: ১৯৫২ খ্রি.',
  addressBn: 'ঈদগাহ রোড, কেন্দ্রীয় জামে মসজিদ সংলগ্ন, ঢাকা',
  contactPhone: '+880 1711-002233',
  contactEmail: 'info@central-eidgah.org.bd',
  bkashMerchantNumber: '01811-998877 (মার্চেন্ট)',
  nagadMerchantNumber: '01911-887766 (মার্চেন্ট)',
  rocketMerchantNumber: '01711-002233-8',
  bankAccountDetails: 'হিসাব নাম: Central Shahi Eidgah Complex, হিসাব নং: 2050123456789, ইসলামী ব্যাংক বাংলাদেশ পিএলসি, প্রিন্সিপাল শাখা।',
  waqfNumber: 'WQF-DHK-48201 / বাংলাদেশ ওয়াকফ প্রশাসন',
  facebookPage: 'https://facebook.com/CentralEidgahBD',
  youtubeChannel: 'https://youtube.com/@CentralEidgahLive',
};

export const INITIAL_ABOUT: AboutEidgahData = {
  title: 'ঐতিহাসিক কেন্দ্রীয় শাহী ঈদগাহ ময়দানের গৌরবময় ইতিহাস',
  subtitle: 'সাত দশকের ঐতিহ্যবাহী ঈদুল ফিতর ও ঈদুল আজহার প্রধান মিলনকেন্দ্র',
  history: '১৯৫২ সালের মহান ভাষা আন্দোলনের স্মৃতিবিজড়িত বর্ষে ধর্মপ্রাণ মুসলিম জনতার উদ্যোগে প্রতিষ্ঠিত হয় এই কেন্দ্রীয় শাহী ঈদগাহ ময়দান। তৎকালীন গণ্যমান্য ব্যক্তিবর্গের দান করা ১৪.৫ বিঘা ওয়াকফ সম্পত্তির ওপর এই বিশাল ময়দানটি গড়ে ওঠে। প্রতি বছর ঈদুল ফিতর ও ঈদুল আজহায় এই প্রাঙ্গণে লক্ষাধিক ধর্মপ্রাণ মুসল্লি একত্রিত হয়ে মহান রাব্বুল আলামিনের সন্তুষ্টি কামনায় দুই রাকাত ওয়াজিব নামাজ আদায় করেন। এটি শুধু একটি নামাজের মাঠ নয়, এটি পুরো অঞ্চলের ভ্রাতৃত্ব, ঐক্য ও সাম্যের এক পবিত্র মিলনমেলা।',
  waqfRegistrationNo: 'WQF-DHK-48201',
  totalArea: '১৪.৫ বিঘা (পুকুর ও মসজিদ কমপ্লেক্সসহ)',
  capacity: '৬৫,০০০+ মুসল্লি (একসাথে জামাত)',
  establishedYear: '১৯৫২',
  address: 'ঈদগাহ সড়ক, কেন্দ্রীয় জামে মসজিদ কমপ্লেক্স সংলগ্ন',
  district: 'ঢাকা, বাংলাদেশ',
  facilities: [
    'সম্পূর্ণ বাউন্ডারি ওয়াল ও আধুনিক চারটি মেহরাব খচিত প্রবেশদ্বার',
    'বৃষ্টির পানি নিষ্কাশনের জন্য বিশেষ সাব-সয়েল ড্রেনেজ প্রযুক্তি',
    'একসাথে ১,০০০ মুসল্লির ওজু করার জন্য দ্বিতল আধুনিক ওজুখানা',
    'হাই-ডেফিনিশন সাউন্ড সিস্টেম ও পুরো ময়দানে ১০০+ স্পিকার নেটওয়ার্ক',
    '২৪ ঘণ্টা সিসিটিভি ক্যামেরা ও কেন্দ্রীয় নিরাপত্তা পর্যবেক্ষণ বুথ',
    'মহিলা ও প্রবীণ মুসল্লিদের জন্য বিশেষ সংরক্ষিত ব্লক ও সহজ যাতায়াত পথ',
    'জরুরি বিদ্যুৎ সরবরাহের জন্য অটো-সুইচ জেনারেটর ব্যাকআপ',
    'ঈদ উপলক্ষে বিনামূল্যে সুপেয় ঠান্ডা পানি ও প্রাথমিক চিকিৎসা ক্যাম্প'
  ],
  imamName: 'মুফতি মাওলানা হাফেজ আব্দুল্লাহ আল-মামুন',
  khatibName: 'শায়খুল হাদিস মাওলানা মুজাম্মেল হক কাসেমী',
  moazzinName: 'ক্বারী মোহাম্মদ শফিকুল ইসলাম'
};

export const INITIAL_COMMITTEE: CommitteeMember[] = [
  {
    id: 'comm-1',
    name: 'আলহাজ্ব কাজী রফিকুল ইসলাম',
    nameEn: 'Alhaj Kazi Rafiqul Islam',
    designation: 'সভাপতি (Executive President)',
    category: 'executive',
    phone: '01711-123456',
    email: 'president@central-eidgah.org.bd',
    order: 1,
    term: '২০২৪ - ২০২৬',
    bio: 'বিশিষ্ট সমাজসেবক ও শিক্ষানুরাগী, টানা দুই মেয়াদে ঈদগাহের সভাপতি হিসেবে দায়িত্ব পালন করছেন।',
    status: 'active'
  },
  {
    id: 'comm-2',
    name: 'অধ্যাপক ড. মোহাম্মদ আনোয়ার হোসেন',
    nameEn: 'Prof. Dr. Anwar Hossain',
    designation: 'সিনিয়র সহ-সভাপতি',
    category: 'executive',
    phone: '01712-234567',
    email: 'vp@central-eidgah.org.bd',
    order: 2,
    term: '২০২৪ - ২০২৬',
    bio: 'অবসরপ্রাপ্ত বিশ্ববিদ্যালয় অধ্যাপক ও ইসলামিক রিসার্চ ফেলো।',
    status: 'active'
  },
  {
    id: 'comm-3',
    name: 'অ্যাডভোকেট মশিউর রহমান',
    nameEn: 'Advocate Mashiur Rahman',
    designation: 'সাধারণ সম্পাদক (General Secretary)',
    category: 'executive',
    phone: '01713-345678',
    email: 'gs@central-eidgah.org.bd',
    order: 3,
    term: '২০২৪ - ২০২৬',
    bio: 'সুপ্রিম কোর্টের প্রবীণ আইনজীবী ও ওয়াকফ ট্রাস্টের প্রধান পরামর্শক।',
    status: 'active'
  },
  {
    id: 'comm-4',
    name: 'আলহাজ্ব মোস্তাফিজুর রহমান',
    nameEn: 'Alhaj Mostafizur Rahman',
    designation: 'কোষাধ্যক্ষ (Treasurer)',
    category: 'executive',
    phone: '01714-456789',
    email: 'treasurer@central-eidgah.org.bd',
    order: 4,
    term: '২০২৪ - ২০২৬',
    bio: 'চার্টার্ড অ্যাকাউন্ট্যান্ট ও হিসাব ব্যবস্থাপনা কমিটির প্রধান।',
    status: 'active'
  },
  {
    id: 'comm-5',
    name: 'ইঞ্জিনিয়ার কামরুল হাসান চৌধুরী',
    nameEn: 'Engr. Kamrul Hasan',
    designation: 'সাংগঠনিক সম্পাদক',
    category: 'executive',
    phone: '01715-567890',
    email: 'org@central-eidgah.org.bd',
    order: 5,
    term: '২০২৪ - ২০২৬',
    bio: 'উন্নয়ন ও মাঠ তদারকি উপ-কমিটির আহ্বায়ক।',
    status: 'active'
  },
  {
    id: 'comm-6',
    name: 'আল্লামা মুফতি সিরাজুল ইসলাম',
    nameEn: 'Allama Mufti Sirajul Islam',
    designation: 'প্রধান উপদেষ্টা',
    category: 'advisory',
    phone: '01716-678901',
    order: 6,
    term: 'আজীবন সদস্য',
    bio: 'বিশিষ্ট ফকিহ ও ইসলামী চিন্তাবিদ।',
    status: 'active'
  },
  {
    id: 'comm-7',
    name: 'হাজী নুরুজ্জামান সরকার',
    nameEn: 'Haji Nuruzzaman Sarkar',
    designation: 'উপদেষ্টা মণ্ডলীর সদস্য',
    category: 'advisory',
    phone: '01717-789012',
    order: 7,
    term: 'আজীবন সদস্য',
    bio: 'ঈদগাহের ভূমি দাতা পরিবারের সম্মানিত প্রতিনিধি।',
    status: 'active'
  }
];

export const INITIAL_PRAYER_INFO: EidPrayerInfo = {
  id: 'prayer-current',
  year: '২০২৬',
  hijriYear: '১৪৪৭ হিজরি',
  eidType: 'eid_ul_fitr',
  date: 'সম্ভাব্য তারিখ: ২১ অথবা ২২ মার্চ, ২০২৬ (চাঁদ দেখা সাপেক্ষে)',
  venue: 'ঐতিহাসিক কেন্দ্রীয় শাহী ঈদগাহ প্রধান ময়দান',
  jamats: [
    {
      jamatNo: 1,
      time: 'সকাল ৭:৩০ মিনিট',
      imamName: 'শায়খুল হাদিস মুফতি আব্দুল্লাহ আল-মামুন',
      imamTitle: 'প্রধান ইমাম ও খতিব, কেন্দ্রীয় শাহী জামে মসজিদ',
      notes: 'ভিড় এড়াতে সকাল ৭:০০ টার মধ্যে মাঠে প্রবেশের অনুরোধ।'
    },
    {
      jamatNo: 2,
      time: 'সকাল ৮:৩০ মিনিট',
      imamName: 'মাওলানা মুজাম্মেল হক কাসেমী',
      imamTitle: 'মুহাদ্দিস, জামিয়া ইসলামিয়া',
      notes: 'দ্বিতীয় জামাতে আশপাশের মহল্লার মুসল্লিদের অগ্রাধিকার।'
    },
    {
      jamatNo: 3,
      time: 'সকাল ৯:৩০ মিনিট',
      imamName: 'হাফেজ ক্বারী শফিকুল ইসলাম',
      imamTitle: 'ইমাম ও মুদাররিস',
      notes: 'সর্বশেষ নির্ধারিত সাধারণ জামাত।'
    }
  ],
  guidelines: [
    'দয়া করে বাসা থেকে পবিত্র অবস্থায় ওজু করে জায়নামাজ ও মাস্ক সাথে নিয়ে আসবেন।',
    'মাঠের উত্তর ও পশ্চিম গেট দিয়ে সাধারণ মুসল্লি এবং দক্ষিণ গেট দিয়ে প্রবীণদের প্রবেশাধিকার।',
    'যানবাহন নির্ধারিত পৌরসভা পার্কিং জোন ব্যতীত ঈদগাহ রোডে পার্কিং সম্পূর্ণ নিষেধ।',
    'লাইটার, ম্যাচবক্স, ধারালো বস্তু বা ভারী ব্যাগ বহন করা থেকে বিরত থাকুন।',
    'ছোট শিশুদের পকেটে অভিভাবকের মোবাইল নম্বর লিখিত কাগজ রাখার অনুরোধ করা হচ্ছে।'
  ],
  weatherAlternative: 'প্রাকৃতিক দুর্যোগ বা ভারী বৃষ্টিপাত হলে ঈদগাহ সংলগ্ন দ্বিতল কেন্দ্রীয় জামে মসজিদে একই সময়সূচি অনুযায়ী জামাত অনুষ্ঠিত হবে।',
  emergencyContact: 'কন্ট্রোল রুম হটলাইন: ০১৭৯৯-১১২২৩৩ / ফায়ার সার্ভিস: ৯৯৯'
};

export const INITIAL_NOTICES: NoticeItem[] = [
  {
    id: 'notice-1',
    title: 'পবিত্র ঈদুল ফিতর ২০২৬-এর ৩টি জামাত ও মুসল্লিদের সার্বিক নির্দেশিকা',
    category: 'eid',
    content: 'সকল মুসল্লিবৃন্দের অবগতির জন্য জানানো যাচ্ছে যে, ঐতিহাসিক কেন্দ্রীয় শাহী ঈদগাহ ময়দানে এবারের ঈদুল ফিতরে মোট ৩টি জামাত অনুষ্ঠিত হবে। সকাল ৭:৩০, ৮:৩০ এবং ৯:৩০ মিনিটে। নিরাপত্তা ও শৃঙ্খলা রক্ষার্থে পর্যাপ্ত স্বেচ্ছাসেবক নিয়োজিত থাকবে।',
    publishedDate: '০৪ মার্চ, ২০২৬',
    isPinned: true,
    author: 'সাধারণ সম্পাদক'
  },
  {
    id: 'notice-2',
    title: 'ঈদগাহ আধুনিক মিনার ও মেহরাব উন্নয়ন তহবিলে মুক্তহস্তে দানের আহ্বান',
    category: 'financial',
    content: 'সম্মানিত দানশীল ধর্মপ্রাণ ভাই ও বোনেরা, ঈদগাহ ময়দানের ঐতিহাসিক মেহরাব ও মিনার নির্মাণ কাজ দ্রুত এগিয়ে চলছে। এই মহতী সদকায়ে জারিয়ায় আপনাদের সহযোগিতার হাত বাড়িয়ে দিন। ব্যাংক, বিকাশ কিংবা সরাসরি অফিসে দান রশিদ সংগ্রহ করতে পারেন।',
    publishedDate: '২৮ ফেব্রুয়ারি, ২০২৬',
    isPinned: true,
    author: 'কোষাধ্যক্ষ'
  },
  {
    id: 'notice-3',
    title: 'কার্যনির্বাহী কমিটির বিশেষ সাধারণ সভা সংক্রান্ত জরুরি বিজ্ঞপ্তি',
    category: 'general',
    content: 'আগামী শুক্রবার বাদ আছর ঈদগাহ কমপ্লেক্স অডিটোরিয়ামে আসন্ন ঈদ প্রস্তুতি পর্যালোচনা বিষয়ক জরুরি সাধারণ সভা অনুষ্ঠিত হবে। কমিটির সকল সদস্যকে যথাসময়ে উপস্থিত থাকার জন্য বিনীত অনুরোধ করা হলো।',
    publishedDate: '২৫ ফেব্রুয়ারি, ২০২৬',
    isPinned: false,
    author: 'অফিস সচিব'
  }
];

export const INITIAL_PROJECTS: DevelopmentProject[] = [
  {
    id: 'proj-1',
    title: 'ঐতিহাসিক তোরণ ও সুউচ্চ মিনার নির্মাণ প্রকল্প',
    titleEn: 'Historic Grand Arch & Minaret Construction',
    description: 'ঈদগাহের প্রধান প্রবেশদ্বারে তুরস্ক ও মোগল স্থাপত্যরীতি মিশ্রিত নান্দনিক ৮০ ফুট সুউচ্চ মিনার এবং মনোরম ক্যালিগ্রাফি খচিত প্রধান তোরণ নির্মাণ।',
    targetBudget: 2500000,
    raisedBudget: 1980000,
    status: 'ongoing',
    startDate: '০১ জানুয়ারি, ২০২৬',
    estimatedEndDate: 'ডিসেম্বর, ২০২৬',
    coverImage: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'proj-2',
    title: 'দ্বিতল আধুনিক ওজুখানা ও পয়ঃনিষ্কাশন কমপ্লেক্স',
    titleEn: 'Two-Story Modern Ablution Complex',
    description: 'একসাথে ১,০০০ মুসল্লির দ্রুত ওজু ও জরুরি প্রয়োজনের সুবিধার্থে আধুনিক মার্বেল পাথর, সেন্সর কল এবং পানির রিসাইক্লিং প্রযুক্তি সম্পন্ন ওজুখানা।',
    targetBudget: 1400000,
    raisedBudget: 1150000,
    status: 'ongoing',
    startDate: '১৫ নভেম্বর, ২০২৫',
    estimatedEndDate: 'এপ্রিল, ২০২৬',
    coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'proj-3',
    title: 'বৃষ্টির পানি নিষ্কাশনে সাব-সারফেস অটো ড্রেনেজ',
    titleEn: 'Underground Stormwater Drainage System',
    description: 'বৃষ্টির মৌসুমে ময়দানে পানি জমে থাকা চিরতরে বন্ধ করতে মাঠের নিচে বিশেষ ছিদ্রযুক্ত পাইপলাইন এবং ভূগর্ভস্থ জলাধার নির্মাণ।',
    targetBudget: 850000,
    raisedBudget: 850000,
    status: 'completed',
    startDate: '০১ জুন, ২০২৫',
    estimatedEndDate: 'নভেম্বর, ২০২৫',
    coverImage: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80'
  }
];

export const INITIAL_WALLETS: WalletAccount[] = [
  {
    id: 'wal-1',
    accountName: 'প্রধান পরিচালন তহবিল (সোনালী ব্যাংক)',
    accountType: 'bank',
    bankName: 'সোনালী ব্যাংক পিএলসি, লোকাল অফিস',
    accountNumber: '০১০০২৩৪৫৬৭৮',
    balance: 1845250,
    updatedAt: '২০২৬-০৩-০৮'
  },
  {
    id: 'wal-2',
    accountName: 'উন্নয়ন ও মিনার তহবিল (ইসলামী ব্যাংক)',
    accountType: 'bank',
    bankName: 'ইসলামী ব্যাংক বাংলাদেশ পিএলসি',
    accountNumber: '২০৫০১২৩৪৫৬৭৮৯',
    balance: 2480000,
    updatedAt: '২০২৬-০৩-০৮'
  },
  {
    id: 'wal-3',
    accountName: 'বিকাশ অনুদান মার্চেন্ট ওয়ালেট',
    accountType: 'mobile_money',
    accountNumber: '০১৮১১-৯৯৮৮৭৭',
    balance: 145600,
    updatedAt: '২০২৬-০৩-০৮'
  },
  {
    id: 'wal-4',
    accountName: 'নগদ অনুদান মার্চেন্ট ওয়ালেট',
    accountType: 'mobile_money',
    accountNumber: '০১৯১১-৮৮৭৭৬৬',
    balance: 92400,
    updatedAt: '২০২৬-০৩-০৮'
  }
];

export const INITIAL_INCOMES: IncomeRecord[] = [
  {
    id: 'inc-1',
    source: 'পবিত্র রমজান উপলক্ষে বিশেষ সদকা ও দান',
    amount: 150000,
    date: '২০২৬-০৩-০৬',
    category: 'donation',
    voucherNo: 'VR-INC-2026-081',
    receivedBy: 'হিসাব শাখা',
    description: 'ব্যাংক অ্যাকাউন্টে স্থানীয় ব্যবসায়ীদের সম্মিলিত অনুদান।'
  },
  {
    id: 'inc-2',
    source: 'ঈদগাহ সংলগ্ন দিঘি/পুকুর বার্ষিক মৎস্য লিজ',
    amount: 280000,
    date: '২০২৬-০২-১৫',
    category: 'pond_lease',
    voucherNo: 'VR-INC-2026-045',
    receivedBy: 'কোষাধ্যক্ষ',
    description: '২০২৬ সালের জন্য উন্মুক্ত দরপত্রের মাধ্যমে নির্ধারিত লিজ মানি।'
  },
  {
    id: 'inc-3',
    source: 'মিনার প্রকল্পের সাধারণ মুসল্লি অনুদান',
    amount: 95000,
    date: '২০২৬-০৩-০১',
    category: 'donation',
    voucherNo: 'VR-INC-2026-068',
    receivedBy: 'অফিস ক্যাশিয়ার',
    description: 'শুক্রবার জুমার পর সরাসরি নগদ রশিদে গৃহীত দান।'
  }
];

export const INITIAL_EXPENSES: ExpenseRecord[] = [
  {
    id: 'exp-1',
    purpose: 'ময়দানের ঘাস ছাঁটাই, পরিচ্ছন্নতা ও বালু ভরাট',
    amount: 45000,
    date: '২০২৬-০৩-০৫',
    category: 'maintenance',
    voucherNo: 'VR-EXP-2026-039',
    spentBy: 'মাঠ তত্ত্বাবধায়ক',
    approvedBy: 'সাধারণ সম্পাদক',
    description: 'ঈদ জামাতের প্রস্তুতি উপলক্ষে মাঠ সমতলকরণ ও পরিষ্কার।'
  },
  {
    id: 'exp-2',
    purpose: 'কেন্দ্রীয় সাউন্ড সিস্টেম সার্ভিসিং ও নতুন মাইক ক্রয়',
    amount: 62000,
    date: '২০২৬-০৩-০২',
    category: 'sound_system',
    voucherNo: 'VR-EXP-2026-032',
    spentBy: 'ইকুইপমেন্ট ইনচার্জ',
    approvedBy: 'সভাপতি',
    description: 'পুরো মাঠের অডিও লাইনের তার প্রতিস্থাপন ও ১০টি নতুন হর্ন স্পিকার।'
  },
  {
    id: 'exp-3',
    purpose: 'ওজুখখানার পানির পাম্প মেরামত ও মোটর পরিবর্তন',
    amount: 28000,
    date: '২০২৬-০২-২৮',
    category: 'maintenance',
    voucherNo: 'VR-EXP-2026-028',
    spentBy: 'প্রকৌশল সহকারী',
    approvedBy: 'কোষাধ্যক্ষ',
    description: 'প্রধান ৫ ঘোড়া সাবমার্সিবল পাম্প রিওয়াইন্ডিং ও লাইন সংযোগ।'
  }
];

export const INITIAL_DONATIONS: DonationRecord[] = [
  {
    id: 'don-1',
    donorName: 'মোহাম্মদ তারেক আজিজ',
    donorPhone: '01711-889900',
    amount: 25000,
    paymentMethod: 'bKash',
    transactionId: 'BK9A7210XZ',
    purpose: 'development',
    date: '২০২৬-০৩-০৭',
    status: 'approved',
    receiptNo: 'EMS-DON-2026-0128',
    notes: 'মিনার নির্মাণ প্রকল্পে অনুদান'
  },
  {
    id: 'don-2',
    donorName: 'আলহাজ্ব আব্দুর রউফ',
    donorPhone: '01819-223344',
    amount: 50000,
    paymentMethod: 'Bank',
    transactionId: 'IBBL-TR-99882',
    purpose: 'general',
    date: '২০২৬-০৩-০৬',
    status: 'approved',
    receiptNo: 'EMS-DON-2026-0127',
    notes: 'ঈদ জামাতের ব্যবস্থাপনা ব্যয়'
  },
  {
    id: 'don-3',
    donorName: 'নাসরিন সুলতানা',
    donorPhone: '01912-334455',
    amount: 10000,
    paymentMethod: 'Nagad',
    transactionId: 'NG77192A0B',
    purpose: 'zakat',
    date: '২০২৬-০৩-০৫',
    status: 'approved',
    receiptNo: 'EMS-DON-2026-0126',
    notes: 'দরিদ্র তহবিলে সহায়তা'
  }
];

export const INITIAL_EVENTS: CommunityEvent[] = [
  {
    id: 'evt-1',
    title: 'পবিত্র রমজান উপলক্ষে দোয়া মাহফিল ও গণ-ইফতার',
    description: 'ঈদগাহ প্রাঙ্গণে অঞ্চলের সর্বস্তরের ধর্মপ্রাণ মুসল্লি ও এতিমদের সম্মানে বার্ষিক দোয়া ও গণ-ইফতার কর্মসূচি।',
    date: '২০২৬-০৩-১৫',
    time: 'বিকাল ৫:০০ মিনিট',
    venue: 'ঈদগাহ ময়দান ও কেন্দ্রীয় জামে মসজিদ চত্বর',
    chiefGuest: 'বিশিষ্ট ইসলামি চিন্তাবিদ শায়খ ড. মনজুর এলাহী',
    status: 'upcoming'
  },
  {
    id: 'evt-2',
    title: 'আসন্ন ঈদুল ফিতর ২০২৬ প্রস্তুতি ও নিরাপত্তা বিষয়ক মতবিনিময়',
    description: 'জেলা প্রশাসন, পুলিশ প্রশাসন, পৌরসভা ও স্থানীয় জনপ্রতিনিধিদের সাথে সমন্বয় সভা।',
    date: '২০২৬-০৩-১০',
    time: 'সকাল ১০:৩০ মিনিট',
    venue: 'ঈদগাহ কমপ্লেক্স সম্মেলন কক্ষ',
    status: 'upcoming'
  }
];

export const INITIAL_MEETINGS: MeetingItem[] = [
  {
    id: 'meet-1',
    title: 'কার্যনির্বাহী পরিষদের বার্ষিক বাজেট ও ঈদ প্রস্তুতি সভা',
    meetingDate: '২০২৬-০৩-০৪',
    meetingTime: 'বাদ মাগরিব',
    location: 'ঈদগাহ প্রশাসনিক ভবন সভাকক্ষ',
    agenda: '১. ২০২৬ সালের সম্ভাব্য ঈদ বাজেট অনুমোদন, ২. নিরাপত্তা ও সিসিটিভি ব্যবস্থা পর্যালোচনা, ৩. লাইটিং ও সাউন্ড ব্যবস্থা অনুমোদন।',
    presidedBy: 'আলহাজ্ব কাজী রফিকুল ইসলাম (সভাপতি)',
    attendeesCount: 22,
    resolutionSummary: 'সর্বসম্মতিক্রমে ৪২ লক্ষ টাকার ঈদ প্রস্তুতি বাজেট এবং ৩টি জামাত আয়োজনের সিদ্ধান্ত গৃহীত হয়।',
    status: 'concluded'
  }
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    title: 'ঐতিহাসিক কেন্দ্রীয় শাহী ঈদগাহ ওয়াকফ রেজিস্ট্রেশন সনদ (WQF-DHK-48201)',
    category: 'land_record',
    accessLevel: 'public',
    uploadDate: '২০২৫-১২-১০',
    fileSize: '২.৪ মেগাবাইট'
  },
  {
    id: 'doc-2',
    title: '২০২৪-২০২৫ অর্থবছরের চার্টার্ড অ্যাকাউন্ট্যান্ট বার্ষিক অডিট রিপোর্ট',
    category: 'audit',
    accessLevel: 'public',
    uploadDate: '২০২৬-০১-১৫',
    fileSize: '৪.১ মেগাবাইট'
  },
  {
    id: 'doc-3',
    title: 'ঈদগাহ পরিচালনা পরিষদের অনুমোদিত সংবিধান ও আচরণবিধিমালা',
    category: 'constitution',
    accessLevel: 'public',
    uploadDate: '২০২৪-০৯-২০',
    fileSize: '১.৮ মেগাবাইট'
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'ঐতিহাসিক ঈদগাহে ঈদুল ফিতরের প্রধান জামাত',
    category: 'eid_ul_fitr',
    imageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
    caption: 'হাজারো ধর্মপ্রাণ মুসল্লির অংশগ্রহণে ঈদুল ফিতরের প্রথম জামাত ও মোনাজাত।',
    year: '২০২৫',
    uploadedAt: '২০২৫-০৪-১১'
  },
  {
    id: 'gal-2',
    title: 'ঈদ জামাত পূর্ববর্তী শৃঙ্খলা ও কাতারবদ্ধ মুসল্লিবৃন্দ',
    category: 'eid_ul_fitr',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    caption: 'ঈদগাহ ময়দানে সুশৃঙ্খলভাবে কাতারবন্দী মুসল্লিদের একাংশ।',
    year: '২০২৫',
    uploadedAt: '২০২৫-০৪-১১'
  },
  {
    id: 'gal-3',
    title: 'ঈদুল আজহায় ত্যাগ ও ভ্রাতৃত্বের ঐতিহাসিক মিলনমেলা',
    category: 'eid_ul_adha',
    imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
    caption: 'ঈদুল আজহার জামাত শেষে দেশ ও জাতির কল্যাণ কামনায় বিশেষ দোয়া।',
    year: '২০২৫',
    uploadedAt: '২০২৫-০৬-১৭'
  },
  {
    id: 'gal-4',
    title: 'মিনার ও আধুনিক তোরণ নির্মাণ কাজের অগ্রগতি',
    category: 'development',
    imageUrl: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=1200&q=80',
    caption: 'প্রধান প্রবেশদ্বারে খোদাই করা ক্যালিগ্রাফি ও মার্বেল কাঠামো স্থাপন।',
    year: '২০২৬',
    uploadedAt: '২০২৬-০২-২০'
  }
];

export const INITIAL_FINANCIAL_REPORTS: PublicFinancialReport[] = [
  {
    id: 'fin-rep-2024-2025',
    fiscalYear: '২০২৪-২০২৫',
    title: '২০২৪-২০২৫ অর্থবছরের বার্ষিক নিরীক্ষিত আর্থিক অডিট ও আয়-ব্যয় রিপোর্ট',
    periodName: '০১ জুলাই ২০২৪ হতে ৩০ জুন ২০২৫ (বার্ষিক নিরীক্ষা)',
    publishedDate: '২০২৬-০১-২০',
    auditedBy: 'মেসার্স কে. রহমান অ্যান্ড কোং, চার্টার্ড অ্যাকাউন্ট্যান্টস',
    totalIncome: 5250000,
    totalExpense: 3840000,
    netSurplus: 1410000,
    status: 'audited',
    summaryText: 'ঐতিহাসিক কেন্দ্রীয় শাহী ঈদগাহ ময়দান পরিচালনা পরিষদ ও সাধারণ সভার অনুমোদনের পর ওয়াকফ প্রশাসনের বিধিমোতাবেক চার্টার্ড অ্যাকাউন্ট্যান্ট দ্বারা নিরীক্ষিত চূড়ান্ত বার্ষিক আর্থিক প্রতিবেদন। এই অর্থবছরে মিনার নির্মাণ ও ড্রেনেজ প্রকল্পে সর্বোচ্চ বরাদ্দ বাস্তবায়িত হয়েছে।',
    incomeCategories: [
      { category: 'সাধারণ অনুদান ও দানবাক্স সংগ্রহ', amount: 2150000, percentage: 41 },
      { category: 'প্রবাসী ও বিশিষ্ট দাতাবৃন্দের ব্যাংক অনুদান', amount: 1650000, percentage: 31 },
      { category: 'দিঘি/পুকুর ও ঈদগাহ মাঠ বার্ষিক ইজারা', amount: 850000, percentage: 16 },
      { category: 'মিনার ও ড্রেনেজ বিশেষ উন্নয়ন তহবিল', amount: 600000, percentage: 12 }
    ],
    expenseCategories: [
      { category: 'মিনার নির্মাণ ও অবকাঠামোগত উন্নয়ন কাজ', amount: 1850000, percentage: 48 },
      { category: 'বৃষ্টির পানি নিষ্কাশন অটো ড্রেনেজ ব্যবস্থা', amount: 850000, percentage: 22 },
      { category: 'ঈদের জামাত প্রস্তুতি, শামিয়ানা ও লাইন অঙ্কন', amount: 480000, percentage: 13 },
      { category: 'কেন্দ্রীয় সাউন্ড সিস্টেম ও আলোকসজ্জা', amount: 360000, percentage: 9 },
      { category: 'প্রশাসনিক ব্যয়, পরিচ্ছন্নতা ও ওজুখানা মেরামত', amount: 300000, percentage: 8 }
    ],
    auditDocumentTitle: '২০২৪-২০২৫ অর্থবছরের চার্টার্ড অ্যাকাউন্ট্যান্ট বার্ষিক অডিট রিপোর্ট (PDF)',
    auditDocumentId: 'doc-2'
  },
  {
    id: 'fin-rep-2023-2024',
    fiscalYear: '২০২৩-২০২৪',
    title: '২০২৩-২০২৪ অর্থবছরের সমাপ্ত বার্ষিক আর্থিক নিরীক্ষা বিবরণী',
    periodName: '০১ জুলাই ২০২৩ হতে ৩০ জুন ২০২৪ (বার্ষিক নিরীক্ষা)',
    publishedDate: '২০২৪-০৮-১৫',
    auditedBy: 'মেসার্স আহমেদ অ্যান্ড পার্টনার্স, চার্টার্ড অ্যাকাউন্ট্যান্টস',
    totalIncome: 4620000,
    totalExpense: 3490000,
    netSurplus: 1130000,
    status: 'audited',
    summaryText: 'বিগত ২০২৩-২০২৪ অর্থবছরের অনুমোদিত ও নিরীক্ষিত বার্ষিক আয়-ব্যয়ের হিসাব বিবরণী। সমস্ত ভাউচার ও ব্যাংক স্থিতি ওয়াকফ নিরীক্ষক দ্বারা নিরীক্ষিত ও ত্রুটিমুক্ত প্রত্যয়িত।',
    incomeCategories: [
      { category: 'সাধারণ অনুদান ও দানবাক্স', amount: 1980000, percentage: 43 },
      { category: 'প্রবাসী ও সুধী অনুদান', amount: 1420000, percentage: 31 },
      { category: 'বার্ষিক দিঘি মৎস্য লিজ', amount: 720000, percentage: 15 },
      { category: 'বিবিধ ও সাধারণ তহবিলের সুদবিহীন আয়', amount: 500000, percentage: 11 }
    ],
    expenseCategories: [
      { category: 'মাঠ সংস্কার ও প্রাচীর মেরামত', amount: 1450000, percentage: 42 },
      { category: 'ঈদ জামাতের সার্বিক ব্যবস্থাপনা ও সাউন্ড', amount: 820000, percentage: 23 },
      { category: 'বিদ্যুৎ লাইন, পাম্প ও পানি সরবরাহ ব্যবস্থাপনা', amount: 640000, percentage: 18 },
      { category: 'স্টাফ হাদিয়া ও বিবিধ প্রাতিষ্ঠানিক ব্যয়', amount: 580000, percentage: 17 }
    ],
    auditDocumentTitle: '২০২৩-২০২৪ অর্থবছরের অনুমোদিত অডিট সারসংক্ষেপ',
    auditDocumentId: 'doc-2'
  }
];

