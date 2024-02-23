import React, {useState} from "react";

type User = {
  staffList: {
    _id: string;
    name: string;
    __v: number;
  }[];
};

function SimulateForm({staffList}: User) {
  console.log(staffList);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleStartDateChange = (event: any) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: any) => {
    setEndDate(event.target.value);
  };

  return (
    <div className="mb-5">
      <div className="flex gap-3">
        <div className="flex items-center gap-2">
          <p>Start Date:</p>
          <input type="date" className="appearance-none block bg-gray-200 text-gray-700 border border-gray-200 rounded p-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="start-date" value={startDate} onChange={handleStartDateChange} />
        </div>

        <br />
        <div className="flex items-center gap-2">
          <p>End Date:</p>
          <input type="date" className="appearance-none block bg-gray-200 text-gray-700 border border-gray-200 rounded p-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="end-date" value={endDate} onChange={handleEndDateChange} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <select className=" mt-4 text-xs w-2/6 appearance-none block bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
          <option value={""}>Select Staff member</option>
          {staffList && staffList.map((staff, i) => (
            <option value={staff._id}>{staff.name}</option>
          ))}
        </select>
      </div>

      <br />
      {startDate && endDate && (
        <div>
          Selected Date Range: <span className="font-bold">{startDate}</span> to <span className="font-bold">{endDate}</span>
        </div>
      )}

      <button className="bg-black p-3 rounded text-white px-6">Submit</button>
    </div>
  );
}

export default SimulateForm;
