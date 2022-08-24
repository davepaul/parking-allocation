import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { unPark } from "../../store/parking/actions";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const Map = () => {
  const dispatch = useDispatch();
  const { parking } = useSelector((state) => state);

  const unParkVehicle = async (data) => {
    try {
      let price = await dispatch(unPark(data));
      toast(`Total charges(${data.plateNumber}): PHP ${price} `, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {parking.parkingMap.map((item, key) => (
          <div key={key}>
            <div className="text-center mb-5">{item.entryPoint}</div>
            {item.parkingSpots.map((parkingSpot, parkingKey) => (
              <div
                key={`${key} - ${parkingKey}`}
                className={`${
                  !parkingSpot.timestamp ? "bg-green-400" : "bg-red-400"
                } p-2 rounded-lg mb-3`}
              >
                <div className="text-center">{parkingSpot.slotNumber}</div>
                <div className="text-xs text-center">
                  {!parkingSpot.timestamp ? "Vacant" : "Occupied"}{" "}
                  {!!parkingSpot.timestamp && `(${parkingSpot.vehicle})`}
                </div>
                <div className="text-xs text-center">Slot Size: {parkingSpot.slotSize}</div>
                {!!parkingSpot.timestamp ? (
                  <div className="text-xs text-center">
                    <button
                      className="mx-5 mt-2 "
                      onClick={() =>
                        unParkVehicle({
                          vehicleSize: parkingSpot.slotSize,
                          entryPoint: item.entryPoint,
                          plateNumber: parkingSpot.vehicle,
                          timestamp: parkingSpot.timestamp,
                        })
                      }
                    >
                      UNPARK
                    </button>
                  </div>
                ) : (
                  <div className="text-center">-</div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Map;

