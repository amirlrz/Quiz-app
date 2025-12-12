import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  category: "",
  lesson_number: 0,
  lesson_season : 0
};

const CategorySlice = createSlice({
  name: "teacherFilterData",
  initialState,
  reducers: {
    setcategory: (state, action) => {
      state.category = action.payload;
    },
    setlesson_number: (state, action) => {
      state.lesson_number = action.payload;
    },
    setlesson_season: (state, action) => {
      state.lesson_season = action.payload;
    },
  },
});

export const { setcategory, setlesson_number ,setlesson_season } = CategorySlice.actions;
export default CategorySlice.reducer;
