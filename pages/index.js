import React from "react";
import ParkingMap from "../components/parking/Map";
import ParkingForm from "../components/parking/Form";

const Parking = () => {
  return (
    <div className="max-w-[50%] mx-auto my-18">
      <section className="sticky top-0 bg-[#000]">
        <ParkingForm />
      </section>
      <section>
        <ParkingMap />
      </section>
    </div>
  );
};

export default Parking;

