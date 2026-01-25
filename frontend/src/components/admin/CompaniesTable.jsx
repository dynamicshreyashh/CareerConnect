import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constants";
import { setCompanies } from "@/redux/companySlice";
import { toast } from "sonner";

const CompaniesTable = () => {
  const { companies, searchCompanyByText } = useSelector(
    (store) => store.company
  );
  const [filterCompany, setFilterCompany] = useState(companies);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const deleteCompanyHandler = async (companyId, companyName) => {
    if (!window.confirm(`Are you sure you want to delete "${companyName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await axios.delete(
        `${COMPANY_API_END_POINT}/delete/${companyId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        // Remove the deleted company from the list
        const updatedCompanies = companies.filter(
          (company) => company._id !== companyId
        );
        dispatch(setCompanies(updatedCompanies));
        toast.success("Company deleted successfully");
      } else {
        toast.error(res.data.message || "Failed to delete company");
      }
    } catch (error) {
      console.error("Delete company error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete company";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const filteredCompany =
      companies.length >= 0 &&
      companies.filter((company) => {
        if (!searchCompanyByText) {
          return true;
        }
        return company?.name
          .toLowerCase()
          .includes(searchCompanyByText.toLowerCase());
      });
    setFilterCompany(filteredCompany);
  }, [companies, searchCompanyByText]);
  return (
    <div>
      <Table>
        <TableCaption>List of your registered Companies</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterCompany &&
            filterCompany.map((company) => (
              <tr key={company._id}>
                <TableCell>
                  <Avatar>
                    <AvatarImage
                      className="w-full h-full object-cover"
                      src={company.logo}
                    />
                  </Avatar>
                </TableCell>
                <TableCell>{company.name}</TableCell>
                <TableCell>{company.createdAt.split("T")[0]}</TableCell>
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="cursor-pointer hover:bg-gray-100 rounded p-1">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-2">
                      <div className="flex flex-col gap-2">
                        <div
                          onClick={() =>
                            navigate(`/admin/companies/${company._id}`)
                          }
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span>Edit</span>
                        </div>
                        <div
                          onClick={() =>
                            deleteCompanyHandler(company._id, company.name)
                          }
                          className="flex items-center gap-2 cursor-pointer hover:bg-red-50 p-2 rounded text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </tr>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompaniesTable;
