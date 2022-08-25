import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { park } from "../../store/parking/actions";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  vehicleSize: yup.string().required("vehicle size is required"),
  entryPoint: yup.string().required("entrypoint is required"),
  plateNumber: yup.string().required("plate number is required"),
});

const Form = () => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: "all",
    resolver: yupResolver(schema),
  });

  const handleParking = async (data) => {
    if (isValid) {
      try {
        await dispatch(park(data));
        reset();
      } catch (error) {
        reset();
        toast.warn(error, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    }
  };

  return (
    <div className="mb-5 py-5 border-b">
      <form onSubmit={handleSubmit(handleParking)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
              Select vehicle size
            </label>
            <div className="bg-gray-700 p-3 rounded-lg">
              <select
                {...register("vehicleSize")}
                id="vehicle-size"
                className="bg-gray-700 w-full block focus:outline-none"
              >
                <option value={""}>Vehicle size</option>
                <option value="S">Small</option>
                <option value="M">Medium</option>
                <option value="L">Large</option>
              </select>
            </div>
            <span className="text-xs text-red-600">{errors.vehicleSize?.message}</span>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
              Select an entry point
            </label>
            <div className="bg-gray-700 p-3 rounded-lg">
              <select
                {...register("entryPoint")}
                id="entry-point"
                className="bg-gray-700 w-full block focus:outline-none"
              >
                <option value={""}>Entry point</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>
            <span className="text-xs text-red-600">{errors.entryPoint?.message}</span>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
              Enter Plate Number
            </label>
            <div className="bg-gray-700 px-3 rounded-lg">
              <div className="grid grid-cols-3">
                <input
                  {...register("plateNumber")}
                  placeholder="Ex: 382MSD"
                  className="bg-gray-700 px-1 py-2.5 focus:outline-none col-span-2"
                />
                <button className="cursor-pointer text-md">Submit</button>
              </div>
            </div>
            <span className="text-xs text-red-600">{errors.plateNumber?.message}</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form;

