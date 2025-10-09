import { useGetQuery } from '../../../../api/apiSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Building, Calendar, CheckCircle, CircleDollarSign, ClipboardList, CreditCard, DollarSign, Home, Phone, Settings, User, Wallet, XCircle } from 'lucide-react';
import { FaChair } from 'react-icons/fa';

const IndividualDetails = () => {
  const { uuid } = useParams();
  const navigate = useNavigate()
  const { data: response, isLoading, isError } = useGetQuery({
    path: `/admin/individuals/${uuid}`,
  });

  const details = response?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl text-gray-600 animate-pulse">Loading individual details...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl text-red-600">Failed to load individual details. Please try again.</p>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl text-gray-500">No details found for this individual.</p>
      </div>
    );
  }

  const statusClass = (status) => (status ? 'text-green-500' : 'text-red-500');

  const infoSections = [
    {
      title: "User Information",
      icon: User,
       bgColor: "custom-Background",
      textColor: "text-white",
      items: [
        { label: "Name", value: details.name, icon: CreditCard },
        { label: "CNIC", value: details.cnic, icon: CreditCard },
        { label: "Contact", value: details.contact_no, icon: Phone },
        { label: "Address", value: details.address, icon: Home },
        { label: "Registration Date", value: new Date(details.date_of_registration).toLocaleDateString(), icon: Calendar },
      ]
    },
    {
      title: "Workspace Details",
      icon: Building,
      bgColor: "custom-Background",
      textColor: "text-white",
      items: [
        { label: "Total Seats", value: details.workspace_seats, icon: FaChair },
        { label: "Per Seat Price", value: `$${details.per_seat_price}`, icon: DollarSign },
        { label: "Per Room Price", value: `$${details.per_room_price}`, icon: DollarSign },
        { 
          label: "Advance Security", 
          value: details.advance_security.toUpperCase(), 
          icon: ClipboardList, 
          status: details.advance_security === 'paid' 
        },
      ]
    },
    {
      title: "Payment & Status",
      icon: Wallet,
      bgColor: "custom-Background",
      textColor: "text-white",
      items: [
        { label: "Total Rent", value: `$${details.total_rent}`, icon: CircleDollarSign },
        { label: "Rent Paid", value: `$${details.rent_paid}`, icon: CircleDollarSign },
        { 
          label: "Renew Registration", 
          value: details.renew_registration ? 'Yes' : 'No', 
          icon: details.renew_registration ? CheckCircle : XCircle,
          status: details.renew_registration 
        },
        { 
          label: "Cancel Registration", 
          value: details.cancel_registration ? 'Yes' : 'No', 
          icon: details.cancel_registration ? CheckCircle : XCircle,
          status: details.cancel_registration 
        },
      ]
    }
  ];

  return (
    <div className="w-11/12 min-h-screen p-4 mx-auto sm:p-6 lg:p-8">
      <div className="p-6 sm:p-8">
         <button 
          onClick={() => navigate(-1)} 
          className="flex items-center mb-4 text-[#014376] hover:underline"
        >
          <ArrowLeft className="mr-2" /> Exit
        </button>
        <div className="flex items-center justify-between pb-4 mb-6 border-b">
          <h1 className="text-3xl font-bold text-gray-800">Individual Workspace Details</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {infoSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="p-6 transition-shadow duration-300 border border-gray-200 rounded-lg shadow-sm bg-gray-50 hover:shadow-md">
              <div className="flex items-center mb-4">
                <div className={`p-3 mr-3 rounded-full ${section.bgColor} ${section.textColor}`}>
                  <section.icon />
                </div>
                <h2 className="text-xl font-semibold text-gray-700">{section.title}</h2>
              </div>
              <ul className="space-y-3 text-gray-600">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-center">
                    <item.icon size={18} className={`mr-3 text-gray-400 ${item.status === true ? 'text-green-500' : item.status === false ? 'text-red-500' : ''}`} />
                    <span className="font-medium text-gray-800">{item.label}:</span> 
                    <span className={`ml-2 ${item.status === true ? 'text-green-500 font-medium' : item.status === false ? 'text-red-500 font-medium' : ''}`}>
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndividualDetails;