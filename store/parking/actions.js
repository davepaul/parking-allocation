import * as types from "./types";
import dayjs from "dayjs";

export const park = (params) => (dispatch, getState) =>
  new Promise(async (resolve, reject) => {
    const { parking } = getState();
    const { vehicleSize, entryPoint, plateNumber } = params;
    let map = parking.parkingMap;

    //check if plate number is existing
    let vehicle = parking.parkingMap.find((entryPoint) => {
      return entryPoint.parkingSpots.some((parkingSpot) => {
        return (
          !!parkingSpot.vehicle && parkingSpot.vehicle.toLowerCase() === plateNumber.toLowerCase()
        );
      });
    });

    if (vehicle != undefined) {
      return reject("Plate Number already exists");
    }

    //get selected entrypoint
    let selectedEntryPoint = map.find((data) => data.entryPoint === entryPoint);

    //find parking spot based on vehicle size
    let vacantSlots = selectedEntryPoint.parkingSpots.filter((data) => {
      if (vehicleSize === "L") {
        return data.timestamp === null && data.slotSize === "LP";
      }

      if (vehicleSize === "M") {
        return data.timestamp === null && data.slotSize != "SP";
      }

      return data.timestamp === null;
    });

    if (vacantSlots.length <= 0) {
      return reject("No slot available");
    }

    //check if the vehicle is in reseved vehicles
    let reservedVehicles = parking.reservedVehicles.find(
      (data) => data.vehicle.toLowerCase() === plateNumber.toLowerCase()
    );
    let timeIn = dayjs(new Date());

    if (!!reservedVehicles) {
      const oldTimeIn = dayjs(reservedVehicles.timestamp);
      let totalHours = timeIn.diff(oldTimeIn, "hour", true);

      //check if the vehicle leave lessthan an hour
      timeIn = totalHours <= 1 ? oldTimeIn : timeIn;

      if (totalHours > 1) {
        //remove vehicle if they exist 1hour period
        let newReservedVehicles = parking.reservedVehicles.filter(
          (data) => data.vehicle.toLowerCase() != plateNumber.toLowerCase()
        );

        dispatch({
          type: types.UPDATE_RESERVED_VEHICLE,
          payload: newReservedVehicles,
        });
      }
    }

    //remove update slot data
    let slot = vacantSlots[0];
    slot.vehicle = plateNumber;
    slot.timestamp = timeIn;

    resolve(
      dispatch({
        type: types.UPDATE_MAP,
        payload: map,
      })
    );
  });

export const unPark = (params) => (dispatch, getState) =>
  new Promise(async (resolve, reject) => {
    const { parking } = getState();
    const { vehicleSize, entryPoint, plateNumber, timestamp } = params;

    const fees = {
      SP: 20,
      MP: 40,
      LP: 100,
    };

    let map = parking.parkingMap;

    //get selected entrypoint
    let selectedEntryPoint = map.find((data) => data.entryPoint === entryPoint);

    //find parking spot
    let vacantSlots = selectedEntryPoint.parkingSpots.find((data) => {
      return data.vehicle != null && data.vehicle.toLowerCase() === plateNumber.toLowerCase();
    });

    vacantSlots.vehicle = null;
    vacantSlots.timestamp = null;

    const timeIn = dayjs(timestamp);
    const timeOut = dayjs(new Date());
    let totalPayment = 40;
    let totalHour = timeOut.diff(timeIn, "hour", true);

    //check if the vehicle exceed morethan 24hours
    if (totalHour >= 24) {
      let numberOfDays = Math.floor(totalHour / 24);

      //bill the vehicle depeding on days
      totalPayment = numberOfDays * 5000;
      totalHour = totalHour - numberOfDays * 24;

      if (totalHour > 0.5) {
        totalPayment += 40;
      }
    }

    //find if exists in reserved
    let reservedVehiclesIndex = parking.reservedVehicles.find(
      (data) => data.vehicle.toLowerCase() === plateNumber.toLowerCase()
    );

    //deduct
    if (!!reservedVehiclesIndex) {
      totalPayment -= reservedVehiclesIndex.totalPayment;
    }

    //additioal per hour
    if (totalHour > 3) {
      totalPayment += Math.round(totalHour - 3) * fees[vehicleSize];
    }

    if (!reservedVehiclesIndex) {
      let _reservedVehicles = [
        ...parking.reservedVehicles,
        ...[{ vehicle: plateNumber, totalPayment: totalPayment, timestamp }],
      ];

      dispatch({
        type: types.UPDATE_RESERVED_VEHICLE,
        payload: _reservedVehicles,
      });
    }

    dispatch({
      type: types.UPDATE_MAP,
      payload: map,
    });

    return resolve(totalPayment);
  });

