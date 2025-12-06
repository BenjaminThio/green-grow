import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Camera, 
  Video, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  User, 
  Bell, 
  Home, 
  Map, 
  FileText, 
  Settings,
  Leaf,
  Trash2,
  Construction,
  Shield,
  Droplets,
  Wind,
  ChevronDown,
  Filter,
  Search,
  Calendar,
  Send,
  MessageCircle,
  Flag,
  ThumbsUp,
  Eye
} from 'lucide-react';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([
    {
      id: 'RPT-1045',
      title: 'Recycling Bin',
      category: 'Waste & Recycling',
      status: 'Resolved',
      severity: 'Low',
      timestamp: '2025-11-15T14:30:00',
      address: 'Jalan Sultan Ismail, Kuala Lumpur',
      photos: ['https://placehold.co/300x200/2ECC71/FFFFFF?text=Bin'],
      comments: ['Issue resolved by Officer Ahmad', 'Bin replaced on Nov 16']
    },
    {
      id: 'RPT-1046',
      title: 'Road Crack',
      category: 'Road & Infrastructure',
      status: 'In Progress',
      severity: 'Medium',
      timestamp: '2025-11-16T09:15:00',
      address: 'Persiaran KLCC, Kuala Lumpur',
      photos: ['https://placehold.co/300x200/F4D03F/FFFFFF?text=Crack'],
      comments: ['Assigned to Road Maintenance Team']
    },
    {
      id: 'RPT-1047',
      title: 'Drainage Blockage',
      category: 'Water & Drainage',
      status: 'Acknowledged',
      severity: 'High',
      timestamp: '2025-11-16T11:45:00',
      address: 'Lorong Bukit Bintang, Kuala Lumpur',
      photos: ['https://placehold.co/300x200/E74C3C/FFFFFF?text=Drain'],
      comments: ['Acknowledged by Officer Lim']
    }
  ]);
  const [notifications] = useState([
    { id: 1, text: 'Your issue #RPT-1045 has been acknowledged.', time: '2 hours ago', read: false },
    { id: 2, text: 'Team has updated progress on Road Crack.', time: '1 day ago', read: true },
    { id: 3, text: 'Your issue #RPT-1044 has been resolved.', time: '3 days ago', read: true }
  ]);

  // Mock data for categories
  const categories = [
    { id: 1, name: 'Waste & Recycling', icon: Trash2, color: '#2ECC71' },
    { id: 2, name: 'Road & Infrastructure', icon: Construction, color: '#2980B9' },
    { id: 3, name: 'Health & Safety', icon: Shield, color: '#E74C3C' },
    { id: 4, name: 'Environmental Hazards', icon: Wind, color: '#F4D03F' },
    { id: 5, name: 'Water & Drainage', icon: Droplets, color: '#3498DB' }
  ];

  // Mock data for map pins
  const mapPins = [
    { id: 1, lat: 3.1390, lng: 101.6869, status: 'Resolved', severity: 'Low' },
    { id: 2, lat: 3.1502, lng: 101.7128, status: 'In Progress', severity: 'Medium' },
    { id: 3, lat: 3.1119, lng: 101.6662, status: 'Acknowledged', severity: 'High' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Acknowledged': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPinColor = (severity) => {
    switch(severity) {
      case 'High': return '#E74C3C';
      case 'Medium': return '#F4D03F';
      case 'Low': return '#2ECC71';
      default: return '#95A5A6';
    }
  };

  const SplashScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-4">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-green-100 p-4 rounded-full mb-4">
            <Leaf className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">CleanCity Connect</h1>
          <p className="text-gray-600 text-center">Empowering Communities for a Sustainable City</p>
        </div>
        <button 
          onClick={() => setCurrentScreen('login')}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition duration-200"
        >
          Get Started
        </button>
      </div>
    </div>
  );

  const LoginScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Welcome Back</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-gray-600">Remember me</span>
            </label>
            <button 
              onClick={() => setCurrentScreen('forgot')}
              className="text-green-600 hover:text-green-800 text-sm"
            >
              Forgot Password?
            </button>
          </div>
          
          <button 
            onClick={() => {
              setUser({ name: 'Aina' });
              setCurrentScreen('home');
            }}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition duration-200"
          >
            Sign In
          </button>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <button className="w-full bg-red-50 hover:bg-red-100 text-gray-700 font-semibold py-3 px-4 rounded-xl border border-gray-300 transition duration-200 flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
          
          <p className="text-center text-gray-600 mt-4">
            Don't have an account? 
            <button 
              onClick={() => setCurrentScreen('register')}
              className="text-green-600 hover:text-green-800 font-semibold ml-1"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );

  const RegisterScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Account</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Confirm Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Profile Photo</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Click to upload</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <input type="checkbox" id="terms" className="mt-1 mr-2" />
            <label htmlFor="terms" className="text-gray-700">
              I agree with <span className="text-green-600">Terms & Conditions</span> and <span className="text-green-600">Privacy Policy</span>
            </label>
          </div>
          
          <button 
            onClick={() => {
              setUser({ name: 'Aina' });
              setCurrentScreen('home');
            }}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition duration-200"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );

  const HomeScreen = () => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good morning';
      if (hour < 18) return 'Good afternoon';
      return 'Good evening';
    };

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">{getGreeting()}, {user?.name} 🌿</h1>
            <div className="flex space-x-3">
              <button 
                onClick={() => setCurrentScreen('notifications')}
                className="relative p-2 text-gray-600"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-600">
                <User className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <button 
              onClick={() => setCurrentScreen('report-category')}
              className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center"
            >
              <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
              <span className="text-sm font-medium">Report Issue</span>
            </button>
            <button 
              onClick={() => setCurrentScreen('map')}
              className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center"
            >
              <Map className="w-8 h-8 text-blue-500 mb-2" />
              <span className="text-sm font-medium">View Map</span>
            </button>
            <button 
              onClick={() => setCurrentScreen('my-reports')}
              className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center"
            >
              <FileText className="w-8 h-8 text-green-500 mb-2" />
              <span className="text-sm font-medium">My Reports</span>
            </button>
          </div>

          {/* Recent Updates */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Updates</h2>
            <div className="space-y-3">
              {reports.slice(0, 3).map((report) => (
                <div key={report.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    report.status === 'Resolved' ? 'bg-green-500' : 
                    report.status === 'In Progress' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="font-medium">{report.title} — {report.status}</p>
                    <p className="text-sm text-gray-500">{report.address}</p>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <div className="flex justify-around py-2">
            <button 
              onClick={() => setCurrentScreen('home')}
              className="flex flex-col items-center py-2 px-4 text-green-600"
            >
              <Home className="w-6 h-6" />
              <span className="text-xs mt-1">Home</span>
            </button>
            <button 
              onClick={() => setCurrentScreen('map')}
              className="flex flex-col items-center py-2 px-4 text-gray-600"
            >
              <Map className="w-6 h-6" />
              <span className="text-xs mt-1">Map</span>
            </button>
            <button 
              onClick={() => setCurrentScreen('report-category')}
              className="flex flex-col items-center py-2 px-4 text-gray-600"
            >
              <Flag className="w-6 h-6" />
              <span className="text-xs mt-1">Report</span>
            </button>
            <button 
              onClick={() => setCurrentScreen('notifications')}
              className="flex flex-col items-center py-2 px-4 text-gray-600"
            >
              <Bell className="w-6 h-6" />
              <span className="text-xs mt-1">Alerts</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ReportCategoryScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-xl font-bold text-gray-800">Report Issue</h1>
        <p className="text-gray-600">Select a category</p>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setCurrentScreen('report-details')}
                className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center text-center"
              >
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <Icon className="w-8 h-8" style={{ color: category.color }} />
                </div>
                <span className="font-medium">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const ReportDetailsScreen = () => {
    const [severity, setSeverity] = useState('Medium');
    
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm p-4">
          <h1 className="text-xl font-bold text-gray-800">Report Details</h1>
        </div>
        
        <div className="p-4 space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Title</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Brief description"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-32"
              placeholder="Provide details about the issue..."
            ></textarea>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Add Photo (mandatory)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Click to upload</p>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Add Video (optional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Click to upload</p>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Severity</label>
            <div className="grid grid-cols-3 gap-2">
              {['Low', 'Medium', 'High'].map((level) => (
                <button
                  key={level}
                  onClick={() => setSeverity(level)}
                  className={`py-3 px-4 rounded-lg border ${
                    severity === level 
                      ? level === 'High' ? 'bg-red-100 border-red-500 text-red-700' 
                      : level === 'Medium' ? 'bg-yellow-100 border-yellow-500 text-yellow-700'
                      : 'bg-green-100 border-green-500 text-green-700'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          
          <button 
            onClick={() => setCurrentScreen('report-location')}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition duration-200"
          >
            Continue
          </button>
        </div>
      </div>
    );
  };

  const ReportLocationScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-xl font-bold text-gray-800">Tag Location</h1>
      </div>
      
      <div className="p-4">
        <div className="bg-gray-200 rounded-xl h-64 mb-4 flex items-center justify-center">
          <MapPin className="w-16 h-16 text-red-500" />
          <div className="absolute bg-white p-2 rounded-full shadow-lg">
            <MapPin className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center mb-2">
            <MapPin className="w-5 h-5 text-gray-500 mr-2" />
            <span className="text-gray-700 font-medium">Detected Location</span>
          </div>
          <p className="text-gray-600">Jalan Sultan Ismail, Kuala Lumpur</p>
          <button className="text-green-600 hover:text-green-800 text-sm mt-2 flex items-center">
            <span>Use current location</span>
            <ChevronDown className="w-4 h-4 ml-1" />
          </button>
        </div>
        
        <button 
          onClick={() => setCurrentScreen('report-confirm')}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl mt-6 transition duration-200"
        >
          Submit Report
        </button>
      </div>
    </div>
  );

  const ReportConfirmScreen = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-xl font-bold text-gray-800">Report Submitted!</h1>
      </div>
      
      <div className="flex-1 p-4">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="text-center mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
            <p className="text-gray-600">Your report has been submitted successfully</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Report ID:</span>
              <span className="font-medium">RPT-1048</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Submitted:</span>
              <span className="font-medium">Nov 16, 2025 at 3:45 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Category:</span>
              <span className="font-medium">Waste & Recycling</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Response:</span>
              <span className="font-medium text-green-600">Within 24 hours</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => setCurrentScreen('home')}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition duration-200"
        >
          Back to Home
        </button>
      </div>
    </div>
  );

  const MapScreen = () => {
    const [selectedPin, setSelectedPin] = useState(null);
    
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm p-4">
          <h1 className="text-xl font-bold text-gray-800">City Map</h1>
        </div>
        
        <div className="p-4">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-800">Filters</h2>
              <Filter className="w-5 h-5 text-gray-500" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="py-2 px-3 bg-gray-100 rounded-lg text-sm">All Categories</button>
              <button className="py-2 px-3 bg-gray-100 rounded-lg text-sm">All Status</button>
              <button className="py-2 px-3 bg-gray-100 rounded-lg text-sm">All Dates</button>
              <button className="py-2 px-3 bg-gray-100 rounded-lg text-sm">All Severity</button>
            </div>
          </div>
          
          {/* Map */}
          <div className="bg-gray-200 rounded-xl h-96 relative mb-4">
            {mapPins.map((pin) => (
              <div 
                key={pin.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ 
                  left: `${50 + (pin.lng - 101.6869) * 100}%`, 
                  top: `${50 - (pin.lat - 3.1390) * 100}%` 
                }}
                onClick={() => setSelectedPin(pin)}
              >
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white shadow-lg"
                  style={{ backgroundColor: getPinColor(pin.severity) }}
                ></div>
              </div>
            ))}
          </div>
          
          {/* Selected Pin Details */}
          {selectedPin && (
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-gray-800">Road Crack</h3>
                <button 
                  onClick={() => setSelectedPin(null)}
                  className="text-gray-500"
                >
                  ✕
                </button>
              </div>
              <div className="flex space-x-2 mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor('In Progress')}`}>
                  In Progress
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor('Medium')}`}>
                  Medium
                </span>
              </div>
              <img 
                src="https://placehold.co/300x200/F4D03F/FFFFFF?text=Crack" 
                alt="Issue" 
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <p className="text-sm text-gray-600 mb-2">Reported: Nov 16, 2025 at 9:15 AM</p>
              <p className="text-sm text-gray-600 mb-3">Persiaran KLCC, Kuala Lumpur</p>
              <div className="bg-blue-50 p-3 rounded-lg mb-3">
                <p className="text-sm text-blue-800">Assigned to Road Maintenance Team</p>
              </div>
              <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
                View Details
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const MyReportsScreen = () => {
    const [activeTab, setActiveTab] = useState('Open');
    
    const tabReports = {
      Open: reports.filter(r => r.status !== 'Resolved'),
      'In Progress': reports.filter(r => r.status === 'In Progress'),
      Resolved: reports.filter(r => r.status === 'Resolved')
    };
    
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm p-4">
          <h1 className="text-xl font-bold text-gray-800">My Reports</h1>
        </div>
        
        <div className="p-4">
          {/* Tabs */}
          <div className="flex space-x-2 mb-6">
            {['Open', 'In Progress', 'Resolved'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                  activeTab === tab 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          {/* Reports List */}
          <div className="space-y-4">
            {tabReports[activeTab].map((report) => (
              <div key={report.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-start mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                    report.category === 'Waste & Recycling' ? 'bg-green-100' :
                    report.category === 'Road & Infrastructure' ? 'bg-blue-100' :
                    report.category === 'Health & Safety' ? 'bg-red-100' :
                    report.category === 'Environmental Hazards' ? 'bg-yellow-100' : 'bg-indigo-100'
                  }`}>
                    {report.category === 'Waste & Recycling' && <Trash2 className="w-5 h-5 text-green-600" />}
                    {report.category === 'Road & Infrastructure' && <Construction className="w-5 h-5 text-blue-600" />}
                    {report.category === 'Health & Safety' && <Shield className="w-5 h-5 text-red-600" />}
                    {report.category === 'Environmental Hazards' && <Wind className="w-5 h-5 text-yellow-600" />}
                    {report.category === 'Water & Drainage' && <Droplets className="w-5 h-5 text-indigo-600" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{report.title}</h3>
                    <p className="text-sm text-gray-600">{report.address}</p>
                  </div>
                  <div className="ml-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {new Date(report.timestamp).toLocaleDateString()}
                  </span>
                  <button 
                    onClick={() => setCurrentScreen('report-detail')}
                    className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
                  >
                    View Details
                    <Eye className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const ReportDetailScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-xl font-bold text-gray-800">Report Details</h1>
      </div>
      
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-bold text-gray-800">Road Crack</h2>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor('In Progress')}`}>
              In Progress
            </span>
          </div>
          
          <img 
            src="https://placehold.co/600x400/F4D03F/FFFFFF?text=Road+Crack" 
            alt="Issue" 
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Report ID:</span>
              <span className="font-medium">RPT-1046</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Reported:</span>
              <span className="font-medium">Nov 16, 2025 at 9:15 AM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Category:</span>
              <span className="font-medium">Road & Infrastructure</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Address:</span>
              <span className="font-medium text-right">Persiaran KLCC, Kuala Lumpur</span>
            </div>
          </div>
          
          <h3 className="font-bold text-gray-800 mb-3">Timeline</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
                <Flag className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Reported</p>
                <p className="text-sm text-gray-600">Nov 16, 2025 at 9:15 AM</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Acknowledged by Officer Lim</p>
                <p className="text-sm text-gray-600">Nov 16, 2025 at 10:30 AM</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3 mt-1">
                <Construction className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium">In Progress</p>
                <p className="text-sm text-gray-600">Nov 16, 2025 at 2:15 PM</p>
                <p className="text-sm text-gray-700 mt-1">Assigned to Road Maintenance Team</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="font-bold text-gray-800 mb-3">Comments</h3>
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between mb-1">
                <span className="font-medium">Officer Lim</span>
                <span className="text-xs text-gray-500">Today, 2:15 PM</span>
              </div>
              <p className="text-gray-700">We've assigned this to our road maintenance team. They'll be on site within 24 hours.</p>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex justify-between mb-1">
                <span className="font-medium">You</span>
                <span className="text-xs text-gray-500">Today, 11:30 AM</span>
              </div>
              <p className="text-gray-700">Thank you for the quick response!</p>
            </div>
          </div>
          
          <div className="mt-4 flex">
            <input 
              type="text" 
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Add a comment..."
            />
            <button className="bg-green-500 text-white px-4 py-2 rounded-r-lg">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const NotificationsScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-xl font-bold text-gray-800">Notifications</h1>
      </div>
      
      <div className="p-4">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className={`bg-white rounded-xl shadow-sm p-4 mb-4 ${
              !notification.read ? 'border-l-4 border-green-500' : ''
            }`}
          >
            <p className="text-gray-800">{notification.text}</p>
            <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const AdminDashboard = () => {
    const [selectedReport, setSelectedReport] = useState(reports[0]);
    
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm p-4">
          <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
        
        <div className="p-4">
          {/* Filters and Stats */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <button className="py-2 px-3 bg-gray-100 rounded-lg text-sm">All Categories</button>
              <button className="py-2 px-3 bg-gray-100 rounded-lg text-sm">All Urgency</button>
              <button className="py-2 px-3 bg-gray-100 rounded-lg text-sm">This Week</button>
              <button className="py-2 px-3 bg-gray-100 rounded-lg text-sm">Sort: Newest</button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-700">Total Reports</p>
                <p className="text-2xl font-bold text-green-800">24</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-sm text-yellow-700">In Progress</p>
                <p className="text-2xl font-bold text-yellow-800">8</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700">Resolved</p>
                <p className="text-2xl font-bold text-blue-800">16</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Reports List */}
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Latest Reports</h2>
              <div className="space-y-3">
                {reports.map((report) => (
                  <div 
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`bg-white rounded-xl shadow-sm p-4 cursor-pointer ${
                      selectedReport?.id === report.id ? 'ring-2 ring-green-500' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800">{report.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(report.severity)}`}>
                        {report.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{report.address}</p>
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(report.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Report Detail and Actions */}
            <div className="md:w-96">
              {selectedReport && (
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">{selectedReport.title}</h2>
                  
                  <div className="mb-4">
                    <img 
                      src={selectedReport.photos[0]} 
                      alt="Report" 
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID:</span>
                      <span className="font-medium">{selectedReport.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{selectedReport.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Address:</span>
                      <span className="font-medium text-right">{selectedReport.address}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Status</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Acknowledged</option>
                      <option selected>In Progress</option>
                      <option>Resolved</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Assign Officer</label>
                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
                      Assign Officer
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Comments</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24"
                      placeholder="Add comments for the citizen..."
                    ></textarea>
                  </div>
                  
                  <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
                    Update Report
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render current screen
  const renderScreen = () => {
    switch(currentScreen) {
      case 'splash': return <SplashScreen />;
      case 'login': return <LoginScreen />;
      case 'register': return <RegisterScreen />;
      case 'home': return <HomeScreen />;
      case 'report-category': return <ReportCategoryScreen />;
      case 'report-details': return <ReportDetailsScreen />;
      case 'report-location': return <ReportLocationScreen />;
      case 'report-confirm': return <ReportConfirmScreen />;
      case 'map': return <MapScreen />;
      case 'my-reports': return <MyReportsScreen />;
      case 'report-detail': return <ReportDetailScreen />;
      case 'notifications': return <NotificationsScreen />;
      case 'admin': return <AdminDashboard />;
      default: return <SplashScreen />;
    }
  };

  return (
    <div className="font-sans">
      {renderScreen()}
      
      {/* Admin Access Button (for demo) */}
      {currentScreen !== 'admin' && (
        <button 
          onClick={() => setCurrentScreen('admin')}
          className="fixed bottom-20 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg z-50"
        >
          <Settings className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default App;
