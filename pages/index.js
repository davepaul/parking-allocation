import React from "react";
import ParkingMap from "../components/parking/Map";
import ParkingForm from "../components/parking/Form";
import Head from "next/head";

const Parking = () => {
  return (
    <div className="max-w-[50%] mx-auto my-18">
      <Head>
        <title>Parking Allocation</title>
      </Head>
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

