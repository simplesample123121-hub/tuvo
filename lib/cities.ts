// Comprehensive list of major Indian cities
export const INDIAN_CITIES = Array.from(new Set([
  // Major Metropolitan Cities
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad',
  
  // State Capitals
  'Jaipur', 'Lucknow', 'Bhopal', 'Patna', 'Bhubaneswar', 'Chandigarh', 'Dehradun', 'Gandhinagar',
  'Shimla', 'Ranchi', 'Raipur', 'Panaji', 'Gangtok', 'Agartala', 'Kohima', 'Imphal', 'Aizawl',
  'Itanagar', 'Dispur', 'Shillong', 'Thiruvananthapuram', 'Bengaluru', 'Mysore', 'Mangalore',
  'Kochi', 'Thrissur', 'Kozhikode', 'Kannur', 'Kollam', 'Palakkad', 'Malappuram', 'Alappuzha',
  'Kottayam', 'Pathanamthitta', 'Idukki', 'Wayanad', 'Kasaragod',
  
  // Major Cities by State
  // Maharashtra
  'Nashik', 'Nagpur', 'Aurangabad', 'Solapur', 'Amravati', 'Kolhapur', 'Sangli', 'Nanded',
  'Malegaon', 'Jalgaon', 'Akola', 'Latur', 'Dhule', 'Ahmednagar', 'Chandrapur', 'Parbhani',
  'Ichalkaranji', 'Jalna', 'Bhusawal', 'Panvel', 'Ulhasnagar', 'Pimpri-Chinchwad', 'Mira-Bhayandar',
  'Kalyan-Dombivali', 'Vasai-Virar', 'Navi Mumbai', 'Thane', 'Bhiwandi', 'Ambernath', 'Badlapur',
  
  // Karnataka
  'Hubli', 'Dharwad', 'Belgaum', 'Gulbarga', 'Bellary', 'Tumkur', 'Shimoga', 'Raichur',
  'Bidar', 'Hospet', 'Hassan', 'Bijapur', 'Chitradurga', 'Udupi', 'Kolar', 'Mandya',
  'Chikmagalur', 'Karwar', 'Gadag', 'Chamrajanagar', 'Chikkaballapur', 'Davanagere',
  
  // Tamil Nadu
  'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Tiruppur', 'Erode',
  'Vellore', 'Thoothukudi', 'Dindigul', 'Thanjavur', 'Ranipet', 'Sivakasi', 'Karur',
  'Udhagamandalam', 'Hosur', 'Nagercoil', 'Kanchipuram', 'Cuddalore', 'Kumbakonam',
  'Tiruvannamalai', 'Pollachi', 'Rajapalayam', 'Gobichettipalayam', 'Pudukkottai',
  'Vaniyambadi', 'Ambur', 'Nagapattinam', 'Gudiyatham', 'Tirupathur', 'Tenkasi',
  
  // Uttar Pradesh
  'Kanpur', 'Agra', 'Varanasi', 'Allahabad', 'Bareilly', 'Meerut', 'Ghaziabad', 'Noida',
  'Moradabad', 'Aligarh', 'Saharanpur', 'Gorakhpur', 'Firozabad', 'Jhansi', 'Muzaffarnagar',
  'Mathura', 'Shahjahanpur', 'Rampur', 'Mau', 'Hapur', 'Etawah', 'Mirzapur', 'Bulandshahr',
  'Sambhal', 'Amroha', 'Hardoi', 'Fatehpur', 'Raebareli', 'Orai', 'Sitapur', 'Bahraich',
  'Modinagar', 'Unnao', 'Jaunpur', 'Lakhimpur', 'Hathras', 'Banda', 'Pilibhit', 'Barabanki',
  'Khurja', 'Gonda', 'Mainpuri', 'Lalitpur', 'Etah', 'Deoria', 'Ujhani', 'Ghazipur',
  'Sultanpur', 'Azamgarh', 'Bijnor', 'Sahaswan', 'Basti', 'Chandausi', 'Akbarpur',
  'Ballia', 'Tanda', 'Greater Noida', 'Shikohabad', 'Shamli', 'Awagarh', 'Kasganj',
  
  // West Bengal
  'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman', 'Malda', 'Baharampur',
  'Habra', 'Kharagpur', 'Shantipur', 'Dankuni', 'Dhulian', 'Jangipur', 'Baharampur',
  'Kanchrapara', 'Chakdaha', 'Kalyani', 'Bhatpara', 'Panchla', 'Titagarh', 'Kamarhati',
  'Barasat', 'Uttarpara', 'Serampore', 'Rishra', 'Bansberia', 'Naihati', 'Bhadreswar',
  'Chandannagar', 'Konnagar', 'Baidyabati', 'Bally', 'Baranagar', 'Panihati', 'Kamarhati',
  'Bidhannagar', 'Madhyamgram', 'Pujali', 'Khardaha', 'New Barrackpore', 'Titagarh',
  
  // Gujarat
  'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar',
  'Anand', 'Navsari', 'Morbi', 'Nadiad', 'Surendranagar', 'Bharuch', 'Mehsana',
  'Bhuj', 'Gondal', 'Veraval', 'Porbandar', 'Godhra', 'Palanpur', 'Vapi', 'Ankleshwar',
  'Bardoli', 'Mahuva', 'Bhavnagar', 'Valsad', 'Patan', 'Deesa', 'Vejalpur', 'Kalol',
  'Palanpur', 'Mundra', 'Bharuch', 'Ankleshwar', 'Himatnagar', 'Wadhwan', 'Sidhpur',
  
  // Rajasthan
  'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar', 'Bharatpur',
  'Sikar', 'Pali', 'Sri Ganganagar', 'Kishangarh', 'Beawar', 'Hanumangarh', 'Dhaulpur',
  'Gangapur', 'Sawai Madhopur', 'Churu', 'Jhunjhunu', 'Baran', 'Bundi', 'Sirohi',
  'Pratapgarh', 'Rajsamand', 'Dungarpur', 'Banswara', 'Jaisalmer', 'Barmer', 'Jalor',
  'Sirohi', 'Pali', 'Nagaur', 'Tonk', 'Dausa', 'Karauli', 'Sawai Madhopur',
  
  // Madhya Pradesh
  'Indore', 'Bhopal', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Dewas', 'Satna',
  'Ratlam', 'Rewa', 'Murwara', 'Singrauli', 'Burhanpur', 'Khandwa', 'Chhindwara',
  'Damoh', 'Mandsaur', 'Khargone', 'Neemuch', 'Pithampur', 'Hoshangabad', 'Itarsi',
  'Sehore', 'Betul', 'Seoni', 'Datia', 'Shivpuri', 'Vidisha', 'Guna', 'Ashoknagar',
  'Tikamgarh', 'Chhatarpur', 'Panna', 'Sagar', 'Damoh', 'Katni', 'Jabalpur',
  
  // Andhra Pradesh
  'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati', 'Kadapa',
  'Anantapur', 'Chittoor', 'Ongole', 'Nandyal', 'Eluru', 'Machilipatnam', 'Tenali',
  'Proddatur', 'Chilakaluripet', 'Kadiri', 'Chirala', 'Gudivada', 'Narasaraopet',
  'Srikakulam', 'Adoni', 'Tadipatri', 'Kavali', 'Nandikotkur', 'Kurnool', 'Markapur',
  'Ponnur', 'Bapatla', 'Vinukonda', 'Narasapur', 'Nidadavole', 'Tanuku', 'Chilakaluripet',
  
  // Telangana
  'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Ramagundam', 'Mahbubnagar',
  'Nalgonda', 'Adilabad', 'Suryapet', 'Miryalaguda', 'Jagtial', 'Sangareddy',
  'Mancherial', 'Nirmal', 'Kamareddy', 'Wanaparthy', 'Bhadrachalam', 'Bhongir',
  'Bodhan', 'Vikarabad', 'Jangaon', 'Bhupalpally', 'Yellandu', 'Vemulawada',
  
  // Kerala
  'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Malappuram', 'Alappuzha',
  'Kannur', 'Kottayam', 'Pathanamthitta', 'Idukki', 'Wayanad', 'Kasaragod',
  'Kannur', 'Kozhikode', 'Malappuram', 'Palakkad', 'Thrissur', 'Ernakulam',
  
  // Punjab
  'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Batala',
  'Pathankot', 'Moga', 'Abohar', 'Malerkotla', 'Khanna', 'Phagwara', 'Muktsar',
  'Barnala', 'Rajpura', 'Firozpur', 'Kapurthala', 'Zirakpur', 'Kotkapura',
  
  // Haryana
  'Faridabad', 'Gurgaon', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar',
  'Karnal', 'Sonipat', 'Panchkula', 'Bhiwani', 'Sirsa', 'Bahadurgarh', 'Jind',
  'Kaithal', 'Palwal', 'Rewari', 'Hansi', 'Narnaul', 'Fatehabad', 'Tohana',
  
  // Bihar
  'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia', 'Arrah',
  'Begusarai', 'Katihar', 'Munger', 'Chhapra', 'Saharsa', 'Sasaram', 'Hajipur',
  'Dehri', 'Bettiah', 'Motihari', 'Buxar', 'Sitamarhi', 'Kishanganj', 'Jamalpur',
  'Jehanabad', 'Aurangabad', 'Lakhisarai', 'Nawada', 'Jamui', 'Sheikhpura',
  
  // Odisha
  'Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Baleshwar',
  'Bhadrak', 'Baripada', 'Balangir', 'Jharsuguda', 'Bargarh', 'Paradip', 'Bhubaneswar',
  'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Baleshwar', 'Bhadrak',
  
  // Assam
  'Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Tezpur', 'Nagaon', 'Tinsukia',
  'Bongaigaon', 'Dhubri', 'Goalpara', 'Barpeta', 'Mangaldoi', 'Lakhimpur', 'Karimganj',
  'Sivasagar', 'Hailakandi', 'Kokrajhar', 'Dhemaji', 'Morigaon', 'Nalbari', 'Baksa',
  
  // Jharkhand
  'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Phusro', 'Hazaribagh',
  'Giridih', 'Koderma', 'Ramgarh', 'Jhumri Telaiya', 'Mango', 'Adityapur', 'Sahibganj',
  'Medininagar', 'Chaibasa', 'Gumla', 'Lohardaga', 'Jamtara', 'Pakur', 'Simdega',
  
  // Chhattisgarh
  'Raipur', 'Bhilai', 'Korba', 'Bilaspur', 'Rajnandgaon', 'Durg', 'Raigarh', 'Ambikapur',
  'Mahasamund', 'Bhatapara', 'Dalli-Rajhara', 'Naila Janjgir', 'Tilda Newra', 'Mungeli',
  'Manendragarh', 'Sakti', 'Chirmiri', 'Pandariya', 'Kurud', 'Gariaband', 'Mainpur',
  
  // Uttarakhand
  'Dehradun', 'Haridwar', 'Roorkee', 'Kashipur', 'Rudrapur', 'Haldwani', 'Rishikesh',
  'Ramnagar', 'Pithoragarh', 'Manglaur', 'Nainital', 'Mussoorie', 'Almora', 'Pauri',
  'Pipalkoti', 'Srinagar', 'Tanakpur', 'Bageshwar', 'Kotdwar', 'Laksar', 'Sitarganj',
  
  // Himachal Pradesh
  'Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Palampur', 'Baddi', 'Nahan', 'Sundarnagar',
  'Chamba', 'Una', 'Hamirpur', 'Bilaspur', 'Kangra', 'Kullu', 'Manali', 'Dalhousie',
  
  // Jammu and Kashmir
  'Srinagar', 'Jammu', 'Baramulla', 'Anantnag', 'Sopore', 'Kathua', 'Udhampur',
  'Rajauri', 'Punch', 'Kupwara', 'Kulgam', 'Shopian', 'Bandipora', 'Ganderbal',
  'Samba', 'Reasi', 'Ramban', 'Doda', 'Kishtwar', 'Poonch', 'Rajouri',
  
  // Goa
  'Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Mormugao', 'Sanquelim',
  'Curchorem', 'Sanvordem', 'Quepem', 'Sanguem', 'Canacona', 'Pernem', 'Bicholim',
  'Sattari', 'Tiswadi', 'Bardez', 'Salcete', 'Mormugao', 'Dharbandora',
  
  // Northeastern States
  'Agartala', 'Aizawl', 'Imphal', 'Kohima', 'Gangtok', 'Itanagar', 'Shillong',
  'Dimapur', 'Jorhat', 'Dibrugarh', 'Silchar', 'Tezpur', 'Nagaon', 'Tinsukia',
  
  // Union Territories
  'Chandigarh', 'Puducherry', 'Karaikal', 'Mahe', 'Yanam', 'Daman', 'Diu', 'Dadra',
  'Silvassa', 'Kavaratti', 'Agatti', 'Minicoy', 'Port Blair'
]))

// Popular cities for quick access
export const POPULAR_CITIES = Array.from(new Set([
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad',
  'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam',
  'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik',
  'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar', 'Varanasi',
  'Srinagar', 'Aurangabad', 'Navi Mumbai', 'Solapur', 'Vijayawada', 'Kolhapur',
  'Amritsar', 'Noida', 'Ranchi', 'Howrah', 'Coimbatore', 'Raipur', 'Jabalpur',
  'Gwalior', 'Chandigarh', 'Tiruchirappalli', 'Mysore', 'Bhubaneswar', 'Kochi',
  'Bhavnagar', 'Salem', 'Warangal', 'Guntur', 'Bhiwandi', 'Amravati', 'Nanded',
  'Kolhapur', 'Sangli', 'Malegaon', 'Ulhasnagar', 'Jalgaon', 'Latur', 'Ahmednagar',
  'Chandrapur', 'Parbhani', 'Ichalkaranji', 'Jalna', 'Bhusawal', 'Ambattur',
  'Loni', 'Jalna', 'Bhusawal', 'Ambattur', 'Loni', 'Jalna', 'Bhusawal'
]))
