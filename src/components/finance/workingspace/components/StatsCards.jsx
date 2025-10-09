/* eslint-disable react/prop-types */

const StatsCards = ({icon , label, value , index}) => {
  return (
        <div className="4 mb-6 ">
      
          <div key={index} className="p-6 bg-white rounded-lg shadow-md ">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <img src={icon} alt="" />
              </div>
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            </div>
          </div>
       
      </div>
  )
}

export default StatsCards
