import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Appbar } from "../components/Appbar";
import { Button } from "../components/Button";
import axios from "axios";
import { toast } from "react-toastify";
import TableData from "./TableData"; 
import { jwtDecode } from "jwt-decode";

export const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userFirstName, setUserFirstName] = useState("");
  const [user, setUser] = useState(null);
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    category: "",
    description: "",
    transactionType: "Expense", 
    date: new Date().toISOString().split("T")[0],
  });

  const navigate = useNavigate();
  const toastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please sign in");
      navigate("/signin", { replace: true });
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken) {
        setUser(decodedToken);
        setUserFirstName(decodedToken.firstName || "User");
      }
    } catch (error) {
      console.error("Invalid Token:", error);
      toast.error("Invalid session, please sign in again");
      navigate("/signin", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please sign in to view transactions", toastOptions);
      navigate("/signin");
      return;
    }

    try {
      const transactionsResponse = await axios.post(
        "http://localhost:3000/api/v1/transactions/getTransactions",
        { type: "all" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Transactions Response:", transactionsResponse.data); // Debug
      if (transactionsResponse.data.success) {
        setExpenses(transactionsResponse.data.transactions);
      } else {
        toast.error(
          transactionsResponse.data.message || "Failed to fetch transactions",
          toastOptions
        );
      }
    } catch (error) {
      console.error("Fetch Error:", error.response?.status, error.response?.data || error.message);
      toast.error("Failed to fetch data", toastOptions);
      navigate("/signin");
    }
  };

  const handleAddExpense = async () => {
    if (!newExpense.title || !newExpense.amount || !newExpense.category) {
      toast.error("Please fill in all required fields", toastOptions);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("User not authenticated", toastOptions);
        navigate("/signin");
        return;
      }

      const payload = {
        title: newExpense.title,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        description: newExpense.description || "",
        transactionType: newExpense.transactionType,
        date: newExpense.date,
      };

      const response = await axios.post(
        "http://localhost:3000/api/v1/transactions/addTransaction",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Add Response:", response.data); // Debug
      if (response.data.success) {
        toast.success("Expense added successfully!", toastOptions);
        await fetchTransactions(); // Refetch to sync with backend
        setShowForm(false);
        setNewExpense({
          title: "",
          amount: "",
          category: "",
          description: "",
          transactionType: "Expense",
          date: new Date().toISOString().split("T")[0],
        });
      } else {
        toast.error(response.data.message || "Failed to add expense", toastOptions);
      }
    } catch (error) {
      console.error("Add Expense Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to add expense", toastOptions);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token
    navigate("/signin", { replace: true }); // Immediate navigation
    toast.success("Logged out successfully!", toastOptions); // Toast after navigation
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#e8d5c4] text-[#429ab9]">
      <Appbar userFirstName={userFirstName} onLogout={handleLogout} />

      <div className="pt-10 w-auto mx-auto">
        <Button
          label="Add New"
          onClick={() => setShowForm(true)}
          className="w-auto px-4 py-2 bg-[#429ab9] text-white hover:bg-[#387b94]"
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-[#c6b295] p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-center font-semibold text-lg mb-4 text-[#429ab9]">Add Expense</h2>

            <input
              type="text"
              placeholder="Title"
              value={newExpense.title}
              onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
              className="w-full p-2 mb-3 border rounded text-[#429ab9]"
            />

            <input
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              className="w-full p-2 mb-3 border rounded text-[#429ab9]"
            />

            <select
              value={newExpense.transactionType}
              onChange={(e) => setNewExpense({ ...newExpense, transactionType: e.target.value })}
              className="w-full p-2 mb-3 border rounded text-[#429ab9]"
            >
              <option value="Expense">Expense</option>
              <option value="Credit">Credit</option>
            </select>

            <input
              type="date"
              value={newExpense.date}
              onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
              className="w-full p-2 mb-3 border rounded text-[#429ab9]"
            />

            <select
              name="category"
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              className="w-full p-2 mb-3 border rounded text-[#429ab9]"
              required
            >
              <option value="">Select Category</option>
              <option value="Groceries">Groceries</option>
              <option value="Rent">Rent</option>
              <option value="Salary">Salary</option>
              <option value="Tip">Tip</option>
              <option value="Food">Food</option>
              <option value="Medical">Medical</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Transportation">Transportation</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="text"
              placeholder="Description"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              className="w-full p-2 mb-3 border rounded text-[#429ab9]"
            />

            <div className="flex justify-between">
              <Button
                label="Cancel"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              />
              <Button
                label={loading ? "Adding..." : "Add Expense"}
                onClick={handleAddExpense}
                disabled={loading}
                className="bg-[#429ab9] text-white px-4 py-2 rounded hover:bg-[#387b94]"
              />
            </div>
          </div>
        </div>
      )}

      <div className="mt-10 w-full flex justify-center">
        {expenses.length > 0 ? (
          <TableData data={expenses} onRefresh={fetchTransactions} />
        ) : (
          <p className="text-center py-4 text-[#429ab9]">Loading transactions...</p>
        )}
      </div>
    </div>
  );
};