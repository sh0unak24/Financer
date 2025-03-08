import React, { useEffect, useState } from "react";
import moment from "moment";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import axios from "axios";
import { toast } from "react-toastify";

const TableData = ({ data, onRefresh }) => {
  const [show, setShow] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [currId, setCurrId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    transactionType: "",
  });

  const toastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  useEffect(() => {
    if (data && Array.isArray(data)) {
      console.log("useEffect - Received data:", data);
      setTransactions([...data]);
    }
  }, [data]);

  const handleEditClick = (itemKey) => {
    const editTran = transactions.find((item) => item._id === itemKey);
    if (editTran) {
      console.log("Editing transaction:", editTran);
      setCurrId(itemKey);
      setEditingTransaction(editTran);
      setValues({
        title: editTran.title || "",
        amount: editTran.amount ? editTran.amount.toString() : "",
        description: editTran.description || "",
        category: editTran.category || "",
        date: editTran.date ? moment(editTran.date).format("YYYY-MM-DD") : "",
        transactionType: editTran.transactionType || "",
      });
      setShow(true);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
  
    if (!values.title || !values.amount || !values.category || !values.transactionType || !values.date) {
      toast.error("Please fill in all required fields", toastOptions);
      return;
    }
  
    try {
      setLoading(true);
  
      const payload = {
        ...values,
        amount: parseFloat(values.amount),
      };
  
      const response = await axios.put(
        `http://localhost:3000/api/v1/transactions/updateTransaction/${currId}`,
        payload,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
  
      if (response.data.success) {
        toast.success("Transaction updated successfully!", toastOptions);
  
        // 🔹 Update local state to reflect changes immediately
        setTransactions((prevTransactions) =>
          prevTransactions.map((transaction) =>
            transaction._id === currId ? { ...transaction, ...payload } : transaction
          )
        );
  
        setShow(false);
        setEditingTransaction(null);
        setCurrId(null);
  
        // 🔹 Ensure backend sync
        if (onRefresh) {
          await onRefresh();
        }
      } else {
        toast.error(response.data.message || "Failed to update transaction", toastOptions);
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error(error.response?.data?.message || "Failed to update transaction", toastOptions);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (itemKey) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;

    try {
      setLoading(true);
      const response = await axios.delete(
        `http://localhost:3000/api/v1/transactions/deleteTransaction/${itemKey}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        toast.success("Transaction deleted successfully!", toastOptions);
        if (onRefresh) await onRefresh();
      } else {
        toast.error(response.data.message || "Failed to delete transaction", toastOptions);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete transaction", toastOptions);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setShow(false);
    setEditingTransaction(null);
    setCurrId(null);
  };

  return (
    <>
      <div className="overflow-x-auto mt-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#e8d5c4] text-[#429ab9]">
              <th className="p-3">Date</th>
              <th className="p-3">Title</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Type</th>
              <th className="p-3">Category</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody className="text-[#429ab9]">
            {transactions.map((item) => (
              <tr key={item._id} className="border-b">
                <td className="p-3">{item.date ? moment(item.date).format("YYYY-MM-DD") : "N/A"}</td>
                <td className="p-3">{item.title || "N/A"}</td>
                <td className="p-3">${item.amount || 0}</td>
                <td className="p-3">{item.transactionType || "N/A"}</td>
                <td className="p-3">{item.category || "N/A"}</td>
                <td className="p-3 flex justify-center gap-4">
                  <EditNoteIcon
                    className="text-blue-500 cursor-pointer"
                    onClick={() => handleEditClick(item._id)}
                  />
                  <DeleteForeverIcon
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDeleteClick(item._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#c6b295] p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4 text-[#429ab9]">Edit Transaction</h2>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div>
                <label className="block text-[#429ab9]">Title</label>
                <input
                  type="text"
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-[#429ab9]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#429ab9]">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={values.amount}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-[#429ab9]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#429ab9]">Category</label>
                <select
                  name="category"
                  value={values.category}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-[#429ab9]"
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
              </div>
              <div>
                <label className="block text-[#429ab9]">Description</label>
                <input
                  type="text"
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-[#429ab9]"
                />
              </div>
              <div>
                <label className="block text-[#429ab9]">Transaction Type</label>
                <select
                  name="transactionType"
                  value={values.transactionType}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-[#429ab9]"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Expense">Expense</option>
                  <option value="Credit">Credit</option>
                </select>
              </div>
              <div>
                <label className="block text-[#429ab9]">Date</label>
                <input
                  type="date"
                  name="date"
                  value={values.date}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-[#429ab9]"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-400 px-4 py-2 rounded text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#429ab9] px-4 py-2 rounded text-white"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TableData;