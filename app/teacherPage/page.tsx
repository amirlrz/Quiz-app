"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useQuestionsHooks from "../hooks/useQuestionsHooks";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import * as React from "react";
import { DataGrid, GridColDef, GridDeleteIcon, GridPaginationModel } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import AdminEditOperations from "../components/adminOperations/editModal";
import AdminDeleteOperations from "../components/adminOperations/deleteModal";
import CircularProgress from "@mui/material/CircularProgress";
import AdminAddOperations from "../components/adminOperations/addModal";
import toast from "react-hot-toast";

interface Option {
  text: string;
  is_correct: boolean;
}
interface DetailType {
  id: number;
  text: string;
  category: string;
  lesson_number: number;
  options:Option[];
}
export default function TeacherAddQuestionPage() {
  const { getQuestions } = useQuestionsHooks();

  const {data ,isLoading} = useQuery({
    queryKey:["getdata"],
    queryFn :getQuestions
  })
//console.log("data" , data);

  const categories = Array.from(new Set(data?.map((q) => q.category) ?? []));
  const lessonNumbers = Array.from(new Set(data?.map((q) => q.lesson_number) ?? []));
  const [addOpenModal, setaddOpenModal] = React.useState(false);
  const [EditModal, setEditModal] = React.useState(false);
  const [DeleteModal, setDeleteModal] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [FilterData, setFilterData] = useState<DetailType[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<number>(0);
  const [SelectedRow, setSelectedRow] = useState<DetailType>();
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 10,
    page: 0,
  });

  React.useEffect(() => {
    if (!data) return;
  
    const filtered = data.filter(q =>
      (!selectedCategory || q.category === selectedCategory) &&
      (!selectedLesson || q.lesson_number === selectedLesson)
    );
  
    setFilterData(filtered);
  
    console.log("rendered" , filtered);
  }, [data, selectedCategory, selectedLesson]);
  
  

  const columns: GridColDef[] = [
    //{ field: "order_number", headerName: "ردیف", width: 70 },
    { field: "text", headerName: "سوال", width: 190  },
    {
      field: "actions",
      headerName: "عملیات",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div style={{ display: "flex", gap: 8 }}>
          <IconButton
           onClick={() => {
            if (selectedCategory && selectedLesson) {
            setSelectedRow(params.row);
            setEditModal(true);
            } else {
              toast.error("لطفا فیلتر انتخاب کنید");
            }
          }}
           >
            <EditIcon color="primary" />
            
          </IconButton>
  
          <IconButton 
          onClick={() => {
            setSelectedRow(params.row);
            setDeleteModal(true);
          }}
          >
            <GridDeleteIcon color="error" />
          </IconButton>
        </div>
      ),
    },

  ];

  //console.log("categories", categories);
  console.log("category" ,selectedCategory);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start bg-gray-100 p-4 md:p-8">
    {/* کارت فیلترها */}
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <FormControl
        sx={{ direction: "rtl" }}
        fullWidth
        className="bg-white rounded-xl shadow p-2"
      >
        <InputLabel sx={{ textAlign: "right" }}>شماره درس</InputLabel>
        <Select
          value={selectedLesson}
          onChange={(e) => setSelectedLesson(Number(e.target.value))}
          className="bg-white rounded-xl"
        >
          {lessonNumbers.map((ln) => (
            <MenuItem key={ln} value={ln}>{ln}</MenuItem>
          ))}
        </Select>
      </FormControl>
  
      <FormControl 
        sx={{ direction: "rtl" }}
        fullWidth
        className="bg-white rounded-xl shadow p-2"
      >
        <InputLabel sx={{ textAlign: "right" }}>نام درس</InputLabel>
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white rounded-xl"
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  
    {/* کارت اصلی با DataGrid */}
    <div className="w-full bg-white rounded-2xl shadow-lg p-4 space-y-4">
      {/* هدر و دکمه Add */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-2">
        <h2 className="text-2xl font-bold text-gray-700">لیست سوالات</h2>
        <button
         onClick={() => {
          if (selectedCategory && selectedLesson) {
            setaddOpenModal(true);
          } else {
            toast.error("لطفا فیلتر انتخاب کنید");
          }
        }}
        
          className="bg-green-600 text-white px-5 py-2 rounded-xl shadow hover:bg-green-700 transition-all duration-200 w-full md:w-auto"
        >
          اضافه کردن سوال
        </button>
      </div>
  
      {/* DataGrid */}
      <div className="w-full flex justify-center" >
      {isLoading ? <CircularProgress/>
      :
        <DataGrid
          rows={FilterData ?? []}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          //checkboxSelection
          autoHeight
          loading={isLoading}
          sx={{
            width: "100%", // مهم برای موبایل
            direction: "rtl",
            "& .MuiDataGrid-cell": {
              textAlign: "right",
              justifyContent: "flex-end",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              textAlign: "right",
            },
          }}
        />
      }
      </div>

      <Dialog
        open={addOpenModal}
        fullScreen
        PaperProps={{ sx: { backgroundColor: "rgba(0,0,0,0.5)" } }}
      >
        <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <AdminAddOperations Category={selectedCategory} Lesson={selectedLesson}  onClose={() => setaddOpenModal(false)} />
        </DialogContent>
      </Dialog>
      <Dialog
        open={EditModal}
        fullScreen
        PaperProps={{ sx: { backgroundColor: "rgba(0,0,0,0.5)" } }}
      >
        <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        {SelectedRow && (
  <AdminEditOperations
    detail={SelectedRow}
    category={selectedCategory}
    Lesson={selectedLesson}
    onClose={() => setEditModal(false)}
  />
)}
      
        </DialogContent>
      </Dialog>
      <Dialog
        open={DeleteModal}
        fullScreen
        PaperProps={{ sx: { backgroundColor: "rgba(0,0,0,0.5)" } }}
      >
        <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        {SelectedRow && (
  <AdminDeleteOperations detail={SelectedRow} onClose={() => setDeleteModal(false)} />
)}
        </DialogContent>
      </Dialog>
    </div>
  </div>
  );
}
