import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const Appbar = ({ userFirstName, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout(); // Call the logout function passed from Dashboard
  };

  return (
    <div className="shadow h-14 flex justify-between bg-[#e8d5c4] text-[#429ab9]">
      <div className="flex flex-col justify-center h-full ml-4 font-semibold">
        PayTrack
      </div>
      <div className="flex items-center mr-4">
        <div className="mr-4">
          Hello
        </div>
        <div className="rounded-full h-9 w-9 bg-slate-200 flex justify-center mt-1 mr-2">
          <div className="flex flex-col justify-center h-full text-xl">
            {userFirstName ? userFirstName[0].toUpperCase() : "U"} {/* Display first letter */}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="bg-[#429ab9] text-white px-3 py-1 rounded hover:bg-[#387b94]"
        >
          Logout
        </button>
      </div>
    </div>
  );
};